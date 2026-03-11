"use client";

import { toggleDepositConfirmed } from "@/app/actions/admin-actions";
import { Fragment, useCallback, useMemo, useState } from "react";
import { ConfirmModal } from "./confirm-modal";

export type SerializedMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isLeader: boolean;
  refundBank: string | null;
  refundAccount: string | null;
  refundAccountHolder: string | null;
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
      className="inline-flex items-center gap-0.5 rounded px-0.5 py-px text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
      title={`${label ?? text} 복사`}
    >
      {copied ? (
        <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
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

// 일괄 복사 버튼 (라벨 포함)
const BulkCopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 typo-caption2 cursor-pointer transition-colors ${
        copied
          ? "border-success/30 bg-success/5 text-success"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {copied ? (
        <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
          <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
        </svg>
      )}
      {copied ? "복사됨" : label}
    </button>
  );
};

// 드래그 핸들 아이콘
const DragHandle = () => (
  <svg
    className="size-3.5 text-muted-foreground/50 shrink-0 cursor-grab active:cursor-grabbing"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

type DragData = { memberId: string; sourceTeamId: string; memberName: string };

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

  // 드래그 앤 드롭
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [dropTargetTeamId, setDropTargetTeamId] = useState<string | null>(null);

  // 컨펌 모달 (빈 팀 삭제)
  const [pendingTransfer, setPendingTransfer] = useState<{
    memberId: string;
    sourceTeamId: string;
    targetTeamId: string;
    memberName: string;
    sourceTeamName: string;
  } | null>(null);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      if (filters.status !== "ALL" && t.status !== filters.status) return false;
      if (
        filters.recruitmentStatus !== "ALL" &&
        t.recruitmentStatus !== filters.recruitmentStatus
      )
        return false;
      if (
        filters.experienceLevel !== "ALL" &&
        t.experienceLevel !== filters.experienceLevel
      )
        return false;
      if (
        filters.participationType !== "ALL" &&
        t.participationType !== filters.participationType
      )
        return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.email.toLowerCase().includes(q) &&
          !t.teamName?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [teams, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const allEmails = useMemo(() => {
    return filtered.flatMap((t) => t.members.map((m) => m.email)).join(", ");
  }, [filtered]);

  const leaderEmails = useMemo(() => {
    return filtered
      .map((t) => {
        const leader = t.members.find((m) => m.isLeader) ?? t.members[0];
        return leader?.email ?? t.email;
      })
      .join(", ");
  }, [filtered]);

  const toggleDeposit = async (teamId: string, current: boolean) => {
    setTogglingId(teamId);
    try {
      const result = await toggleDepositConfirmed(teamId, !current);
      if (result.success) {
        setTeams((prev) =>
          prev.map((t) =>
            t.id === teamId ? { ...t, depositConfirmed: !current } : t,
          ),
        );
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
        setTeams((ts) =>
          ts.map((t) => (t.id === teamId ? { ...t, status: prev! } : t)),
        );
      }
    } catch {
      setTeams((ts) =>
        ts.map((t) => (t.id === teamId ? { ...t, status: prev! } : t)),
      );
    }
  };

  const updateRecruitmentStatus = async (
    teamId: string,
    recruitmentStatus: string,
  ) => {
    const prev = teams.find((t) => t.id === teamId)?.recruitmentStatus;
    setTeams((ts) =>
      ts.map((t) => (t.id === teamId ? { ...t, recruitmentStatus } : t)),
    );
    try {
      const res = await fetch(`/api/admin/teams/${teamId}/recruitment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruitmentStatus }),
      });
      if (!res.ok) {
        setTeams((ts) =>
          ts.map((t) =>
            t.id === teamId ? { ...t, recruitmentStatus: prev! } : t,
          ),
        );
      }
    } catch {
      setTeams((ts) =>
        ts.map((t) =>
          t.id === teamId ? { ...t, recruitmentStatus: prev! } : t,
        ),
      );
    }
  };

  // 실제 이동 실행
  const executeTransfer = useCallback(
    async (
      memberId: string,
      targetTeamId: string,
      deleteSourceTeam?: string,
    ) => {
      try {
        const res = await fetch(`/api/admin/members/${memberId}/transfer`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetTeamId }),
        });
        if (!res.ok) return;

        // 빈 팀 삭제
        if (deleteSourceTeam) {
          await fetch(`/api/admin/teams/${deleteSourceTeam}`, {
            method: "DELETE",
          });
        }

        window.location.reload();
      } catch (error) {
        console.error("transfer error:", error);
      }
    },
    [],
  );

  // 드래그 시작
  const handleDragStart = (
    e: React.DragEvent,
    memberId: string,
    sourceTeamId: string,
    memberName: string,
  ) => {
    setDragData({ memberId, sourceTeamId, memberName });
    e.dataTransfer.effectAllowed = "move";
  };

  // 드래그 끝 (취소 포함)
  const handleDragEnd = () => {
    setDragData(null);
    setDropTargetTeamId(null);
  };

  // 드롭 영역 진입
  const handleDragOver = (e: React.DragEvent, teamId: string) => {
    if (!dragData || dragData.sourceTeamId === teamId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetTeamId(teamId);
  };

  const handleDragLeave = () => {
    setDropTargetTeamId(null);
  };

  // 드롭 실행
  const handleDrop = (e: React.DragEvent, targetTeamId: string) => {
    e.preventDefault();
    setDropTargetTeamId(null);
    if (!dragData || dragData.sourceTeamId === targetTeamId) return;

    const sourceTeam = teams.find((t) => t.id === dragData.sourceTeamId);
    if (!sourceTeam) return;

    const targetTeam = teams.find((t) => t.id === targetTeamId);
    if (targetTeam && targetTeam.members.length >= 4) return;

    // 이동 후 원래 팀이 비게 되는 경우 → 컨펌 모달
    if (sourceTeam.members.length === 1) {
      setPendingTransfer({
        memberId: dragData.memberId,
        sourceTeamId: dragData.sourceTeamId,
        targetTeamId,
        memberName: dragData.memberName,
        sourceTeamName: sourceTeam.teamName || sourceTeam.name,
      });
      setDragData(null);
      return;
    }

    executeTransfer(dragData.memberId, targetTeamId);
    setDragData(null);
  };

  // 컨펌 모달: 삭제 확인 → 이동 + 팀 삭제
  const handleConfirmDelete = () => {
    if (!pendingTransfer) return;
    executeTransfer(
      pendingTransfer.memberId,
      pendingTransfer.targetTeamId,
      pendingTransfer.sourceTeamId,
    );
    setPendingTransfer(null);
  };

  // 컨펌 모달: 취소 → 이동 취소
  const handleCancelDelete = () => {
    setPendingTransfer(null);
  };

  const thClass =
    "px-2.5 py-1.5 text-left typo-caption2 font-medium text-muted-foreground whitespace-nowrap";
  const tdClass = "px-2.5 py-1.5 typo-caption1";

  return (
    <div className="space-y-4">
      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="typo-subtitle2 shrink-0 mr-2">신청 목록</h2>

        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 typo-caption1 cursor-pointer"
        >
          <option value="ALL">상태: 전체</option>
          {Object.entries(statusLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v} ({teams.filter((t) => t.status === k).length})
            </option>
          ))}
        </select>

        <select
          value={filters.recruitmentStatus}
          onChange={(e) => updateFilter("recruitmentStatus", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 typo-caption1 cursor-pointer"
        >
          <option value="ALL">모집: 전체</option>
          {Object.entries(recruitmentLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v} ({teams.filter((t) => t.recruitmentStatus === k).length})
            </option>
          ))}
        </select>

        <select
          value={filters.experienceLevel}
          onChange={(e) => updateFilter("experienceLevel", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 typo-caption1 cursor-pointer"
        >
          <option value="ALL">경험: 전체</option>
          {Object.entries(experienceLevelLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v} ({teams.filter((t) => t.experienceLevel === k).length})
            </option>
          ))}
        </select>

        <select
          value={filters.participationType}
          onChange={(e) => updateFilter("participationType", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 typo-caption1 cursor-pointer"
        >
          <option value="ALL">유형: 전체</option>
          {Object.entries(participationTypeLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v} ({teams.filter((t) => t.participationType === k).length})
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-1.5">
          {filtered.length !== teams.length && (
            <span className="typo-caption2 text-muted-foreground mr-1">
              {filtered.length}/{teams.length}건
            </span>
          )}
          <BulkCopyButton text={leaderEmails} label="대표 이메일" />
          <BulkCopyButton text={allEmails} label="전체 이메일" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="이름/이메일/팀명 검색"
            className="w-44 rounded-md border border-border bg-background px-2.5 py-1 typo-caption1 outline-none focus:border-accent transition-colors ml-1"
          />
        </div>
      </div>

      {/* 스프레드시트형 테이블 */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className={thClass}>#</th>
              <th className={thClass}>상태</th>
              <th className={thClass}>유형</th>
              <th className={thClass}>팀이름</th>
              <th className={thClass}>이름</th>
              <th className={thClass}>이메일</th>
              <th className={thClass}>연락처</th>
              <th className={thClass}>계좌정보</th>
              <th className={thClass}>경험</th>
              <th className={thClass}>입금</th>
              <th className={thClass}>모집</th>
              <th className={thClass}>신청일</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-6 text-center text-muted-foreground typo-caption1"
                >
                  {filters.search
                    ? "검색 결과가 없습니다."
                    : "신청 데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((team, i) => {
                const leader =
                  team.members.find((m) => m.isLeader) ?? team.members[0];
                const otherMembers = team.members.filter(
                  (m) => m.id !== leader?.id,
                );
                const hasEmptySlot = team.members.length < 4;
                const totalRows =
                  1 + otherMembers.length + (hasEmptySlot ? 1 : 0);
                const isDropTarget = dropTargetTeamId === team.id;

                return (
                  <Fragment key={team.id}>
                    {/* 리더 행 */}
                    <tr className="border-b border-border/50 bg-background">
                      <td
                        className={`${tdClass} text-muted-foreground`}
                        rowSpan={totalRows}
                      >
                        {page * PAGE_SIZE + i + 1}
                      </td>
                      <td className={tdClass} rowSpan={totalRows}>
                        <select
                          value={team.status}
                          onChange={(e) =>
                            updateTeamStatus(team.id, e.target.value)
                          }
                          className={`rounded-full px-2 py-px typo-caption1 font-medium cursor-pointer border-none outline-none ${statusStyle[team.status] ?? ""}`}
                        >
                          {Object.entries(statusLabel).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={tdClass} rowSpan={totalRows}>
                        <span
                          className={`inline-block rounded-full px-2 py-px typo-caption1 font-medium ${
                            team.participationType === "TEAM"
                              ? "bg-accent/10 text-accent"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {participationTypeLabel[team.participationType] ??
                            team.participationType}
                        </span>
                      </td>
                      <td
                        className={`${tdClass} whitespace-nowrap`}
                        rowSpan={totalRows}
                        title={team.recruitmentNote ?? undefined}
                      >
                        {team.teamName || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td
                        className={`${tdClass} font-medium whitespace-nowrap`}
                      >
                        <div
                          className="flex items-center gap-1"
                          draggable
                          onDragStart={(e) =>
                            leader &&
                            handleDragStart(e, leader.id, team.id, leader.name)
                          }
                          onDragEnd={handleDragEnd}
                        >
                          <DragHandle />
                          <span>{leader?.name ?? team.name}</span>
                          <span className="typo-caption2 text-accent">(L)</span>
                        </div>
                      </td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-0.5">
                          <span className="text-muted-foreground">
                            {leader?.email ?? team.email}
                          </span>
                          <CopyButton
                            text={leader?.email ?? team.email}
                            label="이메일"
                          />
                        </div>
                      </td>
                      <td
                        className={`${tdClass} text-muted-foreground whitespace-nowrap`}
                      >
                        {leader?.phone ?? team.phone}
                      </td>
                      <td className={tdClass}>
                        {leader?.refundBank ? (
                          <div className="flex items-center gap-0.5 text-muted-foreground">
                            <span className="truncate max-w-45">
                              {leader.refundBank} {leader.refundAccount} (
                              {leader.refundAccountHolder})
                            </span>
                            <CopyButton
                              text={`${leader.refundBank} ${leader.refundAccount} (${leader.refundAccountHolder})`}
                              label="환불계좌"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </td>
                      <td className={`${tdClass} whitespace-nowrap`}>
                        {experienceLevelLabel[team.experienceLevel] ??
                          team.experienceLevel}
                      </td>
                      <td className={tdClass}>
                        <button
                          type="button"
                          onClick={() =>
                            toggleDeposit(team.id, team.depositConfirmed)
                          }
                          disabled={togglingId === team.id}
                          className={`rounded-full px-2 py-px typo-caption1 font-medium cursor-pointer transition-colors disabled:opacity-50 ${
                            team.depositConfirmed
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          }`}
                        >
                          {team.depositConfirmed ? "입금확인" : "미확인"}
                        </button>
                      </td>
                      <td className={tdClass}>
                        <select
                          value={team.recruitmentStatus}
                          onChange={(e) =>
                            updateRecruitmentStatus(team.id, e.target.value)
                          }
                          className={`rounded-full px-2 py-px typo-caption1 font-medium cursor-pointer border-none outline-none ${recruitmentStyle[team.recruitmentStatus] ?? ""}`}
                        >
                          {Object.entries(recruitmentLabel).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td
                        className={`${tdClass} text-muted-foreground whitespace-nowrap`}
                      >
                        {formatDate(team.createdAt)}
                      </td>
                    </tr>

                    {/* 멤버 행 */}
                    {otherMembers.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-border/30 bg-muted/20"
                      >
                        <td className={`${tdClass} whitespace-nowrap`}>
                          <div
                            className="flex items-center gap-1"
                            draggable
                            onDragStart={(e) =>
                              handleDragStart(e, m.id, team.id, m.name)
                            }
                            onDragEnd={handleDragEnd}
                          >
                            <DragHandle />
                            <span>{m.name}</span>
                          </div>
                        </td>
                        <td className={tdClass}>
                          <div className="flex items-center gap-0.5">
                            <span className="text-muted-foreground">
                              {m.email}
                            </span>
                            <CopyButton text={m.email} label="이메일" />
                          </div>
                        </td>
                        <td
                          className={`${tdClass} text-muted-foreground whitespace-nowrap`}
                        >
                          {m.phone}
                        </td>
                        <td className={tdClass}>
                          {m.refundBank ? (
                            <div className="flex items-center gap-0.5 text-muted-foreground">
                              <span className="truncate max-w-45">
                                {m.refundBank} {m.refundAccount} (
                                {m.refundAccountHolder})
                              </span>
                              <CopyButton
                                text={`${m.refundBank} ${m.refundAccount} (${m.refundAccountHolder})`}
                                label="환불계좌"
                              />
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40">-</span>
                          )}
                        </td>
                        <td className={tdClass} />
                        <td className={tdClass} />
                        <td className={tdClass} />
                        <td className={tdClass} />
                      </tr>
                    ))}

                    {/* 빈 슬롯 행 (드롭 영역) */}
                    {hasEmptySlot && (
                      <tr
                        className={`border-b border-border/30 transition-colors ${
                          isDropTarget
                            ? "bg-accent/10 border-accent/30"
                            : "bg-muted/10"
                        }`}
                        onDragOver={(e) => handleDragOver(e, team.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, team.id)}
                      >
                        <td
                          className={`${tdClass} typo-caption2 text-muted-foreground/40`}
                          colSpan={8}
                        >
                          {isDropTarget ? (
                            <span className="text-accent font-medium">
                              여기에 놓기
                            </span>
                          ) : (
                            `+${4 - team.members.length}명 추가 가능`
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
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

      {/* 팀 삭제 컨펌 모달 */}
      {pendingTransfer && (
        <ConfirmModal
          title="팀 삭제 확인"
          message={`"${pendingTransfer.memberName}"을(를) 이동하면 "${pendingTransfer.sourceTeamName}" 팀에 멤버가 없어집니다.\n해당 팀을 삭제하시겠습니까?`}
          confirmLabel="이동 및 팀 삭제"
          cancelLabel="취소"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
