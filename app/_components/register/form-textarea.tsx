import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const FormTextarea = ({ className, ...props }: Props) => (
  <textarea
    className={cn(
      "w-full rounded-lg bg-gray-50 p-4 typo-body2 sm:typo-body1 placeholder:typo-body2 sm:placeholder:typo-body1 placeholder:text-gray-500 outline-none border border-transparent transition-colors focus:border-gray-500 resize-y",
      className,
    )}
    {...props}
  />
);
