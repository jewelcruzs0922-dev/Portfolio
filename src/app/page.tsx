"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ── Hooks ── */
function useInView(t = 0.15) {
  const [r, setR] = useState<HTMLElement | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!r) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(e.target); } }, { threshold: t });
    o.observe(r); return () => o.disconnect();
  }, [r, t]);
  return { ref: setR, isVisible: v };
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => { const s = document.documentElement; setP(s.scrollTop / (s.scrollHeight - s.clientHeight)); };
    addEventListener("scroll", h, { passive: true }); return () => removeEventListener("scroll", h);
  }, []);
  return p;
}

/* ── Split reveal ── */
function SplitReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView(0.3);
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * 0.02}s`,
        }}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </span>
  );
}

/* ── Magnetic btn ── */
function MagBtn({ children, className = "", href = "#" }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.12}px)`;
  }, []);
  const leave = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  return <a ref={ref} href={href} className={className} onMouseMove={move} onMouseLeave={leave} style={{ transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>{children}</a>;
}

/* ── Reveal ── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(scrollY > 50);
    addEventListener("scroll", h, { passive: true }); return () => removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="glass-pill flex items-center justify-between px-6 lg:px-8 py-3">
          <a href="#home" className="text-sm font-bold tracking-tight text-[#1E3A5F]">J<span className="text-[#5B9BD5]">.</span>C</a>
          <div className="hidden sm:flex gap-1">
            {["Work", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A5F]/40 hover:text-[#1E3A5F]/80 transition-colors rounded-xl hover:bg-white/40">{item}</a>
            ))}
          </div>
          <MagBtn href="#contact" className="glass-btn px-5 py-2 text-xs font-semibold text-white">Hire me</MagBtn>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-end px-6 lg:px-12 pb-20 pt-32 relative overflow-hidden">
      {/* Floating transparent shapes */}
      <div className="absolute top-[15%] right-[8%] w-[300px] h-[300px] pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, rgba(126,200,227,0.5), transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "float1 12s ease-in-out infinite" }} />
      <div className="absolute bottom-[20%] left-[5%] w-[250px] h-[250px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, rgba(184,201,232,0.5), transparent 70%)", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", animation: "float2 15s ease-in-out infinite" }} />
      <div className="absolute top-[50%] left-[50%] w-[200px] h-[200px] pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, rgba(91,155,213,0.4), transparent 70%)", borderRadius: "50%", animation: "float1 18s ease-in-out infinite reverse" }} />

      {/* Decorative hexagons */}
      <div className="absolute top-[25%] right-[15%] w-16 h-16 pointer-events-none opacity-[0.07]"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--color-blue)", animation: "float2 20s ease-in-out infinite" }} />
      <div className="absolute bottom-[30%] right-[25%] w-10 h-10 pointer-events-none opacity-[0.05]"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--color-cyan)", animation: "float1 16s ease-in-out infinite" }} />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="glass-pill inline-flex items-center gap-3 px-5 py-2.5 mb-10"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
          <div className="relative"><div className="h-2 w-2 rounded-full bg-[#5B9BD5]" /><div className="absolute inset-0 h-2 w-2 rounded-full bg-[#5B9BD5] animate-ping" /></div>
          <span className="t-micro text-[#5B9BD5]">Available for work</span>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
          <h1 className="t-hero max-w-4xl">
            <SplitReveal text="Jewel" delay={200} /><br />
            <SplitReveal text="Cruz" className="gradient-text" delay={500} />
          </h1>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s" }}>
          <p className="t-body text-[#1E3A5F]/50 max-w-md">
            Web designer &amp; frontend developer from the Philippines. I build things that feel right.
          </p>
          <div className="flex items-center gap-6">
            <MagBtn href="#work" className="link-underline text-sm font-semibold text-[#1E3A5F]/50 hover:text-[#1E3A5F] transition-colors">See work</MagBtn>
            <MagBtn href="#contact" className="link-underline text-sm font-semibold text-[#1E3A5F]/50 hover:text-[#1E3A5F] transition-colors">Contact</MagBtn>
          </div>
        </div>

        <div className="flex gap-2 mt-10" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 1s" }}>
          {["Next.js", "React", "TypeScript", "Tailwind", "Figma"].map((t, i) => (
            <span key={t} className="glass-subtle px-3 py-1.5 text-[10px] font-semibold text-[#1E3A5F]/40 rounded-lg"
              style={{ opacity: loaded ? 1 : 0, transition: `all 0.5s ease ${1 + i * 0.06}s` }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  const items = ["Redwood Retreats", "\u2014", "Cosmic Ray Solar", "\u2014", "Canvas Animations", "\u2014", "Stripe Payments", "\u2014", "Lighthouse 100", "\u2014", "100+ Tests", "\u2014"];
  return (
    <div className="py-5 border-y border-[#5B9BD5]/10 overflow-hidden">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 25s linear infinite" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 text-[clamp(1rem,2.5vw,1.8rem)] font-bold tracking-tight text-[#5B9BD5]/15 hover:text-[#5B9BD5]/30 transition-colors duration-500">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Project ── */
function Project({ num, title, tag, desc, highlights, tech, stats, live, code, accent, reverse }: {
  num: string; title: string; tag: string; desc: string; highlights: string[];
  tech: string[]; stats: Record<string, string>; live: string; code: string; accent: string; reverse?: boolean;
}) {
  const { ref, isVisible } = useInView(0.08);

  return (
    <div ref={ref} className="min-h-screen flex items-center py-20 px-6 lg:px-12 relative">
      {/* Giant number */}
      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          fontSize: "clamp(12rem, 28vw, 22rem)", fontWeight: 900, lineHeight: 0.8, color: `${accent}0A`,
          letterSpacing: "-0.05em", [reverse ? "right" : "left"]: "3%",
          opacity: isVisible ? 1 : 0, transition: "opacity 1s ease 0.3s",
        }}>
        {num}
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Text */}
        <div className={`${reverse ? "lg:col-start-8 lg:col-span-5" : "lg:col-span-5"}`}
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : `translateX(${reverse ? "30px" : "-30px"})`, transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-[#1E3A5F]/30">{num}</span>
            <div className="h-[1px] flex-1 bg-[#5B9BD5]/10" />
            <span className="t-micro" style={{ color: accent }}>{tag}</span>
          </div>
          <h2 className="text-[clamp(1.8rem,4.5vw,3.5rem)] font-black tracking-tight leading-[0.95] mb-5 text-[#1E3A5F]">{title}</h2>
          <p className="t-body text-[#1E3A5F]/45 mb-5 max-w-md">{desc}</p>

          <ul className="space-y-2 mb-5">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm text-[#1E3A5F]/45">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent }} />
                {h}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 mb-5">
            {tech.map((t) => <span key={t} className="glass-subtle px-3 py-1.5 text-[10px] font-semibold text-[#1E3A5F]/45 rounded-xl">{t}</span>)}
          </div>

          <div className="flex gap-3 mb-7">
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} className="glass-subtle px-3 py-2 rounded-xl text-center min-w-[55px]">
                <div className="text-base font-black" style={{ color: accent }}>{v}</div>
                <div className="t-micro text-[#1E3A5F]/25 mt-0.5">{k}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <MagBtn href={live} className="glass-btn px-7 py-3 text-sm inline-flex items-center gap-2 text-white font-semibold">
              Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
            </MagBtn>
            <MagBtn href={code} className="glass-ghost px-7 py-3 text-sm font-semibold text-[#1E3A5F]/50 inline-flex items-center">Code</MagBtn>
          </div>
        </div>

        {/* Mockup */}
        <div className={`${reverse ? "lg:col-start-1 lg:col-span-7 lg:row-start-1" : "lg:col-span-7 lg:col-start-6"}`}
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : `translateX(${reverse ? "-30px" : "30px"})`, transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s" }}>
          <div className="glass-strong overflow-hidden rounded-2xl group">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/40">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#5B9BD5]/20" /><div className="w-2.5 h-2.5 rounded-full bg-[#5B9BD5]/20" /><div className="w-2.5 h-2.5 rounded-full bg-[#5B9BD5]/20" /></div>
              <div className="flex-1 flex justify-center"><div className="px-3 py-1 text-[9px] text-[#1E3A5F]/30 font-mono bg-white/40 rounded-md border border-white/50">{live.replace("https://", "")}</div></div>
              <div className="w-8" />
            </div>
            {/* Preview */}
            <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "linear-gradient(135deg, #F5F9FF, #EDF4FC, #F0F7FF)" }}>
              <div className="absolute inset-0 flex flex-col p-6 transition-transform duration-700 group-hover:scale-[1.02]">
                {/* Nav */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2"><div className="w-5 h-5 rounded" style={{ background: accent }} /><div className="h-2 w-20 rounded-full bg-[#1E3A5F]/10" /></div>
                  <div className="flex gap-3">{[1,2,3].map(i => <div key={i} className="h-1.5 w-10 rounded-full bg-[#1E3A5F]/8" />)}</div>
                </div>
                {/* Hero */}
                <div className="mb-5">
                  <div className="h-4 w-52 rounded bg-[#1E3A5F]/10 mb-2.5" />
                  <div className="h-2.5 w-72 rounded bg-[#1E3A5F]/5 mb-1.5" />
                  <div className="h-2.5 w-52 rounded bg-[#1E3A5F]/4 mb-4" />
                  <div className="flex gap-2"><div className="h-8 w-24 rounded-lg" style={{ background: accent }} /><div className="h-8 w-20 rounded-lg border border-[#5B9BD5]/15" /></div>
                </div>
                {/* Cards */}
                <div className="flex-1 grid grid-cols-3 gap-2.5">
                  {[1,2,3].map(i => (
                    <div key={i} className="rounded-xl bg-white/50 border border-white/60 p-3 flex flex-col">
                      <div className="flex-1 rounded-lg mb-2.5" style={{ background: `${accent}${i === 1 ? "12" : "08"}` }} />
                      <div className="h-1.5 w-14 rounded-full bg-[#1E3A5F]/8 mb-1.5" />
                      <div className="h-1 w-20 rounded-full bg-[#1E3A5F]/5" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <MagBtn href={live} className="glass-btn px-6 py-2.5 text-xs font-bold tracking-wider uppercase text-white">View Project</MagBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── About ── */
function About() {
  const { ref, isVisible } = useInView();
  return (
    <section id="about" className="py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#5B9BD5] mb-4">About</span>
          <h2 className="t-display mb-8 text-[#1E3A5F]">I craft <span className="gradient-text">experiences</span>, not just websites.</h2>
          <div className="space-y-4">
            <p className="t-body text-[#1E3A5F]/50">
              I&apos;m Jewel Cruz. I design and build web applications that are fast, tested, and genuinely enjoyable to use.
            </p>
            <p className="t-body text-[#1E3A5F]/50">
              Two years in. A luxury cabin rental platform with canvas animations. A full-stack solar company with Stripe. And this portfolio — hand-coded, no templates.
            </p>
            <p className="t-body text-[#1E3A5F]/35">
              What drives me: &ldquo;How do I make this feel alive?&rdquo;
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          {[
            { num: "2+", label: "Years building", color: "#5B9BD5" },
            { num: "100+", label: "Tests written", color: "#7EC8E3" },
            { num: "100", label: "Lighthouse score", color: "#5B9BD5" },
            { num: "0", label: "Templates used", color: "#3A7CC8" },
          ].map((s, i) => (
            <div key={s.label} className="glass p-4 flex items-center gap-5"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : "translateX(20px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.08}s` }}>
              <div className="text-xl font-black min-w-[55px] text-right" style={{ color: s.color }}>{s.num}</div>
              <div className="text-sm text-[#1E3A5F]/40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact() {
  const { ref, isVisible } = useInView();
  return (
    <section id="contact" className="py-32 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center" ref={ref}>
        <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#5B9BD5] mb-6">Contact</span>
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <h2 className="t-hero mb-6">
            <SplitReveal text="Let's" /><br />
            <span className="gradient-text"><SplitReveal text="talk" delay={200} /></span>
          </h2>
        </div>
        <p className="text-[#1E3A5F]/35 mb-12 max-w-md mx-auto">Open to freelance, remote positions, and collaborations.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease 0.4s" }}>
          <MagBtn href="mailto:jewel@example.com" className="glass-btn px-10 py-4 inline-flex items-center justify-center text-white font-semibold">Email Me</MagBtn>
          <MagBtn href="https://github.com/jewelcruzs0922-dev" className="glass-ghost px-10 py-4 text-sm font-semibold text-[#1E3A5F]/50 inline-flex items-center justify-center">GitHub</MagBtn>
          <MagBtn href="https://linkedin.com" className="glass-ghost px-10 py-4 text-sm font-semibold text-[#1E3A5F]/50 inline-flex items-center justify-center">LinkedIn</MagBtn>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-12 border-t border-[#5B9BD5]/10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="t-small text-[#1E3A5F]/25">&copy; 2026 Jewel Cruz</p>
        <p className="t-micro text-[#1E3A5F]/20">Hand-coded. No templates.</p>
      </div>
    </footer>
  );
}

/* ── Scroll progress ── */
function ScrollProgress() {
  const p = useScrollProgress();
  return <div className="fixed top-0 left-0 h-[2px] z-[60] transition-all duration-150" style={{ width: `${p * 100}%`, background: "linear-gradient(90deg, #5B9BD5, #7EC8E3, #B8C9E8)" }} />;
}

/* ── Main ── */
export default function Home() {
  return (
    <>
      <div className="sky-backdrop" />
      <div className="grid-bg" />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <Project num="01" title="Redwood Retreats" tag="Cabin Rental Platform"
        desc="A luxury cabin rental platform with canvas-rendered grass that sways in the wind, PS5-style particles, 3D tilt cards, and a dynamic booking system."
        highlights={["Canvas grass with wind physics", "PS5-style particle system", "Dynamic booking & pricing", "Lighthouse 100 performance"]}
        tech={["Next.js 16", "TypeScript", "Canvas API", "Vitest"]}
        stats={{ tests: "41", perf: "100", a11y: "91" }}
        live="https://redwood-retreats.vercel.app" code="https://github.com/jewelcruzs0922-dev/redwood-retreats"
        accent="#5B9BD5" />
      <Project num="02" title="Cosmic Ray Solar" tag="Solar Company Platform"
        desc="A complete business platform with Stripe payments, Sanity CMS, appointment scheduling, and a real-time savings calculator."
        highlights={["Stripe checkout integration", "Sanity CMS content management", "Appointment scheduling", "5 API routes"]}
        tech={["Next.js 16", "Stripe", "Sanity", "Playwright"]}
        stats={{ tests: "59", pages: "35", apis: "5" }}
        live="https://cosmicray-solar.netlify.app" code="https://github.com/jewelcruzs0922-dev/cosmicray-solar"
        accent="#3A7CC8" reverse />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
