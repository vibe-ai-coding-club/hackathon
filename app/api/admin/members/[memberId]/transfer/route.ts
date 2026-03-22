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
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const { memberId } = await params;
  const body = await request.json();
  const { targetTeamId, createNewTeam } = body;

  if (!targetTeamId && !createNewTeam) {
    return NextResponse.json(
      { success: false, message: "대상 팀을 선택해주세요." },
      { status: 400 },
    );
  }

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

    const sourceTeamId = member.teamId;
    const remainingMembers = member.team.members.filter(
      (m) => m.id !== memberId,
    );
    const sourceTeamEmpty = remainingMembers.length === 0;

    // 새 팀 생성 모드
    if (createNewTeam) {
      let newTeamId: string = "";

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
          }
        }

        // 원래 팀: 1명 남으면 개인으로 변경
        if (remainingMembers.length === 1) {
          await tx.team.update({
            where: { id: sourceTeamId },
            data: { participationType: "INDIVIDUAL" },
          });
        }

        // 새 팀 생성 (원래 팀의 환불 계좌 정보 복사)
        const newTeam = await tx.team.create({
          data: {
            participationType: "INDIVIDUAL",
            experienceLevel: member.team.experienceLevel,
            status: member.team.status,
            refundBank: member.refundBank ?? member.team.refundBank,
            refundAccount: member.refundAccount ?? member.team.refundAccount,
            refundAccountHolder:
              member.refundAccountHolder ??
              member.team.refundAccountHolder,
            privacyConsent: true,
            consentedAt: new Date(),
          },
        });
        newTeamId = newTeam.id;

        // 멤버를 새 팀의 리더로 이동
        await tx.member.update({
          where: { id: memberId },
          data: { teamId: newTeam.id, isLeader: true },
        });
      });

      return NextResponse.json({
        success: true,
        message: "새 팀이 생성되고 멤버가 이동되었습니다.",
        sourceTeamEmpty,
        newTeamId,
      });
    }

    // 기존 팀으로 이동 모드
    if (member.teamId === targetTeamId) {
      return NextResponse.json(
        { success: false, message: "같은 팀으로는 이동할 수 없습니다." },
        { status: 400 },
      );
    }

    const targetTeamMemberCount = await prisma.member.count({
      where: { teamId: targetTeamId },
    });

    if (targetTeamMemberCount >= MAX_MEMBERS_PER_TEAM) {
      return NextResponse.json(
        {
          success: false,
          message: "대상 팀의 인원이 가득 찼습니다. (최대 4명)",
        },
        { status: 400 },
      );
    }

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
        }
      }

      // 멤버 이동 (isLeader를 false로 변경)
      await tx.member.update({
        where: { id: memberId },
        data: { teamId: targetTeamId, isLeader: false },
      });

      // 원래 팀: 1명 남으면 개인으로 변경
      if (remainingMembers.length === 1) {
        await tx.team.update({
          where: { id: sourceTeamId },
          data: { participationType: "INDIVIDUAL" },
        });
      }

      // 대상 팀: 2명 이상이 되면 팀으로 변경
      if (targetTeamMemberCount + 1 >= 2) {
        await tx.team.update({
          where: { id: targetTeamId },
          data: { participationType: "TEAM" },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "멤버가 이동되었습니다.",
      sourceTeamEmpty,
    });
  } catch (error) {
    console.error("Member transfer error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
