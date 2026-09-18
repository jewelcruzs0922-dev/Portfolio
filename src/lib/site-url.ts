import { SITE_URL_FALLBACK } from "./site";

/**
 * Single source of truth for the canonical site origin, shared by metadata,
 * robots.txt and sitemap.xml so they can never drift apart. Resolution order:
 * explicit public env var, Vercel's deployment URL, then the production domain.
 */
export function getSiteUrl(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : SITE_URL_FALLBACK);

  return new URL(raw);
}
