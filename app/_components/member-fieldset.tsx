"use client";

import type { TeamMember } from "@/lib/validations/team";

type MemberFieldsetProps = {
  index: number;
  member: TeamMember;
  onChange: (index: number, member: TeamMember) => void;
  onRemove: (index: number) => void;
  removable: boolean;
  errors?: Record<string, string[]>;
};

export const MemberFieldset = ({
  index,
  member,
  onChange,
  onRemove,
  removable,
  errors,
}: MemberFieldsetProps) => {
  const update = (field: keyof TeamMember, value: string) => {
    onChange(index, { ...member, [field]: value });
  };

  const fieldError = (field: string) => {
    const key = `members.${index}.${field}`;
    return errors?.[key];
  };

  return (
    <fieldset className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <legend className="text-sm font-semibold">팀원 {index + 1}</legend>
        {removable && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-sm text-error hover:text-error/80 cursor-pointer"
          >
            삭제
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            이름 *
          </label>
          <input
            type="text"
            value={member.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="홍길동"
            required
            maxLength={50}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {fieldError("name")?.map((e) => (
            <p key={e} className="mt-1 text-xs text-error">
              {e}
            </p>
          ))}
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            이메일
          </label>
          <input
            type="email"
            value={member.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
            placeholder="hong@example.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {fieldError("email")?.map((e) => (
            <p key={e} className="mt-1 text-xs text-error">
              {e}
            </p>
          ))}
        </div>
      </div>
    </fieldset>
  );
};
