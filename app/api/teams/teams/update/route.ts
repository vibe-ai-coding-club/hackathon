import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 });
  }

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ success: false, message: "팀 정보가 없습니다." }, { status: 400 });
  }

  // 리더만 수정 가능 (리더가 없는 팀은 첫 번째 멤버를 리더로 간주)
  const member = await prisma.member.findUnique({
    where: { id: session.user.memberId },
    select: { isLeader: true, teamId: true },
  });

  if (!member || member.teamId !== teamId) {
    return NextResponse.json({ success: false, message: "팀 리더만 수정할 수 있습니다." }, { status: 403 });
  }

  if (!member.isLeader) {
    const hasAnyLeader = await prisma.member.findFirst({
      where: { teamId, isLeader: true },
      select: { id: true },
    });
    if (hasAnyLeader) {
      return NextResponse.json({ success: false, message: "팀 리더만 수정할 수 있습니다." }, { status: 403 });
    }
    const firstMember = await prisma.member.findFirst({
      where: { teamId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (firstMember?.id !== session.user.memberId) {
      return NextResponse.json({ success: false, message: "팀 리더만 수정할 수 있습니다." }, { status: 403 });
    }
  }

  const body = await req.json();
  const { teamName, motivation, recruitmentNote } = body;

  const data: Record<string, string | null> = {};
  if (teamName !== undefined) data.teamName = teamName || null;
  if (motivation !== undefined) data.motivation = motivation || null;
  if (recruitmentNote !== undefined) data.recruitmentNote = recruitmentNote || null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "수정할 항목이 없습니다." }, { status: 400 });
  }

  await prisma.team.update({
    where: { id: teamId },
    data,
  });

  return NextResponse.json({ success: true });
}
