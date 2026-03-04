import { LoginForm } from "./login-form";

type AdminAuthGuardProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

export const AdminAuthGuard = ({ isAuthenticated, children }: AdminAuthGuardProps) => {
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="typo-h5">Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">관리자 비밀번호를 입력해주세요.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
