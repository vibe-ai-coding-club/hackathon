"use client";

import { useEffect, useState } from "react";

import { useRegistrationCountdown } from "@/app/_hooks/use-registration-countdown";
import { pad } from "@/lib/registration-time";

const BASE_BOTTOM = 50;
const FOOTER_MARGIN = 30;
const FOOTER_TRIGGER = 20;

const TimeBlock = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center gap-[1px] text-center text-[14px] leading-[22px] font-medium tracking-[-0.2px] text-gray-850 md:gap-0.5 md:typo-h6 md:font-bold md:tracking-[-0.4px]">
      <span>{value}</span>
      <span>{label}</span>
    </div>
  );
};

const Colon = () => (
  <div className="flex flex-col gap-[2px] md:h-3 md:w-1 md:justify-between md:gap-0">
    <span className="size-0.5 rounded-full bg-gray-850 md:size-1" />
    <span className="size-0.5 rounded-full bg-gray-850 md:size-1" />
  </div>
);

const getVisibleHeight = (rect: DOMRect, viewportHeight: number) => {
  const visible = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  return Math.max(0, Math.min(visible, rect.height));
};

export const FloatingStopwatch = () => {
  const { phase, timeLeft, label } = useRegistrationCountdown();
  const [isVisible, setIsVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(BASE_BOTTOM);

  useEffect(() => {
    let rafId = 0;

    const updatePosition = () => {
      const stopwatchSection = document.getElementById("stopwatch-section");
      const footer = document.getElementById("landing-footer");

      if (!stopwatchSection || !footer) return;

      const sectionRect = stopwatchSection.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();

      const shouldShow = sectionRect.bottom < 0;
      const footerVisibleHeight = getVisibleHeight(
        footerRect,
        window.innerHeight,
      );
      const stickyBottom =
        footerVisibleHeight >= FOOTER_TRIGGER
          ? footerVisibleHeight + FOOTER_MARGIN
          : BASE_BOTTOM;

      setIsVisible(shouldShow);
      setBottomOffset(stickyBottom);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed left-1/2 z-40 -translate-x-1/2 transition-[opacity,transform,bottom] duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ bottom: `${bottomOffset}px` }}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center justify-center gap-2 overflow-hidden rounded-[32px] border border-primary-200 bg-transparent px-6 py-2.5 whitespace-nowrap backdrop-blur-[10px] md:gap-3.5 md:rounded-[44px] md:px-[34px] md:py-5">
        <p className="text-[14px] leading-[22px] font-medium tracking-[-0.2px] text-primary-900 md:typo-h6 md:text-primary-900">
          {phase === "closed" ? "" : label}
        </p>
        <div className="flex items-center justify-center gap-1 md:gap-2">
          {phase !== "closed" ? (
            <>
              <TimeBlock value={pad(timeLeft.days)} label="일" />
              <Colon />
              <TimeBlock value={pad(timeLeft.hours)} label="시" />
              <Colon />
              <TimeBlock value={pad(timeLeft.minutes)} label="분" />
              <Colon />
              <TimeBlock value={pad(timeLeft.seconds)} label="초" />
            </>
          ) : (
            <p className="text-[14px] leading-[22px] font-medium tracking-[-0.2px] text-gray-850 md:typo-h6 md:font-bold">
              신청이 마감되었어요
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
