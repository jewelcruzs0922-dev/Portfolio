import { readFileSync } from "node:fs";
import path from "node:path";

let cached: string | null = null;

/**
 * Reads --color-surface from globals.css so the token layer stays the single
 * source of truth for colors (meta theme-color and the web manifest cannot
 * resolve CSS variables).
 */
export function getThemeColor(): string {
  if (cached) return cached;
  const css = readFileSync(path.join(process.cwd(), "src", "app", "globals.css"), "utf8");
  const match = css.match(/--color-surface:\s*(#[0-9a-fA-F]{3,8})\s*;/);
  if (!match) {
    throw new Error("--color-surface hex not found in src/app/globals.css");
  }
  cached = match[1];
  return cached;
}
