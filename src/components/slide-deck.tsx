"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { SLIDES } from "@/lib/site";
import Background from "@/components/background";

const SMIL_SVG_ID = "projects-smil";

export default function SlideDeck({ slides }: { slides: React.ReactNode[] }) {
  const [current, setCurrent] = useState(0);
  const [settled, setSettled] = useState(0);
  const touchStart = useRef<number | null>(null);
  const lastFocusHandled = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setSettled(current), 400);
    return () => clearTimeout(t);
  }, [current]);

  /* SMIL animations ignore CSS reduced-motion rules — freeze them in JS */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const svg = document.getElementById(SMIL_SVG_ID);
      if (!(svg instanceof SVGSVGElement)) return;
      if (mq.matches) svg.pauseAnimations();
      else svg.unpauseAnimations();
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* Keep focus inside the deck when the focused slide is hidden */
  useEffect(() => {
    if (lastFocusHandled.current === current) return;
    lastFocusHandled.current = current;
    const t = setTimeout(() => {
      const activeEl = document.activeElement;
      const slide = document.querySelector<HTMLElement>(`[data-slide="${current}"]`);
      if (!slide) return;
      const inHiddenSlide =
        activeEl instanceof HTMLElement &&
        activeEl.closest(".slide") !== null &&
        !slide.contains(activeEl);
      if (!activeEl || activeEl === document.body || inHiddenSlide) {
        slide.focus({ preventScroll: true });
      }
    }, 450);
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
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable='true'], [contenteditable='']")
      ) {
        return;
      }
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

          {slides.map((child, i) => (
            <div
              key={i}
              data-slide={i}
              tabIndex={-1}
              className={`slide ${current === i ? "slide-active" : ""} ${current !== i && settled !== i ? "slide-idle" : ""}`}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Arrow navigation */}
        {current > 0 && (
          <button onClick={prev} aria-label="Previous slide"
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-[var(--color-ink-dim)] opacity-30 rotate-45 group-hover:border-[var(--color-cyan)] group-hover:opacity-60 transition-all duration-300" />
              <svg className="w-5 h-5 text-[var(--color-ink-dim)] group-hover:text-[var(--color-cyan)] transition-colors relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
              <svg className="w-5 h-5 text-[var(--color-ink-dim)] group-hover:text-[var(--color-cyan)] transition-colors relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        {/* Announce slide changes to screen readers */}
        <div role="status" aria-live="polite" className="sr-only">
          {`Slide ${current + 1} of ${SLIDES.length}: ${SLIDES[current]}`}
        </div>
      </main>

      {/* Slide indicator — pink crystals */}
      <header className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <nav aria-label="Slide navigation">
          <div className="flex items-center gap-6">
            {SLIDES.map((name, i) => {
              const isActive = i === current;
              const isPast = i < current;
              return (
                <button key={i} onClick={() => goTo(i)} aria-label={`Go to ${name}`}
                  aria-current={isActive ? "true" : undefined}
                  className="tap-feedback flex flex-col items-center gap-2.5 py-2 px-3 group"
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
                        ? "bg-[var(--color-cyan)] border-[var(--color-cyan-bright)] shadow-[var(--glow-cyan)]"
                        : isPast
                          ? "bg-white/85 border-white/80 shadow-[var(--glow-white-solid)]"
                          : "bg-white/65 border-white/80 shadow-[var(--glow-white-soft)] group-hover:bg-white/85 group-hover:shadow-[var(--glow-white-hover)]"
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
      </header>
    </div>
  );
}
