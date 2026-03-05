import * as z from "zod";

/** 투표자 인증: 연락처 (전화번호 또는 이메일) */
export const verifyVoterSchema = z.object({
  contact: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .refine(
      (val) => {
        if (/^\d+$/.test(val)) return /^01[016789]-?\d{3,4}-?\d{4}$/.test(val);
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      },
      { message: "올바른 연락처를 입력해주세요 (전화번호 또는 이메일)" },
    ),
});

/** 투표 제출 */
export const submitVoteSchema = z.object({
  memberId: z.string().min(1, "투표자 정보가 필요합니다"),
  projectId: z.string().min(1, "프로젝트를 선택해주세요"),
});

/** 투표 취소 */
export const cancelVoteSchema = z.object({
  memberId: z.string().min(1, "투표자 정보가 필요합니다"),
  projectId: z.string().min(1, "프로젝트를 선택해주세요"),
});

/** 관리자 투표 세션 관리 */
export const voteSessionActionSchema = z.object({
  action: z.enum(["start", "stop"]),
  maxVotes: z.number().int().min(1).max(20).optional(),
});

export type VerifyVoterInput = z.infer<typeof verifyVoterSchema>;
export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
export type CancelVoteInput = z.infer<typeof cancelVoteSchema>;
export type VoteSessionActionInput = z.infer<typeof voteSessionActionSchema>;
