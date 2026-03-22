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
  const sorted = [...results].sort((a, b) => b.voteCount - a.voteCount);
  const maxVoteCount = sorted[0]?.voteCount ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
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
        <div className="py-8 text-center">
          <p className="typo-caption1 text-muted-foreground">
            등록된 프로젝트가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {sorted.map((result, index) => {
            const isPresenting = result.projectId === presentingProjectId;

            return (
              <div
                key={result.projectId}
                className={`rounded-lg border p-3 transition-colors ${
                  isPresenting
                    ? "border-success/40 bg-success/5"
                    : "border-border"
                }`}
              >
                {/* 상단: 순위 + 제목 + 발표 버튼 */}
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full typo-caption2 font-bold ${
                      index === 0 && result.voteCount > 0
                        ? "bg-primary-400 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
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
                    <p className="typo-caption2 text-muted-foreground truncate">
                      {result.teamName}
                    </p>
                  </div>
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

                {/* 하단: 투표 바 + 수치 */}
                <div className="flex items-center gap-2">
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
                  <span className="typo-caption2 font-bold tabular-nums shrink-0">
                    {result.voteCount}표
                  </span>
                  <span className="typo-caption2 tabular-nums shrink-0 text-red-400">
                    ❤️ {result.likeCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
