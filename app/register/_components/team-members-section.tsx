import { FieldLabel, FormError, FormInput } from "@/app/_components/register";
import type { DuplicateStatus, FormState, MemberState } from "./types";
import { formatPhone, MAX_MEMBERS, toDigits } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  dupStatus: Record<string, DuplicateStatus>;
  updateMember: (index: number, field: keyof MemberState, value: string) => void;
  addMember: () => void;
  removeMember: (index: number) => void;
  checkMemberEmailDuplicate: (index: number, value: string) => void;
};

export const TeamMembersSection = ({
  form,
  errors,
  dupStatus,
  updateMember,
  addMember,
  removeMember,
  checkMemberEmailDuplicate,
}: Props) => {
  if (form.participationType !== "TEAM") return null;

  return (
    <fieldset className="space-y-3">
      <div className="flex min-h-9 items-center justify-between">
        <FieldLabel as="legend">
          팀원{" "}
          <span className="typo-body3 font-normal text-gray-500">
            ({form.members.length}/{MAX_MEMBERS})
          </span>
        </FieldLabel>
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

      {/* 팀장 */}
      <div className="space-y-3 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span>
            <span className="typo-subtitle2">팀장</span>
            <span className="typo-caption1 ml-2 text-gray-500">팀 대표로 참여해요</span>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <FieldLabel size="sm" required>
              이름
            </FieldLabel>
            <FormInput
              type="text"
              variant="white"
              value={form.name}
              disabled
              placeholder="홍길동"
            />
          </div>
          <div>
            <FieldLabel size="sm" required>
              연락처
            </FieldLabel>
            <FormInput
              type="tel"
              variant="white"
              value={formatPhone(form.phone)}
              disabled
              placeholder="010-1234-5678 형식으로 작성해 주세요"
            />
          </div>
          <div>
            <FieldLabel size="sm" required>
              이메일
            </FieldLabel>
            <FormInput
              type="email"
              variant="white"
              value={form.email}
              disabled
              placeholder="example@email.com"
            />
          </div>
        </div>
      </div>

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

          <div className="grid gap-3 sm:grid-cols-3">
            {/* 이름 */}
            <div>
              <FieldLabel size="sm" required>
                이름
              </FieldLabel>
              <FormInput
                type="text"
                variant="white"
                value={member.name}
                onChange={(e) => updateMember(i, "name", e.target.value)}
                placeholder="홍길동"
                maxLength={50}
                error={errors[`members.${i}.name`]}
              />
            </div>

            {/* 연락처 */}
            <div>
              <FieldLabel size="sm" required>
                연락처
              </FieldLabel>
              <FormInput
                type="tel"
                inputMode="numeric"
                variant="white"
                value={formatPhone(member.phone)}
                onChange={(e) => updateMember(i, "phone", toDigits(e.target.value))}
                placeholder="010-1234-5678 형식으로 작성해 주세요"
                error={errors[`members.${i}.phone`]}
              />
            </div>

            {/* 이메일 */}
            <div>
              <FieldLabel size="sm" required>
                이메일
              </FieldLabel>
              <div className="flex gap-2">
                <FormInput
                  type="email"
                  variant="white"
                  value={member.email}
                  onChange={(e) => updateMember(i, "email", e.target.value)}
                  onBlur={() => checkMemberEmailDuplicate(i, member.email)}
                  placeholder="example@email.com"
                  className="flex-1"
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
                <FormError>{errors[`members.${i}.email`]}</FormError>
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
  );
};
