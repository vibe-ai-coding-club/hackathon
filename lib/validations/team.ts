import * as z from "zod";

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;

const experienceLevelEnum = z.enum(["BEGINNER", "JUNIOR", "SENIOR", "VIBE_CODER"]);

const teamMemberSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(50, "이름은 50자 이하로 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요").optional().or(z.literal("")),
  experienceLevel: experienceLevelEnum.optional(),
});

const participationTypeEnum = z.enum(["INDIVIDUAL", "TEAM"]);

export const teamRegistrationSchema = z
  .object({
    // 기본 정보 (대표자)
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .max(50, "이름은 50자 이하로 입력해주세요"),
    email: z.string().email("올바른 이메일 주소를 입력해주세요"),
    phone: z.string().regex(PHONE_REGEX, "올바른 전화번호를 입력해주세요 (예: 010-1234-5678)"),
    // 참가 유형
    participationType: participationTypeEnum,
    // 팀 정보
    teamName: z
      .string()
      .max(50, "팀 이름은 50자 이하로 입력해주세요")
      .optional()
      .or(z.literal("")),
    members: z.array(teamMemberSchema).max(3, "팀원은 최대 3명까지 가능합니다").optional(),
    // 추가 정보
    experienceLevel: experienceLevelEnum,
    motivation: z.string().max(500, "참가 동기는 500자 이하로 입력해주세요").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.participationType === "TEAM") {
        return data.teamName && data.teamName.length > 0;
      }
      return true;
    },
    { message: "팀 참여 시 팀 이름을 입력해주세요", path: ["teamName"] },
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
