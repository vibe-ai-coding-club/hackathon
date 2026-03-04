"use client";

import Link from "next/link";
import { Logo } from "./logo";

const navItems = [
  { label: "행사 소개", href: "/#intro", active: true },
  { label: "갤러리", href: "/#gallery", active: false },
] as const;

export const Navigation = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white bg-white/20 backdrop-blur-[10px]">
      <nav className="mx-auto hidden w-full max-w-[1280px] items-center justify-between px-6 py-[18px] md:flex">
        <Logo />
        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`typo-h6 px-2 py-2 transition-colors ${
                    item.active
                      ? "text-gray-900"
                      : "text-gray-800 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="rounded-[12px] bg-primary-400 px-5 py-3 text-[18px] leading-[26px] font-semibold tracking-[-0.4px] text-white transition-colors hover:bg-primary-500"
          >
            딸깍톤 신청하기
          </Link>
        </div>
      </nav>

      <nav className="mx-auto flex w-full max-w-[767px] items-center justify-between px-5 pt-6 pb-[10px] md:hidden">
        <Logo className="h-[20px] w-[90px] rounded-[3px]" />
        <ul className="flex h-10 items-center gap-[10px]">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`px-2 py-2 text-[14px] leading-[24px] font-bold tracking-[-0.2px] transition-colors ${
                  item.active
                    ? "text-gray-900"
                    : "text-gray-800 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
