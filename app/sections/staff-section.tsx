import { MotionItem } from "@/app/_components/motion-section";
import { SectionTitle } from "@/app/_components/section-title";
import { StaffRoller } from "@/app/_components/landing/staff-roller";

import { STAFF_ITEMS } from "./landing-data";

export const StaffSection = () => {
  return (
    <section id="staffs" className="overflow-x-hidden overflow-y-visible bg-white">
      <div className="bg-[radial-gradient(circle_at_top,#fe5b9d_0%,#d51060_42%,#850a3c_100%)] pt-[56px] pb-10 text-white md:pt-24 md:pb-14">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 md:gap-12 md:px-[60px]">
          <MotionItem>
            <div className="mx-auto max-w-[840px]">
              <SectionTitle
                chipLabel="Staffs"
                chipClassName="bg-white text-primary-700"
                title="딸깍톤을 움직이는 사람들"
                titleClassName="text-white"
              />
              <p className="mx-auto mt-4 max-w-[640px] text-center text-sm leading-6 font-medium text-white/78 md:mt-5 md:text-base">
              {`{`}이 위치에 스태프 섹션의 서브 타이틀로 쓸만한 유쾌한 소개글을 채워줘{`}`}
              </p>
            </div>
          </MotionItem>
        </div>

        <MotionItem delay={0.15}>
          <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-y-visible md:mt-12">
            <StaffRoller items={STAFF_ITEMS} />
          </div>
        </MotionItem>
      </div>

      <div aria-hidden="true" className="h-[120px] bg-white md:h-[168px]" />
    </section>
  );
};
