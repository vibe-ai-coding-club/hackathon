"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Project, SeekingMember, Team } from "./types";

type TransferMode = "transfer" | "recruit";

type TeamBoardContextValue = {
  teams: Team[];
  filtered: Team[];
  recruitingTeams: Team[];
  lookingForTeam: SeekingMember[];
  totalMembers: number;
  myMemberId: string | null;
  isAdmin: boolean;
  myTeam: Team | undefined;
  isLeader: boolean;
  isIndividual: boolean;
  isInFullTeam: boolean;
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  expFilter: string;
  setExpFilter: (v: string) => void;
  // transfer / recruit
  transferTarget: Team | null;
  transferMode: TransferMode;
  transferring: boolean;
  handleTransferClick: (team: Team, mode?: TransferMode) => void;
  handleTransfer: () => void;
  cancelTransfer: () => void;
  // team update
  updateTeam: (teamId: string, field: string, value: string) => void;
  toggleRecruiting: (teamId: string, value: boolean) => void;
  toggleSeeking: (value: boolean, memberId?: string) => void;
  // leave team
  showLeaveModal: boolean;
  setShowLeaveModal: (v: boolean) => void;
  handleLeaveTeam: () => void;
  leaving: boolean;
  // project
  showProjectModal: boolean;
  setShowProjectModal: (v: boolean) => void;
  handleProjectSaved: (project: Project) => void;
  // accordion
  recruitingOpen: boolean;
  setRecruitingOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  lookingOpen: boolean;
  setLookingOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
};

const TeamBoardContext = createContext<TeamBoardContextValue | null>(null);

export const useTeamBoard = () => {
  const ctx = useContext(TeamBoardContext);
  if (!ctx)
    throw new Error("useTeamBoard must be used within TeamBoardProvider");
  return ctx;
};

