import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["NOT_RECRUITING", "RECRUITING", "CLOSED"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 });
  }

  const { teamId } = await params;
  const body = await request.json();
  const { recruitmentStatus } = body;

  if (!VALID_STATUSES.includes(recruitmentStatus)) {
    return NextResponse.json({ success: false, message: "올바르지 않은 모집 상태값입니다." }, { status: 400 });
  }

  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { recruitmentStatus },
      select: { id: true, recruitmentStatus: true },
    });

    return NextResponse.json({ success: true, team });
  } catch {
    return NextResponse.json({ success: false, message: "팀을 찾을 수 없습니다." }, { status: 404 });
  }
}
