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

/* ── Split text ── */
function SplitText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView(0.3);
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} className={`split-char ${isVisible ? "visible" : ""}`}
          style={{ transitionDelay: `${delay + i * 0.03}s` }}>
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

/* ── Line reveal ── */
function RevealLine({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useInView(0.2);
  return (
    <div ref={ref} className={`${className} line-reveal ${isVisible ? "visible" : ""}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/* ── Cursor ── */
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => { target.current = { x: e.clientX, y: e.clientY }; };
    addEventListener("mousemove", move, { passive: true });

    let raf: number;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (dotRef.current) { dotRef.current.style.left = `${pos.current.x}px`; dotRef.current.style.top = `${pos.current.y}px`; }
      if (ringRef.current) { ringRef.current.style.left = `${pos.current.x}px`; ringRef.current.style.top = `${pos.current.y}px`; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const addHover = () => {
      document.querySelectorAll("a, button, .hover-target").forEach((el) => {
        el.addEventListener("mouseenter", () => { dotRef.current?.classList.add("hover"); ringRef.current?.classList.add("hover"); });
        el.addEventListener("mouseleave", () => { dotRef.current?.classList.remove("hover"); ringRef.current?.classList.remove("hover"); });
      });
    };
    addHover();
    const interval = setInterval(addHover, 2000);

    return () => { removeEventListener("mousemove", move); cancelAnimationFrame(raf); clearInterval(interval); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

/* ── Preloader ── */
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2000);
    const t4 = setTimeout(() => onComplete(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className="preloader" style={{ opacity: phase >= 3 ? 0 : 1, transition: "opacity 0.6s ease", pointerEvents: phase >= 3 ? "none" : "auto" }}>
      <div className="text-center">
        <div style={{ opacity: phase >= 0 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <span className="t-micro text-[var(--color-dim)] block mb-4">Portfolio</span>
        </div>
        <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0) scaleY(1)" : "translateY(10px) scaleY(0)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s", transformOrigin: "bottom" }}>
          <span className="t-display-sm">Jewel Cruz</span>
        </div>
        <div className="mt-6 overflow-hidden" style={{ opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.4s ease 0.2s" }}>
          <div className="h-[2px] bg-[var(--color-accent)]" style={{ width: phase >= 2 ? "100%" : "0%", transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(scrollY > 60);
    addEventListener("scroll", h, { passive: true }); return () => removeEventListener("scroll", h);
  }, []);
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <a href="#home" className="text-sm font-bold tracking-tight hover-target">
            <span className="text-[var(--color-cream)]">J</span>
            <span className="text-[var(--color-accent)]">.</span>
            <span className="text-[var(--color-cream)]">C</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {["Work", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="t-micro text-[var(--color-dim)] hover:text-[var(--color-cream)] transition-colors link-underline hover-target">{item}</a>
            ))}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 hover-target z-[101]" aria-label="Menu">
            <span className={`block w-6 h-[1.5px] bg-[var(--color-cream)] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[4.5px]" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-[var(--color-cream)] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[1.5px]" : ""}`} />
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      <div className={`fixed inset-0 bg-[var(--color-bg)] z-[99] flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {["Work", "About", "Contact"].map((item, i) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
            className="t-display-sm hover:text-[var(--color-accent)] transition-colors"
            style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(30px)", transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s` }}>
            {item}
          </a>
        ))}
      </div>
    </>
  );
}

/* ── Hero ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 2800); return () => clearTimeout(t); }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-end px-6 lg:px-12 pb-20 pt-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.06] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", animation: "float 8s ease-in-out infinite" }} />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
          <span className="t-micro text-[var(--color-accent)] block mb-6">Web Designer &amp; Developer</span>
        </div>

        <h1 className="t-display max-w-5xl" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
          <SplitText text="I craft" delay={3000} /><br />
          <SplitText text="digital" delay={3150} />
          <span className="text-[var(--color-accent)]"><SplitText text="experiences" delay={3350} /></span>
        </h1>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s" }}>
          <p className="t-body text-[var(--color-dim)] max-w-md">
            Frontend developer &amp; designer from the Philippines. I build things that feel right — fast, accessible, and beautiful.
          </p>
          <div className="flex items-center gap-6">
            <a href="#work" className="link-underline text-sm font-semibold hover-target">See work</a>
            <a href="#contact" className="link-underline text-sm font-semibold hover-target">Get in touch</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex items-center gap-3" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.8s" }}>
          <div className="w-[1px] h-12 bg-[var(--color-cream)]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-[var(--color-accent)]" style={{ animation: "scrollLine 2s ease-in-out infinite" }} />
          </div>
          <span className="t-micro text-[var(--color-dim)]">Scroll</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
        @keyframes scrollLine { 0% { height: 0%; top: 0; } 50% { height: 100%; top: 0; } 100% { height: 0%; top: 100%; } }
      `}</style>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  const items = ["Redwood Retreats", "\u2014", "Cosmic Ray Solar", "\u2014", "Web Designer", "\u2014", "Frontend Developer", "\u2014", "UI/UX", "\u2014", "Philippines", "\u2014"];
  return (
    <div className="py-6 border-y border-[var(--color-cream)]/10 overflow-hidden">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 25s linear infinite" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-[clamp(1.2rem,3vw,2.5rem)] font-bold tracking-tight text-[var(--color-cream)]/8 hover:text-[var(--color-accent)] transition-colors duration-300">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Project section ── */
