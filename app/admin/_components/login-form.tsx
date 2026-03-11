"use client";

import { adminLogin } from "@/app/actions/admin-auth";
import { useActionState } from "react";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 typo-body3 outline-none focus:border-accent transition-colors";

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(adminLogin, {
    success: false,
    message: "",
  });

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <div className="rounded-lg border border-error/30 bg-error/5 p-2.5 typo-caption1 text-error">{state.message}</div>
      )}

      <div>
        <label htmlFor="admin-password" className="block typo-caption1 font-medium mb-1">
          비밀번호
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          className={inputClass}
          placeholder="비밀번호 입력"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-accent py-2 typo-btn3 font-bold text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        {isPending ? "확인 중..." : "로그인"}
      </button>
    </form>
  );
};
