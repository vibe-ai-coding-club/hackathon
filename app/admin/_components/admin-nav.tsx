"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "참가 신청" },
  { href: "/admin/projects", label: "프로젝트 현황" },
  { href: "/admin/vote", label: "투표 관리" },
];

export const AdminNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-0.5 rounded-lg bg-gray-100 p-0.5">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-1.5 typo-caption1 font-medium transition-all ${
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
