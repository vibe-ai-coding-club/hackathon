const CalendarIcon = () => (
  <svg className="size-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const LocationIcon = () => (
  <svg className="size-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PeopleIcon = () => (
  <svg className="size-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const infoCards = [
  {
    icon: <CalendarIcon />,
    label: "일시",
    value: "2026년 3월 28일",
    sub: "10:00 – 18:00",
  },
  {
    icon: <LocationIcon />,
    label: "장소",
    value: "000",
    sub: null,
  },
  {
    icon: <PeopleIcon />,
    label: "참가 자격",
    value: "AI와 대화가 가능하고 즐길 준비가 된 사람이면 누구나 가능해요",
    sub: null,
  },
];

export const IntroSection = () => {
  return (
    <section id="intro" className="scroll-mt-16 bg-muted py-24 min-h-[85vh] flex flex-col justify-center">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="typo-h3 mb-14">행사 소개</h2>

        <div className="typo-body1 mb-16 space-y-6">
          <p>AI와 함께 만드는 유쾌한 하루짜리 해커톤이에요</p>
          <p className="typo-subtitle1">완성도보다 태도, 논리보다 바이브가 더 중요해요</p>
          <p>쓸모없어도 괜찮고 이상해도 괜찮아요</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-background p-6 text-left"
            >
              <div className="mb-4">{card.icon}</div>
              <p className="typo-subtitle2 mb-1">{card.label}</p>
              <p className="typo-body3 text-muted-foreground">
                {card.value}
                {card.sub && (
                  <>
                    <br />
                    {card.sub}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
