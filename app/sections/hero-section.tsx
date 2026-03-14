"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import confetti from "canvas-confetti";

import Image from "next/image";

import { Icon } from "@/app/_components/icon";
import clsx from "clsx";

type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type GamePhase = "idle" | "active" | "returning" | "success";

const MOBILE_BREAKPOINT = 768;
const CATCHABLE_AFTER_MS = 5000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const lerp = (start: number, end: number, ratio: number) =>
  start + (end - start) * ratio;

const hasOverlap = (
  draggable: { left: number; top: number; right: number; bottom: number },
  target: { left: number; top: number; right: number; bottom: number },
) => {
  const overlapLeft = Math.max(draggable.left, target.left);
  const overlapTop = Math.max(draggable.top, target.top);
  const overlapRight = Math.min(draggable.right, target.right);
  const overlapBottom = Math.min(draggable.bottom, target.bottom);

  return overlapRight > overlapLeft && overlapBottom > overlapTop;
};

export const HeroSection = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const ctaSlotRef = useRef<HTMLDivElement>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });
  const runawaySizeRef = useRef<Size>({ width: 0, height: 0 });
  const gameStartedAtRef = useRef<number | null>(null);
  const desktopEscapeTimerRef = useRef<number | null>(null);
  const mobileTeleportTimerRef = useRef<number | null>(null);
  const mobileRevealTimerRef = useRef<number | null>(null);
  const mobileJumpCountRef = useRef(0);
  const successTimerRef = useRef<number | null>(null);
  const navigateTimerRef = useRef<number | null>(null);
  const celebrationTimerRefs = useRef<number[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [runawayPosition, setRunawayPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const [isRunawayVisible, setIsRunawayVisible] = useState(true);
  const [transitionMs, setTransitionMs] = useState(240);
  const [isGlitchBurst, setIsGlitchBurst] = useState(false);

  const clearDesktopEscapeTimer = useCallback(() => {
    if (desktopEscapeTimerRef.current !== null) {
      window.clearTimeout(desktopEscapeTimerRef.current);
      desktopEscapeTimerRef.current = null;
    }
  }, []);

  const clearMobileTimers = useCallback(() => {
    if (mobileTeleportTimerRef.current !== null) {
      window.clearTimeout(mobileTeleportTimerRef.current);
      mobileTeleportTimerRef.current = null;
    }
    if (mobileRevealTimerRef.current !== null) {
      window.clearTimeout(mobileRevealTimerRef.current);
      mobileRevealTimerRef.current = null;
    }
  }, []);

  const clearSuccessTimers = useCallback(() => {
    if (successTimerRef.current !== null) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    if (navigateTimerRef.current !== null) {
      window.clearTimeout(navigateTimerRef.current);
      navigateTimerRef.current = null;
    }
  }, []);

  const clearCelebrationTimers = useCallback(() => {
    if (celebrationTimerRefs.current.length === 0) {
      return;
    }

    for (const timerId of celebrationTimerRefs.current) {
      window.clearTimeout(timerId);
    }
    celebrationTimerRefs.current = [];
  }, []);

  const getRects = useCallback(() => {
    const sectionRect = sectionRef.current?.getBoundingClientRect();
    const slotRect = ctaSlotRef.current?.getBoundingClientRect();

    if (!sectionRect || !slotRect) {
      return null;
    }

    return { sectionRect, slotRect };
  }, []);

  const getBounds = useCallback(
    (sectionRect: DOMRect) => {
      const runawayWidth = runawaySizeRef.current.width;
      const runawayHeight = runawaySizeRef.current.height;
      const paddingX = isMobile ? 8 : 12;
      const paddingY = isMobile ? 8 : 12;

      return {
        minX: paddingX,
        maxX: Math.max(paddingX, sectionRect.width - runawayWidth - paddingX),
        minY: paddingY,
        maxY: Math.max(paddingY, sectionRect.height - runawayHeight - paddingY),
      };
    },
    [isMobile],
  );

  const randomizeRunawayPosition = useCallback(() => {
    if (phase !== "active") {
      return;
    }
    const rects = getRects();
    if (!rects) {
      return;
    }

    const { sectionRect } = rects;
    const elapsed = gameStartedAtRef.current
      ? performance.now() - gameStartedAtRef.current
      : 0;
    const progress = clamp(elapsed / CATCHABLE_AFTER_MS, 0, 1);
    const bounds = getBounds(sectionRect);
    const nextX =
      bounds.minX + Math.random() * Math.max(1, bounds.maxX - bounds.minX);
    const nextY =
      bounds.minY + Math.random() * Math.max(1, bounds.maxY - bounds.minY);
    const moveDuration = isMobile ? 120 : Math.round(lerp(170, 720, progress));

    setTransitionMs(moveDuration);
    setRunawayPosition({ x: nextX, y: nextY });
  }, [getBounds, getRects, isMobile, phase]);

  const scheduleDesktopEscape = useCallback(() => {
    clearDesktopEscapeTimer();
    if (isMobile || phase !== "active" || dragging) {
      return;
    }

    const queueNextEscape = () => {
      const elapsed = gameStartedAtRef.current
        ? performance.now() - gameStartedAtRef.current
        : 0;
      if (elapsed >= CATCHABLE_AFTER_MS) {
        return;
      }

      const progress = clamp(elapsed / CATCHABLE_AFTER_MS, 0, 1);
      const delay = Math.round(lerp(220, 980, progress));

      desktopEscapeTimerRef.current = window.setTimeout(() => {
        randomizeRunawayPosition();
        queueNextEscape();
      }, delay);
    };

    queueNextEscape();
  }, [
    clearDesktopEscapeTimer,
    dragging,
    isMobile,
    phase,
    randomizeRunawayPosition,
  ]);

  const scheduleMobileTeleport = useCallback(() => {
    clearMobileTimers();
    if (!isMobile || phase !== "active" || dragging) {
      return;
    }

    const queueNextTeleport = () => {
      const interval =
        100 * Math.pow(1.5, Math.floor(mobileJumpCountRef.current / 3));

      mobileTeleportTimerRef.current = window.setTimeout(() => {
        setIsRunawayVisible(false);
        mobileRevealTimerRef.current = window.setTimeout(() => {
          randomizeRunawayPosition();
          setIsRunawayVisible(true);
          mobileJumpCountRef.current += 1;
          queueNextTeleport();
        }, 120);
      }, interval);
    };

    queueNextTeleport();
  }, [clearMobileTimers, dragging, isMobile, phase, randomizeRunawayPosition]);

  const initializeGame = useCallback(() => {
    const rects = getRects();
    if (!rects || phase !== "idle") {
      return;
    }

    const { sectionRect, slotRect } = rects;
    const initialX = slotRect.left - sectionRect.left;
    const initialY = slotRect.top - sectionRect.top;

    setRunawayPosition({ x: initialX, y: initialY });
    startPositionRef.current = { x: initialX, y: initialY };
    runawaySizeRef.current = { width: slotRect.width, height: slotRect.height };
    setPhase("active");
    setTransitionMs(220);
    setIsRunawayVisible(true);
    gameStartedAtRef.current = performance.now();
    mobileJumpCountRef.current = 0;

    if (isMobile) {
      scheduleMobileTeleport();
      return;
    }

    randomizeRunawayPosition();
    scheduleDesktopEscape();
  }, [
    getRects,
    isMobile,
    phase,
    randomizeRunawayPosition,
    scheduleDesktopEscape,
    scheduleMobileTeleport,
  ]);

  const evaluateDropOverlap = useCallback(
    (position: Position) => {
      const rects = getRects();
      if (!rects) {
        return false;
      }

      const { sectionRect, slotRect } = rects;
      const dropZone = {
        left: slotRect.left - sectionRect.left,
        top: slotRect.top - sectionRect.top,
        right: slotRect.left - sectionRect.left + slotRect.width,
        bottom: slotRect.top - sectionRect.top + slotRect.height,
      };
      const draggable = {
        left: position.x,
        top: position.y,
        right: position.x + runawaySizeRef.current.width,
        bottom: position.y + runawaySizeRef.current.height,
      };

      return hasOverlap(draggable, dropZone);
    },
    [getRects],
  );

  const completeMission = useCallback(() => {
    clearDesktopEscapeTimer();
    clearMobileTimers();
    clearSuccessTimers();
    setDragging(false);
    setIsOverDropZone(false);
    setIsRunawayVisible(true);
    setTransitionMs(480);
    setRunawayPosition(startPositionRef.current);
    setPhase("returning");

    successTimerRef.current = window.setTimeout(() => {
      setPhase("success");
      navigateTimerRef.current = window.setTimeout(() => {
        router.push("/register");
      }, 2000);
    }, 520);
  }, [clearDesktopEscapeTimer, clearMobileTimers, clearSuccessTimers, router]);

  const onRunawayPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (phase !== "active") {
        return;
      }

      const buttonRect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragPointerIdRef.current = event.pointerId;
      dragOffsetRef.current = {
        x: event.clientX - buttonRect.left,
        y: event.clientY - buttonRect.top,
      };

      clearDesktopEscapeTimer();
      clearMobileTimers();
      setTransitionMs(80);
      setDragging(true);
      setIsRunawayVisible(true);
    },
    [clearDesktopEscapeTimer, clearMobileTimers, phase],
  );

  const onRunawayPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!dragging || dragPointerIdRef.current !== event.pointerId) {
        return;
      }
      const sectionRect = sectionRef.current?.getBoundingClientRect();
      if (!sectionRect) {
        return;
      }

      const bounds = getBounds(sectionRect);
      const nextX = clamp(
        event.clientX - sectionRect.left - dragOffsetRef.current.x,
        bounds.minX,
        bounds.maxX,
      );
      const nextY = clamp(
        event.clientY - sectionRect.top - dragOffsetRef.current.y,
        bounds.minY,
        bounds.maxY,
      );
      const nextPosition = { x: nextX, y: nextY };

      setRunawayPosition(nextPosition);
      setIsOverDropZone(evaluateDropOverlap(nextPosition));
    },
    [dragging, evaluateDropOverlap, getBounds],
  );

  const onRunawayPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!dragging || dragPointerIdRef.current !== event.pointerId) {
        return;
      }

      event.currentTarget.releasePointerCapture(event.pointerId);
      dragPointerIdRef.current = null;
      setDragging(false);

      if (evaluateDropOverlap(runawayPosition)) {
        completeMission();
        return;
      }

      setIsOverDropZone(false);
      if (isMobile) {
        scheduleMobileTeleport();
        return;
      }
      scheduleDesktopEscape();
    },
    [
      completeMission,
      dragging,
      evaluateDropOverlap,
      isMobile,
      runawayPosition,
      scheduleDesktopEscape,
      scheduleMobileTeleport,
    ],
  );

  const onIdleButtonPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!isMobile || phase !== "idle") {
        return;
      }
      event.preventDefault();
      initializeGame();
    },
    [initializeGame, isMobile, phase],
  );

  const onIdleButtonMouseEnter = useCallback(() => {
    if (isMobile || phase !== "idle") {
      return;
    }
    initializeGame();
  }, [initializeGame, isMobile, phase]);

  const onRunawayMouseEnter = useCallback(() => {
    if (isMobile || phase !== "active" || dragging) {
      return;
    }
    const elapsed = gameStartedAtRef.current
      ? performance.now() - gameStartedAtRef.current
      : 0;
    if (elapsed >= CATCHABLE_AFTER_MS) {
      return;
    }
    randomizeRunawayPosition();
    scheduleDesktopEscape();
  }, [
    dragging,
    isMobile,
    phase,
    randomizeRunawayPosition,
    scheduleDesktopEscape,
  ]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (phase !== "success") {
      return;
    }

    const launchSideCannon = (originX: number, angle: number) => {
      confetti({
        particleCount: 90,
        angle,
        spread: 62,
        startVelocity: 66,
        gravity: 1.2,
        ticks: 140,
        scalar: 1.05,
        origin: { x: originX, y: 0.74 },
        disableForReducedMotion: true,
      });
    };

    const cannonWaveTimes = [0, 120, 240, 360];
    for (const waveTime of cannonWaveTimes) {
      const timerId = window.setTimeout(() => {
        launchSideCannon(0, 58);
        launchSideCannon(1, 122);
      }, waveTime);
      celebrationTimerRefs.current.push(timerId);
    }

    const fireworksIntervalId = window.setInterval(() => {
      confetti({
        particleCount: 62,
        angle: 90,
        spread: 90,
        startVelocity: 42,
        gravity: 0.9,
        ticks: 125,
        origin: { x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.2 },
        disableForReducedMotion: true,
      });
    }, 130);
    celebrationTimerRefs.current.push(fireworksIntervalId);

    const fireworksStopId = window.setTimeout(() => {
      window.clearInterval(fireworksIntervalId);
    }, 950);
    celebrationTimerRefs.current.push(fireworksStopId);

    return () => {
      clearCelebrationTimers();
    };
  }, [clearCelebrationTimers, phase]);

  useEffect(() => {
    if (phase !== "returning" && phase !== "success") {
      return;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "active" || dragging) {
      return;
    }

    if (isMobile) {
      scheduleMobileTeleport();
      return;
    }
    scheduleDesktopEscape();
  }, [
    dragging,
    isMobile,
    phase,
    scheduleDesktopEscape,
    scheduleMobileTeleport,
  ]);

  useEffect(() => {
    return () => {
      clearDesktopEscapeTimer();
      clearMobileTimers();
      clearSuccessTimers();
      clearCelebrationTimers();
    };
  }, [
    clearCelebrationTimers,
    clearDesktopEscapeTimer,
    clearMobileTimers,
    clearSuccessTimers,
  ]);

  // 글리치 버스트 타이밍: 8s 주기, 0.6s 버스트 → 3.4s 대기 → 0.6s 버스트 → 3.4s 대기
  useEffect(() => {
    const BURST_MS = 600;
    const IDLE_MS = 3400;
    let timerId: number;

    const loop = () => {
      setIsGlitchBurst(true);
      timerId = window.setTimeout(() => {
        setIsGlitchBurst(false);
        timerId = window.setTimeout(() => {
          loop();
        }, IDLE_MS);
      }, BURST_MS);
    };

    loop();
    return () => window.clearTimeout(timerId);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative bg-primary-400 flex h-[1112px] max-h-[100svh] flex-col items-center justify-center gap-10 overflow-hidden bg-[#FE2A80] px-4 pt-[140px] pb-[80px] md:gap-14 md:px-8 md:pt-[230px] md:pb-[130px]"
    >
      <div className="hero-glitch w-[120%] max-w-[941px] xl:w-[50%]">
        <Image
          src="/images/hero.webp"
          alt="딸깍톤 히어로"
          width={941}
          height={660}
          priority
          className={clsx("w-full object-contain", isGlitchBurst && "hero-glitch-base--active")}
        />
        <Image
          src="/images/hero.webp"
          alt=""
          width={941}
          height={660}
          aria-hidden
          className="hero-glitch-layer-1 pointer-events-none absolute object-contain"
        />
        <Image
          src="/images/hero.webp"
          alt=""
          width={941}
          height={660}
          aria-hidden
          className="hero-glitch-layer-2 pointer-events-none absolute object-contain"
        />
        <Image
          src="/images/hero.webp"
          alt=""
          width={941}
          height={660}
          aria-hidden
          className="hero-glitch-layer-3 pointer-events-none absolute object-contain"
        />
        <Image
          src="/images/hero.webp"
          alt=""
          width={941}
          height={660}
          aria-hidden
          className="hero-glitch-layer-4 pointer-events-none absolute object-contain"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center text-center">
        <div ref={ctaSlotRef} className="relative inline-flex">
          <button
            type="button"
            className={`inline-flex h-[50px] min-w-[160px] items-center justify-center rounded-xl bg-gray-100 px-5 text-[18px] leading-[26px] font-semibold tracking-[-0.4px] text-gray-850 whitespace-nowrap transition-[opacity,colors] duration-300 ease-out hover:bg-gray-200 md:h-[66px] md:min-w-[420px] md:rounded-2xl md:px-8 md:text-[24px] md:leading-[34px] md:font-bold ${
              phase === "idle"
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            onMouseEnter={onIdleButtonMouseEnter}
            onPointerDown={onIdleButtonPointerDown}
          >
            지금 신청하기
          </button>

          <div
            className={`absolute inset-0 inline-flex h-[50px] min-w-[160px] items-center justify-center rounded-xl border px-5 text-center text-[14px] leading-[22px] font-semibold tracking-[-0.3px] transition-[opacity,colors] duration-500 ease-out md:h-[66px] md:min-w-[420px] md:rounded-2xl md:px-8 md:text-[18px] md:leading-[28px] ${
              phase === "active"
                ? "pointer-events-none opacity-100"
                : "pointer-events-none opacity-0"
            } ${
              isOverDropZone
                ? "border-primary-200 bg-primary-050 text-primary-200"
                : "border-white/50 bg-white/15 text-white/85"
            }`}
          >
            <span className="md:whitespace-nowrap">
              Mission: 버튼을 제자리로 돌려놓아라!
            </span>
          </div>
        </div>
      </div>

      {phase !== "idle" && (
        <button
          type="button"
          className={`absolute z-30 inline-flex h-[50px] min-w-[160px] touch-none select-none items-center justify-center rounded-xl bg-gray-100 px-5 text-[18px] leading-[26px] font-semibold tracking-[-0.4px] text-gray-850 whitespace-nowrap transition-[transform,opacity] md:h-[66px] md:min-w-[420px] md:rounded-2xl md:px-8 md:text-[24px] md:leading-[34px] md:font-bold ${
            phase === "active" ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${runawayPosition.x}px, ${runawayPosition.y}px, 0)`,
            transitionDuration: `${transitionMs}ms`,
            transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.2, 1)",
            opacity: isRunawayVisible ? 1 : 0,
            cursor:
              phase === "active" ? (dragging ? "grabbing" : "grab") : "default",
          }}
          onMouseEnter={onRunawayMouseEnter}
          onPointerDown={onRunawayPointerDown}
          onPointerMove={onRunawayPointerMove}
          onPointerUp={onRunawayPointerEnd}
          onPointerCancel={onRunawayPointerEnd}
        >
          <span
            className={clsx(
              phase === "success"
                ? "opacity-100"
                : phase === "active"
                  ? "opacity-100"
                  : "opacity-0"
            , "flex items-center")}
          >
            {phase === "success" ? (
              <span className="inline-flex items-center gap-[10px]">
                <Icon type="check" width={24} height={24} />
                <span>미션 성공!</span>
              </span>
            ) : (
              "지금 신청하기"
            )}
          </span>
        </button>
      )}

      {(phase === "returning" || phase === "success") && (
        <div className="absolute inset-0 z-20 pointer-events-auto" />
      )}
    </section>
  );
};
