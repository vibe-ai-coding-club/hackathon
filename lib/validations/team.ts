import * as z from "zod";

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;

const teamMemberSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(50, "이름은 50자 이하로 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  phone: z.string().regex(PHONE_REGEX, "올바른 전화번호를 입력해주세요 (예: 010-1234-5678)"),
  isLeader: z.boolean(),
});

export const teamRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(1, "팀 이름을 입력해주세요")
      .max(50, "팀 이름은 50자 이하로 입력해주세요"),
    topic: z
      .string()
      .min(1, "주제를 입력해주세요")
      .max(200, "주제는 200자 이하로 입력해주세요"),
    description: z
      .string()
      .max(1000, "설명은 1000자 이하로 입력해주세요")
      .optional()
      .or(z.literal("")),
    members: z
      .array(teamMemberSchema)
      .min(1, "최소 1명의 팀원이 필요합니다")
      .max(4, "팀원은 최대 4명까지 가능합니다"),
  })
  .refine((data) => data.members.filter((m) => m.isLeader).length === 1, {
    message: "팀장은 반드시 1명이어야 합니다",
    path: ["members"],
  });

export type TeamRegistrationInput = z.infer<typeof teamRegistrationSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
