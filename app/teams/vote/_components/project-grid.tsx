"use client";

import { ProjectCard } from "./project-card";

type ProjectData = {
  id: string;
  title: string;
  description: string;
  teamName: string;
  teamId: string;
  voteCount: number;
  likeCount: number;
  githubUrl: string;
  demoUrl: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
};

type ProjectGridProps = {
  projects: ProjectData[];
  votedProjectIds: Set<string>;
  likedProjectIds: Set<string>;
  myTeamId: string;
  onVote: (projectId: string) => void;
  onCancel: (projectId: string) => void;
  onLike: (projectId: string) => void;
  onUnlike: (projectId: string) => void;
  loadingProjectId: string | null;
  likingProjectId: string | null;
  isReadOnly?: boolean;
};

export const ProjectGrid = ({
  projects,
  votedProjectIds,
  likedProjectIds,
  myTeamId,
  onVote,
  onCancel,
  onLike,
  onUnlike,
  loadingProjectId,
  likingProjectId,
  isReadOnly,
}: ProjectGridProps) => {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="typo-body1 text-muted-foreground">
          등록된 프로젝트가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isMyTeam={myTeamId === project.teamId}
          isVoted={votedProjectIds.has(project.id)}
          isLiked={likedProjectIds.has(project.id)}
          onVote={onVote}
          onCancel={onCancel}
          onLike={onLike}
          onUnlike={onUnlike}
          voteLoading={loadingProjectId === project.id}
          likeLoading={likingProjectId === project.id}
          isReadOnly={isReadOnly}
        />
      ))}
    </div>
  );
};
