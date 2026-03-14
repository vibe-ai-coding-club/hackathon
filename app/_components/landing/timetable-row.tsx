import type { TimetableItem } from "@/app/sections/landing-data";

type TimetableRowProps = {
  item: TimetableItem;
};

export const TimetableRow = ({ item }: TimetableRowProps) => {
  return (
    <div className="flex items-start gap-6 px-5 py-7 text-left md:flex-col md:items-center md:gap-4 md:py-10 md:text-center">
      <p className="order-1 shrink-0 whitespace-nowrap typo-subtitle1 text-primary-400 md:order-2 md:typo-h5">
        {item.time}
      </p>
      <div className="order-2 md:order-1">
        <p className="typo-subtitle1 text-gray-800 md:typo-h5">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-1 typo-body2 text-gray-500 md:mt-2">
            {item.description.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
};
