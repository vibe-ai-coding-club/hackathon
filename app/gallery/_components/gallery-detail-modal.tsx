"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SerializedArchivedProject } from "./types";

type GalleryDetailModalProps = {
  project: SerializedArchivedProject;
  onClose: () => void;
};

type MemberInfo = { name: string; email: string; isLeader: boolean };

export const GalleryDetailModal = ({
  project,
  onClose,
}: GalleryDetailModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const members = Array.isArray(project.members)
    ? (project.members as MemberInfo[])
    : [];

  const rankLabel =
    project.isFinals && project.finalsRank != null
      ? `본선 ${project.finalsRank}등`
      : project.isFinals
        ? "본선 진출"
        : null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-200 max-h-[90vh] flex flex-col rounded-2xl bg-white overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5 border-b border-gray-100">
          <div>
            <h2 className="typo-h5 md:typo-h4 text-gray-900">
              {project.title}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
              {project.teamName && (
                <span className="typo-subtitle3 text-gray-600">
                  {project.teamName}
                </span>
              )}
              {rankLabel && (
                <span className="rounded-lg bg-primary-400 px-2.5 py-0.5 typo-caption1 font-bold text-white">
                  {rankLabel}
                </span>
              )}
              {project.likeCount > 0 && (
                <span className="typo-caption1 text-gray-500">
                  ♥ {project.likeCount}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 ml-4 mt-1 size-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6 space-y-6">
          {/* 유튜브 영상 */}
          {project.videoUrl && getYouTubeId(project.videoUrl) && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(project.videoUrl)}`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}

          {/* 프로젝트 정보 */}
          {project.description && (
            <InfoBlock title="소개" content={project.description} />
          )}
          {project.features && (
            <InfoBlock title="주요 기능" content={project.features} />
          )}
          {project.tools && (
            <InfoBlock title="사용 기술" content={project.tools} />
          )}
          {project.motivation && (
            <InfoBlock title="참가 동기" content={project.motivation} />
          )}
          {project.recruitmentNote && (
            <InfoBlock title="팀 주제" content={project.recruitmentNote} />
          )}

          {/* 링크 */}
          {(project.githubUrl || project.demoUrl || project.videoUrl) && (
            <div className="flex flex-wrap gap-3">
              {project.githubUrl && (
                <ExternalLink href={project.githubUrl} label="GitHub" />
              )}
              {project.demoUrl && (
                <ExternalLink href={project.demoUrl} label="데모" />
              )}
              {project.videoUrl && (
                <ExternalLink href={project.videoUrl} label="영상" />
              )}
            </div>
          )}

          {/* 멤버 */}
          {members.length > 0 && (
            <div>
              <h3 className="typo-subtitle2 text-gray-900">팀원</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {members.map((m) => (
                  <span
                    key={m.email}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 typo-caption1 text-gray-700"
                  >
                    {m.name}
                    {m.isLeader && (
                      <span className="ml-1 text-primary-400 font-medium">
                        리더
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI 심사 결과 */}
          {project.promptFeedback && (
            <FeedbackBlock
              title="AI 심사 결과"
              score={project.promptScore}
              content={project.promptFeedback}
            />
          )}

          {/* 냥심사 결과 */}
          {project.catFeedback && (
            <FeedbackBlock
              title="냥심사 결과"
              score={project.catScore}
              content={project.catFeedback}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ title, content }: { title: string; content: string }) => (
  <div>
    <h3 className="typo-subtitle2 text-gray-900">{title}</h3>
    <p className="typo-body2 mt-1.5 text-gray-700 whitespace-pre-line">
      {content}
    </p>
  </div>
);

const FeedbackBlock = ({
  title,
  score,
  content,
}: {
  title: string;
  score: number | null;
  content: string;
}) => (
  <div className="rounded-xl bg-gray-50 px-5 py-5 md:px-7 md:py-6">
    <div className="flex items-center justify-between">
      <h3 className="typo-subtitle2 text-gray-900">{title}</h3>
      {score != null && (
        <span className="typo-h6 text-primary-400">{score}점</span>
      )}
    </div>
    <div className="mt-3 prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-800 prose-hr:border-gray-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  </div>
);

const ExternalLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 typo-btn4 text-gray-700 transition-colors hover:bg-gray-100"
  >
    {label} →
  </a>
);

const getYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
};
