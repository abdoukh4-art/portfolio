"use client";

import { useEffect, useState } from "react";

// Free-writing zone for the student, persisted in the browser only.
// One per lesson section (cold answers, test answers, journal).
export function NotesArea({
  storageKey,
  label,
  placeholder,
}: {
  storageKey: string;
  label: string;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored !== null) setValue(stored);
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded || saved) return;
    const t = setTimeout(() => {
      window.localStorage.setItem(storageKey, value);
      setSaved(true);
    }, 400);
    return () => clearTimeout(t);
  }, [value, saved, loaded, storageKey]);

  return (
    <div className="my-6 border border-dashed border-accent/40 rounded-lg bg-accent-soft/50 px-4 py-3">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <label
          htmlFor={storageKey}
          className="font-mono text-xs text-accent tracking-wide"
        >
          ✍ {label}
        </label>
        <span
          className={`font-mono text-[10px] transition-opacity ${
            saved && value ? "text-muted opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          ✓ enregistré dans ce navigateur
        </span>
      </div>
      <textarea
        id={storageKey}
        value={value}
        placeholder={placeholder}
        rows={Math.max(4, value.split("\n").length + 1)}
        spellCheck={false}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        className="w-full resize-y bg-paper border border-line rounded-md px-3 py-2 font-mono text-sm leading-relaxed placeholder:text-muted/60 focus:outline-none focus:border-accent"
      />
    </div>
  );
}
