import { prisma } from "@/lib/prisma";
import { EVALUATION_PROMPT, FULL_EVALUATION_PROMPT } from "@/lib/prompts";
import { NextRequest, NextResponse } from "next/server";

function buildProjectResponse(project: {
  id: string;
  title: string;
  description: string | null;
  features: string | null;
  tools: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  promptResult: string | null;
  promptFeedback: string | null;
  catFeedback: string | null;
  team: {
    id: string;
    teamName: string | null;
    participationType: string;
    members: { name: string; email: string }[];
  };
}) {
  const leader = project.team.members[0];

  const fillTemplate = (template: string) =>
    template
      .replace("{{title}}", project.title)
      .replace("{{description}}", project.description ?? "없음")
      .replace("{{features}}", project.features ?? "없음")
      .replace("{{tools}}", project.tools ?? "없음")
      .replace("{{githubUrl}}", project.githubUrl ?? "없음")
      .replace("{{demoUrl}}", project.demoUrl ?? "없음")
      .replace("{{videoUrl}}", project.videoUrl ?? "없음")
      .replace("{{linkUrl}}", project.linkUrl ?? "없음");

  const filledPrompt = fillTemplate(EVALUATION_PROMPT);
  const filledFullPrompt = fillTemplate(FULL_EVALUATION_PROMPT);

  return {
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
    catFeedback: project.catFeedback,
    team: {
      id: project.team.id,
      teamName: project.team.teamName,
      participationType: project.team.participationType,
      leaderName: leader?.name ?? "",
      leaderEmail: leader?.email ?? "",
    },
    evaluationPrompt: filledPrompt,
    fullEvaluationPrompt: filledFullPrompt,
  };
}

/**
 * GET /api/evaluate
 *
 * 조회 방식:
 * - ?index=순번 → 전체 프로젝트 중 순번으로 단일 조회
 * - ?team=팀이름 → 해당 팀의 프로젝트 조회
 *   - 프로젝트 1개 → 단일 반환 (data)
 *   - 프로젝트 2개+ → 목록 반환 (projects)
 *   - ?team=팀이름&project=프로젝트순번 → 해당 팀의 N번째 프로젝트 단일 반환
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teamQuery = searchParams.get("team");
  const indexQuery = searchParams.get("index");
  const projectIndexQuery = searchParams.get("project");

  if (!teamQuery && !indexQuery) {
    return NextResponse.json(
      { success: false, message: "team 또는 index 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  const teamInclude = {
    team: {
      select: {
        id: true,
        teamName: true,
        participationType: true,
        members: {
          where: { isLeader: true as const },
          select: { name: true, email: true },
          take: 1,
        },
      },
    },
  };

  try {
    // 순번 조회: 전체 프로젝트를 플랫하게 조회
    if (indexQuery) {
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: "asc" },
        include: teamInclude,
      });

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

      return NextResponse.json({
        success: true,
        data: buildProjectResponse(projects[idx - 1]),
      });
    }

    // 팀 이름으로 조회
    if (teamQuery) {
      const teams = await prisma.team.findMany({
        where: {
          OR: [
            { teamName: teamQuery },
            { teamName: { contains: teamQuery } },
          ],
        },
        select: {
          id: true,
          teamName: true,
          participationType: true,
          members: {
            where: { isLeader: true },
            select: { name: true, email: true },
            take: 1,
          },
          projects: {
            orderBy: { createdAt: "asc" },
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
          },
        },
      });

      if (teams.length === 0) {
        return NextResponse.json(
          { success: false, message: `"${teamQuery}" 팀을 찾을 수 없습니다.` },
          { status: 404 },
        );
      }

      const team = teams[0];
      const teamProjects = team.projects;

      if (teamProjects.length === 0) {
        return NextResponse.json(
          { success: false, message: `"${team.teamName}" 팀에 등록된 프로젝트가 없습니다.` },
          { status: 404 },
        );
      }

      // 프로젝트 순번 지정 시
      if (projectIndexQuery) {
        const pIdx = parseInt(projectIndexQuery, 10);
        if (isNaN(pIdx) || pIdx < 1 || pIdx > teamProjects.length) {
          return NextResponse.json(
            {
              success: false,
              message: `유효하지 않은 프로젝트 순번입니다. (1~${teamProjects.length})`,
            },
            { status: 404 },
          );
        }
        return NextResponse.json({
          success: true,
          data: buildProjectResponse(teamProjects[pIdx - 1]),
        });
      }

      // 프로젝트 1개면 바로 반환
      if (teamProjects.length === 1) {
        return NextResponse.json({
          success: true,
          data: buildProjectResponse(teamProjects[0]),
        });
      }

      // 프로젝트 2개 이상이면 목록 반환
      return NextResponse.json({
        success: true,
        teamName: team.teamName,
        projectCount: teamProjects.length,
        projects: teamProjects.map((p, i) => ({
          index: i + 1,
          projectId: p.id,
          title: p.title,
          description: p.description,
        })),
        message: `"${team.teamName}" 팀에 프로젝트가 ${teamProjects.length}개 있습니다. ?team=${teamQuery}&project=순번 으로 선택해주세요.`,
      });
    }

    return NextResponse.json(
      { success: false, message: "프로젝트를 찾을 수 없습니다." },
      { status: 404 },
    );
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
 * 평가 결과 DB 저장
 * - promptFeedback: 기본 심사 결과 (100점)
 * - catFeedback: 냥심사 통합 결과 (85점 + 15점)
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectId, promptFeedback, catFeedback } = body;

  if (!projectId || (!promptFeedback && !catFeedback)) {
    return NextResponse.json(
      {
        success: false,
        message: "projectId와 promptFeedback 또는 catFeedback이 필요합니다.",
      },
      { status: 400 },
    );
  }

  try {
    const data: { promptFeedback?: string; catFeedback?: string } = {};
    if (promptFeedback) data.promptFeedback = promptFeedback.trim();
    if (catFeedback) data.catFeedback = catFeedback.trim();

    await prisma.project.update({
      where: { id: projectId },
      data,
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
