import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 });
  }

  const { teamId } = await params;

  try {
    const memberCount = await prisma.member.count({ where: { teamId } });

    if (memberCount > 0) {
      return NextResponse.json(
        { success: false, message: "팀원이 있는 팀은 삭제할 수 없습니다." },
        { status: 400 },
      );
    }

    await prisma.team.delete({ where: { id: teamId } });

    return NextResponse.json({ success: true, message: "팀이 삭제되었습니다." });
  } catch (error) {
    console.error("Team delete error:", error);
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
