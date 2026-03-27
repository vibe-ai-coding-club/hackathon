import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/evaluate/results
 * 심사 결과가 있는 프로젝트 목록 조회
 */
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
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
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Results fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
