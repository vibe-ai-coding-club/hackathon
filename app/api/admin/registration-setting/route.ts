import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/** 신청 마감 상태 조회 */
export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "권한이 없습니다." },
        { status: 401 },
      );
    }

    const setting = await prisma.registrationSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        isClosed: setting?.isClosed ?? false,
        closedAt: setting?.closedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("Registration setting fetch error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 신청 마감 상태 변경 */
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
    const isClosed = Boolean(body.isClosed);

    const existing = await prisma.registrationSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      await prisma.registrationSetting.update({
        where: { id: existing.id },
        data: {
          isClosed,
          closedAt: isClosed ? new Date() : null,
        },
      });
    } else {
      await prisma.registrationSetting.create({
        data: {
          isClosed,
          closedAt: isClosed ? new Date() : null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: isClosed ? "신청이 마감되었습니다." : "신청이 오픈되었습니다.",
      data: { isClosed },
    });
  } catch (error) {
    console.error("Registration setting update error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
