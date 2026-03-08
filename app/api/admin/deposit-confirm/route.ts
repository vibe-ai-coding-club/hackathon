import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  teamId: z.string().min(1),
  confirmed: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "권한이 없습니다." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: "잘못된 요청입니다." }, { status: 400 });
    }

    await prisma.team.update({
      where: { id: result.data.teamId },
      data: { depositConfirmed: result.data.confirmed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deposit confirm error:", error);
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
