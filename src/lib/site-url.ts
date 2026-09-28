import { SITE_URL_FALLBACK } from "./site.ts";

/**
 * Single source of truth for the canonical site origin, shared by metadata,
 * robots.txt and sitemap.xml so they can never drift apart. Resolution order:
 * explicit public env var, Vercel's production alias, Vercel's deployment URL,
 * then the production domain.
 *
 * The production alias is preferred over `VERCEL_URL` because the latter is
 * unique to each deployment — using it would mint a new canonical origin on
 * every deploy and leave the sitemap pointing at a URL that dies with it.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const productionAlias = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (process.env.VERCEL_ENV === "production" && productionAlias) {
    return new URL(`https://${productionAlias}`);
  }

  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);

  return new URL(SITE_URL_FALLBACK);
}
