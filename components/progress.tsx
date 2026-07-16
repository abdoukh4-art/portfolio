"use client";

import { useCallback, useEffect, useState } from "react";

// Épreuve status per concept, persisted in the browser (like the notes).
// A custom event keeps the topic progress bar in sync without a reload.

export type EpreuveResult = "passed" | "failed" | "redo";

const STATUSES: { id: EpreuveResult; label: string; symbol: string }[] = [
  { id: "passed", label: "réussie", symbol: "✓" },
  { id: "failed", label: "échouée", symbol: "✗" },
  { id: "redo", label: "à refaire", symbol: "↻" },
];

const EVENT = "epreuve-progress-changed";

export function progressKey(topicSlug: string, lessonSlug: string) {
  return `progress:${topicSlug}:${lessonSlug}`;
}

export function EpreuveStatus({
  topicSlug,
  lessonSlug,
}: {
  topicSlug: string;
  lessonSlug: string;
}) {
  const key = progressKey(topicSlug, lessonSlug);
  const [status, setStatus] = useState<EpreuveResult | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored === "passed" || stored === "failed" || stored === "redo")
      setStatus(stored);
  }, [key]);

  const choose = (next: EpreuveResult) => {
    const value = status === next ? null : next; // re-click to clear
    setStatus(value);
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(EVENT));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4 mt-2">
      <span className="font-mono text-xs text-muted">épreuve :</span>
      {STATUSES.map((s) => {
        const active = status === s.id;
        return (
          <button
            key={s.id}
            onClick={() => choose(s.id)}
            aria-pressed={active}
            className={`font-mono text-xs rounded-full border px-3 py-1 transition-colors cursor-pointer ${
              active
                ? s.id === "passed"
                  ? "bg-accent text-paper border-accent"
                  : "bg-ink text-paper border-ink"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {s.symbol} {s.label}
          </button>
        );
      })}
    </div>
  );
}

function readCounts(topicSlug: string, lessonSlugs: string[]) {
  let passed = 0;
  let attempted = 0;
  for (const slug of lessonSlugs) {
    const v = window.localStorage.getItem(progressKey(topicSlug, slug));
    if (v === "passed") passed++;
    if (v) attempted++;
  }
  return { passed, attempted };
}

export function TopicProgress({
  topicSlug,
  lessonSlugs,
  compact = false,
}: {
  topicSlug: string;
  lessonSlugs: string[];
  compact?: boolean;
}) {
  const [counts, setCounts] = useState<{ passed: number; attempted: number } | null>(null);

  const refresh = useCallback(() => {
    setCounts(readCounts(topicSlug, lessonSlugs));
  }, [topicSlug, lessonSlugs]);

  useEffect(() => {
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const total = lessonSlugs.length;
  if (counts === null || total === 0) return null;
  if (compact && counts.attempted === 0) return null; // untouched topic: no bar on the index

  return (
    <div className={compact ? "mt-4" : "mb-16"}>
      <div className="flex items-baseline justify-between gap-4 mb-1.5">
        <span className="font-mono text-xs text-muted">
          {counts.passed}/{total} épreuves réussies
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={counts.passed}
        aria-valuemin={0}
        aria-valuemax={total}
        className="h-1.5 rounded-full bg-line overflow-hidden"
      >
        <div
          className="h-full bg-accent rounded-full transition-[width] duration-500"
          style={{ width: `${(counts.passed / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
