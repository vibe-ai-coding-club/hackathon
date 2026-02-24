"use client";

import { registerTeam, type ActionState } from "@/app/actions/register-team";
import type { TeamMember } from "@/lib/validations/team";
import { useActionState, useState } from "react";
import { MemberFieldset } from "./member-fieldset";

const createMember = (isLeader = false): TeamMember => ({
  name: "",
  email: "",
  phone: "",
  isLeader,
});

const initialState: ActionState = {
  success: false,
  message: "",
};

export const RegistrationForm = () => {
  const [state, formAction, isPending] = useActionState(registerTeam, initialState);
  const [members, setMembers] = useState<TeamMember[]>([createMember(true)]);

  const updateMember = (index: number, member: TeamMember) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? member : m)));
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const addMember = () => {
    if (members.length >= 5) return;
    setMembers((prev) => [...prev, createMember()]);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <div className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">{state.message}</div>
      )}

      {state.success && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-sm text-success">{state.message}</div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="team-name" className="block text-sm font-medium mb-1">
            팀 이름 *
          </label>
          <input
            id="team-name"
            name="name"
            type="text"
            required
            maxLength={50}
            placeholder="팀 이름을 입력하세요"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {state.errors?.name?.map((e) => (
            <p key={e} className="mt-1 text-xs text-error">
              {e}
            </p>
          ))}
        </div>

        <div>
          <label htmlFor="team-topic" className="block text-sm font-medium mb-1">
            주제 *
          </label>
          <input
            id="team-topic"
            name="topic"
            type="text"
            required
            maxLength={200}
            placeholder="프로젝트 주제를 입력하세요"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          {state.errors?.topic?.map((e) => (
            <p key={e} className="mt-1 text-xs text-error">
              {e}
            </p>
          ))}
        </div>

        <div>
          <label htmlFor="team-description" className="block text-sm font-medium mb-1">
            설명 <span className="text-muted-foreground font-normal">(선택)</span>
          </label>
          <textarea
            id="team-description"
            name="description"
            maxLength={1000}
            rows={3}
            placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent resize-y"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">팀원 ({members.length}/5)</h3>
          {members.length < 5 && (
            <button
              type="button"
              onClick={addMember}
              className="rounded-md bg-muted px-3 py-1.5 text-sm hover:bg-muted/80 cursor-pointer"
            >
              + 팀원 추가
            </button>
          )}
        </div>

        {state.errors?.members?.map((e) => (
          <p key={e} className="text-xs text-error">
            {e}
          </p>
        ))}

        {members.map((member, index) => (
          <MemberFieldset
            key={index}
            index={index}
            member={member}
            onChange={updateMember}
            onRemove={removeMember}
            removable={members.length > 1}
            errors={state.errors}
          />
        ))}
      </div>

      <input type="hidden" name="members" value={JSON.stringify(members)} />

      <div className="absolute opacity-0 -z-10" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        {isPending ? "등록 중..." : "참가 신청하기"}
      </button>
    </form>
  );
};
