type StatsCardsProps = {
  totalTeams: number;
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

export const StatsCards = ({
  totalTeams,
  byParticipationType,
  byExperienceLevel,
  recentWeekCount,
}: StatsCardsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 typo-caption1 text-muted-foreground">
      <span>
        총 <strong className="text-foreground">{totalTeams}</strong>건
      </span>
      <span className="text-border">|</span>
      {byParticipationType.map((item) => (
        <span key={item.participationType}>
          {participationTypeLabel[item.participationType] ?? item.participationType}{" "}
          <strong className="text-foreground">{item._count}</strong>
        </span>
      ))}
      <span className="text-border">|</span>
      {byExperienceLevel.map((item) => (
        <span key={item.experienceLevel}>
          {experienceLevelLabel[item.experienceLevel] ?? item.experienceLevel}{" "}
          <strong className="text-foreground">{item._count}</strong>
        </span>
      ))}
      <span className="text-border">|</span>
      <span>
        최근 7일 <strong className="text-foreground">{recentWeekCount}</strong>
      </span>
    </div>
  );
};
