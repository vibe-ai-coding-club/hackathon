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
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="typo-subtitle2 mb-3 text-gray-900">이벤트 설정</h2>

      <div className="space-y-4">
        {/* 발표 중 프로젝트 선택 */}
        <div className="flex items-center gap-2">
          <label className="typo-caption1 text-gray-500">
            발표 중 프로젝트:
          </label>
          <select
            value={presentingProjectId}
            onChange={(e) => handlePresentingChange(e.target.value)}
            disabled={loading}
            className="flex-1 max-w-sm rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 typo-caption1 disabled:opacity-50 transition-colors hover:border-gray-300"
          >
            <option value="">없음 (선택 해제)</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.teamName} — {p.title}
              </option>
            ))}
          </select>
          {presentingProjectId && (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 typo-caption2 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              발표 중
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
