import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { eventSettingSchema } from "@/lib/validations/vote";
import { NextRequest, NextResponse } from "next/server";

/** 이벤트 설정 + 투표/좋아요 결과 조회 */
export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "권한이 없습니다." },
        { status: 401 },
      );
    }

    const setting = await prisma.eventSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // 투표 + 좋아요 결과 집계
    const results = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        team: {
          select: {
            teamName: true,
            members: {
              where: { isLeader: true },
              select: { name: true },
              take: 1,
            },
          },
        },
        _count: {
          select: { votes: true, likes: true },
        },
      },
    });

    const totalVotes = await prisma.vote.count();
    const totalLikes = await prisma.like.count();

    return NextResponse.json({
      success: true,
      data: {
        setting: setting
          ? {
              id: setting.id,
              maxVotes: setting.maxVotes,
              presentingProjectId: setting.presentingProjectId,
            }
          : null,
        results: results.map((p) => ({
          projectId: p.id,
          title: p.title,
          teamName: p.team.teamName || p.team.members[0]?.name || "",
          voteCount: p._count.votes,
          likeCount: p._count.likes,
        })),
        totalVotes,
        totalLikes,
      },
    });
  } catch (error) {
    console.error("Event setting fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 이벤트 설정 변경 */
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "권한이 없습니다." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = eventSettingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { maxVotes, presentingProjectId } = result.data;

    // 기존 설정 조회
    const existing = await prisma.eventSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const data: { maxVotes?: number; presentingProjectId?: string | null } = {};
    if (maxVotes !== undefined) data.maxVotes = maxVotes;
    if (presentingProjectId !== undefined)
      data.presentingProjectId = presentingProjectId;

    let setting;
    if (existing) {
      setting = await prisma.eventSetting.update({
        where: { id: existing.id },
        data,
      });
    } else {
      setting = await prisma.eventSetting.create({
        data: {
          maxVotes: maxVotes ?? 5,
          presentingProjectId: presentingProjectId ?? null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "설정이 변경되었습니다.",
      data: {
        id: setting.id,
        maxVotes: setting.maxVotes,
        presentingProjectId: setting.presentingProjectId,
      },
    });
  } catch (error) {
    console.error("Event setting action error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
