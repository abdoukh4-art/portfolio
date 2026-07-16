// Canonical site URL — used by the sitemap, robots.txt and social metadata.
// Once the custom domain is bought, set NEXT_PUBLIC_SITE_URL in Vercel (or
// change the fallback here) and everything follows.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdou4art.vercel.app";
