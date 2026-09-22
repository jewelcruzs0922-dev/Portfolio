import type { MetadataRoute } from "next";
import { getThemeColor } from "@/lib/theme-color";

export default function manifest(): MetadataRoute.Manifest {
  const themeColor = getThemeColor();
  return {
    name: "Jewel Cruz — Frontend Developer",
    short_name: "Jewel Cruz",
    description:
      "Frontend developer from the Philippines building production-grade web applications with Next.js, React, and TypeScript.",
    start_url: "/",
    display: "standalone",
    background_color: themeColor,
    theme_color: themeColor,
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
