import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const isDev = process.env.NODE_ENV === "development";

/**
 * Static-generation-friendly CSP (see next/dist/docs .../content-security-policy.md).
 * Nonce-based CSP requires dynamic rendering, which would opt this fully static
 * page out of CDN caching — a bad trade for a portfolio. Production therefore
 * allowlists the exact inline scripts present in the prerendered HTML via
 * sha256 hashes (generated post-build by scripts/generate-csp-hashes.mjs),
 * dropping 'unsafe-inline' from script-src entirely. Dev keeps 'unsafe-inline'
 * because the dev server injects instrumentation the build pipeline can't hash.
 */
function scriptSrc(): string {
  if (isDev) return "'self' 'unsafe-inline' 'unsafe-eval'";
  try {
    const raw = readFileSync(join(process.cwd(), ".next", "csp-hashes.json"), "utf8");
    const hashes = JSON.parse(raw) as string[];
    if (hashes.length > 0) return ["'self'", ...hashes].join(" ");
    throw new Error("empty hash list");
  } catch {
    // First-ever build has no hash file yet — scripts/generate-csp-hashes.mjs
    // patches routes-manifest.json with the real hashes after `next build`.
    return "'self' 'unsafe-inline'";
  }
}

const csp = `
  default-src 'self';
  script-src ${scriptSrc()};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  connect-src 'self' https://api.web3forms.com${isDev ? " ws: wss:" : ""};
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
${isDev ? "" : "  upgrade-insecure-requests;"}
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
