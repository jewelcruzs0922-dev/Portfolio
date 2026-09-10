"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ── Scroll animation hook ── */
function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } },
      { threshold }
    );
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
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span ref={ref}>{count}</span>;
}

/* ── Circular progress ring ── */
function ProgressRing({ value, label, color = "#6c5ce7" }: { value: number; label: string; color?: string }) {
  const { ref, isVisible } = useInView();
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (isVisible ? (value / 100) * circumference : 0);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#d1d9e6" strokeWidth="8" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>{isVisible ? value : 0}%</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-[#636e72]">{label}</span>
    </div>
  );
}

/* ── Neumorphic toggle ── */
function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn(!on)} className="flex items-center gap-3 group" aria-label={label}>
      <div className={`relative w-14 h-7 rounded-full transition-all duration-300 ${on ? "bg-[#6c5ce7]" : "neu-inset"}`}
        style={on ? { boxShadow: "inset 3px 3px 6px rgba(80, 60, 180, 0.4), inset -3px -3px 6px rgba(130, 110, 255, 0.4)" } : {}}>
        <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${on ? "left-8 bg-white shadow-lg" : "left-1 neu-flat"}`} />
      </div>
      <span className="text-sm font-medium text-[#2d3436]">{label}</span>
    </button>
  );
}

/* ── Navigation ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home", "work", "skills", "about", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="neu-raised-sm flex items-center justify-between px-6 py-3">
          <span className="text-lg font-bold text-[#2d3436]">JC</span>
          <div className="hidden sm:flex gap-2">
            {["Home", "Work", "Skills", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeSection === item.toLowerCase()
                    ? "bg-[#6c5ce7] text-white shadow-lg shadow-[#6c5ce7]/30"
                    : "text-[#636e72] hover:text-[#2d3436]"
                }`}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero — Massive typography with neumorphic depth ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center px-6 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 15}%`,
              background: `rgba(108, 92, 231, ${0.03 + i * 0.01})`,
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }} />
        ))}
      </div>

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left — Content */}
          <div className="lg:col-span-7">
            <div className="neu-inset inline-flex items-center gap-2 px-4 py-2 mb-6"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.2s" }}>
              <div className="h-2 w-2 rounded-full bg-[#6c5ce7] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase">Available for hire</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-[#2d3436] leading-[0.85]"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(50px)", transition: "all 1s ease 0.3s" }}>
              <span className="block">Jewel</span>
              <span className="block text-[#6c5ce7]">Cruz</span>
            </h1>

            <p className="mt-6 text-xl text-[#636e72] max-w-md leading-relaxed"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 0.6s" }}>
              Frontend developer building <span className="font-semibold text-[#2d3436]">production-grade</span> web applications with emotion and precision.
            </p>

            <div className="mt-8 flex flex-wrap gap-3"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 0.8s" }}>
              {["Next.js", "React", "TypeScript", "Tailwind", "Vitest"].map((t, i) => (
                <span key={t} className="neu-flat px-5 py-2.5 text-sm font-semibold text-[#2d3436]"
                  style={{ opacity: loaded ? 1 : 0, transition: `all 0.6s ease ${0.9 + i * 0.1}s` }}>{t}</span>
              ))}
            </div>

            <div className="mt-10 flex gap-4"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 1.2s" }}>
              <a href="#work" className="neu-button text-base px-10 py-4">View Projects</a>
              <a href="#contact" className="neu-flat px-10 py-4 text-base font-semibold text-[#2d3436] inline-flex items-center">Contact</a>
            </div>
          </div>

          {/* Right — Interactive neumorphic dashboard */}
          <div className="lg:col-span-5" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(50px)", transition: "all 1.2s ease 0.5s" }}>
            <div className="neu-raised p-8">
              <div className="neu-inset p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#636e72] uppercase tracking-wider">Performance</span>
                  <span className="text-3xl font-black text-[#6c5ce7]"><Counter target={100} /></span>
                </div>
                <div className="neu-raised-sm p-3 rounded-xl overflow-hidden">
                  <div className="h-2 rounded-full bg-[#d1d9e6]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] transition-all duration-1000"
                      style={{ width: loaded ? "100%" : "0%" }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: "100+", label: "Tests", icon: "✓" },
                  { value: "35+", label: "Pages", icon: "◆" },
                  { value: "2", label: "Apps", icon: "▲" },
                  { value: "0", label: "Errors", icon: "●" },
                ].map((stat) => (
                  <div key={stat.label} className="neu-flat p-4 text-center">
                    <div className="text-[#6c5ce7] text-lg mb-1">{stat.icon}</div>
                    <div className="text-xl font-bold text-[#2d3436]">{stat.value}</div>
                    <div className="text-xs text-[#636e72]">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Toggle label="Dark Mode" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Projects — Horizontal scroll with 3D tilt ── */
function Projects() {
  const { ref, isVisible } = useInView(0.05);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = [
    {
      title: "Redwood Retreats",
      subtitle: "Luxury Cabin Rental",
      description: "Canvas grass with wind physics, PS5-style particles, 3D tilt cards, booking system. Every pixel crafted with intention.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest"],
      liveUrl: "https://redwood-retreats.vercel.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      stats: { tests: "41", perf: "100", a11y: "91" },
      gradient: "from-[#e8913a] to-[#c4602a]",
    },
    {
      title: "Cosmic Ray Solar",
      subtitle: "Full-Stack Solar Company",
      description: "Stripe checkout, Sanity CMS, scheduling, savings calculator. 59 tests, 35 pages, 5 API routes.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      liveUrl: "https://cosmicray-solar.netlify.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: { tests: "59", pages: "35", apis: "5" },
      gradient: "from-[#6c5ce7] to-[#a29bfe]",
    },
    {
      title: "Portfolio",
      subtitle: "Personal Website",
      description: "Neumorphic design with advanced animations, animated counters, and interactive elements.",
      tech: ["Next.js 16", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://portfolio-azurite2.vercel.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/Portfolio",
      stats: { lighthouse: "100", tests: "0", pages: "1" },
      gradient: "from-[#00b894] to-[#00cec9]",
    },
  ];

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setActiveIndex(index);
    }
  }, []);

  return (
    <section id="work" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 mb-12">
        <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">Portfolio</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2d3436]">Selected work</h2>
      </div>

      <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        {/* Scroll indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {projects.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === i ? "bg-[#6c5ce7] scale-125" : "bg-[#d1d9e6]"}`} />
          ))}
        </div>

        {/* Horizontal scroll */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-6 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {projects.map((project, i) => (
            <div key={project.title} className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[45vw] snap-center">
              <div className="neu-raised p-8 h-full group cursor-pointer transition-all duration-500 hover:scale-[1.02]"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
                }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "perspective(1000px) rotateY(0) rotateX(0) scale(1)"; }}>
                {/* Gradient header */}
                <div className={`h-2 rounded-full bg-gradient-to-r ${project.gradient} mb-6 w-16`} />

                <span className="text-xs font-semibold text-[#636e72] uppercase tracking-wider">{project.subtitle}</span>
                <h3 className="text-2xl font-bold text-[#2d3436] mt-2 mb-4">{project.title}</h3>
                <p className="text-[#636e72] text-sm leading-relaxed mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span key={t} className="neu-inset px-3 py-1.5 text-xs font-medium text-[#2d3436]">{t}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="neu-flat px-3 py-2">
                      <span className="font-bold text-[#6c5ce7]">{value}</span>
                      <span className="text-xs text-[#636e72] ml-1 capitalize">{key}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="neu-button px-6 py-3 text-sm inline-flex items-center gap-2">
                    Live Demo
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="neu-flat px-6 py-3 text-sm font-semibold text-[#2d3436] inline-flex items-center">
                    Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Skills — Circular progress rings ── */
function Skills() {
  const { ref, isVisible } = useInView();

  const skills = [
    { name: "React", value: 90, color: "#61dafb" },
    { name: "Next.js", value: 95, color: "#000000" },
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2d3436]">What I know</h2>
          </div>

          <div className="neu-raised p-10 lg:p-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
              {skills.map((skill) => (
                <ProgressRing key={skill.name} value={skill.value} label={skill.name} color={skill.color} />
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Git", "GitHub", "Vercel", "Netlify", "Figma", "REST APIs", "SEO", "A11y"].map((tool) => (
                <div key={tool} className="neu-flat p-4 text-center">
                  <span className="text-sm font-medium text-[#2d3436]">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── About — Neumorphic timeline ── */
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

          <div className="neu-raised p-10 lg:p-14">
            <p className="text-lg text-[#636e72] leading-relaxed mb-8">
              I&apos;m Jewel Cruz, a frontend developer from the Philippines. I build web applications that are fast, accessible, and beautiful. Every project carries a piece of me.
            </p>

            {/* Timeline */}
            <div className="space-y-8">
              {[
                { year: "2024", title: "Started Learning", desc: "Began my journey with HTML, CSS, and JavaScript. Built my first websites." },
                { year: "2025", title: "React & Next.js", desc: "Mastered modern frameworks. Built production-grade applications with TypeScript." },
                { year: "2026", title: "Full-Stack Projects", desc: "Launched Redwood Retreats and Cosmic Ray Solar. 100+ tests, Lighthouse 100." },
              ].map((item, i) => (
                <div key={item.year} className="flex gap-6 items-start">
                  <div className="flex flex-col items-center">
                    <div className="neu-flat w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-[#6c5ce7]">{item.year.slice(-2)}</div>
                    {i < 2 && <div className="w-px h-16 bg-[#d1d9e6] mt-2" />}
                  </div>
                  <div className="neu-inset p-5 flex-1">
                    <h3 className="font-bold text-[#2d3436] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#636e72]">{item.desc}</p>
                  </div>
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
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-2xl">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="neu-raised p-10 lg:p-14 text-center">
            <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-6">Contact</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#2d3436] mb-4">Let&apos;s build together</h2>
            <p className="text-[#636e72] mb-10 max-w-md mx-auto">
              Available for freelance and remote positions. Let&apos;s create something great.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:jewel@example.com" className="neu-button px-10 py-4">Email Me</a>
              <a href="https://github.com/jewelcruzs0922-dev" target="_blank" rel="noopener noreferrer"
                className="neu-flat px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center">GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="neu-flat px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center">LinkedIn</a>
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
    <footer className="py-6 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="neu-raised-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#636e72]">
          <p>&copy; 2026 Jewel Cruz.</p>
          <div className="flex gap-3">
            <span className="neu-inset px-3 py-1 text-xs font-medium text-[#6c5ce7]">100 Lighthouse</span>
            <span className="neu-inset px-3 py-1 text-xs font-medium text-[#6c5ce7]">100+ Tests</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ── */
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
