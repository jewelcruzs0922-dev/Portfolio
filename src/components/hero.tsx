export default function Hero() {
  return (
    <section id="home" className="h-full flex flex-col items-center justify-center relative px-6 z-10">
      {/* Title */}
      <div className="text-center fade-in fade-d2">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-light tracking-[0.15em] sm:tracking-[0.3em] text-[var(--color-ink)]"
          style={{ textShadow: "var(--text-glow-cyan)" }}>
          JEWEL CRUZ
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4 mb-2">
          <div className="hidden sm:block w-12 h-px bg-[var(--color-ink)] opacity-20" />
          <div className="text-center">
            <p className="text-sm sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] text-[var(--color-ink)] font-medium">FRONTEND DEVELOPER</p>
            <p className="text-sm sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] font-medium"
              style={{
                background: "var(--gradient-brand-text)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>WEB DESIGNER</p>
          </div>
          <div className="hidden sm:block w-12 h-px bg-[var(--color-ink)] opacity-20" />
        </div>
      </div>

      {/* Tagline */}
      <div className="text-center mt-5 fade-in fade-d3">
        <p className="text-xs sm:text-sm md:text-base tracking-[0.1em] sm:tracking-[0.2em] text-[var(--color-ink-dim)] font-medium">
          Innovation through iteration
        </p>
      </div>
    </section>
  );
}
