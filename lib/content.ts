// ---------------------------------------------------------------------------
// All the text on the site lives here, in English and French.
// Edit this file to change what the portfolio says — no need to touch the
// components. Keep the `en` and `fr` objects in sync (same shape, same keys).
// ---------------------------------------------------------------------------

export type Lang = "en" | "fr";

export type Project = {
  name: string;
  period: string;
  status: string;
  active?: boolean; // shows a pulsing dot on the status badge
  role: string;
  description: string;
  learned: string;
  stack: string[];
  link?: string | null; // GitHub / demo URL — fill in when the repo is public
};

export type Dict = {
  nav: {
    projects: string;
    skills: string;
    journey: string;
    learn: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    aiNote: string;
    statusLines: { key: string; value: string }[];
  };
  projects: {
    heading: string;
    intro: string;
    learnedLabel: string;
    items: Project[];
  };
  skills: {
    heading: string;
    intro: string;
    groups: { label: string; items: string[] }[];
    languagesLine: string;
  };
  journey: {
    heading: string;
    steps: { period: string; title: string; detail: string }[];
    clubs: string;
  };
  learn: {
    heading: string;
    bio: { title: string; paragraphs: string[] };
    cta: string;
    langNote: string;
    topics: { slug: string; status: string; title: string; description: string }[];
  };
  contact: {
    heading: string;
    text: string;
    links: { label: string; url: string }[];
    footnote: string;
  };
};

const github = "https://github.com/abdoukh4-art";
const linkedin = "https://www.linkedin.com/in/abderrahmane-khellou";

