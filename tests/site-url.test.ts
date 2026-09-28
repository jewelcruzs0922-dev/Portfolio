import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { getSiteUrl } from "../src/lib/site-url.ts";
import { SITE_URL_FALLBACK } from "../src/lib/site.ts";

const KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_ENV",
  "VERCEL_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
] as const;

const saved: Record<string, string | undefined> = {};
for (const k of KEYS) saved[k] = process.env[k];

function clear() {
  for (const k of KEYS) delete process.env[k];
}

beforeEach(clear);

after(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

test("an explicit public env var wins over everything", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  process.env.VERCEL_ENV = "production";
  process.env.VERCEL_URL = "deploy-abc.vercel.app";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "prod.vercel.app";

  assert.equal(getSiteUrl().origin, "https://example.com");
});

test("production uses the stable alias, not the per-deployment URL", () => {
  process.env.VERCEL_ENV = "production";
  process.env.VERCEL_URL = "deploy-abc-xyz.vercel.app";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "portfolio-flame-eta-50.vercel.app";

  assert.equal(getSiteUrl().origin, "https://portfolio-flame-eta-50.vercel.app");
});

test("a preview deployment falls back to its own URL", () => {
  process.env.VERCEL_ENV = "preview";
  process.env.VERCEL_URL = "deploy-abc-xyz.vercel.app";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "portfolio-flame-eta-50.vercel.app";

  assert.equal(getSiteUrl().origin, "https://deploy-abc-xyz.vercel.app");
});

test("with no environment at all, the configured fallback is used", () => {
  assert.equal(getSiteUrl().origin, new URL(SITE_URL_FALLBACK).origin);
});
