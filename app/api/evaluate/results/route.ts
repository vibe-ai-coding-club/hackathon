import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/evaluate/results
 * 심사 결과가 있는 프로젝트 목록 조회
 */
export async function GET() {
  try {
    const [projects, totalLikers] = await Promise.all([
      prisma.project.findMany({
        where: {
          OR: [
            { promptFeedback: { not: null } },
            { catFeedback: { not: null } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          promptScore: true,
          catScore: true,
          promptFeedback: true,
          catFeedback: true,
          team: {
            select: {
              teamName: true,
              participationType: true,
            },
          },
          _count: {
            select: { likes: true },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      // 1번이라도 좋아요를 누른 고유 계정 수
      prisma.like
        .findMany({ select: { memberId: true }, distinct: ["memberId"] })
        .then((rows) => rows.length),
    ]);

    const data = projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      promptScore: p.promptScore,
      catScore: p.catScore,
      promptFeedback: p.promptFeedback,
      catFeedback: p.catFeedback,
      team: p.team,
      likeCount: p._count.likes,
    }));

    return NextResponse.json({
      success: true,
      data,
      totalLikers,
    });
  } catch (error) {
    console.error("Results fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
