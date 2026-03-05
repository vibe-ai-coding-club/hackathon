import type { CultureItem } from "@/app/sections/landing-data";

type CultureCardProps = {
  item: CultureItem;
};

export const CultureCard = ({ item }: CultureCardProps) => {
  return (
    <article className="w-60 shrink-0 md:w-[373px]">
      <div className="aspect-[3/2] rounded-[10px] bg-gray-300 md:rounded-[14px]" />
      <div className="mt-5 space-y-1.5 text-white md:space-y-1.5">
        <h3 className="typo-subtitle1 md:typo-h6">{item.title}</h3>
        <p className="typo-body2 md:typo-subtitle3">{item.description}</p>
      </div>
    </article>
  );
};
