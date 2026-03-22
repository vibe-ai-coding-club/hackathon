import { prisma } from "@/lib/prisma";
import { cancelVoteSchema, submitVoteSchema } from "@/lib/validations/vote";
import { NextRequest, NextResponse } from "next/server";

/** 내 투표 현황 조회 */
export async function GET(request: NextRequest) {
  try {
    const memberId = request.nextUrl.searchParams.get("memberId");
    if (!memberId) {
      return NextResponse.json(
        { success: false, message: "투표자 정보가 필요합니다." },
        { status: 400 },
      );
    }

    const votes = await prisma.vote.findMany({
      where: { memberId },
      select: { projectId: true },
    });

    return NextResponse.json({
      success: true,
      data: { votedProjectIds: votes.map((v) => v.projectId) },
    });
  } catch (error) {
    console.error("Vote fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 투표 제출 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = submitVoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { memberId, projectId } = result.data;

    // 1. 멤버 존재 확인
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, teamId: true },
    });
    if (!member) {
      return NextResponse.json(
        { success: false, message: "투표자 정보를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 2. 프로젝트 존재 확인
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, teamId: true },
    });
    if (!project) {
      return NextResponse.json(
        { success: false, message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 3. 자기 팀 투표 차단
    if (member.teamId === project.teamId) {
      return NextResponse.json(
        { success: false, message: "자기 팀 프로젝트에는 투표할 수 없습니다." },
        { status: 403 },
      );
    }

    // 4. 투표 수 제한 확인 (EventSetting에서 maxVotes 조회)
    const setting = await prisma.eventSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const maxVotes = setting?.maxVotes ?? 5;

    const voteCount = await prisma.vote.count({
      where: { memberId },
    });
    if (voteCount >= maxVotes) {
      return NextResponse.json(
        {
          success: false,
          message: `최대 ${maxVotes}개까지 투표할 수 있습니다.`,
        },
        { status: 403 },
      );
    }

    // 5. 중복 투표 확인
    const existingVote = await prisma.vote.findUnique({
      where: { memberId_projectId: { memberId, projectId } },
    });
    if (existingVote) {
      return NextResponse.json(
        { success: false, message: "이미 투표한 프로젝트입니다." },
        { status: 409 },
      );
    }

    // 투표 생성
    await prisma.vote.create({
      data: { memberId, projectId },
    });

    return NextResponse.json({
      success: true,
      message: "투표가 완료되었습니다!",
    });
  } catch (error) {
    console.error("Vote submit error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 투표 취소 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const result = cancelVoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { memberId, projectId } = result.data;

    // 투표 삭제
    const deleted = await prisma.vote.deleteMany({
      where: { memberId, projectId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { success: false, message: "취소할 투표를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "투표가 취소되었습니다.",
    });
  } catch (error) {
    console.error("Vote cancel error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
