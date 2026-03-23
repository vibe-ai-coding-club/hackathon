"use client";

import { useTeamBoard } from "./context";
import { experienceLevelLabel, experienceLevelStyle } from "./types";

export const ProfileCard = () => {
  const {
    myProfile,
    myTeam,
    myMemberId,
    isLeader,
    isInFullTeam,
    toggleRecruiting,
    toggleSeeking,
    setShowLeaveModal,
  } = useTeamBoard();

  if (!myProfile || !myTeam) return null;

  const myMember = myTeam.members.find((m) => m.id === myMemberId);

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        {/* 프로필 정보 */}
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold">{myProfile.name}</h3>
          <span className="text-sm text-muted-foreground">
            {myProfile.email}
          </span>
          <span className="text-sm text-muted-foreground">
            {myProfile.phone}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              experienceLevelStyle[myProfile.experienceLevel] ??
              "bg-gray-100 text-gray-600"
            }`}
          >
            {experienceLevelLabel[myProfile.experienceLevel] ??
              myProfile.experienceLevel}
          </span>
        </div>

        {/* 정보 구성 자유롭게 */}
        <span className="text-[11px] text-muted-foreground/60">
          팀에 소속된 참여자에게만 보임
        </span>
      </div>

      <div className="mt-3 flex items-center gap-6 text-sm">
        {/* 소속 팀 */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">소속 팀:</span>
          <span className="font-medium">
            {myTeam.teamName || myTeam.leaderName}
          </span>
          {isInFullTeam && (
            <button
              type="button"
              onClick={() => setShowLeaveModal(true)}
              className="rounded-md border border-red-200 px-2 py-0.5 text-xs text-red-500 cursor-pointer transition-colors hover:bg-red-50"
            >
              팀 나가기
            </button>
          )}
        </div>

        {/* 소속 팀 상태 (리더만 수정) */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">소속 팀 상태:</span>
          {isLeader && myTeam.membersCount < myTeam.maxMembers ? (
            <button
              type="button"
              onClick={() => toggleRecruiting(myTeam.id, !myTeam.recruiting)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                myTeam.recruiting
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {myTeam.recruiting ? "팀원 모집중" : "팀원 확정"}
            </button>
          ) : (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                myTeam.recruiting
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {myTeam.recruiting ? "팀원 모집중" : "팀원 확정"}
            </span>
          )}
        </div>

        {/* 내 상태 */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">내 상태:</span>
          <button
            type="button"
            onClick={() => toggleSeeking(!myMember?.seekingTeam)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
              myMember?.seekingTeam
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {myMember?.seekingTeam ? "팀 찾는중" : "팀 확정"}
          </button>
        </div>
      </div>
    </div>
  );
};
