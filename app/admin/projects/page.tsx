import { prisma } from "@/lib/prisma";
import { LogoutButton } from "../_components/logout-button";
import { AdminNav } from "../_components/admin-nav";
import { ProjectTable } from "../_components/project-table";

const AdminProjectsPage = async () => {
  const [projects, totalProjects] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            email: true,
            teamName: true,
            participationType: true,
          },
        },
      },
    }),
    prisma.project.count(),
  ]);

  const serializedProjects = projects.map((project) => ({
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="typo-h5">딸깍톤 Admin</h1>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        <AdminNav />

        {/* 프로젝트 통계 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">총 프로젝트 수</p>
            <p className="mt-1 typo-h4">{totalProjects}</p>
          </div>
        </div>

        <ProjectTable projects={serializedProjects} />
      </div>
    </div>
  );
};

export default AdminProjectsPage;
