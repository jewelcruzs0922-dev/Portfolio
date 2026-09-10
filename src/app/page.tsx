"use client";

import { useEffect, useState, useMemo } from "react";

/* ── Seeded Random for SSR-safe particles ── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Particles ── */
function Particles() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const particles = useMemo(() => {
    const rand = seededRandom(42);
    const count = isMobile ? 8 : 20;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${rand() * 100}%`,
      size: `${2 + rand() * 2}px`,
      delay: `${rand() * 10}s`,
      duration: `${12 + rand() * 8}s`,
      opacity: 0.2 + rand() * 0.3,
      color: i % 3 === 0 ? "#f5c842" : i % 3 === 1 ? "#e8913a" : "#c4602a",
    }));
  }, [isMobile]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-10%",
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            animation: `float ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Breathing Glow Orbs ── */
function GlowOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute"
        style={{
          top: "5%",
          left: "0%",
          width: "600px",
          height: "500px",
          background: "radial-gradient(circle, rgba(232, 145, 58, 0.08) 0%, transparent 70%)",
          animation: "breathe 7s ease-in-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "40%",
          right: "-5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(212, 160, 84, 0.06) 0%, transparent 70%)",
          animation: "breathe 9s ease-in-out 2s infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "10%",
          left: "20%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(196, 96, 42, 0.05) 0%, transparent 70%)",
          animation: "breathe 11s ease-in-out 4s infinite",
        }}
      />
    </div>
  );
}

