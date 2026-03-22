import Link from "next/link";

import { MotionItem } from "@/app/_components/motion-section";
import { SectionTitle } from "@/app/_components/section-title";
import { Timetable } from "@/app/_components/landing/timetable";

import { TIMETABLE } from "./landing-data";

export const ScheduleSection = () => {
  return (
    <section id="schedule" className="px-4 py-[90px] md:px-8 md:py-[180px]">
      <div className="mx-auto max-w-[1280px]">
        <MotionItem>
          <SectionTitle chipLabel="Schedule" title="행사 타임테이블" />
        </MotionItem>

        <MotionItem delay={0.15}>
          <div className="mt-[46px] md:mt-[52px]">
            <Timetable items={TIMETABLE} />
          </div>
        </MotionItem>

        <MotionItem delay={0.3}>
          <div className="mt-10 flex justify-center md:mt-[72px]">
            <Link
              href="/teams"
              className="inline-flex items-center justify-center rounded-[10px] bg-primary-400 px-[18px] py-[10px] text-[16px] leading-[24px] font-semibold tracking-[-0.2px] text-white transition-colors hover:bg-primary-500 md:rounded-2xl md:px-8 md:py-4 md:text-[24px] md:leading-[34px] md:font-bold md:tracking-[-0.4px]"
            >
              참가자 대시보드
            </Link>
          </div>
        </MotionItem>
      </div>
    </section>
  );
};
