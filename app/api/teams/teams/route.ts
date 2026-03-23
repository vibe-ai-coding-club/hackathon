import { auth, ADMIN_EMAIL } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  const isAdmin = session.user.email === ADMIN_EMAIL && !session.user.memberId;
  const myTeamId = session.user.teamId ?? null;

  // 환불 제외 전체 팀 조회 (멤버 포함)
  const teams = await prisma.team.findMany({
    where: {
      status: { not: "REFUNDED" },
    },
    select: {
      id: true,
      teamName: true,
      recruiting: true,
      recruitmentNote: true,
      participationType: true,
      experienceLevel: true,
      members: {
        select: { id: true, name: true, isLeader: true, seekingTeam: true },
        orderBy: { isLeader: "desc" },
      },
      projects: {
        select: {
          id: true,
          title: true,
          description: true,
          features: true,
          tools: true,
          githubUrl: true,
          demoUrl: true,
          videoUrl: true,
          linkUrl: true,
        },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // 현재 로그인 사용자의 프로필 정보 조회
  let myProfile = null;
  if (session.user.memberId) {
    const me = await prisma.member.findUnique({
      where: { id: session.user.memberId },
      select: { name: true, email: true, phone: true },
    });
    if (me) {
      const myTeamData = teams.find((t) => t.id === myTeamId);
      myProfile = {
        name: me.name,
        email: me.email,
        phone: me.phone,
        experienceLevel: myTeamData?.experienceLevel ?? null,
      };
    }
  }

  const result = teams.map((t, i) => ({
    id: t.id,
    order: i + 1,
    leaderName:
      t.members.find((m) => m.isLeader)?.name ?? t.members[0]?.name ?? "",
    teamName: t.teamName,
    recruiting: t.recruiting,
    recruitmentNote: t.recruitmentNote,
    participationType: t.participationType,
    experienceLevel: t.experienceLevel,
    members: t.members.map((m) => ({
      id: m.id,
      name: m.name,
      isLeader: m.isLeader,
      seekingTeam: m.seekingTeam,
    })),
    project: t.projects[0] ?? null,
    membersCount: t._count.members,
    maxMembers: 4,
    isMyTeam: t.id === myTeamId,
  }));

  return NextResponse.json({
    success: true,
    teams: result,
    myMemberId: session.user.memberId ?? null,
    myProfile,
    isAdmin,
  });
}
