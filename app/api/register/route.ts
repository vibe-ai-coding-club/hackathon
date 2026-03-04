import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MAX_TEAMS = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;

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

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;

const memberSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요").max(50),
  email: z.string().optional().or(z.literal("")),
  contact: z.string().min(1, "연락처를 입력해주세요").refine(
    (val) => {
      if (/^\d+$/.test(val)) return PHONE_REGEX.test(val);
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    { message: "올바른 연락처를 입력해주세요 (전화번호 또는 이메일)" },
  ),
});

const individualSchema = z.object({
  participationType: z.literal("INDIVIDUAL"),
  name: z.string().min(1, "이름을 입력해주세요").max(50),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  phone: z.string().regex(PHONE_REGEX, "올바른 연락처를 입력해주세요"),
  experienceLevel: z.enum(["BEGINNER", "JUNIOR", "SENIOR", "VIBE_CODER"]),
  motivation: z.string().max(500).optional().or(z.literal("")),
});

const teamSchema = z
  .object({
    participationType: z.literal("TEAM"),
    teamName: z.string().min(1, "팀 이름을 입력해주세요").max(50, "팀 이름은 50자 이하로 입력해주세요"),
    members: z.array(memberSchema).min(1, "최소 1명의 팀원이 필요합니다").max(5),
    experienceLevel: z.enum(["BEGINNER", "JUNIOR", "SENIOR", "VIBE_CODER"]),
    motivation: z.string().max(500).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const leader = data.members[0];
      return leader?.email && leader.email.length > 0;
    },
    { message: "팀장 이메일을 입력해주세요", path: ["members", 0, "email"] },
  )
  .refine(
    (data) => {
      const leader = data.members[0];
      return leader?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leader.email);
    },
    { message: "올바른 이메일을 입력해주세요", path: ["members", 0, "email"] },
  );

const registrationSchema = z.discriminatedUnion("participationType", [
  individualSchema,
  teamSchema,
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 허니팟 체크
    const honeypot = formData.get("website");
    if (honeypot) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    // 레이트 리밋
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        },
        { status: 429 },
      );
    }

    // 팀 정원 확인
    const teamCount = await prisma.team.count();
    if (teamCount >= MAX_TEAMS) {
      return NextResponse.json(
        { success: false, message: "모집이 마감되었습니다." },
        { status: 400 },
      );
    }

    // FormData 파싱
    const participationType = formData.get("participationType") as string;
    const experienceLevel = formData.get("experienceLevel") as string;
    const motivation = (formData.get("motivation") as string) || undefined;

    let raw: Record<string, unknown>;

    if (participationType === "INDIVIDUAL") {
      raw = {
        participationType,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        experienceLevel,
        motivation,
      };
    } else {
      const rawMembers = formData.get("members") as string;
      let members: unknown;
      try {
        members = JSON.parse(rawMembers);
      } catch {
        return NextResponse.json(
          { success: false, message: "팀원 데이터가 올바르지 않습니다." },
          { status: 400 },
        );
      }
      raw = {
        participationType,
        teamName: formData.get("teamName") as string,
        members,
        experienceLevel,
        motivation,
      };
    }

    // 유효성 검사
    const result = registrationSchema.safeParse(raw);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      return NextResponse.json(
        { success: false, message: "입력값을 확인해주세요.", errors },
        { status: 400 },
      );
    }

    const data = result.data;

    // 대표자 정보 결정
    let name: string;
    let email: string;
    let phone: string;
    let members: Prisma.InputJsonValue | typeof Prisma.JsonNull =
      Prisma.JsonNull;

    if (data.participationType === "INDIVIDUAL") {
      name = data.name;
      email = data.email;
      phone = data.phone;
    } else {
      name = data.members[0].name;
      email = data.members[0].email!;
      phone = data.members[0].contact;
      members = data.members as Prisma.InputJsonValue;
    }

    // 이메일 중복 확인
    const existing = await prisma.team.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "이미 등록된 이메일입니다." },
        { status: 400 },
      );
    }

    // 팀 생성
    await prisma.team.create({
      data: {
        name,
        email,
        phone,
        participationType: data.participationType,
        teamName: data.participationType === "TEAM" ? data.teamName : null,
        members,
        experienceLevel: data.experienceLevel,
        motivation: data.motivation || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "참가 신청이 완료되었습니다!",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}
