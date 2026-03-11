import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { FormError } from "./form-error";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  variant?: "default" | "white";
};

const variantClass = {
  default: "bg-gray-50",
  white: "bg-white",
} as const;

export const FormInput = ({
  error,
  variant = "default",
  className,
  ...props
}: Props) => (
  <>
    <input
      className={cn(
        "w-full rounded-lg px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40",
        variantClass[variant],
        className,
      )}
      {...props}
    />
    {error && <FormError>{error}</FormError>}
  </>
);
