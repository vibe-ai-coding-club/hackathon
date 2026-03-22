"use client";

import { useCallback, useEffect, useState } from "react";
import { ProjectGrid } from "./project-grid";
import { PresentingProject } from "./presenting-project";

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

type VoterData = {
  memberId: string;
  name: string;
  teamId: string;
};

type Props = {
  voter: VoterData | null;
};

export const VotePage = ({ voter }: Props) => {
  const isReadOnly = !voter;

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [maxVotes, setMaxVotes] = useState(5);
  const [presentingProjectId, setPresentingProjectId] = useState<string | null>(
    null,
  );
  const [votedProjectIds, setVotedProjectIds] = useState<Set<string>>(
    new Set(),
  );
  const [likedProjectIds, setLikedProjectIds] = useState<Set<string>>(
    new Set(),
  );
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [likingProjectId, setLikingProjectId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // 프로젝트 목록 + 설정 로드
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/vote/projects");
      const json = await res.json();
      if (json.success) {
        setProjects(json.data.projects);
        setMaxVotes(json.data.maxVotes);
        setPresentingProjectId(json.data.presentingProjectId);
      }
    } catch {
      setError("프로젝트 목록을 불러올 수 없습니다.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  // 내 투표 현황 로드
  const fetchMyVotes = useCallback(async () => {
    if (!voter) return;
    try {
      const res = await fetch(`/api/vote?memberId=${voter.memberId}`);
      const json = await res.json();
      if (json.success) {
        setVotedProjectIds(new Set(json.data.votedProjectIds));
      }
    } catch {
      // silent
    }
  }, [voter]);

  // 내 좋아요 현황 로드
  const fetchMyLikes = useCallback(async () => {
    if (!voter) return;
    try {
      const res = await fetch(`/api/like?memberId=${voter.memberId}`);
      const json = await res.json();
      if (json.success) {
        setLikedProjectIds(new Set(json.data.likedProjectIds));
      }
    } catch {
      // silent
    }
  }, [voter]);

  // 초기 로드
  useEffect(() => {
    fetchProjects();
    fetchMyVotes();
    fetchMyLikes();
  }, [fetchProjects, fetchMyVotes, fetchMyLikes]);

  // 3초 폴링 — 좋아요 수 + 발표 중 프로젝트 실시간 갱신
  useEffect(() => {
    const interval = setInterval(fetchProjects, 3000);
    return () => clearInterval(interval);
  }, [fetchProjects]);

  // 투표 실행
  const handleVote = async (projectId: string) => {
    if (!voter) return;
    setLoadingProjectId(projectId);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: voter.memberId, projectId }),
      });

      const json = await res.json();
      if (json.success) {
        setVotedProjectIds((prev) => new Set([...prev, projectId]));
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, voteCount: p.voteCount + 1 } : p,
          ),
        );
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoadingProjectId(null);
    }
  };

  // 투표 취소
  const handleCancel = async (projectId: string) => {
    if (!voter) return;
    setLoadingProjectId(projectId);
    try {
      const res = await fetch("/api/vote", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: voter.memberId, projectId }),
      });

      const json = await res.json();
      if (json.success) {
        setVotedProjectIds((prev) => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, voteCount: p.voteCount - 1 } : p,
          ),
        );
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoadingProjectId(null);
    }
  };

  // 좋아요
  const handleLike = async (projectId: string) => {
    if (!voter) return;
    setLikingProjectId(projectId);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: voter.memberId, projectId }),
      });

      const json = await res.json();
      if (json.success) {
        setLikedProjectIds((prev) => new Set([...prev, projectId]));
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, likeCount: p.likeCount + 1 } : p,
          ),
        );
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLikingProjectId(null);
    }
  };

  // 좋아요 취소
  const handleUnlike = async (projectId: string) => {
    if (!voter) return;
    setLikingProjectId(projectId);
    try {
      const res = await fetch("/api/like", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: voter.memberId, projectId }),
      });

      const json = await res.json();
      if (json.success) {
        setLikedProjectIds((prev) => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, likeCount: p.likeCount - 1 } : p,
          ),
        );
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLikingProjectId(null);
    }
  };

  const remainingVotes = maxVotes - votedProjectIds.size;
  const presentingProject = presentingProjectId
    ? projects.find((p) => p.id === presentingProjectId)
    : null;
  const otherProjects = presentingProjectId
    ? projects.filter((p) => p.id !== presentingProjectId)
    : projects;

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="typo-body1 text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-20">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="typo-h4 mb-2">프로젝트 투표</h1>
        <p className="typo-body3 text-muted-foreground">
          마음에 드는 프로젝트에 투표해주세요!
        </p>
      </div>

      {/* 상태 바 */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border p-4">
        <span className="typo-body3 text-muted-foreground">
          {isReadOnly ? "관리자 (읽기 전용)" : `${voter.name}님`}
        </span>
        {!isReadOnly && (
          <>
            <div className="h-4 w-px bg-border" />
            <span className="typo-body3 text-muted-foreground">
              남은 투표:{" "}
              <strong className="text-foreground">{remainingVotes}</strong>/
              {maxVotes}
            </span>
          </>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-error/10 p-4 text-error typo-body3">
          {error}
        </div>
      )}

      {/* 발표 중 프로젝트 */}
      {presentingProject && (
        <PresentingProject
          project={presentingProject}
          isMyTeam={false}
          isVoted={votedProjectIds.has(presentingProject.id)}
          isLiked={likedProjectIds.has(presentingProject.id)}
          onVote={handleVote}
          onCancel={handleCancel}
          onLike={handleLike}
          onUnlike={handleUnlike}
          voteLoading={loadingProjectId === presentingProject.id}
          likeLoading={likingProjectId === presentingProject.id}
          isReadOnly={isReadOnly}
        />
      )}

      {/* 프로젝트 그리드 */}
      <ProjectGrid
        projects={otherProjects}
        votedProjectIds={votedProjectIds}
        likedProjectIds={likedProjectIds}
        myTeamId={voter?.teamId ?? ""}
        onVote={handleVote}
        onCancel={handleCancel}
        onLike={handleLike}
        onUnlike={handleUnlike}
        loadingProjectId={loadingProjectId}
        likingProjectId={likingProjectId}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};
