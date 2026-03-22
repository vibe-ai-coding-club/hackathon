"use client";

import { useEffect, useState } from "react";

const BASE_BOTTOM = 50;
const FOOTER_MARGIN_MOBILE = 20;
const FOOTER_MARGIN_DESKTOP = 30;
const FOOTER_TRIGGER = 20;

const getVisibleHeight = (rect: DOMRect, viewportHeight: number) => {
  const visible = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  return Math.max(0, Math.min(visible, rect.height));
};

export const FloatingStopwatch = () => {
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
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const footerMargin = isDesktop
        ? FOOTER_MARGIN_DESKTOP
        : FOOTER_MARGIN_MOBILE;
      const stickyBottom =
        footerVisibleHeight >= FOOTER_TRIGGER
          ? footerVisibleHeight + footerMargin
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
        <p className="text-[14px] leading-[22px] font-medium tracking-[-0.2px] text-primary-900 md:typo-h6 md:font-bold">
          D-Day!
        </p>
      </div>
    </div>
  );
};
