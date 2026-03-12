import {
  FieldLabel,
  FormError,
  FormRadioOption,
} from "@/app/_components/register";
import type { FormState } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  update: (
    field: keyof Omit<FormState, "members" | "hasDeposited">,
    value: string,
  ) => void;
};

export const ParticipationTypeSection = ({ form, errors, update }: Props) => {
  const isIndividual = form.participationType === "INDIVIDUAL";

  return (
    <fieldset className="space-y-2">
      <FieldLabel as="legend" required>
        참가 유형
      </FieldLabel>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
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
          description="단체로 참여해요"
        />
      </div>
      {errors.participationType && (
        <FormError>{errors.participationType}</FormError>
      )}
    </fieldset>
  );
};
