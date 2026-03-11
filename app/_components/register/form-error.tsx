import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
};

export const FormError = ({ children, className }: Props) => (
  <p className={cn("typo-caption1 mt-1 text-error", className)}>{children}</p>
);
