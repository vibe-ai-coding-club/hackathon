type StatsCardsProps = {
  totalTeams: number;
  totalMembers: number;
  byParticipationType: { participationType: string; _count: number }[];
  byExperienceLevel: { experienceLevel: string; _count: number }[];
  recentWeekCount: number;
};

const participationTypeLabel: Record<string, string> = {
  INDIVIDUAL: "개인",
  TEAM: "팀",
};

const experienceLevelLabel: Record<string, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  SENIOR: "시니어",
  VIBE_CODER: "바이브코더",
};

const StatCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) => (
  <div className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl border border-gray-200 bg-white px-4 py-3">
    <span className="typo-caption2 text-gray-500">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="typo-h5 tabular-nums text-gray-900">{value}</span>
      {sub && <span className="typo-caption2 text-gray-400">{sub}</span>}
    </div>
  </div>
);

export const StatsCards = ({
  totalTeams,
  totalMembers,
  byParticipationType,
  byExperienceLevel,
  recentWeekCount,
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard label="총 팀" value={totalTeams} sub="팀" />
      <StatCard label="총 인원" value={totalMembers} sub="명" />
      {byParticipationType.map((item) => (
        <StatCard
          key={item.participationType}
          label={
            participationTypeLabel[item.participationType] ??
            item.participationType
          }
          value={item._count}
          sub="팀"
        />
      ))}
      <StatCard label="최근 7일" value={recentWeekCount} sub="팀" />
    </div>
  );
};
