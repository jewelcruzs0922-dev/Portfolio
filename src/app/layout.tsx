import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CONTACT, FAQ } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
);
const BASE = SITE_URL.origin;

const DESCRIPTION =
  "Frontend developer from the Philippines building production-grade web applications. Next.js, React, TypeScript — 100+ tests, Lighthouse 100 performance.";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: "Jewel Cruz — Frontend Developer | Next.js, React, TypeScript",
    template: "%s | Jewel Cruz",
  },
  description: DESCRIPTION,
  applicationName: "Jewel Cruz",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Jewel Cruz — Frontend Developer",
    description: DESCRIPTION,
    url: "/",
    siteName: "Jewel Cruz",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jewel Cruz — Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jewel Cruz — Frontend Developer",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#d8eef8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sameAs = [CONTACT.github, CONTACT.facebook];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: "Jewel Cruz",
        description: DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": `${BASE}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${BASE}/#organization`,
        name: "Jewel Cruz",
        url: BASE,
        logo: `${BASE}/logo.png`,
        sameAs,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT.email,
        },
      },
      {
        "@type": "Person",
        "@id": `${BASE}/#person`,
        name: "Jewel Cruz",
        jobTitle: "Frontend Developer",
        url: BASE,
        image: `${BASE}/og-image.png`,
        sameAs,
        knowsAbout: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Web Accessibility",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE}/#faq`,
        mainEntity: FAQ.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
