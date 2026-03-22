"use client";

import { useState } from "react";

type VoteResult = {
  projectId: string;
  title: string;
  teamName: string;
  voteCount: number;
  likeCount: number;
};

type SortKey = "vote" | "like";

type VoteResultsTableProps = {
  results: VoteResult[];
  totalVotes: number;
  totalLikes: number;
  presentingProjectId: string | null;
  onPresenting: (projectId: string | null) => void;
};

export const VoteResultsTable = ({
  results,
  totalVotes,
  totalLikes,
  presentingProjectId,
  onPresenting,
}: VoteResultsTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("vote");

  const sorted = [...results].sort((a, b) =>
    sortKey === "vote" ? b.voteCount - a.voteCount : b.likeCount - a.likeCount,
  );
  const maxCount =
    sortKey === "vote"
      ? (sorted[0]?.voteCount ?? 0)
      : (sorted[0]?.likeCount ?? 0);

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="typo-subtitle2">투표 · 좋아요 결과</h2>
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setSortKey("vote")}
              className={`px-2 py-0.5 typo-caption2 cursor-pointer transition-colors ${
                sortKey === "vote"
                  ? "bg-primary-400 text-white"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              투표순
            </button>
            <button
              type="button"
              onClick={() => setSortKey("like")}
              className={`px-2 py-0.5 typo-caption2 cursor-pointer transition-colors ${
                sortKey === "like"
                  ? "bg-primary-400 text-white"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              좋아요순
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="typo-caption1 text-muted-foreground">
            총 {totalVotes}표
          </span>
          <span className="typo-caption1 text-muted-foreground">
            총 {totalLikes}좋아요
          </span>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="typo-caption1 text-muted-foreground">
            등록된 프로젝트가 없습니다.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sorted.map((result, index) => {
            const isPresenting = result.projectId === presentingProjectId;
            const barValue =
              sortKey === "vote" ? result.voteCount : result.likeCount;

            return (
              <div
                key={result.projectId}
                className={`flex items-center gap-3 px-4 py-2.5 ${
                  isPresenting ? "bg-success/5" : ""
                }`}
              >
                {/* 순위 */}
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full typo-caption2 font-bold ${
                    index === 0 && barValue > 0
                      ? "bg-primary-400 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </span>

                {/* 프로젝트 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="typo-caption1 font-medium truncate">
                      {result.title}
                    </p>
                    {isPresenting && (
                      <span className="shrink-0 flex items-center gap-1 typo-caption2 text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        발표 중
                      </span>
                    )}
                  </div>
                  <p className="typo-caption2 text-muted-foreground">
                    {result.teamName}
                  </p>
                </div>

                {/* 바 */}
                <div className="hidden sm:flex items-center gap-2 w-32">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sortKey === "vote" ? "bg-primary-400" : "bg-red-400"
                      }`}
                      style={{
                        width:
                          maxCount > 0
                            ? `${(barValue / maxCount) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* 투표 수 */}
                <span className="typo-caption2 font-bold tabular-nums shrink-0 w-8 text-right">
                  {result.voteCount}표
                </span>

                {/* 좋아요 수 */}
                <span className="typo-caption2 tabular-nums shrink-0 w-10 text-right text-red-400">
                  ❤️ {result.likeCount}
                </span>

                {/* 발표 선택/해제 버튼 */}
                <button
                  type="button"
                  onClick={() =>
                    onPresenting(isPresenting ? null : result.projectId)
                  }
                  className={`shrink-0 rounded-md px-2 py-0.5 typo-caption2 font-medium cursor-pointer transition-colors ${
                    isPresenting
                      ? "bg-success/10 text-success border border-success/30 hover:bg-error/10 hover:text-error hover:border-error/30"
                      : "bg-muted text-muted-foreground border border-border hover:bg-success/10 hover:text-success hover:border-success/30"
                  }`}
                >
                  {isPresenting ? "해제" : "발표"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
