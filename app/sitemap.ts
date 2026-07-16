import type { MetadataRoute } from "next";
import { learnTopics } from "@/lib/learn";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/learn`, changeFrequency: "weekly", priority: 0.8 },
    ...learnTopics.map((t) => ({
      url: `${siteUrl}/learn/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
