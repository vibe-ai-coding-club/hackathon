import { FieldLabel, FormTextarea } from "@/app/_components/register";
import type { FormState } from "./types";

type Props = {
  form: FormState;
  update: (field: keyof Omit<FormState, "members" | "hasDeposited">, value: string) => void;
};

export const MotivationSection = ({ form, update }: Props) => {
  if (!form.participationType) return null;

  return (
    <div>
      <FieldLabel htmlFor="reg-motivation">참여 동기 및 문의 사항</FieldLabel>
      <FormTextarea
        id="reg-motivation"
        value={form.motivation}
        onChange={(e) => update("motivation", e.target.value)}
        placeholder="자유롭게 작성해 주세요"
        maxLength={500}
        rows={6}
      />
    </div>
  );
};
