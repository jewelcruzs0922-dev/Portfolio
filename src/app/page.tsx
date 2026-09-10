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
      for (const id of ["contact", "services", "about", "skills", "work", "home"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) { setActive(id); break; }
      }
    };
    addEventListener("scroll", h, { passive: true }); return () => removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="glass-pill flex items-center justify-between px-6 lg:px-8 py-3">
          <a href="#home" className="text-lg font-black tracking-tight text-white">J<span className="text-[#8b5cf6]">.</span>C</a>
          <div className="hidden sm:flex gap-1">
            {["Work", "Services", "Skills", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 rounded-xl ${
                active === item.toLowerCase() ? "bg-white/10 text-white border border-white/20" : "text-white/50 hover:text-white/80"
              }`}>{item}</a>
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
      {/* Floating orbs */}
      <div className="absolute top-20 right-[10%] w-[300px] h-[300px] opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "auroraDrift1 15s ease-in-out infinite" }} />
      <div className="absolute bottom-[20%] left-[5%] w-[250px] h-[250px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%", animation: "auroraDrift2 18s ease-in-out infinite" }} />
      <div className="absolute top-[60%] right-[25%] w-[200px] h-[200px] opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.4), transparent 70%)", borderRadius: "40% 60% 50% 50% / 60% 40% 60% 40%", animation: "auroraDrift3 12s ease-in-out infinite" }} />

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 glass-pill px-5 py-2.5 mb-8"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-[#34d399]" />
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-[#34d399] animate-ping" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#34d399] uppercase">Available for hire</span>
          </div>

          {/* Headline */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(60px)", transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
            <h1 className="text-[clamp(3rem,10vw,8rem)] font-black leading-[0.85] tracking-tighter text-white">
              <RevealText text="Jewel" className="block" />
              <RevealText text="Cruz" className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#f472b6]" />
            </h1>
          </div>

          <p className="mt-8 text-xl text-white/60 max-w-lg leading-relaxed"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s" }}>
            <span className="text-white font-semibold">Web designer &amp; frontend developer</span> crafting production-grade interfaces that feel as good as they look.
          </p>

          {/* Stack */}
          <div className="mt-8 flex flex-wrap gap-2" style={{ opacity: loaded ? 1 : 0, transition: "all 0.8s ease 0.9s" }}>
            {["Next.js", "React", "TypeScript", "Tailwind", "Figma"].map((t, i) => (
              <span key={t} className="glass-pill px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-all cursor-default"
                style={{ opacity: loaded ? 1 : 0, transition: `all 0.6s ease ${1 + i * 0.08}s` }}>{t}</span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex gap-4 flex-wrap" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s" }}>
            <MagneticBtn href="#work" className="glass-button px-10 py-4 inline-flex items-center gap-2 text-white font-semibold">
              <span>View Work</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </MagneticBtn>
            <MagneticBtn href="#contact" className="glass-ghost px-10 py-4 text-sm font-semibold text-white/80 inline-flex items-center">Let&apos;s Talk</MagneticBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Work ── */
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
      stats: "41 tests \u00B7 100 perf \u00B7 91 a11y",
      gradient: "from-[#e8913a]/20 to-[#8b5cf6]/20",
      dot: "#e8913a",
    },
    {
      title: "Cosmic Ray Solar", tag: "Full-Stack Solar Company",
      desc: "Stripe checkout, Sanity CMS, scheduling, savings calculator. 59 tests, 35 pages, 5 API routes.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      live: "https://cosmicray-solar.netlify.app", code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: "59 tests \u00B7 35 pages \u00B7 5 APIs",
      gradient: "from-[#6c5ce7]/20 to-[#06b6d4]/20",
      dot: "#6c5ce7",
    },
  ];
  const scrollTo = useCallback((i: number) => {
    if (!scrollRef.current) return;
    const c = scrollRef.current.children[i] as HTMLElement;
    if (c) { c.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); setActive(i); }
  }, []);

  return (
    <section id="work" className="py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 mb-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-4">Portfolio</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white"><RevealText text="Selected work" /></h2>
          </div>
          <div className="hidden sm:flex gap-2">
            {projects.map((_, i) => (
              <button key={i} onClick={() => scrollTo(i)} className={`transition-all duration-500 h-2 rounded-full ${active === i ? "bg-white/30 w-12" : "bg-white/10 w-2 hover:bg-white/20"}`} />
            ))}
          </div>
        </div>
      </div>
      <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div ref={scrollRef} className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 lg:px-12 pb-8 scrollbar-hide">
          {projects.map((p) => (
            <div key={p.title} className="flex-shrink-0 w-[90vw] sm:w-[75vw] lg:w-[55vw] snap-center">
              <div className="glass h-full">
                <div className={`relative p-8 lg:p-10 h-full bg-gradient-to-br ${p.gradient} rounded-[20px]`}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">{p.tag}</span>
                      <h3 className="text-3xl lg:text-4xl font-black text-white mt-2">{p.title}</h3>
                    </div>
                    <div className="glass-subtle w-14 h-14 flex items-center justify-center flex-shrink-0 rounded-2xl">
                      <div className="w-3 h-3 rounded-full" style={{ background: p.dot, boxShadow: `0 0 12px ${p.dot}80` }} />
                    </div>
                  </div>
                  <p className="text-white/50 leading-relaxed mb-6 max-w-lg">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tech.map((t) => <span key={t} className="glass-subtle px-3 py-1.5 text-xs font-medium text-white/70 rounded-xl">{t}</span>)}
                  </div>
                  <div className="glass-subtle px-4 py-2 inline-block mb-8 rounded-xl">
                    <span className="text-xs font-semibold text-[#8b5cf6]">{p.stats}</span>
                  </div>
                  <div className="flex gap-4">
                    <MagneticBtn href={p.live} className="glass-button px-8 py-3 text-sm inline-flex items-center gap-2 text-white">
                      Live Demo <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </MagneticBtn>
                    <MagneticBtn href={p.code} className="glass-ghost px-8 py-3 text-sm font-semibold text-white/80 inline-flex items-center">Code</MagneticBtn>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Services ── */
function Services() {
  const { ref, isVisible } = useInView();
  const services = [
    {
      title: "UI/UX Design",
      desc: "User-centered interfaces built from research, wireframes, and iterative prototyping. Every pixel placed with intention.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
      ),
      color: "#8b5cf6",
    },
    {
      title: "Web Development",
      desc: "Full-stack applications with Next.js, React, TypeScript. Performance-first, tested, accessible, production-ready.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
      ),
      color: "#06b6d4",
    },
    {
      title: "Brand Identity",
      desc: "Logos, color systems, typography, and design languages that tell your story and make you unforgettable.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
      ),
      color: "#f472b6",
    },
    {
      title: "Performance & SEO",
      desc: "Lighthouse 100s, Core Web Vitals, structured data, meta tags. Your site loads fast and ranks high.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
      ),
      color: "#34d399",
    },
  ];
  return (
    <section id="services" className="py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="mb-16">
            <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-4">Services</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white"><RevealText text="What I do" /></h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((s, i) => (
              <div key={s.title} className="glass-card p-8 group hover:bg-white/[0.08] transition-all duration-500"
                style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s` }}>
                <div className="glass-subtle w-12 h-12 flex items-center justify-center rounded-2xl mb-6 text-white/80 group-hover:text-white transition-colors"
                  style={{ boxShadow: `0 0 20px ${s.color}20` }}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{s.desc}</p>
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
    { name: "Testing (Vitest/Playwright)", pct: 85, color: "#8b5cf6" },
  ];
  return (
    <section id="skills" className="py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
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
                  <div className="h-full rounded-full transition-all duration-[1.5s] ease-out" style={{ width: isVisible ? `${s.pct}%` : "0%", background: `linear-gradient(90deg, ${s.color}, ${s.color}99)`, borderRadius: "50px" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y", "Sanity CMS", "Stripe"].map((t) => (
              <span key={t} className="glass-pill px-4 py-2 text-xs font-medium text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all cursor-default">{t}</span>
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
            <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-4">About</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
              Design with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">soul</span>.
            </h2>
          </div>
          <div className="glass-heavy p-10 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <p className="text-lg text-white/60 leading-relaxed mb-6">
                  I&apos;m Jewel Cruz, a web designer &amp; frontend developer from the Philippines. I don&apos;t just build websites &mdash; I craft digital experiences that people remember.
                </p>
                <p className="text-lg text-white/60 leading-relaxed mb-6">
                  Every project I take on starts with a question: <span className="text-white font-medium">&ldquo;How do I make this feel alive?&rdquo;</span> Whether it&apos;s a luxury cabin rental platform or a solar company site, I pour soul into every interaction, every animation, every pixel.
                </p>
                <p className="text-lg text-white/40 leading-relaxed">
                  I believe great web design is invisible. Users shouldn&apos;t notice the design &mdash; they should feel it. Fast loads, smooth transitions, intuitive layouts. That&apos;s what I deliver.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { num: "2+", label: "Years building for the web", color: "#e8913a" },
                  { num: "100+", label: "Tests across all projects", color: "#8b5cf6" },
                  { num: "100", label: "Lighthouse performance score", color: "#34d399" },
                  { num: "0", label: "Frameworks I settle for", color: "#06b6d4" },
                ].map((s) => (
                  <div key={s.label} className="glass-card p-5 flex items-center gap-5">
                    <div className="text-3xl font-black min-w-[60px] text-right" style={{ color: s.color }}>{s.num}</div>
                    <div className="text-sm text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>
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
      <div className="max-w-3xl mx-auto text-center">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="glass-pill inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-[#8b5cf6] uppercase mb-6">Contact</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">Let&apos;s build<br />something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4]">beautiful</span></h2>
          <p className="text-white/40 mb-12 max-w-md mx-auto text-lg">Open to freelance projects, remote positions, and collaborations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticBtn href="mailto:jewel@example.com" className="glass-button px-10 py-4 inline-flex items-center justify-center text-white font-semibold">Email Me</MagneticBtn>
            <MagneticBtn href="https://github.com/jewelcruzs0922-dev" className="glass-ghost px-10 py-4 text-sm font-semibold text-white/80 inline-flex items-center justify-center">GitHub</MagneticBtn>
            <MagneticBtn href="https://linkedin.com" className="glass-ghost px-10 py-4 text-sm font-semibold text-white/80 inline-flex items-center justify-center">LinkedIn</MagneticBtn>
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
      <div className="max-w-6xl mx-auto">
        <div className="glass-pill px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
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
      {/* Aurora backdrop */}
      <div className="aurora-backdrop">
        <div className="aurora-accent" />
      </div>
      <div className="grid-pattern" />

      <div className="relative z-10">
        <Nav />
        <Hero />
        <Work />
        <Services />
        <Skills />
        <About />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
