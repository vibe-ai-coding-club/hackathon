"use client";

import { useState } from "react";

type VoteSessionControlProps = {
  session: {
    id: string;
    isActive: boolean;
    maxVotes: number;
    startedAt: string | null;
    endedAt: string | null;
  } | null;
  onRefresh: () => void;
};

export const VoteSessionControl = ({ session, onRefresh }: VoteSessionControlProps) => {
  const [maxVotes, setMaxVotes] = useState(session?.maxVotes ?? 5);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "start" | "stop") => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vote-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, maxVotes }),
      });

      const json = await res.json();
      if (json.success) {
        onRefresh();
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const isActive = session?.isActive ?? false;

  return (
    <div className="rounded-lg border border-border p-4">
      <h2 className="typo-subtitle2 mb-3">투표 세션 관리</h2>

      <div className="space-y-3">
        {/* 현재 상태 */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-success animate-pulse" : "bg-gray-300"}`}
          />
          <span className="typo-caption1">
            {isActive ? "투표 진행 중" : "투표 비활성"}
          </span>
          {session?.startedAt && (
            <span className="typo-caption2 text-muted-foreground">
              시작: {new Date(session.startedAt).toLocaleString("ko-KR")}
            </span>
          )}
          {session?.endedAt && !isActive && (
            <span className="typo-caption2 text-muted-foreground">
              종료: {new Date(session.endedAt).toLocaleString("ko-KR")}
            </span>
          )}
        </div>

        {/* 최대 투표 수 설정 */}
        <div className="flex items-center gap-2">
          <label className="typo-caption1 text-muted-foreground">1인당 최대 투표 수:</label>
          <input
            type="number"
            value={maxVotes}
            onChange={(e) => setMaxVotes(Number(e.target.value))}
            min={1}
            max={20}
            disabled={isActive}
            className="w-16 rounded-md border border-border bg-background px-2 py-1 typo-caption1 text-center disabled:opacity-50"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          {!isActive ? (
            <button
              onClick={() => handleAction("start")}
              disabled={loading}
              className="rounded-md bg-success px-4 py-1.5 typo-btn4 text-white hover:opacity-90 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loading ? "처리 중..." : "투표 시작"}
            </button>
          ) : (
            <button
              onClick={() => handleAction("stop")}
              disabled={loading}
              className="rounded-md bg-error px-4 py-1.5 typo-btn4 text-white hover:opacity-90 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loading ? "처리 중..." : "투표 종료"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
