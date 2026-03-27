import { auth } from "@/lib/auth";
import { NavLinks } from "./_components/nav-links";

const TeamsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  // login 페이지는 미인증 상태에서 접근 가능
  // middleware가 나머지 /teams/* 경로를 보호

  return (
    <>
      <style>{`body { overflow: hidden; }`}</style>
      <div className="fixed inset-0 z-100 flex flex-col overflow-hidden bg-background">
        {session?.user && (
          <header className="border-b border-border shrink-0">
            <div className="mx-auto flex max-w-350 items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <h1 className="typo-subtitle1">팀 대시보드</h1>
                <span className="typo-caption1 text-muted-foreground">
                  {session.user.name}님
                </span>
              </div>
              <div className="flex items-center gap-2">
                <NavLinks />
                <form
                  action={async () => {
                    "use server";
                    const { signOut } = await import("@/lib/auth");
                    await signOut({ redirectTo: "/teams/login" });
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
            </div>
          </header>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </>
  );
};

export default TeamsLayout;
