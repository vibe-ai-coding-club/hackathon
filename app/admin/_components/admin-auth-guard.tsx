import { LoginForm } from "./login-form";

type AdminAuthGuardProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export const AdminAuthGuard = ({
  isAuthenticated,
  children,
}: AdminAuthGuardProps) => {
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-400/10">
                <svg
                  className="h-6 w-6 text-primary-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className="typo-h6 text-gray-900">딸깍톤 Admin</h1>
              <p className="mt-1.5 typo-caption1 text-gray-500">
                관리자 비밀번호를 입력해주세요
              </p>
            </div>
            <LoginForm />
          </div>
          <p className="mt-4 text-center typo-caption2 text-gray-400">
            딸깍톤 2026 관리자 대시보드
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
