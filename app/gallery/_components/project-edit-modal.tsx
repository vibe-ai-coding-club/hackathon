"use client";

import { useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string | null;
  features: string | null;
  tools: string | null;
  imageUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
};

type ProjectEditModalProps = {
  onClose: () => void;
};

export const ProjectEditModal = ({ onClose }: ProjectEditModalProps) => {
  const [step, setStep] = useState<"auth" | "edit">("auth");
  const [email, setEmail] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [authError, setAuthError] = useState("");
  const [authing, setAuthing] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleAuth = async () => {
    if (!email.trim() || !phoneLast4.trim()) {
      setAuthError("이메일과 전화번호 뒷4자리를 입력해주세요.");
      return;
    }
    setAuthing(true);
    setAuthError("");
    try {
      const res = await fetch("/api/gallery/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phoneLast4: phoneLast4.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setTeamName(json.teamName);
        setProjects(json.projects);
        if (json.projects.length === 1) {
          setSelectedProject(json.projects[0]);
        }
        setStep("edit");
      } else {
        setAuthError(json.message);
      }
    } catch {
      setAuthError("서버 오류가 발생했습니다.");
    } finally {
      setAuthing(false);
    }
  };

  if (step === "auth") {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="px-6 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6">
          <h3 className="typo-h5 md:typo-h4 text-gray-900">프로젝트 정보 수정</h3>
          <p className="typo-body2 text-gray-500 mt-1.5">
            참가 신청 시 등록한 이메일과 전화번호 뒷4자리로 인증해주세요.
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="등록한 이메일"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-400 transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                전화번호 뒷4자리
              </label>
              <input
                type="text"
                value={phoneLast4}
                onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1234"
                maxLength={4}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-400 transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
            </div>
          </div>

          {authError && <p className="text-xs text-red-500 mt-2">{authError}</p>}

          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleAuth}
              disabled={authing}
              className="rounded-xl bg-primary-400 px-5 py-2.5 text-sm font-medium text-white cursor-pointer transition-colors hover:bg-primary-500 disabled:opacity-50"
            >
              {authing ? "인증 중..." : "인증"}
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="shrink-0 px-6 pt-6 md:px-8 md:pt-8">
        <h3 className="typo-h5 md:typo-h4 text-gray-900">
          프로젝트 정보 수정
          <span className="ml-2 typo-subtitle3 font-normal text-gray-500">{teamName}</span>
        </h3>
      </div>

      {projects.length > 1 && !selectedProject && (
        <div className="px-6 md:px-8 mt-4 space-y-2 pb-6 md:pb-8">
          <p className="typo-body2 text-gray-500">수정할 프로젝트를 선택해주세요.</p>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedProject(p)}
              className="w-full text-left rounded-md border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <span className="font-medium">{p.title}</span>
              {p.description && (
                <span className="text-gray-500 ml-2 text-xs">{p.description}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {selectedProject && (
        <EditForm
          project={selectedProject}
          email={email}
          phoneLast4={phoneLast4}
          onClose={onClose}
          onBack={projects.length > 1 ? () => setSelectedProject(null) : undefined}
        />
      )}
    </ModalWrapper>
  );
};

const EditForm = ({
  project,
  email,
  phoneLast4,
  onClose,
  onBack,
}: {
  project: Project;
  email: string;
  phoneLast4: string;
  onClose: () => void;
  onBack?: () => void;
}) => {
  const [description, setDescription] = useState(project.description ?? "");
  const [imageUrl, setImageUrl] = useState(project.imageUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(project.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project.demoUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(project.videoUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(project.linkUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [fetchImage, setFetchImage] = useState(false);
  const [fetchVideo, setFetchVideo] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [readmeResult, setReadmeResult] = useState<{
    imageUrl: string | null;
    videoUrl: string | null;
  } | null>(null);

  const handleFetchReadme = async () => {
    if (!githubUrl.trim()) {
      setError("GitHub URL을 먼저 입력해주세요.");
      return;
    }
    setFetching(true);
    setError("");
    try {
      const res = await fetch("/api/gallery/readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setReadmeResult(json);
        if (fetchImage && json.imageUrl) {
          setImageUrl(json.imageUrl);
        }
        if (fetchVideo && json.videoUrl) {
          setVideoUrl(json.videoUrl);
        }
      } else {
        setError(json.message);
      }
    } catch {
      setError("README 조회에 실패했습니다.");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/gallery/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phoneLast4,
          projectId: project.id,
          description,
          githubUrl,
          demoUrl,
          videoUrl,
          linkUrl,
          imageUrl: fetchImage && readmeResult?.imageUrl ? readmeResult.imageUrl : imageUrl || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(onClose, 1500);
      } else {
        setError(json.message);
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-400 transition-colors";
  const labelClass = "text-xs font-medium text-gray-500 mb-1 block";

  if (saved) {
    return (
      <div className="mt-5 text-center py-8">
        <p className="text-green-600 font-medium">저장되었습니다!</p>
      </div>
    );
  }

  return (
    <>
      {/* 스크롤 영역: 폼 본문 */}
      <div className="overflow-y-auto min-h-0 px-6 md:px-8 mt-4 space-y-4">
        {/* 섹션 1: 프로젝트 기본 정보 */}
        <div className="space-y-3">
          <div>
            <label className={labelClass}>프로젝트명</label>
            <p className="text-sm text-gray-900 px-3 py-2 bg-gray-50 rounded-md">{project.title}</p>
          </div>

          <div>
            <label className={labelClass}>설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트에 대한 간단한 설명"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* 섹션 2: 링크 */}
        <div className="space-y-3">
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>배포 URL</label>
            <input
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>추가 URL</label>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="발표자료, 노션 등"
              className={inputClass}
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* 섹션 3: 컨텐츠 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-700">컨텐츠 등록하기</span>
              <p className="text-xs text-gray-400 mt-0.5">GitHub README에서 이미지와 유튜브 영상 URL을 가져옵니다.</p>
            </div>
            <button
              type="button"
              onClick={handleFetchReadme}
              disabled={fetching || !githubUrl.trim()}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-500 cursor-pointer transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {fetching ? "조회 중..." : "컨텐츠 가져오기"}
            </button>
          </div>
          {readmeResult && (
            <div className="space-y-1.5 rounded-md border border-primary-100 bg-primary-50 p-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-medium">대표 이미지:</span>
                {readmeResult.imageUrl ? (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fetchImage}
                      onChange={(e) => setFetchImage(e.target.checked)}
                      className="accent-primary-400"
                    />
                    <span className="text-gray-600 truncate max-w-60">{readmeResult.imageUrl}</span>
                  </label>
                ) : (
                  <span className="text-gray-400">이미지를 찾을 수 없습니다</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-400 font-medium">YouTube 영상:</span>
                {readmeResult.videoUrl ? (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fetchVideo}
                      onChange={(e) => {
                        setFetchVideo(e.target.checked);
                        if (e.target.checked && readmeResult.videoUrl) {
                          setVideoUrl(readmeResult.videoUrl);
                        }
                      }}
                      className="accent-primary-400"
                    />
                    <span className="text-gray-600 truncate max-w-60">{readmeResult.videoUrl}</span>
                  </label>
                ) : (
                  <span className="text-gray-400">YouTube URL을 찾을 수 없습니다</span>
                )}
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>대표 이미지 URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... (직접 입력 또는 컨텐츠 가져오기)"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>데모 영상 URL</label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube URL"
              className={inputClass}
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* 고정 푸터 */}
      <div className="shrink-0 border-t border-gray-100 px-6 py-4 md:px-8 flex justify-between items-center">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-50"
            >
              ← 프로젝트 선택
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-primary-400 px-5 py-2.5 text-sm font-medium text-white cursor-pointer transition-colors hover:bg-primary-500 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "수정"}
          </button>
        </div>
      </div>
    </>
  );
};

const ModalWrapper = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div
    className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl bg-white">
      {children}
    </div>
  </div>
);
