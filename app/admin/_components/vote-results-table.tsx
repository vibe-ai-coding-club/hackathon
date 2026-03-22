"use client";

type VoteResult = {
  projectId: string;
  title: string;
  teamName: string;
  voteCount: number;
  likeCount: number;
};

type VoteResultsTableProps = {
  results: VoteResult[];
  totalVotes: number;
  totalLikes: number;
};

export const VoteResultsTable = ({
  results,
  totalVotes,
  totalLikes,
}: VoteResultsTableProps) => {
  const sorted = [...results].sort((a, b) => b.voteCount - a.voteCount);
  const maxVoteCount = sorted[0]?.voteCount ?? 0;

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="typo-subtitle2">투표 · 좋아요 결과</h2>
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
          {sorted.map((result, index) => (
            <div
              key={result.projectId}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              {/* 순위 */}
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full typo-caption2 font-bold ${
                  index === 0 && result.voteCount > 0
                    ? "bg-primary-400 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </span>

              {/* 프로젝트 정보 */}
              <div className="flex-1 min-w-0">
                <p className="typo-caption1 font-medium truncate">
                  {result.title}
                </p>
                <p className="typo-caption2 text-muted-foreground">
                  {result.teamName}
                </p>
              </div>

              {/* 투표 바 */}
              <div className="hidden sm:flex items-center gap-2 w-40">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-400 transition-all"
                    style={{
                      width:
                        maxVoteCount > 0
                          ? `${(result.voteCount / maxVoteCount) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* 투표 수 */}
              <span className="typo-caption1 font-bold tabular-nums w-10 text-right">
                {result.voteCount}
              </span>

              {/* 좋아요 수 */}
              <span className="typo-caption2 tabular-nums w-12 text-right text-red-400">
                ❤️ {result.likeCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
