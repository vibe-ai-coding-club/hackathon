import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-bold tracking-tight">
          딸깍톤 2026
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/info" className="text-muted-foreground hover:text-foreground transition-colors">
            소개
          </Link>
          <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors">
            일정
          </Link>
          <Link href="/register" className="text-muted-foreground hover:text-foreground transition-colors">
            참가 신청
          </Link>
        </div>
      </nav>
    </header>
  );
};
