# Jewel Cruz — Portfolio

Personal portfolio for **Jewel Cruz**, a frontend developer and web designer. A single-page, slide-based experience with a custom canvas background, built to be fast, accessible, and almost entirely static.

**Live:** https://jewelcruz.dev

## Lighthouse (production build, mobile)

```
Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100
```

## Highlights

- **Custom canvas background** — a hexagon grid plus animated star trails, drawn with the Canvas API. Drawing is skipped on inactive slides, throttled on touch devices, and fully disabled under `prefers-reduced-motion`.
- **Slide navigation** by keyboard (`←` / `→`), touch swipe, arrow buttons, and a bottom indicator.
- **Contact form** with shared client + server validation. Submissions are delivered by email through a server route (Web3Forms) — no third-party script on the page.
- **Optimized hero** — the background image goes through `next/image` with a responsive `srcset` and a preload, instead of shipping one oversized file to every viewport.
- No ads, no analytics, no third-party scripts.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Graphics | Canvas API + inline SVG |
| Tests | Node's built-in test runner |

## Architecture

- `src/app/page.tsx` — slide orchestration and per-slide decorative layers
- `src/components/` — one component per file. `Hero`, `TechIcon`, `About`, and `Footer` are **server components**; the rest are client components
- `src/lib/site.ts` — single source of truth for contact and project data
- `src/lib/validate.ts` — validation shared by the form and the API route
- `src/app/api/contact/route.ts` — validates input server-side and forwards it to the email provider

## Notable decisions

- **Static-first.** The page prerenders; only the contact endpoint is dynamic.
- **Server components where they fit.** Four of the eight components ship no client JavaScript.
- **Accurate errors.** The contact route reads the upstream response as text, adds a 10-second timeout, and maps rate limits and timeouts to real messages instead of a generic "network error".

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run the test suite
npm run build    # production build
npm start        # serve the production build
```

## Environment

```bash
WEB3FORMS_ACCESS_KEY=   # access key from web3forms.com
NEXT_PUBLIC_SITE_URL=   # canonical site URL (defaults to the Vercel URL)
```

## Structure

```
src/
├── app/
│   ├── layout.tsx        # metadata, fonts, JSON-LD
│   ├── page.tsx          # slide orchestration
│   ├── globals.css       # theme tokens and animations
│   ├── manifest.ts
│   ├── not-found.tsx
│   └── api/contact/      # contact endpoint
├── components/           # hero, about, projects, contact, footer, canvas, background, tech-icon
└── lib/                  # site data + validation
```

## License

MIT
