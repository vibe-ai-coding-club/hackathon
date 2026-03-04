import type { Metadata } from "next";
import { VotePage } from "./_components/vote-page";

export const metadata: Metadata = {
  title: "투표 - 딸깍톤 2026",
  description: "딸깍톤 프로젝트에 투표해주세요!",
};

const VotePageRoute = () => {
  return <VotePage />;
};

export default VotePageRoute;
