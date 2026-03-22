import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "투표 관리",
};

const VotesLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default VotesLayout;
