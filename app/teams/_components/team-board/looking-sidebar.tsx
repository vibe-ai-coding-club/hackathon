"use client";

import { useTeamBoard } from "./context";
import { Tooltip } from "./tooltip";
import { experienceLevelLabel, experienceLevelStyle } from "./types";

export const LookingSidebar = () => {
  const {
    lookingForTeam,
    isInFullTeam,
    myTeam,
    myMemberId,
    lookingOpen,
    setLookingOpen,
    handleTransferClick,
  } = useTeamBoard();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-blue-400">
            {isInFullTeam
              ? "카드를 클릭하면 내 팀으로 데려옵니다"
              : "카드를 클릭하면 함께 팀이 됩니다"}
          </span>
          <Tooltip
            text={
              isInFullTeam
                ? "팀을 찾고 있는 참가자 목록입니다. 카드를 클릭하면 해당 참가자를 내 팀으로 데려올 수 있습니다."
                : "팀을 찾고 있는 참가자 목록입니다. 카드를 클릭하면 해당 참가자의 팀에 합류하여 함께 팀이 됩니다."
            }
          />
        </div>
      </div>
      <div className="rounded-lg border border-blue-300/50 bg-blue-50/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setLookingOpen((v) => !v)}
          className="flex w-full items-center justify-between p-3 cursor-pointer"
        >
          <h3 className="text-sm font-bold text-blue-600">
            팀 구해요
            <span className="ml-1 text-xs font-normal text-blue-400">
              ({lookingForTeam.length})
            </span>
          </h3>
          <svg
            className={`size-4 text-blue-400 transition-transform ${lookingOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {lookingOpen && (
          <div className="px-3 pb-3">
            {lookingForTeam.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                팀을 찾는 참가자가 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {lookingForTeam.map(({ memberId, memberName, team }) => {
                  const isMe = memberId === myMemberId;
                  const mode = isInFullTeam
                    ? ("recruit" as const)
                    : ("transfer" as const);
                  const canJoin =
                    !isMe &&
                    !team.isMyTeam &&
                    (mode === "recruit"
                      ? !!myTeam && myTeam.membersCount < myTeam.maxMembers
                      : team.membersCount < team.maxMembers);
                  return (
                    <div
                      key={memberId}
                      role={canJoin ? "button" : undefined}
                      tabIndex={canJoin ? 0 : undefined}
                      onClick={() =>
                        canJoin && handleTransferClick(team, mode)
                      }
                      onKeyDown={(e) => {
                        if (canJoin && (e.key === "Enter" || e.key === " "))
                          handleTransferClick(team, mode);
                      }}
                      className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                        isMe
                          ? "border-blue-300/50 bg-blue-50/50"
                          : canJoin
                            ? "border-border bg-background hover:border-blue-300/50 hover:bg-blue-50/30 cursor-pointer"
                            : "border-border bg-background"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-medium truncate">
                          {memberName}
                        </span>
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
                      {isMe && (
                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-1.5 py-px text-[10px] font-medium text-blue-600">
                          나
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
