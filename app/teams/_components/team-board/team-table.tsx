"use client";

import { useTeamBoard } from "./context";
import { EditableCell } from "./editable-cell";
import { experienceLevelLabel } from "./types";

const LinkIcon = () => (
  <svg className="size-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

const thClass =
  "px-2.5 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap border-b border-r border-border last:border-r-0";
const tdClass =
  "px-2.5 py-1.5 text-sm border-b border-r border-border last:border-r-0";
const colSpanAll = 9;

export const TeamTable = ({
  onShowAiPrompt,
}: {
  onShowAiPrompt: () => void;
}) => {
  const {
    teams,
    filtered,
    totalMembers,
    myMemberId,
    isAdmin,
    myTeam,
    search,
    setSearch,
    expFilter,
    setExpFilter,
    setShowProjectModal,
    updateTeam,
    toggleRecruiting,
    toggleSeeking,
    isInFullTeam,
    setShowLeaveModal,
  } = useTeamBoard();

  return (
    <div className="flex-1 min-w-0 space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="typo-subtitle2 shrink-0">팀 현황</h2>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="팀명, 주제, 이름 검색"
          className="w-52 rounded-md border border-border bg-background px-2.5 py-1 text-sm outline-none focus:border-accent transition-colors"
        />
        <select
          value={expFilter}
          onChange={(e) => setExpFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm cursor-pointer"
        >
          <option value="ALL">경험: 전체</option>
          {Object.entries(experienceLevelLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onShowAiPrompt}
            className="rounded-md border border-border px-3 py-1 text-xs cursor-pointer transition-colors hover:bg-muted"
          >
            AI 심사 프롬프트
          </button>
          {myTeam && (
            <button
              type="button"
              onClick={() => setShowProjectModal(true)}
              className="rounded-md bg-accent px-3 py-1 text-xs text-white cursor-pointer transition-colors hover:bg-accent-hover"
            >
              {myTeam?.project ? "프로젝트 수정" : "프로젝트 등록"}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className={`${thClass} w-8 text-center`}></th>
              <th className={`${thClass} w-40`}>팀명</th>
              <th className={`${thClass} min-w-50`}>주제</th>
              <th className={`${thClass} w-28`}>
                <span className="text-amber-600">★</span> 팀원1
              </th>
              <th className={`${thClass} w-28`}>팀원 2</th>
              <th className={`${thClass} w-28`}>팀원 3</th>
              <th className={`${thClass} w-28`}>팀원 4</th>
              <th className={thClass}>프로젝트</th>
              <th className={thClass}>링크</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpanAll}
                  className="px-4 py-8 text-center text-muted-foreground text-sm"
                >
                  {teams.length === 0
                    ? "등록된 팀이 없습니다."
                    : "검색 결과가 없습니다."}
                </td>
              </tr>
            ) : (
              filtered.map((team) => {
                const leader =
                  team.members.find((m) => m.isLeader) ?? team.members[0];
                const others = team.members.filter((m) => m.id !== leader?.id);
                const canEdit = isAdmin || team.isMyTeam;

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors ${
                      team.isMyTeam
                        ? "bg-accent/5"
                        : team.order % 2 === 0
                          ? "bg-muted/30"
                          : "bg-background"
                    }`}
                  >
                    <td
                      className={`${tdClass} text-center text-xs text-muted-foreground`}
                    >
                      {team.order}
                    </td>
                    {/* 팀명 */}
                    <td className={`${tdClass} font-medium whitespace-nowrap`}>
                      <div className="flex items-center gap-1.5">
                        {canEdit ? (
                          <EditableCell
                            value={team.teamName ?? ""}
                            placeholder="팀명 입력"
                            onSave={(v) => updateTeam(team.id, "teamName", v)}
                            className="font-medium w-30 shrink-0"
                          />
                        ) : (
                          <span>{team.teamName || team.leaderName}</span>
                        )}
                        {team.isMyTeam && (
                          <span className="shrink-0 rounded-full bg-accent/10 px-1.5 py-px text-[10px] font-medium text-accent">
                            내 팀
                          </span>
                        )}
                        {canEdit && team.membersCount < team.maxMembers ? (
                          <button
                            type="button"
                            onClick={() =>
                              toggleRecruiting(team.id, !team.recruiting)
                            }
                            className={`shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium cursor-pointer transition-colors ${
                              team.recruiting
                                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            {team.recruiting ? "모집중" : "모집 OFF"}
                          </button>
                        ) : (
                          !team.isMyTeam &&
                          team.recruiting &&
                          team.membersCount < team.maxMembers && (
                            <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-px text-[10px] font-medium text-blue-600">
                              모집중
                            </span>
                          )
                        )}
                      </div>
                    </td>
                    {/* 주제 */}
                    <td className={`${tdClass} text-muted-foreground max-w-70`}>
                      {canEdit ? (
                        <EditableCell
                          value={team.recruitmentNote ?? ""}
                          placeholder="주제 입력"
                          onSave={(v) =>
                            updateTeam(team.id, "recruitmentNote", v)
                          }
                          className="w-full"
                        />
                      ) : (
                        <span className="line-clamp-1">
                          {team.recruitmentNote || "-"}
                        </span>
                      )}
                    </td>
                    {/* 리더 */}
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {leader ? (
                        <div className="inline-flex items-center gap-1">
                          <span
                            className={`font-medium ${
                              leader.id === myMemberId ? "text-accent" : ""
                            }`}
                          >
                            {leader.name}
                          </span>
                          {(leader.id === myMemberId || isAdmin) && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleSeeking(!leader.seekingTeam, leader.id)
                              }
                              className={`shrink-0 rounded-full px-1.5 py-px text-[9px] font-medium cursor-pointer transition-colors ${
                                leader.seekingTeam
                                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                              }`}
                            >
                              {leader.seekingTeam ? "구직중" : "OFF"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40">-</span>
                      )}
                    </td>
                    {/* 팀원 2~4 */}
                    {[0, 1, 2].map((idx) => (
                      <td key={idx} className={`${tdClass} whitespace-nowrap`}>
                        {others[idx] ? (
                          <div className="inline-flex items-center gap-1">
                            <span
                              className={
                                others[idx].id === myMemberId
                                  ? "font-medium text-accent"
                                  : ""
                              }
                            >
                              {others[idx].name}
                            </span>
                            {(others[idx].id === myMemberId || isAdmin) && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleSeeking(
                                    !others[idx].seekingTeam,
                                    others[idx].id,
                                  )
                                }
                                className={`shrink-0 rounded-full px-1.5 py-px text-[9px] font-medium cursor-pointer transition-colors ${
                                  others[idx].seekingTeam
                                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                }`}
                              >
                                {others[idx].seekingTeam ? "구직중" : "OFF"}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                    ))}
                    {/* 프로젝트 */}
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {team.project ? (
                        <span
                          className="text-muted-foreground"
                          title={team.project.description ?? undefined}
                        >
                          {team.project.title}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">-</span>
                      )}
                    </td>
                    {/* 링크 */}
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {team.project ? (
                        <div className="flex items-center gap-2">
                          {team.project.githubUrl && (
                            <a
                              href={team.project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                              title="GitHub"
                            >
                              <LinkIcon />
                              GitHub
                            </a>
                          )}
                          {team.project.demoUrl && (
                            <a
                              href={team.project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                              title="배포"
                            >
                              <LinkIcon />
                              배포
                            </a>
                          )}
                          {team.project.videoUrl && (
                            <a
                              href={team.project.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                              title="영상"
                            >
                              <LinkIcon />
                              영상
                            </a>
                          )}
                          {team.project.linkUrl && (
                            <a
                              href={team.project.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                              title="추가 링크"
                            >
                              <LinkIcon />
                              기타
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {myTeam && isInFullTeam && !isAdmin && (
            <tfoot>
              <tr>
                <td colSpan={colSpanAll} className="border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(true)}
                    className="w-full px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer text-left"
                  >
                    <span className="font-medium text-foreground">
                      새 팀으로 시작하기
                    </span>
                    <span className="ml-2 text-xs">
                      현재 팀에서 나와 1인 팀으로 새로 시작합니다
                    </span>
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
          {filtered.length > 0 && (
            <tfoot>
              <tr className="bg-muted/50">
                <td
                  colSpan={3}
                  className="px-2.5 py-2 text-sm font-medium border-t border-border"
                >
                  총인원
                </td>
                <td
                  colSpan={colSpanAll - 3}
                  className="px-2.5 py-2 text-sm font-semibold text-right border-t border-border"
                >
                  {totalMembers}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
