"use client";

import { useMemo, useState } from "react";
import { ArchiveModal } from "./archive-modal";
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
  isFinals: boolean;
  adminMemo: string | null;
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
  archivedProjectIds?: string[];
};

const PAGE_SIZE = 20;

const thClass =
  "px-2.5 py-2 text-left typo-caption2 font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap";
const tdClass = "px-2.5 py-1.5 typo-caption1";

export const ProjectTable = ({ projects: initialProjects, archivedProjectIds = [] }: ProjectTableProps) => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedProject, setSelectedProject] =
    useState<SerializedProject | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const archivedSet = useMemo(() => new Set(archivedProjectIds), [archivedProjectIds]);

  const handleDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleToggleFinals = async (projectId: string, value: boolean) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, isFinals: value } : p)),
    );
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFinals: value }),
    });
  };

  const handleMemoSave = async (projectId: string, memo: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, adminMemo: memo || null } : p,
      ),
    );
    await fetch(`/api/admin/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminMemo: memo }),
    });
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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
        <h2 className="typo-subtitle2 shrink-0 text-gray-900">프로젝트 목록</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="프로젝트명, 이름 또는 이메일 검색"
          className="max-w-xs w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 typo-caption1 outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/10 transition-all"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className={`${thClass} w-10`}>#</th>
              <th className={thClass}>프로젝트명</th>
              <th className={`${thClass} w-20`}>대표자</th>
              <th className={`${thClass} w-28`}>팀명</th>
              <th className={`${thClass} w-16`}>GitHub</th>
              <th className={`${thClass} w-14`}>데모</th>
              <th className={`${thClass} w-14`}>영상</th>
              <th className={`${thClass} w-14`}>기타</th>
              <th className={`${thClass} w-14 text-center`}>본선</th>
              <th className={`${thClass} w-18 text-center`}>아카이빙</th>
              <th className={`${thClass} w-36`}>메모</th>
              <th className={`${thClass} w-24`}>등록일</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
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
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 cursor-pointer transition-colors"
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
                  <td className={`${tdClass} text-center`}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={project.isFinals}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFinals(project.id, !project.isFinals);
                      }}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer ${
                        project.isFinals
                          ? "bg-accent"
                          : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${
                          project.isFinals
                            ? "translate-x-3.5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </td>
                  <td
                    className={`${tdClass} text-center`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {archivedSet.has(project.id) ? (
                      <span className="typo-caption2 text-accent">완료</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setArchiveTarget({
                            id: project.id,
                            title: project.title,
                          })
                        }
                        className="rounded border border-border px-1.5 py-0.5 typo-caption2 text-muted-foreground cursor-pointer transition-colors hover:bg-muted hover:text-foreground"
                      >
                        저장
                      </button>
                    )}
                  </td>
                  <td className={tdClass} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      defaultValue={project.adminMemo ?? ""}
                      placeholder="메모"
                      onBlur={(e) =>
                        handleMemoSave(project.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 typo-caption2 text-muted-foreground outline-none hover:border-border focus:border-accent focus:bg-background transition-colors"
                    />
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
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 typo-caption1 disabled:opacity-30 cursor-pointer transition-colors hover:bg-gray-50"
          >
            이전
          </button>
          <span className="px-3 typo-caption1 tabular-nums text-gray-500">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 typo-caption1 disabled:opacity-30 cursor-pointer transition-colors hover:bg-gray-50"
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

      {/* 아카이빙 모달 */}
      {archiveTarget && (
        <ArchiveModal
          projectId={archiveTarget.id}
          projectTitle={archiveTarget.title}
          onClose={() => setArchiveTarget(null)}
          onArchived={() => setArchiveTarget(null)}
        />
      )}
    </div>
  );
};
