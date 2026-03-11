import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MAX_MEMBERS_PER_TEAM = 4;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 });
  }

  const { memberId } = await params;
  const body = await request.json();
  const { targetTeamId } = body;

  if (!targetTeamId) {
    return NextResponse.json({ success: false, message: "대상 팀을 선택해주세요." }, { status: 400 });
  }

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { team: { include: { members: { orderBy: { createdAt: "asc" } } } } },
    });

    if (!member) {
      return NextResponse.json({ success: false, message: "멤버를 찾을 수 없습니다." }, { status: 404 });
    }

    if (member.teamId === targetTeamId) {
      return NextResponse.json({ success: false, message: "같은 팀으로는 이동할 수 없습니다." }, { status: 400 });
    }

    const targetTeamMemberCount = await prisma.member.count({
      where: { teamId: targetTeamId },
    });

    if (targetTeamMemberCount >= MAX_MEMBERS_PER_TEAM) {
      return NextResponse.json({ success: false, message: "대상 팀의 인원이 가득 찼습니다. (최대 4명)" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 팀장이 이동하는 경우: 원래 팀의 다른 멤버를 팀장으로 승격
      if (member.isLeader) {
        const otherMember = member.team.members.find((m) => m.id !== memberId);
        if (otherMember) {
          await tx.member.update({
            where: { id: otherMember.id },
            data: { isLeader: true },
          });
        }
      }

      // 멤버 이동 (isLeader를 false로 변경)
      await tx.member.update({
        where: { id: memberId },
        data: { teamId: targetTeamId, isLeader: false },
      });
    });

    return NextResponse.json({ success: true, message: "멤버가 이동되었습니다." });
  } catch (error) {
    console.error("Member transfer error:", error);
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
