"use client";

import { useMemo, useState } from "react";
import { TeamDetailModal } from "./team-detail-modal";

export type SerializedMember = {
  id: string;
  name: string;
  contact: string;
  isLeader: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SerializedTeam = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  participationType: string;
  teamName: string | null;
  members: SerializedMember[];
  experienceLevel: string;
  motivation: string | null;
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

export const TeamTable = ({ teams }: TeamTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<SerializedTeam | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter((t) => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
  }, [teams, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="typo-h6 shrink-0">신청 목록</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="이름 또는 이메일 검색"
          className={`max-w-xs ${inputClass}`}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">이름</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">이메일</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">참가유형</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">경험수준</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">팀명</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">멤버</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">신청일</th>
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
              paged.map((team, i) => (
                <tr
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className="border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground">{page * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3 font-medium">{team.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{team.email}</td>
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
                  <td className="px-4 py-3">{experienceLevelLabel[team.experienceLevel] ?? team.experienceLevel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{team.teamName ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {team.participationType === "TEAM" ? `${team.members.filter((m) => !m.isLeader).length}명` : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(team.createdAt).toLocaleDateString("ko-KR")}
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
      {selectedTeam && <TeamDetailModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />}
    </div>
  );
};
