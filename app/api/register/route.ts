import { prisma } from "@/lib/prisma";
import { teamRegistrationSchema } from "@/lib/validations/team";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 허니팟 체크
    if (body.website) {
      return NextResponse.json({ success: false, message: "잘못된 요청입니다." }, { status: 400 });
    }

    // 레이트 리밋
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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
      return NextResponse.json({ success: false, message: "모집이 마감되었습니다." }, { status: 400 });
    }

    // 유효성 검사
    const result = teamRegistrationSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      return NextResponse.json({ success: false, message: "입력값을 확인해주세요.", errors }, { status: 400 });
    }

    const data = result.data;

    // 이메일 중복 확인 (팀 대표 이메일)
    const existingTeam = await prisma.team.findUnique({
      where: { email: data.email },
    });
    if (existingTeam) {
      return NextResponse.json({ success: false, message: "이미 등록된 이메일입니다." }, { status: 400 });
    }

    // 모든 이메일 중복 일괄 체크 (멤버 테이블)
    const allEmails = [data.email];
    if (data.participationType === "TEAM" && data.members) {
      allEmails.push(...data.members.map((m) => m.email));
    }

    const existingMembers = await prisma.member.findMany({
      where: { email: { in: allEmails } },
      select: { email: true },
    });

    if (existingMembers.length > 0) {
      const duplicates = existingMembers.map((m) => m.email);
      return NextResponse.json(
        {
          success: false,
          message: "이미 등록된 이메일이 있습니다.",
          duplicateEmails: duplicates,
        },
        { status: 400 },
      );
    }

    // 팀원 내 이메일 중복 체크
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      return NextResponse.json(
        {
          success: false,
          message: "팀원 간 이메일이 중복됩니다.",
        },
        { status: 400 },
      );
    }

    // Member 데이터 구성
    const memberCreateData = [
      { name: data.name, email: data.email, phone: data.phone, isLeader: true },
      ...(data.participationType === "TEAM" && data.members
        ? data.members.map((m) => ({
            name: m.name,
            email: m.email,
            phone: m.phone,
            isLeader: false,
          }))
        : []),
    ];

    // 팀 + 멤버 생성
    await prisma.team.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        participationType: data.participationType,
        teamName: data.participationType === "TEAM" ? data.teamName : null,
        experienceLevel: data.experienceLevel,
        motivation: data.motivation || null,
        refundBank: data.refundBank,
        refundAccount: data.refundAccount,
        refundAccountHolder: data.refundAccountHolder,
        hasDeposited: data.hasDeposited,
        privacyConsent: data.privacyConsent,
        consentedAt: data.privacyConsent ? new Date() : null,
        members: {
          create: memberCreateData,
        },
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
