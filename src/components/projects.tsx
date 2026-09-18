"use client";

import { useState } from "react";
import Image from "next/image";
import { PROJECTS } from "@/lib/site";

export default function Projects() {
  const [selected, setSelected] = useState(0);
  const [imageKey, setImageKey] = useState(0);

  const projects = PROJECTS;

  const select = (idx: number) => {
    if (idx === selected) return;
    setImageKey((k) => k + 1);
    setSelected(idx);
  };

  return (
    <section id="projects" className="h-full flex flex-col py-8 md:py-16 pb-24 md:pb-28 px-3 md:px-6">
      <div className="max-w-6xl mx-auto w-full my-auto">
        {/* Section header */}
        <div className="text-center mb-3 md:mb-6">
          <h2 className="text-xl md:text-6xl lg:text-7xl font-extralight tracking-[0.15em] text-[var(--color-ink)]">
            PROJECTS
          </h2>
        </div>

        {/* Circle indicators */}
        <div className="flex items-center justify-center gap-5 md:gap-4 mb-4 md:mb-8">
          {Array.from({ length: projects.length }).map((_, i) => {
            const isActive = i === selected;
            return (
              <button key={i}
                onClick={() => select(i)}
                className={`relative w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-400 cursor-pointer`}>
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-[var(--color-cyan)] opacity-30 blur-sm" />
                )}
                <span className={`absolute inset-0 rounded-full transition-all duration-400 ${
                  isActive
                    ? "bg-[var(--color-cyan)] shadow-[0_0_10px_rgba(120,216,240,0.7)]"
                    : "bg-[var(--color-ink)] opacity-40 hover:opacity-60"
                }`} />
              </button>
            );
          })}
        </div>

        {/* Content container */}
        <div className="border border-white/15 bg-white/[0.08] p-4 md:p-10">

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 items-center">

            {/* LEFT — Logo, name */}
            <div className="flex flex-col items-center gap-3 md:gap-6">
              {/* Logo with arrows */}
              <div className="flex items-center gap-3 md:gap-5">
                {/* Prev arrow */}
                <button onClick={() => select(Math.max(selected - 1, 0))}
                  disabled={selected === 0}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-white/20 transition-all duration-300 ${
                    selected === 0
                      ? "opacity-20 cursor-default"
                      : "opacity-60 hover:border-[var(--color-cyan)] hover:opacity-100 cursor-pointer"
                  }`}>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-ink)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Logo — SVGs bypass the optimizer, which refuses them unless
                    dangerouslyAllowSVG is enabled, and which they don't need. */}
                <div key={imageKey} className="w-20 h-20 md:w-52 md:h-52 flex items-center justify-center animate-projectFadeIn">
                  <Image src={projects[selected].logo} alt={`${projects[selected].title} logo`}
                    width={208} height={208} loading="lazy" unoptimized
                    className="w-full h-full object-contain animate-logoShine" />
                </div>

                {/* Next arrow */}
                <button onClick={() => select(Math.min(selected + 1, projects.length - 1))}
                  disabled={selected === projects.length - 1}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-white/20 transition-all duration-300 ${
                    selected === projects.length - 1
                      ? "opacity-20 cursor-default"
                      : "opacity-60 hover:border-[var(--color-cyan)] hover:opacity-100 cursor-pointer"
                  }`}>
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-ink)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Project name */}
              <div className="text-center">
                <h3 className="text-lg md:text-3xl font-light tracking-[0.08em] text-[var(--color-ink)] opacity-100">
                  {projects[selected].title}
                </h3>
              </div>
            </div>

            {/* RIGHT — Description + buttons */}
            <div className="flex flex-col gap-2 md:gap-5">
              {/* Description */}
              <div>
                <p className="text-[13px] md:text-xl text-[var(--color-ink)] opacity-100 leading-relaxed">
                  {projects[selected].desc}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-2.5 md:gap-4">
                <a href={projects[selected].live} target="_blank" rel="noopener noreferrer"
                  className="px-4 md:px-8 py-2.5 md:py-3.5 border border-[var(--color-cyan)] text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] text-[var(--color-ink)] opacity-100 hover:bg-[var(--color-cyan)] hover:text-white transition-all duration-300">
                  VIEW LIVE
                </a>
                <a href={projects[selected].code} target="_blank" rel="noopener noreferrer"
                  className="px-4 md:px-8 py-2.5 md:py-3.5 border border-white/20 text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] text-[var(--color-ink)] opacity-100 hover:border-[var(--color-cyan)] transition-all duration-300">
                  VIEW CODE
                </a>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 md:gap-x-6 md:gap-y-2">
                {projects[selected].highlights.map((h) => (
                  <span key={h} className="text-[10px] md:text-[15px] tracking-[0.03em] md:tracking-[0.05em] text-[var(--color-ink)] opacity-80">
                    {h}
                  </span>
                ))}
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-3">
                {projects[selected].tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 md:px-4 md:py-2 text-[10px] md:text-[13px] tracking-[0.08em] md:tracking-[0.1em] text-[var(--color-ink)] border border-white/20 bg-white/[0.03]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
