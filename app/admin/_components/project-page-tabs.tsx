"use client";

import { useState } from "react";
import { ProjectTable, type SerializedProject } from "./project-table";
import { ArchivedProjectTable, type SerializedArchivedProject } from "./archived-project-table";

type ProjectPageTabsProps = {
  projects: SerializedProject[];
  totalProjects: number;
  archivedProjects: SerializedArchivedProject[];
  archivedProjectIds: string[];
};

export const ProjectPageTabs = ({
  projects,
  totalProjects,
  archivedProjects,
  archivedProjectIds,
}: ProjectPageTabsProps) => {
  const [tab, setTab] = useState<"projects" | "archived">("projects");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setTab("projects")}
            className={`rounded-md px-3 py-1.5 typo-caption1 font-medium transition-colors cursor-pointer ${
              tab === "projects"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            프로젝트 ({totalProjects})
          </button>
          <button
            type="button"
            onClick={() => setTab("archived")}
            className={`rounded-md px-3 py-1.5 typo-caption1 font-medium transition-colors cursor-pointer ${
              tab === "archived"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            아카이빙 ({archivedProjects.length})
          </button>
        </div>
      </div>

      {tab === "projects" ? (
        <ProjectTable projects={projects} archivedProjectIds={archivedProjectIds} />
      ) : (
        <ArchivedProjectTable projects={archivedProjects} />
      )}
    </div>
  );
};
