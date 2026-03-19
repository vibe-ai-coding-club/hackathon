"use client";

import { useEffect, useRef, useState } from "react";

export const Tooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setShow(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [show]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShow((v) => !v);
        }}
        className="inline-flex items-center justify-center size-4 rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer"
        aria-label="도움말"
      >
        <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {show && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-lg border border-border bg-background p-2.5 text-xs text-muted-foreground shadow-lg whitespace-normal leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
};