/* ── Scroll-triggered animation hook ── */
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
        scrolled
          ? "bg-[#0f0c09]/95 backdrop-blur-xl border-b border-[#e8913a]/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#" className="group flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#e8913a] shadow-lg shadow-[#e8913a]/50" style={{ animation: "pulse 3s ease-in-out infinite" }} />
          <span className="font-serif text-lg font-bold text-[#fdf6eb]">Jewel Cruz</span>
        </a>
        <div className="flex gap-6 text-sm text-[#b8a892]">
          <a href="#work" className="transition-colors hover:text-[#e8913a]">Work</a>
          <a href="#skills" className="transition-colors hover:text-[#e8913a]">Skills</a>
          <a href="#about" className="transition-colors hover:text-[#e8913a]">About</a>
          <a href="#contact" className="transition-colors hover:text-[#e8913a]">Contact</a>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms]"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/14353714/pexels-photo-14353714.jpeg?w=1920&q=80')",
          opacity: loaded ? 0.15 : 0,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c09] via-[#0f0c09]/80 to-[#0f0c09]/60" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8913a]/20 bg-[#e8913a]/5 px-4 py-2 transition-all duration-1000"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-[#e8913a]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
          <span className="text-xs font-medium tracking-widest uppercase text-[#e8913a]">Frontend Developer</span>
        </div>

        <h1
          className="font-serif text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight text-[#fdf6eb] transition-all duration-1000"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "400ms",
          }}
        >
          I build with
          <br />
          <span className="italic text-[#e8913a]" style={{ textShadow: "0 0 60px rgba(232, 145, 58, 0.3)" }}>
            passion
          </span>
        </h1>

        <p
          className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-[#b8a892] transition-all duration-1000"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "600ms",
          }}
        >
          Every line of code I write carries emotion. I don&apos;t just build websites — I craft experiences that feel alive.
        </p>

        <div
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-1000"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "800ms",
          }}
        >
          <a
            href="#work"
            className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-xl bg-[#e8913a] px-10 text-sm font-semibold text-[#0f0c09] transition-all duration-500 hover:bg-[#c4602a] hover:shadow-xl hover:shadow-[#e8913a]/20"
          >
            <span className="relative z-10">View My Work</span>
            <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex h-14 items-center gap-3 rounded-xl border border-[#e8913a]/30 px-10 text-sm font-semibold text-[#fdf6eb] transition-all duration-500 hover:border-[#e8913a] hover:bg-[#e8913a]/5 hover:text-[#e8913a]"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.5em] text-[#b8a892]/40 uppercase">Scroll</span>
          <div className="relative h-10 w-px bg-gradient-to-b from-[#e8913a]/40 to-transparent">
            <div className="absolute top-0 left-0 h-3 w-px bg-[#e8913a]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
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
      description: "A premium A-frame cabin rental website with canvas grass animations, PS5-style floating particles, and 3D tilt cards. Every pixel was crafted with intention — the warm amber palette, the asymmetric corners, the breathing glow orbs. This project has a soul.",
      tech: ["Next.js 16", "TypeScript", "Tailwind CSS", "Canvas API", "Vitest"],
      liveUrl: "https://redwood-retreats.vercel.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      stats: [
        { label: "Tests", value: "41" },
        { label: "Performance", value: "100" },
        { label: "Accessibility", value: "91" },
      ],
      color: "#e8913a",
    },
    {
      title: "Cosmic Ray Solar",
      subtitle: "Full-Stack Solar Company Website",
      description: "A complete business website with Stripe checkout, Sanity CMS, appointment scheduling, and an interactive savings calculator. 59 tests, 35 pages, 5 API routes. This is not a template — it's a real product.",
      tech: ["Next.js 16", "TypeScript", "Stripe", "Sanity", "Playwright"],
      liveUrl: "https://cosmicray-solar.netlify.app",
      githubUrl: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: [
        { label: "Tests", value: "59" },
        { label: "Pages", value: "35" },
        { label: "API Routes", value: "5" },
      ],
      color: "#f5c842",
    },
  ];

  return (
    <section id="work" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-[#e8913a]">Selected Work</span>
          <h2 className="mt-4 font-serif text-[clamp(2rem,5vw,4rem)] font-bold text-[#fdf6eb]">
            Projects I&apos;m{" "}
            <span className="italic text-[#e8913a]" style={{ textShadow: "0 0 40px rgba(232, 145, 58, 0.2)" }}>
              proud
            </span>{" "}
            of
          </h2>
        </div>

        <div className="space-y-16">
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={i === 0 ? ref1 : ref2}
              className={`group rounded-2xl border border-[#2a2118] bg-[#1c1610]/80 p-8 transition-all duration-1000 hover:border-[${project.color}]/30 hover:shadow-2xl hover:shadow-[${project.color}]/5 ${
                (i === 0 ? vis1 : vis2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <span className="text-xs font-medium tracking-widest uppercase text-[#b8a892]">{project.subtitle}</span>
                  <h3 className="mt-2 font-serif text-3xl font-bold text-[#fdf6eb]">{project.title}</h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-[#b8a892]">{project.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-[#e8913a]/10 bg-[#e8913a]/5 px-3 py-1.5 text-xs font-medium text-[#e8913a]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-6">
                    {project.stats.map((s) => (
                      <div key={s.label}>
                        <span className="text-2xl font-bold text-[#fdf6eb]">{s.value}</span>
                        <span className="ml-1 text-xs text-[#b8a892]">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#e8913a] px-8 py-3 text-sm font-semibold text-[#0f0c09] transition-all duration-300 hover:bg-[#c4602a] hover:shadow-lg hover:shadow-[#e8913a]/20"
                  >
                    Live Demo
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e8913a]/20 px-8 py-3 text-sm font-semibold text-[#fdf6eb] transition-all duration-300 hover:border-[#e8913a] hover:text-[#e8913a]"
                  >
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

/* ── Skills ── */
function Skills() {
  const { ref, isVisible } = useInView();

  const categories = [
    { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"], icon: "🎨" },
    { title: "Tools", skills: ["Git", "GitHub", "Vercel", "Netlify", "Figma"], icon: "🛠" },
    { title: "Testing", skills: ["Vitest", "Playwright", "Jest"], icon: "✅" },
    { title: "Other", skills: ["REST APIs", "SEO", "Accessibility", "Performance"], icon: "🚀" },
  ];

  return (
    <section id="skills" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-[#e8913a]">Expertise</span>
          <h2 className="mt-4 font-serif text-[clamp(2rem,5vw,4rem)] font-bold text-[#fdf6eb]">
            What I{" "}
            <span className="italic text-[#e8913a]" style={{ textShadow: "0 0 40px rgba(232, 145, 58, 0.2)" }}>
              bring
            </span>
          </h2>
        </div>

        <div ref={ref} className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="group rounded-2xl border border-[#2a2118] bg-[#1c1610]/80 p-6 transition-all duration-500 hover:border-[#e8913a]/30 hover:shadow-xl hover:shadow-[#e8913a]/5"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 text-2xl">{cat.icon}</div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#e8913a]">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.skills.map((skill) => (
                  <li key={skill} className="text-sm text-[#b8a892] transition-colors group-hover:text-[#fdf6eb]">{skill}</li>
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
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div ref={ref} className={`grid gap-12 lg:grid-cols-2 items-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div>
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-[#e8913a]">About Me</span>
            <h2 className="mt-4 font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#fdf6eb]">
              I don&apos;t just write code.{" "}
              <span className="italic text-[#e8913a]" style={{ textShadow: "0 0 40px rgba(232, 145, 58, 0.2)" }}>
                I feel it.
              </span>
            </h2>
            <div className="mt-8 space-y-4 text-[#b8a892] leading-relaxed">
              <p>
                I&apos;m Jewel Cruz, a frontend developer from the Philippines. I believe that great software isn&apos;t just functional — it&apos;s emotional. Every project I build carries a piece of me.
              </p>
              <p>
                When I design a website, I think about the person on the other side of the screen. How will they feel when they see the warm glow of an amber accent? How will the smooth animation make them pause and appreciate the craft?
              </p>
              <p>
                I built Redwood Retreats because I wanted to create something beautiful. I built Cosmic Ray Solar because I wanted to solve real problems. Both projects represent who I am — someone who cares deeply about the work they do.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl border border-[#2a2118] bg-[#1c1610] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/14353714/pexels-photo-14353714.jpeg?w=800&q=80"
                alt="A-frame cabin in the forest"
                className="h-full w-full object-cover opacity-40 transition-all duration-700 hover:opacity-60 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c09] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-8">
                  <div>
                    <span className="text-3xl font-bold text-[#fdf6eb]">2</span>
                    <span className="ml-2 text-sm text-[#b8a892]">Projects Shipped</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-[#fdf6eb]">100</span>
                    <span className="ml-2 text-sm text-[#b8a892]">Tests Written</span>
                  </div>
                </div>
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
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-[#e8913a]">Get In Touch</span>
          <h2 className="mt-4 font-serif text-[clamp(2rem,5vw,4rem)] font-bold text-[#fdf6eb]">
            Let&apos;s build something{" "}
            <span className="italic text-[#e8913a]" style={{ textShadow: "0 0 40px rgba(232, 145, 58, 0.2)" }}>
              beautiful
            </span>{" "}
            together
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[#b8a892]">
            I&apos;m always open to new opportunities and interesting projects. Let&apos;s talk.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:jewel@example.com"
              className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-xl bg-[#e8913a] px-10 text-sm font-semibold text-[#0f0c09] transition-all duration-500 hover:bg-[#c4602a] hover:shadow-xl hover:shadow-[#e8913a]/20"
            >
              <span className="relative z-10">Email Me</span>
              <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="https://github.com/jewelcruzs0922-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-xl border border-[#e8913a]/30 px-10 text-sm font-semibold text-[#fdf6eb] transition-all duration-500 hover:border-[#e8913a] hover:bg-[#e8913a]/5 hover:text-[#e8913a]"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-xl border border-[#e8913a]/30 px-10 text-sm font-semibold text-[#fdf6eb] transition-all duration-500 hover:border-[#e8913a] hover:bg-[#e8913a]/5 hover:text-[#e8913a]"
            >
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
    <footer className="border-t border-[#2a2118] py-8 px-6">
      <div className="mx-auto max-w-5xl text-center text-sm text-[#b8a892]/50">
        &copy; 2026 Jewel Cruz. Built with passion, Next.js, and Tailwind CSS.
      </div>
    </footer>
  );
}

/* ── Page ── */
export default function Home() {
  return (
    <>
      <Particles />
      <GlowOrbs />
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
