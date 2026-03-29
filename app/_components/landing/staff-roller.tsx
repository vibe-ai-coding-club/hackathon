"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import type { StaffItem } from "@/app/sections/landing-data";

import { StaffCard } from "./staff-card";

type StaffRollerProps = {
  items: StaffItem[];
};

const REPEAT_COUNT = 4;

const splitStaffItems = (items: StaffItem[]) => {
  const middle = Math.ceil(items.length / 2);

  return {
    topItems: items.slice(0, middle),
    bottomItems: items.slice(middle),
  };
};

type StaffRollerRowProps = {
  items: StaffItem[];
  direction: "left" | "right";
  durationSeconds: number;
  paused: boolean;
};

const StaffRollerRow = ({
  items,
  direction,
  durationSeconds,
  paused,
}: StaffRollerRowProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="staff-roller overflow-x-hidden overflow-y-visible">
      <div
        className={`staff-roller-track ${direction === "right" ? "staff-roller-track-reverse" : ""} ${paused ? "staff-roller-track-paused" : ""}`}
        style={
          {
            ["--staff-roll-duration" as string]: `${durationSeconds}s`,
            ["--staff-roll-distance" as string]: `${100 / REPEAT_COUNT}%`,
          } as CSSProperties
        }
      >
        {Array.from({ length: REPEAT_COUNT }, (_, groupIndex) => (
          <div
            key={`${direction}-group-${groupIndex}`}
            className="staff-roller-row"
            aria-hidden={groupIndex === 0 ? undefined : "true"}
          >
            {items.map((item, index) => (
              <div
                key={`${item.nickname}-${direction}-${groupIndex}-${index}`}
                className="shrink-0"
              >
                <StaffCard item={item} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const StaffRoller = ({ items }: StaffRollerProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const { topItems, bottomItems } = useMemo(() => splitStaffItems(items), [items]);

  const topDurationSeconds = useMemo(
    () => Math.max(32, topItems.length * 8),
    [topItems.length],
  );
  const bottomDurationSeconds = useMemo(
    () => Math.max(32, bottomItems.length * 8),
    [bottomItems.length],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="space-y-4 md:space-y-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
    >
      <StaffRollerRow
        items={topItems}
        direction="left"
        durationSeconds={topDurationSeconds}
        paused={isPaused}
      />
      <StaffRollerRow
        items={bottomItems.length > 0 ? bottomItems : topItems}
        direction="right"
        durationSeconds={bottomItems.length > 0 ? bottomDurationSeconds : topDurationSeconds}
        paused={isPaused}
      />
    </div>
  );
};
