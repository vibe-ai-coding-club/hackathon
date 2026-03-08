"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

type ParticipationType = "INDIVIDUAL" | "TEAM";
type ExperienceLevel = "BEGINNER" | "JUNIOR" | "SENIOR" | "VIBE_CODER";

const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "BEGINNER", label: "비개발자/입문" },
  { value: "JUNIOR", label: "주니어" },
  { value: "SENIOR", label: "시니어" },
  { value: "VIBE_CODER", label: "바이브코더" },
];

type MemberState = { name: string; email: string; phone: string };

type FormState = {
  participationType: ParticipationType | "";
  email: string;
  name: string;
  phone: string;
  teamName: string;
  members: MemberState[];
  experienceLevel: ExperienceLevel | "";
  motivation: string;
  refundBank: string;
  refundAccount: string;
  refundAccountHolder: string;
  hasDeposited: boolean;
  privacyConsent: boolean;
};

const createEmptyMember = (): MemberState => ({ name: "", email: "", phone: "" });

const PHONE_REGEX = /^01[016789]\d{7,8}$/;

const formatPhone = (digits: string): string => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const toDigits = (value: string): string => value.replace(/\D/g, "").slice(0, 11);

const initialForm: FormState = {
  participationType: "INDIVIDUAL",
  email: "",
  name: "",
  phone: "",
  teamName: "",
  members: [createEmptyMember()],
  experienceLevel: "",
  motivation: "",
  refundBank: "",
  refundAccount: "",
  refundAccountHolder: "",
  hasDeposited: false,
  privacyConsent: false,
};

const MAX_MEMBERS = 3;

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

