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
  const sorted = [...results].sort((a, b) => b.likeCount - a.likeCount);
  const maxCount = sorted[0]?.likeCount ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="typo-subtitle2 text-gray-900">좋아요 결과</h2>
          <span className="rounded-full bg-red-50 text-red-500 px-2.5 py-0.5 typo-caption2 font-medium">
            좋아요순
          </span>
        </div>
        <span className="typo-caption1 text-gray-400 tabular-nums">
          총 {totalLikes}좋아요
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="typo-caption1 text-muted-foreground">
            등록된 프로젝트가 없습니다.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {sorted.map((result, index) => {
            const isPresenting = result.projectId === presentingProjectId;
            const barValue = result.likeCount;

            return (
              <div
                key={result.projectId}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isPresenting ? "bg-green-50/50" : "hover:bg-gray-50/50"
                }`}
              >
                {/* 순위 */}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full typo-caption2 font-bold ${
                    index === 0 && barValue > 0
                      ? "bg-primary-400 text-white"
                      : index === 1 && barValue > 0
                        ? "bg-gray-800 text-white"
                        : index === 2 && barValue > 0
                          ? "bg-gray-500 text-white"
                          : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {index + 1}
                </span>

                {/* 프로젝트 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="typo-caption1 font-medium truncate text-gray-900">
                      {result.title}
                    </p>
                    {isPresenting && (
                      <span className="shrink-0 flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 typo-caption2 text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        발표 중
                      </span>
                    )}
                  </div>
                  <p className="typo-caption2 text-gray-400">
                    {result.teamName}
                  </p>
                </div>

                {/* 바 */}
                <div className="hidden sm:flex items-center gap-2 w-36">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all bg-gradient-to-r from-red-400 to-primary-400"
                      style={{
                        width:
                          maxCount > 0
                            ? `${(barValue / maxCount) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* 좋아요 수 */}
                <span className="typo-caption1 font-semibold tabular-nums shrink-0 w-12 text-right text-red-400">
                  {result.likeCount}
                </span>

                {/* 발표 선택/해제 버튼 */}
                <button
                  type="button"
                  onClick={() =>
                    onPresenting(isPresenting ? null : result.projectId)
                  }
                  className={`shrink-0 rounded-lg px-2.5 py-1 typo-caption2 font-medium cursor-pointer transition-colors ${
                    isPresenting
                      ? "bg-green-50 text-success border border-green-200 hover:bg-red-50 hover:text-error hover:border-red-200"
                      : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-green-50 hover:text-success hover:border-green-200"
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
