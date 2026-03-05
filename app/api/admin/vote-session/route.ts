import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { voteSessionActionSchema } from "@/lib/validations/vote";
import { NextRequest, NextResponse } from "next/server";

/** 투표 세션 상태 조회 */
export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "권한이 없습니다." },
        { status: 401 },
      );
    }

    const session = await prisma.voteSession.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // 투표 결과 집계
    const results = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        team: {
          select: {
            teamName: true,
            name: true,
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    const totalVotes = await prisma.vote.count();

    return NextResponse.json({
      success: true,
      data: {
        session: session
          ? {
              id: session.id,
              isActive: session.isActive,
              maxVotes: session.maxVotes,
              startedAt: session.startedAt?.toISOString() ?? null,
              endedAt: session.endedAt?.toISOString() ?? null,
            }
          : null,
        results: results.map((p) => ({
          projectId: p.id,
          title: p.title,
          teamName: p.team.teamName || p.team.name,
          voteCount: p._count.votes,
        })),
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Vote session fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 투표 세션 시작/종료 */
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
    const result = voteSessionActionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { action, maxVotes } = result.data;

    if (action === "start") {
      // 기존 활성 세션이 있으면 비활성화
      await prisma.voteSession.updateMany({
        where: { isActive: true },
        data: { isActive: false, endedAt: new Date() },
      });

      // 새 세션 생성
      const session = await prisma.voteSession.create({
        data: {
          isActive: true,
          maxVotes: maxVotes ?? 5,
          startedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "투표가 시작되었습니다.",
        data: {
          id: session.id,
          isActive: session.isActive,
          maxVotes: session.maxVotes,
          startedAt: session.startedAt?.toISOString() ?? null,
        },
      });
    }

    // stop
    const updated = await prisma.voteSession.updateMany({
      where: { isActive: true },
      data: { isActive: false, endedAt: new Date() },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { success: false, message: "활성화된 투표 세션이 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "투표가 종료되었습니다.",
    });
  } catch (error) {
    console.error("Vote session action error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
