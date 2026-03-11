import * as z from "zod";

const PHONE_REGEX = /^01[016789]\d{7,8}$/;

const experienceLevelEnum = z.enum([
  "BEGINNER",
  "JUNIOR",
  "SENIOR",
  "VIBE_CODER",
]);

const participationTypeEnum = z.enum(["INDIVIDUAL", "TEAM"]);

const recruitmentStatusEnum = z.enum(["RECRUITING", "NOT_RECRUITING"]);

/** 팀원 스키마 (팀 참여 시 추가 팀원) */
const teamMemberSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(50, "이름은 50자 이하로 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  phone: z
    .string()
    .regex(PHONE_REGEX, "올바른 전화번호를 입력해주세요"),
});

export const teamRegistrationSchema = z
  .object({
    participationType: participationTypeEnum,
    recruitmentStatus: recruitmentStatusEnum,
    recruitmentNote: z
      .string()
      .max(300, "모집 소개글은 300자 이하로 입력해주세요")
      .optional()
      .or(z.literal("")),
    // 대표자 정보
    email: z.string().email("올바른 이메일 주소를 입력해주세요"),
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .max(50, "이름은 50자 이하로 입력해주세요"),
    phone: z
      .string()
      .regex(PHONE_REGEX, "올바른 전화번호를 입력해주세요"),
    // 팀 전용
    teamName: z
      .string()
      .max(50, "팀 이름은 50자 이하로 입력해주세요")
      .optional()
      .or(z.literal("")),
    members: z
      .array(teamMemberSchema)
      .max(3, "팀원은 최대 3명까지 가능합니다")
      .optional(),
    // 추가 정보
    experienceLevel: experienceLevelEnum,
    motivation: z
      .string()
      .max(500, "참가 동기는 500자 이하로 입력해주세요")
      .optional()
      .or(z.literal("")),
    // 환불 계좌 정보
    refundBank: z
      .string()
      .min(1, "은행명을 입력해주세요"),
    refundAccount: z
      .string()
      .min(1, "계좌번호를 입력해주세요"),
    refundAccountHolder: z
      .string()
      .min(1, "예금주를 입력해주세요"),
    hasDeposited: z.boolean(),
    privacyConsent: z
      .boolean()
      .refine((val) => val === true, "개인정보 수집·이용 및 초상권 활용에 동의해주세요"),
  })
  .refine(
    (data) => {
      if (data.participationType === "TEAM" || data.recruitmentStatus === "RECRUITING") {
        return data.teamName && data.teamName.length > 0;
      }
      return true;
    },
    { message: "팀 이름을 입력해주세요", path: ["teamName"] },
  )
  .refine(
    (data) => {
      if (data.participationType === "TEAM") {
        return data.members && data.members.length >= 1;
      }
      return true;
    },
    { message: "팀 참여 시 최소 1명의 팀원이 필요합니다", path: ["members"] },
  );

export type TeamRegistrationInput = z.infer<typeof teamRegistrationSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
