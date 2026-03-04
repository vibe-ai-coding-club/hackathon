"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "참가 신청" },
  { href: "/admin/projects", label: "프로젝트 현황" },
  { href: "/admin/votes", label: "투표 관리" },
];

export const AdminNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-lg bg-muted p-1">
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
