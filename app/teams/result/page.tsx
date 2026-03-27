import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ResultBoard } from "./_components/result-board";

export const metadata: Metadata = {
  title: "심사 결과",
  description: "딸깍톤 2026 AI 심사 결과",
  robots: { index: false, follow: false },
};

const ResultPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/teams/login");
  }

  return <ResultBoard />;
};

export default ResultPage;
