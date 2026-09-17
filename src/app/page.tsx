"use client";

import { useEffect, useState, useRef, useCallback, type JSX } from "react";
import Image from "next/image";
import { CONTACT, PROJECTS, SLIDES } from "@/lib/site";
import { EMPTY_CONTACT_FORM, validateContact } from "@/lib/validate";

/* ══════════════════════════════════════════════════════════════
   HEXAGON CANVAS BACKGROUND
   ══════════════════════════════════════════════════════════════ */
function HexagonCanvas({ currentSlide }: { currentSlide: number }) {
  const staticRef = useRef<HTMLCanvasElement>(null);
  const starRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const drawStatic = useCallback(() => {
    const canvas = staticRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.innerWidth < 768 ? 1 : window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h_screen = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h_screen * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h_screen + "px";
    ctx.scale(dpr, dpr);

    // Responsive hex size
    const isMobile = w < 768;
    const size = isMobile ? 28 : 40;
    const hexH = size * Math.sqrt(3);
    const cols = Math.ceil(w / (size * 1.5)) + (isMobile ? 2 : 6);
    const rows = Math.ceil(h_screen * 0.5 / hexH) + (isMobile ? 0 : 2);
    const cutoffY = isMobile ? 0.4 : 0.45;

    const cx = w / 2;
    const cy = h_screen * cutoffY;
    for (let row = -1; row < rows; row++) {
      for (let col = -3; col < cols; col++) {
        const x = col * size * 1.5;
        const y = row * hexH + (col % 2 !== 0 ? hexH / 2 : 0);
        const nx = x / w;
        const ny = y / h_screen;
        // Exclude center — less aggressive on mobile to show more corners
        const dx = (x - cx) / (w * (isMobile ? 0.35 : 0.45));
        const dy = (y - cy) / (h_screen * (isMobile ? 0.3 : 0.5));
        if (dx * dx + dy * dy < (isMobile ? 1.5 : 0.85)) continue;
        if (ny > cutoffY) continue;
        // Remove the 2 isolated hexagons at top center
        const isolatedLeft = Math.abs(nx - 0.38) < 0.05 && ny < 0.08;
        const isolatedRight = Math.abs(nx - 0.58) < 0.05 && ny < 0.08;
        if (isolatedLeft || isolatedRight) continue;
        const hue = 195 + nx * 20;
        const sat = 55 + nx * 15;
        const lit = 78;
        const a = 0.85;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // radial glow fill
        const ig = ctx.createRadialGradient(x, y, 0, x, y, size);
        ig.addColorStop(0, `hsla(${hue}, ${sat}%, ${lit}%, ${a * 0.5})`);
        ig.addColorStop(0.7, `hsla(${hue}, ${sat - 10}%, ${lit - 5}%, ${a * 0.2})`);
        ig.addColorStop(1, `hsla(${hue}, ${sat - 20}%, ${lit}%, 0)`);
        ctx.fillStyle = ig;
        ctx.fill();

        // outer glow stroke — blue
        ctx.strokeStyle = `hsla(210, 70%, 80%, ${a})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // inner bright edge — pink
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `hsla(330, 60%, 85%, ${a * 0.5})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // ray trace — primary reflection (top-right edge)
        ctx.beginPath();
        ctx.moveTo(x + (size - 1), y);
        ctx.lineTo(x + (size - 1) * 0.5, y - (size - 1) * 0.866);
        ctx.strokeStyle = `hsla(${hue + 15}, 40%, 95%, ${a * 0.85})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = `hsla(${hue}, 60%, 90%, 0.75)`;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // ray trace — secondary reflection (top-left edge, dimmer)
        ctx.beginPath();
        ctx.moveTo(x + (size - 1) * 0.5, y - (size - 1) * 0.866);
        ctx.lineTo(x - (size - 1) * 0.5, y - (size - 1) * 0.866);
        ctx.strokeStyle = `hsla(${hue + 20}, 35%, 92%, ${a * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // ray trace — specular highlight point
        const hx = x + (size - 2) * 0.75;
        const hy = y - (size - 2) * 0.433;
        const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, size * 0.35);
        hg.addColorStop(0, `hsla(${hue + 10}, 30%, 98%, ${a * 0.6})`);
        hg.addColorStop(0.5, `hsla(${hue}, 40%, 92%, ${a * 0.2})`);
        hg.addColorStop(1, `hsla(${hue}, 30%, 85%, 0)`);
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(hx, hy, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    drawStatic();
    const onResize = () => drawStatic();
    window.addEventListener("resize", onResize);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return () => window.removeEventListener("resize", onResize);

    const isMobileView = window.innerWidth < 768;
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const frameInterval = isTouch ? 1000 / 30 : 0;
    let lastFrame = 0;

    const starCanvas = starRef.current;
    if (!starCanvas) return;
    const ctx = starCanvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h_screen = window.innerHeight;
    starCanvas.width = w * dpr;
    starCanvas.height = h_screen * dpr;
    starCanvas.style.width = w + "px";
    starCanvas.style.height = h_screen + "px";
    ctx.scale(dpr, dpr);

    const centerX = w * 0.5;
    const centerY = h_screen * 0.25;
    const isMobile = w < 768;
    const trailCount = isMobile ? 20 : 40;
    const baseAngles: number[] = [];
    for (let i = 0; i < trailCount; i++) {
      baseAngles.push((i * 137.508) * Math.PI / 180);
    }

    const drawStars = (time: number) => {
      if (currentSlide !== 0) {
        return;
      }
      if (frameInterval && time - lastFrame < frameInterval) {
        rafRef.current = requestAnimationFrame(drawStars);
        return;
      }
      lastFrame = time;
      const t = time * 0.0005;
      ctx.clearRect(0, 0, w, h_screen);

      // star trails
      for (let i = 0; i < trailCount; i++) {
        const radius = 30 + i * 8;
        const arcLen = 0.5 + (i % 5) * 0.6 + Math.sin(t * 0.8 + i) * 0.15;
        const sa = baseAngles[i] + t * (0.25 + (i % 3) * 0.1) + Math.sin(t * 0.5 + i * 0.3) * 0.05;
        const alpha = 0.35 + (1 - i / trailCount) * 0.5;
        const lw = 1.2 + (i % 4) * 0.4;

        // color shift — inner trails more blue, outer trails more pink
        const ratio = i / trailCount;
        const cr = Math.round(180 + ratio * 60);
        const cg = Math.round(220 - ratio * 30);
        const cb = 255;

        // outer glow layer
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, sa, sa + arcLen);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.15})`;
        ctx.lineWidth = lw + 6;
        ctx.stroke();

        // mid glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, sa, sa + arcLen);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.3})`;
        ctx.lineWidth = lw + 3;
        ctx.stroke();

        // main trail
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, sa, sa + arcLen);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = lw;
        ctx.stroke();

        // bright head at end — layered glow
        const hx = centerX + radius * Math.cos(sa + arcLen);
        const hy = centerY + radius * Math.sin(sa + arcLen);

        // outer head glow
        const headGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 5);
        headGrad.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        headGrad.addColorStop(0.3, `rgba(${cr},${cg},${cb},${alpha * 0.5})`);
        headGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();

        // core head
        ctx.beginPath();
        ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha * 1.5, 1)})`;
        ctx.fill();

        // trailing particles — sparkle dust behind the head
        const particleCount = isMobile ? 1 : 3;
        for (let p = 0; p < particleCount; p++) {
          const pDist = 3 + p * 4 + Math.sin(t * 2 + i + p) * 2;
          const pAngle = sa + arcLen - (pDist / radius);
          const px = centerX + radius * Math.cos(pAngle);
          const py = centerY + radius * Math.sin(pAngle);
          const pAlpha = alpha * (0.45 - p * 0.12) * (0.7 + Math.sin(t * 5 + i * 3 + p * 2) * 0.3);
          ctx.beginPath();
          ctx.arc(px, py, 0.6 + Math.sin(t * 4 + i + p) * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${pAlpha})`;
          ctx.fill();
        }
      }

      // scattered bright stars — center-left and center-right below star trail (desktop only)
      if (!isMobile) {
        const brightStars = [
          { bx: 0.08, by: 0.45, r: 8 }, { bx: 0.15, by: 0.5, r: 6 },
          { bx: 0.22, by: 0.48, r: 9 }, { bx: 0.28, by: 0.52, r: 7 },
          { bx: 0.32, by: 0.46, r: 5 }, { bx: 0.12, by: 0.55, r: 6 },
          { bx: 0.25, by: 0.58, r: 5 }, { bx: 0.18, by: 0.53, r: 7 },
          { bx: 0.68, by: 0.45, r: 8 }, { bx: 0.75, by: 0.5, r: 6 },
          { bx: 0.82, by: 0.48, r: 9 }, { bx: 0.88, by: 0.52, r: 7 },
          { bx: 0.72, by: 0.46, r: 5 }, { bx: 0.78, by: 0.55, r: 6 },
          { bx: 0.85, by: 0.58, r: 5 }, { bx: 0.92, by: 0.53, r: 7 },
        ];

        for (let i = 0; i < brightStars.length; i++) {
          const s = brightStars[i];
          const sx = w * s.bx;
          const sy = h_screen * s.by;
          const twinkle = 0.5 + Math.sin(t * 3 + i * 2.5) * 0.5;
          const sr = s.r * twinkle;

          // 4-pointed star shape with curved sides
          ctx.beginPath();
          ctx.moveTo(sx, sy - sr);
          ctx.quadraticCurveTo(sx + sr * 0.3, sy - sr * 0.3, sx + sr, sy);
          ctx.quadraticCurveTo(sx + sr * 0.3, sy + sr * 0.3, sx, sy + sr);
          ctx.quadraticCurveTo(sx - sr * 0.3, sy + sr * 0.3, sx - sr, sy);
          ctx.quadraticCurveTo(sx - sr * 0.3, sy - sr * 0.3, sx, sy);
          ctx.closePath();
          ctx.fillStyle = `rgba(255,255,255,${0.7 * twinkle})`;
          ctx.fill();

        // glow
        ctx.beginPath();
        ctx.arc(sx, sy, sr * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${0.1 * twinkle})`;
        ctx.fill();
        }
      }

      if (!isMobileView) {
        rafRef.current = requestAnimationFrame(drawStars);
      }
    };

    const startAnimation = () => {
      if (isMobileView) {
        drawStars(performance.now());
        return;
      }
      rafRef.current = requestAnimationFrame(drawStars);
    };
    startAnimation();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [drawStatic, currentSlide]);

  return (
    <>
      <canvas ref={staticRef} className="bg-grid-canvas hex-static" />
      <canvas ref={starRef} className="bg-grid-canvas canvas-reveal" style={{
        zIndex: 2,
        opacity: currentSlide === 0 ? 1 : 0,
        transform: currentSlide === 0 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        transition: "opacity 0.6s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
      }} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   BACKGROUND LAYER
   ══════════════════════════════════════════════════════════════ */
function Background({ currentSlide }: { currentSlide: number }) {
  return (
    <>
      <div className="fixed inset-0 z-0" style={{
        background: "linear-gradient(180deg, #b8ddef 0%, #c0e2f4 15%, #cce8f6 30%, #d4ecf8 45%, #dcf0fa 55%, #e4ecf2 65%, #ecdce6 78%, #f4c8dc 90%, #f8b8cc 100%)"
      }} />
      <div className="absolute top-0 left-0 w-full h-dvh overflow-hidden z-[1]">
        <HexagonCanvas currentSlide={currentSlide} />
        <div className="noise-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-[85vh] z-[3] opacity-0 animate-mountainReveal" style={{
          backgroundImage: "url(/grid-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, transparent 80%)",
        }} />
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section id="home" className="h-full flex flex-col items-center justify-center relative px-6 z-10">
      {/* Title */}
      <div className="text-center fade-in fade-d2">
        <h1 className="text-5xl md:text-7xl font-light tracking-[0.3em] text-[var(--color-ink)]"
          style={{ textShadow: "0 0 50px rgba(120,216,240,0.15)" }}>
          JEWEL CRUZ
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4 mb-2">
          <div className="w-12 h-px bg-[var(--color-ink)] opacity-20" />
          <div className="text-center">
            <p className="text-base md:text-lg tracking-[0.3em] text-[var(--color-ink)] font-medium">FRONTEND DEVELOPER</p>
            <p className="text-base md:text-lg tracking-[0.3em] font-medium"
              style={{
                background: "linear-gradient(90deg, #1ec8f5, #9b6bf0, #f04f96)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>WEB DESIGNER</p>
          </div>
          <div className="w-12 h-px bg-[var(--color-ink)] opacity-20" />
        </div>
      </div>

      {/* Tagline */}
      <div className="text-center mt-5 fade-in fade-d3">
        <p className="text-sm md:text-base tracking-[0.2em] text-[var(--color-ink-dim)] font-medium">
          Innovation through iteration
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABOUT
   ══════════════════════════════════════════════════════════════ */
function TechIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    React: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    ),
    "Next.js": (
      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
      </svg>
    ),
    TypeScript: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
    "Tailwind CSS": (
      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    ),
    "Node.js": (
      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>
      </svg>
    ),
    Vitest: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <path d="M11.545 23.3a.613.613 0 0 1-.895.197L.252 15.936A.61.61 0 0 1 0 15.439V6.325c0-.502.569-.792.975-.497l6.358 4.624c.594.433 1.432.25 1.793-.39L14.393.7a.62.62 0 0 1 .535-.314h8.455a.613.613 0 0 1 .537.916z" />
      </svg>
    ),
    Playwright: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-2 6v8l6-4-6-4z" />
      </svg>
    ),
    Sanity: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12" fill="currentColor">
        <path d="M16.5 16.5l-3-3V8l3-3h3l3 3v3l-3 3h-3zm-9 0l-3-3V8l3-3h3l3 3v3l-3 3h-3z" />
      </svg>
    ),
  };
  return (
    <span role="img" aria-label={name} className="contents">
      {icons[name] || <div className="w-10 h-10 md:w-12 md:h-12 border border-current opacity-30" />}
    </span>
  );
}

function About() {
  const technologies = [
    { name: "React" },
    { name: "Next.js" },
    { name: "TypeScript" },
    { name: "Tailwind CSS" },
    { name: "Node.js" },
    { name: "Vitest" },
    { name: "Playwright" },
    { name: "Sanity" },
  ];

  return (
    <section id="about" className="h-full flex items-start justify-center pt-6 md:pt-10 pb-8 md:pb-12 px-4 md:px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
         {/* Title */}
         <div className="mb-4 md:mb-8">
           <h2 className="text-[36px] md:text-[64px] font-extralight tracking-[0.06em] text-[var(--color-ink)] leading-tight">
             FRONTEND DEVELOPER
           </h2>
           <h2 className="text-[36px] md:text-[64px] font-extralight tracking-[0.06em] leading-tight">
              <span className="text-[var(--color-ink)] opacity-70">&amp;</span>
             <span style={{
               background: "linear-gradient(90deg, #3cc8f0, #8060c0, #e070a0)",
               WebkitBackgroundClip: "text",
               WebkitTextFillColor: "transparent",
             }}> WEB DESIGNER</span>
           </h2>
         </div>

        {/* Two columns with center divider + diamond */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6 md:gap-12 items-start">
          {/* LEFT — Description */}
          <div>
            <p className="text-[16px] md:text-[22px] text-[var(--color-ink)] leading-[1.6] md:leading-[1.8] mb-3 md:mb-5">
              Hi, I&apos;m Jewel — a frontend developer and web designer from the Philippines.
            </p>
            <p className="text-[16px] md:text-[22px] text-[var(--color-ink)] leading-[1.6] md:leading-[1.8] mb-3 md:mb-5">
              I turn ideas into clean, accessible, interactive, and user-friendly web experiences that look as good as they perform.
            </p>
            <p className="text-[16px] md:text-[22px] text-[var(--color-ink)] leading-[1.6] md:leading-[1.8]">
              I leverage AI tools to streamline my workflow, prototype faster, and deliver high-quality results without compromising creativity.
            </p>
          </div>

          {/* CENTER — Vertical line with diamond */}
          <div className="hidden md:flex flex-col items-center justify-center relative h-full py-8">
            {/* Gradient line */}
            <div className="w-px h-full bg-gradient-to-b from-transparent via-[var(--color-ink)] to-transparent opacity-30" />
            {/* Diamond with glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-5 h-5 rotate-45 bg-[var(--color-ink)] shadow-[0_0_16px_rgba(26,58,90,0.4)]" />
            </div>
            {/* Small dots along the line */}
            <div className="absolute top-1/4 w-2 h-2 rounded-full bg-[var(--color-ink)] opacity-25" />
            <div className="absolute top-3/4 w-2 h-2 rounded-full bg-[var(--color-ink)] opacity-25" />
          </div>

          {/* RIGHT — Technologies */}
          <div className="text-center">
            <h3 className="text-[14px] md:text-[16px] tracking-[0.35em] text-[var(--color-ink)] mb-4 md:mb-8">TECHNOLOGIES</h3>

            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {technologies.map((t) => (
                <div key={t.name} className="flex flex-col items-center gap-1.5 md:gap-2 group cursor-default">
                   <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/25 bg-white/5 flex items-center justify-center text-[var(--color-ink)] group-hover:border-[var(--color-cyan)] transition-all">
                    <TechIcon name={t.name} />
                  </div>
                  <span className="text-[9px] md:text-[13px] tracking-[0.05em] text-[var(--color-ink)] opacity-100 group-hover:opacity-100 transition-opacity">{t.name}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 md:mt-10 hidden md:flex flex-wrap justify-center gap-4">
              {["UI/UX", "Responsive", "Animations", "Performance", "Testing"].map((tag) => (
                <span key={tag} className="text-[14px] tracking-[0.1em] text-[var(--color-ink)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROJECTS
   ══════════════════════════════════════════════════════════════ */
function Projects() {
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
          {Array.from({ length: 5 }).map((_, i) => {
            const isActive = i === selected;
            const hasProject = i < projects.length;
            return (
              <button key={i}
                onClick={() => hasProject && select(i)}
                disabled={!hasProject}
                className={`relative w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-400 ${
                  hasProject ? "cursor-pointer" : "cursor-default opacity-20"
                }`}>
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-[var(--color-cyan)] opacity-30 blur-sm" />
                )}
                <span className={`absolute inset-0 rounded-full transition-all duration-400 ${
                  isActive
                    ? "bg-[var(--color-cyan)] shadow-[0_0_10px_rgba(120,216,240,0.7)]"
                    : hasProject
                      ? "bg-[var(--color-ink)] opacity-40 hover:opacity-60"
                      : "bg-[var(--color-ink)]"
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

                {/* Logo */}
                <div key={imageKey} className="w-20 h-20 md:w-52 md:h-52 flex items-center justify-center animate-projectFadeIn">
                  <Image src={projects[selected].logo} alt={`${projects[selected].title} logo`}
                    width={208} height={208} loading="lazy"
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

/* ══════════════════════════════════════════════════════════════
   CONTACT
   ══════════════════════════════════════════════════════════════ */
function Contact() {
  const [form, setForm] = useState(EMPTY_CONTACT_FORM);
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validateContact(form);
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  };

  return (
    <section id="contact" className="relative h-full flex items-center justify-center px-4 md:px-6 md:overflow-hidden">
      <h2 className="sr-only">Contact</h2>
      {/* Form — absolute left, hidden on mobile and tablet */}
      <div className="absolute left-6 md:left-20 lg:left-44 top-1/2 -translate-y-1/2 w-[35%] md:w-[25%] lg:w-[22%] z-10 hidden lg:block">
        {submitted ? (
          <div className="py-10">
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
            <div className="flex items-center gap-3 mt-1">
              <div className="drop-shadow-[0_6px_14px_rgba(26,58,90,0.35)]">
                <button type="submit"
                  className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#2c4c6e] to-[#16304a] text-white text-[11px] tracking-[0.2em] font-medium hover:from-[#36597f] hover:to-[#1c3c5c] transition-all duration-300 clip-path-hex">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  SEND
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
        <h3 className="text-[56px] md:text-6xl lg:text-7xl font-extralight tracking-[0.05em] text-[#0f2540] mb-4 md:whitespace-nowrap opacity-100">
          Let&apos;s chat
        </h3>
        <p className="hidden lg:block text-[14px] md:text-[16px] lg:text-[22px] text-[#0f2540] opacity-90 leading-relaxed mb-6">
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

/* ══════════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-6 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between opacity-70">
        <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)]">JC</span>
        <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)]">{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [current, setCurrent] = useState(0);
  const [settled, setSettled] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSettled(current), 400);
    return () => clearTimeout(t);
  }, [current]);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <div className="relative h-dvh overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-cyan)] focus:text-white focus:outline-none">
        Skip to content
      </a>
      <main id="main-content" className="relative z-10 h-full">

        {/* Slides */}
        <div className="relative h-full">
          {/* Global background — hoisted out of the Home slide so it stays
              visible on every slide and inactive slides can skip rendering */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Background currentSlide={current} />
          </div>

          {/* Hero — full hexagon + star trail background */}
          <div className={`slide ${current === 0 ? "slide-active" : ""} ${current !== 0 && settled !== 0 ? "slide-idle" : ""}`}>
            {/* Decorative gradient orbs */}
            <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full z-[2]" style={{ background: "radial-gradient(circle, rgba(122,216,240,0.10) 0%, rgba(122,216,240,0) 70%)" }} />
            <div className="absolute bottom-[25%] right-[10%] w-80 h-80 rounded-full z-[2]" style={{ background: "radial-gradient(circle, rgba(240,216,232,0.12) 0%, rgba(240,216,232,0) 70%)" }} />
            <Hero />
          </div>

          {/* About — marble texture */}
          <div className={`slide ${current === 1 ? "slide-active" : ""} ${current !== 1 && settled !== 1 ? "slide-idle" : ""}`}>
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(135deg, #b4daf0 0%, #c8e4f4 20%, #dcd8f0 40%, #ecd0e8 60%, #f4c0d8 80%, #f8b0c8 100%)"
            }} />
            <div className="noise-overlay" />

            {/* Primary veins */}
            <svg className="absolute inset-0 w-full h-full z-[1] opacity-[0.30] marble-vein-1" viewBox="0 0 400 400" preserveAspectRatio="none">
              <defs>
                <filter id="whiteGlow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g fill="none" stroke="#ffffff" strokeWidth="2" filter="url(#whiteGlow)">
                <path d="M0 50 Q100 30 200 60 T400 40" />
                <path d="M0 100 Q80 80 160 110 T320 90 T400 100" />
                <path d="M0 150 Q120 130 240 160 T400 140" />
                <path d="M0 200 Q60 180 120 210 T240 190 T360 200 T400 195" />
                <path d="M0 250 Q100 230 200 260 T400 240" />
                <path d="M0 300 Q80 280 160 310 T320 290 T400 300" />
                <path d="M0 350 Q120 330 240 360 T400 340" />
              </g>
            </svg>

            {/* Secondary veins */}
            <svg className="absolute inset-0 w-full h-full z-[1] opacity-[0.22] marble-vein-2" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1.5" filter="url(#whiteGlow)">
                <path d="M0 70 Q120 50 240 80 T400 65" />
                <path d="M0 130 Q80 110 160 140 T320 120 T400 135" />
                <path d="M0 180 Q100 160 200 190 T400 175" />
                <path d="M0 230 Q70 210 140 240 T280 220 T400 235" />
                <path d="M0 280 Q90 260 180 290 T360 270 T400 285" />
                <path d="M0 330 Q100 310 200 340 T400 325" />
              </g>
            </svg>

            {/* Tertiary veins */}
            <svg className="absolute inset-0 w-full h-full z-[1] opacity-[0.15] marble-vein-3" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1" filter="url(#whiteGlow)">
                <path d="M0 80 Q140 60 280 90 T400 75" />
                <path d="M0 160 Q90 140 180 170 T360 150 T400 165" />
                <path d="M0 240 Q110 220 220 250 T400 235" />
                <path d="M0 310 Q80 290 160 320 T320 300 T400 315" />
                <path d="M0 370 Q100 350 200 380 T400 365" />
              </g>
            </svg>

            {/* Cyan tint veins */}
            <svg className="absolute inset-0 w-full h-full z-[2] opacity-[0.08] marble-vein-4" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1" filter="url(#whiteGlow)">
                <path d="M0 75 Q100 55 200 85 T400 70" />
                <path d="M0 195 Q120 175 240 205 T400 190" />
                <path d="M0 315 Q90 295 180 325 T360 305 T400 318" />
              </g>
            </svg>

            {/* Pink tint veins */}
            <svg className="absolute inset-0 w-full h-full z-[2] opacity-[0.08] marble-vein-5" viewBox="0 0 400 400" preserveAspectRatio="none">
              <g fill="none" stroke="#ffffff" strokeWidth="1" filter="url(#whiteGlow)">
                <path d="M0 115 Q80 95 160 125 T320 105 T400 118" />
                <path d="M0 255 Q100 235 200 265 T400 252" />
              </g>
            </svg>

            <div className="relative z-10 h-full"><About /></div>
          </div>

          {/* Projects — blue pink */}
          <div className={`slide ${current === 2 ? "slide-active" : ""} ${current !== 2 && settled !== 2 ? "slide-idle" : ""}`}>
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(135deg, #9acce8 0%, #a8d8f0 25%, #c0e8f8 45%, #e0d8f4 65%, #f0c8e0 80%, #f4d0d8 100%)"
            }} />
            {/* Abstract overlapping diagonal shapes — animated (desktop) */}
            <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none hidden md:block" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="projectsGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g className="glow-anim" filter="url(#projectsGlow)">
                <g className="diamond-float diamond-1">
                  <rect x="-200" y="-100" width="900" height="900" rx="20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                    <animateTransform attributeName="transform" type="rotate" values="-30 250 350;-22 250 350;-30 250 350" dur="8s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-2">
                  <rect x="100" y="-200" width="800" height="800" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8">
                    <animateTransform attributeName="transform" type="rotate" values="-30 500 200;-38 500 200;-30 500 200" dur="10s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-3">
                  <rect x="400" y="-100" width="700" height="700" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8">
                    <animateTransform attributeName="transform" type="rotate" values="-30 750 250;-22 750 250;-30 750 250" dur="9s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-4">
                  <rect x="600" y="0" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                    <animateTransform attributeName="transform" type="rotate" values="-30 900 300;-38 900 300;-30 900 300" dur="11s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-5">
                  <rect x="300" y="200" width="500" height="500" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                    <animateTransform attributeName="transform" type="rotate" values="-30 550 450;-22 550 450;-30 550 450" dur="7s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-6">
                  <rect x="100" y="100" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2">
                    <animateTransform attributeName="transform" type="rotate" values="-30 400 400;-38 400 400;-30 400 400" dur="12s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-7">
                  <rect x="200" y="50" width="400" height="400" rx="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                    <animateTransform attributeName="transform" type="rotate" values="-30 400 250;-22 400 250;-30 400 250" dur="9s" repeatCount="indefinite" />
                  </rect>
                </g>
                <g className="diamond-float diamond-8">
                  <rect x="500" y="150" width="350" height="350" rx="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8">
                    <animateTransform attributeName="transform" type="rotate" values="-30 675 325;-38 675 325;-30 675 325" dur="10s" repeatCount="indefinite" />
                  </rect>
                </g>
              </g>
            </svg>
            {/* Abstract overlapping diagonal shapes — static (mobile) */}
            <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none block md:hidden" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="projectsGlowMobile">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#projectsGlowMobile)">
                <rect className="diamond-float diamond-1" x="-200" y="-100" width="900" height="900" rx="20" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" transform="rotate(-30 250 350)" />
                <rect className="diamond-float diamond-2" x="100" y="-200" width="800" height="800" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" transform="rotate(-30 500 200)" />
                <rect className="diamond-float diamond-3" x="400" y="-100" width="700" height="700" rx="20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" transform="rotate(-30 750 250)" />
                <rect className="diamond-float diamond-4" x="600" y="0" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" transform="rotate(-30 900 300)" />
                <rect className="diamond-float diamond-5" x="300" y="200" width="500" height="500" rx="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" transform="rotate(-30 550 450)" />
                <rect className="diamond-float diamond-6" x="100" y="100" width="600" height="600" rx="20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" transform="rotate(-30 400 400)" />
                <rect className="diamond-float diamond-7" x="200" y="50" width="400" height="400" rx="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" transform="rotate(-30 400 250)" />
                <rect className="diamond-float diamond-8" x="500" y="150" width="350" height="350" rx="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" transform="rotate(-30 675 325)" />
              </g>
            </svg>
            {/* Decorative gradient orbs */}
            <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(122,216,240,0.12) 0%, rgba(122,216,240,0) 70%)" }} />
            <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(240,216,232,0.14) 0%, rgba(240,216,232,0) 70%)" }} />
            <div className="noise-overlay" />
            <div className="relative z-10 h-full"><Projects /></div>
          </div>

          {/* Contact — geometric */}
          <div className={`slide ${current === 3 ? "slide-active" : ""} ${current !== 3 && settled !== 3 ? "slide-idle" : ""}`}>
            {/* Base — blue pink gradient */}
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(135deg, #aedaf3 0%, #c1e2f7 18%, #d6dff5 38%, #ecd9f0 58%, #f8d1e7 78%, #fbc7de 100%)"
            }} />
            {/* Geometric diamond pattern */}
            <svg className="absolute inset-0 w-full h-full z-[1] pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="centerFade" cx="50%" cy="55%" r="26%">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="60%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="white" stopOpacity="1" />
                </radialGradient>
                <mask id="serahMask">
                  <rect width="1200" height="800" fill="url(#centerFade)" />
                </mask>
                <filter id="geoGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <path id="sparkle" d="M0,-11 Q2.4,-2.4 11,0 Q2.4,2.4 0,11 Q-2.4,2.4 -11,0 Q-2.4,-2.4 0,-11 Z" />
              </defs>
              <g mask="url(#serahMask)">
              {/* Large rounded diamonds */}
              <g className="geo-pulse-5 glow-anim" filter="url(#geoGlow)" opacity="0.6">
                <rect x="-140" y="-190" width="660" height="660" rx="52" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 190 140)" />
                <rect x="330" y="-230" width="720" height="720" rx="58" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 690 130)" />
                <rect x="-230" y="200" width="640" height="640" rx="50" fill="none" stroke="white" strokeWidth="1.8" transform="rotate(45 90 520)" />
                <rect x="300" y="120" width="780" height="780" rx="62" fill="none" stroke="white" strokeWidth="2" transform="rotate(45 690 510)" />
                <rect x="810" y="150" width="640" height="640" rx="50" fill="none" stroke="white" strokeWidth="1.8" transform="rotate(45 1130 470)" />
                <rect x="380" y="560" width="580" height="580" rx="46" fill="none" stroke="white" strokeWidth="1.5" transform="rotate(45 670 850)" />
              </g>
              {/* Sparkles */}
              <g opacity="0.85" fill="white">
                <use href="#sparkle" transform="translate(300,120) scale(0.7)" />
                <use href="#sparkle" transform="translate(510,78) scale(0.5)" />
                <use href="#sparkle" transform="translate(880,140) scale(0.6)" />
                <use href="#sparkle" transform="translate(1085,88) scale(0.45)" />
                <use href="#sparkle" transform="translate(150,330) scale(0.55)" />
                <use href="#sparkle" transform="translate(1150,235) scale(0.7)" />
                <use href="#sparkle" transform="translate(420,430) scale(0.5)" />
                <use href="#sparkle" transform="translate(965,420) scale(0.55)" />
                <use href="#sparkle" transform="translate(240,645) scale(0.6)" />
                <use href="#sparkle" transform="translate(1010,660) scale(0.65)" />
                <use href="#sparkle" transform="translate(765,740) scale(0.5)" />
                <use href="#sparkle" transform="translate(120,760) scale(0.45)" />
              </g>
              </g>
            </svg>
            <div className="noise-overlay" />
            <div className="relative z-10 h-full">
              <Contact />
              <Footer />
            </div>
          </div>
        </div>

        {/* Arrow navigation */}
        {current > 0 && (
          <button onClick={prev} aria-label="Previous slide"
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-[var(--color-ink-dim)] opacity-30 rotate-45 group-hover:border-[var(--color-cyan)] group-hover:opacity-60 transition-all duration-300" />
              <svg className="w-5 h-5 text-[var(--color-ink-dim)] group-hover:text-[var(--color-cyan)] transition-colors relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}
        {current < SLIDES.length - 1 && (
          <button onClick={next} aria-label="Next slide"
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-[var(--color-ink-dim)] opacity-30 rotate-45 group-hover:border-[var(--color-cyan)] group-hover:opacity-60 transition-all duration-300" />
              <svg className="w-5 h-5 text-[var(--color-ink-dim)] group-hover:text-[var(--color-cyan)] transition-colors relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        {/* Slide indicator — pink crystals */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-6">
            {SLIDES.map((name, i) => {
              const isActive = i === current;
              const isPast = i < current;
              return (
                <button key={i} onClick={() => goTo(i)} aria-label={`Go to ${name}`}
                  className="tap-feedback flex flex-col items-center gap-2.5 py-2 px-3 group outline-none focus:outline-none focus:ring-0 active:outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}>
                  {/* Crystal */}
                  <div className="relative">
                    {/* Glow layer */}
                    {isActive && (
                      <div className="absolute -inset-2 rotate-45 bg-[var(--color-cyan)] opacity-40 blur-md" />
                    )}
                    {/* Crystal body */}
                    <div className={`relative w-4 h-4 rotate-45 transition-all duration-300 border ${
                      isActive
                        ? "bg-[var(--color-cyan)] border-[var(--color-cyan-bright)] shadow-[0_0_20px_rgba(120,216,240,0.9)]"
                        : isPast
                          ? "bg-white/85 border-white/80 shadow-[0_0_10px_rgba(255,255,255,1),0_0_22px_rgba(255,255,255,0.75)]"
                          : "bg-white/65 border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.95),0_0_22px_rgba(255,255,255,0.6)] group-hover:bg-white/85 group-hover:shadow-[0_0_12px_rgba(255,255,255,1),0_0_26px_rgba(255,255,255,0.8)]"
                    }`} />
                  </div>
                  {/* Label */}
                  <span className={`text-[9px] tracking-[0.25em] transition-opacity duration-200 font-medium ${
                    isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-dim)]"
                  }`}>
                    {name.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
