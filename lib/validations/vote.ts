import * as z from "zod";

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

/** 좋아요 제출/취소 */
export const likeSchema = z.object({
  memberId: z.string().min(1, "참가자 정보가 필요합니다"),
  projectId: z.string().min(1, "프로젝트를 선택해주세요"),
});

/** 관리자 이벤트 설정 변경 */
export const eventSettingSchema = z.object({
  maxVotes: z.number().int().min(1).max(20).optional(),
  presentingProjectId: z.string().nullable().optional(),
});

export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
export type CancelVoteInput = z.infer<typeof cancelVoteSchema>;
export type LikeInput = z.infer<typeof likeSchema>;
export type EventSettingInput = z.infer<typeof eventSettingSchema>;
