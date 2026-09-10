import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jimwel Cruz — Frontend Developer",
  description:
    "Frontend developer specializing in Next.js, React, and TypeScript. Building beautiful, performant web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
