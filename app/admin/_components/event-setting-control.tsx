"use client";

import { useState } from "react";

type EventSettingControlProps = {
  setting: {
    id: string;
    maxVotes: number;
    presentingProjectId: string | null;
  } | null;
  projects: {
    projectId: string;
    title: string;
    teamName: string;
  }[];
  onRefresh: () => void;
};

export const EventSettingControl = ({
  setting,
  projects,
  onRefresh,
}: EventSettingControlProps) => {
  const [maxVotes, setMaxVotes] = useState(setting?.maxVotes ?? 5);
  const presentingProjectId = setting?.presentingProjectId ?? "";
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: {
    maxVotes?: number;
    presentingProjectId?: string | null;
  }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/event-setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  const handleMaxVotesSave = () => {
    handleSave({ maxVotes });
  };

  const handlePresentingChange = (value: string) => {
    handleSave({ presentingProjectId: value || null });
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <h2 className="typo-subtitle2 mb-3">이벤트 설정</h2>

      <div className="space-y-4">
        {/* 최대 투표 수 설정 */}
        <div className="flex items-center gap-2">
          <label className="typo-caption1 text-muted-foreground">
            1인당 최대 투표 수:
          </label>
          <input
            type="number"
            value={maxVotes}
            onChange={(e) => setMaxVotes(Number(e.target.value))}
            min={1}
            max={20}
            className="w-16 rounded-md border border-border bg-background px-2 py-1 typo-caption1 text-center"
          />
          <button
            onClick={handleMaxVotesSave}
            disabled={loading}
            className="rounded-md bg-primary-400 px-3 py-1 typo-btn4 text-white hover:bg-primary-500 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {loading ? "..." : "저장"}
          </button>
        </div>

        {/* 발표 중 프로젝트 선택 */}
        <div className="flex items-center gap-2">
          <label className="typo-caption1 text-muted-foreground">
            발표 중 프로젝트:
          </label>
          <select
            value={presentingProjectId}
            onChange={(e) => handlePresentingChange(e.target.value)}
            disabled={loading}
            className="flex-1 max-w-sm rounded-md border border-border bg-background px-2 py-1 typo-caption1 disabled:opacity-50"
          >
            <option value="">없음 (선택 해제)</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.teamName} — {p.title}
              </option>
            ))}
          </select>
          {presentingProjectId && (
            <span className="flex items-center gap-1 typo-caption2 text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              발표 중
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
