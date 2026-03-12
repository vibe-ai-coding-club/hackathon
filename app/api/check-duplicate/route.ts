import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  field: z.enum(["email"]),
  value: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ duplicate: false, message: "잘못된 요청입니다." }, { status: 400 });
    }

    const { value } = result.data;

    // 멤버 이메일 중복 확인
    const existingMember = await prisma.member.findUnique({
      where: { email: value },
    });
    return NextResponse.json({ duplicate: !!existingMember });
  } catch {
    return NextResponse.json({ duplicate: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
