import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  description?: string;
  variant?: "default" | "white";
};

const variantClass = {
  default: "bg-gray-50",
  white: "bg-white",
} as const;

export const FormInput = ({
  error,
  description,
  variant = "default",
  className,
  ...props
}: Props) => (
  <>
    <input
      className={cn(
        "w-full rounded-lg p-4 typo-body2 sm:typo-body1 placeholder:typo-body2 sm:placeholder:typo-body1 placeholder:text-gray-500 outline-none border transition-colors",
        error ? "border-[#F55959]" : "border-transparent focus:border-gray-500",
        variantClass[variant],
        className,
      )}
      {...props}
    />
    {error ? (
      <p className="typo-body3 sm:typo-body1 mt-1 text-[#F55959]">{error}</p>
    ) : description ? (
      <p className="typo-body3 sm:typo-body1 mt-1 text-gray-500">
        {description}
      </p>
    ) : null}
  </>
);