const checkDuplicateEmail = async (value: string): Promise<boolean> => {
  try {
    const res = await fetch("/api/check-duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: "email", value }),
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
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const update = (field: keyof Omit<FormState, "members" | "hasDeposited">, value: string) => {
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
    if (field === "email") {
      setDupStatus((prev) => ({ ...prev, [`members.${index}.email`]: "idle" }));
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
    const isDup = await checkDuplicateEmail(form.email);
    if (isDup) {
      setDupStatus((prev) => ({ ...prev, email: "duplicate" }));
      setErrors((prev) => ({ ...prev, email: "이미 등록된 이메일입니다" }));
    } else {
      setDupStatus((prev) => ({ ...prev, email: "available" }));
    }
  }, [form.email]);

  const checkMemberEmailDuplicate = useCallback(async (index: number, value: string) => {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    const field = `members.${index}.email`;
    setDupStatus((prev) => ({ ...prev, [field]: "checking" }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    const isDup = await checkDuplicateEmail(value);
    if (isDup) {
      setDupStatus((prev) => ({ ...prev, [field]: "duplicate" }));
      setErrors((prev) => ({ ...prev, [field]: "이미 등록된 이메일입니다" }));
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

    if (!form.phone) newErrors.phone = "전화번호를 입력해주세요";
    else if (!PHONE_REGEX.test(form.phone)) newErrors.phone = "올바른 전화번호를 입력해주세요";

    // 팀 전용
    if (form.participationType === "TEAM") {
      if (!form.teamName.trim()) newErrors.teamName = "팀 이름을 입력해주세요";
      form.members.forEach((member, i) => {
        if (!member.name.trim()) newErrors[`members.${i}.name`] = "이름을 입력해주세요";
        if (!member.email.trim()) newErrors[`members.${i}.email`] = "이메일을 입력해주세요";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email))
          newErrors[`members.${i}.email`] = "올바른 이메일을 입력해주세요";
        if (!member.phone) newErrors[`members.${i}.phone`] = "전화번호를 입력해주세요";
        else if (!PHONE_REGEX.test(member.phone))
          newErrors[`members.${i}.phone`] = "올바른 전화번호를 입력해주세요";
      });
    }

    if (!form.experienceLevel) newErrors.experienceLevel = "개발 경험을 선택해주세요";

    // 개인정보 동의
    if (!form.privacyConsent) newErrors.privacyConsent = "개인정보 수집·이용에 동의해주세요";

    // 환불 계좌
    if (!form.refundBank.trim()) newErrors.refundBank = "은행명을 입력해주세요";
    if (!form.refundAccount.trim()) newErrors.refundAccount = "계좌번호를 입력해주세요";
    if (!form.refundAccountHolder.trim()) newErrors.refundAccountHolder = "예금주를 입력해주세요";

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
    const hasBasic =
      form.name.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      PHONE_REGEX.test(form.phone);
    const hasRefund =
      form.refundBank.trim().length > 0 &&
      form.refundAccount.trim().length > 0 &&
      form.refundAccountHolder.trim().length > 0;

    if (!hasBasic || !hasRefund || !form.hasDeposited || !form.privacyConsent) return false;

    if (form.participationType === "TEAM") {
      return (
        form.teamName.trim().length > 0 &&
        form.members.every(
          (m) =>
            m.name.trim().length > 0 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email) &&
            PHONE_REGEX.test(m.phone),
        )
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
        phone: form.phone,
        teamName: form.participationType === "TEAM" ? form.teamName : undefined,
        members: form.participationType === "TEAM" ? form.members : undefined,
        experienceLevel: form.experienceLevel,
        motivation: form.motivation || undefined,
        refundBank: form.refundBank,
        refundAccount: form.refundAccount,
        refundAccountHolder: form.refundAccountHolder,
        hasDeposited: form.hasDeposited,
        privacyConsent: form.privacyConsent,
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
                <span className="typo-body3 ml-2 text-gray-500">팀장 포함 최대 4명</span>
              </span>
            </label>
          </div>
          {errors.participationType && <p className="typo-caption1 text-error">{errors.participationType}</p>}
        </fieldset>

        {/* 2. 대표자 정보 */}
        {form.participationType && (
          <div className="space-y-6">
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

            {/* 연락처 (필수) */}
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
              {errors.phone && <p className="typo-caption1 mt-1 text-error">{errors.phone}</p>}
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="reg-email" className="typo-subtitle1 mb-1 block">
                이메일 <span className="text-error">*</span>
              </label>
              <p className="typo-caption1 mb-2 text-gray-500">투표 인증 및 프로젝트 등록 시 사용됩니다</p>
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

                {/* 이름 */}
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

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* 연락처 */}
                  <div>
                    <label className="typo-subtitle4 mb-1 block">
                      연락처 <span className="text-error">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={formatPhone(member.phone)}
                      onChange={(e) => updateMember(i, "phone", toDigits(e.target.value))}
                      placeholder="010-1234-5678"
                      className="w-full rounded-lg bg-white px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40"
                    />
                    {errors[`members.${i}.phone`] && (
                      <p className="typo-caption1 mt-1 text-error">{errors[`members.${i}.phone`]}</p>
                    )}
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label className="typo-subtitle4 mb-1 block">
                      이메일 <span className="text-error">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(i, "email", e.target.value)}
                        onBlur={() => checkMemberEmailDuplicate(i, member.email)}
                        placeholder="example@email.com"
                        className="w-full flex-1 rounded-lg bg-white px-4 py-3 typo-body3 outline-none transition-colors focus:ring-2 focus:ring-primary-400/40"
                      />
                      <button
                        type="button"
                        onClick={() => checkMemberEmailDuplicate(i, member.email)}
                        disabled={
                          !member.email ||
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email) ||
                          dupStatus[`members.${i}.email`] === "checking"
                        }
                        className="shrink-0 rounded-lg bg-white px-3 py-2 typo-caption1 font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                      >
                        {dupStatus[`members.${i}.email`] === "checking" ? "확인 중..." : "중복확인"}
                      </button>
                    </div>
                    {errors[`members.${i}.email`] ? (
                      <p className="typo-caption1 mt-1 text-error">{errors[`members.${i}.email`]}</p>
                    ) : dupStatus[`members.${i}.email`] === "available" ? (
                      <p className="typo-caption1 mt-1 text-success">사용 가능한 이메일입니다</p>
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

        {/* 6. 참가비 안내 + 환불 계좌 */}
        {form.participationType && (
          <div className="space-y-6">
            <div className="rounded-xl bg-primary-025 p-5 space-y-2">
              <p className="typo-subtitle1">참가비 안내</p>
              <p className="typo-body3 text-gray-600">
                참가비: <span className="font-semibold text-foreground">1인당 ₩15,000</span> (점심 식사, 공간 이용, 다과
                및 운영 비용 포함)
              </p>
              <p className="typo-body3 text-gray-600">
                입금 계좌:{" "}
                <span className="font-medium text-foreground">3333-12-1608630 카카오뱅크 (예금주: 송채영)</span>
              </p>
              <p className="typo-caption1 text-gray-500">
                참가비는 노쇼 방지 및 원활한 행사 운영을 위한 최소 비용으로 사용됩니다.
                <br />
                행사 준비가 시작된 이후에는 환불이 어려울 수 있으니 신청 시 참고해 주세요.
                <br />
                선착순 접수로 마감이 된 경우, 환불 처리해드려요.
              </p>
            </div>

            <div>
              <p className="typo-subtitle1 mb-3">
                환불받을 계좌 <span className="text-error">*</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="reg-refundBank" className="typo-subtitle4 mb-1 block">
                    은행명
                  </label>
                  <input
                    id="reg-refundBank"
                    type="text"
                    value={form.refundBank}
                    onChange={(e) => update("refundBank", e.target.value)}
                    placeholder="카카오뱅크"
                    className={inputClass}
                  />
                  {errors.refundBank && <p className="typo-caption1 mt-1 text-error">{errors.refundBank}</p>}
                </div>
                <div>
                  <label htmlFor="reg-refundAccount" className="typo-subtitle4 mb-1 block">
                    계좌번호
                  </label>
                  <input
                    id="reg-refundAccount"
                    type="text"
                    value={form.refundAccount}
                    onChange={(e) => update("refundAccount", e.target.value)}
                    placeholder="1234-56-7890123"
                    className={inputClass}
                  />
                  {errors.refundAccount && <p className="typo-caption1 mt-1 text-error">{errors.refundAccount}</p>}
                </div>
                <div>
                  <label htmlFor="reg-refundAccountHolder" className="typo-subtitle4 mb-1 block">
                    예금주
                  </label>
                  <input
                    id="reg-refundAccountHolder"
                    type="text"
                    value={form.refundAccountHolder}
                    onChange={(e) => update("refundAccountHolder", e.target.value)}
                    placeholder="홍길동"
                    className={inputClass}
                  />
                  {errors.refundAccountHolder && (
                    <p className="typo-caption1 mt-1 text-error">{errors.refundAccountHolder}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 입금 확인 */}
            <div>
              <p className="typo-subtitle1 mb-2">
                모든 팀원이 입금 계좌에 입금하셨나요? <span className="text-error">*</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    form.hasDeposited ? "bg-primary-025 ring-2 ring-primary-400" : "bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="hasDeposited"
                    checked={form.hasDeposited === true}
                    onChange={() => setForm((prev) => ({ ...prev, hasDeposited: true }))}
                    className="sr-only"
                  />
                  <RadioDot checked={form.hasDeposited === true} />
                  <span className="typo-subtitle4">예</span>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    !form.hasDeposited ? "bg-gray-100 ring-2 ring-gray-300" : "bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="hasDeposited"
                    checked={form.hasDeposited === false}
                    onChange={() => setForm((prev) => ({ ...prev, hasDeposited: false }))}
                    className="sr-only"
                  />
                  <RadioDot checked={!form.hasDeposited} />
                  <span className="typo-subtitle4">아니요</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 7. 참여 동기 */}
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

        {/* 8. 개인정보 수집·이용 동의 */}
        {form.participationType && (
          <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.privacyConsent}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, privacyConsent: e.target.checked }))
                }
                className="mt-0.5 size-5 shrink-0 accent-primary-400 cursor-pointer"
              />
              <span className="typo-body3">
                <span className="text-error">[필수]</span> 개인정보 수집·이용에 동의합니다.{" "}
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="cursor-pointer text-primary-400 underline underline-offset-2 hover:text-primary-500"
                >
                  내용 보기
                </button>
              </span>
            </label>
            {errors.privacyConsent && (
              <p className="typo-caption1 text-error">{errors.privacyConsent}</p>
            )}
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
            className={`rounded-[12px] px-5 py-3 text-[18px] leading-[26px] font-semibold tracking-[-0.4px] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isReady
                ? "bg-primary-400 text-white hover:bg-primary-500"
                : "bg-gray-100 text-gray-850 hover:bg-gray-200"
            }`}
          >
            {isPending ? "등록 중..." : "딸깍톤 신청하기"}
          </button>
        </div>
      </form>

      {/* 개인정보 수집·이용 동의 모달 */}
      {privacyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPrivacyModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="typo-subtitle1 text-lg">개인정보 수집·이용 동의</h2>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
              >
                <svg className="size-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto typo-body3 text-gray-700">
              <div>
                <p className="typo-subtitle2 mb-1">1. 수집 목적</p>
                <p>딸깍톤 해커톤 참가 신청 접수, 본인 확인, 행사 안내 및 운영, 참가비 환불 처리</p>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">2. 수집 항목</p>
                <ul className="list-inside list-disc space-y-0.5">
                  <li><span className="font-medium">필수:</span> 이름, 이메일, 연락처(전화번호)</li>
                  <li><span className="font-medium">필수:</span> 환불 계좌 정보(은행명, 계좌번호, 예금주)</li>
                  <li><span className="font-medium">팀 참가 시:</span> 팀원 이름, 이메일, 연락처</li>
                  <li><span className="font-medium">선택:</span> 참여 동기 및 문의 사항</li>
                </ul>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">3. 보유 및 이용 기간</p>
                <p>
                  수집된 개인정보는 <span className="font-semibold">대회 종료 후 즉시 파기</span>합니다.
                  단, 환불 처리가 완료되지 않은 경우 환불 완료 시까지 보유합니다.
                </p>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">4. 동의 거부권 및 불이익</p>
                <p>
                  개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
                  다만, 필수 항목에 대한 동의를 거부할 경우 참가 신청이 불가합니다.
                </p>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">5. 파기 방법</p>
                <p>전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구 삭제합니다.</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, privacyConsent: true }));
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.privacyConsent;
                    return next;
                  });
                  setPrivacyModalOpen(false);
                }}
                className="cursor-pointer rounded-lg bg-primary-400 px-5 py-2.5 typo-subtitle4 text-white transition-colors hover:bg-primary-500"
              >
                동의하기
              </button>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2.5 typo-subtitle4 text-gray-600 transition-colors hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

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
