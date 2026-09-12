<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Web Development Best Practices (MANDATORY)

Read the guides in `C:\Users\Jimwel\Downloads\OpenCode\Web-Dev-Best-Practices\` before writing production code. Apply ALL of the following rules to every task.

### Non-negotiables

- **Accessibility (WCAG 2.2 AA)**: semantic HTML first, keyboard-operable, labeled inputs, contrast >= 4.5:1, one H1, visible focus, `prefers-reduced-motion`. Every interactive element must be keyboard-reachable. No `div`-as-button.
- **Performance**: Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1). Explicit image dimensions. Code-split. Lazy-load below fold. Fonts use `display: swap`.
- **Responsive**: Mobile-first. Verify at 320px, 768px, 1280px+. 44px touch targets. No horizontal page scroll.
- **UI**: Use tokens only (no hard-coded hex/spacing). No AI-slop decoration (no pulsing dots, sparkle icons, purple-pink gradients, glassmorphism-without-purpose, superlative filler copy).
- **Security**: Never log/commit secrets. Validate inputs. Set security headers. Escape output.
- **Quality**: Strict TypeScript (no `any`, no `@ts-ignore`). Lint-clean. Tests for logic. Follow repo conventions.
- **SEO**: Every page needs unique metadata (title <= 60 chars, description 150-160 chars, canonical, Open Graph). JSON-LD WebSite + Organization. robots.txt allowing AI bots. llms.txt + sitemap.
- **Git**: Small focused commits. Clear messages. Stage intentionally. Never commit secrets.

### Verification before finishing any task

1. `npm run build` passes
2. `npm run lint` passes with zero errors
3. TypeScript type-check passes
4. Check at 320px, 768px, 1280px+ (no horizontal scroll, tap targets >= 44px)
5. Tab through new UI — focus visible, labels present
6. Page completeness: homepage must have hero, value props, social proof, FAQ, CTA, footer
