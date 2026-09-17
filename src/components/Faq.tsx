import { FAQ } from "@/lib/site";

export default function Faq() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-[10px] tracking-[0.35em] text-[var(--color-ink)] opacity-80 mb-3 md:mb-5 text-center">
        FREQUENTLY ASKED
      </h3>
      <div className="border-t border-[var(--color-ink)]/15">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group border-b border-[var(--color-ink)]/15">
            <summary className="flex items-center justify-between gap-4 py-3 md:py-4 min-h-11 cursor-pointer list-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
              <h4 className="text-[13px] md:text-[15px] font-medium text-[var(--color-ink)]">
                {q}
              </h4>
              <svg
                aria-hidden="true"
                className="w-3 h-3 shrink-0 text-[var(--color-ink-dim)] transition-transform duration-300 group-open:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </summary>
            <p className="pb-4 pr-6 text-[13px] md:text-[15px] text-[var(--color-ink-dim)] leading-relaxed">
              {a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
