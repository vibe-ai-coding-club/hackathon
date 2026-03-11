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
      "flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 transition-colors",
      checked
        ? variant === "primary"
          ? "bg-primary-025 ring-2 ring-primary-400"
          : "bg-gray-100 ring-2 ring-gray-300"
        : "bg-gray-50",
      className,
    )}
  >
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    <RadioDot checked={checked} />
    <span>
      <span className="typo-subtitle2">{label}</span>
      {description && <span className="typo-body3 ml-2 text-gray-500">{description}</span>}
    </span>
  </label>
);
