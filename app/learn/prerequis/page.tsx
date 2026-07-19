import type { Metadata } from "next";
import Link from "next/link";
import { marked } from "marked";
import { getPrereqs } from "@/lib/learn";
import { NotesArea } from "@/components/notes-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { EpreuveStatus } from "@/components/progress";

export const metadata: Metadata = {
  title: "Prérequis — abdou4art/learn",
  description:
    "Les fondations de toutes les leçons — chaque prérequis s'ouvre sur une épreuve-portier : tente avant de lire.",
};

export default function PrereqPage() {
  const prereqs = getPrereqs();
  const validated = prereqs.filter((p) => p.status.startsWith("[validé")).length;

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
          <span aria-hidden>·</span> learn how to · prérequis
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight leading-tight text-balance mb-4">
          Les fondations — épreuve-portier d&apos;abord
        </h1>
        <p className="text-muted leading-relaxed max-w-2xl mb-6">
          Les concepts sur lesquels toutes les leçons s&apos;appuient. Chacun
          s&apos;ouvre sur une épreuve-portier : réussie → coche et continue.
          Ratée → lis les quelques lignes qui suivent, comble, repasse
          l&apos;épreuve. <strong className="text-ink">Ne lis jamais avant
          d&apos;avoir tenté.</strong>
        </p>

        {prereqs.length === 0 ? (
          <p className="font-mono text-sm text-muted border border-line rounded-lg px-5 py-4">
            Les prérequis arrivent — le prof est en train d&apos;écrire.
          </p>
        ) : (
          <>
            <p className="font-mono text-xs text-muted border-t border-line pt-4 mb-12">
              {validated}/{prereqs.length}{" "}validés par épreuve — le statut dans
              chaque fiche ne change que quand l&apos;épreuve est réussie,
              jamais sur déclaration.
            </p>

            {prereqs.map((p) => (
              <article
                key={p.slug}
                id={p.slug}
                className="lesson scroll-mt-20 border-t border-line pt-8 mb-12"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(p.markdown, { async: false }),
                  }}
                />
                <NotesArea
                  storageKey={`notes:prerequis:${p.slug}:portier`}
                  label="à toi — tente l'épreuve-portier ici, avant de lire la suite de la fiche"
                  placeholder="Tes réponses, avant toute lecture."
                />
                <EpreuveStatus topicSlug="prerequis" lessonSlug={p.slug} />
              </article>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
