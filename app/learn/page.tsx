import type { Metadata } from "next";
import { LearnIndex } from "@/components/learn-index";
import { getLessons, learnTopics } from "@/lib/learn";

export const metadata: Metadata = {
  title: "Learn how to — abdou4art",
  description:
    "Active lessons from abdou4art's own learning files — concepts anchored in real code, each ending with a test to defend it.",
};

export default function LearnPage() {
  const topicLessons = Object.fromEntries(
    learnTopics.map((t) => [t.slug, getLessons(t.slug).map((l) => l.slug)]),
  );
  const exportTopics = learnTopics.map((t) => ({
    slug: t.slug,
    title: t.title,
    lessons: topicLessons[t.slug],
  }));
  return <LearnIndex topicLessons={topicLessons} exportTopics={exportTopics} />;
}
