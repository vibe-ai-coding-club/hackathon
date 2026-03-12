import { verifyAdminSession } from "@/app/actions/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 리더가 없는 팀에 리더를 자동 배정
export async function POST() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const teams = await prisma.team.findMany({
    include: {
      members: { orderBy: { createdAt: "asc" } },
    },
  });

  let fixed = 0;
  for (const team of teams) {
    if (team.members.length === 0) continue;
    const hasLeader = team.members.some((m) => m.isLeader);
    if (hasLeader) continue;

    const newLeader = team.members[0];
    await prisma.member.update({
      where: { id: newLeader.id },
      data: { isLeader: true },
    });
    fixed++;
  }

  return NextResponse.json({ success: true, fixed });
}
