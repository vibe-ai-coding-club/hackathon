"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-lg bg-gray-50 px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (phoneLast4.length !== 4) {
      setError("전화번호 뒷자리 4자리를 입력해주세요.");
      return;
    }

    setIsPending(true);
    try {
      const result = await signIn("credentials", {
        email,
        phoneLast4,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일 또는 전화번호가 일치하지 않습니다.");
      } else {
        router.push("/team-building");
        router.refresh();
      }
    } catch {
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="typo-h5">팀 빌딩</h1>
          <p className="typo-body3 mt-2 text-gray-500">
            신청 시 등록한 이메일과 전화번호 뒷자리로 로그인하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="typo-subtitle2 mb-1 block">
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="신청 시 등록한 이메일"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="login-phone" className="typo-subtitle2 mb-1 block">
              전화번호 뒷자리 4자리
            </label>
            <input
              id="login-phone"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1234"
              className={inputClass}
            />
          </div>

          {error && <p className="typo-caption1 text-error">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-primary-400 py-3 typo-subtitle2 text-white transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
