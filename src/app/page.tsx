"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ── Scroll animation hook ── */
function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return { ref: setRef, isVisible };
}

/* ── Animated counter ── */
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();
  useEffect(() => {
    if (!isVisible) return;
    let c = 0;
    const step = target / 60;
    const t = setInterval(() => { c += step; if (c >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(c)); }, 16);
    return () => clearInterval(t);
  }, [isVisible, target]);
  return <span ref={ref}>{count}</span>;
}

/* ── Circular progress ring ── */
function Ring({ value, label, color }: { value: number; label: string; color: string }) {
  const { ref, isVisible } = useInView();
  const r = 45, c = 2 * Math.PI * r, off = c - (isVisible ? (value / 100) * c : 0);
  return (
    <div ref={ref} className="flex flex-col items-center group">
      <div className="relative w-28 h-28 transition-transform duration-500 group-hover:scale-110">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#d1d9e6" strokeWidth="6" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            className="transition-all duration-[1.5s] ease-out" style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black" style={{ color }}>{isVisible ? value : 0}</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-semibold text-[#636e72] group-hover:text-[#2d3436] transition-colors">{label}</span>
    </div>
  );
}

/* ── Animated gradient border ── */
function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#6c5ce7] rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative neu-raised">{children}</div>
    </div>
  );
}

/* ── Text reveal animation ── */
function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const { ref, isVisible } = useInView();
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) rotate(0)" : "translateY(100%) rotate(10deg)",
            transition: `all 0.5s ease ${i * 0.03}s`,
          }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/* ── Magnetic button ── */
function MagneticBtn({ children, className = "", href = "#" }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, []);
  const leave = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  return (
    <a ref={ref} href={href} className={className} onMouseMove={move} onMouseLeave={leave}
      style={{ transition: "transform 0.2s ease" }}>
      {children}
    </a>
  );
}

/* ── Navigation ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const ids = ["home", "work", "skills", "about", "contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="neu-raised-sm flex items-center justify-between px-6 py-3">
          <a href="#home" className="text-lg font-black text-[#2d3436] tracking-tight">JC<span className="text-[#6c5ce7]">.</span></a>
          <div className="hidden sm:flex gap-1">
            {["Home", "Work", "Skills", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  active === item.toLowerCase()
                    ? "text-[#6c5ce7]"
                    : "text-[#636e72] hover:text-[#2d3436]"
                }`}>
                {active === item.toLowerCase() && (
                  <div className="absolute inset-0 neu-inset rounded-xl" />
                )}
                <span className="relative z-10">{item}</span>
              </a>
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center px-6 overflow-hidden">
      {/* Parallax background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full transition-transform duration-1000 ease-out"
            style={{
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              top: `${8 + i * 12}%`,
              left: `${3 + i * 12}%`,
              background: `rgba(108, 92, 231, ${0.02 + i * 0.005})`,
              transform: `translate(${mousePos.x * (i * 0.3)}px, ${mousePos.y * (i * 0.3)}px)`,
              animation: `float ${5 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }} />
        ))}
      </div>

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="neu-inset inline-flex items-center gap-2 px-4 py-2 mb-8"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.2s" }}>
              <div className="h-2 w-2 rounded-full bg-[#00b894] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-[#00b894] uppercase">Available for hire</span>
            </div>

            <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(50px)", transition: "all 1s ease 0.3s" }}>
              <RevealText text="I build" className="block text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-[#2d3436]" />
              <RevealText text="digital" className="block text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-[#6c5ce7]" />
              <RevealText text="experiences." className="block text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-[#2d3436]" />
            </div>

            <p className="mt-8 text-lg text-[#636e72] max-w-md leading-relaxed"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 0.8s" }}>
              Frontend developer crafting <span className="font-semibold text-[#2d3436]">production-grade</span> web applications with emotion and precision.
            </p>

            <div className="mt-8 flex flex-wrap gap-3"
              style={{ opacity: loaded ? 1 : 0, transition: "all 0.8s ease 1s" }}>
              {["Next.js", "React", "TypeScript", "Tailwind", "Vitest"].map((t, i) => (
                <span key={t} className="neu-flat px-5 py-2.5 text-sm font-semibold text-[#2d3436] hover:text-[#6c5ce7] transition-colors cursor-default"
                  style={{ opacity: loaded ? 1 : 0, transition: `all 0.6s ease ${1.1 + i * 0.1}s` }}>{t}</span>
              ))}
            </div>

            <div className="mt-10 flex gap-4"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 1.4s" }}>
              <MagneticBtn href="#work" className="neu-button text-base px-10 py-4 inline-flex items-center">
                View Projects
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </MagneticBtn>
              <MagneticBtn href="#contact" className="neu-flat px-10 py-4 text-base font-semibold text-[#2d3436] inline-flex items-center">
                Contact
              </MagneticBtn>
            </div>
          </div>

          <div className="lg:col-span-5" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(50px)", transition: "all 1.2s ease 0.5s" }}>
            <GlowCard>
              <div className="p-8">
                <div className="neu-inset p-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#636e72] uppercase tracking-wider">Performance</span>
                    <span className="text-4xl font-black text-[#6c5ce7]"><Counter target={100} /></span>
                  </div>
                  <div className="neu-raised-sm p-3 rounded-xl overflow-hidden">
                    <div className="h-2.5 rounded-full bg-[#d1d9e6] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#6c5ce7] transition-all duration-[2s] ease-out relative"
                        style={{ width: loaded ? "100%" : "0%" }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { value: "100+", label: "Tests", icon: "✓", color: "#00b894" },
                    { value: "35+", label: "Pages", icon: "◆", color: "#6c5ce7" },
                    { value: "2", label: "Apps", icon: "▲", color: "#e8913a" },
                    { value: "0", label: "Errors", icon: "●", color: "#00b894" },
                  ].map((stat) => (
                    <div key={stat.label} className="neu-flat p-4 text-center hover:scale-105 transition-transform cursor-default">
                      <div className="text-lg mb-1" style={{ color: stat.color }}>{stat.icon}</div>
                      <div className="text-xl font-black text-[#2d3436]">{stat.value}</div>
                      <div className="text-xs text-[#636e72]">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="neu-inset px-4 py-2 text-xs font-semibold text-[#6c5ce7]">Verified</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#6c5ce7]"
                        style={{ opacity: 0.3 + i * 0.15, animation: `pulseGlow ${2 + i * 0.3}s ease-in-out infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Projects ── */
