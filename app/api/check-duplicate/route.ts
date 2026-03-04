import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  field: z.enum(["email", "contact"]),
  value: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ duplicate: false, message: "잘못된 요청입니다." }, { status: 400 });
    }

    const { field, value } = result.data;

    if (field === "email") {
      const existing = await prisma.team.findUnique({
        where: { email: value },
      });
      return NextResponse.json({ duplicate: !!existing });
    }

    // field === "contact"
    const existing = await prisma.member.findUnique({
      where: { contact: value },
    });
    return NextResponse.json({ duplicate: !!existing });
  } catch {
    return NextResponse.json({ duplicate: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
