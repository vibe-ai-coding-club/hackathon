"use client";

import { useState } from "react";

import type { InfoTabItem } from "@/app/sections/landing-data";
import { cn } from "@/lib/utils";

import { InfoCard } from "./info-card";

type InfoTabProps = {
  tabs: InfoTabItem[];
};

export const InfoTab = ({ tabs }: InfoTabProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-2 md:mb-10 md:gap-3">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={tab.label}
              type="button"
              className={cn(
                "relative cursor-pointer px-2 py-2 typo-subtitle2 hover:cursor-pointer md:typo-h6",
                isActive ? "text-gray-900" : "text-gray-800",
              )}
              onClick={() => setActiveIndex(index)}
            >
              {tab.label}
              {isActive ? (
                <span className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-current" />
              ) : null}
            </button>
          );
        })}
      </div>

      <ul>
        {tabs[activeIndex]?.content.map((content, index) => (
          <InfoCard key={`${tabs[activeIndex].label}-${index}`} index={index} content={content} />
        ))}
      </ul>
    </div>
  );
};
