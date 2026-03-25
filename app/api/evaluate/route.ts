import { prisma } from "@/lib/prisma";
import { EVALUATION_PROMPT } from "@/lib/prompts";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/evaluate?team=팀이름 또는 ?index=순번
 * 순번/팀이름으로 프로젝트 조회 + 평가 프롬프트 반환
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teamQuery = searchParams.get("team");
  const indexQuery = searchParams.get("index");

  if (!teamQuery && !indexQuery) {
    return NextResponse.json(
      { success: false, message: "team 또는 index 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        team: {
          select: {
            id: true,
            teamName: true,
            participationType: true,
            members: {
              where: { isLeader: true },
              select: { name: true, email: true },
              take: 1,
            },
          },
        },
      },
    });

    let project;

    if (indexQuery) {
      const idx = parseInt(indexQuery, 10);
      if (isNaN(idx) || idx < 1 || idx > projects.length) {
        return NextResponse.json(
          {
            success: false,
            message: `유효하지 않은 순번입니다. (1~${projects.length})`,
          },
          { status: 404 },
        );
      }
      project = projects[idx - 1];
    } else if (teamQuery) {
      project = projects.find(
        (p) =>
          p.team.teamName === teamQuery ||
          p.team.teamName?.includes(teamQuery),
      );
      if (!project) {
        return NextResponse.json(
          { success: false, message: `"${teamQuery}" 팀을 찾을 수 없습니다.` },
          { status: 404 },
        );
      }
    }

    if (!project) {
      return NextResponse.json(
        { success: false, message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const leader = project.team.members[0];

    // 평가 프롬프트 템플릿에 데이터 채우기
    const filledPrompt = EVALUATION_PROMPT.replace("{{title}}", project.title)
      .replace("{{description}}", project.description ?? "없음")
      .replace("{{features}}", project.features ?? "없음")
      .replace("{{tools}}", project.tools ?? "없음")
      .replace("{{githubUrl}}", project.githubUrl ?? "없음")
      .replace("{{demoUrl}}", project.demoUrl ?? "없음")
      .replace("{{videoUrl}}", project.videoUrl ?? "없음")
      .replace("{{linkUrl}}", project.linkUrl ?? "없음");

    return NextResponse.json({
      success: true,
      data: {
        projectId: project.id,
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
        team: {
          id: project.team.id,
          teamName: project.team.teamName,
          participationType: project.team.participationType,
          leaderName: leader?.name ?? "",
          leaderEmail: leader?.email ?? "",
        },
        evaluationPrompt: filledPrompt,
      },
    });
  } catch (error) {
    console.error("Evaluate fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/evaluate
 * 평가 결과(promptFeedback) DB 저장
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectId, promptFeedback } = body;

  if (!projectId || !promptFeedback) {
    return NextResponse.json(
      {
        success: false,
        message: "projectId와 promptFeedback이 필요합니다.",
      },
      { status: 400 },
    );
  }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { promptFeedback: promptFeedback.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Evaluate save error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
