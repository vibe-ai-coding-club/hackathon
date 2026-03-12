import { cn } from "@/lib/utils";
import type { ChangeEventHandler, ReactNode } from "react";
import { RadioDot } from "./radio-dot";

type Props = {
  name: string;
  value?: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  label: ReactNode;
  description?: ReactNode;
  variant?: "primary" | "gray";
  className?: string;
};

export const FormRadioOption = ({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  variant = "primary",
  className,
}: Props) => (
  <label
    className={cn(
      "flex cursor-pointer items-center gap-3 rounded-lg p-3.5 sm:p-4 bg-gray-50 border transition-colors",
      checked
        ? variant === "primary"
          ? "border-primary-400"
          : "border-gray-300"
        : "border-transparent",
      className,
    )}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <RadioDot checked={checked} variant={variant} />
    <span className="flex items-center gap-2">
      <span className="typo-subtitle6 text-gray-900 sm:typo-subtitle5 sm:text-gray-700">
        {label}
      </span>
      {description && (
        <span className="typo-body3 sm:typo-body1 text-gray-500">
          {description}
        </span>
      )}
    </span>
  </label>
);
