import { FieldLabel, FormInput } from "@/app/_components/register";
import type { DuplicateStatus, FormState } from "./types";
import { emailDescription, formatPhone, toDigits } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  dupStatus: Record<string, DuplicateStatus>;
  update: (
    field: keyof Omit<FormState, "members" | "hasDeposited">,
    value: string,
  ) => void;
  checkEmailDuplicate: () => void;
};

export const PersonalInfoSection = ({
  form,
  errors,
  dupStatus,
  update,
  checkEmailDuplicate,
}: Props) => {
  if (form.participationType !== "INDIVIDUAL") return null;

  return (
    <div className="space-y-6">
      {/* 이름 */}
      <div>
        <FieldLabel htmlFor="reg-name" required>
          이름
        </FieldLabel>
        <FormInput
          id="reg-name"
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="홍길동"
          maxLength={50}
          error={errors.name}
        />
      </div>

      {/* 이메일 */}
      <div>
        <FieldLabel htmlFor="reg-email" required>
          이메일
        </FieldLabel>
        <FormInput
          id="reg-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={checkEmailDuplicate}
          placeholder="example@email.com"
          description={emailDescription(dupStatus.email)}
          error={errors.email}
        />
      </div>

      {/* 연락처 */}
      <div>
        <FieldLabel htmlFor="reg-phone" required>
          연락처
        </FieldLabel>
        <FormInput
          id="reg-phone"
          type="tel"
          inputMode="numeric"
          value={formatPhone(form.phone)}
          onChange={(e) => update("phone", toDigits(e.target.value))}
          placeholder="010-1234-5678 형식으로 작성해 주세요"
          error={errors.phone}
        />
      </div>
    </div>
  );
};
