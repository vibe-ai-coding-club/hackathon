"use client";

import { useCallback, useEffect, useState } from "react";

export const RegistrationSettingControl = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [closedAt, setClosedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchSetting = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/registration-setting");
      const json = await res.json();
      if (json.success) {
        setIsClosed(json.data.isClosed);
        setClosedAt(json.data.closedAt);
      }
    } catch {
      console.error("Failed to fetch registration setting");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSetting();
  }, [fetchSetting]);

  const handleToggle = async () => {
    const next = !isClosed;
    const confirmMessage = next
      ? "신청을 마감하시겠습니까? 마감 후에는 새로운 신청이 불가합니다."
      : "신청을 다시 오픈하시겠습니까?";

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/registration-setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isClosed: next }),
      });
      const json = await res.json();
      if (json.success) {
        setIsClosed(json.data.isClosed);
        setClosedAt(json.data.isClosed ? new Date().toISOString() : null);
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center gap-2 typo-caption1 text-muted-foreground">
        신청 상태 확인 중...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-2 w-2 rounded-full shrink-0 ${isClosed ? "bg-error" : "bg-success animate-pulse"}`}
      />
      <span className="typo-caption1">
        {isClosed ? "신청 마감됨" : "신청 접수 중"}
      </span>
      {isClosed && closedAt && (
        <span className="typo-caption2 text-muted-foreground">
          {new Date(closedAt).toLocaleString("ko-KR")}
        </span>
      )}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`rounded-md px-3 py-1 typo-btn4 text-white transition-colors disabled:opacity-50 cursor-pointer ${
          isClosed
            ? "bg-success hover:opacity-90"
            : "bg-error hover:opacity-90"
        }`}
      >
        {loading ? "처리 중..." : isClosed ? "신청 오픈" : "신청 마감"}
      </button>
    </div>
  );
};
