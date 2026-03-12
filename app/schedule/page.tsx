import type { Metadata } from "next";
import { timetable } from "./_data/timetable";

export const metadata: Metadata = {
  title: "상세 일정",
  description: "딸깍톤 2026 당일 상세 식순. 10:00 입장부터 18:00 시상까지.",
};

const typeStyles = {
  default: "border-border",
  break: "border-amber-500/30 bg-amber-500/5",
  highlight: "border-accent/30 bg-accent/5",
} as const;

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">상세 일정</h1>
      <p className="mb-12 text-sm text-muted-foreground">
        2026년 3월 28일 (토) — 장소 확정 및 참가 인원에 따라 변경될 수 있습니다.
      </p>

      <div className="space-y-3">
        {timetable.map((entry) => (
          <div
            key={entry.time}
            className={`flex gap-4 rounded-lg border p-4 ${typeStyles[entry.type]}`}
          >
            <div className="w-36 shrink-0 font-mono text-sm text-accent">
              {entry.time}
            </div>
            <div>
              <p className="font-semibold">{entry.title}</p>
              {entry.note && (
                <p className="text-sm text-muted-foreground">{entry.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
