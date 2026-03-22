import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 이벤트 설정 조회
    const setting = await prisma.eventSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // 프로젝트 목록 + 투표 수 + 좋아요 수 + 팀 정보
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
          select: { votes: true, likes: true },
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
          likeCount: p._count.likes,
        })),
        maxVotes: setting?.maxVotes ?? 5,
        presentingProjectId: setting?.presentingProjectId ?? null,
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
