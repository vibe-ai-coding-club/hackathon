import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  size?: "lg" | "sm";
  as?: "label" | "legend" | "p";
  className?: string;
};

export const FieldLabel = ({
  children,
  htmlFor,
  required,
  size = "lg",
  as: Tag = "label",
  className,
}: Props) => (
  <Tag
    {...(Tag === "label" ? { htmlFor } : {})}
    className={cn(
      "block",
      size === "lg" ? "typo-subtitle1 mb-2" : "typo-subtitle4 mb-1",
      className,
    )}
  >
    {children}
    {required && <span className="text-error"> *</span>}
  </Tag>
);
