import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jewel Cruz — Frontend Developer | Next.js, React, TypeScript",
  description:
    "Frontend developer specializing in Next.js, React, and TypeScript. Built 2 production platforms with 100+ automated tests and Lighthouse 100 performance scores.",
  keywords: ["frontend developer", "next.js developer", "react developer", "typescript", "web developer for hire"],
  openGraph: {
    title: "Jewel Cruz — Frontend Developer",
    description: "Production-grade web applications with Next.js, React, and TypeScript.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
