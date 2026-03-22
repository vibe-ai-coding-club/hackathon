"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent } from "react";

import { Logo } from "./logo";

const navItems = [
  { label: "행사 소개", href: "/" },
  { label: "갤러리", disabled: true },
] as const;

export const Navigation = () => {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isLanding) return;

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white bg-white drop-shadow">
        <nav className="mx-auto hidden w-full max-w-7xl items-center justify-between px-6 py-4.5 md:flex">
          <Link href="/" aria-label="딸깍톤 홈" onClick={handleLogoClick}>
            <Logo />
          </Link>

          <div className="flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.label}>
                  {"disabled" in item ? (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="typo-h6 cursor-not-allowed px-2 py-2 text-gray-400"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`typo-h6 px-2 py-2 transition-colors ${
                        isLanding
                          ? "text-gray-900"
                          : "text-gray-800 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/teams"
              className="rounded-xl bg-primary-400 px-5 py-3 text-[18px] leading-6.5 font-semibold tracking-[-0.4px] text-white transition-colors hover:bg-primary-500"
            >
              참가자 대시보드
            </Link>
          </div>
        </nav>

        <nav className="mx-auto flex w-full max-w-191.75 items-center justify-between px-5 pt-6 pb-2.5 md:hidden">
          <Link href="/" aria-label="딸깍톤 홈" onClick={handleLogoClick}>
            <Logo />
          </Link>

          <ul className="flex h-10 items-center gap-2.5">
            {navItems.map((item) => (
              <li key={item.label}>
                {"disabled" in item ? (
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="cursor-not-allowed px-2 py-2 text-[14px] leading-6 font-bold tracking-[-0.2px] text-gray-400"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-2 py-2 text-[14px] leading-6 font-bold tracking-[-0.2px] transition-colors ${
                      isLanding
                        ? "text-gray-900"
                        : "text-gray-800 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};
