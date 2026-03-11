type Props = {
  toast: { success: boolean; message: string } | null;
  onClose: () => void;
};

export const Toast = ({ toast, onClose }: Props) => (
  <div
    className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-6 py-3.5 shadow-lg transition-all duration-300 ${
      toast
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-4 opacity-0"
    } ${toast?.success ? "bg-success text-white" : "bg-error text-white"}`}
  >
    <span className="typo-subtitle4">{toast?.message}</span>
    <button
      type="button"
      onClick={onClose}
      className="ml-1 shrink-0 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
    >
      <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  </div>
);
