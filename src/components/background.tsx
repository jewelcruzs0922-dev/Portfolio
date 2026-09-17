"use client";

import HexagonCanvas from "./hexagon-canvas";

export default function Background({ currentSlide }: { currentSlide: number }) {
  return (
    <>
      <div className="fixed inset-0 z-0" style={{
        background: "linear-gradient(180deg, #b8ddef 0%, #c0e2f4 15%, #cce8f6 30%, #d4ecf8 45%, #dcf0fa 55%, #e4ecf2 65%, #ecdce6 78%, #f4c8dc 90%, #f8b8cc 100%)"
      }} />
      <div className="absolute top-0 left-0 w-full h-dvh overflow-hidden z-[1]">
        <HexagonCanvas currentSlide={currentSlide} />
        <div className="noise-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-[85vh] z-[3] opacity-0 animate-mountainReveal" style={{
          backgroundImage: "url(/grid-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, transparent 80%)",
        }} />
      </div>
    </>
  );
}
