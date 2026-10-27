export const CONTACT = {
  email: "jewelcruzs0922@gmail.com",
  github: "https://github.com/jewelcruzs0922-dev",
  facebook: "https://www.facebook.com/share/1CvHGC47uM/",
} as const;

export const SITE_URL_FALLBACK = "https://portfolio-flame-eta-50.vercel.app";

export const SLIDES = ["home", "about", "projects", "contact"] as const;

export interface Project {
  id: string;
  title: string;
  cat: string;
  desc: string;
  highlights: string[];
  tech: string[];
  live: string;
  /** Public source repo. Optional: some projects (e.g. a Shopify theme demo) have none. */
  code?: string;
  /** Optional short note rendered under the action buttons (e.g. gated access). */
  accessNote?: string;
  logo: string;
}

export const PROJECTS: Project[] = [
  {
    id: "001",
    title: "Redwood Retreats",
    cat: "CABIN RENTAL PLATFORM",
    desc: "A cabin rental site built around a custom canvas animation — a wind-driven grass field capped at 200 blades on desktop and 100 on mobile, alongside SSR-safe particles. It includes 9 filterable A-frame listings, a keyboard-navigable gallery lightbox, and 41 tests. The reservation flow is a front-end demo with a live price estimate.",
    highlights: [
      "Custom canvas animation",
      "SSR-safe particle system",
      "9 filterable cabins",
      "41 tests · accessible gallery",
    ],
    tech: ["Next.js", "TypeScript", "Canvas API", "Tailwind"],
    live: "https://redwood-retreats.vercel.app",
    code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
    logo: "/redwood-logo.svg",
  },
  {
    id: "002",
    title: "Cosmic Ray Solar",
    cat: "SOLAR ENERGY PLATFORM",
    desc: "A multi-page solar installer site spanning 19 routes: a shop with a persistent cart, an interactive savings estimator, a blog, and six statically generated city pages. Built with 59 unit tests plus a Playwright suite, CI, and a service worker for offline caching.",
    highlights: [
      "19 routes · 6 city pages",
      "Cart + savings estimator",
      "59 unit tests + Playwright",
      "SEO, CI, service worker",
    ],
    tech: ["Next.js", "TypeScript", "Vitest", "Playwright"],
    live: "https://cosmicray-solar.netlify.app",
    code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
    logo: "/cosmicray-logo.svg",
  },
  {
    id: "003",
    title: "Emerald Garden",
    cat: "BONSAI STOREFRONT",
    desc: "A bonsai storefront with a working commerce flow: 10 SSG product pages, a server-priced checkout, and an order pipeline with atomic stock reservation and a swappable payment provider. A bespoke design system — hand-authored SVG and self-hosted type — backed by 57 Playwright tests and a WCAG AA contrast audit.",
    highlights: [
      "10 product pages · SSG",
      "Server-priced checkout",
      "Atomic stock reservation",
      "57 tests · WCAG AA audit",
    ],
    tech: ["Next.js", "TypeScript", "Playwright", "Custom CSS"],
    live: "https://emerald-garden.vercel.app",
    code: "https://github.com/jewelcruzs0922-dev/emerald-garden",
    logo: "/emeraldgarden-logo.svg",
  },
  {
    id: "004",
    title: "HIRO",
    cat: "E-BIKE LANDING PAGE",
    desc: "A premium e-bike landing page with a three-bike configurator, slide-over cart, and a simulated checkout flow. 48 unit tests plus Playwright e2e on desktop and mobile, with axe accessibility checks enforced in GitHub Actions CI.",
    highlights: [
      "Bike configurator + cart",
      "Simulated checkout flow",
      "48 unit tests · Playwright e2e",
      "Lighthouse 95 · axe AA in CI",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
    live: "https://hiro-azurite2.vercel.app",
    code: "https://github.com/jewelcruzs0922-dev/HIRO",
    logo: "/hiro-logo.webp",
  },
  {
    id: "005",
    title: "TagPricePH",
    cat: "PRICE COMPARISON PLATFORM",
    desc: "A Filipino price-comparison platform — comparison UI, typo-tolerant search, price-history charts, and a token-gated admin console on Neon Postgres (14 migrations). Marketplace adapters for Shopee, Lazada, and TikTok Shop fail closed until an authorized live feed is configured.",
    highlights: [
      "Shopee · Lazada · TikTok adapters",
      "Comparison + price history",
      "20 verification suites",
      "Neon Postgres · admin console",
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
    live: "https://tagpriceph.vercel.app",
    code: "https://github.com/jewelcruzs0922-dev/TagPricePH",
    logo: "/tagprice-logo.webp",
  },
  {
    id: "006",
    title: "ComputePH",
    cat: "FILIPINO MONEY CALCULATORS",
    desc: "Free calculators for everyday Filipino money decisions — SSS, PhilHealth, Pag-IBIG, income tax, 13th month, overtime, and loans. 12 calculators driven by pure TypeScript engines, with official rates kept in a single sourced rules layer, fully static SEO pages with JSON-LD, and 274 passing unit tests.",
    highlights: [
      "12 calculators",
      "Sourced official rates",
      "Pure TS calc engines",
      "Static SEO + JSON-LD",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind", "Vitest"],
    live: "https://computeph.vercel.app",
    code: "https://github.com/jewelcruzs0922-dev/ComputePH",
    logo: "/computeph-logo.webp",
  },
  {
    id: "007",
    title: "FurBuddies — Shopify Pet Supplies Store",
    cat: "SHOPIFY STOREFRONT DEMO",
    desc: "A portfolio-only Shopify storefront demo built on Online Store 2.0. Hand-written Liquid sections — a custom cross-fade hero and a benefits bar — plus a fade-on-hover product-card treatment, collection filters and sorting, and a demo cart. Checkout is intentionally disabled and the storefront is password-protected.",
    highlights: [
      "Custom Liquid sections",
      "Cross-fade hero · hover cards",
      "Collection filters & sort",
      "Demo cart · checkout disabled",
    ],
    tech: ["Shopify", "Liquid", "JavaScript", "HTML/CSS"],
    live: "https://pet-pantry-test.myshopify.com/",
    code: "https://github.com/jewelcruzs0922-dev/FurBuddies",
    accessNote: "Password-protected demo — ask me for access.",
    logo: "/furbuddies-logo.webp",
  },
  {
    id: "008",
    title: "Alegria — Shopify Furniture & Interiors Store",
    cat: "SHOPIFY STOREFRONT DEMO",
    desc: "A portfolio-only Shopify storefront for a fictional premium furniture brand, built on Online Store 2.0 with a hand-written theme — custom Liquid sections, 16 products with variant-specific imagery, a materials metaobject, collection filters and an Ajax cart. Password-protected, with checkout disabled.",
    highlights: [
      "Custom Liquid sections",
      "16 products · 5 collections",
      "Metaobjects + variant images",
      "Filters · Ajax cart · a11y",
    ],
    tech: ["Shopify", "Liquid", "JSON templates", "JavaScript", "HTML/CSS"],
    live: "https://alegria-desoau8q.myshopify.com/",
    code: "https://github.com/jewelcruzs0922-dev/Alegria",
    accessNote: "Password-protected demo — ask me for access.",
    logo: "/alegria-logo.png",
  },
  {
    id: "009",
    title: "Gardner",
    cat: "SHOPIFY GARDEN-TOOLS STOREFRONT",
    desc: "A private Shopify Online Store 2.0 storefront for a garden-tools brand, built on Dawn 16.0.0 with a custom editorial homepage, mega menu, predictive search, collection filters, cart drawer and a browser-local wishlist. Includes a 32-product demo catalog, structured data, and a documented responsive and accessibility QA pass.",
    highlights: [
      "Custom Dawn-based theme",
      "32 products · 10 collections",
      "Cart, filters, search, wishlist",
      "Responsive QA · 0 axe violations",
    ],
    tech: ["Shopify", "Liquid", "Dawn", "JavaScript", "Playwright"],
    live: "https://gardner-dev-zwlohenx.myshopify.com/?preview_theme_id=191259083065",
    accessNote: "Password-protected demo — ask me for access. Private source available on request.",
    logo: "/gardner-logo.svg",
  },
];
