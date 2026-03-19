"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Member = {
  id: string;
  name: string;
  isLeader: boolean;
};

type Project = {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string | null;
  linkUrl: string | null;
};

type Team = {
  id: string;
  leaderName: string;
  teamName: string | null;
  motivation: string | null;
  recruitmentNote: string | null;
  participationType: string;
  experienceLevel: string;
  members: Member[];
  project: Project | null;
  membersCount: number;
  maxMembers: number;
  isMyTeam: boolean;
};

const experienceLevelLabel: Record<string, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  SENIOR: "시니어",
  VIBE_CODER: "바이브코더",
};

const experienceLevelStyle: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  JUNIOR: "bg-blue-100 text-blue-700",
  SENIOR: "bg-purple-100 text-purple-700",
  VIBE_CODER: "bg-orange-100 text-orange-700",
};

// 인라인 편집 셀
const EditableCell = ({
  value,
  placeholder,
  onSave,
  className,
}: {
  value: string;
  placeholder: string;
  onSave: (val: string) => void;
  className?: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) onSave(trimmed);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={`w-full text-left cursor-text hover:bg-accent/5 rounded px-1 -mx-1 transition-colors ${className ?? ""}`}
        title="클릭하여 수정"
      >
        {value || (
          <span className="text-muted-foreground/40 italic">{placeholder}</span>
        )}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
      placeholder={placeholder}
      className={`w-full rounded border border-accent/40 bg-background px-1 -mx-1 outline-none text-sm ${className ?? ""}`}
    />
  );
};

