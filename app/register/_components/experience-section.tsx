import { FieldLabel, FormError, FormRadioOption } from "@/app/_components/register";
import type { FormState } from "./types";
import { experienceOptions } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  update: (field: keyof Omit<FormState, "members" | "hasDeposited">, value: string) => void;
};

export const ExperienceSection = ({ form, errors, update }: Props) => {
  if (!form.participationType) return null;

  return (
    <fieldset className="space-y-2">
      <FieldLabel as="legend">개발 경험</FieldLabel>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-4">
        {experienceOptions.map((opt) => (
          <FormRadioOption
            key={opt.value}
            name="experienceLevel"
            value={opt.value}
            checked={form.experienceLevel === opt.value}
            onChange={(e) => update("experienceLevel", e.target.value)}
            label={opt.label}
            className="py-3"
          />
        ))}
      </div>
      {errors.experienceLevel && <FormError>{errors.experienceLevel}</FormError>}
    </fieldset>
  );
};
