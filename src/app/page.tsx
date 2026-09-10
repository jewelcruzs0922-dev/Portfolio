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

/* ── Split text reveal ── */
function SplitReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView(0.3);
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block" style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(100%) rotateX(-80deg)",
          transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * 0.025}s`,
          transformOrigin: "bottom",
        }}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </span>
  );
}

/* ── Magnetic button ── */
function MagneticBtn({ children, className = "", href = "#" }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.15}px)`;
  }, []);
  const leave = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  return <a ref={ref} href={href} className={className} onMouseMove={move} onMouseLeave={leave} style={{ transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>{children}</a>;
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
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="glass-pill flex items-center justify-between px-6 lg:px-8 py-3">
          <a href="#home" className="text-sm font-bold tracking-tight text-white hover-target">J<span className="text-[#8B5CF6]">.</span>C</a>
          <div className="hidden sm:flex gap-1">
            {["Work", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors rounded-xl hover:bg-white/[0.06]">{item}</a>
            ))}
          </div>
          <MagneticBtn href="#contact" className="glass-btn px-5 py-2 text-xs font-semibold text-white">Hire me</MagneticBtn>
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
    <section id="home" className="min-h-screen flex items-end px-6 lg:px-12 pb-20 pt-32 relative overflow-hidden">
      {/* Floating orbs — vivid for glass to blur */}
      <div className="absolute top-10 right-[5%] w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "drift1 14s ease-in-out infinite" }} />
      <div className="absolute bottom-[10%] left-[0%] w-[550px] h-[550px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(6,182,212,0.15) 40%, transparent 70%)", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", animation: "drift2 17s ease-in-out infinite" }} />
      <div className="absolute top-[40%] left-[35%] w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.5) 0%, rgba(244,114,182,0.1) 40%, transparent 70%)", borderRadius: "40% 60% 50% 50% / 60% 40% 60% 40%", animation: "drift3 12s ease-in-out infinite" }} />
      <div className="absolute top-[60%] right-[20%] w-[300px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.4) 0%, transparent 70%)", borderRadius: "50%", animation: "drift1 20s ease-in-out infinite reverse" }} />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="glass-pill inline-flex items-center gap-3 px-5 py-2.5 mb-10"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
          <div className="relative"><div className="h-2 w-2 rounded-full bg-[#34d399]" /><div className="absolute inset-0 h-2 w-2 rounded-full bg-[#34d399] animate-ping" /></div>
          <span className="t-micro text-[#34d399]">Available for hire</span>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
          <h1 className="t-hero max-w-4xl">
            <SplitReveal text="Jewel" delay={300} /><br />
            <SplitReveal text="Cruz" className="gradient-text" delay={600} />
          </h1>
        </div>

        <div className="mt-10 max-w-xl" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s" }}>
          <p className="t-body text-white/45">
            <span className="text-white font-semibold">Web designer &amp; developer</span> building production-grade interfaces with soul. Based in the Philippines.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.9s" }}>
          <MagneticBtn href="#work" className="glass-btn px-8 py-3.5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            See my work
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </MagneticBtn>
          <MagneticBtn href="#contact" className="glass-ghost px-8 py-3.5 text-sm font-semibold text-white/60 inline-flex items-center">Get in touch</MagneticBtn>
        </div>

        <div className="flex gap-2 mt-8" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 1.1s" }}>
          {["Next.js", "React", "TypeScript", "Tailwind", "Figma"].map((t, i) => (
            <span key={t} className="glass-sm px-3 py-1.5 text-[10px] font-semibold text-white/35 rounded-lg hover:text-white/70 hover:bg-white/[0.06] transition-all cursor-default"
              style={{ opacity: loaded ? 1 : 0, transition: `all 0.5s ease ${1.1 + i * 0.06}s` }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  const items = ["Redwood Retreats", "\u2014", "Cosmic Ray Solar", "\u2014", "Web Designer", "\u2014", "Frontend Developer", "\u2014", "UI/UX", "\u2014", "Philippines", "\u2014"];
  return (
    <div className="py-6 border-y border-white/[0.06] overflow-hidden">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 22s linear infinite" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 text-[clamp(1.2rem,3vw,2.5rem)] font-bold tracking-tight text-white/[0.06] hover:text-white/20 transition-colors duration-500">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Work ── */
function Work() {
  const { ref: r1, isVisible: v1 } = useInView(0.08);
  const { ref: r2, isVisible: v2 } = useInView(0.08);

  const projects = [
    {
      num: "01", title: "Redwood Retreats", tag: "Cabin Rental Platform",
      desc: "Canvas-rendered grass with wind physics, PS5-style particles, 3D tilt cards, and a dynamic booking system with real-time pricing. Lighthouse 100. 41 tests.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest"],
      live: "https://redwood-retreats.vercel.app", code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      accent: "#E8913A",
      mockBg: "linear-gradient(135deg, #1a1210, #2d1810, #1a1210)",
    },
    {
      num: "02", title: "Cosmic Ray Solar", tag: "Full-Stack Solar Company",
      desc: "Stripe payments, Sanity CMS, appointment scheduling, and a real-time savings calculator. 59 tests, 35 pages, 5 API routes.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      live: "https://cosmicray-solar.netlify.app", code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      accent: "#6B8DD6",
      mockBg: "linear-gradient(135deg, #0d1020, #151830, #0d1020)",
    },
  ];

  return (
    <section id="work" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">Portfolio</span>
          <h2 className="t-display"><SplitReveal text="Selected work" /></h2>
        </div>

        {/* Project 1 */}
        <div ref={r1} className="mb-32">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className={v1 ? "reveal visible" : "reveal"} style={{ transitionDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-white/30">{projects[0].num}</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="t-micro" style={{ color: projects[0].accent }}>{projects[0].tag}</span>
              </div>
              <h3 className="t-display mb-5">{projects[0].title}</h3>
              <p className="t-body text-white/40 mb-6 max-w-md">{projects[0].desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {projects[0].tech.map((t) => <span key={t} className="glass-sm px-3 py-1.5 text-[10px] font-semibold text-white/50 rounded-xl">{t}</span>)}
              </div>
              <div className="flex gap-4">
                <MagneticBtn href={projects[0].live} className="glass-btn px-7 py-3 text-sm inline-flex items-center gap-2 text-white font-semibold">
                  Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </MagneticBtn>
                <MagneticBtn href={projects[0].code} className="glass-ghost px-7 py-3 text-sm font-semibold text-white/50 inline-flex items-center">Code</MagneticBtn>
              </div>
            </div>

            <div className={v1 ? "reveal visible" : "reveal"} style={{ transitionDelay: "0.3s" }}>
              <div className="glass-heavy overflow-hidden rounded-2xl group">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
                  <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /></div>
                  <div className="flex-1 flex justify-center"><div className="px-3 py-1 text-[9px] text-white/25 font-mono bg-white/[0.03] rounded-md border border-white/[0.06]">{projects[0].live.replace("https://", "")}</div></div>
                  <div className="w-8" />
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 flex flex-col p-6 transition-transform duration-700 group-hover:scale-105" style={{ background: projects[0].mockBg }}>
                    <div className="flex items-center gap-2 mb-6"><div className="w-4 h-4 rounded" style={{ background: projects[0].accent }} /><div className="h-2 w-20 rounded-full bg-white/10" /></div>
                    <div className="flex-1 flex items-center"><div>
                      <div className="h-4 w-48 bg-white/10 rounded mb-3" />
                      <div className="h-2 w-64 bg-white/5 rounded mb-2" />
                      <div className="h-2 w-48 bg-white/5 rounded mb-6" />
                      <div className="h-8 w-28 rounded" style={{ background: projects[0].accent }} />
                    </div></div>
                    <div className="grid grid-cols-3 gap-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-white/[0.04] border border-white/[0.04]" />)}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <MagneticBtn href={projects[0].live} className="glass-btn px-6 py-2.5 text-xs font-bold tracking-wider uppercase text-white">View Project</MagneticBtn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project 2 — reversed */}
        <div ref={r2}>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className={v2 ? "reveal visible" : "reveal"} style={{ transitionDelay: "0.3s" }}>
              <div className="glass-heavy overflow-hidden rounded-2xl group order-2 lg:order-1">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
                  <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /></div>
                  <div className="flex-1 flex justify-center"><div className="px-3 py-1 text-[9px] text-white/25 font-mono bg-white/[0.03] rounded-md border border-white/[0.06]">{projects[1].live.replace("https://", "")}</div></div>
                  <div className="w-8" />
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 flex flex-col p-6 transition-transform duration-700 group-hover:scale-105" style={{ background: projects[1].mockBg }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: projects[1].accent }} /><div className="h-2 w-24 rounded-full bg-white/10" /></div>
                      <div className="h-6 w-20 rounded-full" style={{ background: projects[1].accent }} />
                    </div>
                    <div className="flex-1 flex items-center"><div>
                      <div className="h-4 w-40 bg-white/10 rounded mb-3" />
                      <div className="h-2 w-56 bg-white/5 rounded mb-2" />
                      <div className="h-2 w-40 bg-white/5 rounded mb-6" />
                      <div className="flex gap-2"><div className="h-8 w-24 rounded" style={{ background: projects[1].accent }} /><div className="h-8 w-20 rounded border border-white/10" /></div>
                    </div></div>
                    <div className="grid grid-cols-2 gap-2">{[1,2].map(i => <div key={i} className="h-20 rounded-lg bg-white/[0.04] border border-white/[0.04]" />)}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <MagneticBtn href={projects[1].live} className="glass-btn px-6 py-2.5 text-xs font-bold tracking-wider uppercase text-white">View Project</MagneticBtn>
                  </div>
                </div>
              </div>
            </div>

            <div className={v2 ? "reveal visible" : "reveal"} style={{ transitionDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-white/30">{projects[1].num}</span>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="t-micro" style={{ color: projects[1].accent }}>{projects[1].tag}</span>
              </div>
              <h3 className="t-display mb-5">{projects[1].title}</h3>
              <p className="t-body text-white/40 mb-6 max-w-md">{projects[1].desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {projects[1].tech.map((t) => <span key={t} className="glass-sm px-3 py-1.5 text-[10px] font-semibold text-white/50 rounded-xl">{t}</span>)}
              </div>
              <div className="flex gap-4">
                <MagneticBtn href={projects[1].live} className="glass-btn px-7 py-3 text-sm inline-flex items-center gap-2 text-white font-semibold">
                  Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </MagneticBtn>
                <MagneticBtn href={projects[1].code} className="glass-ghost px-7 py-3 text-sm font-semibold text-white/50 inline-flex items-center">Code</MagneticBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Services ── */
function Services() {
  const { ref, isVisible } = useInView();
  const services = [
    { num: "01", title: "Design", desc: "User-centered interfaces from research to prototype. Every pixel placed with intention.", color: "#8B5CF6" },
    { num: "02", title: "Development", desc: "Next.js, React, TypeScript. Performance-first, tested, accessible, production-ready.", color: "#06B6D4" },
    { num: "03", title: "Branding", desc: "Visual identities that stick. Logos, color systems, typography, and design languages.", color: "#F472B6" },
  ];
  return (
    <section id="services" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={isVisible ? "reveal visible" : "reveal"}>
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">Services</span>
          <h2 className="t-display mb-16"><SplitReveal text="What I do" /></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <div key={s.num} className={`glass p-8 hover:bg-white/[0.09] transition-all duration-500 ${isVisible ? "reveal visible" : "reveal"}`} style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
              <div className="glass-sm w-11 h-11 flex items-center justify-center rounded-xl mb-5" style={{ boxShadow: `0 0 20px ${s.color}15` }}>
                <span className="text-xs font-bold" style={{ color: s.color }}>{s.num}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Skills ── */
function Skills() {
  const { ref, isVisible } = useInView();
  const skills = [
    { name: "React / Next.js", pct: 95, color: "#8B5CF6" },
    { name: "TypeScript", pct: 90, color: "#06B6D4" },
    { name: "Tailwind CSS", pct: 95, color: "#06B6D4" },
    { name: "UI/UX Design", pct: 88, color: "#F472B6" },
    { name: "Node.js", pct: 75, color: "#34d399" },
    { name: "Testing", pct: 85, color: "#8B5CF6" },
  ];
  return (
    <section id="skills" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={isVisible ? "reveal visible" : "reveal"}>
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">Skills</span>
          <h2 className="t-display mb-16"><SplitReveal text="Tech stack" /></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s) => (
            <div key={s.name} className="glass p-6 hover:bg-white/[0.09] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white text-sm">{s.name}</span>
                <span className="text-sm font-black" style={{ color: s.color }}>{s.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 overflow-hidden rounded-full">
                <div className="h-full rounded-full transition-all duration-[1.5s] ease-out" style={{ width: isVisible ? `${s.pct}%` : "0%", background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y", "Sanity", "Stripe"].map((t) => (
            <span key={t} className="glass-sm px-4 py-2 text-xs font-medium text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all cursor-default rounded-xl">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About ── */
function About() {
  const { ref, isVisible } = useInView();
  return (
    <section id="about" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div ref={ref} className={isVisible ? "reveal visible" : "reveal"}>
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">About</span>
          <h2 className="t-display mb-8">I don&apos;t just build websites. I craft <span className="gradient-text">experiences</span>.</h2>
          <p className="t-body text-white/40 mb-4">I&apos;m Jewel Cruz, a web designer &amp; developer from the Philippines. Every project starts with a question: &ldquo;How do I make this feel alive?&rdquo;</p>
          <p className="t-body text-white/40 mb-4">Two years in, I&apos;ve shipped a luxury rental platform with canvas animations, a full-stack solar company with Stripe, and this portfolio you&apos;re looking at right now.</p>
          <p className="t-body text-white/30">Everything is hand-coded. No templates. No page builders. Just code, design, and intention.</p>
        </div>
        <div className="flex flex-col gap-4 justify-center">
          {[
            { num: "2+", label: "Years building", color: "#E8913A" },
            { num: "100+", label: "Tests written", color: "#8B5CF6" },
            { num: "100", label: "Lighthouse score", color: "#34d399" },
            { num: "0", label: "Templates used", color: "#06B6D4" },
          ].map((s, i) => (
            <div key={s.label} className={`glass-card p-5 flex items-center gap-5 ${isVisible ? "reveal visible" : "reveal"}`} style={{ transitionDelay: `${0.2 + i * 0.1}s` }}>
              <div className="text-3xl font-black min-w-[60px] text-right" style={{ color: s.color }}>{s.num}</div>
              <div className="text-sm text-white/40">{s.label}</div>
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
        <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-6">Contact</span>
        <div className={isVisible ? "reveal visible" : "reveal"}>
          <h2 className="t-hero mb-8">
            <SplitReveal text="Let's" /><br />
            <span className="gradient-text"><SplitReveal text="talk" delay={200} /></span>
          </h2>
        </div>
        <p className="text-white/35 mb-12 max-w-md mx-auto text-lg">Open to freelance, remote positions, and collaborations.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease 0.4s" }}>
          <MagneticBtn href="mailto:jewel@example.com" className="glass-btn px-10 py-4 inline-flex items-center justify-center text-white font-semibold">Email Me</MagneticBtn>
          <MagneticBtn href="https://github.com/jewelcruzs0922-dev" className="glass-ghost px-10 py-4 text-sm font-semibold text-white/60 inline-flex items-center justify-center">GitHub</MagneticBtn>
          <MagneticBtn href="https://linkedin.com" className="glass-ghost px-10 py-4 text-sm font-semibold text-white/60 inline-flex items-center justify-center">LinkedIn</MagneticBtn>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-12 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="t-small text-white/25">&copy; 2026 Jewel Cruz</p>
        <div className="flex gap-3">
          <span className="glass-sm px-3 py-1 text-[9px] font-bold tracking-wider text-[#8B5CF6] rounded-full">100 Lighthouse</span>
          <span className="glass-sm px-3 py-1 text-[9px] font-bold tracking-wider text-[#06B6D4] rounded-full">100+ Tests</span>
        </div>
        <p className="t-micro text-white/20">Hand-coded. No templates.</p>
      </div>
    </footer>
  );
}

/* ── Scroll progress ── */
function ScrollProgress() {
  const p = useScrollProgress();
  return <div className="fixed top-0 left-0 h-[2px] z-[60] transition-all duration-150" style={{ width: `${p * 100}%`, background: "linear-gradient(90deg, #8B5CF6, #06B6D4, #F472B6)" }} />;
}

/* ── Main ── */
export default function Home() {
  return (
    <>
      <div className="aurora"><div className="aurora-extra" /></div>
      <div className="grid-bg" />
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <Services />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
