import Link from "next/link";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-bold tracking-tight">
          ttalkkakthon
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/#intro" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            소개
          </Link>
          <Link href="/#schedule" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            일정
          </Link>
          <Link href="/#rules" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            규칙
          </Link>
          <Link href="/#notes" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            유의사항
          </Link>
          <Link href="/register" className="hidden sm:block text-muted-foreground hover:text-foreground transition-colors">
            신청
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-accent px-4 py-1.5 font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            신청하기
          </Link>
        </div>
      </nav>
    </header>
  );
};
