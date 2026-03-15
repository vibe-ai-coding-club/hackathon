import { prisma } from "@/lib/prisma";
import { AdminNav } from "./_components/admin-nav";
import { LogoutButton } from "./_components/logout-button";
import { RegistrationSettingControl } from "./_components/registration-setting-control";
import { StatsCards } from "./_components/stats-cards";
import { TeamTable } from "./_components/team-table";

const AdminPage = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    teams,
    totalTeams,
    totalMembers,
    byParticipationType,
    byExperienceLevel,
    recentWeekCount,
  ] = await Promise.all([
    prisma.team.findMany({
      include: { members: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.team.count(),
    prisma.member.count(),
    prisma.team.groupBy({
      by: ["participationType"],
      _count: true,
    }),
    prisma.team.groupBy({
      by: ["experienceLevel"],
      _count: true,
    }),
    prisma.team.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
  ]);

  const serializedTeams = teams.map((team) => ({
    ...team,
    members: team.members.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    })),
    consentedAt: team.consentedAt?.toISOString() ?? null,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
  }));

  const statsByParticipationType = byParticipationType.map((item) => ({
    participationType: item.participationType,
    _count: item._count,
  }));

  const statsByExperienceLevel = byExperienceLevel.map((item) => ({
    experienceLevel: item.experienceLevel,
    _count: item._count,
  }));

  return (
    <div className="mx-auto max-w-[1600px] px-8 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h1 className="typo-h6">딸깍톤 Admin</h1>
          <AdminNav />
        </div>
        <div className="flex items-center gap-3">
          <RegistrationSettingControl />
          <LogoutButton />
        </div>
      </div>

      <div className="space-y-3">
        <StatsCards
          totalTeams={totalTeams}
          totalMembers={totalMembers}
          byParticipationType={statsByParticipationType}
          byExperienceLevel={statsByExperienceLevel}
          recentWeekCount={recentWeekCount}
        />

        <TeamTable teams={serializedTeams} />
      </div>
    </div>
  );
};

export default AdminPage;
