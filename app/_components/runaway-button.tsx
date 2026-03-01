"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const PHASE_THRESHOLD = 2; // 2회 호버 후 근접 감지 활성화
const SETTLE_COUNT = 10; // 10회째에 원위치
const PROXIMITY_RADIUS = 140; // 근접 감지 반경 (px)
const MAX_X = 220;
const MAX_Y = 100;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const RunawayButton = () => {
  const ref = useRef<HTMLAnchorElement>(null);
  const hoverCount = useRef(0);
  const rafId = useRef<number>(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isProximityPhase, setIsProximityPhase] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [label, setLabel] = useState("지금 신청하기");

  // 호버 시 랜덤 방향으로 점프
  const flee = useCallback(() => {
    hoverCount.current++;

    // 10회째: 원위치로 복귀, 다음 호버에 텍스트 변경
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
    setLabel("후원하기");
  }, []);

  // Phase 2: 마우스가 가까워지면 슬슬 도망
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (
        !ref.current ||
        hoverCount.current < PHASE_THRESHOLD ||
        hoverCount.current >= SETTLE_COUNT
      )
        return;

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

  return (
    <Link
      ref={ref}
      href="/register"
      className={`mt-6 inline-block rounded-lg bg-accent px-10 py-3.5 text-sm font-semibold text-white hover:bg-accent-hover ${
        isProximityPhase
          ? "transition-transform duration-75 ease-out"
          : "transition-all duration-300 ease-out"
      }`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onMouseEnter={isSettled ? handleSettle : flee}
    >
      {label}
    </Link>
  );
};
