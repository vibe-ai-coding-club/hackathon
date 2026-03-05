"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/app/_components/button";

type ParticipationType = "INDIVIDUAL" | "TEAM";
type ExperienceLevel = "BEGINNER" | "JUNIOR" | "SENIOR" | "VIBE_CODER";

const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "BEGINNER", label: "비개발자/입문" },
  { value: "JUNIOR", label: "주니어" },
  { value: "SENIOR", label: "시니어" },
  { value: "VIBE_CODER", label: "바이브코더" },
];

type MemberState = { name: string; contact: string };

type FormState = {
  participationType: ParticipationType | "";
  email: string;
  name: string;
  phone: string;
  teamName: string;
  members: MemberState[];
  experienceLevel: ExperienceLevel | "";
  motivation: string;
};

const createEmptyMember = (): MemberState => ({ name: "", contact: "" });

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
  email: "",
  name: "",
  phone: "",
  teamName: "",
  members: [createEmptyMember()],
  experienceLevel: "",
  motivation: "",
};

const MAX_MEMBERS = 4;

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

const checkDuplicate = async (field: "email" | "contact", value: string): Promise<boolean> => {
  try {
    const res = await fetch("/api/check-duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    const data = await res.json();
    return data.duplicate === true;
  } catch {
    return false;
  }
};

type DuplicateStatus = "idle" | "checking" | "available" | "duplicate";

export const RegistrationForm = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dupStatus, setDupStatus] = useState<Record<string, DuplicateStatus>>({});
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
    if (field === "email") {
      setDupStatus((prev) => ({ ...prev, email: "idle" }));
    }
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
    if (field === "contact") {
      setDupStatus((prev) => ({ ...prev, [`members.${index}.contact`]: "idle" }));
    }
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

  const checkEmailDuplicate = useCallback(async () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return;
    setDupStatus((prev) => ({ ...prev, email: "checking" }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.email;
      return next;
    });
    const isDupEmail = await checkDuplicate("email", form.email);
    const isDupContact = await checkDuplicate("contact", form.email);
    if (isDupEmail || isDupContact) {
      setDupStatus((prev) => ({ ...prev, email: "duplicate" }));
      setErrors((prev) => ({
        ...prev,
        email: "이미 등록된 이메일입니다",
      }));
    } else {
      setDupStatus((prev) => ({ ...prev, email: "available" }));
    }
  }, [form.email]);

  const checkContactDuplicate = useCallback(async (field: string, value: string) => {
    if (!isValidContact(value)) return;
    setDupStatus((prev) => ({ ...prev, [field]: "checking" }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    const isDup = await checkDuplicate("contact", value);
    if (isDup) {
      setDupStatus((prev) => ({ ...prev, [field]: "duplicate" }));
      setErrors((prev) => ({
        ...prev,
        [field]: "이미 등록된 연락처입니다",
      }));
    } else {
      setDupStatus((prev) => ({ ...prev, [field]: "available" }));
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.participationType) newErrors.participationType = "참가 유형을 선택해주세요";

    // 공통 필드
    if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "올바른 이메일을 입력해주세요";

    if (!form.name.trim()) newErrors.name = "이름을 입력해주세요";

    if (form.phone && !/^01[016789]\d{7,8}$/.test(form.phone)) newErrors.phone = "올바른 전화번호를 입력해주세요";

    // 팀 전용
    if (form.participationType === "TEAM") {
      if (!form.teamName.trim()) newErrors.teamName = "팀 이름을 입력해주세요";
      form.members.forEach((member, i) => {
        if (!member.name.trim()) newErrors[`members.${i}.name`] = "이름을 입력해주세요";
        const memberContactErr = validateContact(member.contact);
        if (memberContactErr) newErrors[`members.${i}.contact`] = memberContactErr;
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

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const isReady = (() => {
    if (!form.participationType || !form.experienceLevel) return false;
    const hasBasic = form.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (!hasBasic) return false;

    if (form.participationType === "TEAM") {
      return (
        form.teamName.trim().length > 0 &&
        form.members.every((m) => m.name.trim().length > 0 && isValidContact(m.contact))
      );
    }
    return true;
  })();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsPending(true);

    try {
      const payload = {
        participationType: form.participationType,
        email: form.email,
        name: form.name,
        phone: form.phone || undefined,
        contact: form.email, // 대표/개인은 이메일을 투표용 연락처로 사용
        teamName: form.participationType === "TEAM" ? form.teamName : undefined,
        members: form.participationType === "TEAM" ? form.members : undefined,
        experienceLevel: form.experienceLevel,
        motivation: form.motivation || undefined,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          <div className="grid gap-2 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 transition-colors ${
                form.participationType === "INDIVIDUAL" ? "bg-primary-025 ring-2 ring-primary-400" : "bg-gray-50"
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
                form.participationType === "TEAM" ? "bg-primary-025 ring-2 ring-primary-400" : "bg-gray-50"
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
          {errors.participationType && <p className="typo-caption1 text-error">{errors.participationType}</p>}
        </fieldset>

        {/* 2. 대표자 정보 */}
        {form.participationType && (
          <div className="space-y-6">
            {/* 대표 이메일 */}
            <div>
              <label htmlFor="reg-email" className="typo-subtitle1 mb-1 block">
                대표 이메일 <span className="text-error">*</span>
              </label>
              <p className="typo-caption1 mb-2 text-gray-500">프로젝트 등록 시 팀 식별에 사용됩니다</p>
              <div className="flex gap-2">
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={checkEmailDuplicate}
                  placeholder="example@email.com"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={checkEmailDuplicate}
                  disabled={
                    !form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || dupStatus.email === "checking"
                  }
                  className="shrink-0 rounded-lg bg-gray-100 px-4 py-3 typo-body3 font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  {dupStatus.email === "checking" ? "확인 중..." : "중복확인"}
                </button>
              </div>
              {errors.email && <p className="typo-caption1 mt-1 text-error">{errors.email}</p>}
              {dupStatus.email === "available" && !errors.email && (
                <p className="typo-caption1 mt-1 text-success">사용 가능한 이메일입니다</p>
              )}
            </div>

            {/* 이름 */}
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
              {errors.name && <p className="typo-caption1 mt-1 text-error">{errors.name}</p>}
            </div>

            {/* 전화번호 (선택) */}
            <div>
              <label htmlFor="reg-phone" className="typo-subtitle1 mb-2 block">
                전화번호 <span className="typo-body3 font-normal text-gray-500">(선택)</span>
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
              {errors.phone && <p className="typo-caption1 mt-1 text-error">{errors.phone}</p>}
            </div>
          </div>
        )}

        {/* 3. 팀 정보 */}
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
              {errors.teamName && <p className="typo-caption1 mt-1 text-error">{errors.teamName}</p>}
            </div>
          </div>
        )}

        {/* 4. 팀원 */}
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
                  className="typo-caption1 cursor-pointer rounded-md bg-gray-100 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-200"
                >
                  + 팀원 추가
                </button>
              )}
            </div>
            <p className="typo-caption1 text-gray-400">팀장을 제외하고 입력해주세요</p>

            {form.members.map((member, i) => (
              <div key={i} className="space-y-3 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="typo-subtitle2">팀원 {i + 1}</span>
                  {form.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(i)}
                      className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
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
                      <p className="typo-caption1 mt-1 text-error">{errors[`members.${i}.name`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="typo-subtitle4 mb-1 block">
                      연락처 <span className="text-error">*</span>
                    </label>
                    <div className="flex gap-2">
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
                        onBlur={() => checkContactDuplicate(`members.${i}.contact`, member.contact)}
                        placeholder="전화번호 또는 이메일"
                        className="w-full flex-1 rounded-lg bg-white px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40"
                      />
                      <button
                        type="button"
                        onClick={() => checkContactDuplicate(`members.${i}.contact`, member.contact)}
                        disabled={!isValidContact(member.contact) || dupStatus[`members.${i}.contact`] === "checking"}
                        className="shrink-0 rounded-lg bg-white px-3 py-2 typo-caption1 font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                      >
                        {dupStatus[`members.${i}.contact`] === "checking" ? "확인 중..." : "중복확인"}
                      </button>
                    </div>
                    {errors[`members.${i}.contact`] ? (
                      <p className="typo-caption1 mt-1 text-error">{errors[`members.${i}.contact`]}</p>
                    ) : dupStatus[`members.${i}.contact`] === "available" ? (
                      <p className="typo-caption1 mt-1 text-success">사용 가능한 연락처입니다</p>
                    ) : (
                      <p className="typo-caption1 mt-1 text-gray-400">투표 시 사용됩니다</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </fieldset>
        )}

        {/* 5. 개발 경험 */}
        {form.participationType && (
          <fieldset className="space-y-2">
            <legend className="typo-subtitle1">개발 경험</legend>
            <div className="grid gap-2 sm:grid-cols-4">
              {experienceOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    form.experienceLevel === opt.value ? "bg-primary-025 ring-2 ring-primary-400" : "bg-gray-50"
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
            {errors.experienceLevel && <p className="typo-caption1 text-error">{errors.experienceLevel}</p>}
          </fieldset>
        )}

        {/* 6. 참여 동기 */}
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
            {isPending ? "등록 중..." : "딸깍톤 신청하기"}
          </button>
          <p className="typo-caption1 mt-3 text-gray-500">제출된 정보는 행사 운영 목적으로만 사용돼요</p>
        </div>
      </form>
      
      {/* 토스트 */}
      <div
        className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-6 py-3.5 shadow-lg transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
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
