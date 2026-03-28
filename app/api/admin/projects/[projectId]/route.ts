import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const { projectId } = await params;

  try {
    await prisma.project.delete({ where: { id: projectId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const { projectId } = await params;
  const body = await request.json();

  const data: Record<string, string | boolean | null> = {};
  if (body.promptResult !== undefined) {
    data.promptResult = body.promptResult?.trim() || null;
  }
  if (body.isFinals !== undefined) {
    data.isFinals = Boolean(body.isFinals);
  }
  if (body.adminMemo !== undefined) {
    data.adminMemo = body.adminMemo?.trim() || null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { success: false, message: "수정할 항목이 없습니다." },
      { status: 400 },
    );
  }

  try {
    await prisma.project.update({ where: { id: projectId }, data });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
