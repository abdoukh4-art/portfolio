import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { getLessons, learnTopics } from "@/lib/learn";
import { NotesArea } from "@/components/notes-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { EpreuveStatus, TopicProgress } from "@/components/progress";
import { ExportNotes } from "@/components/export-notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return learnTopics.map((t) => ({ topic: t.slug }));
}

type Chunk = { heading: string | null; html: string };

// Prof's lessons share a fixed structure (## Avant de lire, ## Explication…,
// ## Épreuve, ## Journal). Split on those h2s so writing zones can be
// inserted after the sections where the student is supposed to write.
function splitLesson(markdown: string): Chunk[] {
  const chunks: { heading: string | null; lines: string[] }[] = [
    { heading: null, lines: [] },
  ];
  for (const line of markdown.split("\n")) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) chunks.push({ heading: m[1], lines: [line] });
    else chunks[chunks.length - 1].lines.push(line);
  }
  return chunks
    .filter((c) => c.heading !== null || c.lines.some((l) => l.trim()))
    .map((c) => ({
      heading: c.heading,
      html: marked.parse(c.lines.join("\n"), { async: false }) as string,
    }));
}

function writingZone(heading: string | null) {
  const h = heading?.toLowerCase() ?? "";
  if (h.includes("avant de lire"))
    return {
      id: "froid",
      label: "à toi — réponds à froid, avant de lire la suite",
      placeholder:
        "Écris tes réponses ici, même fausses ou incomplètes — le but est de forcer ta mémoire, pas d'être juste.",
    };
  if (h.includes("épreuve") || h.includes("epreuve"))
    return {
      id: "epreuve",
      label: "à toi — tes réponses à l'épreuve",
      placeholder:
        "Reconstruis, discrimine, justifie — sans regarder le code ni la leçon.",
    };
  if (h.includes("journal"))
    return {
      id: "journal",
      label: "ton journal",
      placeholder: "[date] concept | où ça a cassé | quelle question m'a eu",
    };
  return null;
}

export default async function LearnTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topicIndex = learnTopics.findIndex((t) => t.slug === slug);
  if (topicIndex === -1) notFound();
  const topic = learnTopics[topicIndex];
  const nextTopic = learnTopics[topicIndex + 1];

  const lessons = getLessons(slug);

  return (
    <div>
      <header className="sticky top-0 z-10 bg-paper/85 backdrop-blur border-b border-line">
        <nav className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-display font-semibold tracking-tight">
            abdou4art
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="font-mono text-xs text-muted hover:text-ink transition-colors"
            >
              ← learn
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <p className="font-mono text-xs tracking-widest lowercase text-accent mb-3">
          <span aria-hidden>·</span> {topic.eyebrow}
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight leading-tight text-balance mb-4">
          {topic.title}
        </h1>
        <p className="text-muted leading-relaxed max-w-2xl mb-6">
          {topic.subtitle}
        </p>
        <div className="flex items-center justify-between gap-4 mb-6">
          <ExportNotes
            topics={[
              {
                slug: topic.slug,
                title: topic.title,
                lessons: lessons.map((l) => l.slug),
              },
            ]}
          />
        </div>
        <TopicProgress
          topicSlug={topic.slug}
          lessonSlugs={lessons.map((l) => l.slug)}
        />

        {lessons.length === 0 ? (
          <p className="font-mono text-sm text-muted border border-line rounded-lg px-5 py-4">
            Les leçons arrivent — le prof est en train d&apos;écrire.
          </p>
        ) : (
          <>
            <nav
              aria-label="Leçons"
              className="font-mono text-sm bg-accent-soft border border-line rounded-lg px-5 py-4 mb-16"
            >
              <p className="text-xs text-muted mb-3 tracking-widest lowercase">
                sommaire — {lessons.length} concepts
              </p>
              <ol className="space-y-1.5">
                {lessons.map((lesson, i) => (
                  <li key={lesson.slug}>
                    <a href={`#${lesson.slug}`} className="hover:text-accent">
                      <span className="text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>{" "}
                      {lesson.slug.replaceAll("-", " ")}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {lessons.map((lesson, i) => {
              const chunks = splitLesson(lesson.markdown);
              const hasZones = chunks.some((c) => writingZone(c.heading));
              return (
                <article
                  key={lesson.slug}
                  id={lesson.slug}
                  className="lesson scroll-mt-20 border-t border-line pt-10 mb-16"
                >
                  <p className="font-mono text-xs text-accent mb-6">
                    concept {String(i + 1).padStart(2, "0")} / {lessons.length}
                  </p>
                  {chunks.map((chunk, j) => {
                    const zone = writingZone(chunk.heading);
                    return (
                      <div key={j}>
                        <div dangerouslySetInnerHTML={{ __html: chunk.html }} />
                        {zone && (
                          <NotesArea
                            storageKey={`notes:${slug}:${lesson.slug}:${zone.id}`}
                            label={zone.label}
                            placeholder={zone.placeholder}
                          />
                        )}
                      </div>
                    );
                  })}
                  {!hasZones && (
                    <NotesArea
                      storageKey={`notes:${slug}:${lesson.slug}:journal`}
                      label="ton journal"
                      placeholder="[date] concept | où ça a cassé | quelle question m'a eu"
                    />
                  )}
                  <EpreuveStatus topicSlug={slug} lessonSlug={lesson.slug} />
                </article>
              );
            })}

            <div className="border-t border-line pt-6 space-y-4">
              <p className="font-mono text-xs text-muted">
                Fin du sujet. Si les épreuves ne vous ont pas fait échouer au
                moins une fois, relisez moins, prédisez plus.
              </p>
              {nextTopic ? (
                <Link
                  href={`/learn/${nextTopic.slug}`}
                  className="group block border border-line rounded-lg px-5 py-4 hover:border-accent transition-colors"
                >
                  <p className="font-mono text-xs text-muted mb-1">
                    {nextTopic.eyebrow.replace("learn how to · ", "")} →
                  </p>
                  <p className="font-display font-semibold tracking-tight group-hover:text-accent transition-colors">
                    {nextTopic.title}
                  </p>
                </Link>
              ) : (
                <Link
                  href="/learn"
                  className="inline-block font-mono text-xs text-accent hover:underline"
                >
                  ← tous les sujets
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
