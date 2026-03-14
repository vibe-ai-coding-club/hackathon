"use client";

import { useEffect, useState } from "react";

import {
  calcRegistration,
  formatCountdown,
  type RegistrationPhase,
  type TimeLeft,
  ZERO_TIME_LEFT,
} from "@/lib/registration-time";

export const useRegistrationCountdown = () => {
  const [phase, setPhase] = useState<RegistrationPhase>("before-start");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME_LEFT);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    fetch("/api/registration-status")
      .then((res) => res.json())
      .then((data: { isClosed: boolean }) => setIsClosed(data.isClosed))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const update = () => {
      const state = calcRegistration();
      setPhase(state.phase);
      setTimeLeft(state.timeLeft);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const effectivePhase = isClosed ? "closed" : phase;

  const label =
    effectivePhase === "before-start"
      ? "신청 시작까지"
      : effectivePhase === "open"
        ? "신청 마감까지"
        : "";

  return {
    phase: effectivePhase,
    timeLeft,
    label,
    countdownText: isClosed
      ? "신청이 마감되었어요"
      : formatCountdown(phase, timeLeft),
    isOpen: effectivePhase === "open",
  };
};
