import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Jewel Cruz — Frontend Developer | Next.js, React, TypeScript",
    template: "%s | Jewel Cruz",
  },
  description:
    "Frontend developer from the Philippines building production-grade web applications. Next.js, React, TypeScript — 100+ tests, Lighthouse 100 performance.",
  metadataBase: new URL("https://jewelcruz.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jewel Cruz — Frontend Developer",
    description:
      "Frontend developer building production-grade web applications with Next.js, React, and TypeScript.",
    url: "https://jewelcruz.dev",
    siteName: "Jewel Cruz",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://jewelcruz.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jewel Cruz — Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jewel Cruz — Frontend Developer",
    description:
      "Frontend developer building production-grade web applications with Next.js, React, and TypeScript.",
    images: ["https://jewelcruz.dev/og-image.png"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://jewelcruz.dev/#website",
        url: "https://jewelcruz.dev",
        name: "Jewel Cruz",
        description:
          "Frontend developer building production-grade web applications with Next.js, React, and TypeScript.",
        inLanguage: "en-US",
        publisher: {
          "@type": "Organization",
          "@id": "https://jewelcruz.dev/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://jewelcruz.dev/#organization",
        name: "Jewel Cruz",
        url: "https://jewelcruz.dev",
        logo: "https://jewelcruz.dev/logo.png",
        sameAs: [
          "https://github.com/jewelcruzs0922-dev",
          "https://linkedin.com",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "jewel@example.com",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
