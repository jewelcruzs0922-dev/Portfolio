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

/* ── Nav ── */
function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-6 lg:px-12 py-6">
        <a href="#home" className="text-sm font-bold tracking-widest uppercase text-[#E8E0D4]">J.C</a>
        <button onClick={() => setOpen(!open)} className="flex flex-col gap-1.5 cursor-pointer z-50" aria-label="Menu">
          <span className={`block w-6 h-[1.5px] bg-[#E8E0D4] transition-all duration-300 ${open ? "rotate-45 translate-y-[4.5px]" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-[#E8E0D4] transition-all duration-300 ${open ? "-rotate-45 -translate-y-[1.5px]" : ""}`} />
        </button>
      </div>
      {/* Full-screen menu */}
      <div className={`fixed inset-0 bg-[#0C0C0C] z-40 flex items-center justify-center transition-all duration-700 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8">
          {["Work", "About", "Contact"].map((item, i) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}
              className="text-[clamp(2rem,8vw,6rem)] font-black tracking-tight text-[#E8E0D4] hover:text-[#C4956A] transition-colors duration-300"
              style={{ transitionDelay: open ? `${i * 100}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(30px)", transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${open ? i * 0.08 : 0}s` }}>
              {item}
            </a>
          ))}
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
    <section id="home" className="min-h-screen flex flex-col justify-end px-6 lg:px-12 pb-16 relative">
      {/* Giant decorative letter */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ fontSize: "clamp(20rem, 50vw, 45rem)", fontWeight: 900, lineHeight: 0.8, color: "rgba(232,224,212,0.025)", letterSpacing: "-0.05em" }}>
        J
      </div>

      <div className="relative z-10">
        <div className="rule-accent mb-8" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }} />

        <h1 className="display" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(60px)", transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s" }}>
          Jewel<br />Cruz
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s" }}>
          <p className="text-[#E8E0D4]/50 text-base max-w-sm leading-relaxed">
            Web designer &amp; developer from the Philippines. I build things that feel right.
          </p>
          <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-[#E8E0D4]/30">
            <span>Available for work</span>
            <div className="w-8 h-[1px] bg-[#C4956A]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Marquee ── */
function Marquee() {
  const items = ["Redwood Retreats", "\u2014", "Cosmic Ray Solar", "\u2014", "Web Designer", "\u2014", "Frontend Developer", "\u2014", "UI/UX", "\u2014"];
  return (
    <div className="py-8 border-y border-[#E8E0D4]/10 overflow-hidden">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 20s linear infinite" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 text-[clamp(1.5rem,4vw,3rem)] font-black tracking-tight text-[#E8E0D4]/10">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Project ── */
function Project({ num, title, tag, desc, tech, stats, live, code, accent, reverse }: {
  num: string; title: string; tag: string; desc: string; tech: string[]; stats: string[];
  live: string; code: string; accent: string; reverse?: boolean;
}) {
  const { ref, isVisible } = useInView(0.1);

  return (
    <div ref={ref} className="min-h-screen flex items-center py-20 px-6 lg:px-12 relative">
      {/* Giant number */}
      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          fontSize: "clamp(15rem, 35vw, 30rem)", fontWeight: 900, lineHeight: 0.8, color: `${accent}06`,
          letterSpacing: "-0.05em", [reverse ? "right" : "left"]: "5%",
          opacity: isVisible ? 1 : 0, transition: "opacity 1s ease 0.3s",
        }}>
        {num}
      </div>

      <div className={`w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10 ${reverse ? "direction-rtl" : ""}`}>
        {/* Text side */}
        <div className={`${reverse ? "lg:col-start-8 lg:col-span-5" : "lg:col-span-5"} direction-ltr`}
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : `translateX(${reverse ? "40px" : "-40px"})`, transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block" style={{ color: accent }}>{tag}</span>
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-black tracking-tight leading-[0.95] mb-6">{title}</h2>
          <p className="text-[#E8E0D4]/40 leading-relaxed mb-8 max-w-md">{desc}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tech.map((t) => <span key={t} className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase border border-[#E8E0D4]/15 text-[#E8E0D4]/50 rounded-sm">{t}</span>)}
          </div>
          <div className="flex gap-4 mb-8">
            {stats.map((s) => <span key={s} className="text-[10px] font-bold tracking-wider" style={{ color: accent }}>{s}</span>)}
          </div>
          <div className="flex gap-4">
            <a href={live} className="group inline-flex items-center gap-2 text-sm font-semibold" style={{ color: accent }}>
              View Live
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <a href={code} className="inline-flex items-center text-sm text-[#E8E0D4]/40 hover:text-[#E8E0D4]/70 transition-colors">Code</a>
          </div>
        </div>

        {/* Visual side */}
        <div className={`${reverse ? "lg:col-start-1 lg:col-span-6 lg:row-start-1" : "lg:col-span-6 lg:col-start-7"} direction-ltr`}
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateX(0)" : `translateX(${reverse ? "-40px" : "40px"})`, transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s" }}>
          <div className="tilted relative">
            {/* Project visual */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden" style={{ background: `${accent}08` }}>
              {/* Fake browser bar */}
              <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-4 border-b border-[#E8E0D4]/8">
                <div className="w-2 h-2 rounded-full bg-[#E8E0D4]/10" />
                <div className="w-2 h-2 rounded-full bg-[#E8E0D4]/10" />
                <div className="w-2 h-2 rounded-full bg-[#E8E0D4]/10" />
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-0.5 text-[9px] text-[#E8E0D4]/20 font-mono">{live.replace("https://", "")}</div>
                </div>
              </div>
              {/* Simulated content */}
              <div className="absolute inset-0 top-8 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-4 h-4 rounded-sm" style={{ background: accent }} />
                    <div className="h-1.5 w-16 rounded-full bg-[#E8E0D4]/10" />
                  </div>
                  <div className="h-20 rounded-sm mb-3" style={{ background: `linear-gradient(135deg, ${accent}15, ${accent}05)` }} />
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-sm bg-[#E8E0D4]/[0.03]" />)}
                  </div>
                  <div className="h-1.5 w-24 rounded-full bg-[#E8E0D4]/5 mb-2" />
                  <div className="h-1.5 w-36 rounded-full bg-[#E8E0D4]/[0.03]" />
                </div>
              </div>
            </div>
            {/* Accent label */}
            <div className="absolute -bottom-3 left-4 px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-sm" style={{ background: accent, color: "#0C0C0C" }}>
              {num}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Statement ── */
function Statement() {
  const { ref, isVisible } = useInView();
  return (
    <section ref={ref} className="py-32 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div className="rule mb-12" />
        <blockquote className="text-[clamp(1.5rem,4vw,3.5rem)] font-black tracking-tight leading-[1.2] text-[#E8E0D4]/80">
          I don&apos;t believe in templates.<br />
          Every project deserves its own <span className="text-[#C4956A]">identity</span>,<br />
          its own <span className="text-[#C4956A]">rhythm</span>,<br />
          its own <span className="text-[#C4956A]">soul</span>.
        </blockquote>
        <div className="rule-accent mt-12" />
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
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C4956A] mb-4 block">About</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-[0.95] mb-8">
            Design is how<br />it <span className="text-[#C4956A]">works</span>.
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-6"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
          <p className="text-[#E8E0D4]/50 leading-relaxed text-lg">
            I&apos;m Jewel. I design and build websites from the Philippines. Two years in, and I&apos;ve shipped a luxury rental platform with canvas animations, a full-stack solar company with Stripe, and this portfolio you&apos;re looking at right now.
          </p>
          <p className="text-[#E8E0D4]/35 leading-relaxed">
            Everything you see here is hand-coded. No templates. No page builders. Just code, design, and a lot of coffee.
          </p>
          <div className="mt-4 flex gap-12">
            {[
              { num: "2+", label: "Years" },
              { num: "100+", label: "Tests" },
              { num: "100", label: "Lighthouse" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-[#C4956A]">{s.num}</div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#E8E0D4]/30 mt-1">{s.label}</div>
              </div>
            ))}
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
    { num: "01", title: "Design", desc: "Interfaces that feel inevitable. Research, wireframes, prototypes, pixel-perfect execution." },
    { num: "02", title: "Development", desc: "Next.js, React, TypeScript. Fast, tested, accessible. Production-ready from day one." },
    { num: "03", title: "Branding", desc: "Visual identities that stick. Logos, color systems, typography, design languages." },
  ];
  return (
    <section id="services" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C4956A] mb-4 block">Services</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-tight leading-[0.95] mb-16">
            What I <span className="text-[#C4956A]">do</span>.
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-0">
          {services.map((s, i) => (
            <div key={s.num} className="py-10 border-t border-[#E8E0D4]/10 group hover:bg-[#E8E0D4]/[0.02] transition-colors duration-500"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s` }}>
              <div className="px-6 lg:px-10">
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#C4956A]/50">{s.num}</span>
                <h3 className="text-2xl font-black tracking-tight mt-3 mb-4">{s.title}</h3>
                <p className="text-sm text-[#E8E0D4]/35 leading-relaxed">{s.desc}</p>
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
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="text-center" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C4956A] mb-6 block">Contact</span>
          <h2 className="text-[clamp(3rem,10vw,9rem)] font-black tracking-tight leading-[0.85] mb-8">
            Let&apos;s<br />talk<span className="text-[#C4956A]">.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <a href="mailto:jewel@example.com" className="group inline-flex items-center gap-3 text-lg font-semibold text-[#C4956A] hover:gap-4 transition-all duration-300">
              Email
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <span className="text-[#E8E0D4]/15">|</span>
            <a href="https://github.com/jewelcruzs0922-dev" className="text-lg text-[#E8E0D4]/40 hover:text-[#E8E0D4]/70 transition-colors">GitHub</a>
            <span className="text-[#E8E0D4]/15">|</span>
            <a href="https://linkedin.com" className="text-lg text-[#E8E0D4]/40 hover:text-[#E8E0D4]/70 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-12 border-t border-[#E8E0D4]/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold tracking-widest uppercase text-[#E8E0D4]/20">
        <p>&copy; 2026 Jewel Cruz</p>
        <p>Built by hand. No templates.</p>
      </div>
    </footer>
  );
}

/* ── Main ── */
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Project
        num="01" title="Redwood Retreats" tag="Cabin Rental Platform"
        desc="Canvas-rendered grass with wind physics, PS5-style particles, 3D tilt cards, and a booking system with dynamic pricing. Every detail hand-crafted."
        tech={["Next.js 16", "TypeScript", "Canvas API", "Vitest"]}
        stats={["41 Tests", "100 Lighthouse", "91 A11y"]}
        live="https://redwood-retreats.vercel.app" code="https://github.com/jewelcruzs0922-dev/redwood-retreats"
        accent="#C4956A"
      />
      <Project
        num="02" title="Cosmic Ray Solar" tag="Full-Stack Solar Company"
        desc="Stripe payments, Sanity CMS, appointment scheduling, and a real-time savings calculator. 35 pages, 5 API routes, zero shortcuts."
        tech={["Next.js 16", "Stripe", "Sanity", "Playwright"]}
        stats={["59 Tests", "35 Pages", "5 APIs"]}
        live="https://cosmicray-solar.netlify.app" code="https://github.com/jewelcruzs0922-dev/cosmicray-solar"
        accent="#8B7355" reverse
      />
      <Statement />
      <Services />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
