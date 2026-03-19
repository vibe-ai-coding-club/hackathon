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
        className={`text-left cursor-text hover:bg-accent/5 rounded px-1 -mx-1 transition-colors ${className ?? ""}`}
        title="클릭하여 수정"
      >
        {value || (
          <span className="text-muted-foreground/40 italic">{placeholder}</span>
        )}
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
