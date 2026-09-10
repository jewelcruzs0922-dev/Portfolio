"use client";

import { useEffect, useState, useRef } from "react";

/* ── Scroll animation hook ── */
function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
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

/* ── Mouse follower ── */
function MouseFollower() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[100] h-8 w-8 rounded-full border-2 border-[#6c5ce7]/30 transition-all duration-150 ease-out hidden lg:block"
      style={{
        transform: `translate(${pos.x - 16}px, ${pos.y - 16}px)`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="neu-raised-sm flex items-center justify-between px-6 py-3">
          <span className="text-lg font-bold text-[#2d3436]">JC</span>
          <div className="flex gap-4">
            {["Work", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="neu-flat px-4 py-2 text-sm font-medium text-[#2d3436] transition-all"
              >
                {item}
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* Animated mesh background */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId = 0;
    let t = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.005;

      /* Draw soft floating circles */
      for (let i = 0; i < 5; i++) {
        const x = width * 0.2 + Math.sin(t + i * 1.2) * width * 0.15;
        const y = height * 0.3 + Math.cos(t * 0.7 + i * 0.8) * height * 0.15;
        const r = 100 + Math.sin(t + i) * 30;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, `rgba(108, 92, 231, ${0.06 + Math.sin(t + i) * 0.02})`);
        gradient.addColorStop(1, "rgba(108, 92, 231, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center px-6 overflow-hidden">
      {/* Animated mesh background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="mx-auto max-w-5xl w-full relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left content */}
          <div>
            <div
              className="inline-flex items-center gap-2 neu-inset px-4 py-2 mb-6"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease 0.2s",
              }}
            >
              <div className="h-2 w-2 rounded-full bg-[#6c5ce7]" style={{ animation: "pulseGlow 2s ease-in-out infinite" }} />
              <span className="text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase">Available for hire</span>
            </div>

            <h1
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#2d3436] leading-[0.95]"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s ease 0.4s",
              }}
            >
              Jewel Cruz
            </h1>

            <p
              className="mt-4 text-xl font-semibold text-[#6c5ce7]"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s ease 0.5s",
              }}
            >
              Frontend Developer
            </p>

            <p
              className="mt-6 text-lg text-[#636e72] max-w-md leading-relaxed"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s ease 0.6s",
              }}
            >
              I build web applications that are fast, accessible, and measurable. Every project carries intention.
            </p>

            {/* Stack pills */}
            <div
              className="mt-8 flex flex-wrap gap-3"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s ease 0.7s",
              }}
            >
              {["Next.js", "React", "TypeScript", "Tailwind", "Node.js"].map((t, i) => (
                <span
                  key={t}
                  className="neu-flat px-4 py-2 text-sm font-medium text-[#2d3436]"
                  style={{
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.6s ease ${0.8 + i * 0.1}s`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="mt-10 flex gap-4"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s ease 1.2s",
              }}
            >
              <a href="#work" className="neu-button">
                View Projects
              </a>
              <a href="#contact" className="neu-flat px-8 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center">
                Contact
              </a>
            </div>
          </div>

          {/* Right — Stats cards */}
          <div
            className="grid grid-cols-2 gap-4"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateX(0)" : "translateX(30px)",
              transition: "all 1s ease 0.6s",
            }}
          >
            {[
              { value: "100", label: "Lighthouse Score", icon: "⚡" },
              { value: "100+", label: "Tests Passing", icon: "✅" },
              { value: "2", label: "Production Apps", icon: "🚀" },
              { value: "35+", label: "Pages Built", icon: "📦" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="neu-raised p-6 text-center"
                style={{
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-[#6c5ce7]">{stat.value}</div>
                <div className="text-sm text-[#636e72] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Projects ── */
function Projects() {
  const { ref: ref1, isVisible: vis1 } = useInView();
  const { ref: ref2, isVisible: vis2 } = useInView();

  const projects = [
    {
      title: "Redwood Retreats",
      subtitle: "Luxury Cabin Rental Platform",
      description: "Canvas grass animation with wind physics, PS5-style particles, 3D tilt cards, and a booking system. Every detail crafted with intention.",
      tech: ["Next.js 16", "TypeScript", "Canvas API", "Vitest"],
      liveUrl: "https://redwood-retreats.vercel.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      stats: [
        { label: "Tests", value: "41" },
        { label: "Performance", value: "100" },
        { label: "A11y", value: "91" },
      ],
      accent: "#e8913a",
    },
    {
      title: "Cosmic Ray Solar",
      subtitle: "Full-Stack Solar Company Website",
      description: "Stripe checkout, Sanity CMS, scheduling, and an interactive savings calculator. 59 tests, 35 pages, 5 API routes.",
      tech: ["Next.js 16", "Stripe", "Sanity", "Playwright"],
      liveUrl: "https://cosmicray-solar.netlify.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: [
        { label: "Tests", value: "59" },
        { label: "Pages", value: "35" },
        { label: "APIs", value: "5" },
      ],
      accent: "#6c5ce7",
    },
  ];

  return (
    <section id="work" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">Portfolio</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2d3436]">Projects I&apos;m proud of</h2>
        </div>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={i === 0 ? ref1 : ref2}
              className={`neu-raised p-8 transition-all duration-1000 ${
                (i === 0 ? vis1 : vis2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="neu-inset px-3 py-1 text-xs font-semibold" style={{ color: project.accent }}>
                      {project.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#2d3436] mb-3">{project.title}</h3>
                  <p className="text-[#636e72] leading-relaxed mb-6 max-w-lg">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span key={t} className="neu-flat px-3 py-1.5 text-xs font-medium text-[#2d3436]">{t}</span>
                    ))}
                  </div>

                  <div className="flex gap-6">
                    {project.stats.map((s) => (
                      <div key={s.label}>
                        <span className="text-xl font-bold" style={{ color: project.accent }}>{s.value}</span>
                        <span className="ml-1 text-sm text-[#636e72]">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="neu-button inline-flex items-center gap-2">
                    Live Demo
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="neu-flat px-8 py-3 text-sm font-semibold text-[#2d3436] inline-flex items-center justify-center">
                    View Code
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

/* ── About ── */
function About() {
  const { ref, isVisible } = useInView();

  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div ref={ref} className={`grid gap-12 lg:grid-cols-2 items-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div>
            <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">About</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2d3436] mb-6">
              I don&apos;t just write code.{" "}
              <span className="text-[#6c5ce7]">I craft it.</span>
            </h2>
            <div className="space-y-4 text-[#636e72] leading-relaxed">
              <p>
                I&apos;m Jewel Cruz, a frontend developer from the Philippines. I build web applications that are fast, accessible, and beautiful.
              </p>
              <p>
                Every project I build has automated tests, performance optimization, and clean architecture. I believe great software isn&apos;t just functional — it&apos;s emotional.
              </p>
              <p>
                I&apos;m looking for remote web developer positions with US/EU companies where I can build meaningful products.
              </p>
            </div>
          </div>

          <div className="neu-raised p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7] mb-6">What I Bring</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "100+", label: "Tests written" },
                { value: "100", label: "Lighthouse score" },
                { value: "35+", label: "Pages built" },
                { value: "0", label: "Lint errors" },
              ].map((stat) => (
                <div key={stat.label} className="neu-inset p-4 text-center">
                  <div className="text-2xl font-bold text-[#6c5ce7]">{stat.value}</div>
                  <div className="text-sm text-[#636e72] mt-1">{stat.label}</div>
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
      <div className="mx-auto max-w-5xl text-center">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="neu-inset inline-block px-4 py-2 text-xs font-semibold tracking-wider text-[#6c5ce7] uppercase mb-4">Contact</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2d3436] mb-4">Let&apos;s work together</h2>
          <p className="text-[#636e72] mb-10 max-w-md mx-auto">
            I&apos;m available for freelance projects and remote positions. Let&apos;s build something great.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="mailto:jewel@example.com" className="neu-button">
              Email Me
            </a>
            <a href="https://github.com/jewelcruzs0922-dev" target="_blank" rel="noopener noreferrer" className="neu-flat px-8 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="neu-flat px-8 py-4 text-sm font-semibold text-[#2d3436] inline-flex items-center">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="py-8 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="neu-raised-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#636e72]">
          <p>&copy; 2026 Jewel Cruz. Built with Next.js and Tailwind CSS.</p>
          <div className="flex gap-4">
            <span className="neu-inset px-3 py-1 text-xs font-medium text-[#6c5ce7]">Lighthouse 100</span>
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
      <MouseFollower />
      <Nav />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
