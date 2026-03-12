import type { Metadata } from "next";
import { RegistrationForm } from "./_components/registration-form";

export const metadata: Metadata = {
  title: "참가 신청",
  description: "딸깍톤 2026 참가 신청. 개인 또는 팀으로 신청하세요.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-250 px-4 pt-25 sm:pt-45 pb-20">
      <div className="flex flex-col gap-2 sm:gap-3 mb-10">
        <h1 className="typo-h5 sm:typo-h3 text-gray-950">참가 신청</h1>
        <p className="typo-subtitle3 sm:typo-h6 text-gray-800">
          개인 또는 팀으로 신청해 주세요
        </p>
      </div>
      <RegistrationForm />
    </div>
  );
}
