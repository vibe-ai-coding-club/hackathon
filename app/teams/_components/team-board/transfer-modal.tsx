"use client";

import { useTeamBoard } from "./context";

export const TransferModal = () => {
  const {
    transferTarget,
    transferMode,
    transferring,
    handleTransfer,
    cancelTransfer,
  } = useTeamBoard();

  if (!transferTarget) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !transferring) cancelTransfer();
      }}
    >
      <div className="w-full max-w-sm rounded-lg border border-border bg-background p-5 space-y-4">
        <h3 className="typo-subtitle1">
          {transferMode === "recruit" ? "팀원 데려오기" : "팀 이동"}
        </h3>
        <p className="typo-body3 text-muted-foreground">
          {transferMode === "recruit" ? (
            <>
              <strong className="text-foreground">
                {transferTarget.members[0]?.name || transferTarget.leaderName}
              </strong>
              님을 내 팀으로 데려오시겠습니까?
            </>
          ) : (
            <>
              <strong className="text-foreground">
                {transferTarget.teamName || transferTarget.leaderName}
              </strong>{" "}
              팀으로 이동하시겠습니까?
            </>
          )}
        </p>
        <p className="typo-caption1 text-muted-foreground">
          {transferMode === "recruit"
            ? "해당 참가자가 내 팀에 합류합니다."
            : "현재 팀에서 나가고 선택한 팀에 합류합니다."}
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelTransfer}
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
            {transferring
              ? transferMode === "recruit"
                ? "데려오는 중..."
                : "이동 중..."
              : transferMode === "recruit"
                ? "데려오기"
                : "이동하기"}
          </button>
        </div>
      </div>
    </div>
  );
};
