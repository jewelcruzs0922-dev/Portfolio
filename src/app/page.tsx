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

/* ── Magnetic ── */
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
function R({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   LAYOUT: Two-column pinned sidebar
   Left = sticky identity (name, nav, bio)
   Right = scrollable content (work, skills, contact)
   ══════════════════════════════════════════ */

/* ── Sidebar (sticky left) ── */
function Sidebar() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const h = () => {
      for (const id of ["hero", "work", "skills", "contact"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 300) { setActive(id); break; }
      }
    };
    addEventListener("scroll", h, { passive: true }); return () => removeEventListener("scroll", h);
  }, []);

  return (
    <div className="hidden lg:flex flex-col justify-between h-screen sticky top-0 py-12 px-8 w-[340px] flex-shrink-0">
      {/* Top — Identity */}
      <div>
        <a href="#hero" className="inline-block mb-8">
          <div className="glass-pill px-4 py-2 inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #5B9BD5, #7EC8E3)" }}>JC</div>
            <span className="text-sm font-bold text-[#1E3A5F]">Jewel Cruz</span>
          </div>
        </a>

        <div className="glass-pill inline-flex items-center gap-2 px-4 py-2 mb-8">
          <div className="h-1.5 w-1.5 rounded-full bg-[#5B9BD5] animate-pulse" />
          <span className="t-micro text-[#5B9BD5]">Available</span>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { id: "hero", label: "Home" },
            { id: "work", label: "Work" },
            { id: "skills", label: "Skills" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <a key={item.id} href={`#${item.id}`}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                active === item.id
                  ? "glass text-[#1E3A5F]"
                  : "text-[#1E3A5F]/35 hover:text-[#1E3A5F]/60 hover:bg-white/30"
              }`}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom — Links */}
      <div className="flex flex-col gap-2">
        <MagBtn href="https://github.com/jewelcruzs0922-dev" className="text-xs text-[#1E3A5F]/30 hover:text-[#5B9BD5] transition-colors">GitHub</MagBtn>
        <MagBtn href="https://linkedin.com" className="text-xs text-[#1E3A5F]/30 hover:text-[#5B9BD5] transition-colors">LinkedIn</MagBtn>
        <MagBtn href="mailto:jewel@example.com" className="text-xs text-[#1E3A5F]/30 hover:text-[#5B9BD5] transition-colors">Email</MagBtn>
      </div>
    </div>
  );
}

/* ── Mobile nav ── */
function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(!open)} className="fixed top-5 right-6 z-50 glass-pill px-4 py-2.5 flex items-center gap-2" aria-label="Menu">
        <span className={`block w-5 h-[1.5px] bg-[#1E3A5F] transition-all duration-300 ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
        <span className={`block w-5 h-[1.5px] bg-[#1E3A5F] transition-all duration-300 ${open ? "-rotate-45 -translate-y-[1.5px]" : ""}`} />
      </button>
      <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 transition-all duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ background: "rgba(240,247,255,0.95)", backdropFilter: "blur(20px)" }}>
        {["Home", "Work", "Skills", "Contact"].map((item, i) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}
            className="text-2xl font-bold text-[#1E3A5F]/60 hover:text-[#1E3A5F] transition-colors"
            style={{ opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(20px)", transition: `all 0.4s ease ${i * 0.06}s` }}>
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Content sections (right side) ── */

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center px-6 lg:px-12 relative">
      {/* Glowing orbs */}
      <div className="absolute top-[15%] right-[5%] w-[300px] h-[300px] pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, rgba(126,200,227,0.6), transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "float1 12s ease-in-out infinite, pulse 6s ease-in-out infinite" }} />
      <div className="absolute bottom-[20%] right-[25%] w-[200px] h-[200px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, rgba(184,201,232,0.5), transparent 70%)", borderRadius: "50%", animation: "float2 15s ease-in-out infinite, breathe 8s ease-in-out infinite" }} />
      <div className="absolute top-[45%] right-[15%] w-[150px] h-[150px] pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, rgba(91,155,213,0.4), transparent 70%)", borderRadius: "40% 60% 50% 50%", animation: "float3 10s ease-in-out infinite" }} />

      {/* Decorative hexagons */}
      <div className="absolute top-[20%] right-[18%] w-16 h-16 pointer-events-none opacity-[0.07]"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--color-blue)", animation: "float2 20s ease-in-out infinite, spin 30s linear infinite" }} />
      <div className="absolute bottom-[30%] right-[10%] w-10 h-10 pointer-events-none opacity-[0.05]"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--color-cyan)", animation: "float1 16s ease-in-out infinite" }} />

      <div className="w-full max-w-2xl relative z-10">
        {/* Shimmer badge */}
        <div className="glass-pill inline-flex items-center gap-2 px-4 py-2 mb-6 relative overflow-hidden"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(15px)", transition: "all 0.6s ease 0.1s" }}>
          <div className="h-1.5 w-1.5 rounded-full bg-[#5B9BD5] animate-pulse" />
          <span className="t-micro text-[#5B9BD5]">Available for work</span>
          <div className="absolute inset-0 shimmer" />
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black tracking-tight leading-[0.9] text-[#1E3A5F]">
            <SplitReveal text="Jewel" delay={100} /><br />
            <SplitReveal text="Cruz" className="gradient-text" delay={400} />
          </h1>
        </div>

        <div className="mt-8" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(15px)", transition: "all 0.6s ease 0.6s" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5B9BD5] mb-3">Designer &amp; Developer</p>
          <p className="t-body text-[#1E3A5F]/45 max-w-md">
            I turn ideas into interfaces that people actually enjoy using. Based in the Philippines, building for the world.
          </p>
        </div>

        <div className="flex gap-2 mt-8" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.8s" }}>
          {["Next.js", "React", "TypeScript", "Tailwind", "Figma"].map((t, i) => (
            <span key={t} className="glass-subtle px-3 py-1.5 text-[10px] font-semibold text-[#1E3A5F]/35 rounded-lg hover:bg-white/50 hover:text-[#5B9BD5] transition-all cursor-default"
              style={{ opacity: loaded ? 1 : 0, transition: `all 0.5s ease ${0.8 + i * 0.05}s` }}>{t}</span>
          ))}
        </div>

        <div className="mt-10 flex gap-4" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 1s" }}>
          <MagBtn href="#work" className="glass-btn px-7 py-3 text-sm font-semibold text-white inline-flex items-center gap-2">
            See work <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </MagBtn>
          <MagBtn href="#contact" className="glass-ghost px-7 py-3 text-sm font-semibold text-[#1E3A5F]/50">Contact</MagBtn>
        </div>
      </div>
    </section>
  );
}

