import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MAX_MEMBERS_PER_TEAM = 4;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.memberId) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const { targetMemberId } = await request.json();
  if (!targetMemberId) {
    return NextResponse.json(
      { success: false, message: "대상 참가자를 선택해주세요." },
      { status: 400 },
    );
  }

  const myMemberId = session.user.memberId;

  try {
    // 내 정보 조회
    const me = await prisma.member.findUnique({
      where: { id: myMemberId },
      include: {
        team: { include: { members: true } },
      },
    });

    if (!me || !me.team) {
      return NextResponse.json(
        { success: false, message: "팀 정보를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (me.team.members.length >= MAX_MEMBERS_PER_TEAM) {
      return NextResponse.json(
        { success: false, message: "내 팀의 인원이 가득 찼습니다." },
        { status: 400 },
      );
    }

    // 대상 멤버 조회
    const target = await prisma.member.findUnique({
      where: { id: targetMemberId },
      include: {
        team: { include: { members: { orderBy: { createdAt: "asc" } } } },
      },
    });

    if (!target || !target.team) {
      return NextResponse.json(
        { success: false, message: "대상 참가자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (target.teamId === me.teamId) {
      return NextResponse.json(
        { success: false, message: "이미 같은 팀입니다." },
        { status: 400 },
      );
    }

    const myTeamId = me.teamId;
    const sourceTeamId = target.teamId;
    const remainingMembers = target.team.members.filter(
      (m) => m.id !== targetMemberId,
    );

    await prisma.$transaction(async (tx) => {
      // 원래 팀에 리더가 없어지는 경우 → 승격
      if (remainingMembers.length > 0) {
        const hasLeaderLeft = target.isLeader;
        const noLeaderRemaining = !remainingMembers.some((m) => m.isLeader);
        if (hasLeaderLeft || noLeaderRemaining) {
          const newLeader = remainingMembers[0];
          await tx.member.update({
            where: { id: newLeader.id },
            data: { isLeader: true },
          });
        }
      }

      // 대상 멤버를 내 팀으로 이동
      await tx.member.update({
        where: { id: targetMemberId },
        data: { teamId: myTeamId, isLeader: false },
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

      // 내 팀 유형 변경
      if (me.team.members.length + 1 >= 2) {
        await tx.team.update({
          where: { id: myTeamId },
          data: { participationType: "TEAM" },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "참가자를 내 팀으로 데려왔습니다.",
    });
  } catch (error) {
    console.error("Team recruit error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
