import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const existing = await prisma.archivedProject.findUnique({
      where: { originalProjectId: body.originalProjectId },
    });

    if (existing) {
      // 이미 있으면 업데이트
      await prisma.archivedProject.update({
        where: { originalProjectId: body.originalProjectId },
        data: {
          title: body.title,
          description: body.description,
          features: body.features,
          tools: body.tools,
          githubUrl: body.githubUrl,
          demoUrl: body.demoUrl,
          videoUrl: body.videoUrl,
          imageUrl: body.imageUrl,
          linkUrl: body.linkUrl,
          promptResult: body.promptResult,
          promptFeedback: body.promptFeedback,
          promptScore: body.promptScore,
          catFeedback: body.catFeedback,
          catScore: body.catScore,
          isFinals: body.isFinals ?? false,
          adminMemo: body.adminMemo,
          voteCount: body.voteCount ?? 0,
          likeCount: body.likeCount ?? 0,
          teamName: body.teamName,
          motivation: body.motivation,
          recruitmentNote: body.recruitmentNote,
          experienceLevel: body.experienceLevel,
          members: body.members,
        },
      });

      return NextResponse.json({ success: true, updated: true });
    }

    await prisma.archivedProject.create({
      data: {
        title: body.title,
        description: body.description,
        features: body.features,
        tools: body.tools,
        githubUrl: body.githubUrl,
        demoUrl: body.demoUrl,
        videoUrl: body.videoUrl,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        promptFeedback: body.promptFeedback,
        promptScore: body.promptScore,
        catFeedback: body.catFeedback,
        catScore: body.catScore,
        voteCount: body.voteCount ?? 0,
        likeCount: body.likeCount ?? 0,
        teamName: body.teamName,
        motivation: body.motivation,
        recruitmentNote: body.recruitmentNote,
        experienceLevel: body.experienceLevel,
        members: body.members,
        originalProjectId: body.originalProjectId,
      },
    });

    return NextResponse.json({ success: true, updated: false });
  } catch (error) {
    console.error("Archive save error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
