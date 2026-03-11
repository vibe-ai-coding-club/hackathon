import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export const FormCaption = ({ children, className }: Props) => (
  <p className={cn("typo-caption1 mb-2 text-gray-500", className)}>
    {children}
  </p>
);
