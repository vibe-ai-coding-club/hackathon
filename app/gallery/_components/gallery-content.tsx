"use client";

import { useState } from "react";
import { SectionTitle } from "@/app/_components/section-title";
import { MotionItem } from "@/app/_components/motion-section";
import { GalleryCard } from "./gallery-card";
import { GalleryDetailModal } from "./gallery-detail-modal";
import { ProjectEditModal } from "./project-edit-modal";
import type { SerializedArchivedProject } from "./types";

type GalleryContentProps = {
  projects: SerializedArchivedProject[];
};

export const GalleryContent = ({ projects }: GalleryContentProps) => {
  const [selected, setSelected] = useState<SerializedArchivedProject | null>(
    null,
  );
  const [showEdit, setShowEdit] = useState(false);

  return (
    <section className="px-4 pt-30 pb-22.5 md:px-8 md:pt-40 md:pb-45">
      <div className="mx-auto max-w-7xl">
        <MotionItem>
          <SectionTitle chipLabel="Gallery" title="프로젝트 갤러리" />
          <div className="flex justify-end mt-3">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowEdit(true); }}
              className="whitespace-nowrap typo-caption1 text-gray-400 transition-colors hover:text-gray-600 underline"
            >
              프로젝트 정보 수정
            </a>
          </div>
        </MotionItem>

        <div className="mt-9 grid gap-6 md:mt-13 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {projects.map((project, index) => (
            <MotionItem key={project.id} delay={0.08 * (index % 6)}>
              <GalleryCard
                project={project}
                onDetailClick={() => setSelected(project)}
              />
            </MotionItem>
          ))}
        </div>
      </div>

      {selected && (
        <GalleryDetailModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {showEdit && <ProjectEditModal onClose={() => setShowEdit(false)} />}
    </section>
  );
};
