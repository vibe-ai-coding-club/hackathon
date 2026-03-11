"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { toggleDepositConfirmed } from "@/app/actions/admin-actions";

export type SerializedMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isLeader: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SerializedTeam = {
  id: string;
  name: string;
  email: string;
  phone: string;
  participationType: string;
  teamName: string | null;
  members: SerializedMember[];
  experienceLevel: string;
  motivation: string | null;
  refundBank: string;
  refundAccount: string;
  refundAccountHolder: string;
  hasDeposited: boolean;
  depositConfirmed: boolean;
  status: string;
  recruitmentStatus: string;
  recruitmentNote: string | null;
  createdAt: string;
  updatedAt: string;
};

type TeamTableProps = {
  teams: SerializedTeam[];
};

const PAGE_SIZE = 20;

const participationTypeLabel: Record<string, string> = {
  INDIVIDUAL: "개인",
  TEAM: "팀",
};

const experienceLevelLabel: Record<string, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  SENIOR: "시니어",
  VIBE_CODER: "바이브코더",
};

const statusLabel: Record<string, string> = {
  PENDING: "대기",
  CONFIRMED: "확정",
  WAITLISTED: "예비",
  REFUNDED: "환불",
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  CONFIRMED: "bg-green-100 text-green-700",
  WAITLISTED: "bg-yellow-100 text-yellow-700",
  REFUNDED: "bg-red-100 text-red-700",
};

const recruitmentLabel: Record<string, string> = {
  NOT_RECRUITING: "모집안함",
  RECRUITING: "모집중",
  CLOSED: "모집완료",
};

const recruitmentStyle: Record<string, string> = {
  NOT_RECRUITING: "bg-gray-100 text-gray-600",
  RECRUITING: "bg-blue-100 text-blue-700",
  CLOSED: "bg-gray-200 text-gray-700",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors";

const CopyButton = ({ text, label }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
      title={`${label ?? text} 복사`}
    >
      {copied ? (
        <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
          <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
        </svg>
      )}
    </button>
  );
};

