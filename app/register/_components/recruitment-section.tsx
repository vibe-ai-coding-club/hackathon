import { FieldLabel, FormCaption, FormInput, FormRadioOption, FormTextarea } from "@/app/_components/register";
import type { FormState } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  update: (field: keyof Omit<FormState, "members" | "hasDeposited">, value: string) => void;
};

export const RecruitmentSection = ({ form, errors, update }: Props) => {
  if (!form.participationType) return null;

  const isIndividual = form.participationType === "INDIVIDUAL";
  const needsTeamName = form.participationType === "TEAM" || form.recruitmentStatus === "RECRUITING";

  return (
    <>
      {/* 모집 여부 */}
      <fieldset className="space-y-2">
        <legend className="typo-subtitle1">{isIndividual ? "팀 / 팀원 찾기" : "추가 인원 모집 여부"}</legend>
        <FormCaption className="mb-0">
          {isIndividual
            ? "해커톤 당일 함께할 팀이나 팀원을 찾고 싶으신가요?"
            : "해커톤 당일 팀원을 더 모집하고 싶으신가요?"}
        </FormCaption>
        <div className="grid gap-2 sm:grid-cols-2">
          <FormRadioOption
            name="recruitmentStatus"
            value="RECRUITING"
            checked={form.recruitmentStatus === "RECRUITING"}
            onChange={(e) => update("recruitmentStatus", e.target.value)}
            label={isIndividual ? "모집 / 참여할래요" : "모집할래요"}
            description={isIndividual ? "팀 / 팀원을 찾고 있어요" : "팀원을 더 찾고 있어요"}
          />
          <FormRadioOption
            name="recruitmentStatus"
            value="NOT_RECRUITING"
            checked={form.recruitmentStatus === "NOT_RECRUITING"}
            onChange={(e) => update("recruitmentStatus", e.target.value)}
            label={isIndividual ? "모집 / 참여하지 않을래요" : "모집하지 않을래요"}
          />
        </div>
      </fieldset>

      {/* 팀 이름 */}
      {needsTeamName && (
        <div className="space-y-6">
          <div>
            <FieldLabel htmlFor="reg-teamName" required>
              팀 이름
            </FieldLabel>
            <FormInput
              id="reg-teamName"
              type="text"
              value={form.teamName}
              onChange={(e) => update("teamName", e.target.value)}
              placeholder="팀 이름을 입력해주세요"
              maxLength={50}
              error={errors.teamName}
            />
          </div>
        </div>
      )}

      {/* 모집 소개글 */}
      {form.recruitmentStatus === "RECRUITING" && (
        <div>
          <FieldLabel htmlFor="reg-recruitmentNote" className="mb-1">
            모집 소개글
          </FieldLabel>
          <FormCaption>팀 빌딩 게시판에 표시됩니다</FormCaption>
          <FormTextarea
            id="reg-recruitmentNote"
            value={form.recruitmentNote}
            onChange={(e) => update("recruitmentNote", e.target.value)}
            placeholder="어떤 팀원을 찾고 있나요? 주제, 기술 스택 등을 자유롭게 작성해주세요"
            maxLength={300}
            rows={4}
          />
        </div>
      )}
    </>
  );
};
