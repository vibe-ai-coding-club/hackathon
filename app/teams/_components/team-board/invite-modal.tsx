"use client";

import { useState } from "react";
import { useTeamBoard } from "./context";
import { experienceLevelLabel, experienceLevelStyle } from "./types";

export const InviteModal = () => {
  const {
    showInviteModal,
    setShowInviteModal,
    lookingForTeam,
    handleInvite,
    inviting,
    myMemberId,
  } = useTeamBoard();

  const [confirmTarget, setConfirmTarget] = useState<{
    memberId: string;
    memberName: string;
  } | null>(null);

  if (!showInviteModal) return null;

  // 자기 팀 멤버 제외 (lookingForTeam은 이미 seekingTeam=true인 멤버만 포함)
  const candidates = lookingForTeam.filter(
    (m) => m.memberId !== myMemberId && !m.team.isMyTeam,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !inviting) {
          setShowInviteModal(false);
          setConfirmTarget(null);
        }
      }}
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-5 space-y-4">
        {confirmTarget ? (
          <>
            <h3 className="typo-subtitle1">팀원 초대</h3>
            <p className="typo-body3 text-muted-foreground">
              <strong className="text-foreground">
                {confirmTarget.memberName}
              </strong>
              님을 내 팀으로 초대하시겠습니까?
            </p>
            <p className="typo-caption1 text-muted-foreground">
              해당 참가자가 내 팀에 합류합니다.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                disabled={inviting}
                className="rounded-md border border-border px-4 py-2 typo-btn4 cursor-pointer transition-colors hover:bg-muted disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => handleInvite(confirmTarget.memberId)}
                disabled={inviting}
                className="rounded-md bg-accent px-4 py-2 typo-btn4 text-white cursor-pointer transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {inviting ? "초대 중..." : "초대하기"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="typo-subtitle1">팀원 추가</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              팀을 찾고 있는 참가자 목록입니다. 클릭하여 내 팀으로 초대하세요.
            </p>
            {candidates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                팀을 찾는 참가자가 없습니다.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {candidates.map(({ memberId, memberName, team }) => (
                  <button
                    key={memberId}
                    type="button"
                    onClick={() =>
                      setConfirmTarget({ memberId, memberName })
                    }
                    className="w-full rounded-md border border-border p-3 text-left transition-colors hover:border-accent/40 hover:bg-accent/5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{memberName}</span>
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium ${
                          experienceLevelStyle[team.experienceLevel] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {experienceLevelLabel[team.experienceLevel]}
                      </span>
                    </div>
                    {team.teamName && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {team.teamName}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
