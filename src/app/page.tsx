"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ── Hooks ── */
function useInView(t = 0.1) {
  const [r, setR] = useState<HTMLElement | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!r) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(e.target); } }, { threshold: t });
    o.observe(r); return () => o.disconnect();
  }, [r, t]);
  return { ref: setR, isVisible: v };
}

/* ── Components ── */
function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const { ref, isVisible } = useInView();
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block" style={{
          opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s`,
        }}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </span>
  );
}

function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-[1px] bg-gradient-to-br from-[#6c5ce7]/20 via-[#a29bfe]/10 to-[#6c5ce7]/20 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-md" style={{ borderRadius: "32px 8px 32px 8px" }} />
      <div className="relative neu-raised">{children}</div>
    </div>
  );
}

function MagneticBtn({ children, className = "", href = "#" }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.12}px)`;
  }, []);
  const leave = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  return <a ref={ref} href={href} className={className} onMouseMove={move} onMouseLeave={leave} style={{ transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}>{children}</a>;
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const h = () => {
      setScrolled(scrollY > 50);
      for (const id of ["contact", "about", "skills", "work", "home"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) { setActive(id); break; }
      }
    };
    addEventListener("scroll", h, { passive: true }); return () => removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "py-3" : "py-6"}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="neu-pill flex items-center justify-between px-6 lg:px-8 py-3">
          <a href="#home" className="text-lg font-black text-[#2d3436] tracking-tight">J<span className="text-[#6c5ce7]">.</span>C</a>
          <div className="hidden sm:flex gap-1">
            {["Work", "Skills", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                active === item.toLowerCase() ? "neu-inset text-[#6c5ce7]" : "text-[#636e72] hover:text-[#2d3436]"
              }`} style={{ borderRadius: "10px" }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center px-6 lg:px-12 overflow-hidden">
      {/* Decorative morphing blobs */}
      <div className="absolute top-32 right-0 w-[500px] h-[500px] opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #6c5ce7, transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "morphBlob 12s ease-in-out infinite" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(circle, #a29bfe, transparent 70%)", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", animation: "morphBlob 15s ease-in-out infinite reverse" }} />

      <div className="mx-auto max-w-7xl w-full relative z-10">
        <div className="max-w-3xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 neu-pill px-4 py-2 mb-8"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
            <div className="neu-circle-inset w-5 h-5 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00b894] animate-pulse" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#00b894] uppercase">Available for hire</span>
          </div>

          {/* Giant headline */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(60px)", transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] tracking-tighter text-[#2d3436]">
              <RevealText text="Jewel" className="block" />
              <RevealText text="Cruz" className="block text-[#6c5ce7]" />
            </h1>
          </div>

          <p className="mt-8 text-xl text-[#636e72] max-w-lg leading-relaxed"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s" }}>
            <span className="text-[#2d3436] font-semibold">Frontend developer &amp; designer</span> building production-grade web applications with emotion and precision.
          </p>

          {/* Tech stack */}
          <div className="mt-8 flex flex-wrap gap-2" style={{ opacity: loaded ? 1 : 0, transition: "all 0.8s ease 0.9s" }}>
            {["Next.js", "React", "TypeScript", "Tailwind", "Figma"].map((t, i) => (
              <span key={t} className="neu-pill px-4 py-2 text-xs font-semibold text-[#636e72] hover:text-[#6c5ce7] transition-all cursor-default"
                style={{ opacity: loaded ? 1 : 0, transition: `all 0.6s ease ${1 + i * 0.08}s` }}>{t}</span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex gap-4 flex-wrap" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s" }}>
            <MagneticBtn href="#work" className="neu-button px-10 py-4 inline-flex items-center gap-2">
              <span>View Work</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </MagneticBtn>
            <MagneticBtn href="#contact" className="neu-pill px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center hover:scale-105 transition-transform">Let&apos;s Talk</MagneticBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Work — Horizontal scroll cards ── */
function Work() {
  const { ref, isVisible } = useInView(0.05);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const projects = [
    {
      title: "Redwood Retreats", tag: "Luxury Rental Platform",
      desc: "Canvas grass animation with wind physics, PS5-style particles, 3D tilt cards, and a booking system. Lighthouse 100/91/100.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest"],
      live: "https://redwood-retreats.vercel.app", code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      stats: "41 tests · 100 perf · 91 a11y",
      accent: "#e8913a",
    },
    {
      title: "Cosmic Ray Solar", tag: "Full-Stack Solar Company",
      desc: "Stripe checkout, Sanity CMS, scheduling, savings calculator. 59 tests, 35 pages, 5 API routes.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      live: "https://cosmicray-solar.netlify.app", code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: "59 tests · 35 pages · 5 APIs",
      accent: "#6c5ce7",
    },
  ];
  const scrollTo = useCallback((i: number) => {
    if (!scrollRef.current) return;
    const c = scrollRef.current.children[i] as HTMLElement;
    if (c) { c.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); setActive(i); }
  }, []);

  return (
    <section id="work" className="py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="neu-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#6c5ce7] uppercase mb-4">Portfolio</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2d3436]"><RevealText text="Selected work" /></h2>
          </div>
          <div className="hidden sm:flex gap-2">
            {projects.map((_, i) => (
              <button key={i} onClick={() => scrollTo(i)} className={`transition-all duration-500 ${active === i ? "neu-inset w-12 h-2" : "neu-flat w-2 h-2 hover:scale-150"}`} style={{ borderRadius: "50px" }} />
            ))}
          </div>
        </div>
      </div>
      <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div ref={scrollRef} className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 lg:px-12 pb-8 scrollbar-hide">
          {projects.map((p) => (
            <div key={p.title} className="flex-shrink-0 w-[90vw] sm:w-[75vw] lg:w-[55vw] snap-center">
              <GlowCard>
                <div className="p-8 lg:p-10 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#636e72] uppercase">{p.tag}</span>
                      <h3 className="text-3xl lg:text-4xl font-black text-[#2d3436] mt-2">{p.title}</h3>
                    </div>
                    <div className="neu-circle-inset w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full" style={{ background: p.accent }} />
                    </div>
                  </div>
                  <p className="text-[#636e72] leading-relaxed mb-6 max-w-lg">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tech.map((t) => <span key={t} className="neu-pill px-3 py-1.5 text-xs font-medium text-[#2d3436]">{t}</span>)}
                  </div>
                  <div className="neu-inset px-4 py-2 inline-block mb-8">
                    <span className="text-xs font-semibold text-[#6c5ce7]">{p.stats}</span>
                  </div>
                  <div className="flex gap-4">
                    <MagneticBtn href={p.live} className="neu-button px-8 py-3 text-sm inline-flex items-center gap-2">
                      Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </MagneticBtn>
                    <MagneticBtn href={p.code} className="neu-pill px-8 py-3 text-sm font-semibold text-[#2d3436] inline-flex items-center hover:scale-105 transition-transform">Code</MagneticBtn>
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Skills — Clean grid with progress ── */
function Skills() {
  const { ref, isVisible } = useInView();
  const skills = [
    { name: "React", pct: 90, color: "#61dafb" },
    { name: "Next.js", pct: 95, color: "#6c5ce7" },
    { name: "TypeScript", pct: 85, color: "#3178c6" },
    { name: "Tailwind", pct: 90, color: "#06b6d4" },
    { name: "Node.js", pct: 70, color: "#339933" },
    { name: "Testing", pct: 85, color: "#6c5ce7" },
  ];
  return (
    <section id="skills" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-16">
            <span className="neu-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#6c5ce7] uppercase mb-4">Skills</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2d3436]"><RevealText text="What I know" /></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((s) => (
              <div key={s.name} className="neu-raised p-6 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-[#2d3436]">{s.name}</span>
                  <span className="text-sm font-black" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="neu-inset h-2 overflow-hidden" style={{ borderRadius: "50px" }}>
                  <div className="h-full rounded-full transition-all duration-[1.5s] ease-out" style={{ width: isVisible ? `${s.pct}%` : "0%", background: s.color, borderRadius: "50px" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y"].map((t) => (
              <span key={t} className="neu-pill px-4 py-2 text-xs font-medium text-[#636e72] hover:text-[#6c5ce7] hover:scale-105 transition-all cursor-default">{t}</span>
            ))}
          </div>
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
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-16">
            <span className="neu-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#6c5ce7] uppercase mb-4">About</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2d3436]">
              Code with <span className="text-[#6c5ce7]">soul</span>.
            </h2>
          </div>
          <GlowCard>
            <div className="p-10 lg:p-16">
              <p className="text-xl text-[#636e72] leading-relaxed mb-12 max-w-2xl">
                I&apos;m Jewel Cruz, a frontend developer &amp; designer from the Philippines. I build web applications that are fast, accessible, and beautiful. Every project carries a piece of me.
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { num: "2+", label: "Years building", color: "#e8913a" },
                  { num: "100+", label: "Tests written", color: "#6c5ce7" },
                  { num: "100", label: "Lighthouse score", color: "#00b894" },
                ].map((s) => (
                  <div key={s.label} className="neu-inset p-6 text-center">
                    <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.num}</div>
                    <div className="text-sm text-[#636e72]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>
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
      <div className="max-w-3xl mx-auto text-center">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="neu-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#6c5ce7] uppercase mb-6">Contact</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2d3436] mb-6">Let&apos;s create<br />something great</h2>
          <p className="text-[#636e72] mb-12 max-w-md mx-auto text-lg">Available for freelance projects and remote positions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticBtn href="mailto:jewel@example.com" className="neu-button px-10 py-4 inline-flex items-center justify-center">Email Me</MagneticBtn>
            <MagneticBtn href="https://github.com/jewelcruzs0922-dev" className="neu-pill px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center hover:scale-105 transition-transform">GitHub</MagneticBtn>
            <MagneticBtn href="https://linkedin.com" className="neu-pill px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center hover:scale-105 transition-transform">LinkedIn</MagneticBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="neu-pill px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#636e72]">
          <p>&copy; 2026 Jewel Cruz</p>
          <div className="flex gap-3">
            <span className="neu-inset px-3 py-1 text-[10px] font-bold tracking-wider text-[#6c5ce7]">100 Lighthouse</span>
            <span className="neu-inset px-3 py-1 text-[10px] font-bold tracking-wider text-[#6c5ce7]">100+ Tests</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (<><Nav /><Hero /><Work /><Skills /><About /><Contact /><Footer /></>);
}
