"use client";

import { useState } from "react";
import { PARTICIPANT_PROMPT } from "@/lib/prompts";
import { useTeamBoard } from "./context";
import type { Project } from "./types";

type PromptView = "prompt" | "submit";

function fillPrompt(
  template: string,
  project: Project | null,
) {
  const placeholders: Record<string, string> = {
    "{{title}}": project?.title || "(프로젝트명을 입력하세요)",
    "{{description}}": project?.description || "(프로젝트 설명을 입력하세요)",
    "{{features}}": project?.features || "(핵심 기능/기획 내용을 입력하세요)",
    "{{tools}}": project?.tools || "(제작 방식/사용 도구를 입력하세요)",
    "{{githubUrl}}": project?.githubUrl || "(GitHub URL을 입력하세요)",
    "{{demoUrl}}": project?.demoUrl || "(배포 URL을 입력하세요)",
    "{{videoUrl}}": project?.videoUrl || "(데모 영상 링크를 입력하세요)",
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
  const [view, setView] = useState<PromptView>("prompt");
  const [copied, setCopied] = useState(false);
  const [promptResult, setPromptResult] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const prompt = fillPrompt(PARTICIPANT_PROMPT, myTeam?.project ?? null);

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

  const handleSubmit = async () => {
    if (!promptResult.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/teams/project/prompt-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptResult }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
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
          {view === "prompt" && (
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
          )}
        </div>

        {/* 탭 */}
        <div className="flex gap-1 rounded-md bg-muted p-1">
          <button
            type="button"
            onClick={() => setView("prompt")}
            className={`flex-1 rounded px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
              view === "prompt"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            제출 도우미
          </button>
          <button
            type="button"
            onClick={() => setView("submit")}
            disabled={!myTeam?.project}
            className={`flex-1 rounded px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              view === "submit"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            결과 제출
          </button>
        </div>

        {view === "prompt" && (
          <>
            <p className="text-xs text-muted-foreground">
              아래 프롬프트를 복사해서 AI에 붙여넣은 뒤, 결과를 &quot;결과 제출&quot; 탭에서 제출하세요.
            </p>

            {!myTeam?.project && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-md px-3 py-2">
                프로젝트를 먼저 등록하면 프로젝트 정보가 자동으로 채워집니다.
              </p>
            )}

            <pre className="flex-1 overflow-y-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap wrap-break-word font-mono text-foreground/80">
              {prompt}
            </pre>
          </>
        )}

        {view === "submit" && (
          <>
            <p className="text-xs text-muted-foreground">
              AI가 생성한 결과를 아래에 붙여넣고 제출하세요.
            </p>

            {submitted ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-emerald-600 font-medium">
                  제출 완료되었습니다!
                </p>
              </div>
            ) : (
              <>
                <textarea
                  value={promptResult}
                  onChange={(e) => setPromptResult(e.target.value)}
                  placeholder="AI 결과를 여기에 붙여넣으세요..."
                  className="flex-1 w-full rounded-md border border-border bg-background px-3 py-2 text-xs leading-relaxed outline-none focus:border-accent transition-colors resize-none min-h-[200px]"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !promptResult.trim()}
                    className="rounded-md bg-accent text-white px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "제출 중..." : "결과 제출"}
                  </button>
                </div>
              </>
            )}
          </>
        )}

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
