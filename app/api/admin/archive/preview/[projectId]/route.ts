import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const { projectId } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          select: {
            teamName: true,
            motivation: true,
            recruitmentNote: true,
            experienceLevel: true,
            members: {
              select: { name: true, email: true, isLeader: true },
            },
          },
        },
        _count: { select: { votes: true, likes: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const existing = await prisma.archivedProject.findUnique({
      where: { originalProjectId: projectId },
    });

    const preview = {
      title: project.title,
      description: project.description,
      features: project.features,
      tools: project.tools,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl,
      videoUrl: project.videoUrl,
      imageUrl: project.imageUrl,
      linkUrl: project.linkUrl,
      promptResult: project.promptResult,
      promptFeedback: project.promptFeedback,
      promptScore: project.promptScore,
      catFeedback: project.catFeedback,
      catScore: project.catScore,
      isFinals: project.isFinals,
      adminMemo: project.adminMemo,
      voteCount: project._count.votes,
      likeCount: project._count.likes,
      teamName: project.team.teamName,
      motivation: project.team.motivation,
      recruitmentNote: project.team.recruitmentNote,
      experienceLevel: project.team.experienceLevel,
      members: project.team.members.map((m) => ({
        name: m.name,
        email: m.email,
        isLeader: m.isLeader,
      })),
      originalProjectId: projectId,
    };

    return NextResponse.json({
      success: true,
      data: preview,
      alreadyArchived: !!existing,
    });
  } catch (error) {
    console.error("Archive preview error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
