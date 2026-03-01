"use client";

import { useState, type FormEvent } from "react";

type ParticipationType = "INDIVIDUAL" | "TEAM";
type ExperienceLevel = "BEGINNER" | "JUNIOR" | "SENIOR" | "VIBE_CODER";

const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "BEGINNER", label: "비개발자 / 입문" },
  { value: "JUNIOR", label: "주니어" },
  { value: "SENIOR", label: "시니어" },
  { value: "VIBE_CODER", label: "바이브코더" },
];

type MemberState = {
  name: string;
  email: string;
  experienceLevel: ExperienceLevel | "";
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  experienceLevel: ExperienceLevel | "";
  motivation: string;
  participationType: ParticipationType | "";
  teamName: string;
  members: MemberState[];
};

const createEmptyMember = (): MemberState => ({
  name: "",
  email: "",
  experienceLevel: "",
});

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  experienceLevel: "",
  motivation: "",
  participationType: "",
  teamName: "",
  members: [createEmptyMember()],
};

const MAX_MEMBERS = 3; // 대표자 포함 최대 4명

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors";

export const RegistrationForm = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const update = (field: keyof Omit<FormState, "members">, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "participationType" && value === "TEAM" && !prev.members?.length) {
        next.members = [createEmptyMember()];
      }
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateMember = (
    index: number,
    field: keyof MemberState,
    value: string,
  ) => {
    setForm((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [field]: value };
      return { ...prev, members };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`members.${index}.${field}`];
      return next;
    });
  };

  const addMember = () => {
    if (form.members.length >= MAX_MEMBERS) return;
    setForm((prev) => ({
      ...prev,
      members: [...prev.members, createEmptyMember()],
    }));
  };

  const removeMember = (index: number) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "이름을 입력해주세요";
    if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "올바른 이메일 주소를 입력해주세요";
    if (!form.phone.trim()) newErrors.phone = "연락처를 입력해주세요";
    else if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(form.phone))
      newErrors.phone = "올바른 전화번호를 입력해주세요";
    if (!form.experienceLevel)
      newErrors.experienceLevel = "개발 경험을 선택해주세요";
    if (!form.participationType)
      newErrors.participationType = "참가 유형을 선택해주세요";

    if (form.participationType === "TEAM") {
      if (!form.teamName.trim())
        newErrors.teamName = "팀 이름을 입력해주세요";
      form.members.forEach((member, i) => {
        if (!member.name.trim())
          newErrors[`members.${i}.name`] = "이름을 입력해주세요";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsPending(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      formData.set("participationType", form.participationType);
      formData.set("experienceLevel", form.experienceLevel);
      if (form.motivation) formData.set("motivation", form.motivation);
      if (form.participationType === "TEAM") {
        formData.set("teamName", form.teamName);
        const members = form.members.map((m) => ({
          name: m.name,
          ...(m.email && { email: m.email }),
          ...(m.experienceLevel && { experienceLevel: m.experienceLevel }),
        }));
        formData.set("members", JSON.stringify(members));
      }

      // TODO: 서버 액션으로 교체
      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setForm(initialForm);
    } catch {
      setResult({
        success: false,
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {result && !result.success && (
        <div className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">
          {result.message}
        </div>
      )}
      {result?.success && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-sm text-success">
          {result.message}
        </div>
      )}

      {/* 1. 기본 정보 (대표자) */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-bold">기본 정보</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium mb-1">
              이름 <span className="text-error">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="홍길동"
              maxLength={50}
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-error">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium mb-1">
              이메일 <span className="text-error">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="hello@example.com"
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="reg-phone" className="block text-sm font-medium mb-1">
            연락처 <span className="text-error">*</span>
          </label>
          <input
            id="reg-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="010-0000-0000"
            className={inputClass}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-error">{errors.phone}</p>
          )}
        </div>
      </fieldset>

      {/* 2. 추가 정보 (대표자) */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-bold">추가 정보</legend>

        <div>
          <p className="text-sm font-medium mb-3">
            개발 경험 <span className="text-error">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {experienceOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-colors ${
                  form.experienceLevel === opt.value
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border hover:border-accent/30"
                }`}
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={opt.value}
                  checked={form.experienceLevel === opt.value}
                  onChange={(e) => update("experienceLevel", e.target.value)}
                  className="accent-accent"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.experienceLevel && (
            <p className="mt-1 text-xs text-error">{errors.experienceLevel}</p>
          )}
        </div>

        <div>
          <label htmlFor="reg-motivation" className="block text-sm font-medium mb-1">
            참가 동기 또는 하고 싶은 말
          </label>
          <textarea
            id="reg-motivation"
            value={form.motivation}
            onChange={(e) => update("motivation", e.target.value)}
            placeholder="자유롭게 작성해 주세요. 진지함은 빼고!"
            maxLength={500}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>
      </fieldset>

      {/* 3. 참가 유형 */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-bold">
          참가 유형 <span className="text-error">*</span>
        </legend>

        <label
          className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
            form.participationType === "INDIVIDUAL"
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/30"
          }`}
        >
          <input
            type="radio"
            name="participationType"
            value="INDIVIDUAL"
            checked={form.participationType === "INDIVIDUAL"}
            onChange={(e) => update("participationType", e.target.value)}
            className="accent-accent"
          />
          <div>
            <span className="font-medium">개인 참여</span>
            <span className="ml-2 text-sm text-muted-foreground">
              혼자서 참가합니다
            </span>
          </div>
        </label>

        <label
          className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
            form.participationType === "TEAM"
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/30"
          }`}
        >
          <input
            type="radio"
            name="participationType"
            value="TEAM"
            checked={form.participationType === "TEAM"}
            onChange={(e) => update("participationType", e.target.value)}
            className="accent-accent"
          />
          <div>
            <span className="font-medium">팀 참여</span>
            <span className="ml-2 text-sm text-muted-foreground">
              팀으로 참가합니다
            </span>
          </div>
        </label>

        {errors.participationType && (
          <p className="text-xs text-error">{errors.participationType}</p>
        )}
      </fieldset>

      {/* 4. 팀 정보 + 팀원 입력 (팀 참여 시) */}
      {form.participationType === "TEAM" && (
        <fieldset className="space-y-6">
          <legend className="text-lg font-bold">팀 정보</legend>

          <div>
            <label htmlFor="reg-team-name" className="block text-sm font-medium mb-1">
              팀 이름 <span className="text-error">*</span>
            </label>
            <input
              id="reg-team-name"
              type="text"
              value={form.teamName}
              onChange={(e) => update("teamName", e.target.value)}
              placeholder="예: 바이브코더즈"
              maxLength={50}
              className={inputClass}
            />
            {errors.teamName && (
              <p className="mt-1 text-xs text-error">{errors.teamName}</p>
            )}
          </div>

          {/* 팀원 목록 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                팀원{" "}
                <span className="text-muted-foreground font-normal">
                  (대표자 제외, 최대 {MAX_MEMBERS}명)
                </span>
              </p>
              <span className="text-xs text-muted-foreground">
                {form.members?.length ?? 0}/{MAX_MEMBERS}명
              </span>
            </div>

            {(form.members ?? []).map((member, index) => (
              <div
                key={index}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    팀원 {index + 1}
                  </span>
                  {form.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-sm text-error hover:text-error/80 cursor-pointer"
                    >
                      삭제
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      이름 <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, "name", e.target.value)
                      }
                      placeholder="홍길동"
                      maxLength={50}
                      className={inputClass}
                    />
                    {errors[`members.${index}.name`] && (
                      <p className="mt-1 text-xs text-error">
                        {errors[`members.${index}.name`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateMember(index, "email", e.target.value)
                      }
                      placeholder="hong@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    개발 경험
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experienceOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                          member.experienceLevel === opt.value
                            ? "border-accent bg-accent/5 text-accent"
                            : "border-border hover:border-accent/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`member-exp-${index}`}
                          value={opt.value}
                          checked={member.experienceLevel === opt.value}
                          onChange={(e) =>
                            updateMember(
                              index,
                              "experienceLevel",
                              e.target.value,
                            )
                          }
                          className="accent-accent sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {(form.members?.length ?? 0) < MAX_MEMBERS && (
              <button
                type="button"
                onClick={addMember}
                className="w-full rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-accent hover:text-accent cursor-pointer transition-colors"
              >
                + 팀원 추가
              </button>
            )}
          </div>
        </fieldset>
      )}

      {/* 허니팟 */}
      <div className="absolute opacity-0 -z-10" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 제출 */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-accent py-4 text-base font-bold text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        {isPending ? "등록 중..." : "참가 신청 완료하기"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        제출된 정보는 행사 운영 목적으로만 사용됩니다.
      </p>
    </form>
  );
};