const en: Dict = {
  nav: {
    projects: "Projects",
    skills: "Skills",
    journey: "Journey",
    learn: "Learn",
    contact: "Contact",
  },
  hero: {
    eyebrow: "portfolio · v0.1 · work in progress — like me",
    title: "I'm learning software engineering by building things.",
    intro:
      "I'm abdou4art — a first-year software engineering student at ENSIAS in Rabat. What pulls me in right now: AI agents and LLMs. Most of what I know comes from building small projects, breaking them, and figuring out why.",
    aiNote:
      "Full transparency: I build with AI tools a lot. I use them to reach past my current level, then work backwards to understand what they did. This portfolio tells you what I actually did on each project — no more, no less.",
    statusLines: [
      { key: "status", value: "first-year GL student @ ENSIAS, Rabat" },
      { key: "focus", value: "AI agents · LLMs · full-stack basics" },
      { key: "open to", value: "internships, advice & learning opportunities" },
    ],
  },
  projects: {
    heading: "Projects",
    intro:
      "Things I've built so far — each one framed honestly: what it is, what I actually did, and what it taught me.",
    learnedLabel: "what it taught me",
    items: [
      {
        name: "Consilio",
        period: "2026 — ongoing",
        status: "prototype · in progress",
        active: true,
        role: "Personal project — built with heavy help from AI coding tools, by design",
        description:
          "A multi-agent analysis system: specialized agents (research, analysis, review, writing) that plan, use tools, query a RAG store, and produce a sourced report. My playground for understanding how agentic AI actually works.",
        learned:
          "How the pieces of an agent system fit together — planning, tool-use, RAG, memory — and how hard honest evaluation is.",
        stack: ["Python", "Claude / Ollama", "Chroma (RAG)", "Streamlit"],
        link: null,
      },
      {
        name: "Rawiya × YEMMA",
        period: "April 2026",
        status: "hackathon build",
        role: "System architecture — Rabat Smart Book 2026 hackathon, in a team",
        description:
          "An offline voice AI app making cultural content accessible in several languages. I worked on the overall system design and the TTS / audio pipeline.",
        learned:
          "Designing under a deadline with a team: cutting scope, choosing what to hard-code, and making offline constraints work.",
        stack: ["Python", "TTS pipeline", "Offline-first design"],
        link: "https://github.com/abdoukh4-art/rawiya-yema",
      },
      {
        name: "SGS — Internship Management System",
        period: "2025 — 2026",
        status: "coursework",
        role: "Academic project — my first full-stack build, guided by the curriculum",
        description:
          "A web app to manage internships and defenses with four roles (student, company, supervisor, admin). UML design, a REST API secured with JWT, and a React frontend.",
        learned:
          "What a real project structure looks like: going from UML to code, auth basics with JWT, and how frontend and backend talk.",
        stack: ["React 18", "TypeScript", "Vite", "Tailwind", "Spring Boot", "JWT"],
        link: null,
      },
    ],
  },
  skills: {
    heading: "Skills",
    intro: "An honest map, not a wall of logos.",
    groups: [
      {
        label: "comfortable with",
        items: ["Python", "Git & GitHub", "Linux", "SQL & MySQL", "REST APIs & JSON"],
      },
      {
        label: "actively exploring",
        items: [
          "LLM apps — prompting, RAG, tool-use",
          "Multi-agent systems",
          "React & TypeScript",
          "Java & Spring Boot",
          "C & C++",
          "Algorithms & data structures",
        ],
      },
      {
        label: "next on the list",
        items: [
          "Proper testing",
          "System design",
          "ML fundamentals",
          "Building more from scratch, less from AI",
        ],
      },
    ],
    languagesLine: "Arabic (native) · French (fluent) · English (fluent)",
  },
  journey: {
    heading: "Journey",
    steps: [
      {
        period: "2025 — now",
        title: "Engineering cycle, Software Engineering (GL)",
        detail: "ENSIAS — École Nationale Supérieure d'Informatique et d'Analyse des Systèmes, Rabat",
      },
      {
        period: "2021 — 2024",
        title: "Licence, Computer Engineering",
        detail: "Graduated with high honors",
      },
      {
        period: "2020",
        title: "Baccalaureate, Mathematical Sciences (SM-A)",
        detail: "With high honors",
      },
    ],
    clubs:
      "Along the way: member of the IT Club and the Competitive Programming Cell at ENSIAS — regular algorithm practice on Codeforces and LeetCode.",
  },
  learn: {
    heading: "Learn how to",
    bio: {
      title: "Learning, without lying to myself.",
      paragraphs: [
        "This section is not a collection of course notes. It's a personal learning system in action, grounded in cognitive science (active recall, spacing, prediction before execution), with one simple invariant: **no mastery is claimed without a test.**",
        "Every concept follows the same loop: I answer cold before reading, I run and break the code after predicting what will happen, then I face a test — rebuilding from scratch, trap questions, telling confusable concepts apart. The test counter you see here is honest: what isn't validated doesn't count.",
        "The goal isn't to accumulate content. It's to make the illusion of mastery structurally impossible.",
      ],
    },
    cta: "Open the lessons",
    langNote: "Lessons are in French for now.",
    topics: [
      {
        slug: "build-this-portfolio",
        status: "topic 01 · available",
        title: "Build a portfolio like this one",
        description:
          "Next.js, Tailwind, a bilingual content system, scroll animations — every concept it took to build the site you're reading, each one ending with a test to defend it.",
      },
      {
        slug: "build-sgs-fullstack",
        status: "topic 02 · available",
        title: "Build a full-stack web app (SGS)",
        description:
          "My first-year internship management system, rebuilt from the foundations up: Spring Boot's core, JPA/Hibernate, JWT and the security filter chain, React fundamentals — then everything around them: Docker, TypeScript, Vite, routing, role guards, CORS.",
      },
      {
        slug: "build-concilio-agents",
        status: "topic 03 · available",
        title: "Build a multi-agent system (Concilio)",
        description:
          "My AI-agent playground, read honestly: the orchestration itself, what makes an agent an agent, LLM provider abstraction, embeddings and RAG with citations, memory, evaluation with an LLM judge — including what the code doesn't actually do (its \"tool-use\" is code-orchestrated, not LLM-driven).",
      },
      {
        slug: "build-rawiya-voice",
        status: "topic 04 · available",
        title: "Build a voice app (Rawiya × YEMMA)",
        description:
          "Our hackathon build, read honestly: a no-backend architecture served over a local hotspot, the browser's speech synthesis and recognition APIs, and a Web Audio reactive background — including where the \"offline\" pitch doesn't fully hold.",
      },
    ],
  },
  contact: {
    heading: "Say hello",
    text: "I'm a student — I answer messages. If you have advice, an opportunity, or just want to talk about agents and LLMs, reach out.",
    links: [
      { label: "GitHub", url: github },
      { label: "LinkedIn", url: linkedin },
    ],
    footnote:
      "Built with Next.js and Tailwind — with help from AI, and full intent to understand every line. © 2026 abdou4art",
  },
};

