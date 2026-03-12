import type { Metadata } from "next";
import { VotePage } from "./_components/vote-page";

export const metadata: Metadata = {
  title: "프로젝트 투표",
  description: "딸깍톤 2026 프로젝트에 투표해주세요!",
};

const VotePageRoute = () => {
  return <VotePage />;
};

export default VotePageRoute;
