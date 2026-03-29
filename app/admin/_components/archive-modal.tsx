"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ArchiveModalProps = {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onArchived: () => void;
};

export const ArchiveModal = ({
  projectId,
  projectTitle,
  onClose,
  onArchived,
}: ArchiveModalProps) => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [alreadyArchived, setAlreadyArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    fetch(`/api/admin/archive/preview/${projectId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
          setAlreadyArchived(res.alreadyArchived);
        } else {
          setError(res.message ?? "데이터 조회 실패");
        }
      })
      .catch(() => setError("네트워크 오류"))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        onArchived();
        onClose();
        router.refresh();
      } else {
        setError(result.message ?? "저장 실패");
      }
    } catch {
      setError("네트워크 오류");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-lg border border-border bg-background">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="typo-subtitle2">아카이빙 미리보기</h3>
            <p className="typo-caption2 text-muted-foreground">{projectTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {alreadyArchived && (
              <span className="typo-caption2 text-warning px-2 py-0.5 rounded bg-warning/10">
                이미 아카이빙됨
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {loading && (
            <p className="text-center text-muted-foreground typo-caption1 py-8">
              데이터 조회 중...
            </p>
          )}
          {error && (
            <p className="text-center text-error typo-caption1 py-8">
              {error}
            </p>
          )}
          {data && (
            <pre
              ref={preRef}
              className="typo-caption2 text-foreground whitespace-pre-wrap break-all leading-relaxed"
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 typo-btn4 cursor-pointer transition-colors hover:bg-muted"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!data || saving}
            className="rounded-md bg-accent px-3 py-1.5 typo-btn4 text-white cursor-pointer transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {saving
              ? "저장 중..."
              : alreadyArchived
                ? "덮어쓰기"
                : "아카이빙 저장"}
          </button>
        </div>
      </div>
    </div>
  );
};
