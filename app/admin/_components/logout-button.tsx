"use client";

import { adminLogout } from "@/app/actions/admin-auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const LogoutButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-md border border-border px-2.5 py-1 typo-caption1 text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-50 cursor-pointer transition-colors"
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
};
