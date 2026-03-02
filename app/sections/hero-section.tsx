import { RunawayButton } from "@/app/_components/runaway-button";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      {/* 배지 */}
      <p className="typo-body3 flex items-center gap-2 rounded-full border border-border px-5 py-1.5">
        <span className="inline-block size-2 rounded-full bg-accent" />
        2026.03.28 | AI Hackathon
      </p>

      {/* 타이틀 */}
      <h1 className="typo-h4 sm:typo-h2 lg:typo-h1 tracking-tighter">
        ttalkkakthon
      </h1>

      {/* 서브타이틀 */}
      <p className="typo-subtitle3">
        AI와 함께 만드는 유쾌한 하루짜리 해커톤
      </p>

      {/* 보조 문구 */}
      <p className="typo-body3 text-muted-foreground">
        완성도보다 태도, 논리보다 바이브가 더 중요해요
      </p>

      {/* CTA */}
      <RunawayButton />

      {/* SCROLL 인디케이터 */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2">
        <span className="typo-caption1 font-semibold tracking-[0.2em] text-muted-foreground">
          SCROLL
        </span>
        <span className="block h-8 w-px bg-muted-foreground/40" />
      </div>
    </section>
  );
};
