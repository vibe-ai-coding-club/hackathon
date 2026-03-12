import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeamBoard } from "./_components/team-board";

export const metadata: Metadata = {
  title: "팀 대시보드",
  description: "딸깍톤 2026 팀 관리 대시보드. 팀 정보 확인 및 프로젝트 등록.",
  robots: { index: false, follow: false },
};

const TeamsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/teams/login");
  }

  return <TeamBoard />;
};

export default TeamsPage;
