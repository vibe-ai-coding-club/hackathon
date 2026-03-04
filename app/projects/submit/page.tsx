import type { Metadata } from "next";
import { ProjectSubmitForm } from "../../_components/project-submit-form";

export const metadata: Metadata = {
  title: "프로젝트 등록 - 딸깍톤 2026",
  description: "딸깍톤 2026 프로젝트 등록 페이지. 해커톤에서 만든 프로젝트를 등록하세요.",
};

export default function ProjectSubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-24 pb-20">
      <h1 className="typo-h3 mb-1">프로젝트 등록</h1>
      <p className="typo-body3 mb-10 text-gray-600">해커톤에서 만든 프로젝트를 등록해주세요</p>
      <ProjectSubmitForm />
    </div>
  );
}
