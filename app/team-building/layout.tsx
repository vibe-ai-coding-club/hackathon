import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const TeamBuildingLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  // login 페이지는 미인증 상태에서 접근 가능
  // middleware가 나머지 /team-building/* 경로를 보호

  return (
    <div className="min-h-screen bg-background">
      {session?.user && (
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <h1 className="typo-subtitle1">팀 빌딩</h1>
              <span className="typo-caption1 text-muted-foreground">
                {session.user.name}님
              </span>
            </div>
            <form
              action={async () => {
                "use server";
                const { signOut } = await import("@/lib/auth");
                await signOut({ redirectTo: "/team-building/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                로그아웃
              </button>
            </form>
          </div>
        </header>
      )}
      {children}
    </div>
  );
};

export default TeamBuildingLayout;
