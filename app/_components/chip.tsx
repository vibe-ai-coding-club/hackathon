import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ChipProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export const Chip = ({ label = "Chip", className, ...props }: ChipProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-[38px] bg-[#FDF9D5] px-[18px] py-[4px] typo-body3 text-[#FFBC03] md:px-[26px] md:py-[8px] md:typo-subtitle3",
        className,
      )}
      {...props}
    >
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
};
