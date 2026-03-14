type InfoCardProps = {
  index: number;
  content: string;
};

export const InfoCard = ({ index, content }: InfoCardProps) => {
  const colonIndex = content.indexOf(": ");
  const title = colonIndex !== -1 ? content.slice(0, colonIndex) : content;
  const description = colonIndex !== -1 ? content.slice(colonIndex + 2) : null;

  return (
    <li className="border-b border-gray-200 py-5 last:border-b-0 md:py-10">
      <div className="flex items-start gap-2 md:gap-3">
        <span className="typo-subtitle4 shrink-0 text-gray-400 md:typo-h6">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="typo-subtitle4 text-gray-800 md:typo-h6">{title}</p>
          {description && (
            <p className="typo-body2 mt-1 text-gray-500 md:mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </li>
  );
};
