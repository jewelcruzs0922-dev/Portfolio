import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jewel Cruz — Frontend Developer",
  description:
    "Frontend developer who builds with passion. Next.js, React, TypeScript — every line of code carries emotion.",
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
