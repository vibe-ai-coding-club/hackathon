import type { Metadata } from "next";
import { RegistrationForm } from "../_components/registration-form";

export const metadata: Metadata = {
  title: "참가 신청 - 딸깍톤 2026",
  description: "딸깍톤 2026 참가 신청 페이지. 개인 또는 팀으로 신청하세요.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-24 pb-20">
      <h1 className="typo-h3 mb-1">참가 신청</h1>
      <p className="typo-body3 mb-10 text-gray-600">개인 또는 팀으로 신청해 주세요</p>
      <RegistrationForm />
    </div>
  );
}
