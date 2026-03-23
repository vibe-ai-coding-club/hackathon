"use client";

import { useEffect, useRef, useState } from "react";

export const EditableCell = ({
  value,
  placeholder,
  onSave,
  className,
}: {
  value: string;
  placeholder: string;
  onSave: (val: string) => void;
  className?: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) onSave(trimmed);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={`inline-flex items-center gap-1 text-left cursor-text hover:bg-accent/5 rounded px-1 -mx-1 transition-colors group ${className ?? ""}`}
        title="클릭하여 수정"
      >
        {value || (
          <span className="text-muted-foreground/40 italic">{placeholder}</span>
        )}
        <svg
          className="size-3 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
        </svg>
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
      placeholder={placeholder}
      className={`rounded border border-accent/40 bg-background px-1 -mx-1 outline-none text-sm ${className ?? ""}`}
    />
  );
};
