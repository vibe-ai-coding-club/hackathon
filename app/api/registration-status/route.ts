import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.registrationSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      isClosed: setting?.isClosed ?? false,
    });
  } catch {
    return NextResponse.json({ isClosed: false });
  }
}
