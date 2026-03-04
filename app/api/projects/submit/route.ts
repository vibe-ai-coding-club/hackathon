import { prisma } from "@/lib/prisma";
import { projectSubmitSchema } from "@/lib/validations/project";
import { NextRequest, NextResponse } from "next/server";

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
    const formData = await request.formData();

    // 허니팟 체크
    const honeypot = formData.get("website");
    if (honeypot) {
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

    // FormData 파싱
    const raw = {
      email: formData.get("email") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      githubUrl: formData.get("githubUrl") as string,
      demoUrl: (formData.get("demoUrl") as string) || "",
    };

    // 유효성 검사
    const result = projectSubmitSchema.safeParse(raw);
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

    // 이메일로 팀 조회
    const team = await prisma.team.findUnique({
      where: { email: data.email },
    });

    if (!team) {
      return NextResponse.json(
        {
          success: false,
          message: "등록된 참가 신청 정보를 찾을 수 없습니다. 대표자 이메일을 확인해주세요.",
        },
        { status: 400 },
      );
    }

    // 프로젝트 생성
    await prisma.project.create({
      data: {
        teamId: team.id,
        title: data.title,
        description: data.description,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "프로젝트가 등록되었습니다!",
    });
  } catch (error) {
    console.error("Project submit error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}
