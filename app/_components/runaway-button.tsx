"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const PHASE_THRESHOLD = 2; // 2회 호버 후 근접 감지 활성화
const SETTLE_COUNT = 10; // 10회째에 원위치
const PROXIMITY_RADIUS = 140; // 근접 감지 반경 (px)
const MAX_X = 220;
const MAX_Y = 100;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const RunawayButton = () => {
  const ref = useRef<HTMLAnchorElement>(null);
  const hoverCount = useRef(0);
  const rafId = useRef<number>(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isProximityPhase, setIsProximityPhase] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [label, setLabel] = useState("딸깍톤 신청하기");
  const [toast, setToast] = useState(false);

  // 호버 시 랜덤 방향으로 점프
  const flee = useCallback(() => {
    hoverCount.current++;

    if (hoverCount.current >= SETTLE_COUNT) {
      setOffset({ x: 0, y: 0 });
      setIsSettled(true);
      setIsProximityPhase(false);
      return;
    }

    if (hoverCount.current >= PHASE_THRESHOLD) {
      setIsProximityPhase(true);
    }

    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 80;
    setOffset({
      x: clamp(Math.cos(angle) * dist, -MAX_X, MAX_X),
      y: clamp(Math.sin(angle) * dist, -MAX_Y, MAX_Y),
    });
  }, []);

  const handleSettle = useCallback(() => {
    setLabel("후원하기?");
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isSettled || isDone) return;
      if (label !== "후원하기?") return;

      e.preventDefault();
      setToast(true);

      setTimeout(() => {
        setToast(false);
        setLabel("딸깍톤 신청하기");
        setIsDone(true);
      }, 2000);
    },
    [isSettled, isDone, label],
  );

  // Phase 2: 마우스가 가까워지면 슬슬 도망
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current || hoverCount.current < PHASE_THRESHOLD || hoverCount.current >= SETTLE_COUNT) return;

      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= PROXIMITY_RADIUS || dist < 5) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const force = ((PROXIMITY_RADIUS - dist) / PROXIMITY_RADIUS) * 0.25;
        setOffset((prev) => ({
          x: clamp(prev.x - dx * force, -MAX_X, MAX_X),
          y: clamp(prev.y - dy * force, -MAX_Y, MAX_Y),
        }));
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const isMoving = !isSettled && !isDone && (offset.x !== 0 || offset.y !== 0);

  return (
    <>
      <div className="relative mt-6">
        {/* 고스트 버튼 — 원래 위치에 대시 보더로 표시 */}
        <div
          className={`typo-btn3 pointer-events-none rounded-lg border-2 border-dashed border-accent/40 px-10 py-3.5 text-transparent transition-opacity duration-300 ${
            isMoving ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </div>

        {/* 실제 버튼 */}
        <Link
          ref={ref}
          href="/register"
          className={`typo-btn3 absolute inset-0 inline-flex items-center justify-center rounded-lg bg-accent px-10 py-3.5 text-white hover:bg-accent-hover ${
            isProximityPhase ? "transition-transform duration-75 ease-out" : "transition-all duration-300 ease-out"
          }`}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          onMouseEnter={isSettled && !isDone ? handleSettle : isDone ? undefined : flee}
          onClick={handleClick}
        >
          {label}
        </Link>
      </div>

      {/* 토스트 */}
      <div
        className={`typo-subtitle4 fixed bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-foreground px-6 py-3 text-background shadow-lg transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        감사합니다!
      </div>
    </>
  );
};
