import Link from "next/link";

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#e5e5e5] bg-[#fafafa]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold text-[#111]">JC</span>
        <div className="flex gap-6 text-sm text-[#666]">
          <a href="#work" className="transition-colors hover:text-[#2563eb]">Work</a>
          <a href="#about" className="transition-colors hover:text-[#2563eb]">About</a>
          <a href="#contact" className="transition-colors hover:text-[#2563eb]">Contact</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 pt-20">
      <div className="mx-auto max-w-6xl w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left — F-pattern: this is what recruiters scan first */}
          <div>
            <p className="text-sm font-medium text-[#2563eb] mb-4">Frontend Developer</p>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[#111] leading-[0.95]">
              I build web apps
              <br />
              that <span className="text-[#2563eb]">ship</span>.
            </h1>
            <p className="mt-6 text-lg text-[#666] max-w-md leading-relaxed">
              Next.js, React, TypeScript. I turn ideas into production-grade applications with clean code, automated testing, and measurable performance.
            </p>

            {/* Stack keywords — visible immediately for recruiter screening */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "Stripe", "Sanity"].map((t) => (
                <span key={t} className="rounded-md bg-[#f0f0f0] px-3 py-1.5 text-xs font-medium text-[#111]">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <a href="#work" className="inline-flex h-12 items-center rounded-lg bg-[#2563eb] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]">
                View Projects
              </a>
              <a href="#contact" className="inline-flex h-12 items-center rounded-lg border border-[#e5e5e5] px-8 text-sm font-semibold text-[#111] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]">
                Contact
              </a>
            </div>
          </div>

          {/* Right — Business metrics (top-right quadrant = 80% attention) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#e5e5e5] bg-white p-6">
              <p className="text-4xl font-bold text-[#2563eb]">100</p>
              <p className="mt-1 text-sm text-[#666]">Lighthouse Performance</p>
            </div>
            <div className="rounded-xl border border-[#e5e5e5] bg-white p-6">
              <p className="text-4xl font-bold text-[#2563eb]">100+</p>
              <p className="mt-1 text-sm text-[#666]">Automated Tests</p>
            </div>
            <div className="rounded-xl border border-[#e5e5e5] bg-white p-6">
              <p className="text-4xl font-bold text-[#2563eb]">2</p>
              <p className="mt-1 text-sm text-[#666]">Production Apps</p>
            </div>
            <div className="rounded-xl border border-[#e5e5e5] bg-white p-6">
              <p className="text-4xl font-bold text-[#2563eb]">35+</p>
              <p className="mt-1 text-sm text-[#666]">Pages Built</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="work" className="py-24 px-6 bg-white border-y border-[#e5e5e5]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-[#2563eb] mb-2">Selected Work</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-[#111] mb-12">Projects that solve real problems</h2>

        <div className="space-y-8">
          {/* Project 1 — Featured prominently */}
          <div className="group grid gap-8 lg:grid-cols-5 rounded-2xl border border-[#e5e5e5] bg-[#fafafa] p-8 transition-all hover:border-[#2563eb]/30 hover:shadow-lg">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full bg-[#2563eb]/10 px-3 py-1 text-xs font-semibold text-[#2563eb]">Featured</span>
                <span className="text-xs text-[#666]">2026</span>
              </div>
              <h3 className="text-2xl font-bold text-[#111] mb-3">Redwood Retreats</h3>
              <p className="text-[#666] leading-relaxed mb-6">
                A luxury A-frame cabin rental platform. Canvas-based grass animation with wind physics, PS5-style floating particles, 3D tilt cards, and a booking system with dynamic pricing. Built for performance — Lighthouse 100/91/100.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Next.js 16", "TypeScript", "Tailwind CSS", "Canvas API", "Vitest"].map((t) => (
                  <span key={t} className="rounded-md bg-[#f0f0f0] px-2.5 py-1 text-xs font-medium text-[#111]">{t}</span>
                ))}
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-[#111]">41</span>
                  <span className="text-[#666] ml-1">tests</span>
                </div>
                <div>
                  <span className="font-bold text-[#111]">100</span>
                  <span className="text-[#666] ml-1">Performance</span>
                </div>
                <div>
                  <span className="font-bold text-[#111]">91</span>
                  <span className="text-[#666] ml-1">Accessibility</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col justify-center gap-3">
              <Link href="https://redwood-retreats.vercel.app" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]">
                Live Demo →
              </Link>
              <Link href="https://github.com/jewelcruzs0922-dev/redwood-retreats" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] px-6 py-3 text-sm font-semibold text-[#111] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]">
                View Code
              </Link>
            </div>
          </div>

          {/* Project 2 */}
          <div className="group grid gap-8 lg:grid-cols-5 rounded-2xl border border-[#e5e5e5] bg-[#fafafa] p-8 transition-all hover:border-[#2563eb]/30 hover:shadow-lg">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full bg-[#111]/5 px-3 py-1 text-xs font-semibold text-[#111]">Full-Stack</span>
                <span className="text-xs text-[#666]">2026</span>
              </div>
              <h3 className="text-2xl font-bold text-[#111] mb-3">Cosmic Ray Solar</h3>
              <p className="text-[#666] leading-relaxed mb-6">
                A complete solar energy company website with Stripe checkout, Sanity CMS, appointment scheduling, interactive savings calculator, and service area pages for 15 US states. 59 tests, 35 pages, 5 API routes.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Next.js 16", "TypeScript", "Stripe", "Sanity", "Playwright"].map((t) => (
                  <span key={t} className="rounded-md bg-[#f0f0f0] px-2.5 py-1 text-xs font-medium text-[#111]">{t}</span>
                ))}
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-[#111]">59</span>
                  <span className="text-[#666] ml-1">tests</span>
                </div>
                <div>
                  <span className="font-bold text-[#111]">35</span>
                  <span className="text-[#666] ml-1">pages</span>
                </div>
                <div>
                  <span className="font-bold text-[#111]">5</span>
                  <span className="text-[#666] ml-1">API routes</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col justify-center gap-3">
              <Link href="https://cosmicray-solar.netlify.app" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]">
                Live Demo →
              </Link>
              <Link href="https://github.com/jewelcruzs0922-dev/cosmicray-solar" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] px-6 py-3 text-sm font-semibold text-[#111] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]">
                View Code
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-[#2563eb] mb-2">About</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#111] mb-6">
              I solve problems with code, not just write it.
            </h2>
            <div className="space-y-4 text-[#666] leading-relaxed">
              <p>
                I&apos;m Jewel Cruz, a frontend developer from the Philippines. I specialize in building production-grade web applications that are fast, accessible, and measurable.
              </p>
              <p>
                Every project I build has automated tests, performance optimization, and clean architecture. I don&apos;t cut corners — I build things right.
              </p>
              <p>
                I&apos;m looking for remote web developer positions with US/EU companies where I can build beautiful, functional websites and grow my skills.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2563eb] mb-6">What I Bring</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl font-bold text-[#111]">100+</p>
                  <p className="text-sm text-[#666]">Automated tests written</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111]">100</p>
                  <p className="text-sm text-[#666]">Lighthouse Performance</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111]">35+</p>
                  <p className="text-sm text-[#666]">Production pages built</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111]">0</p>
                  <p className="text-sm text-[#666]">Lint errors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-white border-t border-[#e5e5e5]">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-medium text-[#2563eb] mb-2">Contact</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-[#111] mb-4">Let&apos;s work together</h2>
        <p className="text-[#666] mb-10 max-w-md mx-auto">
          I&apos;m available for freelance projects and full-time remote positions. Let&apos;s build something great.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="mailto:jewel@example.com" className="inline-flex h-12 items-center rounded-lg bg-[#2563eb] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]">
            Email Me
          </a>
          <a href="https://github.com/jewelcruzs0922-dev" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-lg border border-[#e5e5e5] px-8 text-sm font-semibold text-[#111] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center rounded-lg border border-[#e5e5e5] px-8 text-sm font-semibold text-[#111] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]">
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] py-6 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666]">
        <p>&copy; 2026 Jewel Cruz. Built with Next.js and Tailwind CSS.</p>
        <div className="flex gap-4">
          <span>Lighthouse: 100/100/100</span>
          <span>·</span>
          <span>100+ tests passing</span>
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
      <About />
      <Contact />
      <Footer />
    </>
  );
}
