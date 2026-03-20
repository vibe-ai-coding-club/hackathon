import { auth, ADMIN_EMAIL } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const isAdmin =
    session.user.email === ADMIN_EMAIL && !session.user.memberId;

  // 어드민: body.teamId로 아무 팀이나 수정 가능
  // 일반 유저: 자기 팀만 수정 가능 (리더 검증)
  let teamId: string | undefined;

  if (isAdmin) {
    teamId = body.teamId;
    if (!teamId) {
      return NextResponse.json(
        { success: false, message: "수정할 팀 ID가 필요합니다." },
        { status: 400 },
      );
    }
  } else {
    teamId = session.user.teamId;
    if (!teamId) {
      return NextResponse.json(
        { success: false, message: "팀 정보가 없습니다." },
        { status: 400 },
      );
    }
  }

  const { teamName, recruitmentNote, recruiting } = body;

  const data: Record<string, string | boolean | null> = {};
  if (teamName !== undefined) data.teamName = teamName || null;
  if (recruitmentNote !== undefined)
    data.recruitmentNote = recruitmentNote || null;
  if (recruiting !== undefined) data.recruiting = !!recruiting;

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { success: false, message: "수정할 항목이 없습니다." },
      { status: 400 },
    );
  }

  await prisma.team.update({
    where: { id: teamId },
    data,
  });

  return NextResponse.json({ success: true });
}
