const CalendarIcon = () => (
  <svg className="size-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const LocationIcon = () => (
  <svg className="size-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PeopleIcon = () => (
  <svg className="size-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const descriptions = [
  { num: "01", text: "AI와 함께 만드는 유쾌한 하루짜리 해커톤이에요" },
  { num: "02", text: "완성도보다 태도, 논리보다 바이브가 더 중요해요" },
  { num: "03", text: "쓸모없어도 괜찮고 이상해도 괜찮아요" },
];

const eventInfo = [
  {
    icon: <CalendarIcon />,
    label: "일시",
    value: "2026년 3월 28일",
    sub: "10:00 - 18:00",
  },
  {
    icon: <LocationIcon />,
    label: "장소",
    value: "추후 공개",
    sub: "장소 확정 시 안내 예정",
  },
  {
    icon: <PeopleIcon />,
    label: "참가 자격",
    value: "AI와 대화가 가능하고 즐길 준비가 된 사람이면 누구나 가능해요",
    sub: null,
  },
];

export const AboutSection = () => {
  return (
    <section className="py-24 min-h-[85vh] flex flex-col justify-center">
      <div className="mx-auto max-w-5xl px-4">
        {/* 라벨 */}
        <div className="flex items-center gap-3 mb-10">
          <span className="inline-block w-8 h-0.5 bg-accent" />
          <span className="typo-subtitle2 text-accent tracking-widest">ABOUT</span>
        </div>

        {/* 번호 카드 */}
        <div className="grid gap-5 sm:grid-cols-3 mb-12">
          {descriptions.map((item) => (
            <div key={item.num} className="rounded-2xl bg-muted p-6">
              <span className="typo-subtitle2 inline-block mb-4 rounded-md bg-accent/10 px-2.5 py-1 text-accent">
                {item.num}
              </span>
              <p className="typo-body3">{item.text}</p>
            </div>
          ))}
        </div>

        {/* 행사 정보 카드 */}
        <div className="rounded-2xl bg-muted p-8">
          <h3 className="typo-h7 mb-6">행사 정보</h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {eventInfo.map((info) => (
              <div key={info.label} className="flex gap-3">
                <div className="mt-0.5 shrink-0">{info.icon}</div>
                <div>
                  <p className="typo-caption1 text-muted-foreground">{info.label}</p>
                  <p className="typo-subtitle2">{info.value}</p>
                  {info.sub && (
                    <p className="typo-caption1 text-muted-foreground">{info.sub}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
