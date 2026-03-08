"use client";

import { useMemo, useState } from "react";
import { toggleDepositConfirmed } from "@/app/actions/admin-actions";
import { TeamDetailModal } from "./team-detail-modal";

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
  BEGINNER: "비개발자/입문",
  JUNIOR: "주니어",
  SENIOR: "시니어",
  VIBE_CODER: "바이브코더",
};

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors";

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day}(${hour}:${minute})`;
};

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
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
      title={`${label ?? text} 복사`}
    >
      {copied ? (
        <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
          <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
        </svg>
      )}
    </button>
  );
};

export const TeamTable = ({ teams: initialTeams }: TeamTableProps) => {
  const [teams, setTeams] = useState(initialTeams);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<SerializedTeam | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
  }, [teams, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const allEmails = useMemo(() => {
    return teams.flatMap((t) => t.members.map((m) => m.email)).join(", ");
  }, [teams]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const toggleDepositConfirm = async (teamId: string, current: boolean) => {
    setTogglingId(teamId);
    try {
      const result = await toggleDepositConfirmed(teamId, !current);
      console.log("toggleDepositConfirmed result:", result);
      if (result.success) {
        setTeams((prev) =>
          prev.map((t) => (t.id === teamId ? { ...t, depositConfirmed: !current } : t)),
        );
        if (selectedTeam?.id === teamId) {
          setSelectedTeam((prev) => (prev ? { ...prev, depositConfirmed: !current } : prev));
        }
      }
    } catch (error) {
      console.error("toggleDepositConfirm error:", error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="typo-h6 shrink-0">신청 목록</h2>
        <div className="flex items-center gap-2">
          <CopyButton text={allEmails} label="전체 이메일" />
          <span className="text-xs text-muted-foreground">전체 이메일 복사</span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="이름 또는 이메일 검색"
            className={`max-w-xs ${inputClass}`}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">이름</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">이메일 / 연락처</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">참가유형</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">경험수준</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">팀명(인원)</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">입금확인</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">신청일시</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  {search ? "검색 결과가 없습니다." : "신청 데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((team, i) => {
                const totalMembers = team.members.length;
                const teamDisplay =
                  team.participationType === "TEAM" && team.teamName
                    ? `${team.teamName}(${totalMembers})`
                    : "-";

                return (
                  <tr
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">{page * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 font-medium">{team.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">{team.email}</span>
                        <CopyButton text={team.email} label="이메일" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{team.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          team.participationType === "TEAM"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {participationTypeLabel[team.participationType] ?? team.participationType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {experienceLevelLabel[team.experienceLevel] ?? team.experienceLevel}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{teamDisplay}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDepositConfirm(team.id, team.depositConfirmed);
                        }}
                        disabled={togglingId === team.id}
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                          team.depositConfirmed
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        } disabled:opacity-50`}
                      >
                        {team.depositConfirmed ? "확인" : "미확인"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDateTime(team.createdAt)}
                    </td>
                  </tr>
                );
              })
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
      {selectedTeam && (
        <TeamDetailModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onToggleDeposit={toggleDepositConfirm}
          togglingDeposit={togglingId === selectedTeam.id}
        />
      )}
    </div>
  );
};
