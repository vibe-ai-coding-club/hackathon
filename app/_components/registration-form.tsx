"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type ParticipationType = "INDIVIDUAL" | "TEAM";
type ExperienceLevel = "BEGINNER" | "JUNIOR" | "SENIOR" | "VIBE_CODER";

const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "BEGINNER", label: "비개발자/입문" },
  { value: "JUNIOR", label: "주니어" },
  { value: "SENIOR", label: "시니어" },
  { value: "VIBE_CODER", label: "바이브코더" },
];

type MemberState = {
  name: string;
  email: string;
  contact: string;
};

type FormState = {
  participationType: ParticipationType | "";
  name: string;
  email: string;
  phone: string;
  teamName: string;
  experienceLevel: ExperienceLevel | "";
  motivation: string;
  members: MemberState[];
};

const createEmptyMember = (): MemberState => ({ name: "", email: "", contact: "" });

const isDigitsOnly = (value: string): boolean => /^\d+$/.test(value);

const displayContact = (value: string): string => {
  if (!value) return "";
  if (isDigitsOnly(value)) return formatPhone(value);
  return value;
};

const validateContact = (value: string): string | null => {
  if (!value.trim()) return "연락처를 입력해주세요";
  if (isDigitsOnly(value)) {
    if (!/^01[016789]\d{7,8}$/.test(value)) return "올바른 전화번호를 입력해주세요";
  } else {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "올바른 이메일을 입력해주세요";
  }
  return null;
};

