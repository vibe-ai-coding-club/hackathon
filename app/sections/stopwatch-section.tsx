"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/app/_components/icon";
import {
  calcTimeLeft,
  padTimeUnit,
  type TimeLeft,
  ZERO_TIME_LEFT,
} from "./stopwatch-time";

const TimeBlock = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center gap-1 font-bold tracking-[-0.4px] text-white md:gap-2">
      <span className="text-[20px] leading-[30px] md:text-[46px] md:leading-[64px]">{value}</span>
      <span className="text-[20px] leading-[30px] md:text-[46px] md:leading-[64px]">{label}</span>
    </div>
  );
};

const Colon = () => (
  <div className="flex flex-col gap-2 md:gap-3">
    <span className="size-1 rounded-full bg-white md:size-1.5" />
    <span className="size-1 rounded-full bg-white md:size-1.5" />
  </div>
);

export const StopwatchSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME_LEFT);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const next = calcTimeLeft();

      if (next) {
        setTimeLeft(next);
        setIsExpired(false);
        return;
      }

      setIsExpired(true);
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <section
      id="stopwatch-section"
      className="bg-[linear-gradient(178deg,#FE3E8C_44%,#FE90BC_99%)] px-4 py-9 backdrop-blur-[10px] md:px-8 md:py-[60px]"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-center gap-2.5 md:gap-3.5">
          <Icon type="twinkle" width={16} height={16} className="text-white md:size-6" />
          <p className="text-[20px] leading-[30px] font-bold tracking-[-0.4px] text-white md:text-[34px] md:leading-[52px]">
            신청 마감까지
          </p>
          <Icon type="twinkle" width={16} height={16} className="text-white md:size-6" />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3.5 md:mt-[14px] md:gap-7">
          {!isExpired ? (
            <>
              <TimeBlock value={padTimeUnit(timeLeft.days)} label="일" />
              <Colon />
              <TimeBlock value={padTimeUnit(timeLeft.hours)} label="시" />
              <Colon />
              <TimeBlock value={padTimeUnit(timeLeft.minutes)} label="분" />
              <Colon />
              <TimeBlock value={padTimeUnit(timeLeft.seconds)} label="초" />
            </>
          ) : (
            <p className="typo-h6 text-white md:typo-h3">신청이 마감되었어요</p>
          )}
        </div>
      </div>
    </section>
  );
};
