"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/teams", label: "대시보드" },
  { href: "/teams/vote", label: "투표" },
  { href: "/teams/result", label: "결과" },
] as const;

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map(({ href, label }) => {
        const isActive =
          href === "/teams" ? pathname === "/teams" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
              isActive
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:bg-muted cursor-pointer"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
