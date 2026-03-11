import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 });
  }

  const teams = await prisma.team.findMany({
    where: {
      status: "CONFIRMED",
      recruitmentStatus: "RECRUITING",
    },
    select: {
      id: true,
      name: true,
      teamName: true,
      recruitmentNote: true,
      recruitmentStatus: true,
      experienceLevel: true,
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = teams.map((t) => ({
    id: t.id,
    leaderName: t.name,
    teamName: t.teamName,
    recruitmentNote: t.recruitmentNote,
    recruitmentStatus: t.recruitmentStatus,
    experienceLevel: t.experienceLevel,
    membersCount: t._count.members,
    maxMembers: 4,
  }));

  return NextResponse.json({ success: true, teams: result });
}