function ProjectSection() {
  const { ref: r1, isVisible: v1 } = useInView(0.08);
  const { ref: r2, isVisible: v2 } = useInView(0.08);

  const projects = [
    {
      num: "01", title: "Redwood Retreats", tag: "Cabin Rental Platform",
      desc: "Canvas-rendered grass with wind physics, PS5-style particles, 3D tilt cards, and a booking system. Lighthouse 100. 41 tests.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest"],
      live: "https://redwood-retreats.vercel.app", code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      accent: "#C45D3E",
      mockBg: "linear-gradient(135deg, #1a1210 0%, #2d1810 50%, #1a1210 100%)",
    },
    {
      num: "02", title: "Cosmic Ray Solar", tag: "Full-Stack Solar Company",
      desc: "Stripe payments, Sanity CMS, scheduling, savings calculator. 59 tests, 35 pages, 5 API routes.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      live: "https://cosmicray-solar.netlify.app", code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      accent: "#6B8DD6",
      mockBg: "linear-gradient(135deg, #0d1020 0%, #151830 50%, #0d1020 100%)",
    },
  ];

  return (
    <section id="work" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <RevealLine className="mb-4">
          <span className="t-micro text-[var(--color-accent)]">Selected Work</span>
        </RevealLine>
        <RevealLine delay={0.1} className="mb-20">
          <h2 className="t-heading">Projects that <span className="text-[var(--color-accent)]">matter</span>.</h2>
        </RevealLine>

        {/* Project 1 */}
        <div ref={r1} className="mb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div style={{ opacity: v1 ? 1 : 0, transform: v1 ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-[var(--color-dim)]">{projects[0].num}</span>
                <div className="h-[1px] flex-1 bg-[var(--color-cream)]/10" />
                <span className="t-micro text-[var(--color-accent)]">{projects[0].tag}</span>
              </div>
              <h3 className="t-display-sm mb-6">{projects[0].title}</h3>
              <p className="t-body text-[var(--color-dim)] mb-6 max-w-md">{projects[0].desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {projects[0].tech.map((t) => <span key={t} className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border border-[var(--color-cream)]/15 text-[var(--color-dim)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-all">{t}</span>)}
              </div>
              <div className="flex gap-4">
                <a href={projects[0].live} className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover-target">
                  View Live
                  <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                </a>
                <a href={projects[0].code} className="text-sm text-[var(--color-dim)] hover:text-[var(--color-cream)] transition-colors hover-target">Code</a>
              </div>
            </div>

            {/* Mockup */}
            <div className="project-card rounded-lg overflow-hidden border border-[var(--color-cream)]/10 hover-target"
              style={{ opacity: v1 ? 1 : 0, transform: v1 ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
              <div className="project-overlay absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <a href={projects[0].live} className="px-8 py-3 text-sm font-bold tracking-wider uppercase border border-white/30 text-white hover:bg-white/10 transition-all">View Project</a>
              </div>
              <div className="aspect-[16/10] project-img" style={{ background: projects[0].mockBg }}>
                <div className="h-full flex flex-col p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-4 h-4 rounded-sm" style={{ background: projects[0].accent }} />
                    <div className="h-2 w-20 rounded-full bg-white/10" />
                  </div>
                  <div className="flex-1 flex items-center">
                    <div>
                      <div className="h-4 w-48 bg-white/10 rounded mb-3" />
                      <div className="h-2 w-64 bg-white/5 rounded mb-2" />
                      <div className="h-2 w-48 bg-white/5 rounded mb-6" />
                      <div className="h-8 w-28 rounded" style={{ background: projects[0].accent }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1,2,3].map(i => <div key={i} className="h-16 rounded bg-white/5 border border-white/5" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project 2 — reversed */}
        <div ref={r2}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup (left) */}
            <div className="project-card rounded-lg overflow-hidden border border-[var(--color-cream)]/10 order-2 lg:order-1 hover-target"
              style={{ opacity: v2 ? 1 : 0, transform: v2 ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
              <div className="project-overlay absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <a href={projects[1].live} className="px-8 py-3 text-sm font-bold tracking-wider uppercase border border-white/30 text-white hover:bg-white/10 transition-all">View Project</a>
              </div>
              <div className="aspect-[16/10] project-img" style={{ background: projects[1].mockBg }}>
                <div className="h-full flex flex-col p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm" style={{ background: projects[1].accent }} />
                      <div className="h-2 w-24 rounded-full bg-white/10" />
                    </div>
                    <div className="h-6 w-20 rounded-full" style={{ background: projects[1].accent }} />
                  </div>
                  <div className="flex-1 flex items-center">
                    <div>
                      <div className="h-4 w-40 bg-white/10 rounded mb-3" />
                      <div className="h-2 w-56 bg-white/5 rounded mb-2" />
                      <div className="h-2 w-40 bg-white/5 rounded mb-6" />
                      <div className="flex gap-2">
                        <div className="h-8 w-24 rounded" style={{ background: projects[1].accent }} />
                        <div className="h-8 w-20 rounded border border-white/10" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[1,2].map(i => <div key={i} className="h-20 rounded bg-white/5 border border-white/5" />)}
                  </div>
                </div>
              </div>
            </div>

            {/* Text (right) */}
            <div className="order-1 lg:order-2" style={{ opacity: v2 ? 1 : 0, transform: v2 ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-[var(--color-dim)]">{projects[1].num}</span>
                <div className="h-[1px] flex-1 bg-[var(--color-cream)]/10" />
                <span className="t-micro text-[var(--color-accent)]">{projects[1].tag}</span>
              </div>
              <h3 className="t-display-sm mb-6">{projects[1].title}</h3>
              <p className="t-body text-[var(--color-dim)] mb-6 max-w-md">{projects[1].desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {projects[1].tech.map((t) => <span key={t} className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border border-[var(--color-cream)]/15 text-[var(--color-dim)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-all">{t}</span>)}
              </div>
              <div className="flex gap-4">
                <a href={projects[1].live} className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover-target">
                  View Live
                  <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                </a>
                <a href={projects[1].code} className="text-sm text-[var(--color-dim)] hover:text-[var(--color-cream)] transition-colors hover-target">Code</a>
              </div>
            </div>
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
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <RevealLine className="mb-4">
            <span className="t-micro text-[var(--color-accent)]">About</span>
          </RevealLine>
          <h2 className="t-heading mb-8">I don&apos;t just build websites. I craft <span className="text-[var(--color-accent)]">experiences</span>.</h2>
          <div className="space-y-4">
            <p className="t-body text-[var(--color-dim)]">
              I&apos;m Jewel Cruz, a web designer &amp; developer from the Philippines. Every project I take on starts with a question: &ldquo;How do I make this feel alive?&rdquo;
            </p>
            <p className="t-body text-[var(--color-dim)]">
              Two years in, I&apos;ve shipped a luxury rental platform with canvas animations, a full-stack solar company with Stripe, and this portfolio you&apos;re looking at right now.
            </p>
            <p className="t-body text-[var(--color-dim)]">
              Everything is hand-coded. No templates. No page builders. Just code, design, and intention.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "2+", label: "Years", color: "var(--color-accent)" },
              { num: "100+", label: "Tests", color: "var(--color-green)" },
              { num: "100", label: "Lighthouse", color: "var(--color-accent)" },
              { num: "0", label: "Templates", color: "var(--color-green)" },
            ].map((s, i) => (
              <div key={s.label} className="p-6 border border-[var(--color-cream)]/10 hover:border-[var(--color-accent)]/30 transition-all hover-target"
                style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${0.2 + i * 0.1}s` }}>
                <div className="text-3xl font-extrabold" style={{ color: s.color }}>{s.num}</div>
                <div className="t-micro text-[var(--color-dim)] mt-2">{s.label}</div>
              </div>
            ))}
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
      <div className="max-w-7xl mx-auto text-center" ref={ref}>
        <RevealLine className="mb-4 flex justify-center">
          <span className="t-micro text-[var(--color-accent)]">Contact</span>
        </RevealLine>
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
          <h2 className="t-display mb-8">
            <SplitText text="Let's" /><br />
            <span className="text-[var(--color-accent)]"><SplitText text="talk" delay={200} /></span>
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12"
          style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}>
          <a href="mailto:jewel@example.com" className="group inline-flex items-center gap-3 text-lg font-semibold text-[var(--color-cream)] hover-target">
            <span className="link-underline">Email</span>
            <svg className="w-5 h-5 text-[var(--color-accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
          </a>
          <span className="text-[var(--color-cream)]/15">|</span>
          <a href="https://github.com/jewelcruzs0922-dev" className="text-lg text-[var(--color-dim)] hover:text-[var(--color-cream)] transition-colors link-underline hover-target">GitHub</a>
          <span className="text-[var(--color-cream)]/15">|</span>
          <a href="https://linkedin.com" className="text-lg text-[var(--color-dim)] hover:text-[var(--color-cream)] transition-colors link-underline hover-target">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-12 border-t border-[var(--color-cream)]/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="t-small text-[var(--color-dim)]">&copy; 2026 Jewel Cruz</p>
        <p className="t-micro text-[var(--color-dim)]">Hand-coded. No templates.</p>
      </div>
    </footer>
  );
}

/* ── Main ── */
export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Cursor />
      <div className="noise" />
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.6s ease" }}>
        <Nav />
        <Hero />
        <Marquee />
        <ProjectSection />
        <About />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
