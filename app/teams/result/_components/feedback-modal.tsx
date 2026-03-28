"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ProjectResult } from "./result-board";

type Props = {
  project: ProjectResult;
  type: "prompt" | "cat";
  onClose: () => void;
};

// 타이핑 중 불완전한 마크다운 테이블 행을 일반 텍스트로 변환
const sanitizePartialMd = (text: string): string => {
  const lines = text.split("\n");
  const last = lines[lines.length - 1];
  // 마지막 줄이 `|`로 시작하지만 `|`로 끝나지 않으면 불완전한 테이블 행
  // → `|`를 제거해서 일반 텍스트로 렌더링
  if (last && last.trimStart().startsWith("|") && !last.trimEnd().endsWith("|")) {
    lines[lines.length - 1] = last.replace(/\|/g, " ");
  }
  return lines.join("\n");
};

export const FeedbackModal = ({ project, type, onClose }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const feedback =
    type === "prompt" ? project.promptFeedback : project.catFeedback;
  const title = type === "prompt" ? "기본 심사 결과" : "🐱 냥심사 결과";

  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // 타이핑 효과
  useEffect(() => {
    if (!feedback) return;

    let index = 0;
    setDisplayedText("");
    setIsDone(false);

    const chars = [...feedback];
    const total = chars.length;

    const tick = () => {
      // 한 틱에 여러 글자 — 뒤로 갈수록 가속
      const chunkSize = Math.min(
        Math.max(1, Math.floor(index / 80) + 1),
        6,
      );
      const nextIndex = Math.min(index + chunkSize, total);
      setDisplayedText(chars.slice(0, nextIndex).join(""));
      index = nextIndex;

      if (index < total) {
        // 줄바꿈 뒤에는 짧은 멈춤
        const lastChar = chars[index - 1];
        const delay = lastChar === "\n" ? 60 : 12;
        timer = setTimeout(tick, delay);
      } else {
        setIsDone(true);
      }
    };

    let timer = setTimeout(tick, 300); // 초기 딜레이

    return () => clearTimeout(timer);
  }, [feedback]);

  // 스크롤을 하단으로 추적
  useEffect(() => {
    if (!isDone && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedText, isDone]);

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
        <div
          ref={contentRef}
          className="overflow-y-auto overscroll-contain px-6 py-4"
        >
          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none typo-body3 leading-relaxed">
            <Markdown remarkPlugins={[remarkGfm]}>{sanitizePartialMd(displayedText)}</Markdown>
            {!isDone && (
              <span className="inline-block w-1.5 h-4 bg-foreground animate-pulse ml-0.5 align-text-bottom" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
