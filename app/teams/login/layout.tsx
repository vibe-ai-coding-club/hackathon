import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "팀 로그인",
  robots: { index: false, follow: false },
};

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default LoginLayout;
