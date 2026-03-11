import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MAX_MEMBERS_PER_TEAM = 4;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.memberId) {
    return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 });
  }

  const { targetTeamId } = await request.json();
  if (!targetTeamId) {
    return NextResponse.json({ success: false, message: "대상 팀을 선택해주세요." }, { status: 400 });
  }

  const memberId = session.user.memberId;

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: { team: { include: { members: { orderBy: { createdAt: "asc" } } } } },
    });

    if (!member) {
      return NextResponse.json({ success: false, message: "멤버를 찾을 수 없습니다." }, { status: 404 });
    }

    if (member.teamId === targetTeamId) {
      return NextResponse.json({ success: false, message: "이미 해당 팀에 속해있습니다." }, { status: 400 });
    }

    const targetTeam = await prisma.team.findUnique({
      where: { id: targetTeamId },
      include: { members: true },
    });

    if (!targetTeam) {
      return NextResponse.json({ success: false, message: "대상 팀을 찾을 수 없습니다." }, { status: 404 });
    }

    if (targetTeam.recruitmentStatus !== "RECRUITING") {
      return NextResponse.json({ success: false, message: "해당 팀은 모집 중이 아닙니다." }, { status: 400 });
    }

    if (targetTeam.members.length >= MAX_MEMBERS_PER_TEAM) {
      return NextResponse.json({ success: false, message: "해당 팀의 인원이 가득 찼습니다." }, { status: 400 });
    }

    const sourceTeamId = member.teamId;
    const remainingMembers = member.team.members.filter((m) => m.id !== memberId);

    await prisma.$transaction(async (tx) => {
      // 원래 팀에 리더가 없어지는 경우 → 승격
      if (remainingMembers.length > 0) {
        const hasLeaderLeft = member.isLeader;
        const noLeaderRemaining = !remainingMembers.some((m) => m.isLeader);
        if (hasLeaderLeft || noLeaderRemaining) {
          const newLeader = remainingMembers[0];
          await tx.member.update({
            where: { id: newLeader.id },
            data: { isLeader: true },
          });
          await tx.team.update({
            where: { id: sourceTeamId },
            data: {
              name: newLeader.name,
              email: newLeader.email,
              phone: newLeader.phone,
            },
          });
        }
      }

      // 멤버 이동
      await tx.member.update({
        where: { id: memberId },
        data: { teamId: targetTeamId, isLeader: false },
      });

      // 원래 팀: 빈 팀 삭제 또는 유형 변경
      if (remainingMembers.length === 0) {
        await tx.team.delete({ where: { id: sourceTeamId } });
      } else if (remainingMembers.length === 1) {
        await tx.team.update({
          where: { id: sourceTeamId },
          data: { participationType: "INDIVIDUAL" },
        });
      }

      // 대상 팀 유형 변경
      if (targetTeam.members.length + 1 >= 2) {
        await tx.team.update({
          where: { id: targetTeamId },
          data: { participationType: "TEAM" },
        });
      }
    });

    return NextResponse.json({ success: true, message: "팀이 이동되었습니다." });
  } catch (error) {
    console.error("Team transfer error:", error);
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
