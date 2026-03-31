import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/gallery/auth
 * 이메일 + 전화번호 뒷4자리로 간단 인증 → 팀의 프로젝트 목록 반환
 */
export async function POST(request: NextRequest) {
  const { email, phoneLast4 } = await request.json();

  if (!email?.trim() || !phoneLast4?.trim()) {
    return NextResponse.json(
      { success: false, message: "이메일과 전화번호 뒷4자리를 입력해주세요." },
      { status: 400 },
    );
  }

  const member = await prisma.member.findUnique({
    where: { email: email.trim() },
    include: {
      team: {
        include: {
          projects: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              features: true,
              tools: true,
              imageUrl: true,
              githubUrl: true,
              demoUrl: true,
              videoUrl: true,
              linkUrl: true,
            },
          },
        },
      },
    },
  });

  if (!member) {
    return NextResponse.json(
      { success: false, message: "등록된 이메일이 아닙니다." },
      { status: 404 },
    );
  }

  if (!member.phone.endsWith(phoneLast4.trim())) {
    return NextResponse.json(
      { success: false, message: "전화번호 뒷자리가 일치하지 않습니다." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    teamName: member.team.teamName,
    projects: member.team.projects,
  });
}
