"use client";

import Image from "next/image";
import HexagonCanvas from "./hexagon-canvas";

const MOUNTAIN_MASK = "var(--mountain-mask)";

export default function Background({ currentSlide }: { currentSlide: number }) {
  return (
    <>
      <div className="fixed inset-0 z-0" style={{ background: "var(--gradient-page)" }} />
      <div className="absolute top-0 left-0 w-full h-dvh overflow-hidden z-[1]">
        <HexagonCanvas currentSlide={currentSlide} />
        <div className="noise-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-[85vh] z-[3] opacity-0 animate-mountainReveal" style={{
          maskImage: MOUNTAIN_MASK,
          WebkitMaskImage: MOUNTAIN_MASK,
        }}>
          <Image
            src="/grid-bg.webp"
            alt=""
            aria-hidden
            fill
            preload
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </>
  );
}
