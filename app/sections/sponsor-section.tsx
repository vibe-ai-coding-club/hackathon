import { Button } from "@/app/_components/button";
import Image from "next/image";

const sponsors = [
  { name: "링티", src: "/images/sponsor-image-001.png" },
  { name: "나만의 네컷", src: "/images/sponsor-image-002.png" },
];

export const SponsorSection = () => {
  return (
    <section id="sponsor" className="pb-20 md:pb-[220px]">
      <div className="bg-gray-50 px-4 pt-10 pb-[60px] md:px-8 md:pt-[60px] md:pb-[90px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex w-full flex-col items-center justify-center gap-2 md:gap-3">
            <h2 className="typo-h5 max-w-[928px] text-center text-gray-900 md:typo-h3">후원사</h2>
          </div>
          <p className="mx-auto mt-4 text-center typo-subtitle3 text-gray-800 md:mt-6 md:typo-h6">
            대관, 장비 대여, 참여자 식사 등 더 좋은 해커톤 경험을 위해 후원을 받고 있어요
          </p>

          <div className="mt-[26px] flex flex-wrap items-center justify-center gap-3 md:mt-[52px] md:gap-5">
            {sponsors.map((sponsor) => (
              <Image
                key={sponsor.name}
                src={sponsor.src}
                alt={sponsor.name}
                width={300}
                height={200}
                className="object-contain"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[26px] flex justify-center md:mt-[52px]">
        <Button color="gray" size="small" className="md:h-[66px] md:rounded-[16px] md:px-8 md:text-[24px] md:leading-[34px] md:font-bold md:tracking-[-0.4px]">
          후원 문의하기
        </Button>
      </div>
    </section>
  );
};