// 프로젝트 등록/수정 모달
const ProjectModal = ({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: (project: Project) => void;
}) => {
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(project?.linkUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("프로젝트명을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/teams/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          githubUrl,
          demoUrl,
          linkUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        onSaved({
          id: project?.id ?? "",
          title: title.trim(),
          description: description.trim(),
          githubUrl: githubUrl.trim(),
          demoUrl: demoUrl.trim() || null,
          linkUrl: linkUrl.trim() || null,
        });
        onClose();
      } else {
        setError(json.message);
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-5 space-y-4">
        <h3 className="typo-subtitle1">
          {project ? "프로젝트 수정" : "프로젝트 등록"}
        </h3>

        <div>
          <label className={labelClass}>프로젝트명 *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="프로젝트 이름"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="프로젝트 설명"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>GitHub URL</label>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>데모 URL</label>
          <input
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>추가 링크</label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="발표자료, 노션 등"
            className={inputClass}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md border border-border px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-accent px-4 py-2 text-sm text-white cursor-pointer transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? "저장 중..." : project ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 외부 링크 아이콘
const LinkIcon = () => (
  <svg className="size-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

export const TeamBoard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [myMemberId, setMyMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expFilter, setExpFilter] = useState("ALL");
  const [transferTarget, setTransferTarget] = useState<Team | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams/teams");
        const data = await res.json();
        if (data.success) {
          setTeams(data.teams);
          setMyMemberId(data.myMemberId ?? null);
        }
      } catch {
        console.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filtered = useMemo(() => {
    return teams
      .filter((t) => {
        if (expFilter !== "ALL" && t.experienceLevel !== expFilter)
          return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          if (
            !t.teamName?.toLowerCase().includes(q) &&
            !t.motivation?.toLowerCase().includes(q) &&
            !t.recruitmentNote?.toLowerCase().includes(q) &&
            !t.leaderName.toLowerCase().includes(q) &&
            !t.members.some((m) => m.name.toLowerCase().includes(q))
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isMyTeam !== b.isMyTeam) return a.isMyTeam ? -1 : 1;
        const aFull = a.membersCount >= a.maxMembers ? 1 : 0;
        const bFull = b.membersCount >= b.maxMembers ? 1 : 0;
        return aFull - bFull;
      });
  }, [teams, search, expFilter]);

  const recruitingTeams = useMemo(() => {
    return teams.filter(
      (t) => t.membersCount < t.maxMembers && t.participationType === "TEAM",
    );
  }, [teams]);

  const lookingForTeam = useMemo(() => {
    return teams.filter((t) => t.participationType === "INDIVIDUAL");
  }, [teams]);

  const totalMembers = useMemo(() => {
    return filtered.reduce((sum, t) => sum + t.membersCount, 0);
  }, [filtered]);

  const myTeam = useMemo(() => teams.find((t) => t.isMyTeam), [teams]);

  const isIndividual = myTeam?.participationType === "INDIVIDUAL";
  const isInFullTeam = !!myTeam && myTeam.membersCount >= 2;

  const [recruitingOpen, setRecruitingOpen] = useState(true);
  const [lookingOpen, setLookingOpen] = useState(true);

  // 데이터 로드 후 아코디언 초기 상태 설정
  useEffect(() => {
    if (!myTeam) return;
    if (isInFullTeam) {
      setRecruitingOpen(false);
      setLookingOpen(true);
    } else if (isIndividual) {
      setRecruitingOpen(true);
      setLookingOpen(false);
    }
  }, [myTeam, isInFullTeam, isIndividual]);
  const isLeader = useMemo(() => {
    if (!myTeam || !myMemberId) return false;
    // 정상: isLeader 플래그로 판별
    const flagged = myTeam.members.some(
      (m) => m.id === myMemberId && m.isLeader,
    );
    if (flagged) return true;
    // 방어: 팀에 리더가 없으면 첫 번째 멤버를 리더로 간주
    const hasAnyLeader = myTeam.members.some((m) => m.isLeader);
    if (!hasAnyLeader && myTeam.members[0]?.id === myMemberId) return true;
    return false;
  }, [myTeam, myMemberId]);

  const handleTransferClick = (team: Team) => {
    if (team.isMyTeam) return;
    if (team.membersCount >= team.maxMembers) return;
    setTransferTarget(team);
  };

  const handleTransfer = async () => {
    if (!transferTarget) return;
    setTransferring(true);
    try {
      const res = await fetch("/api/teams/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTeamId: transferTarget.id }),
      });
      const json = await res.json();
      if (json.success) {
        window.location.reload();
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setTransferring(false);
      setTransferTarget(null);
    }
  };

  const updateMyTeam = useCallback(
    async (field: string, value: string) => {
      if (!myTeam) return;
      try {
        const res = await fetch("/api/teams/teams/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });
        const json = await res.json();
        if (json.success) {
          setTeams((prev) =>
            prev.map((t) =>
              t.id === myTeam.id ? { ...t, [field]: value || null } : t,
            ),
          );
        }
      } catch {
        console.error("Failed to update team");
      }
    },
    [myTeam],
  );

  const handleProjectSaved = useCallback(
    (project: Project) => {
      if (!myTeam) return;
      setTeams((prev) =>
        prev.map((t) => (t.id === myTeam.id ? { ...t, project } : t)),
      );
    },
    [myTeam],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  const thClass =
    "px-2.5 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap border-b border-r border-border last:border-r-0";
  const tdClass =
    "px-2.5 py-1.5 text-sm border-b border-r border-border last:border-r-0";
  const colSpanAll = 9;

  return (
    <div className="flex gap-5 px-4 py-6 max-w-350 mx-auto">
      {/* 좌측: 메인 테이블 */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="typo-subtitle2 shrink-0">팀 현황</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="팀명, 주제, 이름 검색"
            className="w-52 rounded-md border border-border bg-background px-2.5 py-1 text-sm outline-none focus:border-accent transition-colors"
          />
          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm cursor-pointer"
          >
            <option value="ALL">경험: 전체</option>
            {Object.entries(experienceLevelLabel).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          {isLeader && (
            <button
              type="button"
              onClick={() => setShowProjectModal(true)}
              className="ml-auto rounded-md bg-accent px-3 py-1 text-xs text-white cursor-pointer transition-colors hover:bg-accent-hover"
            >
              {myTeam?.project ? "프로젝트 수정" : "프로젝트 등록"}
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className={`${thClass} w-8 text-center`}></th>
                <th className={thClass}>팀명</th>
                <th className={`${thClass} min-w-50`}>주제</th>
                <th className={thClass}>
                  <span className="text-amber-600">★</span> 팀원1
                </th>
                <th className={thClass}>팀원 2</th>
                <th className={thClass}>팀원 3</th>
                <th className={thClass}>팀원 4</th>
                <th className={thClass}>프로젝트</th>
                <th className={thClass}>링크</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={colSpanAll}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    {teams.length === 0
                      ? "등록된 팀이 없습니다."
                      : "검색 결과가 없습니다."}
                  </td>
                </tr>
              ) : (
                filtered.map((team, i) => {
                  const leader =
                    team.members.find((m) => m.isLeader) ?? team.members[0];
                  const others = team.members.filter(
                    (m) => m.id !== leader?.id,
                  );
                  const canEdit = team.isMyTeam && isLeader;

                  return (
                    <tr
                      key={team.id}
                      className={`transition-colors ${
                        team.isMyTeam
                          ? "bg-accent/5"
                          : i % 2 === 1
                            ? "bg-muted/30"
                            : "bg-background"
                      }`}
                    >
                      <td
                        className={`${tdClass} text-center text-xs text-muted-foreground`}
                      >
                        {i + 1}
                      </td>
                      {/* 팀명 */}
                      <td
                        className={`${tdClass} font-medium whitespace-nowrap`}
                      >
                        <div className="flex items-center gap-1.5">
                          {canEdit ? (
                            <EditableCell
                              value={team.teamName ?? ""}
                              placeholder="팀명 입력"
                              onSave={(v) => updateMyTeam("teamName", v)}
                              className="font-medium"
                            />
                          ) : (
                            <span>{team.teamName || team.leaderName}</span>
                          )}
                          {team.isMyTeam && (
                            <span className="shrink-0 rounded-full bg-accent/10 px-1.5 py-px text-[10px] font-medium text-accent">
                              내 팀
                            </span>
                          )}
                          {!team.isMyTeam &&
                            team.membersCount < team.maxMembers && (
                              <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-px text-[10px] font-medium text-blue-600">
                                모집중
                              </span>
                            )}
                        </div>
                      </td>
                      {/* 주제 */}
                      <td
                        className={`${tdClass} text-muted-foreground max-w-70`}
                      >
                        {canEdit ? (
                          <EditableCell
                            value={team.recruitmentNote ?? ""}
                            placeholder="주제 입력"
                            onSave={(v) => updateMyTeam("recruitmentNote", v)}
                          />
                        ) : (
                          <span className="line-clamp-1">
                            {team.recruitmentNote || "-"}
                          </span>
                        )}
                      </td>
                      {/* 리더 */}
                      <td className={`${tdClass} whitespace-nowrap`}>
                        {leader ? (
                          <span
                            className={`font-medium ${
                              leader.id === myMemberId ? "text-accent" : ""
                            }`}
                          >
                            {leader.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </td>
                      {/* 팀원 2~4 */}
                      {[0, 1, 2].map((idx) => (
                        <td
                          key={idx}
                          className={`${tdClass} whitespace-nowrap`}
                        >
                          {others[idx] ? (
                            <span
                              className={
                                others[idx].id === myMemberId
                                  ? "font-medium text-accent"
                                  : ""
                              }
                            >
                              {others[idx].name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30">-</span>
                          )}
                        </td>
                      ))}
                      {/* 프로젝트 */}
                      <td className={`${tdClass} whitespace-nowrap`}>
                        {team.project ? (
                          <span
                            className="text-muted-foreground"
                            title={team.project.description}
                          >
                            {team.project.title}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                      {/* 링크 */}
                      <td className={`${tdClass} whitespace-nowrap`}>
                        {team.project ? (
                          <div className="flex items-center gap-2">
                            {team.project.githubUrl && (
                              <a
                                href={team.project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                                title="GitHub"
                              >
                                <LinkIcon />
                                GitHub
                              </a>
                            )}
                            {team.project.demoUrl && (
                              <a
                                href={team.project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                                title="데모"
                              >
                                <LinkIcon />
                                데모
                              </a>
                            )}
                            {team.project.linkUrl && (
                              <a
                                href={team.project.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                                title="추가 링크"
                              >
                                <LinkIcon />
                                기타
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-muted/50">
                  <td
                    colSpan={3}
                    className="px-2.5 py-2 text-sm font-medium border-t border-border"
                  >
                    총인원
                  </td>
                  <td
                    colSpan={colSpanAll - 3}
                    className="px-2.5 py-2 text-sm font-semibold text-right border-t border-border"
                  >
                    {totalMembers}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* 우측: 사이드바 */}
      <div className="w-56 shrink-0 space-y-3">
        {/* 팀원 구해요 */}
        <div className="rounded-lg border border-accent/30 bg-accent/5 overflow-hidden">
          <button
            type="button"
            onClick={() => setRecruitingOpen((v) => !v)}
            className="flex w-full items-center justify-between p-3 cursor-pointer"
          >
            <h3 className="text-sm font-bold text-accent">
              팀원 구해요
              <span className="ml-1 text-xs font-normal text-accent/60">
                ({recruitingTeams.length})
              </span>
            </h3>
            <svg
              className={`size-4 text-accent/60 transition-transform ${recruitingOpen ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {recruitingOpen && (
            <div className="px-3 pb-3">
              {recruitingTeams.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  모집 중인 팀이 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {recruitingTeams.map((team) => {
                    const canJoin =
                      !team.isMyTeam && team.membersCount < team.maxMembers;
                    return (
                      <div
                        key={team.id}
                        role={canJoin ? "button" : undefined}
                        tabIndex={canJoin ? 0 : undefined}
                        onClick={() => canJoin && handleTransferClick(team)}
                        onKeyDown={(e) => {
                          if (canJoin && (e.key === "Enter" || e.key === " "))
                            handleTransferClick(team);
                        }}
                        className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                          team.isMyTeam
                            ? "border-accent/30 bg-accent/5"
                            : canJoin
                              ? "border-border bg-background hover:border-accent/40 hover:bg-accent/5 cursor-pointer"
                              : "border-border bg-muted/30 opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-sm font-medium truncate">
                            {team.teamName || team.leaderName}
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium ${
                              experienceLevelStyle[team.experienceLevel] ??
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {experienceLevelLabel[team.experienceLevel]}
                          </span>
                        </div>
                        {team.isMyTeam && isLeader ? (
                          <div
                            className="mb-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EditableCell
                              value={team.recruitmentNote ?? ""}
                              placeholder="모집글 입력"
                              onSave={(v) => updateMyTeam("recruitmentNote", v)}
                              className="text-[11px] text-muted-foreground"
                            />
                          </div>
                        ) : team.recruitmentNote ? (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1">
                            {team.recruitmentNote}
                          </p>
                        ) : null}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">
                            {team.leaderName}
                          </span>
                          <span className="text-[11px] font-medium">
                            {team.membersCount}/{team.maxMembers}명
                          </span>
                        </div>
                        {team.isMyTeam && (
                          <span className="mt-1 inline-block rounded-full bg-accent/10 px-1.5 py-px text-[10px] font-medium text-accent">
                            내 팀
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 팀 구해요 */}
        <div className="rounded-lg border border-blue-300/50 bg-blue-50/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setLookingOpen((v) => !v)}
            className="flex w-full items-center justify-between p-3 cursor-pointer"
          >
            <h3 className="text-sm font-bold text-blue-600">
              팀 구해요
              <span className="ml-1 text-xs font-normal text-blue-400">
                ({lookingForTeam.length})
              </span>
            </h3>
            <svg
              className={`size-4 text-blue-400 transition-transform ${lookingOpen ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {lookingOpen && (
            <div className="px-3 pb-3">
              {lookingForTeam.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  팀을 찾는 참가자가 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {lookingForTeam.map((team) => {
                    const member = team.members[0];
                    return (
                      <div
                        key={team.id}
                        className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                          team.isMyTeam
                            ? "border-blue-300/50 bg-blue-50/50"
                            : "border-border bg-background"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-sm font-medium truncate">
                            {member?.name ?? team.leaderName}
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium ${
                              experienceLevelStyle[team.experienceLevel] ??
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {experienceLevelLabel[team.experienceLevel]}
                          </span>
                        </div>
                        {team.recruitmentNote && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {team.recruitmentNote}
                          </p>
                        )}
                        {team.isMyTeam && (
                          <span className="mt-1 inline-block rounded-full bg-blue-100 px-1.5 py-px text-[10px] font-medium text-blue-600">
                            나
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 팀 이동 컨펌 모달 */}
      {transferTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !transferring)
              setTransferTarget(null);
          }}
        >
          <div className="w-full max-w-sm rounded-lg border border-border bg-background p-5 space-y-4">
            <h3 className="typo-subtitle1">팀 이동</h3>
            <p className="typo-body3 text-muted-foreground">
              <strong className="text-foreground">
                {transferTarget.teamName || transferTarget.leaderName}
              </strong>{" "}
              팀으로 이동하시겠습니까?
            </p>
            <p className="typo-caption1 text-muted-foreground">
              현재 팀에서 나가고 선택한 팀에 합류합니다.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTransferTarget(null)}
                disabled={transferring}
                className="rounded-md border border-border px-4 py-2 typo-btn4 cursor-pointer transition-colors hover:bg-muted disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleTransfer}
                disabled={transferring}
                className="rounded-md bg-accent px-4 py-2 typo-btn4 text-white cursor-pointer transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {transferring ? "이동 중..." : "이동하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 프로젝트 등록/수정 모달 */}
      {showProjectModal && (
        <ProjectModal
          project={myTeam?.project ?? null}
          onClose={() => setShowProjectModal(false)}
          onSaved={handleProjectSaved}
        />
      )}
    </div>
  );
};
