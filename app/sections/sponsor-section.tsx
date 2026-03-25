import { Button } from "@/app/_components/button";
import { MotionItem } from "@/app/_components/motion-section";
import Image from "next/image";

const sponsors = [
  { name: "크라이 치즈 버거", src: "/images/sponsor-image-001.png" },
  { name: "나만의 네컷", src: "/images/sponsor-image-002.png" },
  { name: "골드 래빗", src: "/images/sponsor-image-003.png" },
  { name: "바이브 코딩 클럽", src: "/images/sponsor-image-004.png" },
];

export const SponsorSection = () => {
  return (
    <section id="sponsor" className="pb-20 md:pb-55">
      <div className="bg-gray-50 px-4 pt-10 pb-15 md:px-8 md:pt-15 md:pb-22.5">
        <div className="mx-auto max-w-7xl">
          <MotionItem>
            <div className="flex w-full flex-col items-center justify-center gap-2 md:gap-3">
              <h2 className="typo-h5 max-w-232 text-center text-gray-900 md:typo-h3">
                후원사
              </h2>
            </div>
            <p className="mx-auto mt-4 text-center typo-subtitle3 text-gray-800 md:mt-6 md:typo-h6">
              대관, 장비 대여, 참여자 식사 등 더 좋은 해커톤 경험을 위해 후원을
              받고 있어요
            </p>
          </MotionItem>

          <div className="mt-6.5 flex flex-wrap items-center justify-center gap-3 md:mt-13 md:gap-5">
            {sponsors.map((sponsor, i) => (
              <MotionItem key={sponsor.name} delay={0.1 * (i + 1)}>
                <Image
                  src={sponsor.src}
                  alt={sponsor.name}
                  width={300}
                  height={200}
                  className="object-contain"
                />
              </MotionItem>
            ))}
          </div>
        </div>
      </div>

      <MotionItem delay={0.3}>
        <div className="mt-6.5 flex justify-center md:mt-13">
          <a href="mailto:vibecodingclub.team@gmail.com?subject=[후원 문의] 띨깍톤 2026">
            <Button
              color="gray"
              size="small"
              className="md:h-16.5 md:rounded-2xl md:px-8 md:text-[24px] md:leading-8.5 md:font-bold md:tracking-[-0.4px]"
            >
              후원 문의하기
            </Button>
          </a>
        </div>
      </MotionItem>
    </section>
  );
};