const isValidContact = (value: string): boolean => {
  if (!value.trim()) return false;
  if (isDigitsOnly(value)) return /^01[016789]\d{7,8}$/.test(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const initialForm: FormState = {
  participationType: "INDIVIDUAL",
  name: "",
  email: "",
  phone: "",
  teamName: "",
  experienceLevel: "",
  motivation: "",
  members: [createEmptyMember()],
};

const MAX_MEMBERS = 5;

const formatPhone = (digits: string): string => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const toDigits = (value: string): string => value.replace(/\D/g, "").slice(0, 11);

const RadioDot = ({ checked }: { checked: boolean }) => (
  <span
    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
      checked ? "border-primary-400" : "border-gray-300"
    }`}
  >
    {checked && <span className="size-2.5 rounded-full bg-primary-400" />}
  </span>
);

const inputClass =
  "w-full rounded-lg bg-gray-50 px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40";

export const RegistrationForm = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [toast, setToast] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

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

  const updateMember = (index: number, field: keyof MemberState, value: string) => {
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

    if (!form.participationType) newErrors.participationType = "참가 유형을 선택해주세요";

    if (form.participationType === "INDIVIDUAL") {
      if (!form.name.trim()) newErrors.name = "이름을 입력해주세요";
      if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "올바른 이메일을 입력해주세요";
      if (!form.phone) newErrors.phone = "연락처를 입력해주세요";
      else if (!/^01[016789]\d{7,8}$/.test(form.phone))
        newErrors.phone = "올바른 연락처를 입력해주세요";
    }

    if (form.participationType === "TEAM") {
      if (!form.teamName.trim()) newErrors.teamName = "팀 이름을 입력해주세요";
      form.members.forEach((member, i) => {
        if (!member.name.trim()) newErrors[`members.${i}.name`] = "이름을 입력해주세요";
        if (i === 0) {
          if (!member.email.trim()) newErrors[`members.${i}.email`] = "이메일을 입력해주세요";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email))
            newErrors[`members.${i}.email`] = "올바른 이메일을 입력해주세요";
        }
        const contactError = validateContact(member.contact);
        if (contactError) newErrors[`members.${i}.contact`] = contactError;
      });
    }

    if (!form.experienceLevel) newErrors.experienceLevel = "개발 경험을 선택해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (success: boolean, message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ success, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const isReady = (() => {
    if (!form.participationType || !form.experienceLevel) return false;
    if (form.participationType === "INDIVIDUAL") {
      return (
        form.name.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
        /^01[016789]\d{7,8}$/.test(form.phone)
      );
    }
    return form.teamName.trim().length > 0 && form.members.every((m, i) => {
      const hasName = m.name.trim().length > 0;
      const hasContact = isValidContact(m.contact);
      if (i === 0) return hasName && hasContact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email);
      return hasName && hasContact;
    });
  })();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsPending(true);

    try {
      const formData = new FormData();
      formData.set("participationType", form.participationType);
      formData.set("experienceLevel", form.experienceLevel);
      if (form.motivation) formData.set("motivation", form.motivation);

      if (form.participationType === "INDIVIDUAL") {
        formData.set("name", form.name);
        formData.set("email", form.email);
        formData.set("phone", form.phone);
      }
      if (form.participationType === "TEAM") {
        formData.set("teamName", form.teamName);
        formData.set("members", JSON.stringify(form.members));
      }

      const res = await fetch("/api/register", {
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
      {/* 1. 참가 유형 */}
      <fieldset className="space-y-2">
        <legend className="typo-subtitle1">
          참가 유형 <span className="text-error">*</span>
        </legend>

        {/* PC: 가로 2열 / 모바일: 세로 */}
        <div className="grid gap-2 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 transition-colors ${
              form.participationType === "INDIVIDUAL"
                ? "bg-primary-025 ring-2 ring-primary-400"
                : "bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="participationType"
              value="INDIVIDUAL"
              checked={form.participationType === "INDIVIDUAL"}
              onChange={(e) => update("participationType", e.target.value)}
              className="sr-only"
            />
            <RadioDot checked={form.participationType === "INDIVIDUAL"} />
            <span>
              <span className="typo-subtitle2">개인 참여</span>
              <span className="typo-body3 ml-2 text-gray-500">혼자서 참여해요</span>
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 transition-colors ${
              form.participationType === "TEAM"
                ? "bg-primary-025 ring-2 ring-primary-400"
                : "bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="participationType"
              value="TEAM"
              checked={form.participationType === "TEAM"}
              onChange={(e) => update("participationType", e.target.value)}
              className="sr-only"
            />
            <RadioDot checked={form.participationType === "TEAM"} />
            <span>
              <span className="typo-subtitle2">팀 참여</span>
              <span className="typo-body3 ml-2 text-gray-500">단체로 참여해요</span>
            </span>
          </label>
        </div>

        {errors.participationType && (
          <p className="typo-caption1 text-error">{errors.participationType}</p>
        )}
      </fieldset>

      {/* 2a. 개인 참여: 이름 + 연락처 */}
      {form.participationType === "INDIVIDUAL" && (
        <div className="space-y-6">
          <div>
            <label htmlFor="reg-name" className="typo-subtitle1 mb-2 block">
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
              <p className="typo-caption1 mt-1 text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-email" className="typo-subtitle1 mb-2 block">
              이메일 <span className="text-error">*</span>
            </label>
            <input
              id="reg-email"
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

          <div>
            <label htmlFor="reg-phone" className="typo-subtitle1 mb-2 block">
              연락처 <span className="text-error">*</span>
            </label>
            <input
              id="reg-phone"
              type="tel"
              inputMode="numeric"
              value={formatPhone(form.phone)}
              onChange={(e) => update("phone", toDigits(e.target.value))}
              placeholder="010-1234-5678"
              className={inputClass}
            />
            {errors.phone && (
              <p className="typo-caption1 mt-1 text-error">{errors.phone}</p>
            )}
          </div>
        </div>
      )}

      {/* 2b. 팀 참여: 팀명 + 팀원 */}
      {form.participationType === "TEAM" && (
        <div className="space-y-6">
          <div>
            <label htmlFor="reg-teamName" className="typo-subtitle1 mb-2 block">
              팀 이름 <span className="text-error">*</span>
            </label>
            <input
              id="reg-teamName"
              type="text"
              value={form.teamName}
              onChange={(e) => update("teamName", e.target.value)}
              placeholder="팀 이름을 입력해주세요"
              maxLength={50}
              className={inputClass}
            />
            {errors.teamName && (
              <p className="typo-caption1 mt-1 text-error">{errors.teamName}</p>
            )}
          </div>
        </div>
      )}

      {/* 2c. 팀 참여: 팀원 */}
      {form.participationType === "TEAM" && (
        <fieldset className="space-y-3">
          <div className="flex min-h-9 items-center justify-between">
            <legend className="typo-subtitle1">
              팀원{" "}
              <span className="typo-body3 font-normal text-gray-500">
                ({form.members.length}/{MAX_MEMBERS})
              </span>
            </legend>
            {form.members.length < MAX_MEMBERS && (
              <button
                type="button"
                onClick={addMember}
                className="typo-caption1 rounded-md bg-gray-100 px-3 py-1.5 text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
              >
                + 팀원 추가
              </button>
            )}
          </div>

          {form.members.map((member, i) => (
            <div key={i} className="rounded-xl bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="typo-subtitle2">
                  {i === 0 ? "팀장" : `팀원 ${i}`}
                </span>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="typo-subtitle4 mb-1 block">
                    이름 <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(i, "name", e.target.value)}
                    placeholder="홍길동"
                    maxLength={50}
                    className="w-full rounded-lg bg-white px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40"
                  />
                  {errors[`members.${i}.name`] && (
                    <p className="typo-caption1 mt-1 text-error">
                      {errors[`members.${i}.name`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="typo-subtitle4 mb-1 block">
                    연락처 <span className="text-error">*</span>
                  </label>
                  <input
                    type={isDigitsOnly(member.contact) || !member.contact ? "tel" : "email"}
                    inputMode={isDigitsOnly(member.contact) || !member.contact ? "numeric" : "email"}
                    value={displayContact(member.contact)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/-/g, "");
                      if (/^\d*$/.test(raw)) {
                        updateMember(i, "contact", raw.slice(0, 11));
                      } else {
                        updateMember(i, "contact", e.target.value);
                      }
                    }}
                    placeholder="전화번호 또는 이메일"
                    className="w-full rounded-lg bg-white px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40"
                  />
                  {errors[`members.${i}.contact`] && (
                    <p className="typo-caption1 mt-1 text-error">
                      {errors[`members.${i}.contact`]}
                    </p>
                  )}
                </div>
              </div>
              {i === 0 && (
                <div>
                  <label className="typo-subtitle4 mb-1 block">
                    이메일 <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(i, "email", e.target.value)}
                    placeholder="example@email.com"
                    className="w-full rounded-lg bg-white px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40"
                  />
                  {errors["members.0.email"] && (
                    <p className="typo-caption1 mt-1 text-error">
                      {errors["members.0.email"]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </fieldset>
      )}

      {/* 3. 개발 경험 */}
      {form.participationType && (
        <fieldset className="space-y-2">
          <legend className="typo-subtitle1">개발 경험</legend>

          {/* PC: 4열 가로 / 모바일: 세로 */}
          <div className="grid gap-2 sm:grid-cols-4">
            {experienceOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  form.experienceLevel === opt.value
                    ? "bg-primary-025 ring-2 ring-primary-400"
                    : "bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={opt.value}
                  checked={form.experienceLevel === opt.value}
                  onChange={(e) => update("experienceLevel", e.target.value)}
                  className="sr-only"
                />
                <RadioDot checked={form.experienceLevel === opt.value} />
                <span className="typo-subtitle4">{opt.label}</span>
              </label>
            ))}
          </div>

          {errors.experienceLevel && (
            <p className="typo-caption1 text-error">{errors.experienceLevel}</p>
          )}
        </fieldset>
      )}

      {/* 4. 참여 동기 및 문의 사항 */}
      {form.participationType && (
        <div>
          <label htmlFor="reg-motivation" className="typo-subtitle1 mb-2 block">
            참여 동기 및 문의 사항
          </label>
          <textarea
            id="reg-motivation"
            value={form.motivation}
            onChange={(e) => update("motivation", e.target.value)}
            placeholder="자유롭게 작성해 주세요"
            maxLength={500}
            rows={6}
            className={`${inputClass} resize-y`}
          />
        </div>
      )}

      {/* 허니팟 */}
      <div className="absolute opacity-0 -z-10" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 제출 */}
      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={isPending}
          className={`typo-btn2 rounded-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors ${
            isReady
              ? "bg-primary-400 text-white hover:bg-primary-500"
              : "bg-gray-100 text-foreground hover:bg-gray-200"
          }`}
        >
          {isPending ? "등록 중..." : "딸깍톤 신청하기"}
        </button>
        <p className="typo-caption1 mt-3 text-gray-500">
          제출된 정보는 행사 운영 목적으로만 사용돼요
        </p>
      </div>
    </form>

    {/* 토스트 */}
    <div
      className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-6 py-3.5 shadow-lg transition-all duration-300 ${
        toast
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      } ${
        toast?.success
          ? "bg-success text-white"
          : "bg-error text-white"
      }`}
    >
      <span className="typo-subtitle4">{toast?.message}</span>
      <button
        type="button"
        onClick={() => setToast(null)}
        className="ml-1 shrink-0 opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
      >
        <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
    </>
  );
};
