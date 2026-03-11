import { FieldLabel, FormError, FormInput } from "@/app/_components/register";
import type { DuplicateStatus, FormState } from "./types";
import { formatPhone, toDigits } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  dupStatus: Record<string, DuplicateStatus>;
  update: (field: keyof Omit<FormState, "members" | "hasDeposited">, value: string) => void;
  checkEmailDuplicate: () => void;
};

export const LeaderInfoSection = ({ form, errors, dupStatus, update, checkEmailDuplicate }: Props) => {
  if (!form.participationType) return null;

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
          placeholder="010-1234-5678"
          error={errors.phone}
        />
      </div>

      {/* 이메일 */}
      <div>
        <FieldLabel htmlFor="reg-email" required className="mb-1">
          이메일
        </FieldLabel>
        <p className="typo-caption1 mb-2 text-gray-500">투표 인증 및 프로젝트 등록 시 사용됩니다</p>
        <div className="flex gap-2">
          <FormInput
            id="reg-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={checkEmailDuplicate}
            placeholder="example@email.com"
            className="flex-1"
          />
          <button
            type="button"
            onClick={checkEmailDuplicate}
            disabled={!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || dupStatus.email === "checking"}
            className="shrink-0 rounded-lg bg-gray-100 px-4 py-3 typo-body3 font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {dupStatus.email === "checking" ? "확인 중..." : "중복확인"}
          </button>
        </div>
        {errors.email && <FormError>{errors.email}</FormError>}
        {dupStatus.email === "available" && !errors.email && (
          <p className="typo-caption1 mt-1 text-success">사용 가능한 이메일입니다</p>
        )}
      </div>
    </div>
  );
};
