import { type ReactElement, type SVGProps } from "react";

import { cn } from "@/lib/utils";

export const iconTypes = [
  "twinkle",
  "check",
  "delete",
  "plus",
  "Plus",
  "github",
  "instagram",
  "linkedin",
] as const;

export type IconType = (typeof iconTypes)[number];

export type IconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  type: IconType;
  width?: number;
  height?: number;
};

const iconPathMap: Record<Exclude<IconType, "Plus">, ReactElement> = {
  twinkle: (
    <path
      d="M12 1.5L15.182 8.818L22.5 12L15.182 15.182L12 22.5L8.818 15.182L1.5 12L8.818 8.818L12 1.5Z"
      fill="currentColor"
    />
  ),
  check: (
    <path
      d="M3.5 12.5L9 18L20.5 6.5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  delete: (
    <>
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </>
  ),
  plus: (
    <>
      <path
        d="M12 4V20"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </>
  ),
  github: (
    <>
      <path
        d="M12 2.5C6.76 2.5 2.5 6.76 2.5 12C2.5 16.19 5.22 19.75 9 21.01V17.89C9 17.89 7.72 18.18 6.91 17.21C6.1 16.24 5.95 15.74 5.95 15.74C5.95 15.74 5.16 14.4 4.02 13.95C4.02 13.95 3.17 13.37 4.08 13.39C4.98 13.41 5.62 14.32 5.62 14.32C6.42 15.69 7.7 15.6 8.22 15.39C8.31 14.81 8.57 14.41 8.85 14.18C5.83 13.84 4.61 11.94 4.61 9.82C4.61 8.73 5 7.84 5.64 7.11C5.54 6.86 5.2 5.84 5.74 4.46C5.74 4.46 6.58 4.19 8.98 5.81C9.78 5.59 10.64 5.48 11.5 5.48C12.36 5.48 13.22 5.59 14.02 5.81C16.42 4.19 17.26 4.46 17.26 4.46C17.8 5.84 17.46 6.86 17.36 7.11C18 7.84 18.39 8.73 18.39 9.82C18.39 11.95 17.16 13.83 14.14 14.18C14.5 14.49 14.82 15.11 14.82 16.06V21.01C18.6 19.75 21.32 16.19 21.32 12C21.32 6.76 17.06 2.5 11.82 2.5H12Z"
        fill="currentColor"
      />
    </>
  ),
  instagram: (
    <>
      <rect
        x={3}
        y={3}
        width={18}
        height={18}
        rx={5}
        stroke="currentColor"
        strokeWidth={2}
      />
      <circle cx={12} cy={12} r={4} stroke="currentColor" strokeWidth={2} />
      <circle cx={17} cy={7} r={1.3} fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect
        x={3}
        y={3}
        width={18}
        height={18}
        rx={2.5}
        stroke="currentColor"
        strokeWidth={2}
      />
      <circle cx={8.2} cy={8.2} r={1.3} fill="currentColor" />
      <path
        d="M8.2 11.2V17"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M12 17V11.2"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M12 13.3C12 12.1 12.9 11.2 14.1 11.2C15.3 11.2 16.2 12.1 16.2 13.3V17"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </>
  ),
};

export const Icon = ({
  type,
  width = 24,
  height = 24,
  className,
  ...props
}: IconProps) => {
  const normalizedType = type === "Plus" ? "plus" : type;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      {iconPathMap[normalizedType]}
    </svg>
  );
};
