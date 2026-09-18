import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{
      background: "var(--gradient-404)"
    }}>
      <div className="text-center">
        <h1 className="text-7xl md:text-9xl font-extralight tracking-[0.1em] text-[var(--color-ink)] mb-4">
          404
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-ink)] opacity-60 mb-8 tracking-wide">
          This page could not be found.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-3 px-8 py-3 border border-[var(--color-cyan)] text-[11px] tracking-[0.2em] text-[var(--color-ink)] hover:bg-[var(--color-cyan)] hover:text-white transition-all duration-300">
          <span className="w-1.5 h-1.5 rotate-45 bg-[var(--color-cyan)] opacity-50" />
          BACK HOME
        </Link>
      </div>
    </div>
  );
}
