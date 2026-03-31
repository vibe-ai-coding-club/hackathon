import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "../_components/admin-nav";
import { LogoutButton } from "../_components/logout-button";
import { ProjectPageTabs } from "../_components/project-page-tabs";

export const metadata: Metadata = {
  title: "프로젝트 관리",
};

const AdminProjectsPage = async () => {
  const [projects, totalProjects, archivedProjects] = await Promise.all([
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        team: {
          select: {
            id: true,
            teamName: true,
            participationType: true,
            members: {
              where: { isLeader: true },
              select: { name: true, email: true },
              take: 1,
            },
          },
        },
      },
    }),
    prisma.project.count(),
    prisma.archivedProject.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const serializedProjects = projects.map((project) => {
    const leader = project.team.members[0];
    return {
      ...project,
      team: {
        id: project.team.id,
        leaderName: leader?.name ?? "",
        leaderEmail: leader?.email ?? "",
        teamName: project.team.teamName,
        participationType: project.team.participationType,
      },
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  });

  const archivedProjectIds = new Set(
    archivedProjects
      .map((a) => a.originalProjectId)
      .filter(Boolean) as string[],
  );

  const serializedArchived = archivedProjects.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="w-full max-w-360 mx-auto px-4 py-4">
      <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <h1 className="typo-h6 text-gray-900">딸깍톤 Admin</h1>
          <AdminNav />
        </div>
        <LogoutButton />
      </div>

      <ProjectPageTabs
        projects={serializedProjects}
        totalProjects={totalProjects}
        archivedProjects={serializedArchived}
        archivedProjectIds={[...archivedProjectIds]}
      />
    </div>
  );
};

export default AdminProjectsPage;
