function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-bold text-[#f5f5f5]">
          Jewel Cruz
        </a>
        <div className="flex gap-6 text-sm text-[#888]">
          <a href="#projects" className="transition-colors hover:text-[#f59e0b]">
            Projects
          </a>
          <a href="#skills" className="transition-colors hover:text-[#f59e0b]">
            Skills
          </a>
          <a href="#contact" className="transition-colors hover:text-[#f59e0b]">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-20 text-center">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-medium tracking-widest uppercase text-[#f59e0b]">
          Frontend Developer
        </p>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#f5f5f5] sm:text-6xl">
          Jewel Cruz
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-[#888]">
          I build beautiful, performant web experiences with Next.js and
          TypeScript.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#projects"
            className="inline-flex h-12 items-center rounded-lg bg-[#f59e0b] px-8 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#d97706]"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center rounded-lg border border-[#333] px-8 text-sm font-semibold text-[#f5f5f5] transition-colors hover:border-[#f59e0b] hover:text-[#f59e0b]"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: "Redwood Retreats",
      description:
        "A luxury A-frame cabin rental platform with canvas animations, 41 tests, and Lighthouse 100/91/100 scores.",
      tech: ["Next.js 16", "TypeScript", "Tailwind CSS", "Vitest"],
      liveUrl: "https://redwood-retreats.vercel.app",
      githubUrl:
        "https://github.com/jewelcruzs0922-dev/redwood-retreats",
      stats: [
        { label: "Tests", value: "41" },
        { label: "Performance", value: "100" },
        { label: "Accessibility", value: "91" },
      ],
    },
    {
      title: "Cosmic Ray Solar",
      description:
        "A full-stack solar company website with e-commerce, Stripe checkout, Sanity CMS, and 59 automated tests.",
      tech: [
        "Next.js 16",
        "TypeScript",
        "Stripe",
        "Sanity",
        "Vitest",
        "Playwright",
      ],
      liveUrl: "https://cosmicray-solar.netlify.app",
      githubUrl:
        "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
      stats: [
        { label: "Tests", value: "59" },
        { label: "Pages", value: "35" },
        { label: "API Routes", value: "5" },
      ],
    },
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-[#f5f5f5]">
          Featured Projects
        </h2>
        <p className="mb-12 text-center text-[#888]">
          A selection of recent work I&apos;m proud of.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group rounded-xl border border-[#222] bg-[#141414] p-6 transition-all hover:border-[#f59e0b] hover:scale-[1.02]"
            >
              <h3 className="mb-2 text-xl font-bold text-[#f5f5f5]">
                {project.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-[#888]">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-[#1a1a1a] px-2.5 py-1 text-xs text-[#f59e0b]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mb-4 flex gap-4 text-xs text-[#888]">
                {project.stats.map((s) => (
                  <span key={s.label}>
                    <span className="font-semibold text-[#f5f5f5]">
                      {s.value}
                    </span>{" "}
                    {s.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#f59e0b] transition-colors hover:text-[#d97706]"
                >
                  Live Demo &rarr;
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#888] transition-colors hover:text-[#f5f5f5]"
                >
                  GitHub &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const categories = [
    {
      title: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
    },
    {
      title: "Tools",
      skills: ["Git", "GitHub", "Vercel", "Netlify", "Figma"],
    },
    {
      title: "Testing",
      skills: ["Vitest", "Playwright", "Jest"],
    },
    {
      title: "Other",
      skills: [
        "REST APIs",
        "SEO",
        "Accessibility",
        "Performance Optimization",
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-[#f5f5f5]">
          Skills &amp; Technologies
        </h2>
        <p className="mb-12 text-center text-[#888]">
          The tools and technologies I work with.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl border border-[#222] bg-[#141414] p-5"
            >
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#f59e0b]">
                {cat.title}
              </h3>
              <ul className="space-y-2">
                {cat.skills.map((skill) => (
                  <li key={skill} className="text-sm text-[#888]">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-[#f5f5f5]">
          Get In Touch
        </h2>
        <p className="mb-8 text-[#888]">
          Let&apos;s build something great together.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:jewel@example.com"
            className="inline-flex h-12 items-center rounded-lg bg-[#f59e0b] px-8 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#d97706]"
          >
            Email Me
          </a>
          <a
            href="https://github.com/jewelcruzs0922-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-lg border border-[#333] px-8 text-sm font-semibold text-[#f5f5f5] transition-colors hover:border-[#f59e0b] hover:text-[#f59e0b]"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-lg border border-[#333] px-8 text-sm font-semibold text-[#f5f5f5] transition-colors hover:border-[#f59e0b] hover:text-[#f59e0b]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#222] py-8 px-6">
      <div className="mx-auto max-w-5xl text-center text-sm text-[#888]">
        &copy; 2026 Jewel Cruz. Built with Next.js and Tailwind CSS.
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
      <Contact />
      <Footer />
    </>
  );
}
