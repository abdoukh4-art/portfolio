"use client";

import { progressKey } from "./progress";

// Downloads everything the student wrote (notes + épreuve statuses) as one
// markdown file, straight from localStorage. Their work deserves better than
// a browser cache.

type ExportTopic = { slug: string; title: string; lessons: string[] };

const ZONES: { id: string; label: string }[] = [
  { id: "froid", label: "Réponses à froid" },
  { id: "epreuve", label: "Réponses à l'épreuve" },
  { id: "journal", label: "Journal" },
];

const STATUS_LABELS: Record<string, string> = {
  passed: "✓ réussie",
  failed: "✗ échouée",
  redo: "↻ à refaire",
};

function buildMarkdown(topics: ExportTopic[]) {
  const lines: string[] = [
    `# Mon travail — abdou4art/learn`,
    ``,
    `Exporté le ${new Date().toLocaleDateString("fr-FR")}.`,
    ``,
  ];
  let hasContent = false;

  for (const topic of topics) {
    const topicLines: string[] = [`## ${topic.title}`, ``];
    let topicHasContent = false;

    for (const lesson of topic.lessons) {
      const status = window.localStorage.getItem(progressKey(topic.slug, lesson));
      const zones = ZONES.map((z) => ({
        ...z,
        text: window.localStorage.getItem(`notes:${topic.slug}:${lesson}:${z.id}`) ?? "",
      })).filter((z) => z.text.trim());

      if (!status && zones.length === 0) continue;
      topicHasContent = true;

      topicLines.push(`### ${lesson.replaceAll("-", " ")}`);
      if (status) topicLines.push(``, `Épreuve : ${STATUS_LABELS[status] ?? status}`);
      for (const z of zones) topicLines.push(``, `**${z.label}**`, ``, z.text);
      topicLines.push(``);
    }

    if (topicHasContent) {
      lines.push(...topicLines);
      hasContent = true;
    }
  }

  if (!hasContent) lines.push(`*(rien d'écrit pour l'instant — au travail !)*`);
  return lines.join("\n");
}

export function ExportNotes({
  topics,
  label = "télécharger mon travail",
}: {
  topics: ExportTopic[];
  label?: string;
}) {
  const download = () => {
    const md = buildMarkdown(topics);
    const date = new Date().toISOString().slice(0, 10);
    const name =
      topics.length === 1
        ? `abdou4art-${topics[0].slug}-${date}.md`
        : `abdou4art-learn-${date}.md`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="font-mono text-xs text-muted border border-line rounded-full px-4 py-1.5 hover:border-accent hover:text-accent transition-colors cursor-pointer"
    >
      ⬇ {label}
    </button>
  );
}
