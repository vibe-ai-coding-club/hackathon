"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 backdrop-blur-sm transition-[border-color,background-color] duration-300 ${
        scrolled ? "border-b border-border bg-background/80" : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="typo-subtitle2 tracking-tight">
          ttalkkakthon
        </Link>
        <div className="typo-body3 flex items-center gap-6">
          <Link href="/#intro" className="font-bold text-foreground hover:text-primary-400 transition-colors">
            행사 소개
          </Link>
          <Link href="/#gallery" className="font-bold text-foreground hover:text-primary-400 transition-colors">
            갤러리
          </Link>
          <Link href="/projects/submit" className="font-bold text-foreground hover:text-primary-400 transition-colors">
            프로젝트 등록
          </Link>
          <Link
            href="/register"
            className="typo-btn3 hidden rounded-lg bg-primary-400 px-6 py-2 text-white hover:bg-primary-500 transition-colors sm:block"
          >
            딸깍톤 신청하기
          </Link>
        </div>
      </nav>
    </header>
  );
};
