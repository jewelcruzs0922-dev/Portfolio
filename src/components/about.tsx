import TechIcon from "./tech-icon";

const technologies = [
  { name: "React" },
  { name: "Next.js" },
  { name: "TypeScript" },
  { name: "Tailwind CSS" },
  { name: "Node.js" },
  { name: "Vitest" },
  { name: "Playwright" },
  { name: "Sanity" },
];

export default function About() {
  return (
    <section id="about" className="h-full flex items-start justify-center pt-6 md:pt-10 pb-8 md:pb-12 px-4 md:px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
         {/* Title */}
         <div className="mb-4 md:mb-8">
           <h2 className="text-[36px] md:text-[64px] font-extralight tracking-[0.06em] text-[var(--color-ink)] leading-tight">
             FRONTEND DEVELOPER
           </h2>
           <h2 className="text-[36px] md:text-[64px] font-extralight tracking-[0.06em] leading-tight">
              <span className="text-[var(--color-ink)] opacity-70">&amp;</span>
             <span style={{
               background: "linear-gradient(90deg, #3cc8f0, #8060c0, #e070a0)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent",
             }}> WEB DESIGNER</span>
           </h2>
         </div>

        {/* Two columns with center divider + diamond */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6 md:gap-12 items-start">
          {/* LEFT — Description */}
          <div>
            <p className="text-[16px] md:text-[22px] text-[var(--color-ink)] leading-[1.6] md:leading-[1.8] mb-3 md:mb-5">
              Hi, I&apos;m Jewel — a frontend developer and web designer from the Philippines.
            </p>
            <p className="text-[16px] md:text-[22px] text-[var(--color-ink)] leading-[1.6] md:leading-[1.8] mb-3 md:mb-5">
              I turn ideas into clean, accessible, interactive, and user-friendly web experiences that look as good as they perform.
            </p>
            <p className="text-[16px] md:text-[22px] text-[var(--color-ink)] leading-[1.6] md:leading-[1.8]">
              I leverage AI tools to streamline my workflow, prototype faster, and deliver high-quality results without compromising creativity.
            </p>
          </div>

          {/* CENTER — Vertical line with diamond */}
          <div className="hidden md:flex flex-col items-center justify-center relative h-full py-8">
            {/* Gradient line */}
            <div className="w-px h-full bg-gradient-to-b from-transparent via-[var(--color-ink)] to-transparent opacity-30" />
            {/* Diamond with glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-5 h-5 rotate-45 bg-[var(--color-ink)] shadow-[0_0_16px_rgba(26,58,90,0.4)]" />
            </div>
            {/* Small dots along the line */}
            <div className="absolute top-1/4 w-2 h-2 rounded-full bg-[var(--color-ink)] opacity-25" />
            <div className="absolute top-3/4 w-2 h-2 rounded-full bg-[var(--color-ink)] opacity-25" />
          </div>

          {/* RIGHT — Technologies */}
          <div className="text-center">
            <h3 className="text-[14px] md:text-[16px] tracking-[0.35em] text-[var(--color-ink)] mb-4 md:mb-8">TECHNOLOGIES</h3>

            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {technologies.map((t) => (
                <div key={t.name} className="flex flex-col items-center gap-1.5 md:gap-2 group cursor-default">
                   <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/25 bg-white/5 flex items-center justify-center text-[var(--color-ink)] group-hover:border-[var(--color-cyan)] transition-all">
                    <TechIcon name={t.name} />
                  </div>
                  <span className="text-[9px] md:text-[13px] tracking-[0.05em] text-[var(--color-ink)] opacity-100 group-hover:opacity-100 transition-opacity">{t.name}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 md:mt-10 hidden md:flex flex-wrap justify-center gap-4">
              {["UI/UX", "Responsive", "Animations", "Performance", "Testing"].map((tag) => (
                <span key={tag} className="text-[14px] tracking-[0.1em] text-[var(--color-ink)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
