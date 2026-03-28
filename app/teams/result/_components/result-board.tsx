"use client";

import { useEffect, useState } from "react";
import { ResultTable } from "./result-table";
import { FeedbackModal } from "./feedback-modal";

export type ProjectResult = {
  id: string;
  title: string;
  description: string | null;
  promptScore: number | null;
  catScore: number | null;
  promptFeedback: string | null;
  catFeedback: string | null;
  likeCount: number;
  team: {
    teamName: string | null;
    participationType: string;
  };
};

type SortKey = "likeScore" | "promptScore" | "catScore" | "totalScore";
type SortDir = "asc" | "desc";

export const ResultBoard = () => {
  const [projects, setProjects] = useState<ProjectResult[]>([]);
  const [totalLikers, setTotalLikers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("totalScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedProject, setSelectedProject] = useState<ProjectResult | null>(
    null,
  );
  const [feedbackType, setFeedbackType] = useState<"prompt" | "cat">("prompt");
  // "projectId:prompt" 또는 "projectId:cat" 형태로 공개된 점수를 추적
  const [revealedScores, setRevealedScores] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/evaluate/results")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProjects(json.data);
          setTotalLikers(json.totalLikers ?? 0);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const getLikeScore = (p: ProjectResult): number => {
    if (totalLikers === 0) return 0;
    return p.likeCount / totalLikers;
  };

  const getScore = (p: ProjectResult, key: SortKey): number => {
    if (key === "likeScore") return getLikeScore(p);
    if (key === "totalScore")
      return getLikeScore(p) * 50 + ((p.promptScore ?? 0) / 100) * 50;
    return p[key] ?? 0;
  };

  const isRevealed = (p: ProjectResult) =>
    revealedScores.has(`${p.id}:prompt`);

  const sorted = [...projects].sort((a, b) => {
    const aRevealed = isRevealed(a);
    const bRevealed = isRevealed(b);
    // 비공개 팀은 하단 배치
    if (aRevealed !== bRevealed) return aRevealed ? -1 : 1;
    const aVal = getScore(a, sortKey);
    const bVal = getScore(b, sortKey);
    return sortDir === "desc" ? bVal - aVal : aVal - bVal;
  });

  const handleViewFeedback = (
    project: ProjectResult,
    type: "prompt" | "cat",
  ) => {
    setSelectedProject(project);
    setFeedbackType(type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="typo-body2 text-muted-foreground">
          아직 심사 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-350 px-4 py-6">
      <div className="mb-6">
        <h2 className="typo-subtitle1">심사 결과</h2>
        <p className="typo-caption1 text-muted-foreground mt-1">
          합산 = 좋아요(50점) + 기본 심사(50점). 냥심사는 별도 표기됩니다.
        </p>
      </div>

      <ResultTable
        projects={sorted}
        totalLikers={totalLikers}
        revealedScores={revealedScores}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onViewFeedback={handleViewFeedback}
        onRevealAll={() => {
          setRevealedScores((prev) => {
            const next = new Set(prev);
            for (const p of projects) {
              if (p.promptFeedback) next.add(`${p.id}:prompt`);
              if (p.catFeedback) next.add(`${p.id}:cat`);
            }
            return next;
          });
        }}
      />

      {selectedProject && (
        <FeedbackModal
          project={selectedProject}
          type={feedbackType}
          onClose={() => {
            setRevealedScores((prev) => {
              const next = new Set(prev);
              next.add(`${selectedProject.id}:${feedbackType}`);
              return next;
            });
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};