// 멤버 이동 팝오버
const TransferPopover = ({
  memberId,
  currentTeamId,
  allTeams,
  onTransfer,
  onClose,
}: {
  memberId: string;
  currentTeamId: string;
  allTeams: SerializedTeam[];
  onTransfer: (memberId: string, targetTeamId: string) => Promise<void>;
  onClose: () => void;
}) => {
  const [teamSearch, setTeamSearch] = useState("");
  const [transferring, setTransferring] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const filteredTeams = allTeams.filter((t) => {
    if (t.id === currentTeamId) return false;
    if (!teamSearch.trim()) return true;
    const q = teamSearch.toLowerCase();
    return (t.teamName?.toLowerCase().includes(q) || t.name.toLowerCase().includes(q));
  });

  const handleSelect = async (targetTeamId: string) => {
    setTransferring(true);
    await onTransfer(memberId, targetTeamId);
    setTransferring(false);
    onClose();
  };

  return (
    <div ref={ref} className="absolute z-50 mt-1 w-64 rounded-lg border border-border bg-background shadow-lg">
      <div className="p-2">
        <input
          type="text"
          value={teamSearch}
          onChange={(e) => setTeamSearch(e.target.value)}
          placeholder="팀 검색..."
          className={`${inputClass} text-xs`}
          autoFocus
        />
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filteredTeams.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">결과 없음</p>
        ) : (
          filteredTeams.map((t) => {
            const isFull = t.members.length >= 4;
            return (
              <button
                key={t.id}
                type="button"
                disabled={isFull || transferring}
                onClick={() => handleSelect(t.id)}
                className="w-full px-3 py-2 text-left text-xs hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span className="font-medium">{t.teamName || t.name}</span>
                <span className="ml-1 text-muted-foreground">({t.members.length}/4)</span>
                {isFull && <span className="ml-1 text-red-500">가득 참</span>}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

type Filters = {
  status: string;
  recruitmentStatus: string;
  experienceLevel: string;
  participationType: string;
  search: string;
};

export const TeamTable = ({ teams: initialTeams }: TeamTableProps) => {
  const [teams, setTeams] = useState(initialTeams);
  const [filters, setFilters] = useState<Filters>({
    status: "ALL",
    recruitmentStatus: "ALL",
    experienceLevel: "ALL",
    participationType: "ALL",
    search: "",
  });
  const [page, setPage] = useState(0);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [transferPopover, setTransferPopover] = useState<{ memberId: string; teamId: string } | null>(null);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      if (filters.status !== "ALL" && t.status !== filters.status) return false;
      if (filters.recruitmentStatus !== "ALL" && t.recruitmentStatus !== filters.recruitmentStatus) return false;
      if (filters.experienceLevel !== "ALL" && t.experienceLevel !== filters.experienceLevel) return false;
      if (filters.participationType !== "ALL" && t.participationType !== filters.participationType) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q) && !(t.teamName?.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [teams, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const allEmails = useMemo(() => {
    return teams.flatMap((t) => t.members.map((m) => m.email)).join(", ");
  }, [teams]);

  const toggleDeposit = async (teamId: string, current: boolean) => {
    setTogglingId(teamId);
    try {
      const result = await toggleDepositConfirmed(teamId, !current);
      if (result.success) {
        setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, depositConfirmed: !current } : t)));
      }
    } catch (error) {
      console.error("toggleDeposit error:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const updateTeamStatus = async (teamId: string, status: string) => {
    const prev = teams.find((t) => t.id === teamId)?.status;
    setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, status } : t)));
    try {
      const res = await fetch(`/api/admin/teams/${teamId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, status: prev! } : t)));
      }
    } catch {
      setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, status: prev! } : t)));
    }
  };

  const updateRecruitmentStatus = async (teamId: string, recruitmentStatus: string) => {
    const prev = teams.find((t) => t.id === teamId)?.recruitmentStatus;
    setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, recruitmentStatus } : t)));
    try {
      const res = await fetch(`/api/admin/teams/${teamId}/recruitment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruitmentStatus }),
      });
      if (!res.ok) {
        setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, recruitmentStatus: prev! } : t)));
      }
    } catch {
      setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, recruitmentStatus: prev! } : t)));
    }
  };

  const transferMember = async (memberId: string, targetTeamId: string) => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}/transfer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTeamId }),
      });
      if (res.ok) {
        // 페이지 새로고침으로 데이터 동기화 (멤버 이동은 복잡한 상태 변경)
        window.location.reload();
      }
    } catch (error) {
      console.error("transferMember error:", error);
    }
  };

  const thClass = "px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap";
  const tdClass = "px-3 py-2 text-xs";

  return (
    <div className="space-y-4">
      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="typo-h6 shrink-0 mr-2">신청 목록</h2>

        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs cursor-pointer"
        >
          <option value="ALL">상태: 전체</option>
          {Object.entries(statusLabel).map(([k, v]) => (
            <option key={k} value={k}>{v} ({teams.filter((t) => t.status === k).length})</option>
          ))}
        </select>

        <select
          value={filters.recruitmentStatus}
          onChange={(e) => updateFilter("recruitmentStatus", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs cursor-pointer"
        >
          <option value="ALL">모집: 전체</option>
          {Object.entries(recruitmentLabel).map(([k, v]) => (
            <option key={k} value={k}>{v} ({teams.filter((t) => t.recruitmentStatus === k).length})</option>
          ))}
        </select>

        <select
          value={filters.experienceLevel}
          onChange={(e) => updateFilter("experienceLevel", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs cursor-pointer"
        >
          <option value="ALL">경험: 전체</option>
          {Object.entries(experienceLevelLabel).map(([k, v]) => (
            <option key={k} value={k}>{v} ({teams.filter((t) => t.experienceLevel === k).length})</option>
          ))}
        </select>

        <select
          value={filters.participationType}
          onChange={(e) => updateFilter("participationType", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs cursor-pointer"
        >
          <option value="ALL">유형: 전체</option>
          {Object.entries(participationTypeLabel).map(([k, v]) => (
            <option key={k} value={k}>{v} ({teams.filter((t) => t.participationType === k).length})</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <CopyButton text={allEmails} label="전체 이메일" />
          <span className="text-xs text-muted-foreground">전체 이메일 복사</span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="이름/이메일/팀명 검색"
            className={`w-48 ${inputClass} text-xs`}
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        총 {filtered.length}건 {filters.search || Object.values(filters).some((v) => v !== "ALL" && v !== "") ? `(전체 ${teams.length}건)` : ""}
      </div>

      {/* 스프레드시트형 테이블 */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className={thClass}>#</th>
              <th className={thClass}>상태</th>
              <th className={thClass}>이름</th>
              <th className={thClass}>이메일</th>
              <th className={thClass}>연락처</th>
              <th className={thClass}>유형</th>
              <th className={thClass}>팀이름</th>
              <th className={thClass}>멤버</th>
              <th className={thClass}>경험</th>
              <th className={thClass}>신청일</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  {filters.search ? "검색 결과가 없습니다." : "신청 데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((team, i) => (
                <>
                  {/* 1행: 주요 정보 */}
                  <tr key={team.id} className="border-b border-border/50 bg-background">
                    <td className={`${tdClass} text-muted-foreground`} rowSpan={2}>
                      {page * PAGE_SIZE + i + 1}
                    </td>
                    <td className={tdClass}>
                      <select
                        value={team.status}
                        onChange={(e) => updateTeamStatus(team.id, e.target.value)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer border-none outline-none ${statusStyle[team.status] ?? ""}`}
                      >
                        {Object.entries(statusLabel).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`${tdClass} font-medium whitespace-nowrap`}>{team.name}</td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-0.5">
                        <span className="text-muted-foreground">{team.email}</span>
                        <CopyButton text={team.email} label="이메일" />
                      </div>
                    </td>
                    <td className={`${tdClass} text-muted-foreground whitespace-nowrap`}>{team.phone}</td>
                    <td className={tdClass}>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        team.participationType === "TEAM" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                      }`}>
                        {participationTypeLabel[team.participationType] ?? team.participationType}
                      </span>
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {team.teamName || <span className="text-muted-foreground">-</span>}
                    </td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap items-center gap-1">
                        {team.members.map((m) => (
                          <span key={m.id} className="relative inline-flex items-center gap-0.5">
                            <span className={`text-xs ${m.isLeader ? "font-semibold" : ""}`}>
                              {m.name}{m.isLeader && "(L)"}
                            </span>
                            <button
                              type="button"
                              onClick={() => setTransferPopover({ memberId: m.id, teamId: team.id })}
                              className="text-muted-foreground hover:text-accent cursor-pointer transition-colors"
                              title="팀 이동"
                            >
                              <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {transferPopover?.memberId === m.id && (
                              <TransferPopover
                                memberId={m.id}
                                currentTeamId={team.id}
                                allTeams={teams}
                                onTransfer={transferMember}
                                onClose={() => setTransferPopover(null)}
                              />
                            )}
                            {i < team.members.length - 1 || m.id !== team.members[team.members.length - 1].id ? (
                              <span className="text-muted-foreground mx-0.5">&middot;</span>
                            ) : null}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {experienceLevelLabel[team.experienceLevel] ?? team.experienceLevel}
                    </td>
                    <td className={`${tdClass} text-muted-foreground whitespace-nowrap`}>
                      {formatDate(team.createdAt)}
                    </td>
                  </tr>

                  {/* 2행: 부가 정보 */}
                  <tr key={`${team.id}-sub`} className="border-b border-border bg-muted/30">
                    {/* # 컬럼은 rowSpan으로 병합됨 */}
                    <td className={tdClass}>
                      <select
                        value={team.recruitmentStatus}
                        onChange={(e) => updateRecruitmentStatus(team.id, e.target.value)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer border-none outline-none ${recruitmentStyle[team.recruitmentStatus] ?? ""}`}
                      >
                        {Object.entries(recruitmentLabel).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td className={tdClass}>
                      <button
                        type="button"
                        onClick={() => toggleDeposit(team.id, team.depositConfirmed)}
                        disabled={togglingId === team.id}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50 ${
                          team.depositConfirmed
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        {team.depositConfirmed ? "입금확인" : "미확인"}
                      </button>
                    </td>
                    <td className={tdClass} colSpan={2}>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="truncate max-w-[200px]">
                          {team.refundBank} {team.refundAccount} ({team.refundAccountHolder})
                        </span>
                        <CopyButton
                          text={`${team.refundBank} ${team.refundAccount} (${team.refundAccountHolder})`}
                          label="환불계좌"
                        />
                      </div>
                    </td>
                    <td className={tdClass} colSpan={2}>
                      {team.recruitmentNote ? (
                        <span className="text-muted-foreground truncate block max-w-[180px]" title={team.recruitmentNote}>
                          {team.recruitmentNote}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>
                    <td className={tdClass} colSpan={3}>
                      {team.motivation ? (
                        <span className="text-muted-foreground truncate block max-w-[300px]" title={team.motivation}>
                          {team.motivation}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>
                  </tr>
                </>
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
    </div>
  );
};
