"use client";

import { useState } from "react";
import { PARTICIPANT_PROMPT, EVALUATION_PROMPT } from "@/lib/prompts";
import { useTeamBoard } from "./context";

type PromptTab = "participant" | "evaluation";

const TABS: { key: PromptTab; label: string; description: string }[] = [
  {
    key: "participant",
    label: "제출 도우미",
    description: "AI에게 프로젝트 제출 내용 작성을 도움받을 수 있는 프롬프트입니다.",
  },
  {
    key: "evaluation",
    label: "심사 미리보기",
    description: "실제 심사 기준으로 내 프로젝트를 미리 평가받아볼 수 있는 프롬프트입니다.",
  },
];

const PROMPT_MAP: Record<PromptTab, string> = {
  participant: PARTICIPANT_PROMPT,
  evaluation: EVALUATION_PROMPT,
};

function fillPrompt(
  template: string,
  project: { title: string; description: string; githubUrl: string; demoUrl: string | null; linkUrl: string | null } | null,
) {
  const placeholders: Record<string, string> = {
    "{{title}}": project?.title || "(프로젝트명을 입력하세요)",
    "{{description}}": project?.description || "(프로젝트 설명을 입력하세요)",
    "{{githubUrl}}": project?.githubUrl || "(GitHub URL을 입력하세요)",
    "{{demoUrl}}": project?.demoUrl || "(데모 URL을 입력하세요)",
    "{{linkUrl}}": project?.linkUrl || "(추가 링크를 입력하세요)",
  };
  let result = template;
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replace(key, value);
  }
  return result;
}

export const AiPromptModal = ({ onClose }: { onClose: () => void }) => {
  const { myTeam } = useTeamBoard();
  const [tab, setTab] = useState<PromptTab>("participant");
  const [copied, setCopied] = useState(false);

  const prompt = fillPrompt(PROMPT_MAP[tab], myTeam?.project ?? null);
  const currentTab = TABS.find((t) => t.key === tab)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-lg border border-border bg-background p-5 space-y-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="typo-subtitle1">AI 프롬프트</h3>
          <button
            type="button"
            onClick={handleCopy}
            className={`rounded-md px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-accent text-white hover:bg-accent-hover"
            }`}
          >
            {copied ? "복사됨!" : "클립보드 복사"}
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 rounded-md bg-muted p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => { setTab(t.key); setCopied(false); }}
              className={`flex-1 rounded px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                tab === t.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 안내 */}
        <p className="text-xs text-muted-foreground">{currentTab.description}</p>

        {!myTeam?.project && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-md px-3 py-2">
            프로젝트를 먼저 등록하면 프로젝트 정보가 자동으로 채워집니다.
          </p>
        )}

        <pre className="flex-1 overflow-y-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap wrap-break-word font-mono text-foreground/80">
          {prompt}
        </pre>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-muted"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
