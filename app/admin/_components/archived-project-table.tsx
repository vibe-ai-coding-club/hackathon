"use client";

import { useMemo, useState } from "react";

export type SerializedArchivedProject = {
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
  promptFeedback: string | null;
  promptScore: number | null;
  catFeedback: string | null;
  catScore: number | null;
  isFinals: boolean;
  finalsRank: number | null;
  voteCount: number;
  likeCount: number;
  teamName: string | null;
  motivation: string | null;
  recruitmentNote: string | null;
  experienceLevel: string | null;
  members: unknown;
  originalProjectId: string | null;
  createdAt: string;
};

type ArchivedProjectTableProps = {
  projects: SerializedArchivedProject[];
};

const thClass =
  "px-2.5 py-1.5 text-left typo-caption2 font-medium text-muted-foreground whitespace-nowrap";
const tdClass = "px-2.5 py-1.5 typo-caption1 whitespace-nowrap";

type MemberInfo = { name: string; email: string; isLeader: boolean };

type SortKey = "likeCount" | "promptScore" | "catScore";
type SortDir = "asc" | "desc";

export const ArchivedProjectTable = ({
  projects,
}: ArchivedProjectTableProps) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SerializedArchivedProject | null>(
    null,
  );
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return " ↕";
    return sortDir === "desc" ? " ↓" : " ↑";
  };

  const filtered = useMemo(() => {
    let list = projects;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.teamName?.toLowerCase().includes(q) ?? false),
      );
    }
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = a[sortKey] ?? -1;
        const bv = b[sortKey] ?? -1;
        return sortDir === "desc" ? bv - av : av - bv;
      });
    }
    return list;
  }, [projects, search, sortKey, sortDir]);

  const getLeaderName = (members: unknown): string => {
    if (!Array.isArray(members)) return "-";
    const leader = members.find(
      (m: MemberInfo) => m.isLeader,
    ) as MemberInfo | undefined;
    return leader?.name ?? (members[0] as MemberInfo)?.name ?? "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="typo-subtitle2 shrink-0">아카이빙 목록</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="프로젝트명 또는 팀명 검색"
          className="max-w-xs w-full rounded-md border border-border bg-background px-2.5 py-1 typo-caption1 outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className={`${thClass} w-10`}>#</th>
              <th className={thClass}>프로젝트명</th>
              <th className={`${thClass} w-28`}>팀명</th>
              <th className={`${thClass} w-20`}>대표자</th>
              <th className={`${thClass} w-14 text-center`}>본선</th>
              <th
                className={`${thClass} w-16 text-center cursor-pointer select-none hover:text-foreground`}
                onClick={() => handleSort("likeCount")}
              >
                좋아요{sortIndicator("likeCount")}
              </th>
              <th
                className={`${thClass} w-20 text-center cursor-pointer select-none hover:text-foreground`}
                onClick={() => handleSort("promptScore")}
              >
                AI심사{sortIndicator("promptScore")}
              </th>
              <th
                className={`${thClass} w-20 text-center cursor-pointer select-none hover:text-foreground`}
                onClick={() => handleSort("catScore")}
              >
                냥심사{sortIndicator("catScore")}
              </th>
              <th className={`${thClass} w-16 text-center`}>투표</th>
              <th className={`${thClass} w-14`}>GitHub</th>
              <th className={`${thClass} w-14`}>데모</th>
              <th className={`${thClass} w-24`}>아카이빙일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-6 text-center text-muted-foreground typo-caption1"
                >
                  {search
                    ? "검색 결과가 없습니다."
                    : "아카이빙된 프로젝트가 없습니다."}
                </td>
              </tr>
            ) : (
              filtered.map((project, i) => (
                <tr
                  key={project.id}
                  onClick={() => setSelected(project)}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td className={`${tdClass} text-muted-foreground`}>
                    {i + 1}
                  </td>
                  <td className={`${tdClass} font-medium truncate max-w-48`}>
                    {project.title}
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>
                    {project.teamName ?? "-"}
                  </td>
                  <td className={`${tdClass} text-muted-foreground`}>
                    {getLeaderName(project.members)}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    {project.isFinals ? (
                      <span className="text-accent font-medium">
                        {project.finalsRank != null ? `${project.finalsRank}위` : "Y"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    {project.likeCount > 0 ? (
                      <span className="font-medium">{project.likeCount}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    {project.promptScore != null ? (
                      <span className="font-medium">{project.promptScore}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    {project.catScore != null ? (
                      <span className="font-medium">{project.catScore}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    {project.voteCount > 0 ? (
                      <span className="font-medium">{project.voteCount}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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
                  <td className={`${tdClass} text-muted-foreground`}>
                    {new Date(project.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {selected && (
        <ArchivedDetailModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

const ArchivedDetailModal = ({
  project,
  onClose,
}: {
  project: SerializedArchivedProject;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-lg border border-border bg-background">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="typo-subtitle2">{project.title}</h3>
            <p className="typo-caption2 text-muted-foreground">
              {project.teamName ?? "개인 참가"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <pre className="typo-caption2 text-foreground whitespace-pre-wrap break-all leading-relaxed">
            {JSON.stringify(project, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