function Projects() {
  const { ref, isVisible } = useInView(0.05);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const projects = [
    {
      title: "Redwood Retreats", subtitle: "Luxury Cabin Rental Platform",
      description: "Canvas grass animation with wind physics, PS5-style particles, 3D tilt cards, and a booking system. Every pixel crafted with intention.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest"],
      liveUrl: "https://redwood-retreats.vercel.app", githubUrl: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      stats: { tests: "41", perf: "100", a11y: "91" },
      gradient: "from-[#e8913a] to-[#c4602a]", year: "2026",
    },
    {
      title: "Cosmic Ray Solar", subtitle: "Full-Stack Solar Company",
      description: "Stripe checkout, Sanity CMS, scheduling, savings calculator. 59 tests, 35 pages, 5 API routes across 15 US states.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      liveUrl: "https://cosmicray-solar.netlify.app", githubUrl: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: { tests: "59", pages: "35", apis: "5" },
      gradient: "from-[#6c5ce7] to-[#a29bfe]", year: "2026",
    },
    {
      title: "Portfolio", subtitle: "Personal Website",
      description: "Neumorphic design with advanced animations, animated counters, and interactive elements. This very site you're looking at.",
      tech: ["Next.js 16", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://portfolio-azurite2.vercel.app", githubUrl: "https://github.com/jewelcruzs0922-dev/Portfolio",
      stats: { lighthouse: "100", design: "Neo", unique: "Yes" },
      gradient: "from-[#00b894] to-[#00cec9]", year: "2026",
    },
  ];

  const scrollTo = useCallback((i: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[i] as HTMLElement;
    if (child) { child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); setActive(i); }
  }, []);

  return (
    <section id="work" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 mb-12">
        <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">Portfolio</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2d3436]">
          <RevealText text="Selected work" />
        </h2>
      </div>

      <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex justify-center gap-2 mb-8">
          {projects.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-500 ${active === i ? "w-10 bg-[#6c5ce7]" : "w-2 bg-[#d1d9e6] hover:bg-[#a29bfe]"}`} />
          ))}
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-6 scrollbar-hide">
          {projects.map((project, i) => (
            <div key={project.title} className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[42vw] snap-center">
              <GlowCard>
                <div className="p-8 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${project.gradient}`} />
                    <span className="text-xs font-semibold text-[#636e72]">{project.year}</span>
                  </div>

                  <span className="text-xs font-semibold text-[#636e72] uppercase tracking-wider">{project.subtitle}</span>
                  <h3 className="text-2xl font-black text-[#2d3436] mt-2 mb-3">{project.title}</h3>
                  <p className="text-[#636e72] text-sm leading-relaxed mb-5">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map((t) => (
                      <span key={t} className="neu-inset px-3 py-1.5 text-xs font-medium text-[#2d3436]">{t}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {Object.entries(project.stats).map(([key, value]) => (
                      <div key={key} className="neu-flat px-3 py-2">
                        <span className="font-bold text-[#6c5ce7]">{value}</span>
                        <span className="text-xs text-[#636e72] ml-1 capitalize">{key}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <MagneticBtn href={project.liveUrl} className="neu-button px-6 py-3 text-sm inline-flex items-center gap-2">
                      Live Demo
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </MagneticBtn>
                    <MagneticBtn href={project.githubUrl} className="neu-flat px-6 py-3 text-sm font-semibold text-[#2d3436] inline-flex items-center">
                      Code
                    </MagneticBtn>
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

/* ── Skills ── */
function Skills() {
  const { ref, isVisible } = useInView();
  const skills = [
    { name: "React", value: 90, color: "#61dafb" },
    { name: "Next.js", value: 95, color: "#6c5ce7" },
    { name: "TypeScript", value: 85, color: "#3178c6" },
    { name: "Tailwind", value: 90, color: "#06b6d4" },
    { name: "Node.js", value: 70, color: "#339933" },
    { name: "Testing", value: 85, color: "#6c5ce7" },
  ];

  return (
    <section id="skills" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-16">
            <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">Skills</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2d3436]">
              <RevealText text="What I know" />
            </h2>
          </div>

          <GlowCard>
            <div className="p-10 lg:p-14">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                {skills.map((s) => <Ring key={s.name} value={s.value} label={s.name} color={s.color} />)}
              </div>

              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y"].map((tool) => (
                  <div key={tool} className="neu-flat p-4 text-center hover:scale-105 transition-transform cursor-default group">
                    <span className="text-sm font-medium text-[#636e72] group-hover:text-[#6c5ce7] transition-colors">{tool}</span>
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

/* ── About ── */
function About() {
  const { ref, isVisible } = useInView();
  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-16">
            <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">About</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2d3436]">
              Code with <span className="text-[#6c5ce7]">soul</span>.
            </h2>
          </div>

          <GlowCard>
            <div className="p-10 lg:p-14">
              <p className="text-lg text-[#636e72] leading-relaxed mb-10">
                I&apos;m Jewel Cruz, a frontend developer from the Philippines. I build web applications that are fast, accessible, and beautiful. Every project carries a piece of me — because I don&apos;t just write code, I feel it.
              </p>

              <div className="space-y-6">
                {[
                  { year: "2024", title: "The Beginning", desc: "Started with HTML, CSS, JavaScript. Built my first websites and fell in love with crafting digital experiences.", color: "#e8913a" },
                  { year: "2025", title: "The Growth", desc: "Mastered React, Next.js, and TypeScript. Built production-grade applications with clean architecture.", color: "#6c5ce7" },
                  { year: "2026", title: "The Craft", desc: "Launched Redwood Retreats and Cosmic Ray Solar. 100+ tests, Lighthouse 100, and a portfolio with soul.", color: "#00b894" },
                ].map((item, i) => (
                  <div key={item.year} className="flex gap-5 items-start group">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="neu-flat w-14 h-14 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 group-hover:scale-110"
                        style={{ color: item.color }}>{item.year.slice(-2)}</div>
                      {i < 2 && <div className="w-px h-20 bg-gradient-to-b from-[#d1d9e6] to-transparent mt-2" />}
                    </div>
                    <div className="neu-inset p-6 flex-1 transition-all duration-300 group-hover:shadow-lg">
                      <h3 className="font-bold text-[#2d3436] mb-2 text-lg">{item.title}</h3>
                      <p className="text-sm text-[#636e72] leading-relaxed">{item.desc}</p>
                    </div>
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
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-2xl">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <GlowCard>
            <div className="p-10 lg:p-14 text-center">
              <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-6">Contact</span>
              <h2 className="text-3xl lg:text-4xl font-black text-[#2d3436] mb-4">Let&apos;s build together</h2>
              <p className="text-[#636e72] mb-10 max-w-md mx-auto">
                Available for freelance and remote positions. Let&apos;s create something great.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticBtn href="mailto:jewel@example.com" className="neu-button px-10 py-4 inline-flex items-center justify-center">
                  Email Me
                </MagneticBtn>
                <MagneticBtn href="https://github.com/jewelcruzs0922-dev" className="neu-flat px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center">
                  GitHub
                </MagneticBtn>
                <MagneticBtn href="https://linkedin.com" className="neu-flat px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center">
                  LinkedIn
                </MagneticBtn>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-6 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="neu-raised-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#636e72]">
          <p>&copy; 2026 Jewel Cruz. Built with passion and Next.js.</p>
          <div className="flex gap-3">
            <span className="neu-inset px-3 py-1 text-xs font-medium text-[#6c5ce7]">100 Lighthouse</span>
            <span className="neu-inset px-3 py-1 text-xs font-medium text-[#6c5ce7]">100+ Tests</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Projects />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
