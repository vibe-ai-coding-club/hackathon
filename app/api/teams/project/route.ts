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
  const { projectId, title, description, features, tools, githubUrl, demoUrl, videoUrl, linkUrl } = body;

  if (!title?.trim()) {
    return NextResponse.json(
      { success: false, message: "프로젝트명을 입력해주세요." },
      { status: 400 },
    );
  }

  const data = {
    title: title.trim(),
    description: description?.trim() || null,
    features: features?.trim() || null,
    tools: tools?.trim() || null,
    githubUrl: githubUrl?.trim() || null,
    demoUrl: demoUrl?.trim() || null,
    videoUrl: videoUrl?.trim() || null,
    linkUrl: linkUrl?.trim() || null,
  };

  if (projectId) {
    // 수정: 해당 프로젝트가 내 팀 소속인지 확인
    const existing = await prisma.project.findFirst({
      where: { id: projectId, teamId },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    const updated = await prisma.project.update({
      where: { id: projectId },
      data,
      select: { id: true },
    });
    return NextResponse.json({ success: true, projectId: updated.id });
  }

  // 신규 생성
  const created = await prisma.project.create({
    data: { teamId, ...data },
    select: { id: true },
  });

  return NextResponse.json({ success: true, projectId: created.id });
}
