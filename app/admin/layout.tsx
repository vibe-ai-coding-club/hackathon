import type { Metadata } from "next";
import { verifyAdminSession } from "@/app/actions/admin-auth";
import { AdminAuthGuard } from "./_components/admin-auth-guard";

export const metadata: Metadata = {
  title: "Admin - 딸깍톤 2026",
  robots: { index: false, follow: false },
};

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isAuthenticated = await verifyAdminSession();

  return (
    <>
      <style>{`body { overflow: hidden; }`}</style>
      <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AdminAuthGuard isAuthenticated={isAuthenticated}>
            {children}
          </AdminAuthGuard>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
