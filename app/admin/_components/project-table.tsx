"use client";

import { useState, useMemo } from "react";
import { ProjectDetailModal } from "./project-detail-modal";

export type SerializedProject = {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  createdAt: string;
  updatedAt: string;
  team: {
    id: string;
    name: string;
    email: string;
    teamName: string | null;
    participationType: string;
  };
};

type ProjectTableProps = {
  projects: SerializedProject[];
};

const PAGE_SIZE = 20;

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors";

export const ProjectTable = ({ projects }: ProjectTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<SerializedProject | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.team.name.toLowerCase().includes(q) ||
        p.team.email.toLowerCase().includes(q),
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
        <h2 className="typo-h6 shrink-0">프로젝트 목록</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="프로젝트명, 이름 또는 이메일 검색"
          className={`max-w-xs ${inputClass}`}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">프로젝트명</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">대표자</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">팀명</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">GitHub</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">데모</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">등록일</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  {search ? "검색 결과가 없습니다." : "등록된 프로젝트가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((project, i) => (
                <tr
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {page * PAGE_SIZE + i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{project.team.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {project.team.teamName ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-accent hover:underline"
                    >
                      링크
                    </a>
                  </td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
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
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-30 cursor-pointer transition-colors hover:bg-muted"
          >
            이전
          </button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-30 cursor-pointer transition-colors hover:bg-muted"
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
        />
      )}
    </div>
  );
};
