"use client";

import { useEffect, useState } from "react";

/* ── Hook ── */
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(scrollY > 40);
    addEventListener("scroll", h, { passive: true }); return () => removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#F5F3EF]/90 backdrop-blur-sm border-b border-[#1A1A1A]/5" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <a href="#home" className="text-sm font-bold tracking-tight text-[#1A1A1A]">Jewel Cruz</a>
        <div className="hidden sm:flex items-center gap-8">
          {["Work", "Services", "About", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-semibold tracking-wider uppercase text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">{item}</a>
          ))}
        </div>
        <a href="#contact" className="text-xs font-semibold tracking-wider uppercase text-[#0055FF] hover:underline">Hire me</a>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-end px-6 lg:px-12 pb-20 pt-32">
      <div className="max-w-6xl mx-auto w-full">
        <div className="rule-accent mb-8" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }} />

        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
          <p className="t-micro text-[#0055FF] mb-4">Web Designer &amp; Developer</p>
          <h1 className="t-display max-w-4xl">
            I build websites<br />that work.
          </h1>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s" }}>
          <p className="t-body text-[#6B6B6B] max-w-md">
            Frontend developer from the Philippines. I build fast, tested, production-ready web applications. Currently available for remote work.
          </p>
          <div className="flex items-center gap-6">
            <a href="#work" className="link t-small font-semibold">See work</a>
            <a href="#contact" className="link t-small font-semibold">Get in touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats bar ── */
