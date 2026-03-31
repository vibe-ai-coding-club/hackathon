import { Icon } from "@/app/_components/icon";

export const StopwatchSection = () => {
  return (
    <section
      id="stopwatch-section"
      className="bg-primary-300 px-4 py-9 backdrop-blur-[10px] md:px-8 md:py-[60px]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-center gap-2.5 md:gap-3.5">
          <Icon
            type="twinkle"
            width={16}
            height={16}
            className="text-white md:size-6"
          />
          <p className="text-[20px] leading-[30px] font-bold tracking-[-0.4px] text-white md:text-[34px] md:leading-[52px]">
            해커톤 종료! 참여해주셔서 감사합니다 🎉
          </p>
          <Icon
            type="twinkle"
            width={16}
            height={16}
            className="text-white md:size-6"
          />
        </div>
      </div>
    </section>
  );
};
