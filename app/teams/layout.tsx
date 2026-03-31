import { redirect } from "next/navigation";

const TeamsLayout = async ({ children }: { children: React.ReactNode }) => {
  // 참가자 대시보드 임시 비활성화 — 갤러리 페이지에서 프로젝트 수정 가능
  redirect("/gallery");

  return <>{children}</>;
};

export default TeamsLayout;
