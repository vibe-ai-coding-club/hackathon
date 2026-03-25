"use client";

import { useState } from "react";
import { useTeamBoard } from "./context";

export const ProjectModal = () => {
  const { editingProject, setShowProjectModal, setEditingProject, handleProjectSaved } = useTeamBoard();
  const project = editingProject;

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [features, setFeatures] = useState(project?.features ?? "");
  const [tools, setTools] = useState(project?.tools ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(project?.linkUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!project;

  const onClose = () => {
    setEditingProject(null);
    setShowProjectModal(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("프로젝트명을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/teams/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project?.id ?? undefined,
          title,
          description,
          features,
          tools,
          githubUrl,
          demoUrl,
          videoUrl,
          linkUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        handleProjectSaved(
          {
            id: json.projectId ?? project?.id ?? "",
            title: title.trim(),
            description: description.trim() || null,
            features: features.trim() || null,
            tools: tools.trim() || null,
            githubUrl: githubUrl.trim() || null,
            demoUrl: demoUrl.trim() || null,
            videoUrl: videoUrl.trim() || null,
            linkUrl: linkUrl.trim() || null,
          },
          !isEdit,
        );
        onClose();
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
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg border border-border bg-background p-5 space-y-4">
        <h3 className="typo-subtitle1">
          {isEdit ? "프로젝트 수정" : "프로젝트 등록"}
        </h3>

        <div>
          <label className={labelClass}>프로젝트명 *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="프로젝트 이름"
            className={inputClass}
          />
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

        <div>
          <label className={labelClass}>핵심 기능 / 기획 내용</label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="주요 기능, 해결하려는 문제, 타겟 사용자 등"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>제작 방식 / 사용 도구</label>
          <input
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            placeholder="예: Claude, Cursor, React, Bubble 등"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>GitHub URL</label>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <label className={labelClass}>데모 영상 링크</label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube, Google Drive 등"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>추가 링크</label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="발표자료, 노션 등"
            className={inputClass}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md border border-border px-4 py-2 text-sm cursor-pointer transition-colors hover:bg-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-accent px-4 py-2 text-sm text-white cursor-pointer transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? "저장 중..." : isEdit ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};