function StatsBar() {
  const { ref, isVisible } = useInView();
  const stats = [
    { value: "2+", label: "Years experience" },
    { value: "100+", label: "Tests written" },
    { value: "100", label: "Lighthouse score" },
    { value: "2", label: "Production apps" },
  ];
  return (
    <div ref={ref} className="border-y border-[#1A1A1A]/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`py-8 px-6 lg:px-12 ${i < 3 ? "border-r border-[#1A1A1A]/10" : ""} ${i < 2 ? "border-b lg:border-b-0 border-[#1A1A1A]/10" : i === 2 ? "border-b lg:border-b-0 border-[#1A1A1A]/10" : ""}`}
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.08}s` }}>
            <div className="text-3xl lg:text-4xl font-extrabold tracking-tight">{s.value}</div>
            <div className="t-micro text-[#6B6B6B] mt-2">{s.label}</div>
          </div>
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
      desc: "A luxury cabin rental platform with canvas-rendered grass animations, PS5-style particle effects, 3D tilt cards, and a dynamic booking system. Lighthouse 100 performance, 91 accessibility, 41 tests.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest", "Tailwind"],
      live: "https://redwood-retreats.vercel.app", code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      color: "#C45D3E",
      mockBg: "#FDF8F5",
      mockAccent: "#C45D3E",
    },
    {
      num: "02", title: "Cosmic Ray Solar", tag: "Full-Stack Solar Company",
      desc: "A complete solar company platform with Stripe payment integration, Sanity CMS, appointment scheduling, and a real-time savings calculator. 59 tests, 35 pages, 5 API routes.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright", "Tailwind"],
      live: "https://cosmicray-solar.netlify.app", code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      color: "#2563EB",
      mockBg: "#F5F8FF",
      mockAccent: "#2563EB",
    },
  ];

  return (
    <section id="work" className="py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="t-micro text-[#0055FF] mb-3">Selected Work</p>
          <h2 className="t-heading">Projects I&apos;ve shipped.</h2>
        </div>

        {/* Project 1 */}
        <div ref={r1} className="mb-24">
          <div className={`transition-all duration-700 ${v1 ? "opacity-100" : "opacity-0"}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Text */}
              <div style={{ opacity: v1 ? 1 : 0, transform: v1 ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease 0.1s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-[#6B6B6B]">{projects[0].num}</span>
                  <div className="rule flex-1" />
                  <span className="tag" style={{ borderColor: `${projects[0].color}30`, color: projects[0].color }}>{projects[0].tag}</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">{projects[0].title}</h3>
                <p className="t-body text-[#6B6B6B] mb-6 max-w-md">{projects[0].desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {projects[0].tech.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="flex gap-4">
                  <a href={projects[0].live} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: projects[0].color }}>
                    Live site
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                  </a>
                  <a href={projects[0].code} className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">Source code</a>
                </div>
              </div>

              {/* Mockup */}
              <div style={{ opacity: v1 ? 1 : 0, transform: v1 ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease 0.3s" }}>
                <div className="border border-[#1A1A1A]/10 rounded-sm overflow-hidden">
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#1A1A1A]/5">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]/8" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]/8" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]/8" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-3 py-1 text-[10px] text-[#6B6B6B] bg-white border border-[#1A1A1A]/8 rounded-sm font-mono">
                        {projects[0].live.replace("https://", "")}
                      </div>
                    </div>
                    <div className="w-10" />
                  </div>
                  {/* Site preview */}
                  <div className="aspect-[16/10]" style={{ background: projects[0].mockBg }}>
                    <div className="h-full flex flex-col p-6">
                      {/* Nav mock */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-sm" style={{ background: projects[0].mockAccent }} />
                          <div className="h-2 w-16 bg-[#1A1A1A]/10 rounded-full" />
                        </div>
                        <div className="flex gap-3">
                          <div className="h-2 w-8 bg-[#1A1A1A]/8 rounded-full" />
                          <div className="h-2 w-8 bg-[#1A1A1A]/8 rounded-full" />
                          <div className="h-2 w-8 bg-[#1A1A1A]/8 rounded-full" />
                        </div>
                      </div>
                      {/* Hero mock */}
                      <div className="flex-1 flex items-center">
                        <div>
                          <div className="h-3 w-40 bg-[#1A1A1A]/10 rounded-full mb-3" />
                          <div className="h-2 w-56 bg-[#1A1A1A]/5 rounded-full mb-2" />
                          <div className="h-2 w-44 bg-[#1A1A1A]/5 rounded-full mb-5" />
                          <div className="h-7 w-24 rounded-full" style={{ background: projects[0].mockAccent }} />
                        </div>
                      </div>
                      {/* Cards mock */}
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-sm border border-[#1A1A1A]/5 bg-white p-3">
                            <div className="aspect-[4/3] rounded-sm mb-2" style={{ background: `${projects[0].mockAccent}08` }} />
                            <div className="h-1.5 w-12 bg-[#1A1A1A]/8 rounded-full mb-1" />
                            <div className="h-1 w-16 bg-[#1A1A1A]/5 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project 2 — reversed */}
        <div ref={r2}>
          <div className={`transition-all duration-700 ${v2 ? "opacity-100" : "opacity-0"}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Mockup (left) */}
              <div className="order-2 lg:order-1" style={{ opacity: v2 ? 1 : 0, transform: v2 ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease 0.3s" }}>
                <div className="border border-[#1A1A1A]/10 rounded-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#1A1A1A]/5">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]/8" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]/8" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]/8" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-3 py-1 text-[10px] text-[#6B6B6B] bg-white border border-[#1A1A1A]/8 rounded-sm font-mono">
                        {projects[1].live.replace("https://", "")}
                      </div>
                    </div>
                    <div className="w-10" />
                  </div>
                  <div className="aspect-[16/10]" style={{ background: projects[1].mockBg }}>
                    <div className="h-full flex flex-col p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-sm" style={{ background: projects[1].mockAccent }} />
                          <div className="h-2 w-20 bg-[#1A1A1A]/10 rounded-full" />
                        </div>
                        <div className="h-6 w-20 rounded-full" style={{ background: projects[1].mockAccent }} />
                      </div>
                      <div className="flex-1 flex items-center">
                        <div>
                          <div className="h-3 w-36 bg-[#1A1A1A]/10 rounded-full mb-3" />
                          <div className="h-2 w-48 bg-[#1A1A1A]/5 rounded-full mb-2" />
                          <div className="h-2 w-40 bg-[#1A1A1A]/5 rounded-full mb-5" />
                          <div className="flex gap-2">
                            <div className="h-7 w-24 rounded-full" style={{ background: projects[1].mockAccent }} />
                            <div className="h-7 w-20 rounded-full border border-[#1A1A1A]/10" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="rounded-sm border border-[#1A1A1A]/5 bg-white p-3">
                            <div className="aspect-[16/9] rounded-sm mb-2" style={{ background: `${projects[1].mockAccent}08` }} />
                            <div className="h-1.5 w-14 bg-[#1A1A1A]/8 rounded-full mb-1" />
                            <div className="h-1 w-20 bg-[#1A1A1A]/5 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text (right) */}
              <div className="order-1 lg:order-2" style={{ opacity: v2 ? 1 : 0, transform: v2 ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease 0.1s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-[#6B6B6B]">{projects[1].num}</span>
                  <div className="rule flex-1" />
                  <span className="tag" style={{ borderColor: `${projects[1].color}30`, color: projects[1].color }}>{projects[1].tag}</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">{projects[1].title}</h3>
                <p className="t-body text-[#6B6B6B] mb-6 max-w-md">{projects[1].desc}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {projects[1].tech.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="flex gap-4">
                  <a href={projects[1].live} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: projects[1].color }}>
                    Live site
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                  </a>
                  <a href={projects[1].code} className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">Source code</a>
                </div>
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
    { num: "01", title: "Design", desc: "User interfaces from research to prototype. Wireframes, visual design, design systems. I think in systems, not screens." },
    { num: "02", title: "Development", desc: "Next.js, React, TypeScript. Performance-first, tested, accessible. I write code that ships and holds up in production." },
    { num: "03", title: "Branding", desc: "Visual identities that stick. Logos, color systems, typography, and design languages. Your brand, distilled." },
  ];
  return (
    <section id="services" className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease" }}>
          <p className="t-micro text-[#0055FF] mb-3">Services</p>
          <h2 className="t-heading">What I do.</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-0">
          {services.map((s, i) => (
            <div key={s.num} className={`py-10 px-6 lg:px-8 border-t border-[#1A1A1A]/10 ${i < 2 ? "lg:border-r" : ""}`}
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.1}s` }}>
              <span className="text-xs font-bold text-[#0055FF]">{s.num}</span>
              <h3 className="text-xl font-bold tracking-tight mt-3 mb-3">{s.title}</h3>
              <p className="t-small text-[#6B6B6B] leading-relaxed">{s.desc}</p>
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
  const groups = [
    { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript ES6+"] },
    { label: "Design", items: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "Wireframing"] },
    { label: "Tools", items: ["Git & GitHub", "Vercel", "Netlify", "Playwright", "Vitest"] },
    { label: "Other", items: ["SEO", "Web Accessibility", "REST APIs", "Sanity CMS", "Stripe"] },
  ];
  return (
    <section id="skills" className="py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease" }}>
          <p className="t-micro text-[#0055FF] mb-3">Skills</p>
          <h2 className="t-heading">What I know.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {groups.map((g, i) => (
            <div key={g.label} className={`py-8 px-6 border-t border-[#1A1A1A]/10 ${i % 2 === 0 ? "sm:border-r" : ""} ${i < 2 ? "lg:border-r lg:border-b-0" : "lg:border-b-0"} ${i < groups.length - 2 ? "border-b sm:border-b-0" : i === 2 ? "lg:border-r" : ""}`}
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ease ${i * 0.08}s` }}>
              <h3 className="t-micro text-[#1A1A1A] mb-4">{g.label}</h3>
              <ul className="space-y-2">
                {g.items.map((item) => (
                  <li key={item} className="t-small text-[#6B6B6B]">{item}</li>
                ))}
              </ul>
            </div>
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
    <section id="about" className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-16">
        <div ref={ref} className="lg:col-span-3" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease" }}>
          <p className="t-micro text-[#0055FF] mb-3">About</p>
          <h2 className="t-heading mb-8">Design is how it works.</h2>
          <div className="space-y-4">
            <p className="t-body text-[#6B6B6B]">
              I&apos;m Jewel Cruz, a web designer and frontend developer from the Philippines. I build websites that are fast, accessible, and actually work the way they should.
            </p>
            <p className="t-body text-[#6B6B6B]">
              Two years in, I&apos;ve shipped a luxury rental platform with canvas animations, a full-stack solar company with Stripe payments, and this portfolio you&apos;re looking at right now. Every project is hand-coded. No templates. No page builders.
            </p>
            <p className="t-body text-[#6B6B6B]">
              I believe great web design is invisible. Users shouldn&apos;t notice the design. They should just find what they need, fast. That&apos;s what I build.
            </p>
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center">
          <div className="border border-[#1A1A1A]/10 rounded-sm">
            {[
              { label: "Location", value: "Philippines" },
              { label: "Status", value: "Available for work" },
              { label: "Focus", value: "Frontend & Design" },
              { label: "Stack", value: "Next.js, React, TS" },
            ].map((row, i) => (
              <div key={row.label} className={`flex justify-between items-center px-6 py-4 ${i < 3 ? "border-b border-[#1A1A1A]/10" : ""}`}>
                <span className="t-micro text-[#6B6B6B]">{row.label}</span>
                <span className="t-small font-semibold">{row.value}</span>
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
    <section id="contact" className="py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div>
            <p className="t-micro text-[#0055FF] mb-3">Contact</p>
            <h2 className="t-heading mb-6">Let&apos;s work together.</h2>
            <p className="t-body text-[#6B6B6B] max-w-md">
              I&apos;m open to freelance projects, full-time positions, and interesting collaborations. If you have an idea that needs building, let&apos;s talk.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <a href="mailto:jewel@example.com" className="flex items-center justify-between py-4 border-b border-[#1A1A1A]/10 group">
                <span className="t-body font-semibold">Email</span>
                <svg className="w-4 h-4 text-[#0055FF] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
              </a>
              <a href="https://github.com/jewelcruzs0922-dev" className="flex items-center justify-between py-4 border-b border-[#1A1A1A]/10 group">
                <span className="t-body font-semibold">GitHub</span>
                <svg className="w-4 h-4 text-[#0055FF] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
              </a>
              <a href="https://linkedin.com" className="flex items-center justify-between py-4 border-b border-[#1A1A1A]/10 group">
                <span className="t-body font-semibold">LinkedIn</span>
                <svg className="w-4 h-4 text-[#0055FF] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A]/10 py-6 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="t-small text-[#6B6B6B]">&copy; 2026 Jewel Cruz</p>
        <p className="t-micro text-[#6B6B6B]">Hand-coded. No templates.</p>
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
      <StatsBar />
      <Work />
      <Services />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
