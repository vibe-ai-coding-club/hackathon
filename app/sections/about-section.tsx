import { type ReactNode } from "react";

import { MotionItem } from "@/app/_components/motion-section";
import { SectionTitle } from "@/app/_components/section-title";

const ABOUT_ITEMS: { label: string; value: ReactNode }[] = [
  { label: "모집 기간", value: "2026년 03월 14일 17:00 ~ 03월 20일 23:59" },
  { label: "대회 일시", value: "2026년 03월 28일 토요일" },
  {
    label: "장소",
    value: (
      <a
        href="https://naver.me/Fr7pSr4f"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 transition-colors hover:text-gray-900"
      >
        숭실대학교 정보과학관 102호
      </a>
    ),
  },
  {
    label: "주제",
    value: "만우절에 세상을 뒤집을 엉뚱한 서비스 만들기",
  },
  {
    label: "신청 유형",
    value: "개인 및 팀 단위 지원 (최대 4인, 개인으로 신청 후 다른 참여자와 추가 팀빌딩 가능)",
  },
  {
    label: "참가비",
    value: (
      <>
        20,000원 <span className="ml-1 text-gray-400 typo-body2">* 점심식사 비용이 포함되어있습니다.</span>
      </>
    ),
  },
  { label: "심사기준 및 방식", value: "AI 평가 및 상호평가" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="px-4 pt-[90px] md:px-8 md:pt-[180px]">
      <div className="mx-auto max-w-[1280px]">
        <MotionItem>
          <SectionTitle chipLabel="About" title="행사 소개" />
        </MotionItem>

        <div className="mt-10 w-full overflow-hidden rounded-2xl bg-gray-50 md:mt-14 md:rounded-[20px]">
          {ABOUT_ITEMS.map((item, i) => (
            <MotionItem key={item.label} delay={0.08 * (i + 1)}>
              <div className="flex items-start gap-6 border-b border-gray-200 px-5 py-5 text-left last:border-b-0 md:flex-row md:items-center md:gap-8 md:px-8 md:py-7">
                <span className="typo-subtitle1 w-[140px] shrink-0 text-gray-900 md:typo-h6 md:w-[180px]">
                  {item.label}
                </span>
                <span className="typo-body2 text-gray-700 md:typo-subtitle1">{item.value}</span>
              </div>
            </MotionItem>
          ))}
        </div>

        <MotionItem delay={0.5}>
          <p className="typo-caption mt-4 text-left text-gray-400 md:mt-6">* 상기 내용은 변경될 수 있습니다.</p>
        </MotionItem>
      </div>
    </section>
  );
};
