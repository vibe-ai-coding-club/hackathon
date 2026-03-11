import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const FormTextarea = ({ className, ...props }: Props) => (
  <textarea
    className={cn(
      "w-full rounded-lg bg-gray-50 px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40 resize-y",
      className,
    )}
    {...props}
  />
);
