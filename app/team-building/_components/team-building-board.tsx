"use client";

import { useEffect, useMemo, useState } from "react";

type Team = {
  id: string;
  leaderName: string;
  teamName: string | null;
  recruitmentNote: string | null;
  recruitmentStatus: string;
  experienceLevel: string;
  membersCount: number;
  maxMembers: number;
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

export const TeamBuildingBoard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expFilter, setExpFilter] = useState("ALL");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/team-building/teams");
        const data = await res.json();
        if (data.success) setTeams(data.teams);
      } catch {
        console.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      if (expFilter !== "ALL" && t.experienceLevel !== expFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !t.teamName?.toLowerCase().includes(q) &&
          !t.recruitmentNote?.toLowerCase().includes(q) &&
          !t.leaderName.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [teams, search, expFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <h2 className="typo-h6">팀원 모집 게시판</h2>
        <p className="typo-body3 text-muted-foreground">
          확정된 팀 중 팀원을 모집하고 있는 팀 목록입니다.
        </p>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="팀 이름, 소개글, 대표자 검색"
          className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-accent transition-colors"
        />
        <select
          value={expFilter}
          onChange={(e) => setExpFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm cursor-pointer"
        >
          <option value="ALL">경험: 전체</option>
          {Object.entries(experienceLevelLabel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length}개 팀</span>
      </div>

      {/* 카드 그리드 */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border py-16 text-center">
          <p className="text-muted-foreground">
            {teams.length === 0 ? "모집 중인 팀이 없습니다." : "검색 결과가 없습니다."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => (
            <div
              key={team.id}
              className="rounded-xl border border-border p-5 space-y-3 transition-colors hover:border-accent/30"
            >
              <div className="flex items-start justify-between">
                <h3 className="typo-subtitle1 truncate">
                  {team.teamName || team.leaderName}
                </h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  experienceLevelStyle[team.experienceLevel] ?? "bg-gray-100 text-gray-600"
                }`}>
                  {experienceLevelLabel[team.experienceLevel] ?? team.experienceLevel}
                </span>
              </div>

              {team.recruitmentNote && (
                <p className="typo-body3 text-muted-foreground line-clamp-2">
                  {team.recruitmentNote}
                </p>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="typo-caption1 text-muted-foreground">
                  {team.leaderName}
                </span>
                <span className="typo-caption1 font-medium">
                  {team.membersCount}/{team.maxMembers}명
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
