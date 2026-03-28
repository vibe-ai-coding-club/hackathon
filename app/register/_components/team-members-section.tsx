import { FieldLabel, FormInput } from "@/app/_components/register";
import { cn } from "@/lib/utils";
import type { DuplicateStatus, FormState, MemberState } from "./types";
import { emailDescription, formatPhone, MAX_MEMBERS, toDigits } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  dupStatus: Record<string, DuplicateStatus>;
  update: (
    field: keyof Omit<FormState, "members" | "hasDeposited">,
    value: string,
  ) => void;
  updateMember: (
    index: number,
    field: keyof MemberState,
    value: string,
  ) => void;
  addMember: () => void;
  removeMember: (index: number) => void;
  checkEmailDuplicate: () => void;
  checkMemberEmailDuplicate: (index: number, value: string) => void;
};

export const TeamMembersSection = ({
  form,
  errors,
  dupStatus,
  update,
  updateMember,
  addMember,
  removeMember,
  checkEmailDuplicate,
  checkMemberEmailDuplicate,
}: Props) => {
  if (form.participationType !== "TEAM") return null;

  return (
    <fieldset className="space-y-3">
      <div className="flex min-h-9 items-end justify-between">
        <FieldLabel as="legend" className="mb-0">
          팀원{" "}
          <span className="typo-body3 font-normal text-gray-500">
            ({form.members.length + 1}/{MAX_MEMBERS + 1})
          </span>
        </FieldLabel>
        {form.members.length < MAX_MEMBERS && (
          <button
            type="button"
            onClick={addMember}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-gray-100",
              "px-3.5 py-1.5 text-gray-850",
              "sm:gap-1.5 sm:rounded-[10px] sm:px-4.5 sm:py-2.5",
            )}
          >
            <svg
              className="size-3.5 sm:size-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="8" y1="2" x2="8" y2="14" />
              <line x1="2" y1="8" x2="14" y2="8" />
            </svg>
            <span className="typo-btn4 flex h-5.5 items-center sm:typo-subtitle1 sm:h-6 sm:font-semibold">
              팀원 추가
            </span>
          </button>
        )}
      </div>

      {/* 팀장 */}
      <div className="space-y-3 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span>
            <span className="typo-subtitle6 sm:typo-h7">팀장</span>
            <span className="typo-subtitle4 sm:typo-subtitle3 ml-2 text-gray-500">
              팀 대표로 참여해요
            </span>
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
              onChange={(e) => update("name", e.target.value)}
              placeholder="홍길동"
              maxLength={50}
              error={errors.name}
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
              onChange={(e) => update("email", e.target.value)}
              onBlur={checkEmailDuplicate}
              placeholder="example@email.com"
              description={emailDescription(
                dupStatus.email,
                "좋아요 시 사용됩니다",
              )}
              error={errors.email}
            />
          </div>
          <div>
            <FieldLabel size="sm" required>
              연락처
            </FieldLabel>
            <FormInput
              type="tel"
              inputMode="numeric"
              variant="white"
              value={formatPhone(form.phone)}
              onChange={(e) => update("phone", toDigits(e.target.value))}
              placeholder="010-1234-5678 형식으로 작성해 주세요"
              error={errors.phone}
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

            {/* 이메일 */}
            <div>
              <FieldLabel size="sm" required>
                이메일
              </FieldLabel>
              <FormInput
                type="email"
                variant="white"
                value={member.email}
                onChange={(e) => updateMember(i, "email", e.target.value)}
                onBlur={() => checkMemberEmailDuplicate(i, member.email)}
                placeholder="example@email.com"
                description={emailDescription(
                  dupStatus[`members.${i}.email`],
                  "좋아요 시 사용됩니다",
                )}
                error={errors[`members.${i}.email`]}
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
                onChange={(e) =>
                  updateMember(i, "phone", toDigits(e.target.value))
                }
                placeholder="010-1234-5678 형식으로 작성해 주세요"
                error={errors[`members.${i}.phone`]}
              />
            </div>
          </div>
        </div>
      ))}
    </fieldset>
  );
};
