"use client";

import { useTeamBoard } from "./context";
import { EditableCell } from "./editable-cell";
import { Tooltip } from "./tooltip";
import { experienceLevelLabel, experienceLevelStyle } from "./types";

export const RecruitingSidebar = () => {
  const {
    recruitingTeams,
    isAdmin,
    recruitingOpen,
    setRecruitingOpen,
    updateTeam,
  } = useTeamBoard();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-accent/60">
            디스코드에서 팀장에게 문의하세요
          </span>
          <Tooltip text="팀원을 모집 중인 팀 목록입니다. 합류를 원하시면 디스코드에서 팀장에게 직접 문의해주세요." />
        </div>
      </div>
      <div className="rounded-lg border border-accent/30 bg-accent/5 overflow-hidden">
        <button
          type="button"
          onClick={() => setRecruitingOpen((v) => !v)}
          className="flex w-full items-center justify-between p-3 cursor-pointer"
        >
          <h3 className="text-sm font-bold text-accent">
            팀원 구해요
            <span className="ml-1 text-xs font-normal text-accent/60">
              ({recruitingTeams.length})
            </span>
          </h3>
          <svg
            className={`size-4 text-accent/60 transition-transform ${recruitingOpen ? "rotate-180" : ""}`}
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
        {recruitingOpen && (
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
                        ? "border-accent/30 bg-accent/5"
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
                      <span className="mt-1 inline-block rounded-full bg-accent/10 px-1.5 py-px text-[10px] font-medium text-accent">
                        내 팀
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
