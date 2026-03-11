import { FormError, FormRadioOption } from "@/app/_components/register";
import type { FormState } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  update: (field: keyof Omit<FormState, "members" | "hasDeposited">, value: string) => void;
};

export const ParticipationTypeSection = ({ form, errors, update }: Props) => {
  const isIndividual = form.participationType === "INDIVIDUAL";

  return (
    <fieldset className="space-y-2">
      <legend className="typo-subtitle1">
        참가 유형 <span className="text-error">*</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        <FormRadioOption
          name="participationType"
          value="INDIVIDUAL"
          checked={isIndividual}
          onChange={(e) => update("participationType", e.target.value)}
          label="개인 참여"
          description="혼자서 참여해요"
        />
        <FormRadioOption
          name="participationType"
          value="TEAM"
          checked={form.participationType === "TEAM"}
          onChange={(e) => update("participationType", e.target.value)}
          label="팀 참여"
          description="팀장 포함 최대 4명"
        />
      </div>
      {errors.participationType && <FormError>{errors.participationType}</FormError>}
    </fieldset>
  );
};
