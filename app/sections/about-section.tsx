import Image from "next/image";

import { SectionTitle } from "@/app/_components/section-title";
import { ABOUT_CARDS } from "./landing-data";

export const AboutSection = () => {
  return (
    <section id="about" className="px-4 pt-[90px] md:px-8 md:pt-[180px]">
      <div className="mx-auto max-w-[1280px]">
        <SectionTitle chipLabel="About" title="언제, 어디에서, 누가 참여할 수 있나요?" />

        <div className="mt-9 grid gap-8 md:mt-[52px] md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {ABOUT_CARDS.map((card, index) => (
            <article
              key={card.title}
              className={`overflow-hidden rounded-xl md:rounded-[14px] ${
                index === 2 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl md:rounded-[14px] border-2 border-[#FFE342]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="mt-0 flex h-[114px] flex-col justify-center rounded-xl bg-gray-50 px-5 md:rounded-[14px] md:px-7">
                <h3 className="typo-subtitle1 text-gray-850 md:typo-h6">{card.title}</h3>
                <p className="typo-body2 mt-0.5 text-gray-700 md:mt-1">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
