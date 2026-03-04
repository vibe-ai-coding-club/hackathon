import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn(
        "h-[44px] w-[200px] shrink-0 rounded-[6px] bg-gray-300/80",
        className,
      )}
      aria-label="로고 플레이스홀더"
    />
  );
};
