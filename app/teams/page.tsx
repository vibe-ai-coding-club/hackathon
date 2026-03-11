import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeamBoard } from "./_components/team-board";

const TeamsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/teams/login");
  }

  return <TeamBoard />;
};

export default TeamsPage;
