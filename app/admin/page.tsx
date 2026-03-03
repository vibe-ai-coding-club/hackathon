import { prisma } from "@/lib/prisma";
import { LogoutButton } from "./_components/logout-button";
import { StatsCards } from "./_components/stats-cards";
import { TeamTable } from "./_components/team-table";

const AdminPage = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [teams, totalTeams, byParticipationType, byExperienceLevel, recentWeekCount] =
    await Promise.all([
      prisma.team.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.team.count(),
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="typo-h5">딸깍톤 Admin</h1>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        <StatsCards
          totalTeams={totalTeams}
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
