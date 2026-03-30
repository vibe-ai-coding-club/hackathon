import Image from "next/image";
import type { SerializedArchivedProject } from "./types";

type GalleryCardProps = {
  project: SerializedArchivedProject;
  onDetailClick: () => void;
};

const GRADIENT_PAIRS = [
  ["#FFB3B3", "#FFDAB3"],
  ["#FFDAB3", "#FFF1B3"],
  ["#B3E6CC", "#B3D9FF"],
  ["#B3D9FF", "#D4B3FF"],
  ["#D4B3FF", "#F2B3E6"],
  ["#F2B3E6", "#FFB3B3"],
  ["#B3F0E0", "#B3D4FF"],
  ["#FFD6E8", "#FFE6B3"],
  ["#D9B3FF", "#B3E0FF"],
  ["#B3FFD9", "#B3E6FF"],
  ["#FFE0B3", "#FFB3C4"],
  ["#C4B3FF", "#B3FFE0"],
];

const getRandomGradient = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pair = GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length];
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
};

export const GalleryCard = ({ project, onDetailClick }: GalleryCardProps) => {
  const rankLabel =
    project.isFinals && project.finalsRank != null
      ? `${project.finalsRank}등`
      : null;

  const titleText = project.teamName
    ? `${project.title} - ${project.teamName}`
    : project.title;

  const isFinals = project.isFinals;
  const imageBorderStyle = isFinals
    ? {
        background:
          "linear-gradient(white, white) padding-box, conic-gradient(#FF4444, #FF6B22, #FFAA00, #FFD700, #44DD44, #00CCAA, #2299FF, #4466FF, #7744FF, #AA44DD, #DD44AA, #FF4466, #FF4444) border-box",
        border: "2px solid transparent",
      }
    : {
        background: `linear-gradient(white, white) padding-box, ${getRandomGradient(project.id)} border-box`,
        border: "2px solid transparent",
      };

  return (
    <article className="overflow-hidden rounded-xl md:rounded-[14px]">
      {/* 이미지 영역 */}
      {project.demoUrl ? (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-3/2 overflow-hidden rounded-xl md:rounded-[14px] bg-white cursor-pointer"
          style={imageBorderStyle}
        >
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <>
              <Image
                src="/images/hero.webp"
                alt={project.title}
                fill
                className="object-cover opacity-15"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <span className="typo-subtitle1 md:typo-h6 text-gray-700 text-center line-clamp-2 font-bold">
                  {project.title}
                </span>
              </div>
            </>
          )}
          {rankLabel && (
            <div className="absolute top-3 left-3 rounded-lg bg-primary-400 px-2.5 py-1 typo-caption1 font-bold text-white shadow-sm">
              {rankLabel}
            </div>
          )}
        </a>
      ) : (
        <div
          className="relative aspect-3/2 overflow-hidden rounded-xl md:rounded-[14px] bg-white"
          style={imageBorderStyle}
        >
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <>
              <Image
                src="/images/hero.webp"
                alt={project.title}
                fill
                className="object-cover opacity-15"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <span className="typo-subtitle1 md:typo-h6 text-gray-700 text-center line-clamp-2 font-bold">
                  {project.title}
                </span>
              </div>
            </>
          )}
          {rankLabel && (
            <div className="absolute top-3 left-3 rounded-lg bg-primary-400 px-2.5 py-1 typo-caption1 font-bold text-white shadow-sm">
              {rankLabel}
            </div>
          )}
        </div>
      )}

      {/* 정보 영역 */}
      <div className="bg-gray-50 px-5 py-4 md:px-7 md:py-5">
        {/* 제목 + 좋아요 */}
        <div className="flex items-center justify-between gap-2">
          {project.demoUrl ? (
            <h3 className="typo-subtitle1 md:typo-h6 line-clamp-1">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {project.title}
              </a>
              {project.teamName && (
                <span className="text-gray-850 text-sm"> - {project.teamName}</span>
              )}
              {rankLabel && (
                <span className="ml-1.5 text-primary-400">{rankLabel}</span>
              )}
            </h3>
          ) : (
            <h3 className="typo-subtitle1 text-gray-850 md:typo-h6 line-clamp-1">
              {titleText}
              {rankLabel && (
                <span className="ml-1.5 text-primary-400">{rankLabel}</span>
              )}
            </h3>
          )}
          {project.likeCount > 0 && (
            <span className="typo-caption1 text-gray-500 shrink-0 flex justify-center">
              ♥ {project.likeCount}
            </span>
          )}
        </div>

        {/* 서비스 한줄 소개 */}
        <p className="typo-body2 mt-1 text-gray-700 line-clamp-2 h-12">
          {project.description ?? project.title}
        </p>

        {/* 아이콘 링크 + 심사 상세 */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {project.githubUrl && (
              <IconLink href={project.githubUrl} label="GitHub">
                <GitHubIcon />
              </IconLink>
            )}
            {project.demoUrl && (
              <IconLink href={project.demoUrl} label="데모">
                <LinkIcon />
              </IconLink>
            )}
            {project.videoUrl && (
              <IconLink href={project.videoUrl} label="영상">
                <VideoIcon />
              </IconLink>
            )}
          </div>
          <button
            type="button"
            onClick={onDetailClick}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 typo-caption1 font-medium text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            심사 상세 →
          </button>
        </div>
      </div>
    </article>
  );
};

const IconLink = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
  >
    {children}
  </a>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
    <path d="M6.5 8.5a3 3 0 004.243 0l2-2a3 3 0 00-4.243-4.243L7.5 3.257M9.5 7.5a3 3 0 00-4.243 0l-2 2a3 3 0 004.243 4.243L8.5 12.743" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VideoIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
    <path d="M6.5 4.5v7l5-3.5-5-3.5z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M0 8a8 8 0 1116 0A8 8 0 010 8zm8-6.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" />
  </svg>
);
