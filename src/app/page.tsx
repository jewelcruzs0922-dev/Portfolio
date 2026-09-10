"use client";

import { useEffect, useState, useRef } from "react";

/* ── Scroll animation hook ── */
function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, isVisible };
}

/* ── Animated counter ── */
function Counter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useInView();

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ── Navigation ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="neu-raised-sm flex items-center justify-between px-6 py-3">
          <span className="text-lg font-bold text-[#2d3436]">JC</span>
          <div className="hidden sm:flex gap-3">
            {["Work", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="neu-flat px-5 py-2 text-sm font-medium text-[#2d3436]">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero — Split layout with neumorphic frame ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* Animated mesh */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0, height = 0, animId = 0, t = 0;

    const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.003;
      for (let i = 0; i < 4; i++) {
        const x = width * (0.2 + i * 0.2) + Math.sin(t + i) * 80;
        const y = height * 0.4 + Math.cos(t * 0.6 + i) * 60;
        const r = 120 + Math.sin(t + i * 0.5) * 40;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(108, 92, 231, ${0.04 + Math.sin(t + i) * 0.02})`);
        g.addColorStop(1, "rgba(108, 92, 231, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          {/* Left — Content */}
          <div className="lg:col-span-7">
            <div
              className="neu-inset inline-flex items-center gap-2 px-4 py-2 mb-8"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.2s" }}
            >
              <div className="h-2 w-2 rounded-full bg-[#6c5ce7] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase">Available for hire</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight text-[#2d3436] leading-[0.9]"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 1s ease 0.3s" }}
            >
              I build
              <br />
              <span className="text-[#6c5ce7]">digital</span>
              <br />
              experiences.
            </h1>

            <p
              className="mt-8 text-lg text-[#636e72] max-w-md leading-relaxed"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 0.6s" }}
            >
              Frontend developer crafting production-grade web applications with Next.js, React, and TypeScript.
            </p>

            <div
              className="mt-8 flex flex-wrap gap-3"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 0.8s" }}
            >
              {["Next.js", "React", "TypeScript", "Tailwind", "Vitest"].map((t, i) => (
                <span key={t} className="neu-flat px-4 py-2 text-sm font-medium text-[#2d3436]"
                  style={{ opacity: loaded ? 1 : 0, transition: `all 0.6s ease ${0.9 + i * 0.1}s` }}>
                  {t}
                </span>
              ))}
            </div>

            <div
              className="mt-10 flex gap-4"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease 1.2s" }}
            >
              <a href="#work" className="neu-button text-base px-10 py-4">View Projects</a>
              <a href="#contact" className="neu-flat px-10 py-4 text-base font-semibold text-[#2d3436] inline-flex items-center">Contact</a>
            </div>
          </div>

          {/* Right — Neumorphic frame with stats */}
          <div className="lg:col-span-5" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0) rotate(0deg)" : "translateX(40px) rotate(2deg)", transition: "all 1.2s ease 0.5s" }}>
            <div className="neu-raised p-8 lg:p-10">
              <div className="neu-inset p-6 mb-6">
                <div className="text-5xl font-extrabold text-[#6c5ce7]"><Counter target={100} /></div>
                <div className="text-sm text-[#636e72] mt-2">Lighthouse Performance</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="neu-flat p-5 text-center">
                  <div className="text-2xl font-bold text-[#6c5ce7]"><Counter target={100} /></div>
                  <div className="text-xs text-[#636e72] mt-1">Tests Passing</div>
                </div>
                <div className="neu-flat p-5 text-center">
                  <div className="text-2xl font-bold text-[#6c5ce7]"><Counter target={35} /></div>
                  <div className="text-xs text-[#636e72] mt-1">Pages Built</div>
                </div>
                <div className="neu-flat p-5 text-center">
                  <div className="text-2xl font-bold text-[#6c5ce7]"><Counter target={2} /></div>
                  <div className="text-xs text-[#636e72] mt-1">Production Apps</div>
                </div>
                <div className="neu-flat p-5 text-center">
                  <div className="text-2xl font-bold text-[#6c5ce7]">0</div>
                  <div className="text-xs text-[#636e72] mt-1">Lint Errors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Projects — Asymmetric layout ── */
function Projects() {
  const { ref: ref1, isVisible: vis1 } = useInView();
  const { ref: ref2, isVisible: vis2 } = useInView();

  const projects = [
    {
      title: "Redwood Retreats",
      subtitle: "Luxury Cabin Rental Platform",
      description: "Canvas grass animation with wind physics, PS5-style particles, 3D tilt cards, and a booking system with dynamic pricing. Lighthouse 100/91/100.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest"],
      liveUrl: "https://redwood-retreats.vercel.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      stats: { tests: "41", performance: "100", a11y: "91" },
      accent: "#e8913a",
    },
    {
      title: "Cosmic Ray Solar",
      subtitle: "Full-Stack Solar Company",
      description: "Stripe checkout, Sanity CMS, scheduling, interactive savings calculator. 59 tests, 35 pages, 5 API routes across 15 US states.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      liveUrl: "https://cosmicray-solar.netlify.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: { tests: "59", pages: "35", apis: "5" },
      accent: "#6c5ce7",
    },
  ];

  return (
    <section id="work" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">Portfolio</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2d3436]">Selected work</h2>
        </div>

        <div className="space-y-12">
          {projects.map((project, i) => (
            <div key={project.title} ref={i === 0 ? ref1 : ref2}
              className={`transition-all duration-1000 ${i === 0 ? "lg:pr-16" : "lg:pl-16"} ${
                (i === 0 ? vis1 : vis2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}>
              <div className="neu-raised p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left — Neumorphic icon frame */}
                  <div className="lg:w-48 flex-shrink-0">
                    <div className="neu-inset w-full aspect-square flex items-center justify-center">
                      <span className="text-4xl font-extrabold" style={{ color: project.accent }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="neu-flat px-3 py-1.5 text-xs font-medium text-[#2d3436]">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right — Content */}
                  <div className="flex-1">
                    <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: project.accent }}>{project.subtitle}</span>
                    <h3 className="text-2xl lg:text-3xl font-bold text-[#2d3436] mt-2 mb-4">{project.title}</h3>
                    <p className="text-[#636e72] leading-relaxed mb-6">{project.description}</p>

                    <div className="flex flex-wrap gap-4 mb-8">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key} className="neu-inset px-4 py-2">
                          <span className="font-bold" style={{ color: project.accent }}>{value}</span>
                          <span className="text-xs text-[#636e72] ml-1 capitalize">{key}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="neu-button inline-flex items-center gap-2">
                        Live Demo
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="neu-flat px-6 py-3 text-sm font-semibold text-[#2d3436] inline-flex items-center">
                        View Code
                      </a>
                    </div>
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

/* ── About — Two-column with neumorphic circle ── */
function About() {
  const { ref, isVisible } = useInView();

  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className={`grid gap-12 lg:grid-cols-2 items-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Left — Neumorphic circle with stats */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="neu-raised w-64 h-64 lg:w-80 lg:h-80 rounded-full flex items-center justify-center">
                <div className="neu-inset w-56 h-56 lg:w-72 lg:h-72 rounded-full flex flex-col items-center justify-center text-center p-6">
                  <div className="text-5xl font-extrabold text-[#6c5ce7]">2+</div>
                  <div className="text-sm text-[#636e72] mt-2">Years learning</div>
                  <div className="text-xs text-[#636e72] mt-1">& building</div>
                </div>
              </div>
              {/* Floating mini cards */}
              <div className="absolute -top-4 -right-4 neu-flat px-4 py-2 text-xs font-semibold text-[#6c5ce7] animate-bounce" style={{ animationDuration: "3s" }}>
                React
              </div>
              <div className="absolute -bottom-4 -left-4 neu-flat px-4 py-2 text-xs font-semibold text-[#e8913a] animate-bounce" style={{ animationDuration: "3.5s" }}>
                Next.js
              </div>
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">About</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2d3436] mb-6">
              I craft code with <span className="text-[#6c5ce7]">intention</span>.
            </h2>
            <div className="space-y-4 text-[#636e72] leading-relaxed">
              <p>
                I&apos;m Jewel Cruz, a frontend developer from the Philippines. I build web applications that are fast, accessible, and beautiful.
              </p>
              <p>
                Every project I build has automated tests, performance optimization, and clean architecture. I believe great software is emotional — it should make people feel something.
              </p>
              <p>
                I&apos;m looking for remote web developer positions with US/EU companies where I can build meaningful products and grow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Contact — Neumorphic card ── */
function Contact() {
  const { ref, isVisible } = useInView();

  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-2xl">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="neu-raised p-10 lg:p-14 text-center">
            <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-6">Contact</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2d3436] mb-4">Let&apos;s work together</h2>
            <p className="text-[#636e72] mb-10 max-w-md mx-auto">
              I&apos;m available for freelance projects and remote positions. Let&apos;s build something great.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:jewel@example.com" className="neu-button px-10 py-4">
                Email Me
              </a>
              <a href="https://github.com/jewelcruzs0922-dev" target="_blank" rel="noopener noreferrer" className="neu-flat px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="neu-flat px-10 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center">
                LinkedIn
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
    <footer className="py-6 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="neu-raised-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#636e72]">
          <p>&copy; 2026 Jewel Cruz. Built with Next.js.</p>
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
      <About />
      <Contact />
      <Footer />
    </>
  );
}
