import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "../_components/admin-nav";
import { LogoutButton } from "../_components/logout-button";
import { ProjectTable } from "../_components/project-table";

export const metadata: Metadata = {
  title: "프로젝트 관리",
};

const AdminProjectsPage = async () => {
  const [projects, totalProjects] = await Promise.all([
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

  return (
    <div className="w-full max-w-360 mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h1 className="typo-h6">딸깍톤 Admin</h1>
          <AdminNav />
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-3">
        <div className="typo-caption1 text-muted-foreground">
          총 <strong className="text-foreground">{totalProjects}</strong>개
          프로젝트
        </div>

        <ProjectTable projects={serializedProjects} />
      </div>
    </div>
  );
};

export default AdminProjectsPage;
