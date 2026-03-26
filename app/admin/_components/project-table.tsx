"use client";

import { useMemo, useState } from "react";
import { ProjectDetailModal } from "./project-detail-modal";

export type SerializedProject = {
  id: string;
  title: string;
  description: string | null;
  features: string | null;
  tools: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  promptResult: string | null;
  promptFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  team: {
    id: string;
    leaderName: string;
    leaderEmail: string;
    teamName: string | null;
    participationType: string;
  };
};

type ProjectTableProps = {
  projects: SerializedProject[];
};

const PAGE_SIZE = 20;

const thClass =
  "px-2.5 py-1.5 text-left typo-caption2 font-medium text-muted-foreground whitespace-nowrap";
const tdClass = "px-2.5 py-1.5 typo-caption1";

export const ProjectTable = ({ projects: initialProjects }: ProjectTableProps) => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedProject, setSelectedProject] =
    useState<SerializedProject | null>(null);

  const handleDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.team.leaderName.toLowerCase().includes(q) ||
        p.team.leaderEmail.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="typo-subtitle2 shrink-0">프로젝트 목록</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="프로젝트명, 이름 또는 이메일 검색"
          className="max-w-xs w-full rounded-md border border-border bg-background px-2.5 py-1 typo-caption1 outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className={`${thClass} w-10`}>#</th>
              <th className={thClass}>프로젝트명</th>
              <th className={`${thClass} w-20`}>대표자</th>
              <th className={`${thClass} w-28`}>팀명</th>
              <th className={`${thClass} w-16`}>GitHub</th>
              <th className={`${thClass} w-14`}>데모</th>
              <th className={`${thClass} w-14`}>영상</th>
              <th className={`${thClass} w-14`}>기타</th>
              <th className={`${thClass} w-24`}>등록일</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-muted-foreground typo-caption1"
                >
                  {search
                    ? "검색 결과가 없습니다."
                    : "등록된 프로젝트가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((project, i) => (
                <tr
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td className={`${tdClass} text-muted-foreground`}>
                    {page * PAGE_SIZE + i + 1}
                  </td>
                  <td className={`${tdClass} font-medium truncate`}>{project.title}</td>
                  <td className={`${tdClass} text-muted-foreground`}>
                    {project.team.leaderName}
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>
                    {project.team.teamName ?? "-"}
                  </td>
                  <td className={tdClass}>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-accent hover:underline"
                      >
                        링크
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-accent hover:underline"
                      >
                        링크
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    {project.videoUrl ? (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-accent hover:underline"
                      >
                        링크
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    {project.linkUrl ? (
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-accent hover:underline"
                      >
                        링크
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td
                    className={`${tdClass} text-muted-foreground whitespace-nowrap`}
                  >
                    {new Date(project.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-md border border-border px-2.5 py-1 typo-caption1 disabled:opacity-30 cursor-pointer transition-colors hover:bg-muted"
          >
            이전
          </button>
          <span className="typo-caption1 text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md border border-border px-2.5 py-1 typo-caption1 disabled:opacity-30 cursor-pointer transition-colors hover:bg-muted"
          >
            다음
          </button>
        </div>
      )}

      {/* 상세 모달 */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