const fr: Dict = {
  nav: {
    projects: "Projets",
    skills: "Compétences",
    journey: "Parcours",
    learn: "Apprendre",
    contact: "Contact",
  },
  hero: {
    eyebrow: "portfolio · v0.1 · en construction — comme moi",
    title: "J'apprends le génie logiciel en construisant des choses.",
    intro:
      "Je suis abdou4art — élève ingénieur en première année de Génie Logiciel à l'ENSIAS (Rabat). Ce qui m'attire en ce moment : les agents IA et les LLMs. L'essentiel de ce que je sais vient de petits projets que je construis, que je casse, et que je cherche à comprendre.",
    aiNote:
      "En toute transparence : je construis beaucoup avec des outils d'IA. Je m'en sers pour viser plus loin que mon niveau actuel, puis je reviens en arrière pour comprendre ce qu'ils ont fait. Ce portfolio dit ce que j'ai réellement fait sur chaque projet — ni plus, ni moins.",
    statusLines: [
      { key: "statut", value: "élève ingénieur 1A GL @ ENSIAS, Rabat" },
      { key: "focus", value: "agents IA · LLMs · bases du full-stack" },
      { key: "ouvert à", value: "stages, conseils & occasions d'apprendre" },
    ],
  },
  projects: {
    heading: "Projets",
    intro:
      "Ce que j'ai construit jusqu'ici — présenté honnêtement : ce que c'est, ce que j'ai réellement fait, et ce que ça m'a appris.",
    learnedLabel: "ce que ça m'a appris",
    items: [
      {
        name: "Consilio",
        period: "2026 — en cours",
        status: "prototype · en cours",
        active: true,
        role: "Projet personnel — construit avec beaucoup d'aide d'outils d'IA, volontairement",
        description:
          "Un système d'analyse multi-agents : des agents spécialisés (recherche, analyse, revue, rédaction) qui planifient, utilisent des outils, interrogent un store RAG et produisent un rapport sourcé. Mon terrain de jeu pour comprendre comment l'IA agentique fonctionne vraiment.",
        learned:
          "Comment les briques d'un système d'agents s'assemblent — planification, tool-use, RAG, mémoire — et à quel point l'évaluation honnête est difficile.",
        stack: ["Python", "Claude / Ollama", "Chroma (RAG)", "Streamlit"],
        link: null,
      },
      {
        name: "Rawiya × YEMMA",
        period: "Avril 2026",
        status: "projet de hackathon",
        role: "Architecture système — hackathon Rabat Smart Book 2026, en équipe",
        description:
          "Une application vocale IA hors-ligne qui rend du contenu culturel accessible en plusieurs langues. J'ai travaillé sur la conception du système et le pipeline TTS / audio.",
        learned:
          "Concevoir sous contrainte de temps, en équipe : réduire le périmètre, choisir quoi coder en dur, et composer avec le hors-ligne.",
        stack: ["Python", "Pipeline TTS", "Conception offline-first"],
        link: "https://github.com/abdoukh4-art/rawiya-yema",
      },
      {
        name: "SGS — Système de Gestion des Stages",
        period: "2025 — 2026",
        status: "projet académique",
        role: "Projet académique — mon premier projet full-stack, encadré par le cursus",
        description:
          "Une application web pour gérer stages et soutenances avec quatre rôles (étudiant, entreprise, encadrant, admin). Conception UML, API REST sécurisée par JWT, et un frontend React.",
        learned:
          "À quoi ressemble une vraie structure de projet : passer de l'UML au code, les bases de l'authentification avec JWT, et le dialogue frontend-backend.",
        stack: ["React 18", "TypeScript", "Vite", "Tailwind", "Spring Boot", "JWT"],
        link: null,
      },
    ],
  },
  skills: {
    heading: "Compétences",
    intro: "Une carte honnête, pas un mur de logos.",
    groups: [
      {
        label: "à l'aise avec",
        items: ["Python", "Git & GitHub", "Linux", "SQL & MySQL", "APIs REST & JSON"],
      },
      {
        label: "en exploration active",
        items: [
          "Apps LLM — prompting, RAG, tool-use",
          "Systèmes multi-agents",
          "React & TypeScript",
          "Java & Spring Boot",
          "C & C++",
          "Algorithmique & structures de données",
        ],
      },
      {
        label: "prochaines étapes",
        items: [
          "Les tests, sérieusement",
          "La conception de systèmes",
          "Les fondamentaux du ML",
          "Construire plus par moi-même, moins avec l'IA",
        ],
      },
    ],
    languagesLine: "Arabe (langue maternelle) · Français (courant) · Anglais (courant)",
  },
  journey: {
    heading: "Parcours",
    steps: [
      {
        period: "2025 — auj.",
        title: "Cycle ingénieur, Génie Logiciel (GL)",
        detail: "ENSIAS — École Nationale Supérieure d'Informatique et d'Analyse des Systèmes, Rabat",
      },
      {
        period: "2021 — 2024",
        title: "Licence, Génie Informatique",
        detail: "Mention très bien",
      },
      {
        period: "2020",
        title: "Baccalauréat, Sciences Mathématiques (SM-A)",
        detail: "Mention très bien",
      },
    ],
    clubs:
      "En chemin : membre de l'IT Club et de la Competitive Programming Cell de l'ENSIAS — entraînement régulier sur Codeforces et LeetCode.",
  },
  learn: {
    heading: "Apprendre à",
    bio: {
      title: "Apprendre, sans se mentir.",
      paragraphs: [
        "Cette section n'est pas une collection de notes de cours. C'est l'application d'un système personnel d'apprentissage, fondé sur la science cognitive (récupération active, espacement, prédiction avant exécution), dont l'invariant est simple : **aucune maîtrise n'est déclarée sans épreuve.**",
        "Chaque concept suit la même boucle : je réponds à froid avant de lire, j'exécute et je casse le code en prédisant ce qui va se passer, puis je passe une épreuve — reconstruction de zéro, questions-pièges, discrimination entre concepts confusables. Le compteur d'épreuves que vous voyez est honnête : ce qui n'est pas validé ne compte pas.",
        "Le but n'est pas d'accumuler du contenu. C'est de rendre l'illusion de maîtrise structurellement impossible.",
      ],
    },
    cta: "Ouvrir les leçons",
    langNote: "Leçons en français.",
    topics: [
      {
        slug: "build-this-portfolio",
        status: "sujet 01 · disponible",
        title: "Construire un portfolio comme celui-ci",
        description:
          "Next.js, Tailwind, un système de contenu bilingue, des animations au scroll — tous les concepts qu'il a fallu pour construire le site que vous lisez, chacun terminé par une épreuve pour le défendre.",
      },
      {
        slug: "build-sgs-fullstack",
        status: "sujet 02 · disponible",
        title: "Construire une app web full-stack (SGS)",
        description:
          "Mon système de gestion des stages de première année, repris depuis les fondations : le cœur de Spring Boot, JPA/Hibernate, JWT et la chaîne de filtres de sécurité, les fondamentaux de React — puis tout ce qui les entoure : Docker, TypeScript, Vite, le routage, les gardes par rôle, CORS.",
      },
      {
        slug: "build-concilio-agents",
        status: "sujet 03 · disponible",
        title: "Construire un système multi-agents (Concilio)",
        description:
          "Mon terrain de jeu d'agents IA, lu honnêtement : l'orchestration elle-même, ce qui fait qu'un agent est un agent, l'abstraction des providers LLM, embeddings et RAG avec citations, la mémoire, l'évaluation par LLM-juge — y compris ce que le code ne fait pas vraiment (son « tool-use » est orchestré par le code, pas par le LLM).",
      },
      {
        slug: "build-rawiya-voice",
        status: "sujet 04 · disponible",
        title: "Construire une app vocale (Rawiya × YEMMA)",
        description:
          "Notre projet de hackathon, lu honnêtement : une architecture sans backend servie sur un hotspot local, les APIs vocales du navigateur (synthèse et reconnaissance), et un fond réactif en Web Audio — y compris là où le pitch « hors-ligne » ne tient pas complètement.",
      },
    ],
  },
  contact: {
    heading: "Dites bonjour",
    text: "Je suis étudiant — je réponds aux messages. Un conseil, une opportunité, ou juste envie de parler d'agents et de LLMs : écrivez-moi.",
    links: [
      { label: "GitHub", url: github },
      { label: "LinkedIn", url: linkedin },
    ],
    footnote:
      "Construit avec Next.js et Tailwind — avec l'aide de l'IA, et la ferme intention de comprendre chaque ligne. © 2026 abdou4art",
  },
};

export const content: Record<Lang, Dict> = { en, fr };
