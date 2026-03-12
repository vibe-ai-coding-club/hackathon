import { cn } from "@/lib/utils";

export const RadioDot = ({
  checked,
  variant = "primary",
}: {
  checked: boolean;
  variant?: "primary" | "gray";
}) => (
  <span
    className={cn(
      `flex size-4 shrink-0 items-center justify-center rounded-full border-2`,
      checked
        ? variant === "primary"
          ? "border-primary-400"
          : "border-gray-300"
        : "border-gray-300",
    )}
  >
    {checked && (
      <span
        className={cn(
          "size-2 rounded-full",
          variant === "primary" ? "bg-primary-400" : "bg-gray-300",
        )}
      />
    )}
  </span>
);
