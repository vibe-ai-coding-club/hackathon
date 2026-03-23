"use client";

import { useTeamBoard } from "./context";
import { EditableCell } from "./editable-cell";
import { experienceLevelLabel, experienceLevelStyle } from "./types";

export const TeamBuildingSidebar = () => {
  const { recruitingTeams, lookingForTeam, isAdmin, myMemberId, updateTeam } =
    useTeamBoard();

  return (
    <div className="space-y-3">
      {/* 팀 빌딩 안내 */}
      <div className="rounded-lg border border-border bg-background p-4">
        <h3 className="text-sm font-bold mb-2">팀 빌딩 안내</h3>
        <ul className="space-y-1 text-[12px] text-muted-foreground list-disc pl-4">
          <li>
            <span className="font-medium text-foreground">
              [디스코드 - 팀빌딩 채널]
            </span>
            에서 함께 할 팀, 팀원을 찾고 연락하세요!
          </li>
          <li>상호 협의 진행 후 팀원을 등록해주세요.</li>
          <li>팀원 등록은 팀장만 할 수 있어요.</li>
        </ul>
      </div>

      {/* 팀원 모집중 */}
      <div className="rounded-lg border border-pink-300/50 bg-pink-50/50 overflow-hidden">
        <div className="p-3">
          <h3 className="text-sm font-bold text-pink-600">
            팀원 모집중
            <span className="ml-1 text-xs font-normal text-pink-400">
              ({recruitingTeams.length})
            </span>
          </h3>
          <p className="text-[11px] text-pink-400 mt-0.5">
            함께하고싶다면 팀장에게 DM으로 연락해보세요!
          </p>
        </div>
        <div className="px-3 pb-3">
          {recruitingTeams.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">
              모집 중인 팀이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {recruitingTeams.map((team) => (
                <div
                  key={team.id}
                  className={`w-full rounded-md border p-2.5 text-left ${
                    team.isMyTeam
                      ? "border-pink-300/30 bg-pink-50/30"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-medium truncate">
                      {team.teamName || team.leaderName}
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
                  {isAdmin || team.isMyTeam ? (
                    <div className="mb-1">
                      <EditableCell
                        value={team.recruitmentNote ?? ""}
                        placeholder="주제 입력"
                        onSave={(v) =>
                          updateTeam(team.id, "recruitmentNote", v)
                        }
                        className="w-full text-[11px] text-muted-foreground"
                      />
                    </div>
                  ) : team.recruitmentNote ? (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1">
                      {team.recruitmentNote}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {team.leaderName}
                    </span>
                    <span className="text-[11px] font-medium">
                      {team.membersCount}/{team.maxMembers}명
                    </span>
                  </div>
                  {team.isMyTeam && (
                    <span className="mt-1 inline-block rounded-full bg-pink-100 px-1.5 py-px text-[10px] font-medium text-pink-600">
                      내 팀
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 팀 찾는중 */}
      <div className="rounded-lg border border-blue-300/50 bg-blue-50/50 overflow-hidden">
        <div className="p-3">
          <h3 className="text-sm font-bold text-blue-600">
            팀 찾는중
            <span className="ml-1 text-xs font-normal text-blue-400">
              ({lookingForTeam.length})
            </span>
          </h3>
          <p className="text-[11px] text-blue-400 mt-0.5">
            함께하고 싶다면 디스코드 DM으로 연락해보세요!
          </p>
        </div>
        <div className="px-3 pb-3">
          {lookingForTeam.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">
              팀을 찾는 참가자가 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {lookingForTeam.map(({ memberId, memberName, team }) => {
                const isMe = memberId === myMemberId;

                return (
                  <div
                    key={memberId}
                    className={`w-full rounded-md border p-2.5 text-left ${
                      isMe
                        ? "border-blue-300/50 bg-blue-50/50"
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
      </div>
    </div>
  );
};
