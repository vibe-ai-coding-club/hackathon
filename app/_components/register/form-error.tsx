import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
};

export const FormError = ({ children, className }: Props) => (
  <p className={cn("typo-body3 mt-1 text-[#F55959]", className)}>{children}</p>
);
