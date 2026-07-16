import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// "Learn how to" topics. Lesson content is written by the `prof` subagent as
// markdown files in apprentissage/<topic-slug>/ (one file = one concept, with
// a test). To control the reading order of a topic, list the filenames in
// `files`; anything not listed is appended alphabetically.
// ---------------------------------------------------------------------------

export type LearnTopic = {
  slug: string;
  eyebrow: string;
  title: string; // lessons are in French for now, so titles here are French
  subtitle: string;
  files: string[]; // ordered concept filenames inside apprentissage/
};

const APPRENTISSAGE_DIR = path.join(process.cwd(), "apprentissage");

export const learnTopics: LearnTopic[] = [
  {
    slug: "build-this-portfolio",
    eyebrow: "learn how to · sujet 01",
    title: "Construire un portfolio comme celui-ci",
    subtitle:
      "Les concepts qu'il a fallu pour construire ce site — chacun ancré dans le vrai code du projet, et terminé par une épreuve. Ne lisez pas passivement : les questions sont là pour vous faire échouer un peu.",
    files: [
      "concept-approuter-fichiers.md",
      "concept-server-client-components.md",
      "concept-tailwind-utility-first.md",
      "concept-theme-tokens.md",
      "concept-context-i18n.md",
      "concept-intersection-observer.md",
      "concept-build-deploiement.md",
    ],
  },
  {
    slug: "build-sgs-fullstack",
    eyebrow: "learn how to · sujet 02",
    title: "Construire une app web full-stack — SGS",
    subtitle:
      "Onze concepts autour du cœur Spring Boot + React de SGS, mon projet académique — chacun ancré dans le vrai code, épreuve comprise. Le CV avait surestimé la maîtrise réelle de Spring Boot, Spring Security, JWT, JPA/Hibernate et React : ces concepts sont donc repris depuis leurs fondations, pas juste survolés. L'un d'eux est bâti sur un vrai bug corrigé dans le projet.",
    files: [
      "concept-spring-ioc-annotations.md",
      "concept-jpa-hibernate-entites.md",
      "concept-jwt-structure-emission.md",
      "concept-spring-security-chaine-filtres.md",
      "concept-vite.md",
      "concept-typescript-typage.md",
      "concept-react-fondamentaux.md",
      "concept-react-router.md",
      "concept-routes-protegees-multirole.md",
      "concept-cors-jwt-client.md",
      "concept-docker-compose.md",
    ],
  },
  {
    slug: "build-concilio-agents",
    eyebrow: "learn how to · sujet 03",
    title: "Construire un système multi-agents — Concilio",
    subtitle:
      "Neuf concepts tirés du vrai code de Concilio, mon terrain de jeu d'agents IA — l'orchestration elle-même, providers LLM, RAG, mémoire, évaluation — y compris ce que le code ne fait pas vraiment : son « tool-use » est orchestré par le code, pas par le LLM.",
    files: [
      "concept-orchestrateur-pipeline.md",
      "concept-agent-role-prompt.md",
      "concept-provider-protocol.md",
      "concept-embeddings-chunking.md",
      "concept-rag-similarite-citations.md",
      "concept-tool-use-orchestre.md",
      "concept-memoire-court-long-terme.md",
      "concept-evaluation-golden-llm-juge.md",
      "concept-streamlit-rerun.md",
    ],
  },
  {
    slug: "build-rawiya-voice",
    eyebrow: "learn how to · sujet 04",
    title: "Construire une app vocale — Rawiya × YEMMA",
    subtitle:
      "Quatre concepts tirés du code réel de notre projet de hackathon — architecture sans backend, APIs vocales du navigateur, Web Audio — y compris là où le pitch « hors-ligne » ne dit pas toute la vérité.",
    files: [
      "concept-architecture-sans-backend.md",
      "concept-tts-web-speech-synthesis.md",
      "concept-stt-reconnaissance-vocale.md",
      "concept-audio-analyser-reactif.md",
    ],
  },
];

export type Lesson = {
  slug: string; // anchor id
  filename: string;
  markdown: string;
};

export function getLessons(topicSlug: string): Lesson[] {
  const topic = learnTopics.find((t) => t.slug === topicSlug);
  const topicDir = path.join(APPRENTISSAGE_DIR, topicSlug);
  if (!topic || !fs.existsSync(topicDir)) return [];

  const all = fs
    .readdirSync(topicDir)
    .filter((f) => f.startsWith("concept-") && f.endsWith(".md"));

  const ordered = [
    ...topic.files.filter((f) => all.includes(f)),
    ...all.filter((f) => !topic.files.includes(f)).sort(),
  ];

  return ordered.map((filename) => ({
    filename,
    slug: filename.replace(/^concept-/, "").replace(/\.md$/, ""),
    markdown: fs.readFileSync(path.join(topicDir, filename), "utf-8"),
  }));
}
