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

function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    addEventListener("mousemove", h, { passive: true });
    return () => removeEventListener("mousemove", h);
  }, []);
  return { ...pos, mounted };
}

/* ── Components ── */
function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const { ref, isVisible } = useInView();
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block" style={{
          opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(110%)",
          transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.035}s`,
        }}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </span>
  );
}

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

/* ── Browser mockup frame ── */
function BrowserMockup({ url, accent, children }: { url: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="glass-heavy overflow-hidden rounded-2xl group">
      {/* Chrome bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="glass-subtle px-4 py-1 rounded-lg text-[11px] text-white/40 font-mono max-w-[200px] truncate">{url}</div>
        </div>
        <div className="w-10" />
      </div>
      {/* Content */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {children}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="glass-pill flex items-center justify-between px-6 lg:px-8 py-3">
          <a href="#home" className="text-lg font-black tracking-tight text-white">J<span className="text-[#8b5cf6]">.</span>C</a>
          <div className="hidden sm:flex gap-1">
            {["Work", "Services", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/[0.06]">{item}</a>
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
  const mouse = useMouse();
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax orbs that follow mouse */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)",
            left: `calc(10% + ${mouse.mounted ? (mouse.x - window.innerWidth / 2) * 0.02 : 0}px)`,
            top: `calc(10% + ${mouse.mounted ? (mouse.y - window.innerHeight / 2) * 0.02 : 0}px)`,
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            transition: "left 0.8s ease-out, top 0.8s ease-out",
          }} />
        <div className="absolute w-[500px] h-[500px] opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.5), transparent 70%)",
            right: `calc(5% + ${mouse.mounted ? (mouse.x - window.innerWidth / 2) * -0.015 : 0}px)`,
            bottom: `calc(10% + ${mouse.mounted ? (mouse.y - window.innerHeight / 2) * -0.015 : 0}px)`,
            borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
            transition: "right 1s ease-out, bottom 1s ease-out",
          }} />
        <div className="absolute w-[300px] h-[300px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(244,114,182,0.5), transparent 70%)",
            left: `calc(55% + ${mouse.mounted ? (mouse.x - window.innerWidth / 2) * 0.01 : 0}px)`,
            top: `calc(50% + ${mouse.mounted ? (mouse.y - window.innerHeight / 2) * 0.01 : 0}px)`,
            transition: "left 1.2s ease-out, top 1.2s ease-out",
          }} />
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 lg:px-12 relative z-10 py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 glass-pill px-5 py-2.5 mb-10"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-[#34d399]" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-[#34d399] animate-ping" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#34d399] uppercase">Available for work</span>
        </div>

        {/* Giant name */}
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(80px)", transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
          <h1 className="text-[clamp(4rem,12vw,10rem)] font-black leading-[0.82] tracking-[-0.04em]">
            <RevealText text="Jewel" className="block text-white" />
            <RevealText text="Cruz" className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f472b6]" />
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mt-8 max-w-xl" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s" }}>
          <p className="text-xl text-white/50 leading-relaxed">
            <span className="text-white font-semibold">Web designer &amp; developer</span> crafting digital experiences that people remember. Based in the Philippines, building for the world.
          </p>
        </div>

        {/* Tech + CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6 items-start" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s" }}>
          <div className="flex gap-3">
            <MagneticBtn href="#work" className="glass-button px-8 py-4 inline-flex items-center gap-2 text-white font-semibold text-sm">
              See my work
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </MagneticBtn>
            <MagneticBtn href="#contact" className="glass-ghost px-8 py-4 text-sm font-semibold text-white/70 inline-flex items-center">Get in touch</MagneticBtn>
          </div>
          <div className="flex gap-2 items-center text-white/30 text-xs font-mono">
            <span className="glass-subtle px-3 py-1.5 rounded-lg">Next.js</span>
            <span className="glass-subtle px-3 py-1.5 rounded-lg">React</span>
            <span className="glass-subtle px-3 py-1.5 rounded-lg">TypeScript</span>
            <span className="glass-subtle px-3 py-1.5 rounded-lg">Figma</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Project Showcase — Full-bleed editorial spreads ── */
function ProjectShowcase() {
  const { ref: r1, isVisible: v1 } = useInView(0.05);
  const { ref: r2, isVisible: v2 } = useInView(0.05);

  const projects = [
    {
      title: "Redwood Retreats", tag: "Luxury Cabin Rental Platform",
      desc: "An immersive cabin rental experience with canvas-rendered grass that sways in the wind, PS5-style particle effects, 3D tilt cards, and a dynamic booking system with real-time pricing.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest", "Tailwind"],
      stats: ["41 Tests", "100 Lighthouse", "91 Accessibility"],
      live: "https://redwood-retreats.vercel.app",
      code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      accent: "#e8913a",
      gradient: "from-[#e8913a] via-[#c0651a] to-[#1a0f05]",
      mockBg: "linear-gradient(135deg, #1a0f05 0%, #2d1810 30%, #e8913a20 60%, #1a0f05 100%)",
      url: "redwood-retreats.vercel.app",
    },
    {
      title: "Cosmic Ray Solar", tag: "Full-Stack Solar Company",
      desc: "A complete solar company platform with Stripe payment integration, Sanity CMS for content management, appointment scheduling, and a real-time savings calculator.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright", "Tailwind"],
      stats: ["59 Tests", "35 Pages", "5 API Routes"],
      live: "https://cosmicray-solar.netlify.app",
      code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      accent: "#6c5ce7",
      gradient: "from-[#6c5ce7] via-[#4834d4] to-[#0a0520]",
      mockBg: "linear-gradient(135deg, #0a0520 0%, #1a1040 30%, #6c5ce720 60%, #0a0520 100%)",
      url: "cosmicray-solar.netlify.app",
    },
  ];

  return (
    <section id="work" className="py-20">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-20">
        <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-4">Selected Work</span>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight">
          <RevealText text="Projects that" /><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]"><RevealText text="speak louder" /></span>
        </h2>
      </div>

      {/* Project 1 */}
      <div ref={r1} className={`mb-32 transition-all duration-1000 ${v1 ? "opacity-100" : "opacity-0"}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div className={`transition-all duration-1000 delay-200 ${v1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: projects[0].accent }}>{projects[0].tag}</span>
              <h3 className="text-4xl lg:text-5xl font-black text-white mb-4">{projects[0].title}</h3>
              <p className="text-white/40 leading-relaxed mb-6 max-w-md">{projects[0].desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {projects[0].tech.map((t) => <span key={t} className="glass-subtle px-3 py-1.5 text-xs font-medium text-white/60 rounded-xl">{t}</span>)}
              </div>
              <div className="flex gap-3 mb-8">
                {projects[0].stats.map((s) => (
                  <span key={s} className="glass-subtle px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-lg" style={{ color: projects[0].accent }}>{s}</span>
                ))}
              </div>
              <div className="flex gap-4">
                <MagneticBtn href={projects[0].live} className="glass-button px-8 py-3 text-sm inline-flex items-center gap-2 text-white font-semibold">
                  Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </MagneticBtn>
                <MagneticBtn href={projects[0].code} className="glass-ghost px-8 py-3 text-sm font-semibold text-white/70 inline-flex items-center">Source Code</MagneticBtn>
              </div>
            </div>
            {/* Mockup */}
            <div className={`transition-all duration-1000 delay-400 ${v1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <BrowserMockup url={projects[0].url} accent={projects[0].accent}>
                <div className="w-full h-full flex flex-col items-center justify-center p-8" style={{ background: projects[0].mockBg }}>
                  {/* Simulated site layout */}
                  <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded" style={{ background: projects[0].accent }} />
                      <div className="h-2 w-20 rounded-full bg-white/20" />
                    </div>
                    <div className="h-24 rounded-xl mb-3" style={{ background: `linear-gradient(135deg, ${projects[0].accent}30, ${projects[0].accent}10)` }} />
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-white/5" />)}
                    </div>
                    <div className="h-2 w-32 rounded-full bg-white/10 mb-2" />
                    <div className="h-2 w-48 rounded-full bg-white/5" />
                  </div>
                </div>
              </BrowserMockup>
            </div>
          </div>
        </div>
      </div>

      {/* Project 2 — reversed */}
      <div ref={r2} className={`transition-all duration-1000 ${v2 ? "opacity-100" : "opacity-0"}`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Mockup (left) */}
            <div className={`transition-all duration-1000 delay-200 ${v2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
              <BrowserMockup url={projects[1].url} accent={projects[1].accent}>
                <div className="w-full h-full flex flex-col items-center justify-center p-8" style={{ background: projects[1].mockBg }}>
                  <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded" style={{ background: projects[1].accent }} />
                      <div className="h-2 w-24 rounded-full bg-white/20" />
                    </div>
                    <div className="h-20 rounded-xl mb-3" style={{ background: `linear-gradient(135deg, ${projects[1].accent}30, ${projects[1].accent}10)` }} />
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[1,2].map(i => <div key={i} className="h-20 rounded-lg bg-white/5" />)}
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded-lg" style={{ background: `${projects[1].accent}30` }} />
                      <div className="h-8 w-20 rounded-lg bg-white/5" />
                    </div>
                  </div>
                </div>
              </BrowserMockup>
            </div>
            {/* Text (right) */}
            <div className={`transition-all duration-1000 delay-400 ${v2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: projects[1].accent }}>{projects[1].tag}</span>
              <h3 className="text-4xl lg:text-5xl font-black text-white mb-4">{projects[1].title}</h3>
              <p className="text-white/40 leading-relaxed mb-6 max-w-md">{projects[1].desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {projects[1].tech.map((t) => <span key={t} className="glass-subtle px-3 py-1.5 text-xs font-medium text-white/60 rounded-xl">{t}</span>)}
              </div>
              <div className="flex gap-3 mb-8">
                {projects[1].stats.map((s) => (
                  <span key={s} className="glass-subtle px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-lg" style={{ color: projects[1].accent }}>{s}</span>
                ))}
              </div>
              <div className="flex gap-4">
                <MagneticBtn href={projects[1].live} className="glass-button px-8 py-3 text-sm inline-flex items-center gap-2 text-white font-semibold">
                  Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </MagneticBtn>
                <MagneticBtn href={projects[1].code} className="glass-ghost px-8 py-3 text-sm font-semibold text-white/70 inline-flex items-center">Source Code</MagneticBtn>
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
    { title: "UI/UX Design", desc: "User-centered interfaces from research to prototype. Every pixel placed with intention.", color: "#8b5cf6", icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" },
    { title: "Web Development", desc: "Full-stack Next.js apps. Performance-first, tested, accessible, production-ready.", color: "#06b6d4", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" },
    { title: "Brand Identity", desc: "Logos, color systems, typography. A design language that makes you unforgettable.", color: "#f472b6", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" },
    { title: "Performance & SEO", desc: "Lighthouse 100s, Core Web Vitals, structured data. Fast loads, high rankings.", color: "#34d399", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  ];
  return (
    <section id="services" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-16">
            <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-4">Services</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white"><RevealText text="What I do" /></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <div key={s.title} className="glass-card p-7 group hover:bg-white/[0.08] transition-all duration-500 cursor-default"
                style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s` }}>
                <div className="w-11 h-11 flex items-center justify-center rounded-xl mb-5" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={s.color} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/35 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Skills ── */
function Skills() {
  const { ref, isVisible } = useInView();
  const skills = [
    { name: "React / Next.js", pct: 95, color: "#8b5cf6" },
    { name: "TypeScript", pct: 90, color: "#06b6d4" },
    { name: "Tailwind CSS", pct: 95, color: "#06b6d4" },
    { name: "UI/UX Design", pct: 88, color: "#f472b6" },
    { name: "Node.js", pct: 75, color: "#34d399" },
    { name: "Testing", pct: 85, color: "#8b5cf6" },
  ];
  return (
    <section id="skills" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-16">
            <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-4">Skills</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white"><RevealText text="Tech stack" /></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((s) => (
              <div key={s.name} className="glass-card p-6 hover:bg-white/[0.08] transition-all duration-300">
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
            {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y", "Sanity CMS", "Stripe"].map((t) => (
              <span key={t} className="glass-pill px-4 py-2 text-xs font-medium text-white/35 hover:text-white/70 hover:bg-white/[0.06] transition-all cursor-default">{t}</span>
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
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left — big quote */}
            <div className="lg:col-span-3">
              <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-6">About</span>
              <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
                I don&apos;t just build websites.<br />
                I craft <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">digital experiences</span> that people remember.
              </blockquote>
              <p className="mt-8 text-white/40 text-lg leading-relaxed max-w-2xl">
                Every project starts with a question: <span className="text-white/70 font-medium">&ldquo;How do I make this feel alive?&rdquo;</span> From luxury cabin rental platforms to solar company dashboards, I pour soul into every interaction, every animation, every pixel. Based in the Philippines, building for the world.
              </p>
            </div>
            {/* Right — stats */}
            <div className="lg:col-span-2 flex flex-col gap-4 justify-center">
              {[
                { num: "2+", label: "Years building for the web", color: "#e8913a" },
                { num: "100+", label: "Tests across all projects", color: "#8b5cf6" },
                { num: "100", label: "Lighthouse perf. score", color: "#34d399" },
                { num: "0", label: "Templates used", color: "#06b6d4" },
              ].map((s, i) => (
                <div key={s.label} className="glass-card p-5 flex items-center gap-5"
                  style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : "translateX(30px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s` }}>
                  <div className="text-3xl font-black min-w-[60px] text-right" style={{ color: s.color }}>{s.num}</div>
                  <div className="text-sm text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
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
      <div className="max-w-4xl mx-auto text-center">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-6">Contact</span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
            Let&apos;s build<br />
            something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">beautiful</span>
          </h2>
          <p className="text-white/35 mb-12 max-w-md mx-auto text-lg">Open to freelance projects, remote positions, and collaborations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticBtn href="mailto:jewel@example.com" className="glass-button px-10 py-4 inline-flex items-center justify-center text-white font-semibold">Email Me</MagneticBtn>
            <MagneticBtn href="https://github.com/jewelcruzs0922-dev" className="glass-ghost px-10 py-4 text-sm font-semibold text-white/70 inline-flex items-center justify-center">GitHub</MagneticBtn>
            <MagneticBtn href="https://linkedin.com" className="glass-ghost px-10 py-4 text-sm font-semibold text-white/70 inline-flex items-center justify-center">LinkedIn</MagneticBtn>
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
        <div className="glass-pill px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/25">
          <p>&copy; 2026 Jewel Cruz</p>
          <div className="flex gap-3">
            <span className="glass-subtle px-3 py-1 text-[10px] font-bold tracking-wider text-[#8b5cf6] rounded-full">100 Lighthouse</span>
            <span className="glass-subtle px-3 py-1 text-[10px] font-bold tracking-wider text-[#06b6d4] rounded-full">100+ Tests</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <div className="aurora-backdrop"><div className="aurora-accent" /></div>
      <div className="grid-pattern" />
      <div className="relative z-10">
        <Nav />
        <Hero />
        <ProjectShowcase />
        <Services />
        <Skills />
        <About />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
