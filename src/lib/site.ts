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
    desc: "A full-stack cabin rental platform featuring real-time canvas animations, a dynamic pricing engine, and a seamless booking system. Built with performance and user experience in mind, it delivers an immersive way to discover and reserve modern A-frame retreats in nature.",
    highlights: [
      "Real-time canvas animations",
      "Dynamic pricing engine",
      "Seamless booking system",
      "Performance optimized",
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
    desc: "A solar energy company platform with integrated Stripe payments for seamless transactions and Sanity CMS for flexible content management. Fully responsive across all devices, it showcases solar solutions with a clean, modern interface built for conversion.",
    highlights: [
      "Stripe payment integration",
      "Sanity CMS management",
      "Fully responsive design",
      "Conversion-focused UI",
    ],
    tech: ["Next.js", "Stripe", "Sanity", "Tailwind"],
    live: "https://cosmicray-solar.netlify.app",
    code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
    logo: "/cosmicray-logo.svg",
  },
];
