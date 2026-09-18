export const CONTACT = {
  email: "jewelcruzs0922@gmail.com",
  github: "https://github.com/jewelcruzs0922-dev",
  facebook: "https://www.facebook.com/share/1CvHGC47uM/",
} as const;

export const SLIDES = ["home", "about", "projects", "contact"] as const;

export interface Project {
  id: string;
  title: string;
  cat: string;
  desc: string;
  highlights: string[];
  tech: string[];
  live: string;
  code: string;
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
    title: "Leaf & Root",
    cat: "BONSAI STOREFRONT",
    desc: "A bonsai storefront with a working commerce flow: 10 statically generated product pages, a checkout that re-prices the basket on the server, and an order pipeline with atomic stock reservation and a swappable payment provider. The design system is bespoke — hand-authored SVG illustration and self-hosted type, with no UI framework. 57 Playwright tests, ESLint and Prettier, CI, and a WCAG AA contrast audit.",
    highlights: [
      "10 product pages · SSG",
      "Server-priced checkout",
      "Atomic stock reservation",
      "57 tests · WCAG AA audit",
    ],
    tech: ["Next.js", "TypeScript", "Playwright", "Custom CSS"],
    live: "https://leaf-and-root-jet.vercel.app",
    code: "https://github.com/jewelcruzs0922-dev/leaf-and-root",
    logo: "/leafandroot-logo.svg",
  },
];
