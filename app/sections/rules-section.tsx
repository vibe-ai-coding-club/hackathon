const LightbulbIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

const rules = [
  { icon: <LightbulbIcon />, title: "AI를 적극 활용하세요", desc: "코드 작성, 아이디어 구체화, 디자인까지 AI와 함께하는 것이 핵심이에요." },
  { icon: <ZapIcon />, title: "속도보다 방향", desc: "완벽한 결과물보다 재미있는 시도와 과정이 더 높이 평가돼요." },
  { icon: <HeartIcon />, title: "즐기는 사람이 이깁니다", desc: "경쟁보다 협업, 스트레스보다 즐거움에 집중해 주세요." },
  { icon: <SparkleIcon />, title: "이상해도 괜찮아요", desc: "쓸모없어 보여도 재미있으면 OK. 기발할수록 환영합니다." },
  { icon: <MessageIcon />, title: "서로를 존중해요", desc: "다양한 배경의 참가자들이 모이는 자리입니다. 배려가 기본이에요." },
  { icon: <ShareIcon />, title: "공유는 자유롭게", desc: "과정과 결과를 공유를 장려해요. SNS 공유도 환영합니다." },
];

export const RulesSection = () => {
  return (
    <section id="rules" className="scroll-mt-16 bg-muted py-24 min-h-[85vh] flex flex-col justify-center">
      <div className="mx-auto max-w-5xl px-4">
        {/* 라벨 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block w-8 h-0.5 bg-accent" />
          <span className="typo-subtitle2 text-accent tracking-widest">RULES</span>
        </div>

        <h2 className="typo-h3 mb-12">참가 규칙</h2>

        <div className="grid gap-5 sm:grid-cols-3">
          {rules.map((rule) => (
            <div key={rule.title} className="rounded-2xl bg-background p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                {rule.icon}
              </div>
              <p className="typo-subtitle1 mb-2">{rule.title}</p>
              <p className="typo-body3 text-muted-foreground">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
