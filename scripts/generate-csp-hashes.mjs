import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, ".next", "server", "app");

const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) htmlFiles.push(p);
  }
}

walk(appDir);

const hashes = new Set();
const INLINE_SCRIPT_RE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(INLINE_SCRIPT_RE)) {
    const digest = createHash("sha256").update(match[1], "utf8").digest("base64");
    hashes.add(`'sha256-${digest}'`);
  }
}

if (hashes.size === 0) {
  console.error("CSP hash generation found no inline scripts — aborting.");
  process.exit(1);
}

const sorted = [...hashes].sort();
writeFileSync(join(root, ".next", "csp-hashes.json"), JSON.stringify(sorted, null, 2));
console.log(`CSP: wrote ${sorted.length} script hashes to .next/csp-hashes.json`);

// `next start` serves headers from routes-manifest.json, which was generated
// during `next build` — before this script ran. Patch the baked CSP so the
// hash-based script-src is what actually goes on the wire.
const manifestPath = join(root, ".next", "routes-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
let patched = 0;
for (const routeHeaders of manifest.headers ?? []) {
  for (const header of routeHeaders.headers ?? []) {
    if (header.key === "Content-Security-Policy" && typeof header.value === "string") {
      header.value = header.value.replace(
        /script-src [^;]+/,
        `script-src 'self' ${sorted.join(" ")}`,
      );
      patched += 1;
    }
  }
}
if (patched === 0) {
  console.error("CSP: no Content-Security-Policy entry found in routes-manifest.json");
  process.exit(1);
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`CSP: patched script-src in routes-manifest.json (${patched} route(s))`);
