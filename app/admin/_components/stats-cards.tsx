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
  BEGINNER: "비개발자/입문",
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 총 팀 수 */}
      <div className="rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">총 신청 수</p>
        <p className="mt-1 typo-h4">{totalTeams}</p>
      </div>

      {/* 참가 유형별 */}
      <div className="rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">참가 유형별</p>
        <div className="mt-2 space-y-1">
          {byParticipationType.map((item) => (
            <div key={item.participationType} className="flex justify-between text-sm">
              <span>{participationTypeLabel[item.participationType] ?? item.participationType}</span>
              <span className="font-medium">{item._count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 경험 수준별 */}
      <div className="rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">경험 수준별</p>
        <div className="mt-2 space-y-1">
          {byExperienceLevel.map((item) => (
            <div key={item.experienceLevel} className="flex justify-between text-sm">
              <span>{experienceLevelLabel[item.experienceLevel] ?? item.experienceLevel}</span>
              <span className="font-medium">{item._count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 7일 */}
      <div className="rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">최근 7일 신청</p>
        <p className="mt-1 typo-h4">{recentWeekCount}</p>
      </div>
    </div>
  );
};
