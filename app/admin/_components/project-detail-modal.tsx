"use client";

import { useEffect } from "react";
import type { SerializedProject } from "./project-table";

type ProjectDetailModalProps = {
  project: SerializedProject;
  onClose: () => void;
};

export const ProjectDetailModal = ({ project, onClose }: ProjectDetailModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
          <h3 className="typo-caption1 font-medium text-muted-foreground">프로젝트 정보</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 typo-caption1">
            <dt className="text-muted-foreground">프로젝트명</dt>
            <dd className="font-medium">{project.title}</dd>
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
            {project.demoUrl && (
              <>
                <dt className="text-muted-foreground">데모</dt>
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
          </dl>
        </section>

        {/* 설명 */}
        <section className="space-y-2">
          <h3 className="typo-caption1 font-medium text-muted-foreground">프로젝트 설명</h3>
          <p className="typo-caption1 whitespace-pre-wrap">{project.description}</p>
        </section>

        {/* 팀 정보 */}
        <section className="space-y-2">
          <h3 className="typo-caption1 font-medium text-muted-foreground">팀 정보</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 typo-caption1">
            <dt className="text-muted-foreground">대표자</dt>
            <dd>{project.team.name}</dd>
            <dt className="text-muted-foreground">이메일</dt>
            <dd>{project.team.email}</dd>
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
          <h3 className="typo-caption1 font-medium text-muted-foreground">등록 일시</h3>
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
      </div>
    </div>
  );
};
