import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/gallery/project
 * 간단 인증 후 프로젝트 설명/URL 수정 (프로젝트명, 기능, 도구는 수정 불가)
 */
export async function POST(request: NextRequest) {
  const { email, phoneLast4, projectId, description, githubUrl, demoUrl, videoUrl, linkUrl, imageUrl } =
    await request.json();

  if (!email?.trim() || !phoneLast4?.trim()) {
    return NextResponse.json(
      { success: false, message: "인증 정보가 필요합니다." },
      { status: 400 },
    );
  }

  if (!projectId) {
    return NextResponse.json(
      { success: false, message: "프로젝트 ID가 필요합니다." },
      { status: 400 },
    );
  }

  const member = await prisma.member.findUnique({
    where: { email: email.trim() },
    select: { phone: true, teamId: true },
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

  const project = await prisma.project.findFirst({
    where: { id: projectId, teamId: member.teamId },
  });

  if (!project) {
    return NextResponse.json(
      { success: false, message: "해당 팀의 프로젝트를 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      githubUrl: githubUrl?.trim() || null,
      demoUrl: demoUrl?.trim() || null,
      videoUrl: videoUrl?.trim() || null,
      linkUrl: linkUrl?.trim() || null,
    },
  });

  return NextResponse.json({ success: true });
}
