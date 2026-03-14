export const REGISTRATION_START = new Date("2026-03-14T16:00:00+09:00");
export const REGISTRATION_DEADLINE = new Date("2026-03-20T23:59:59+09:00");

export type RegistrationPhase = "before-start" | "open" | "closed";

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const ZERO_TIME_LEFT: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const diffToTimeLeft = (diff: number): TimeLeft => ({
  days: Math.floor(diff / (1000 * 60 * 60 * 24)),
  hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
  minutes: Math.floor((diff / (1000 * 60)) % 60),
  seconds: Math.floor((diff / 1000) % 60),
});

export const pad = (value: number) => String(value).padStart(2, "0");

export const calcRegistration = (): {
  phase: RegistrationPhase;
  timeLeft: TimeLeft;
} => {
  const now = Date.now();
  const startDiff = REGISTRATION_START.getTime() - now;

  if (startDiff > 0) {
    return { phase: "before-start", timeLeft: diffToTimeLeft(startDiff) };
  }

  const deadlineDiff = REGISTRATION_DEADLINE.getTime() - now;

  if (deadlineDiff > 0) {
    return { phase: "open", timeLeft: diffToTimeLeft(deadlineDiff) };
  }

  return { phase: "closed", timeLeft: ZERO_TIME_LEFT };
};

const PHASE_LABEL: Record<RegistrationPhase, string> = {
  "before-start": "신청 시작까지",
  open: "신청 마감까지",
  closed: "신청이 마감되었어요",
};

export const formatCountdown = (phase: RegistrationPhase, t: TimeLeft) => {
  if (phase === "closed") return PHASE_LABEL.closed;
  return `${PHASE_LABEL[phase]} ${pad(t.days)}일 ${pad(t.hours)}시 ${pad(t.minutes)}분 ${pad(t.seconds)}초`;
};
