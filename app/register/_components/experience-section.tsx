import { FormError } from "@/app/_components/register";
import { RadioDot } from "@/app/_components/register/radio-dot";
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
      <legend className="typo-subtitle1">개발 경험</legend>
      <div className="grid gap-2 sm:grid-cols-4">
        {experienceOptions.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              form.experienceLevel === opt.value ? "bg-primary-025 ring-2 ring-primary-400" : "bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="experienceLevel"
              value={opt.value}
              checked={form.experienceLevel === opt.value}
              onChange={(e) => update("experienceLevel", e.target.value)}
              className="sr-only"
            />
            <RadioDot checked={form.experienceLevel === opt.value} />
            <span className="typo-subtitle4">{opt.label}</span>
          </label>
        ))}
      </div>
      {errors.experienceLevel && <FormError>{errors.experienceLevel}</FormError>}
    </fieldset>
  );
};
