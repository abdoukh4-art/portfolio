"use client";

import Link from "next/link";
import { LanguageProvider, LanguageToggle, useLanguage } from "./language";
import { Reveal } from "./reveal";
import { ThemeToggle } from "./theme-toggle";
import { TopicProgress } from "./progress";
import { ExportNotes } from "./export-notes";

type LearnIndexProps = {
  topicLessons: Record<string, string[]>;
  exportTopics: { slug: string; title: string; lessons: string[] }[];
};

// Renders **bold** spans from the content dictionary.
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-ink font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function LearnIndexContent({ topicLessons, exportTopics }: LearnIndexProps) {
  const { t } = useLanguage();
  return (
    <div>
      <header className="sticky top-0 z-10 bg-paper/85 backdrop-blur border-b border-line">
        <nav className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-display font-semibold tracking-tight">
            abdou4art
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="font-mono text-xs text-muted hover:text-ink transition-colors"
            >
              ← portfolio
            </Link>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <Reveal>
          <p className="font-mono text-xs tracking-widest lowercase text-accent mb-3">
            <span aria-hidden>·</span> {t.nav.learn.toLowerCase()}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight leading-tight mb-4">
            {t.learn.heading}
          </h1>
          <div className="border-l-2 border-accent pl-6 max-w-2xl mb-8">
            <p className="font-display text-xl font-semibold tracking-tight mb-4">
              {t.learn.bio.title}
            </p>
            {t.learn.bio.paragraphs.map((p, i) => (
              <p key={i} className="text-muted leading-relaxed mb-4 last:mb-0">
                <RichText text={p} />
              </p>
            ))}
          </div>
          <div className="mb-12">
            <ExportNotes topics={exportTopics} />
          </div>
        </Reveal>
        <div className="space-y-6">
          {t.learn.topics.map((topic) => (
            <Reveal key={topic.slug}>
              <Link
                href={`/learn/${topic.slug}`}
                className="group block border border-line rounded-lg px-6 py-6 hover:border-accent transition-colors"
              >
                <p className="font-mono text-xs text-accent mb-2">{topic.status}</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-2">
                  {topic.title}
                </h2>
                <p className="text-muted leading-relaxed max-w-2xl mb-4">
                  {topic.description}
                </p>
                <p className="font-mono text-xs">
                  <span className="text-ink group-hover:text-accent transition-colors">
                    {t.learn.cta} →
                  </span>
                  <span className="text-muted ml-3">{t.learn.langNote}</span>
                </p>
                <TopicProgress
                  topicSlug={topic.slug}
                  lessonSlugs={topicLessons[topic.slug] ?? []}
                  compact
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  );
}

export function LearnIndex(props: LearnIndexProps) {
  return (
    <LanguageProvider>
      <LearnIndexContent {...props} />
    </LanguageProvider>
  );
}
