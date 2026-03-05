import type { TimetableItem } from "@/app/sections/landing-data";

type TimetableRowProps = {
  item: TimetableItem;
};

export const TimetableRow = ({ item }: TimetableRowProps) => {
  return (
    <div className="flex items-center justify-center gap-6 px-5 py-7 text-left md:flex-col md:gap-4 md:py-10 md:text-center">
      <p className="order-2 w-[149px] typo-subtitle1 text-gray-800 md:order-1 md:w-auto md:typo-h5">
        {item.title}
      </p>
      <p className="order-1 shrink-0 whitespace-nowrap typo-subtitle1 text-primary-400 md:order-2 md:typo-h5">
        {item.time}
      </p>
    </div>
  );
};
