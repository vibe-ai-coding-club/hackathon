"use client";

type VoteResult = {
  projectId: string;
  title: string;
  teamName: string;
  voteCount: number;
};

type VoteResultsTableProps = {
  results: VoteResult[];
  totalVotes: number;
};

export const VoteResultsTable = ({ results, totalVotes }: VoteResultsTableProps) => {
  // 투표 수 기준 내림차순 정렬
  const sorted = [...results].sort((a, b) => b.voteCount - a.voteCount);
  const maxVoteCount = sorted[0]?.voteCount ?? 0;

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="typo-subtitle1">투표 결과</h2>
        <span className="typo-body3 text-muted-foreground">총 {totalVotes}표</span>
      </div>

      {sorted.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="typo-body3 text-muted-foreground">등록된 프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sorted.map((result, index) => (
            <div key={result.projectId} className="flex items-center gap-4 px-6 py-4">
              {/* 순위 */}
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full typo-caption1 font-bold ${
                  index === 0 && result.voteCount > 0
                    ? "bg-primary-400 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </span>

              {/* 프로젝트 정보 */}
              <div className="flex-1 min-w-0">
                <p className="typo-subtitle4 truncate">{result.title}</p>
                <p className="typo-caption1 text-muted-foreground">{result.teamName}</p>
              </div>

              {/* 투표 바 */}
              <div className="hidden sm:flex items-center gap-3 w-48">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-400 transition-all"
                    style={{
                      width: maxVoteCount > 0 ? `${(result.voteCount / maxVoteCount) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>

              {/* 투표 수 */}
              <span className="typo-subtitle2 tabular-nums w-12 text-right">
                {result.voteCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
