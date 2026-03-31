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
      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 typo-caption1 text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 cursor-pointer transition-colors"
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
};
