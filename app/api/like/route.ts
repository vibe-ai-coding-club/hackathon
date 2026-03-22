import { prisma } from "@/lib/prisma";
import { likeSchema } from "@/lib/validations/vote";
import { NextRequest, NextResponse } from "next/server";

/** 내 좋아요 현황 조회 */
export async function GET(request: NextRequest) {
  try {
    const memberId = request.nextUrl.searchParams.get("memberId");
    if (!memberId) {
      return NextResponse.json(
        { success: false, message: "참가자 정보가 필요합니다." },
        { status: 400 },
      );
    }

    const likes = await prisma.like.findMany({
      where: { memberId },
      select: { projectId: true },
    });

    return NextResponse.json({
      success: true,
      data: { likedProjectIds: likes.map((l) => l.projectId) },
    });
  } catch (error) {
    console.error("Like fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 좋아요 추가 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = likeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { memberId, projectId } = result.data;

    // 멤버 존재 확인
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true },
    });
    if (!member) {
      return NextResponse.json(
        { success: false, message: "참가자 정보를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 프로젝트 존재 확인
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) {
      return NextResponse.json(
        { success: false, message: "프로젝트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 중복 확인
    const existing = await prisma.like.findUnique({
      where: { memberId_projectId: { memberId, projectId } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "이미 좋아요한 프로젝트입니다." },
        { status: 409 },
      );
    }

    await prisma.like.create({
      data: { memberId, projectId },
    });

    return NextResponse.json({
      success: true,
      message: "좋아요!",
    });
  } catch (error) {
    console.error("Like submit error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 좋아요 취소 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const result = likeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    const { memberId, projectId } = result.data;

    const deleted = await prisma.like.deleteMany({
      where: { memberId, projectId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { success: false, message: "취소할 좋아요를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "좋아요가 취소되었습니다.",
    });
  } catch (error) {
    console.error("Like cancel error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
