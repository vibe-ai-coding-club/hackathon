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
  team: {
    teamName: string | null;
    participationType: string;
  };
};

type SortKey = "promptScore" | "catScore" | "totalScore";
type SortDir = "asc" | "desc";

export const ResultBoard = () => {
  const [projects, setProjects] = useState<ProjectResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("promptScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedProject, setSelectedProject] = useState<ProjectResult | null>(
    null,
  );
  const [feedbackType, setFeedbackType] = useState<"prompt" | "cat">("prompt");

  useEffect(() => {
    fetch("/api/evaluate/results")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProjects(json.data);
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

  const getScore = (p: ProjectResult, key: SortKey): number => {
    if (key === "totalScore") return (p.promptScore ?? 0) + (p.catScore ?? 0);
    return p[key] ?? 0;
  };

  const sorted = [...projects].sort((a, b) => {
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
        <h2 className="typo-subtitle1">AI 심사 결과</h2>
        <p className="typo-caption1 text-muted-foreground mt-1">
          기본 심사(100점)와 냥심사(85+15점)를 분리하여 확인할 수 있습니다.
        </p>
      </div>

      <ResultTable
        projects={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onViewFeedback={handleViewFeedback}
      />

      {selectedProject && (
        <FeedbackModal
          project={selectedProject}
          type={feedbackType}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
