"use server";

import { prisma } from "@/lib/prisma";
import { teamRegistrationSchema } from "@/lib/validations/team";
import { headers } from "next/headers";

const MAX_TEAMS = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 3; // 1분에 3회

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
};

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function registerTeam(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  // Honeypot — 봇이 채우면 차단
  const honeypot = formData.get("website");
  if (honeypot) {
    return { success: false, message: "잘못된 요청입니다." };
  }

  // Rate limit
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  // 팀 수 상한
  const teamCount = await prisma.team.count();
  if (teamCount >= MAX_TEAMS) {
    return {
      success: false,
      message: "모집이 마감되었습니다. 더 이상 팀을 등록할 수 없습니다.",
    };
  }

  const rawMembers = formData.get("members");

  let members: unknown;
  try {
    members = JSON.parse(rawMembers as string);
  } catch {
    return {
      success: false,
      message: "팀원 데이터가 올바르지 않습니다.",
      errors: { members: ["팀원 데이터를 파싱할 수 없습니다."] },
    };
  }

  const raw = {
    name: formData.get("name"),
    topic: formData.get("topic"),
    description: formData.get("description") || undefined,
    members,
  };

  const result = teamRegistrationSchema.safeParse(raw);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      if (!errors[field]) errors[field] = [];
      errors[field].push(issue.message);
    });

    return {
      success: false,
      message: "입력값을 확인해주세요.",
      errors,
    };
  }

  const { name, topic, description, members: validMembers } = result.data;

  try {
    const existing = await prisma.team.findUnique({ where: { name } });
    if (existing) {
      return {
        success: false,
        message: "이미 등록된 팀 이름입니다.",
        errors: { name: ["이미 등록된 팀 이름입니다."] },
      };
    }

    await prisma.team.create({
      data: {
        name,
        topic,
        description: description || null,
        members: validMembers,
      },
    });

    return {
      success: true,
      message: "팀 등록이 완료되었습니다!",
    };
  } catch {
    return {
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
