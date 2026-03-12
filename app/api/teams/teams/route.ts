import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 });
  }

  const myTeamId = session.user.teamId ?? null;

  // 환불 제외 전체 팀 조회 (멤버 포함)
  const teams = await prisma.team.findMany({
    where: {
      status: { not: "REFUNDED" },
    },
    select: {
      id: true,
      name: true,
      teamName: true,
      motivation: true,
      recruitmentNote: true,
      participationType: true,
      experienceLevel: true,
      members: {
        select: { id: true, name: true, isLeader: true },
        orderBy: { isLeader: "desc" },
      },
      projects: {
        select: { id: true, title: true, githubUrl: true, demoUrl: true, linkUrl: true, description: true },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const result = teams.map((t) => ({
    id: t.id,
    leaderName: t.name,
    teamName: t.teamName,
    motivation: t.motivation,
    recruitmentNote: t.recruitmentNote,
    participationType: t.participationType,
    experienceLevel: t.experienceLevel,
    members: t.members.map((m) => ({ id: m.id, name: m.name, isLeader: m.isLeader })),
    project: t.projects[0] ?? null,
    membersCount: t._count.members,
    maxMembers: 4,
    isMyTeam: t.id === myTeamId,
  }));

  return NextResponse.json({ success: true, teams: result, myMemberId: session.user.memberId ?? null });
}
