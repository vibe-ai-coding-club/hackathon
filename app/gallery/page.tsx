import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryContent } from "./_components/gallery-content";

export const metadata: Metadata = {
  title: "갤러리",
  description: "딸깍톤 2026 프로젝트 갤러리",
};

const GalleryPage = async () => {
  const projects = await prisma.archivedProject.findMany();

  // 본선 등수 → AI 심사 점수 순 정렬
  const sorted = [...projects].sort((a, b) => {
    if (a.isFinals && a.finalsRank != null && b.isFinals && b.finalsRank != null) {
      return a.finalsRank - b.finalsRank;
    }
    if (a.isFinals && a.finalsRank != null) return -1;
    if (b.isFinals && b.finalsRank != null) return 1;
    if (a.isFinals && !b.isFinals) return -1;
    if (!a.isFinals && b.isFinals) return 1;
    return (b.promptScore ?? 0) - (a.promptScore ?? 0);
  });

  const serialized = sorted.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return <GalleryContent projects={serialized} />;
};

export default GalleryPage;