function WorkSection() {
  const projects = [
    {
      num: "01", title: "Redwood Retreats", tag: "Cabin Rental Platform",
      desc: "A luxury cabin rental platform where the experience starts before you even book. The grass on the homepage is rendered on a real-time canvas that responds to wind. Particles float like fireflies at dusk. Every card tilts in 3D when you hover. The booking system calculates pricing dynamically based on season, guests, and dates.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest", "Tailwind"],
      stats: { tests: "41", perf: "100", a11y: "91" },
      live: "https://redwood-retreats.vercel.app", code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      accent: "#5B9BD5",
    },
    {
      num: "02", title: "Cosmic Ray Solar", tag: "Solar Company Platform",
      desc: "A complete business platform for a solar energy company. Customers can browse plans, calculate savings based on their electricity bill, schedule appointments, and pay through Stripe. Content is managed through Sanity CMS so the client can update plans and pricing without touching code.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright", "Tailwind"],
      stats: { tests: "59", pages: "35", apis: "5" },
      live: "https://cosmicray-solar.netlify.app", code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      accent: "#3A7CC8",
    },
  ];

  return (
    <section id="work" className="py-24 px-6 lg:px-12">
      <R className="mb-12">
        <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#5B9BD5] mb-3">Portfolio</span>
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black tracking-tight text-[#1E3A5F]"><SplitReveal text="Selected work" /></h2>
        <p className="text-sm text-[#1E3A5F]/35 mt-3 max-w-md">Two production apps. Designed, built, tested, deployed. Every line of code written by hand.</p>
      </R>

      <div className="space-y-8">
        {projects.map((p, i) => (
          <R key={p.num} delay={i * 0.15}>
            <div className="glass-strong rounded-2xl overflow-hidden group">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/40">
                <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-[#5B9BD5]/20" /><div className="w-2 h-2 rounded-full bg-[#5B9BD5]/20" /><div className="w-2 h-2 rounded-full bg-[#5B9BD5]/20" /></div>
                <div className="flex-1 flex justify-center"><div className="px-3 py-1 text-[9px] text-[#1E3A5F]/25 font-mono bg-white/40 rounded border border-white/50">{p.live.replace("https://", "")}</div></div>
                <div className="w-6" />
              </div>

              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 aspect-[16/10] lg:aspect-auto relative overflow-hidden" style={{ background: "linear-gradient(135deg, #F5F9FF, #EDF4FC)" }}>
                  <div className="absolute inset-0 flex flex-col p-5 transition-transform duration-700 group-hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: p.accent }} /><div className="h-1.5 w-16 rounded-full bg-[#1E3A5F]/8" /></div>
                      <div className="flex gap-2">{[1,2,3].map(j => <div key={j} className="h-1 w-8 rounded-full bg-[#1E3A5F]/6" />)}</div>
                    </div>
                    <div className="mb-4">
                      <div className="h-3 w-40 rounded bg-[#1E3A5F]/8 mb-2" />
                      <div className="h-2 w-56 rounded bg-[#1E3A5F]/4 mb-1.5" />
                      <div className="h-2 w-40 rounded bg-[#1E3A5F]/3 mb-3" />
                      <div className="h-6 w-20 rounded" style={{ background: p.accent }} />
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {[1,2,3].map(j => <div key={j} className="rounded-lg bg-white/50 border border-white/60 p-2"><div className="h-full rounded" style={{ background: `${p.accent}08` }} /></div>)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-[#1E3A5F]/25">{p.num}</span>
                    <div className="h-[1px] flex-1 bg-[#5B9BD5]/10" />
                    <span className="t-micro" style={{ color: p.accent }}>{p.tag}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#1E3A5F] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#1E3A5F]/40 mb-4 leading-relaxed">{p.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tech.map((t) => <span key={t} className="glass-subtle px-2.5 py-1 text-[9px] font-semibold text-[#1E3A5F]/40 rounded-lg">{t}</span>)}
                  </div>

                  <div className="flex gap-2 mb-5">
                    {Object.entries(p.stats).map(([k, v]) => (
                      <div key={k} className="glass-subtle px-2.5 py-1.5 rounded-lg text-center">
                        <div className="text-sm font-black" style={{ color: p.accent }}>{v}</div>
                        <div className="text-[8px] font-semibold uppercase tracking-wider text-[#1E3A5F]/20">{k}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <MagBtn href={p.live} className="glass-btn px-5 py-2.5 text-xs font-semibold text-white inline-flex items-center gap-1.5">
                      Demo <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                    </MagBtn>
                    <MagBtn href={p.code} className="glass-ghost px-5 py-2.5 text-xs font-semibold text-[#1E3A5F]/40">Code</MagBtn>
                  </div>
                </div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const { ref, isVisible } = useInView();
  const skills = [
    { name: "React / Next.js", pct: 95, color: "#5B9BD5" },
    { name: "TypeScript", pct: 90, color: "#7EC8E3" },
    { name: "Tailwind CSS", pct: 95, color: "#7EC8E3" },
    { name: "UI/UX Design", pct: 88, color: "#B8C9E8" },
    { name: "Node.js", pct: 75, color: "#5B9BD5" },
    { name: "Testing", pct: 85, color: "#3A7CC8" },
  ];
  return (
    <section id="skills" className="py-24 px-6 lg:px-12">
      <R className="mb-12">
        <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#5B9BD5] mb-3">Skills</span>
        <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black tracking-tight text-[#1E3A5F]"><SplitReveal text="Tech stack" /></h2>
      </R>

      <div ref={ref} className="grid sm:grid-cols-2 gap-3">
        {skills.map((s) => (
          <div key={s.name} className="glass p-5 hover:bg-white/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#1E3A5F]">{s.name}</span>
              <span className="text-sm font-black" style={{ color: s.color }}>{s.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/40 overflow-hidden rounded-full">
              <div className="h-full rounded-full transition-all duration-[1.5s] ease-out" style={{ width: isVisible ? `${s.pct}%` : "0%", background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y", "Sanity", "Stripe"].map((t) => (
          <span key={t} className="glass-subtle px-3 py-1.5 text-[10px] font-medium text-[#1E3A5F]/30 hover:text-[#5B9BD5] hover:bg-white/50 transition-all cursor-default rounded-xl">{t}</span>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  const { ref, isVisible } = useInView();
  return (
    <section className="py-24 px-6 lg:px-12">
      <R className="mb-8">
        <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#5B9BD5] mb-3">About</span>
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-[#1E3A5F]">I craft <span className="gradient-text">experiences</span>.</h2>
      </R>

      <div ref={ref} className="grid sm:grid-cols-2 gap-3">
        <div className="glass-strong p-6 rounded-2xl" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }}>
          <p className="text-sm text-[#1E3A5F]/50 leading-relaxed mb-3">
            I&apos;m Jewel Cruz, a web designer and frontend developer from the Philippines. I don&apos;t just build websites — I build experiences. Every project starts with a question: how do I make this feel alive?
          </p>
          <p className="text-sm text-[#1E3A5F]/50 leading-relaxed mb-3">
            Over the past two years, I&apos;ve shipped a luxury rental platform with real-time canvas animations, a full-stack solar company with Stripe payments and CMS integration, and this portfolio you&apos;re looking at right now.
          </p>
          <p className="text-sm text-[#1E3A5F]/35 leading-relaxed">
            I believe great web design is invisible — users shouldn&apos;t notice it, they should just find what they need, fast. That&apos;s what I build.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
          {[
            { num: "2+", label: "Years building", color: "#5B9BD5" },
            { num: "100+", label: "Tests written", color: "#7EC8E3" },
            { num: "100", label: "Lighthouse score", color: "#5B9BD5" },
            { num: "0", label: "Templates used", color: "#3A7CC8" },
          ].map((s) => (
            <div key={s.label} className="glass p-4 text-center">
              <div className="text-xl font-black" style={{ color: s.color }}>{s.num}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3A5F]/25 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { ref, isVisible } = useInView();
  return (
    <section id="contact" className="py-24 px-6 lg:px-12">
      <div ref={ref}>
        <R className="mb-8">
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#5B9BD5] mb-3">Contact</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight text-[#1E3A5F]">
            <SplitReveal text="Let's" /><br />
            <span className="gradient-text"><SplitReveal text="work" delay={200} /></span> <SplitReveal text="together" delay={400} />
          </h2>
          <p className="text-sm text-[#1E3A5F]/35 mt-4 max-w-md">I&apos;m open to freelance projects, full-time remote positions, and interesting collaborations. If you have an idea that needs building, let&apos;s talk.</p>
        </R>

        <div className="grid sm:grid-cols-3 gap-3" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
          <MagBtn href="mailto:jewel@example.com" className="glass-strong p-6 rounded-2xl text-left hover:bg-white/70 transition-all group">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5B9BD5] mb-2">Email</div>
            <div className="text-sm font-bold text-[#1E3A5F] group-hover:text-[#5B9BD5] transition-colors">jewel@example.com</div>
            <p className="text-[11px] text-[#1E3A5F]/25 mt-2">Best way to reach me. I reply within 24 hours.</p>
          </MagBtn>
          <MagBtn href="https://github.com/jewelcruzs0922-dev" className="glass-strong p-6 rounded-2xl text-left hover:bg-white/70 transition-all group">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5B9BD5] mb-2">GitHub</div>
            <div className="text-sm font-bold text-[#1E3A5F] group-hover:text-[#5B9BD5] transition-colors">jewelcruzs0922-dev</div>
            <p className="text-[11px] text-[#1E3A5F]/25 mt-2">All my code is open source. See how I work.</p>
          </MagBtn>
          <MagBtn href="https://linkedin.com" className="glass-strong p-6 rounded-2xl text-left hover:bg-white/70 transition-all group">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5B9BD5] mb-2">LinkedIn</div>
            <div className="text-sm font-bold text-[#1E3A5F] group-hover:text-[#5B9BD5] transition-colors">Jewel Cruz</div>
            <p className="text-[11px] text-[#1E3A5F]/25 mt-2">Connect with me professionally.</p>
          </MagBtn>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 lg:px-12 border-t border-[#5B9BD5]/10">
      <div className="flex flex-col items-center gap-4">
        <div className="glass-pill px-5 py-2.5 inline-flex items-center gap-2">
          <span className="text-sm font-bold text-[#1E3A5F]">J</span>
          <span className="text-[#5B9BD5]">.</span>
          <span className="text-sm font-bold text-[#1E3A5F]">C</span>
        </div>
        <p className="text-[11px] text-[#1E3A5F]/30 text-center max-w-xs">
          Designed &amp; built by Jewel Cruz. Every pixel, every line of code — mine.
        </p>
        <div className="flex gap-4">
          <MagBtn href="https://github.com/jewelcruzs0922-dev" className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3A5F]/20 hover:text-[#5B9BD5] transition-colors">GitHub</MagBtn>
          <MagBtn href="https://linkedin.com" className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3A5F]/20 hover:text-[#5B9BD5] transition-colors">LinkedIn</MagBtn>
          <MagBtn href="mailto:jewel@example.com" className="text-[10px] font-semibold uppercase tracking-wider text-[#1E3A5F]/20 hover:text-[#5B9BD5] transition-colors">Email</MagBtn>
        </div>
      </div>
    </footer>
  );
}

/* ── Floating particles ── */
function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 5,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 15,
      color: ["rgba(91,155,213,0.3)", "rgba(126,200,227,0.3)", "rgba(184,201,232,0.3)", "rgba(255,255,255,0.5)"][Math.floor(Math.random() * 4)],
    }))
  );
  return (
    <div className="particles">
      {particles.map((p) => (
        <div key={p.id} className="particle" style={{
          left: p.left, width: p.size, height: p.size, background: p.color,
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

/* ── Floating shapes (decorative) ── */
function FloatingShapes() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Large orbs */}
      <div className="absolute w-[500px] h-[500px] opacity-20"
        style={{ top: "5%", right: "-5%", background: "radial-gradient(circle, rgba(126,200,227,0.5), transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "float1 18s ease-in-out infinite" }} />
      <div className="absolute w-[400px] h-[400px] opacity-15"
        style={{ bottom: "10%", left: "-3%", background: "radial-gradient(circle, rgba(184,201,232,0.5), transparent 70%)", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", animation: "float2 22s ease-in-out infinite" }} />
      <div className="absolute w-[300px] h-[300px] opacity-10"
        style={{ top: "40%", left: "30%", background: "radial-gradient(circle, rgba(91,155,213,0.4), transparent 70%)", borderRadius: "50%", animation: "float3 15s ease-in-out infinite" }} />

      {/* Hexagons */}
      <div className="absolute w-20 h-20 opacity-[0.06]"
        style={{ top: "15%", right: "12%", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--color-blue)", animation: "float2 20s ease-in-out infinite" }} />
      <div className="absolute w-12 h-12 opacity-[0.04]"
        style={{ top: "55%", right: "8%", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--color-cyan)", animation: "float1 16s ease-in-out infinite" }} />
      <div className="absolute w-16 h-16 opacity-[0.05]"
        style={{ bottom: "20%", right: "20%", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--color-lavender)", animation: "float3 24s ease-in-out infinite" }} />

      {/* Circles */}
      <div className="absolute w-6 h-6 rounded-full opacity-[0.08] border border-[#5B9BD5]/20"
        style={{ top: "30%", left: "15%", animation: "float1 12s ease-in-out infinite" }} />
      <div className="absolute w-4 h-4 rounded-full opacity-[0.06] border border-[#7EC8E3]/20"
        style={{ top: "65%", left: "60%", animation: "float2 14s ease-in-out infinite" }} />
      <div className="absolute w-8 h-8 rounded-full opacity-[0.05] border border-[#B8C9E8]/20"
        style={{ bottom: "35%", left: "40%", animation: "float3 18s ease-in-out infinite" }} />
    </div>
  );
}

/* ── Main ── */
export default function Home() {
  return (
    <>
      <div className="sky-backdrop" />
      <div className="grid-bg" />
      <FloatingShapes />
      <Particles />
      <MobileNav />
      <div className="relative z-10 flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <HeroSection />
          <WorkSection />
          <SkillsSection />
          <AboutSection />
          <ContactSection />
          <Footer />
        </main>
      </div>
    </>
  );
}
