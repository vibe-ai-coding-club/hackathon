"use client";

import { useState } from "react";

type VoterVerifyModalProps = {
  onVerified: (data: { memberId: string; name: string; teamId: string }) => void;
  onClose: () => void;
};

export const VoterVerifyModal = ({ onVerified, onClose }: VoterVerifyModalProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/vote/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message);
        return;
      }

      onVerified(json.data);
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
        <h2 className="typo-h6 mb-2">투표자 확인</h2>
        <p className="typo-body3 text-muted-foreground mb-6">
          참가 신청 시 등록한 이메일을 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 typo-body3 placeholder:text-muted-foreground focus:border-primary-400 focus:outline-none transition-colors"
              autoFocus
            />
            {error && <p className="mt-2 typo-caption1 text-error">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-3 typo-btn3 text-muted-foreground hover:bg-muted transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary-400 px-4 py-3 typo-btn3 text-white hover:bg-primary-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "확인 중..." : "확인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
