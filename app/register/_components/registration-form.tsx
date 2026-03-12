"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { ExperienceSection } from "./experience-section";
import { MotivationSection } from "./motivation-section";
import { ParticipationTypeSection } from "./participation-type-section";
import { PaymentSection } from "./payment-section";
import { PersonalInfoSection } from "./personal-info-section";
import { PrivacySection } from "./privacy-section";
import { TeamMembersSection } from "./team-members-section";
import { Toast } from "./toast";
import type { DuplicateStatus, FormState, MemberState } from "./types";
import {
  checkDuplicateEmail,
  createEmptyMember,
  EMAIL_REGEX,
  initialForm,
  MAX_MEMBERS,
  PHONE_REGEX,
} from "./types";

export const RegistrationForm = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dupStatus, setDupStatus] = useState<Record<string, DuplicateStatus>>(
    {},
  );
  const [isPending, setIsPending] = useState(false);
  const [toast, setToast] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const update = (
    field: keyof Omit<FormState, "members" | "hasDeposited">,
    value: string,
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (
        field === "participationType" &&
        value === "TEAM" &&
        !prev.members?.length
      ) {
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
    if (field === "email") {
      setDupStatus((prev) => ({
        ...prev,
        [`members.${index}.email`]: "idle",
      }));
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
    if (!form.email || !EMAIL_REGEX.test(form.email)) return;
    setDupStatus((prev) => ({ ...prev, email: "checking" }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.email;
      return next;
    });
    const isDup = await checkDuplicateEmail(form.email);
    if (isDup) {
      setDupStatus((prev) => ({ ...prev, email: "duplicate" }));
      setErrors((prev) => ({ ...prev, email: "사용중인 이메일입니다" }));
    } else {
      setDupStatus((prev) => ({ ...prev, email: "available" }));
    }
  }, [form.email]);

  const checkMemberEmailDuplicate = useCallback(
    async (index: number, value: string) => {
      if (!value || !EMAIL_REGEX.test(value)) return;
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
        setErrors((prev) => ({ ...prev, [field]: "사용중인 이메일입니다" }));
      } else {
        setDupStatus((prev) => ({ ...prev, [field]: "available" }));
      }
    },
    [],
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.participationType)
      newErrors.participationType = "참가 유형을 선택해주세요";

    if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요";
    else if (!EMAIL_REGEX.test(form.email))
      newErrors.email = "올바른 이메일을 입력해주세요";

    if (!form.name.trim()) newErrors.name = "이름을 입력해주세요";

    if (!form.phone) newErrors.phone = "전화번호를 입력해주세요";
    else if (!PHONE_REGEX.test(form.phone))
      newErrors.phone = "올바른 전화번호를 입력해주세요";

    if (form.participationType === "TEAM") {
      form.members.forEach((member, i) => {
        if (!member.name.trim())
          newErrors[`members.${i}.name`] = "이름을 입력해주세요";
        if (!member.email.trim())
          newErrors[`members.${i}.email`] = "이메일을 입력해주세요";
        else if (!EMAIL_REGEX.test(member.email))
          newErrors[`members.${i}.email`] = "올바른 이메일을 입력해주세요";
        if (!member.phone)
          newErrors[`members.${i}.phone`] = "전화번호를 입력해주세요";
        else if (!PHONE_REGEX.test(member.phone))
          newErrors[`members.${i}.phone`] = "올바른 전화번호를 입력해주세요";
      });
    }

    if (!form.experienceLevel)
      newErrors.experienceLevel = "개발 경험을 선택해주세요";

    if (!form.privacyConsent)
      newErrors.privacyConsent = "개인정보 수집·이용에 동의해주세요";

    if (!form.refundBank.trim()) newErrors.refundBank = "은행명을 입력해주세요";
    if (!form.refundAccount.trim())
      newErrors.refundAccount = "계좌번호를 입력해주세요";
    if (!form.refundAccountHolder.trim())
      newErrors.refundAccountHolder = "예금주를 입력해주세요";

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
      EMAIL_REGEX.test(form.email) &&
      PHONE_REGEX.test(form.phone);
    const hasRefund =
      form.refundBank.trim().length > 0 &&
      form.refundAccount.trim().length > 0 &&
      form.refundAccountHolder.trim().length > 0;

    if (!hasBasic || !hasRefund || !form.hasDeposited || !form.privacyConsent)
      return false;

    if (form.participationType === "TEAM") {
      return form.members.every(
        (m) =>
          m.name.trim().length > 0 &&
          EMAIL_REGEX.test(m.email) &&
          PHONE_REGEX.test(m.phone),
      );
    }
    return true;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsPending(true);

    try {
      const payload = {
        participationType: form.participationType,
        email: form.email,
        name: form.name,
        phone: form.phone,
        teamName: `${form.name.trim()}의 팀`,
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
      <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-7">
        <ParticipationTypeSection form={form} errors={errors} update={update} />

        <PersonalInfoSection
          form={form}
          errors={errors}
          dupStatus={dupStatus}
          update={update}
          checkEmailDuplicate={checkEmailDuplicate}
        />

        <TeamMembersSection
          form={form}
          errors={errors}
          dupStatus={dupStatus}
          update={update}
          updateMember={updateMember}
          addMember={addMember}
          removeMember={removeMember}
          checkEmailDuplicate={checkEmailDuplicate}
          checkMemberEmailDuplicate={checkMemberEmailDuplicate}
        />

        <PaymentSection
          form={form}
          errors={errors}
          setForm={setForm}
          update={update}
        />

        <ExperienceSection form={form} errors={errors} update={update} />

        <MotivationSection form={form} update={update} />

        <PrivacySection
          form={form}
          errors={errors}
          setForm={setForm}
          setErrors={setErrors}
        />

        {/* 허니팟 */}
        <div className="absolute -z-10 opacity-0" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* 제출 */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isPending}
            className={`rounded-xl px-5 py-3 text-[18px] leading-6.5 font-semibold tracking-[-0.4px] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isReady
                ? "bg-primary-400 text-white hover:bg-primary-500"
                : "bg-gray-100 text-gray-850 hover:bg-gray-200"
            }`}
          >
            {isPending ? "등록 중..." : "딸깍톤 신청하기"}
          </button>
          <p className="typo-caption1 mt-3 text-gray-500">
            제출된 정보는 행사 운영 목적으로만 사용돼요
          </p>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
};
