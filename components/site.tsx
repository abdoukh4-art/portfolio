"use client";

import { LanguageProvider, LanguageToggle, useLanguage } from "./language";
import { Reveal } from "./reveal";
import { ThemeToggle } from "./theme-toggle";
import type { Project } from "@/lib/content";

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs tracking-widest lowercase text-accent mb-3">
      <span aria-hidden>·</span> {children}
    </p>
  );
}

function StatusBadge({ status, active }: { status: string; active?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-muted border border-line rounded-full px-3 py-1 whitespace-nowrap">
      <span
        aria-hidden
        className={`inline-block size-1.5 rounded-full ${
          active ? "bg-accent status-dot" : "bg-muted/50"
        }`}
      />
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Nav() {
  const { t } = useLanguage();
  const links = [
    { href: "#projects", label: t.nav.projects },
    { href: "#skills", label: t.nav.skills },
    { href: "#journey", label: t.nav.journey },
    { href: "#contact", label: t.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-10 bg-paper/85 backdrop-blur border-b border-line">
      <nav className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <a href="#top" className="font-display font-semibold tracking-tight">
          abdou4art
        </a>
        <div className="flex items-center gap-5">
          <ul className="hidden sm:flex items-center gap-5 text-sm text-muted">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-ink transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/learn"
            className="text-sm text-accent font-medium hover:underline underline-offset-4"
          >
            {t.nav.learn} ↗
          </a>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const { t } = useLanguage();
  return (
    <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 sm:pt-28">
      <Reveal>
        <p className="font-mono text-xs text-muted mb-6">{t.hero.eyebrow}</p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-balance mb-8">
          {t.hero.title}
        </h1>
      </Reveal>
      <Reveal delay={160}>
        <p className="text-lg leading-relaxed text-ink/85 max-w-2xl mb-5">
          {t.hero.intro}
        </p>
        <p className="leading-relaxed text-muted max-w-2xl mb-10">
          {t.hero.aiNote}
        </p>
      </Reveal>
      <Reveal delay={240}>
        <div className="font-mono text-sm bg-accent-soft border border-line rounded-lg px-5 py-4 space-y-1.5 max-w-2xl overflow-x-auto">
          {t.hero.statusLines.map((line) => (
            <p key={line.key} className="whitespace-nowrap">
              <span className="text-accent">{line.key.padEnd(8, " ")}</span>
              <span aria-hidden className="text-muted">→ </span>
              <span>{line.value}</span>
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ProjectCard({ project, learnedLabel }: { project: Project; learnedLabel: string }) {
  return (
    <article className="py-10 border-t border-line">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-1">
        <h3 className="font-display text-2xl font-semibold tracking-tight">
          {project.name}
        </h3>
        <StatusBadge status={project.status} active={project.active} />
      </div>
      <p className="font-mono text-xs text-muted mb-4">
        {project.period} · {project.role}
      </p>
      <p className="leading-relaxed text-ink/85 max-w-2xl mb-4">
        {project.description}
      </p>
      <p className="max-w-2xl mb-5 leading-relaxed">
        <span className="font-mono text-xs text-accent">{learnedLabel} → </span>
        <span className="text-muted">{project.learned}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs text-muted bg-ink/[0.04] rounded px-2 py-1"
          >
            {tech}
          </span>
        ))}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-accent hover:underline ml-1"
          >
            GitHub ↗
          </a>
        )}
      </div>
    </article>
  );
}

function Projects() {
  const { t } = useLanguage();
  return (
    <section id="projects" className="max-w-3xl mx-auto px-6 pb-24 scroll-mt-16">
      <Reveal>
        <SectionLabel>{t.nav.projects.toLowerCase()}</SectionLabel>
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
          {t.projects.heading}
        </h2>
        <p className="text-muted max-w-2xl mb-10 leading-relaxed">
          {t.projects.intro}
        </p>
      </Reveal>
      {t.projects.items.map((project) => (
        <Reveal key={project.name}>
          <ProjectCard project={project} learnedLabel={t.projects.learnedLabel} />
        </Reveal>
      ))}
    </section>
  );
}

function Skills() {
  const { t } = useLanguage();
  return (
    <section id="skills" className="max-w-3xl mx-auto px-6 pb-24 scroll-mt-16">
      <Reveal>
        <SectionLabel>{t.nav.skills.toLowerCase()}</SectionLabel>
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">
          {t.skills.heading}
        </h2>
        <p className="text-muted mb-10 leading-relaxed">{t.skills.intro}</p>
      </Reveal>
      <Reveal>
        <div className="grid sm:grid-cols-3 gap-8">
          {t.skills.groups.map((group) => (
            <div key={group.label}>
              <h3 className="font-mono text-xs text-accent tracking-widest lowercase mb-4">
                {group.label}
              </h3>
              <ul className="space-y-2.5 text-sm leading-snug">
                {group.items.map((item) => (
                  <li key={item} className="text-ink/85">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-muted mt-10 pt-6 border-t border-line">
          {t.skills.languagesLine}
        </p>
      </Reveal>
    </section>
  );
}

function Journey() {
  const { t } = useLanguage();
  return (
    <section id="journey" className="max-w-3xl mx-auto px-6 pb-24 scroll-mt-16">
      <Reveal>
        <SectionLabel>{t.nav.journey.toLowerCase()}</SectionLabel>
        <h2 className="font-display text-3xl font-bold tracking-tight mb-10">
          {t.journey.heading}
        </h2>
      </Reveal>
      <div className="border-l border-line pl-6 space-y-10">
        {t.journey.steps.map((step) => (
          <Reveal key={step.title}>
            <div className="relative">
              <span
                aria-hidden
                className="absolute -left-[30.5px] top-1.5 size-2 rounded-full bg-accent"
              />
              <p className="font-mono text-xs text-muted mb-1">{step.period}</p>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-muted">{step.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="text-muted text-sm leading-relaxed mt-10 max-w-2xl">
          {t.journey.clubs}
        </p>
      </Reveal>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer id="contact" className="border-t border-line scroll-mt-16">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Reveal>
          <SectionLabel>{t.nav.contact.toLowerCase()}</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight mb-4">
            {t.contact.heading}
          </h2>
          <p className="text-muted max-w-xl leading-relaxed mb-8">
            {t.contact.text}
          </p>
          <div className="flex flex-wrap gap-3 mb-16">
            {t.contact.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm border border-ink rounded-full px-5 py-2 hover:bg-ink hover:text-paper transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
          <p className="font-mono text-xs text-muted leading-relaxed">
            {t.contact.footnote}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function Site() {
  return (
    <LanguageProvider>
      <div id="top">
        <Nav />
        <main>
          <Hero />
          <Projects />
          <Skills />
          <Journey />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
