import { prisma } from "@/lib/prisma";
import { verifyVoterSchema } from "@/lib/validations/vote";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = verifyVoterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "올바른 이메일을 입력해주세요." },
        { status: 400 },
      );
    }

    const member = await prisma.member.findUnique({
      where: { email: result.data.email },
      select: {
        id: true,
        name: true,
        teamId: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "등록된 참가자 정보를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        memberId: member.id,
        name: member.name,
        teamId: member.teamId,
      },
    });
  } catch (error) {
    console.error("Vote verify error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
