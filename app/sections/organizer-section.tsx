import { MotionItem } from "@/app/_components/motion-section";
import Image from "next/image";

export const OrganizerSection = () => {
  return (
    <section id="organizer" className="pb-20 md:pb-55">
      <div className="bg-gray-50 px-4 pt-10 pb-15 md:px-8 md:pt-15 md:pb-22.5">
        <div className="mx-auto max-w-7xl">
          <MotionItem>
            <div className="flex w-full flex-col items-center justify-center gap-2 md:gap-3">
              <h2 className="typo-h5 max-w-232 text-center text-gray-900 md:typo-h3">
                주관
              </h2>
            </div>
          </MotionItem>

          <div className="mt-6.5 flex flex-wrap items-center justify-center gap-3 md:mt-13 md:gap-5">
            <MotionItem delay={0.1}>
              <Image
                src="/images/sponsor-image-004.png"
                alt="바이브 코딩 클럽"
                width={300}
                height={200}
                className="object-contain"
              />
            </MotionItem>
          </div>
        </div>
      </div>
    </section>
  );
};
