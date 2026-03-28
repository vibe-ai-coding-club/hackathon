"use client";

import { useCallback, useEffect, useState } from "react";
import { ProjectGrid } from "./project-grid";
import { PresentingProject } from "./presenting-project";
import { VoteChart } from "./vote-chart";

type ProjectData = {
  id: string;
  title: string;
  description: string;
  teamName: string;
  teamId: string;
  voteCount: number;
  likeCount: number;
  isFinals: boolean;
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
  const [finalsOnly, setFinalsOnly] = useState(true);

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
  // 좋아요/투표 처리 중에는 폴링 스킵 (낙관적 업데이트 덮어쓰기 방지)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!likingProjectId && !loadingProjectId) {
        fetchProjects();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchProjects, likingProjectId, loadingProjectId]);

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
            p.id === projectId ? { ...p, voteCount: Math.max(0, p.voteCount - 1) } : p,
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
            p.id === projectId ? { ...p, likeCount: Math.max(0, p.likeCount - 1) } : p,
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
  const visibleProjects = finalsOnly
    ? projects.filter((p) => p.isFinals)
    : projects;
  const presentingProject = presentingProjectId
    ? visibleProjects.find((p) => p.id === presentingProjectId)
    : null;
  const otherProjects = presentingProjectId
    ? visibleProjects.filter((p) => p.id !== presentingProjectId)
    : visibleProjects;

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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="typo-h4 mb-2">프로젝트 좋아요</h1>
          <p className="typo-body3 text-muted-foreground">
            마음에 드는 프로젝트에 좋아요를 눌러주세요!
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer shrink-0 mt-1">
          <span className="typo-caption1 text-muted-foreground">
            본선 진출만
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={finalsOnly}
            onClick={() => setFinalsOnly((v) => !v)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
              finalsOnly ? "bg-accent" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                finalsOnly ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      {/* 상태 바 */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border p-4">
        <span className="typo-body3 text-muted-foreground">
          {isReadOnly ? "관리자 (읽기 전용)" : `${voter.name}님`}
        </span>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-error/10 p-4 text-error typo-body3">
          {error}
        </div>
      )}

      {/* 실시간 현황 그래프 */}
      {visibleProjects.length > 0 && (
        <VoteChart
          projects={visibleProjects}
          allVotesUsed={!isReadOnly && remainingVotes <= 0}
        />
      )}

      {/* 발표 중 프로젝트 */}
      {presentingProject && (
        <PresentingProject
          project={presentingProject}
          isMyTeam={voter?.teamId === presentingProject.teamId}
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
