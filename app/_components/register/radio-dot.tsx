export const RadioDot = ({ checked }: { checked: boolean }) => (
  <span
    className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
      checked ? "border-primary-400" : "border-gray-300"
    }`}
  >
    {checked && <span className="size-2 rounded-full bg-primary-400" />}
  </span>
);
