"use client";

import { useEffect, useRef } from "react";
import type { ProjectResult } from "./result-board";

type Props = {
  project: ProjectResult;
  type: "prompt" | "cat";
  onClose: () => void;
};

export const FeedbackModal = ({ project, type, onClose }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const feedback =
    type === "prompt" ? project.promptFeedback : project.catFeedback;
  const title = type === "prompt" ? "기본 심사 결과" : "🐱 냥심사 결과";

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!feedback) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <div>
            <h3 className="typo-subtitle2">{title}</h3>
            <p className="typo-caption1 text-muted-foreground mt-0.5">
              {project.team.teamName ?? "개인"} — {project.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-6 py-4">
          <pre className="typo-body3 whitespace-pre-wrap break-words leading-relaxed">
            {feedback}
          </pre>
        </div>
      </div>
    </div>
  );
};
