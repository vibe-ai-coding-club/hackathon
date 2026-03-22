import type { Metadata } from "next";
import { auth, ADMIN_EMAIL } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VotePage } from "./_components/vote-page";

export const metadata: Metadata = {
  title: "프로젝트 투표",
  description: "딸깍톤 2026 프로젝트에 투표해주세요!",
};

const VotePageRoute = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/teams/login");
  }

  const isAdmin = session.user.email === ADMIN_EMAIL;
  const { memberId, teamId, name } = session.user;

  // 관리자: 읽기 전용으로 접근
  if (isAdmin) {
    return <VotePage voter={null} />;
  }

  if (!memberId || !teamId || !name) {
    redirect("/teams/login");
  }

  return <VotePage voter={{ memberId, teamId, name }} />;
};

export default VotePageRoute;
