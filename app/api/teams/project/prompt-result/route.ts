import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json(
      { success: false, message: "팀 정보가 없습니다." },
      { status: 400 },
    );
  }

  const body = await req.json();
  const { projectId, promptResult } = body;

  if (!promptResult?.trim()) {
    return NextResponse.json(
      { success: false, message: "프롬프트 결과를 입력해주세요." },
      { status: 400 },
    );
  }

  // projectId가 있으면 해당 프로젝트, 없으면 첫 번째 프로젝트
  let project;
  if (projectId) {
    project = await prisma.project.findFirst({
      where: { id: projectId, teamId },
    });
  } else {
    project = await prisma.project.findFirst({
      where: { teamId },
      orderBy: { createdAt: "asc" },
    });
  }

  if (!project) {
    return NextResponse.json(
      { success: false, message: "프로젝트를 먼저 등록해주세요." },
      { status: 400 },
    );
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { promptResult: promptResult.trim() },
  });

  return NextResponse.json({ success: true });
}
