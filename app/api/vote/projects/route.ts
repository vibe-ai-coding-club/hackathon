import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 투표 세션 조회 (가장 최근 1개)
    const session = await prisma.voteSession.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // 프로젝트 목록 + 투표 수 + 팀 정보
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        githubUrl: true,
        demoUrl: true,
        imageUrl: true,
        linkUrl: true,
        teamId: true,
        team: {
          select: {
            id: true,
            teamName: true,
            members: {
              where: { isLeader: true },
              select: { name: true },
              take: 1,
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        projects: projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          githubUrl: p.githubUrl,
          demoUrl: p.demoUrl,
          imageUrl: p.imageUrl,
          linkUrl: p.linkUrl,
          teamId: p.teamId,
          teamName: p.team.teamName || p.team.members[0]?.name || "",
          voteCount: p._count.votes,
        })),
        session: session
          ? {
              isActive: session.isActive,
              maxVotes: session.maxVotes,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Vote projects fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
