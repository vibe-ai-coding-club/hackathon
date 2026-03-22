"use client";

type ProjectCardProps = {
  project: {
    id: string;
    title: string;
    description: string;
    teamName: string;
    voteCount: number;
    likeCount: number;
    githubUrl: string;
    demoUrl: string | null;
    linkUrl: string | null;
  };
  isMyTeam: boolean;
  isVoted: boolean;
  isLiked: boolean;
  onVote: (projectId: string) => void;
  onCancel: (projectId: string) => void;
  onLike: (projectId: string) => void;
  onUnlike: (projectId: string) => void;
  voteLoading: boolean;
  likeLoading: boolean;
  isReadOnly?: boolean;
};

export const ProjectCard = ({
  project,
  isMyTeam,
  isVoted,
  isLiked,
  onVote,
  onCancel,
  onLike,
  onUnlike,
  voteLoading,
  likeLoading,
  isReadOnly,
}: ProjectCardProps) => {
  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all ${
        isVoted
          ? "border-primary-400 bg-primary-025 shadow-sm"
          : isMyTeam
            ? "border-border bg-muted/50"
            : "border-border hover:border-primary-200 hover:shadow-sm"
      }`}
    >
      {/* 내 팀 뱃지 */}
      {isMyTeam && (
        <span className="absolute top-3 right-3 rounded-full bg-gray-200 px-2.5 py-0.5 typo-caption2 text-gray-700">
          내 팀
        </span>
      )}

      {/* 투표 완료 뱃지 */}
      {isVoted && (
        <span className="absolute top-3 right-3 rounded-full bg-primary-400 px-2.5 py-0.5 typo-caption2 text-white">
          투표 완료
        </span>
      )}

      {/* 팀명 */}
      <p className="typo-caption1 text-muted-foreground mb-1">
        {project.teamName}
      </p>

      {/* 프로젝트명 */}
      <h3 className="typo-subtitle1 mb-2 line-clamp-1">{project.title}</h3>

      {/* 설명 */}
      <p className="typo-body3 text-muted-foreground mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* 링크 */}
      <div className="flex gap-2 mb-4">
        {project.linkUrl && (
          <a
            href={project.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="typo-caption1 text-primary-400 hover:underline"
          >
            데모
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="typo-caption1 text-primary-400 hover:underline"
          >
            발표자료
          </a>
        )}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="typo-caption1 text-primary-400 hover:underline"
        >
          GitHub
        </a>
      </div>

      {/* 좋아요 + 투표 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 좋아요 */}
          {isReadOnly ? (
            <span className="flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 typo-caption1 text-gray-600">
              <span>❤️</span>
              <span className="tabular-nums font-bold">
                {project.likeCount}
              </span>
            </span>
          ) : (
            <button
              onClick={() =>
                isLiked ? onUnlike(project.id) : onLike(project.id)
              }
              disabled={likeLoading}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 typo-caption1 transition-colors cursor-pointer disabled:opacity-50 ${
                isLiked
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
              }`}
            >
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span className="tabular-nums font-bold">
                {project.likeCount}
              </span>
            </button>
          )}

          {/* 투표 수 */}
          <span className="typo-caption1 text-muted-foreground">
            {project.voteCount}표
          </span>
        </div>

        {/* 투표 버튼 */}
        {!isReadOnly && !isMyTeam && (
          <>
            {isVoted ? (
              <button
                onClick={() => onCancel(project.id)}
                disabled={voteLoading}
                className="rounded-lg border border-primary-400 px-4 py-2 typo-btn4 text-primary-400 hover:bg-primary-025 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {voteLoading ? "처리 중..." : "투표 취소"}
              </button>
            ) : (
              <button
                onClick={() => onVote(project.id)}
                disabled={voteLoading}
                className="rounded-lg bg-primary-400 px-4 py-2 typo-btn4 text-white hover:bg-primary-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {voteLoading ? "처리 중..." : "투표하기"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
