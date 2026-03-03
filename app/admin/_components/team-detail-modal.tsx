"use client";

import { useEffect } from "react";
import type { SerializedTeam } from "./team-table";

type TeamDetailModalProps = {
  team: SerializedTeam;
  onClose: () => void;
};

const participationTypeLabel: Record<string, string> = {
  INDIVIDUAL: "개인 참여",
  TEAM: "팀 참여",
};

const experienceLevelLabel: Record<string, string> = {
  BEGINNER: "비개발자/입문",
  JUNIOR: "주니어",
  SENIOR: "시니어",
  VIBE_CODER: "바이브코더",
};

type Member = {
  name: string;
  email?: string;
  experienceLevel?: string;
};

const parseMembers = (members: unknown): Member[] => {
  if (!members) return [];
  if (Array.isArray(members)) return members as Member[];
  if (typeof members === "string") {
    try {
      return JSON.parse(members) as Member[];
    } catch {
      return [];
    }
  }
  return [];
};

export const TeamDetailModal = ({ team, onClose }: TeamDetailModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const members = parseMembers(team.members);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg border border-border bg-background p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="typo-h6">신청 상세</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-lg leading-none"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {/* 기본 정보 */}
        <section className="space-y-3">
          <h3 className="typo-subtitle2 text-muted-foreground">기본 정보</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">이름</dt>
            <dd>{team.name}</dd>
            <dt className="text-muted-foreground">이메일</dt>
            <dd>{team.email}</dd>
            <dt className="text-muted-foreground">연락처</dt>
            <dd>{team.phone}</dd>
          </dl>
        </section>

        {/* 참가 정보 */}
        <section className="space-y-3">
          <h3 className="typo-subtitle2 text-muted-foreground">참가 정보</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">참가 유형</dt>
            <dd>{participationTypeLabel[team.participationType] ?? team.participationType}</dd>
            {team.teamName && (
              <>
                <dt className="text-muted-foreground">팀명</dt>
                <dd>{team.teamName}</dd>
              </>
            )}
            <dt className="text-muted-foreground">경험 수준</dt>
            <dd>{experienceLevelLabel[team.experienceLevel] ?? team.experienceLevel}</dd>
          </dl>
        </section>

        {/* 팀원 목록 */}
        {members.length > 0 && (
          <section className="space-y-3">
            <h3 className="typo-subtitle2 text-muted-foreground">
              팀원 ({members.length}명)
            </h3>
            <div className="space-y-2">
              {members.map((member, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border p-3 text-sm space-y-1"
                >
                  <p className="font-medium">{member.name}</p>
                  {member.email && (
                    <p className="text-muted-foreground">{member.email}</p>
                  )}
                  {member.experienceLevel && (
                    <p className="text-muted-foreground">
                      {experienceLevelLabel[member.experienceLevel] ?? member.experienceLevel}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 참가 동기 */}
        {team.motivation && (
          <section className="space-y-3">
            <h3 className="typo-subtitle2 text-muted-foreground">참가 동기</h3>
            <p className="text-sm whitespace-pre-wrap">{team.motivation}</p>
          </section>
        )}

        {/* 신청 일시 */}
        <section className="space-y-3">
          <h3 className="typo-subtitle2 text-muted-foreground">신청 일시</h3>
          <p className="text-sm">
            {new Date(team.createdAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </section>
      </div>
    </div>
  );
};
