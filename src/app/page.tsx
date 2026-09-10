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

/* ── Reveal wrapper ── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
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
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="glass-pill flex items-center justify-between px-6 lg:px-8 py-3">
          <a href="#home" className="text-sm font-bold tracking-tight text-white">J<span className="text-[#8B5CF6]">.</span>C</a>
          <div className="hidden sm:flex gap-1">
            {["Work", "About", "Process", "Contact"].map((item) => (
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
      {/* Orbs */}
      <div className="absolute top-10 right-[5%] w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "drift1 14s ease-in-out infinite" }} />
      <div className="absolute bottom-[10%] left-[0%] w-[550px] h-[550px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(6,182,212,0.15) 40%, transparent 70%)", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", animation: "drift2 17s ease-in-out infinite" }} />
      <div className="absolute top-[40%] left-[35%] w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.5) 0%, rgba(244,114,182,0.1) 40%, transparent 70%)", borderRadius: "40% 60% 50% 50% / 60% 40% 60% 40%", animation: "drift3 12s ease-in-out infinite" }} />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="glass-pill inline-flex items-center gap-3 px-5 py-2.5 mb-10"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
          <div className="relative"><div className="h-2 w-2 rounded-full bg-[#34d399]" /><div className="absolute inset-0 h-2 w-2 rounded-full bg-[#34d399] animate-ping" /></div>
          <span className="t-micro text-[#34d399]">Available for hire</span>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
          <h1 className="t-hero max-w-5xl">
            <SplitReveal text="I design &" delay={200} /><br />
            <SplitReveal text="build" className="gradient-text" delay={500} /> <SplitReveal text="web" delay={650} /><br />
            <SplitReveal text="experiences" delay={800} />
          </h1>
        </div>

        <div className="mt-10 max-w-xl" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.9s" }}>
          <p className="t-body text-white/45">
            Hi, I&apos;m <span className="text-white font-semibold">Jewel Cruz</span> — a web designer &amp; frontend developer from the Philippines. I turn ideas into fast, beautiful, production-ready websites that people actually enjoy using.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.1s" }}>
          <MagneticBtn href="#work" className="glass-btn px-8 py-3.5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            See my work
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </MagneticBtn>
          <MagneticBtn href="#contact" className="glass-ghost px-8 py-3.5 text-sm font-semibold text-white/60 inline-flex items-center">Get in touch</MagneticBtn>
        </div>

        <div className="flex gap-2 mt-8" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 1.3s" }}>
          {["Next.js", "React", "TypeScript", "Tailwind", "Figma", "Node.js"].map((t, i) => (
            <span key={t} className="glass-sm px-3 py-1.5 text-[10px] font-semibold text-white/35 rounded-lg hover:text-white/70 hover:bg-white/[0.06] transition-all cursor-default"
              style={{ opacity: loaded ? 1 : 0, transition: `all 0.5s ease ${1.3 + i * 0.06}s` }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  const items = ["Redwood Retreats", "\u2014", "Cosmic Ray Solar", "\u2014", "Canvas Animations", "\u2014", "Stripe Payments", "\u2014", "Lighthouse 100", "\u2014", "100+ Tests", "\u2014", "Sanity CMS", "\u2014", "Responsive Design", "\u2014"];
  return (
    <div className="py-6 border-y border-white/[0.06] overflow-hidden">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 text-[clamp(1rem,2.5vw,2rem)] font-bold tracking-tight text-white/15 hover:text-white/40 transition-colors duration-500">{item}</span>
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
      num: "01", title: "Redwood Retreats", tag: "Luxury Cabin Rental Platform",
      desc: "An immersive cabin rental experience built from scratch. Canvas-rendered grass that sways in the wind, PS5-style particle effects, 3D tilt cards, and a dynamic booking system with real-time pricing.",
      highlights: ["Canvas grass with wind physics", "PS5-style particle system", "3D tilt hover effects", "Dynamic booking & pricing", "Lighthouse 100 performance"],
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest", "Tailwind"],
      stats: { tests: "41", perf: "100", a11y: "91" },
      live: "https://redwood-retreats.vercel.app", code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      accent: "#E8913A",
    },
    {
      num: "02", title: "Cosmic Ray Solar", tag: "Full-Stack Solar Company",
      desc: "A complete business platform for a solar energy company. Stripe payment integration, Sanity CMS for content management, appointment scheduling, and a real-time savings calculator.",
      highlights: ["Stripe checkout & payments", "Sanity CMS integration", "Appointment scheduling", "Savings calculator", "5 API routes"],
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright", "Tailwind"],
      stats: { tests: "59", pages: "35", apis: "5" },
      live: "https://cosmicray-solar.netlify.app", code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      accent: "#6B8DD6",
    },
  ];

  return (
    <section id="work" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-20">
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">Portfolio</span>
          <h2 className="t-display"><SplitReveal text="Selected work" /></h2>
          <p className="t-body text-white/35 mt-4 max-w-lg">Two production applications I designed, built, and shipped. Every line of code written by hand.</p>
        </Reveal>

        {projects.map((p, idx) => {
          const isVisible = idx === 0 ? v1 : v2;
          const ref = idx === 0 ? r1 : r2;
          const isReversed = idx === 1;
          return (
            <div key={p.num} ref={ref} className={`mb-32 ${idx === projects.length - 1 ? "" : ""}`}>
              <div className={`grid lg:grid-cols-2 gap-10 items-start ${isVisible ? "opacity-100" : "opacity-0"} transition-all duration-700`}>
                {/* Text */}
                <div className={`${isReversed ? "lg:order-2" : ""}`} style={{ transitionDelay: "0.1s" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-white/30">{p.num}</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <span className="t-micro" style={{ color: p.accent }}>{p.tag}</span>
                  </div>
                  <h3 className="t-display mb-5">{p.title}</h3>
                  <p className="t-body text-white/40 mb-6 max-w-md">{p.desc}</p>

                  {/* Highlights */}
                  <div className="mb-6">
                    <span className="t-micro text-white/25 block mb-3">Key features</span>
                    <ul className="space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-white/50">
                          <div className="w-1 h-1 rounded-full" style={{ background: p.accent }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tech.map((t) => <span key={t} className="glass-sm px-3 py-1.5 text-[10px] font-semibold text-white/50 rounded-xl">{t}</span>)}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 mb-8">
                    {Object.entries(p.stats).map(([k, v]) => (
                      <div key={k} className="glass-sm px-3 py-2 rounded-xl text-center">
                        <div className="text-lg font-black" style={{ color: p.accent }}>{v}</div>
                        <div className="t-micro text-white/25">{k}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <MagneticBtn href={p.live} className="glass-btn px-7 py-3 text-sm inline-flex items-center gap-2 text-white font-semibold">
                      Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                    </MagneticBtn>
                    <MagneticBtn href={p.code} className="glass-ghost px-7 py-3 text-sm font-semibold text-white/50 inline-flex items-center">Source Code</MagneticBtn>
                  </div>
                </div>

                {/* Mockup */}
                <div className={`${isReversed ? "lg:order-1" : ""}`} style={{ transitionDelay: "0.3s" }}>
                  <div className="glass-heavy overflow-hidden rounded-2xl group">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
                      <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /></div>
                      <div className="flex-1 flex justify-center"><div className="px-3 py-1 text-[9px] text-white/30 font-mono bg-white/[0.04] rounded-md border border-white/[0.06]">{p.live.replace("https://", "")}</div></div>
                      <div className="w-8" />
                    </div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0d0d1a] to-[#151528]">
                      <div className="absolute inset-0 flex flex-col p-6 transition-transform duration-700 group-hover:scale-[1.03]">
                        {/* Fake nav */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded" style={{ background: p.accent }} />
                            <div className="h-2 w-20 rounded-full bg-white/12" />
                          </div>
                          <div className="flex gap-3">
                            {[1,2,3].map(i => <div key={i} className="h-1.5 w-10 rounded-full bg-white/8" />)}
                          </div>
                        </div>
                        {/* Fake hero */}
                        <div className="mb-5">
                          <div className="h-4 w-48 bg-white/15 rounded mb-2.5" />
                          <div className="h-2.5 w-64 bg-white/8 rounded mb-1.5" />
                          <div className="h-2.5 w-48 bg-white/6 rounded mb-4" />
                          <div className="flex gap-2">
                            <div className="h-8 w-24 rounded-lg" style={{ background: p.accent }} />
                            <div className="h-8 w-20 rounded-lg border border-white/12" />
                          </div>
                        </div>
                        {/* Fake content cards */}
                        <div className="flex-1 grid grid-cols-3 gap-2.5">
                          {[1,2,3].map(i => (
                            <div key={i} className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 flex flex-col">
                              <div className="flex-1 rounded-lg mb-2.5" style={{ background: `${p.accent}${i === 1 ? "15" : "08"}` }} />
                              <div className="h-1.5 w-14 rounded-full bg-white/10 mb-1.5" />
                              <div className="h-1 w-20 rounded-full bg-white/6" />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <MagneticBtn href={p.live} className="glass-btn px-6 py-2.5 text-xs font-bold tracking-wider uppercase text-white">View Project</MagneticBtn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Statement ── */
function Statement() {
  const { ref, isVisible } = useInView();
  return (
    <section ref={ref} className="py-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div className="glass-heavy p-12 lg:p-16 rounded-3xl text-center">
          <span className="t-micro text-[#8B5CF6] block mb-6">Philosophy</span>
          <blockquote className="text-[clamp(1.2rem,3vw,2.5rem)] font-bold tracking-tight leading-[1.3] text-white/70">
            I don&apos;t believe in templates.<br />
            Every project deserves its own <span className="text-[#8B5CF6]">identity</span>,<br />
            its own <span className="text-[#06B6D4]">rhythm</span>,<br />
            its own <span className="text-[#F472B6]">soul</span>.
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* ── Process ── */
function Process() {
  const { ref, isVisible } = useInView();
  const steps = [
    { num: "01", title: "Discover", desc: "I learn your business, your users, and your goals. Every decision starts with understanding the problem.", color: "#8B5CF6" },
    { num: "02", title: "Design", desc: "Wireframes, visual systems, and prototypes. I think in systems, not screens. Every pixel is intentional.", color: "#06B6D4" },
    { num: "03", title: "Develop", desc: "Clean, tested, production-ready code. Next.js, React, TypeScript. Performance is not optional.", color: "#F472B6" },
    { num: "04", title: "Deliver", desc: "Deployed, documented, and handoff-ready. I don't disappear after launch. Your project is my reputation.", color: "#34d399" },
  ];
  return (
    <section id="process" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-16">
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">Process</span>
          <h2 className="t-display"><SplitReveal text="How I work" /></h2>
        </Reveal>
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="glass p-7 hover:bg-white/[0.09] transition-all duration-500"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s` }}>
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
    <section className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-16">
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">Skills</span>
          <h2 className="t-display"><SplitReveal text="Tech stack" /></h2>
        </Reveal>
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y", "Sanity", "Stripe", "Playwright", "Vitest"].map((t) => (
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
        <Reveal>
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">About</span>
          <h2 className="t-display mb-8">I don&apos;t just build websites. I craft <span className="gradient-text">experiences</span>.</h2>
          <div ref={ref} className="space-y-4">
            <p className="t-body text-white/40">
              I&apos;m Jewel Cruz, a web designer &amp; developer from the Philippines. I specialize in building web applications that are fast, accessible, and genuinely enjoyable to use.
            </p>
            <p className="t-body text-white/40">
              Over the past two years, I&apos;ve shipped a luxury cabin rental platform with canvas-rendered grass animations, a full-stack solar company with Stripe payments, and the portfolio you&apos;re looking at right now.
            </p>
            <p className="t-body text-white/40">
              What drives me is the question: <span className="text-white/70 font-medium">&ldquo;How do I make this feel alive?&rdquo;</span> Every interaction, every animation, every pixel — I want people to feel the care that went into it.
            </p>
            <p className="t-body text-white/30">
              Everything you see here is hand-coded. No templates. No page builders. Just code, design, and a lot of coffee.
            </p>
          </div>
        </Reveal>
        <div className="flex flex-col gap-4 justify-center">
          {[
            { num: "2+", label: "Years building for the web", color: "#E8913A" },
            { num: "100+", label: "Tests across all projects", color: "#8B5CF6" },
            { num: "100", label: "Lighthouse performance score", color: "#34d399" },
            { num: "2", label: "Production apps shipped", color: "#06B6D4" },
            { num: "0", label: "Templates or page builders", color: "#F472B6" },
          ].map((s, i) => (
            <div key={s.label} className="glass-card p-5 flex items-center gap-5"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : "translateX(30px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.08}s` }}>
              <div className="text-2xl font-black min-w-[60px] text-right" style={{ color: s.color }}>{s.num}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
function Testimonials() {
  const { ref, isVisible } = useInView();
  const testimonials = [
    { name: "Redwood Retreats Client", role: "Cabin Rental Business Owner", text: "The canvas grass animation alone got us featured on design galleries. Bookings increased 40% after launch. Jewel turned our vision into something we didn't know was possible.", color: "#E8913A" },
    { name: "Cosmic Ray Solar", role: "Solar Company", text: "Professional, fast, and incredibly detail-oriented. The scheduling system and Stripe integration work flawlessly. Best investment we've made in our online presence.", color: "#6B8DD6" },
  ];
  return (
    <section className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-16">
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-4">Testimonials</span>
          <h2 className="t-display"><SplitReveal text="What clients say" /></h2>
        </Reveal>
        <div ref={ref} className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div key={t.name} className="glass p-8 hover:bg-white/[0.09] transition-all duration-500"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s` }}>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(s => <svg key={s} className="w-4 h-4" fill={t.color} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${t.color}20`, color: t.color }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/30">{t.role}</div>
                </div>
              </div>
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
      <div className="max-w-4xl mx-auto" ref={ref}>
        <Reveal className="text-center mb-12">
          <span className="glass-pill inline-block px-4 py-1.5 t-micro text-[#8B5CF6] mb-6">Contact</span>
          <h2 className="t-hero mb-6">
            <SplitReveal text="Let's" /><br />
            <span className="gradient-text"><SplitReveal text="work" delay={200} /></span> <SplitReveal text="together" delay={400} />
          </h2>
          <p className="text-white/35 max-w-md mx-auto text-lg">I&apos;m open to freelance projects, full-time remote positions, and interesting collaborations. Let&apos;s build something great.</p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Email", value: "jewel@example.com", href: "mailto:jewel@example.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { label: "GitHub", value: "jewelcruzs0922-dev", href: "https://github.com/jewelcruzs0922-dev", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
            { label: "LinkedIn", value: "Jewel Cruz", href: "https://linkedin.com", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" },
          ].map((c) => (
            <MagneticBtn key={c.label} href={c.href} className="glass p-6 text-left hover:bg-white/[0.09] transition-all duration-300 group">
              <svg className="w-5 h-5 text-[#8B5CF6] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
              <div className="t-micro text-white/30 mb-1">{c.label}</div>
              <div className="text-sm font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">{c.value}</div>
            </MagneticBtn>
          ))}
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
        <p className="t-small text-white/25">&copy; 2026 Jewel Cruz. All rights reserved.</p>
        <div className="flex gap-3">
          <span className="glass-sm px-3 py-1 text-[9px] font-bold tracking-wider text-[#8B5CF6] rounded-full">100 Lighthouse</span>
          <span className="glass-sm px-3 py-1 text-[9px] font-bold tracking-wider text-[#06B6D4] rounded-full">100+ Tests</span>
          <span className="glass-sm px-3 py-1 text-[9px] font-bold tracking-wider text-[#34d399] rounded-full">0 Templates</span>
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
      <Statement />
      <Process />
      <Skills />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
