"use client";

import { useTeamBoard } from "./context";

export const LeaveModal = () => {
  const {
    showLeaveModal,
    setShowLeaveModal,
    handleLeaveTeam,
    leaving,
    myTeam,
  } = useTeamBoard();

  if (!showLeaveModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !leaving) setShowLeaveModal(false);
      }}
    >
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-5 space-y-4">
        <h3 className="typo-subtitle1">새 팀으로 시작하기</h3>
        <p className="typo-body3 text-muted-foreground">
          <strong className="text-foreground">
            {myTeam?.teamName || myTeam?.leaderName}
          </strong>{" "}
          팀에서 나가고 1인 팀으로 새로 시작하시겠습니까?
        </p>
        <p className="typo-caption1 text-muted-foreground">
          나간 후에는 다른 팀에 합류하거나 새 팀원을 모집할 수 있습니다.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowLeaveModal(false)}
            disabled={leaving}
            className="rounded-md border border-border px-4 py-2 typo-btn4 cursor-pointer transition-colors hover:bg-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleLeaveTeam}
            disabled={leaving}
            className="rounded-md bg-error px-4 py-2 typo-btn4 text-white cursor-pointer transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {leaving ? "처리 중..." : "팀 나가기"}
          </button>
        </div>
      </div>
    </div>
  );
};
