import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeamBuildingBoard } from "./_components/team-building-board";

const TeamBuildingPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/team-building/login");
  }

  return <TeamBuildingBoard />;
};

export default TeamBuildingPage;
