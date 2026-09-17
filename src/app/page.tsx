"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { SLIDES } from "@/lib/site";
import Background from "@/components/background";
import Hero from "@/components/hero";
import About from "@/components/about";
import Projects from "@/components/projects";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [settled, setSettled] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSettled(current), 400);
    return () => clearTimeout(t);
  }, [current]);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <div className="relative h-dvh overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-cyan)] focus:text-white focus:outline-none">
        Skip to content
      </a>
      <main id="main-content" className="relative z-10 h-full">

        {/* Slides */}
        <div className="relative h-full">
          {/* Global background — hoisted out of the Home slide so it stays
              visible on every slide and inactive slides can skip rendering */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Background currentSlide={current} />
          </div>

          {/* Hero — full hexagon + star trail background */}
          <div className={`slide ${current === 0 ? "slide-active" : ""} ${current !== 0 && settled !== 0 ? "slide-idle" : ""}`}>
            {/* Decorative gradient orbs */}
            <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full z-[2]" style={{ background: "radial-gradient(circle, rgba(122,216,240,0.10) 0%, rgba(122,216,240,0) 70%)" }} />
            <div className="absolute bottom-[25%] right-[10%] w-80 h-80 rounded-full z-[2]" style={{ background: "radial-gradient(circle, rgba(240,216,232,0.12) 0%, rgba(240,216,232,0) 70%)" }} />
            <Hero />
          </div>

          {/* About — marble texture */}
          <div className={`slide ${current === 1 ? "slide-active" : ""} ${current !== 1 && settled !== 1 ? "slide-idle" : ""}`}>
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(135deg, #b4daf0 0%, #c8e4f4 20%, #dcd8f0 40%, #ecd0e8 60%, #f4c0d8 80%, #f8b0c8 100%)"
            }} />
            <div className="noise-overlay" />

            {/* Primary veins */}
            <svg className="absolute inset-0 w-full h-full z-[1] opacity-[0.30] marble-vein-1" viewBox="0 0 400 400" preserveAspectRatio="none">
              <defs>
                <filter id="whiteGlow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g fill="none" stroke="#ffffff" strokeWidth="2" filter="url(#whiteGlow)">
                <path d="M0 50 Q100 30 200 60 T400 40" />
                <path d="M0 100 Q80 80 160 110 T320 90 T400 100" />
                <path d="M0 150 Q120 130 240 160 T400 140" />
                <path d="M0 200 Q60 180 120 210 T240 190 T360 200 T400 195" />
                <path d="M0 250 Q100 230 200 260 T400 240" />
                <path d="M0 300 Q80 280 160 310 T320 290 T400 300" />
                <path d="M0 350 Q120 330 240 360 T400 340" />
              </g>
            </svg>

            {/* Secondary veins */}
            <svg className="absolute inset-0 w-full h-full z-[1] opacity-[0.22] marble-vein-2" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1.5" filter="url(#whiteGlow)">
                <path d="M0 70 Q120 50 240 80 T400 65" />
                <path d="M0 130 Q80 110 160 140 T320 120 T400 135" />
                <path d="M0 180 Q100 160 200 190 T400 175" />
                <path d="M0 230 Q70 210 140 240 T280 220 T400 235" />
                <path d="M0 280 Q90 260 180 290 T360 270 T400 285" />
                <path d="M0 330 Q100 310 200 340 T400 325" />
              </g>
            </svg>

            {/* Tertiary veins */}
            <svg className="absolute inset-0 w-full h-full z-[1] opacity-[0.15] marble-vein-3" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1" filter="url(#whiteGlow)">
                <path d="M0 80 Q140 60 280 90 T400 75" />
                <path d="M0 160 Q90 140 180 170 T360 150 T400 165" />
                <path d="M0 240 Q110 220 220 250 T400 235" />
                <path d="M0 310 Q80 290 160 320 T320 300 T400 315" />
                <path d="M0 370 Q100 350 200 380 T400 365" />
              </g>
            </svg>

            {/* Cyan tint veins */}
            <svg className="absolute inset-0 w-full h-full z-[2] opacity-[0.08] marble-vein-4" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1" filter="url(#whiteGlow)">
                <path d="M0 75 Q100 55 200 85 T400 70" />
                <path d="M0 195 Q120 175 240 205 T400 190" />
                <path d="M0 315 Q90 295 180 325 T360 305 T400 318" />
              </g>
            </svg>

            {/* Pink tint veins */}
            <svg className="absolute inset-0 w-full h-full z-[2] opacity-[0.08] marble-vein-5" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1" filter="url(#whiteGlow)">
                <path d="M0 115 Q80 95 160 125 T320 105 T400 118" />
                <path d="M0 255 Q100 235 200 265 T400 252" />
              </g>
            </svg>

            <div className="relative z-10 h-full"><About /></div>
          </div>

          {/* Projects — blue pink */}
          <div className={`slide ${current === 2 ? "slide-active" : ""} ${current !== 2 && settled !== 2 ? "slide-idle" : ""}`}>
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(135deg, #9acce8 0%, #a8d8f0 25%, #c0e8f8 45%, #e0d8f4 65%, #f0c8e0 80%, #f4d0d8 100%)"
            }} />
            {/* Abstract overlapping diagonal shapes — animated (desktop) */}
            <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none hidden md:block" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="projectsGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g className="glow-anim" filter="url(#projectsGlow)">
                <g className="diamond-float diamond-1">
                  <rect x="-200" y="-100" width="900" height="900" rx="20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                    <animateTransform attributeName="transform" type="rotate" values="-30 250 350;-22 250 350;-30 250 350" dur="8s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-2">
                  <rect x="100" y="-200" width="800" height="800" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8">
                    <animateTransform attributeName="transform" type="rotate" values="-30 500 200;-38 500 200;-30 500 200" dur="10s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-3">
                  <rect x="400" y="-100" width="700" height="700" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8">
                    <animateTransform attributeName="transform" type="rotate" values="-30 750 250;-22 750 250;-30 750 250" dur="9s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-4">
                  <rect x="600" y="0" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                    <animateTransform attributeName="transform" type="rotate" values="-30 900 300;-38 900 300;-30 900 300" dur="11s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-5">
                  <rect x="300" y="200" width="500" height="500" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                    <animateTransform attributeName="transform" type="rotate" values="-30 550 450;-22 550 450;-30 550 450" dur="7s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-6">
                  <rect x="100" y="100" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2">
                    <animateTransform attributeName="transform" type="rotate" values="-30 400 400;-38 400 400;-30 400 400" dur="12s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-7">
                  <rect x="200" y="50" width="400" height="400" rx="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                    <animateTransform attributeName="transform" type="rotate" values="-30 400 250;-22 400 250;-30 400 250" dur="9s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-8">
                  <rect x="500" y="150" width="350" height="350" rx="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8">
                    <animateTransform attributeName="transform" type="rotate" values="-30 675 325;-38 675 325;-30 675 325" dur="10s" repeatCount="indefinite" />
                  </rect>
                </g>
              </g>
            </svg>
            {/* Abstract overlapping diagonal shapes — static (mobile) */}
            <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none block md:hidden" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="projectsGlowMobile">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#projectsGlowMobile)">
                <rect className="diamond-float diamond-1" x="-200" y="-100" width="900" height="900" rx="20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" transform="rotate(-30 250 350)" />
                <rect className="diamond-float diamond-2" x="100" y="-200" width="800" height="800" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" transform="rotate(-30 500 200)" />
                <rect className="diamond-float diamond-3" x="400" y="-100" width="700" height="700" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" transform="rotate(-30 750 250)" />
                <rect className="diamond-float diamond-4" x="600" y="0" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" transform="rotate(-30 900 300)" />
                <rect className="diamond-float diamond-5" x="300" y="200" width="500" height="500" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" transform="rotate(-30 550 450)" />
                <rect className="diamond-float diamond-6" x="100" y="100" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" transform="rotate(-30 400 400)" />
                <rect className="diamond-float diamond-7" x="200" y="50" width="400" height="400" rx="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" transform="rotate(-30 400 250)" />
                <rect className="diamond-float diamond-8" x="500" y="150" width="350" height="350" rx="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" transform="rotate(-30 675 325)" />
              </g>
            </svg>
            {/* Decorative gradient orbs */}
            <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(122,216,240,0.12) 0%, rgba(122,216,240,0) 70%)" }} />
            <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(240,216,232,0.14) 0%, rgba(240,216,232,0) 70%)" }} />
            <div className="noise-overlay" />
            <div className="relative z-10 h-full"><Projects /></div>
          </div>

          {/* Contact — geometric */}
          <div className={`slide ${current === 3 ? "slide-active" : ""} ${current !== 3 && settled !== 3 ? "slide-idle" : ""}`}>
            {/* Base — blue pink gradient */}
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(135deg, #aedaf3 0%, #c1e2f7 18%, #d6dff5 38%, #ecd9f0 58%, #f8d1e7 78%, #fbc7de 100%)"
            }} />
            {/* Geometric diamond pattern */}
            <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="centerFade" cx="50%" cy="55%" r="26%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="60%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </radialGradient>
                <mask id="serahMask">
                  <rect width="1200" height="800" fill="url(#centerFade)" />
                </mask>
                <filter id="geoGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <path id="sparkle" d="M0,-11 Q2.4,-2.4 11,0 Q2.4,2.4 0,11 Q-2.4,2.4 -11,0 Q-2.4,-2.4 0,-11 Z" />
              </defs>
              <g mask="url(#serahMask)">
              {/* Large rounded diamonds */}
              <g className="geo-pulse-5 glow-anim" filter="url(#geoGlow)" opacity="0.6">
                <rect x="-140" y="-190" width="660" height="660" rx="52" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 190 140)" />
                <rect x="330" y="-230" width="720" height="720" rx="58" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 690 130)" />
                <rect x="-230" y="200" width="640" height="640" rx="50" fill="none" stroke="white" strokeWidth="1.8" transform="rotate(45 90 520)" />
                <rect x="300" y="120" width="780" height="780" rx="62" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 690 510)" />
                <rect x="810" y="150" width="640" height="640" rx="50" fill="none" stroke="white" strokeWidth="1.8" transform="rotate(45 1130 470)" />
                <rect x="380" y="560" width="580" height="580" rx="46" fill="none" stroke="white" strokeWidth="1.5" transform="rotate(45 670 850)" />
              </g>
              {/* Sparkles */}
              <g opacity="0.85" fill="white">
                <use href="#sparkle" transform="translate(300,120) scale(0.7)" />
                <use href="#sparkle" transform="translate(510,78) scale(0.5)" />
                <use href="#sparkle" transform="translate(880,140) scale(0.6)" />
                <use href="#sparkle" transform="translate(1085,88) scale(0.45)" />
                <use href="#sparkle" transform="translate(150,330) scale(0.55)" />
                <use href="#sparkle" transform="translate(1150,235) scale(0.7)" />
                <use href="#sparkle" transform="translate(420,430) scale(0.5)" />
                <use href="#sparkle" transform="translate(965,420) scale(0.55)" />
                <use href="#sparkle" transform="translate(240,645) scale(0.6)" />
                <use href="#sparkle" transform="translate(1010,660) scale(0.65)" />
                <use href="#sparkle" transform="translate(765,740) scale(0.5)" />
                <use href="#sparkle" transform="translate(120,760) scale(0.45)" />
              </g>
              </g>
            </svg>
            <div className="noise-overlay" />
            <div className="relative z-10 h-full">
              <Contact />
              <Footer />
            </div>
          </div>
        </div>

        {/* Arrow navigation */}
        {current > 0 && (
          <button onClick={prev} aria-label="Previous slide"
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-[var(--color-ink-dim)] opacity-30 rotate-45 group-hover:border-[var(--color-cyan)] group-hover:opacity-60 transition-all duration-300" />
              <svg className="w-5 h-5 text-[var(--color-ink-dim)] group-hover:text-[var(--color-cyan)] transition-colors relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}
        {current < SLIDES.length - 1 && (
          <button onClick={next} aria-label="Next slide"
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-[var(--color-ink-dim)] opacity-30 rotate-45 group-hover:border-[var(--color-cyan)] group-hover:opacity-60 transition-all duration-300" />
              <svg className="w-5 h-5 text-[var(--color-ink-dim)] group-hover:text-[var(--color-cyan)] transition-colors relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        {/* Slide indicator — pink crystals */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50" aria-label="Slide navigation">
          <div className="flex items-center gap-6">
            {SLIDES.map((name, i) => {
              const isActive = i === current;
              const isPast = i < current;
              return (
                <button key={i} onClick={() => goTo(i)} aria-label={`Go to ${name}`}
                  className="tap-feedback flex flex-col items-center gap-2.5 py-2 px-3 group outline-none focus:outline-none focus:ring-0 active:outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}>
                  {/* Crystal */}
                  <div className="relative">
                    {/* Glow layer */}
                    {isActive && (
                      <div className="absolute -inset-2 rotate-45 bg-[var(--color-cyan)] opacity-40 blur-md" />
                    )}
                    {/* Crystal body */}
                    <div className={`relative w-4 h-4 rotate-45 transition-all duration-300 border ${
                      isActive
                        ? "bg-[var(--color-cyan)] border-[var(--color-cyan-bright)] shadow-[0_0_20px_rgba(120,216,240,0.9)]"
                        : isPast
                          ? "bg-white/85 border-white/80 shadow-[0_0_10px_rgba(255,255,255,1),0_0_22px_rgba(255,255,255,0.75)]"
                          : "bg-white/65 border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.95),0_0_22px_rgba(255,255,255,0.6)] group-hover:bg-white/85 group-hover:shadow-[0_0_12px_rgba(255,255,255,1),0_0_26px_rgba(255,255,255,0.8)]"
                    }`} />
                  </div>
                  {/* Label */}
                  <span className={`text-[9px] tracking-[0.25em] transition-opacity duration-200 font-medium ${
                    isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-dim)]"
                  }`}>
                    {name.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}