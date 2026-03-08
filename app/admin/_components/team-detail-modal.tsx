"use client";

import { useEffect, useState } from "react";
import type { SerializedMember, SerializedTeam } from "./team-table";

type TeamDetailModalProps = {
  team: SerializedTeam;
  onClose: () => void;
  onToggleDeposit: (teamId: string, current: boolean) => Promise<void>;
  togglingDeposit: boolean;
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

const CopyInline = ({ text, label }: { text: string; label?: string }) => {
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
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
      title={`${label ?? text} 복사`}
    >
      {copied ? (
        <svg className="size-3.5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
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

const MemberCard = ({ member }: { member: SerializedMember }) => (
  <div className="rounded-md border border-border p-3 text-sm space-y-1">
    <div className="flex items-center gap-2">
      <p className="font-medium">{member.name}</p>
      {member.isLeader && (
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">대표</span>
      )}
    </div>
    <div className="flex items-center gap-1 text-muted-foreground">
      이메일: {member.email}
      <CopyInline text={member.email} label="이메일" />
    </div>
    <p className="text-muted-foreground">연락처: {member.phone}</p>
  </div>
);

export const TeamDetailModal = ({ team, onClose, onToggleDeposit, togglingDeposit }: TeamDetailModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const refundAccountText = `${team.refundBank} ${team.refundAccount} (${team.refundAccountHolder})`;
  const allMemberEmails = team.members.map((m) => m.email).join(", ");

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
            <dd className="flex items-center gap-1">
              {team.email}
              <CopyInline text={team.email} label="이메일" />
            </dd>
            <dt className="text-muted-foreground">전화번호</dt>
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
                <dd>
                  {team.teamName} ({team.members.length}명)
                </dd>
              </>
            )}
            <dt className="text-muted-foreground">경험 수준</dt>
            <dd>{experienceLevelLabel[team.experienceLevel] ?? team.experienceLevel}</dd>
          </dl>
        </section>

        {/* 팀원 목록 */}
        {team.members.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="typo-subtitle2 text-muted-foreground">
                팀원 ({team.members.length}명)
              </h3>
              <div className="flex items-center gap-1">
                <CopyInline text={allMemberEmails} label="전체 이메일" />
                <span className="text-xs text-muted-foreground">전체 복사</span>
              </div>
            </div>
            <div className="space-y-2">
              {team.members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )}

        {/* 참가비 정보 */}
        <section className="space-y-3">
          <h3 className="typo-subtitle2 text-muted-foreground">참가비 정보</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">신청자 입금 체크</dt>
            <dd>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  team.hasDeposited ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {team.hasDeposited ? "예" : "아니요"}
              </span>
            </dd>
            <dt className="text-muted-foreground">관리자 입금 확인</dt>
            <dd>
              <button
                type="button"
                onClick={() => onToggleDeposit(team.id, team.depositConfirmed)}
                disabled={togglingDeposit}
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50 ${
                  team.depositConfirmed
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                {team.depositConfirmed ? "확인 완료" : "미확인 (클릭하여 확정)"}
              </button>
            </dd>
            <dt className="text-muted-foreground">환불 계좌</dt>
            <dd className="flex items-center gap-1">
              {refundAccountText}
              <CopyInline text={refundAccountText} label="환불 계좌" />
            </dd>
          </dl>
        </section>

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
