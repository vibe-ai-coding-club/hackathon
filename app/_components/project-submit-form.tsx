"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type FormState = {
  email: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
};

const initialForm: FormState = {
  email: "",
  title: "",
  description: "",
  githubUrl: "",
  demoUrl: "",
};

const inputClass =
  "w-full rounded-lg bg-gray-50 px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40";

export const ProjectSubmitForm = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [toast, setToast] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "올바른 이메일을 입력해주세요";

    if (!form.title.trim()) newErrors.title = "프로젝트 이름을 입력해주세요";
    else if (form.title.length > 100)
      newErrors.title = "프로젝트 이름은 100자 이하로 입력해주세요";

    if (!form.description.trim())
      newErrors.description = "프로젝트 설명을 입력해주세요";
    else if (form.description.length > 2000)
      newErrors.description = "프로젝트 설명은 2000자 이하로 입력해주세요";

    if (!form.githubUrl.trim())
      newErrors.githubUrl = "GitHub 링크를 입력해주세요";
    else {
      try {
        const url = new URL(form.githubUrl);
        if (!url.hostname.endsWith("github.com"))
          newErrors.githubUrl = "GitHub 링크를 입력해주세요";
      } catch {
        newErrors.githubUrl = "올바른 URL을 입력해주세요";
      }
    }

    if (form.demoUrl.trim()) {
      try {
        new URL(form.demoUrl);
      } catch {
        newErrors.demoUrl = "올바른 URL을 입력해주세요";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (success: boolean, message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ success, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const isReady =
    form.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.title.trim().length > 0 &&
    form.description.trim().length > 0 &&
    (() => {
      try {
        return new URL(form.githubUrl).hostname.endsWith("github.com");
      } catch {
        return false;
      }
    })();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsPending(true);

    try {
      const formData = new FormData();
      formData.set("email", form.email);
      formData.set("title", form.title);
      formData.set("description", form.description);
      formData.set("githubUrl", form.githubUrl);
      if (form.demoUrl) formData.set("demoUrl", form.demoUrl);

      const res = await fetch("/api/projects/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      showToast(data.success, data.message);
      if (data.success) setForm(initialForm);
    } catch {
      showToast(false, "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 대표자 이메일 */}
        <div>
          <label htmlFor="proj-email" className="typo-subtitle1 mb-2 block">
            대표자 이메일 <span className="text-error">*</span>
          </label>
          <p className="typo-caption1 mb-2 text-gray-500">
            참가 신청 시 사용한 대표자 이메일을 입력해주세요
          </p>
          <input
            id="proj-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="example@email.com"
            className={inputClass}
          />
          {errors.email && (
            <p className="typo-caption1 mt-1 text-error">{errors.email}</p>
          )}
        </div>

        {/* 프로젝트 이름 */}
        <div>
          <label htmlFor="proj-title" className="typo-subtitle1 mb-2 block">
            프로젝트 이름 <span className="text-error">*</span>
          </label>
          <input
            id="proj-title"
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="프로젝트 이름을 입력해주세요"
            maxLength={100}
            className={inputClass}
          />
          {errors.title && (
            <p className="typo-caption1 mt-1 text-error">{errors.title}</p>
          )}
        </div>

        {/* 프로젝트 설명 */}
        <div>
          <label
            htmlFor="proj-description"
            className="typo-subtitle1 mb-2 block"
          >
            프로젝트 설명 <span className="text-error">*</span>
          </label>
          <textarea
            id="proj-description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="프로젝트에 대해 설명해주세요"
            maxLength={2000}
            rows={6}
            className={`${inputClass} resize-y`}
          />
          {errors.description && (
            <p className="typo-caption1 mt-1 text-error">
              {errors.description}
            </p>
          )}
        </div>

        {/* GitHub 링크 */}
        <div>
          <label htmlFor="proj-github" className="typo-subtitle1 mb-2 block">
            GitHub 링크 <span className="text-error">*</span>
          </label>
          <input
            id="proj-github"
            type="url"
            value={form.githubUrl}
            onChange={(e) => update("githubUrl", e.target.value)}
            placeholder="https://github.com/username/repository"
            className={inputClass}
          />
          {errors.githubUrl && (
            <p className="typo-caption1 mt-1 text-error">{errors.githubUrl}</p>
          )}
        </div>

        {/* 데모 링크 */}
        <div>
          <label htmlFor="proj-demo" className="typo-subtitle1 mb-2 block">
            데모 링크
          </label>
          <input
            id="proj-demo"
            type="url"
            value={form.demoUrl}
            onChange={(e) => update("demoUrl", e.target.value)}
            placeholder="https://example.com"
            className={inputClass}
          />
          {errors.demoUrl && (
            <p className="typo-caption1 mt-1 text-error">{errors.demoUrl}</p>
          )}
        </div>

        {/* 허니팟 */}
        <div className="absolute -z-10 opacity-0" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* 제출 */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isPending}
            className={`typo-btn2 cursor-pointer rounded-xl px-12 py-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isReady
                ? "bg-primary-400 text-white hover:bg-primary-500"
                : "bg-gray-100 text-foreground hover:bg-gray-200"
            }`}
          >
            {isPending ? "등록 중..." : "프로젝트 등록하기"}
          </button>
          <p className="typo-caption1 mt-3 text-gray-500">
            등록된 프로젝트는 갤러리에 공개돼요
          </p>
        </div>
      </form>

      {/* 토스트 */}
      <div
        className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-6 py-3.5 shadow-lg transition-all duration-300 ${
          toast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        } ${toast?.success ? "bg-success text-white" : "bg-error text-white"}`}
      >
        <span className="typo-subtitle4">{toast?.message}</span>
        <button
          type="button"
          onClick={() => setToast(null)}
          className="ml-1 shrink-0 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
        >
          <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </>
  );
};
