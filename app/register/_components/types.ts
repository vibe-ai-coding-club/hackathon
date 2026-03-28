export type ParticipationType = "INDIVIDUAL" | "TEAM";
export type ExperienceLevel = "BEGINNER" | "JUNIOR" | "SENIOR" | "VIBE_CODER";
export const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: "BEGINNER", label: "비개발자/입문" },
  { value: "JUNIOR", label: "주니어" },
  { value: "SENIOR", label: "시니어" },
  { value: "VIBE_CODER", label: "바이브코더" },
];

export type MemberState = { name: string; email: string; phone: string };

export type FormState = {
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

export const createEmptyMember = (): MemberState => ({
  name: "",
  email: "",
  phone: "",
});

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^01[016789]\d{7,8}$/;

export const formatPhone = (digits: string): string => {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

export const toDigits = (value: string): string =>
  value.replace(/\D/g, "").slice(0, 11);

export const initialForm: FormState = {
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

export const MAX_MEMBERS = 3;

export type DuplicateStatus = "idle" | "checking" | "available" | "duplicate";

export const emailDescription = (
  status: DuplicateStatus | undefined,
  defaultText = "좋아요 인증 및 프로젝트 등록을 위해 수집하고 있어요",
): string => {
  switch (status) {
    case "checking":
      return "중복 확인중";
    case "available":
      return "사용 가능한 이메일입니다";
    default:
      return defaultText;
  }
};

export const checkDuplicateEmail = async (value: string): Promise<boolean> => {
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
