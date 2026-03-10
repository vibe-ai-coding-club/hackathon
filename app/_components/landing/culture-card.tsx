import Image from "next/image";

import type { CultureItem } from "@/app/sections/landing-data";

type CultureCardProps = {
  item: CultureItem;
};

export const CultureCard = ({ item }: CultureCardProps) => {
  return (
    <article className="w-60 shrink-0 md:w-[373px]">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[10px] md:rounded-[14px]">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 240px, 373px" />
      </div>
      <div className="mt-5 space-y-1.5 text-white md:space-y-1.5">
        <h3 className="typo-subtitle1 md:typo-h6">{item.title}</h3>
        <p className="typo-body2 md:typo-subtitle3">{item.description}</p>
      </div>
    </article>
  );
};
