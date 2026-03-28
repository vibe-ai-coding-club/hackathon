import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** 현재 팀에서 나와 새 1인 팀으로 시작 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.memberId) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  // 팀원 변경 종료
  return NextResponse.json(
    { success: false, message: "팀원 변경이 종료되었습니다." },
    { status: 403 },
  );

  /* 팀원 변경 기능 비활성화
  const memberId = session.user.memberId;

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        team: { include: { members: { orderBy: { createdAt: "asc" } } } },
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "멤버를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (member.team.members.length < 2) {
      return NextResponse.json(
        { success: false, message: "1인 팀에서는 나갈 수 없습니다." },
        { status: 400 },
      );
    }

    const sourceTeamId = member.teamId;
    const remainingMembers = member.team.members.filter(
      (m) => m.id !== memberId,
    );

    await prisma.$transaction(async (tx) => {
      // 원래 팀에 리더가 없어지는 경우 → 승격
      if (member.isLeader && remainingMembers.length > 0) {
        const newLeader = remainingMembers[0];
        await tx.member.update({
          where: { id: newLeader.id },
          data: { isLeader: true },
        });
      }

      // 새 1인 팀 생성
      const newTeam = await tx.team.create({
        data: {
          participationType: "INDIVIDUAL",
          status: member.team.status,
          experienceLevel: member.team.experienceLevel,
          refundBank: member.refundBank ?? member.team.refundBank,
          refundAccount: member.refundAccount ?? member.team.refundAccount,
          refundAccountHolder:
            member.refundAccountHolder ?? member.team.refundAccountHolder,
          hasDeposited: member.team.hasDeposited,
          depositConfirmed: member.team.depositConfirmed,
          privacyConsent: member.team.privacyConsent,
          consentedAt: member.team.consentedAt,
        },
      });

      // 멤버를 새 팀으로 이동
      await tx.member.update({
        where: { id: memberId },
        data: {
          teamId: newTeam.id,
          isLeader: true,
          seekingTeam: true,
        },
      });

      // 원래 팀: 1명 남으면 유형 변경
      if (remainingMembers.length === 1) {
        await tx.team.update({
          where: { id: sourceTeamId },
          data: { participationType: "INDIVIDUAL" },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "새 팀으로 시작합니다.",
    });
  } catch (error) {
    console.error("Team leave error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
  */
}
