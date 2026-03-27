"use client";

import type { ProjectResult } from "./result-board";

type SortKey = "promptScore" | "catScore" | "totalScore";
type SortDir = "asc" | "desc";

type Props = {
  projects: ProjectResult[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onViewFeedback: (project: ProjectResult, type: "prompt" | "cat") => void;
};

const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
  <span className="ml-1 inline-block w-3 text-center">
    {active ? (dir === "desc" ? "▼" : "▲") : "⇅"}
  </span>
);

export const ResultTable = ({
  projects,
  sortKey,
  sortDir,
  onSort,
  onViewFeedback,
}: Props) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="typo-caption1 px-4 py-3 text-muted-foreground w-12">
              #
            </th>
            <th className="typo-caption1 px-4 py-3 text-muted-foreground">
              팀
            </th>
            <th className="typo-caption1 px-4 py-3 text-muted-foreground">
              프로젝트
            </th>
            <th
              className="typo-caption1 px-4 py-3 text-muted-foreground cursor-pointer select-none text-right hover:text-foreground transition-colors"
              onClick={() => onSort("promptScore")}
            >
              기본 심사
              <SortIcon
                active={sortKey === "promptScore"}
                dir={sortDir}
              />
            </th>
            <th
              className="typo-caption1 px-4 py-3 text-muted-foreground cursor-pointer select-none text-right hover:text-foreground transition-colors"
              onClick={() => onSort("catScore")}
            >
              냥심사
              <SortIcon active={sortKey === "catScore"} dir={sortDir} />
            </th>
            <th
              className="typo-caption1 px-4 py-3 text-muted-foreground cursor-pointer select-none text-right hover:text-foreground transition-colors"
              onClick={() => onSort("totalScore")}
            >
              합산
              <SortIcon
                active={sortKey === "totalScore"}
                dir={sortDir}
              />
            </th>
            <th className="typo-caption1 px-4 py-3 text-muted-foreground text-center">
              상세
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => {
            const total =
              (project.promptScore ?? 0) + (project.catScore ?? 0);

            return (
              <tr
                key={project.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                <td className="typo-body3 px-4 py-3 text-muted-foreground">
                  {index + 1}
                </td>
                <td className="typo-body3 px-4 py-3">
                  {project.team.teamName ?? "개인"}
                </td>
                <td className="typo-body3 px-4 py-3">
                  <div>
                    <span className="font-medium">{project.title}</span>
                    {project.description && (
                      <p className="typo-caption1 text-muted-foreground mt-0.5 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="typo-body3 px-4 py-3 text-right tabular-nums">
                  {project.promptScore !== null ? (
                    <span className="font-medium">
                      {project.promptScore}
                      <span className="text-muted-foreground">/100</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="typo-body3 px-4 py-3 text-right tabular-nums">
                  {project.catScore !== null ? (
                    <span className="font-medium">
                      {project.catScore}
                      <span className="text-muted-foreground">/15</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="typo-body3 px-4 py-3 text-right tabular-nums">
                  {project.promptScore !== null ||
                  project.catScore !== null ? (
                    <span className="font-semibold text-accent">
                      {total}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {project.promptFeedback && (
                      <button
                        type="button"
                        onClick={() => onViewFeedback(project, "prompt")}
                        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
                      >
                        기본
                      </button>
                    )}
                    {project.catFeedback && (
                      <button
                        type="button"
                        onClick={() => onViewFeedback(project, "cat")}
                        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
                      >
                        🐱
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