export const TeamBoardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [myMemberId, setMyMemberId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expFilter, setExpFilter] = useState("ALL");
  const [transferTarget, setTransferTarget] = useState<Team | null>(null);
  const [transferMode, setTransferMode] = useState<TransferMode>("transfer");
  const [transferring, setTransferring] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [recruitingOpen, setRecruitingOpen] = useState(true);
  const [lookingOpen, setLookingOpen] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams/teams");
        const data = await res.json();
        if (data.success) {
          setTeams(data.teams);
          setMyMemberId(data.myMemberId ?? null);
          setIsAdmin(data.isAdmin ?? false);
        }
      } catch {
        console.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filtered = useMemo(() => {
    return teams
      .filter((t) => {
        if (expFilter !== "ALL" && t.experienceLevel !== expFilter)
          return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          if (
            !t.teamName?.toLowerCase().includes(q) &&
            !t.recruitmentNote?.toLowerCase().includes(q) &&
            !t.leaderName.toLowerCase().includes(q) &&
            !t.members.some((m) => m.name.toLowerCase().includes(q))
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isMyTeam !== b.isMyTeam) return a.isMyTeam ? -1 : 1;
        const aFull = a.membersCount >= a.maxMembers ? 1 : 0;
        const bFull = b.membersCount >= b.maxMembers ? 1 : 0;
        return aFull - bFull;
      });
  }, [teams, search, expFilter]);

  const recruitingTeams = useMemo(() => {
    return teams.filter((t) => t.recruiting && t.membersCount < t.maxMembers);
  }, [teams]);

  const lookingForTeam = useMemo(() => {
    const result: SeekingMember[] = [];
    for (const team of teams) {
      for (const member of team.members) {
        if (member.seekingTeam) {
          result.push({ memberId: member.id, memberName: member.name, team });
        }
      }
    }
    return result;
  }, [teams]);

  const totalMembers = useMemo(() => {
    return filtered.reduce((sum, t) => sum + t.membersCount, 0);
  }, [filtered]);

  const myTeam = useMemo(() => teams.find((t) => t.isMyTeam), [teams]);

  const isIndividual = myTeam?.participationType === "INDIVIDUAL";
  const isInFullTeam = !!myTeam && myTeam.membersCount >= 2;

  // 데이터 로드 후 아코디언 초기 상태 설정
  useEffect(() => {
    if (!myTeam) return;
    if (isInFullTeam) {
      setRecruitingOpen(false);
      setLookingOpen(true);
    } else if (isIndividual) {
      setRecruitingOpen(true);
      setLookingOpen(false);
    }
  }, [myTeam, isInFullTeam, isIndividual]);

  const isLeader = useMemo(() => {
    if (!myTeam || !myMemberId) return false;
    const flagged = myTeam.members.some(
      (m) => m.id === myMemberId && m.isLeader,
    );
    if (flagged) return true;
    const hasAnyLeader = myTeam.members.some((m) => m.isLeader);
    if (!hasAnyLeader && myTeam.members[0]?.id === myMemberId) return true;
    return false;
  }, [myTeam, myMemberId]);

  const handleTransferClick = useCallback(
    (team: Team, mode: TransferMode = "transfer") => {
      if (team.isMyTeam) return;
      if (mode === "transfer" && team.membersCount >= team.maxMembers) return;
      if (
        mode === "recruit" &&
        myTeam &&
        myTeam.membersCount >= myTeam.maxMembers
      )
        return;
      setTransferMode(mode);
      setTransferTarget(team);
    },
    [myTeam],
  );

  const handleTransfer = useCallback(async () => {
    if (!transferTarget) return;
    setTransferring(true);
    try {
      const isRecruit = transferMode === "recruit";
      const url = isRecruit ? "/api/teams/recruit" : "/api/teams/transfer";
      const body = isRecruit
        ? { targetMemberId: transferTarget.members[0]?.id }
        : { targetTeamId: transferTarget.id };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        window.location.reload();
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setTransferring(false);
      setTransferTarget(null);
    }
  }, [transferTarget, transferMode]);

  const cancelTransfer = useCallback(() => setTransferTarget(null), []);

  const updateTeam = useCallback(
    async (teamId: string, field: string, value: string) => {
      try {
        const res = await fetch("/api/teams/teams/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [field]: value,
            ...(isAdmin ? { teamId } : {}),
          }),
        });
        const json = await res.json();
        if (json.success) {
          setTeams((prev) =>
            prev.map((t) =>
              t.id === teamId ? { ...t, [field]: value || null } : t,
            ),
          );
        }
      } catch {
        console.error("Failed to update team");
      }
    },
    [isAdmin],
  );

  const toggleRecruiting = useCallback(
    async (teamId: string, value: boolean) => {
      try {
        const res = await fetch("/api/teams/teams/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recruiting: value,
            ...(isAdmin ? { teamId } : {}),
          }),
        });
        const json = await res.json();
        if (json.success) {
          setTeams((prev) =>
            prev.map((t) =>
              t.id === teamId ? { ...t, recruiting: value } : t,
            ),
          );
        }
      } catch {
        console.error("Failed to toggle recruiting");
      }
    },
    [isAdmin],
  );

  const toggleSeeking = useCallback(
    async (value: boolean, targetMemberId?: string) => {
      const mid = targetMemberId ?? myMemberId;
      if (!mid) return;
      // 낙관적 업데이트
      setTeams((prev) =>
        prev.map((t) => ({
          ...t,
          members: t.members.map((m) =>
            m.id === mid ? { ...m, seekingTeam: value } : m,
          ),
        })),
      );
      try {
        // 어드민이 다른 멤버를 토글할 때는 어드민 API 사용
        const useAdminApi =
          isAdmin && targetMemberId && targetMemberId !== myMemberId;
        const url = useAdminApi
          ? `/api/admin/members/${mid}/seeking`
          : "/api/teams/seeking";
        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seekingTeam: value }),
        });
        const json = await res.json();
        if (!json.success) {
          // 롤백
          setTeams((prev) =>
            prev.map((t) => ({
              ...t,
              members: t.members.map((m) =>
                m.id === mid ? { ...m, seekingTeam: !value } : m,
              ),
            })),
          );
        }
      } catch {
        console.error("Failed to toggle seeking");
      }
    },
    [myMemberId, isAdmin],
  );

  const handleLeaveTeam = useCallback(async () => {
    setLeaving(true);
    try {
      const res = await fetch("/api/teams/leave", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        window.location.reload();
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLeaving(false);
      setShowLeaveModal(false);
    }
  }, []);

  const handleProjectSaved = useCallback(
    (project: Project) => {
      if (!myTeam) return;
      setTeams((prev) =>
        prev.map((t) => (t.id === myTeam.id ? { ...t, project } : t)),
      );
    },
    [myTeam],
  );

  const value = useMemo<TeamBoardContextValue>(
    () => ({
      teams,
      filtered,
      recruitingTeams,
      lookingForTeam,
      totalMembers,
      myMemberId,
      isAdmin,
      myTeam,
      isLeader,
      isIndividual: !!isIndividual,
      isInFullTeam,
      loading,
      search,
      setSearch,
      expFilter,
      setExpFilter,
      transferTarget,
      transferMode,
      transferring,
      handleTransferClick,
      handleTransfer,
      cancelTransfer,
      updateTeam,
      toggleRecruiting,
      toggleSeeking,
      showLeaveModal,
      setShowLeaveModal,
      handleLeaveTeam,
      leaving,
      showProjectModal,
      setShowProjectModal,
      handleProjectSaved,
      recruitingOpen,
      setRecruitingOpen,
      lookingOpen,
      setLookingOpen,
    }),
    [
      teams,
      filtered,
      recruitingTeams,
      lookingForTeam,
      totalMembers,
      myMemberId,
      isAdmin,
      myTeam,
      isLeader,
      isIndividual,
      isInFullTeam,
      loading,
      search,
      expFilter,
      transferTarget,
      transferMode,
      transferring,
      handleTransferClick,
      handleTransfer,
      cancelTransfer,
      updateTeam,
      toggleRecruiting,
      toggleSeeking,
      showLeaveModal,
      handleLeaveTeam,
      leaving,
      showProjectModal,
      handleProjectSaved,
      recruitingOpen,
      lookingOpen,
    ],
  );

  return (
    <TeamBoardContext.Provider value={value}>
      {children}
    </TeamBoardContext.Provider>
  );
};
