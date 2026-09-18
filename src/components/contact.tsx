"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTACT } from "@/lib/site";
import { EMPTY_CONTACT_FORM, validateContact } from "@/lib/validate";

const WEB3FORMS_KEY = "b37e1a0c-4a00-492b-abb6-7ea0983dd360";

export default function Contact() {
  const [form, setForm] = useState(EMPTY_CONTACT_FORM);
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validateContact(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          subject: `Portfolio Contact — ${form.name.trim()}`,
          from_name: "Jewel Cruz Portfolio",
          replyto: form.email.trim(),
          to: CONTACT.email,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setForm(EMPTY_CONTACT_FORM);
      } else {
        setStatus("error");
        setErrorMsg(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="relative h-full flex items-center justify-center px-4 md:px-6 md:overflow-hidden">
      <h2 className="sr-only">Contact</h2>
      {/* Form — absolute left, hidden on mobile and tablet */}
      <div className="absolute left-6 md:left-20 lg:left-44 top-1/2 -translate-y-1/2 w-[35%] md:w-[25%] lg:w-[22%] z-10 hidden lg:block">
        {status === "success" ? (
          <div className="py-10" role="status" aria-live="polite">
            <p className="text-lg text-[var(--color-ink)]">Message sent!</p>
            <p className="text-sm text-[var(--color-ink)] opacity-75 mt-1">I&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Header */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[var(--color-ink)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1 Q13 10 23 12 Q13 14 12 23 Q11 14 1 12 Q11 10 12 1 Z" />
              </svg>
              <span className="text-[10px] tracking-[0.3em] text-[var(--color-ink)] font-medium">GET IN TOUCH</span>
              <div className="flex-1 h-px bg-[var(--color-ink)] opacity-25" />
            </div>

            {/* NAME */}
            <div>
              <div className="group relative">
                <div className={`absolute inset-0 panel-clip transition-colors ${errors.name ? "bg-[var(--color-danger)]/80" : "bg-white/40 group-focus-within:bg-[var(--color-cyan)]"} `} aria-hidden="true" />
                <div className="relative m-px panel-clip glass-panel">
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--color-ink)]/10">
                    <div className="flex items-center gap-2 text-[var(--color-ink)]">
                      <svg aria-hidden="true" className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <label htmlFor="name" className="text-[10px] tracking-[0.25em] font-medium">NAME</label>
                    </div>
                  </div>
                  <input id="name" type="text" value={form.name} placeholder="Your name here..."
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent px-4 pt-2.5 pb-3.5 text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/60 outline-none" />
                </div>
              </div>
              {errors.name && (
                <span id="name-error" role="alert" className="text-[10px] text-[var(--color-danger)] mt-1 block">{errors.name}</span>
              )}
            </div>

            {/* E-MAIL */}
            <div>
              <div className="group relative">
                <div className={`absolute inset-0 panel-clip transition-colors ${errors.email ? "bg-[var(--color-danger)]/80" : "bg-white/40 group-focus-within:bg-[var(--color-cyan)]"} `} aria-hidden="true" />
                <div className="relative m-px panel-clip glass-panel">
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--color-ink)]/10">
                    <div className="flex items-center gap-2 text-[var(--color-ink)]">
                      <svg aria-hidden="true" className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 4L12 13L2 4" />
                      </svg>
                      <label htmlFor="email" className="text-[10px] tracking-[0.25em] font-medium">E-MAIL</label>
                    </div>
                  </div>
                  <input id="email" type="email" value={form.email} placeholder="you@example.com"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent px-4 pt-2.5 pb-3.5 text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/60 outline-none" />
                </div>
              </div>
              {errors.email && (
                <span id="email-error" role="alert" className="text-[10px] text-[var(--color-danger)] mt-1 block">{errors.email}</span>
              )}
            </div>

            {/* MESSAGE */}
            <div>
              <div className="group relative">
                <div className={`absolute inset-0 panel-clip transition-colors ${errors.message ? "bg-[var(--color-danger)]/80" : "bg-white/40 group-focus-within:bg-[var(--color-cyan)]"} `} aria-hidden="true" />
                <div className="relative m-px panel-clip glass-panel">
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--color-ink)]/10">
                    <div className="flex items-center gap-2 text-[var(--color-ink)]">
                      <svg aria-hidden="true" className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <label htmlFor="message" className="text-[10px] tracking-[0.25em] font-medium">MESSAGE</label>
                    </div>
                  </div>
                  <textarea id="message" value={form.message} rows={3} placeholder="What would you like to talk about?"
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-transparent px-4 pt-2.5 pb-3.5 text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/60 outline-none resize-none" />
                </div>
              </div>
              {errors.message && (
                <span id="message-error" role="alert" className="text-[10px] text-[var(--color-danger)] mt-1 block">{errors.message}</span>
              )}
            </div>

            {/* Send */}
            {status === "error" && errorMsg && (
              <div role="alert" className="text-[11px] text-[var(--color-danger)] px-1">
                {errorMsg}
              </div>
            )}
            <div className="flex items-center gap-3 mt-1">
              <div className="drop-shadow-[var(--glow-btn)]">
                <button type="submit" disabled={status === "loading"}
                  className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[var(--color-btn-start)] to-[var(--color-btn-end)] text-white text-[11px] tracking-[0.2em] font-medium hover:from-[var(--color-btn-start-hover)] hover:to-[var(--color-btn-end-hover)] transition-all duration-300 clip-path-hex disabled:opacity-60 disabled:cursor-not-allowed">
                  {status === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      SENDING
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                      </svg>
                      SEND
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-1 h-px bg-[var(--color-ink)] opacity-25" />
                <svg className="w-3 h-3 text-[var(--color-ink)] opacity-50 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1 Q13 10 23 12 Q13 14 12 23 Q11 14 1 12 Q11 10 12 1 Z" />
                </svg>
                <span className="text-[9px] tracking-[0.2em] text-[var(--color-ink)] opacity-75 whitespace-nowrap">I&apos;LL REPLY SOON</span>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Girl — feathered white silhouette behind, line art on top */}
      <div className="relative grid">
        <Image src="/serah-tint.webp" alt="" aria-hidden loading="lazy"
          width={896} height={1200}
          className="col-start-1 row-start-1 w-auto h-[100vh] md:h-[120vh] lg:h-[130vh] object-contain mt-[35vh] md:mt-[40vh] lg:mt-[50vh] scale-[1.5] md:scale-[1.1] lg:scale-100 pointer-events-none select-none" />
        <Image src="/serah.webp" alt="Contact illustration" loading="lazy"
          width={896} height={1200}
          className="col-start-1 row-start-1 w-auto h-[100vh] md:h-[120vh] lg:h-[130vh] object-contain mt-[35vh] md:mt-[40vh] lg:mt-[50vh] contrast-[1.4] brightness-[0.85] scale-[1.5] md:scale-[1.1] lg:scale-100" />

        {/* Circle hitboxes on icons */}
        <a href={`mailto:${CONTACT.email}`}
          className="absolute left-[29%] top-[56%] w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full cursor-pointer z-30 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          aria-label="Email" />
        <a href={CONTACT.github} target="_blank" rel="noopener noreferrer"
          className="absolute left-[44%] top-[55%] w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full cursor-pointer z-30 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          aria-label="GitHub" />
        <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer"
          className="absolute right-[26%] top-[57%] w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full cursor-pointer z-30 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          aria-label="Facebook" />
      </div>

      {/* Right side — text */}
      <div className="absolute left-0 right-0 top-8 md:top-[8%] lg:left-auto lg:right-12 lg:top-1/2 lg:-translate-y-1/2 w-full lg:w-[35%] z-20 text-center lg:text-left">
        {/* Label */}
        <div className="hidden lg:flex items-center gap-3 mb-3">
          <svg className="w-3 h-3 text-[var(--color-ink)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1 Q13 10 23 12 Q13 14 12 23 Q11 14 1 12 Q11 10 12 1 Z" />
          </svg>
          <span className="text-[9px] tracking-[0.3em] text-[var(--color-ink)] opacity-80">LET&apos;S CONNECT</span>
          <div className="flex-1 h-px bg-[var(--color-ink)] opacity-20" />
        </div>
        <h3 className="text-[56px] md:text-6xl lg:text-7xl font-extralight tracking-[0.05em] text-[var(--color-ink-deep)] mb-4 md:whitespace-nowrap opacity-100">
          Let&apos;s chat
        </h3>
        <p className="hidden lg:block text-[14px] md:text-[16px] lg:text-[22px] text-[var(--color-ink-deep)] opacity-90 leading-relaxed mb-6">
          Whether it&apos;s a project, a collaboration, or just a friendly hello — I&apos;d love to hear from you. Let&apos;s turn your ideas into something amazing together.
        </p>
        {/* Tagline */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-ink)] opacity-20" />
          <span className="text-[9px] tracking-[0.25em] text-[var(--color-ink)] opacity-75">IDEAS ✦ PROJECTS ✦ TOGETHER</span>
          <div className="flex-1 h-px bg-[var(--color-ink)] opacity-20" />
        </div>
      </div>
    </section>
  );
}
