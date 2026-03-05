"use client";

import { useMemo, useState } from "react";

import type { CultureItem } from "@/app/sections/landing-data";
import { CultureCard } from "./culture-card";

type CultureCardRollerProps = {
  items: CultureItem[];
};

export const CultureCardRoller = ({ items }: CultureCardRollerProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const durationSeconds = useMemo(() => {
    return Math.max(20, items.length * 4);
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="culture-card-roller w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
    >
      <div
        className={`culture-card-roller-track ${isPaused ? "culture-card-roller-track-paused" : ""}`}
        style={{
          ["--culture-roll-duration" as string]: `${durationSeconds}s`,
        }}
      >
        <div className="culture-card-roller-row" aria-label="Culture cards">
          {items.map((item, index) => (
            <div key={`${item.title}-primary-${index}`} className="shrink-0">
              <CultureCard item={item} />
            </div>
          ))}
        </div>

        <div className="culture-card-roller-row" aria-hidden="true">
          {items.map((item, index) => (
            <div key={`${item.title}-duplicate-${index}`} className="shrink-0">
              <CultureCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
