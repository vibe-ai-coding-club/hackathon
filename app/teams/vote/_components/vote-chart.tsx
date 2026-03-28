"use client";

import { useEffect, useState } from "react";

type ProjectStat = {
  id: string;
  title: string;
  teamName: string;
  voteCount: number;
  likeCount: number;
};

type VoteChartProps = {
  projects: ProjectStat[];
  allVotesUsed: boolean;
};

export const VoteChart = ({ projects }: VoteChartProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((v) => !v);
  };

  const sorted = [...projects].sort((a, b) => b.likeCount - a.likeCount);

  const maxValue = sorted[0]?.likeCount ?? 0;

  const totalLikes = projects.reduce((s, p) => s + p.likeCount, 0);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 typo-caption1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      >
        <svg
          className={`size-3.5 transition-transform ${open ? "rotate-90" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        실시간 현황
        <span className="text-muted-foreground/60">
          {totalLikes}좋아요
        </span>
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-border p-4 space-y-3">
          {/* 좋아요순 정렬 */}
          <span className="rounded-full bg-red-400 text-white px-2.5 py-0.5 typo-caption2">
            좋아요순
          </span>

          {/* 바 차트 */}
          <div className="space-y-2">
            {sorted.map((p, i) => {
              const percent =
                maxValue > 0 ? (p.likeCount / maxValue) * 100 : 0;

              return (
                <div key={p.id} className="flex items-center gap-2.5">
                  {/* 순위 */}
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full typo-caption2 font-bold ${
                      i === 0 && p.likeCount > 0
                        ? "bg-red-400 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>

                  {/* 이름 */}
                  <div className="w-28 sm:w-36 shrink-0 min-w-0">
                    <p className="typo-caption2 font-medium truncate">
                      {p.title}
                    </p>
                    <p className="typo-caption2 text-muted-foreground/60 truncate">
                      {p.teamName}
                    </p>
                  </div>

                  {/* 바 */}
                  <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-red-400"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* 좋아요 수 */}
                  <span className="typo-caption2 tabular-nums text-red-400 w-6 text-right">
                    {p.likeCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
