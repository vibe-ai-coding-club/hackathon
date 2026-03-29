import { MotionSection } from "./_components/motion-section";
import { AboutSection } from "./sections/about-section";
import { CultureSection } from "./sections/culture-section";
import { FloatingStopwatch } from "./sections/floating-stopwatch";
import { HeroSection } from "./sections/hero-section";
import { InfoSection } from "./sections/info-section";
import { IntroSection } from "./sections/intro-section";
import { PointSection } from "./sections/point-section";
import { ScheduleSection } from "./sections/schedule-section";
import { SponsorSection } from "./sections/sponsor-section";
import { StaffSection } from "./sections/staff-section";
import { StopwatchSection } from "./sections/stopwatch-section";

const UnderConstruction = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
    <span className="text-6xl">🚧</span>
    <h1 className="typo-h4">페이지 준비 중입니다</h1>
    <p className="typo-body2 text-gray-500">더 나은 모습으로 곧 찾아뵙겠습니다</p>
  </div>
);

const UNDER_CONSTRUCTION = false;

export default function Home() {
  if (UNDER_CONSTRUCTION) return <UnderConstruction />;

  return (
    <div>
      <HeroSection />
      <StopwatchSection />
      <MotionSection>
        <IntroSection />
      </MotionSection>
      <MotionSection>
        <AboutSection />
      </MotionSection>
      <MotionSection>
        <PointSection />
      </MotionSection>
      <MotionSection>
        <ScheduleSection />
      </MotionSection>
      <MotionSection>
        <CultureSection />
      </MotionSection>
      <MotionSection>
        <InfoSection />
      </MotionSection>
      <MotionSection>
        <SponsorSection />
      </MotionSection>
      <MotionSection>
        <StaffSection />
      </MotionSection>
      <FloatingStopwatch />
    </div>
  );
}
