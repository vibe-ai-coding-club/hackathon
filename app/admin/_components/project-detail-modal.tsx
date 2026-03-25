"use client";

import { useEffect, useState } from "react";
import { EVALUATION_PROMPT } from "@/lib/prompts";
import type { SerializedProject } from "./project-table";

type ProjectDetailModalProps = {
  project: SerializedProject;
  onClose: () => void;
};

function fillEvaluationPrompt(project: SerializedProject) {
  const placeholders: Record<string, string> = {
    "{{title}}": project.title,
    "{{description}}": project.description || "",
    "{{features}}": project.features || "",
    "{{tools}}": project.tools || "",
    "{{githubUrl}}": project.githubUrl || "",
    "{{demoUrl}}": project.demoUrl || "",
    "{{videoUrl}}": project.videoUrl || "",
    "{{linkUrl}}": project.linkUrl || "",
  };
  let result = EVALUATION_PROMPT;
  for (const [key, value] of Object.entries(placeholders)) {
    result = result.replace(key, value);
  }
  return result;
}

export const ProjectDetailModal = ({
  project,
  onClose,
}: ProjectDetailModalProps) => {
  const [promptResult, setPromptResult] = useState(
    project.promptResult ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showEvalPrompt, setShowEvalPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSavePromptResult = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptResult }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCopyEvalPrompt = async () => {
    const prompt = fillEvaluationPrompt(project);
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
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg border border-border bg-background p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="typo-subtitle2">프로젝트 상세</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-base leading-none"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {/* 프로젝트 정보 */}
        <section className="space-y-2">
          <h3 className="typo-caption1 font-medium text-muted-foreground">
            프로젝트 정보
          </h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 typo-caption1">
            <dt className="text-muted-foreground">프로젝트명</dt>
            <dd className="font-medium">{project.title}</dd>
            {project.githubUrl && (
              <>
                <dt className="text-muted-foreground">GitHub</dt>
                <dd>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {project.githubUrl}
                  </a>
                </dd>
              </>
            )}
            {project.demoUrl && (
              <>
                <dt className="text-muted-foreground">배포</dt>
                <dd>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {project.demoUrl}
                  </a>
                </dd>
              </>
            )}
            {project.videoUrl && (
              <>
                <dt className="text-muted-foreground">영상</dt>
                <dd>
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {project.videoUrl}
                  </a>
                </dd>
              </>
            )}
            {project.linkUrl && (
              <>
                <dt className="text-muted-foreground">추가 링크</dt>
                <dd>
                  <a
                    href={project.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {project.linkUrl}
                  </a>
                </dd>
              </>
            )}
            {project.tools && (
              <>
                <dt className="text-muted-foreground">사용 도구</dt>
                <dd>{project.tools}</dd>
              </>
            )}
          </dl>
        </section>

        {/* 설명 */}
        {project.description && (
          <section className="space-y-2">
            <h3 className="typo-caption1 font-medium text-muted-foreground">
              프로젝트 설명
            </h3>
            <p className="typo-caption1 whitespace-pre-wrap">
              {project.description}
            </p>
          </section>
        )}

        {/* 핵심 기능 */}
        {project.features && (
          <section className="space-y-2">
            <h3 className="typo-caption1 font-medium text-muted-foreground">
              핵심 기능 / 기획 내용
            </h3>
            <p className="typo-caption1 whitespace-pre-wrap">
              {project.features}
            </p>
          </section>
        )}

        {/* 팀 정보 */}
        <section className="space-y-2">
          <h3 className="typo-caption1 font-medium text-muted-foreground">
            팀 정보
          </h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 typo-caption1">
            <dt className="text-muted-foreground">대표자</dt>
            <dd>{project.team.leaderName}</dd>
            <dt className="text-muted-foreground">이메일</dt>
            <dd>{project.team.leaderEmail}</dd>
            {project.team.teamName && (
              <>
                <dt className="text-muted-foreground">팀명</dt>
                <dd>{project.team.teamName}</dd>
              </>
            )}
          </dl>
        </section>

        {/* 등록 일시 */}
        <section className="space-y-2">
          <h3 className="typo-caption1 font-medium text-muted-foreground">
            등록 일시
          </h3>
          <p className="typo-caption1">
            {new Date(project.createdAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </section>

        {/* 심사 프롬프트 */}
        <section className="space-y-2 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <h3 className="typo-caption1 font-medium text-muted-foreground">
              심사 프롬프트
            </h3>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setShowEvalPrompt((v) => !v)}
                className="rounded-md border border-border px-2.5 py-1 text-xs cursor-pointer transition-colors hover:bg-muted"
              >
                {showEvalPrompt ? "프롬프트 닫기" : "프롬프트 보기"}
              </button>
              <button
                type="button"
                onClick={handleCopyEvalPrompt}
                className={`rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                  copiedPrompt
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-accent text-white hover:bg-accent-hover"
                }`}
              >
                {copiedPrompt ? "복사됨!" : "프롬프트 복사"}
              </button>
            </div>
          </div>

          {showEvalPrompt && (
            <pre className="overflow-y-auto max-h-60 rounded-md bg-muted p-3 text-xs leading-relaxed whitespace-pre-wrap wrap-break-word font-mono text-foreground/80">
              {fillEvaluationPrompt(project)}
            </pre>
          )}
        </section>

        {/* 프롬프트 결과 입력 */}
        <section className="space-y-2 border-t border-border pt-4">
          <h3 className="typo-caption1 font-medium text-muted-foreground">
            프롬프트 결과
          </h3>
          <textarea
            value={promptResult}
            onChange={(e) => setPromptResult(e.target.value)}
            placeholder="AI 심사 프롬프트 결과를 붙여넣으세요..."
            rows={6}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs leading-relaxed outline-none focus:border-accent transition-colors resize-y"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSavePromptResult}
              disabled={saving}
              className={`rounded-md px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                saved
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-accent text-white hover:bg-accent-hover disabled:opacity-50"
              }`}
            >
              {saving ? "저장 중..." : saved ? "저장됨!" : "결과 저장"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
