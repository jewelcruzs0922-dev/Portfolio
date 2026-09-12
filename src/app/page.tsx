"use client";

import { useEffect, useState, useRef, useCallback, type JSX } from "react";

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

    const dpr = window.devicePixelRatio || 1;
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
    const cols = Math.ceil(w / (size * 1.5)) + 6;
    const rows = Math.ceil(h_screen * 0.5 / hexH) + 2;
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

    // animated star trails
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
    const trailCount = 40;
    const baseAngles: number[] = [];
    for (let i = 0; i < trailCount; i++) {
      baseAngles.push((i * 137.508) * Math.PI / 180);
    }

    const drawStars = (time: number) => {
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
        for (let p = 0; p < 3; p++) {
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

      // scattered bright stars — center-left and center-right below star trail
      const brightStars = [
        // center-left
        { bx: 0.08, by: 0.45, r: 8 }, { bx: 0.15, by: 0.5, r: 6 },
        { bx: 0.22, by: 0.48, r: 9 }, { bx: 0.28, by: 0.52, r: 7 },
        { bx: 0.32, by: 0.46, r: 5 }, { bx: 0.12, by: 0.55, r: 6 },
        { bx: 0.25, by: 0.58, r: 5 }, { bx: 0.18, by: 0.53, r: 7 },
        // center-right
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
        ctx.quadraticCurveTo(sx - sr * 0.3, sy - sr * 0.3, sx, sy - sr);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${0.7 * twinkle})`;
        ctx.fill();

        // glow
        ctx.beginPath();
        ctx.arc(sx, sy, sr * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${0.1 * twinkle})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(drawStars);
    };

    rafRef.current = requestAnimationFrame(drawStars);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [drawStatic]);

  return (
    <>
      <canvas ref={staticRef} className="bg-grid-canvas hex-static" />
      <canvas ref={starRef} className="bg-grid-canvas canvas-reveal" style={{
        zIndex: 2,
        opacity: currentSlide === 0 ? 1 : 0,
        transform: currentSlide === 0 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        filter: currentSlide === 0 ? "blur(0px)" : "blur(6px)",
        transition: "opacity 0.6s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease",
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
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden z-[1]">
        <HexagonCanvas currentSlide={currentSlide} />
        <div className="noise-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-[85vh] z-[3] opacity-0 animate-mountainReveal" style={{
          backgroundImage: "url(/grid-bg.png)",
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
            <p className="text-base md:text-lg tracking-[0.3em] text-[var(--color-ink)] opacity-50">FRONTEND DEVELOPER</p>
            <p className="text-base md:text-lg tracking-[0.3em] text-[var(--color-ink)] opacity-50">WEB DESIGNER</p>
          </div>
          <div className="w-12 h-px bg-[var(--color-ink)] opacity-20" />
        </div>
      </div>

      {/* Tagline */}
      <div className="text-center mt-5 fade-in fade-d3">
        <p className="text-sm md:text-base tracking-[0.2em] text-[var(--color-ink-dim)] opacity-40">
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
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
      </svg>
    ),
    "Next.js": (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
      </svg>
    ),
    TypeScript: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
    "Tailwind CSS": (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    ),
    "Node.js": (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z" />
      </svg>
    ),
    Vitest: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M11.545 23.3a.613.613 0 0 1-.895.197L.252 15.936A.61.61 0 0 1 0 15.439V6.325c0-.502.569-.792.975-.497l6.358 4.624c.594.433 1.432.25 1.793-.39L14.393.7a.62.62 0 0 1 .535-.314h8.455a.613.613 0 0 1 .537.916z" />
      </svg>
    ),
    Playwright: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-2 6v8l6-4-6-4z" />
      </svg>
    ),
    Sanity: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M16.5 16.5l-3-3V8l3-3h3l3 3v3l-3 3h-3zm-9 0l-3-3V8l3-3h3l3 3v3l-3 3h-3z" />
      </svg>
    ),
  };
  return icons[name] || <div className="w-8 h-8 border border-current opacity-30" />;
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
    <section id="about" className="h-full flex items-start justify-center pt-10 pb-12 px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section header — full width line */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-2 rotate-45 bg-[var(--color-ink)] opacity-30" />
          <span className="text-[11px] tracking-[0.4em] text-[var(--color-ink)] opacity-60">ABOUT</span>
          <div className="flex-1 h-px bg-[var(--color-ink)] opacity-10" />
          <span className="text-[10px] tracking-[0.3em] text-[var(--color-ink-dim)] opacity-40">01</span>
        </div>

        {/* Title + blue underline */}
        <div className="mb-8">
          <h2 className="text-[36px] md:text-[48px] font-extralight tracking-[0.06em] text-[var(--color-ink)] leading-tight">
            FRONTEND DEVELOPER
          </h2>
          <h2 className="text-[36px] md:text-[48px] font-extralight tracking-[0.06em] text-[var(--color-ink)] leading-tight opacity-25">
            & WEB DESIGNER
          </h2>
          <div className="w-12 h-[3px] bg-[var(--color-cyan)] opacity-40 mt-4" />
        </div>

        {/* Two columns with center divider + diamond */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 md:gap-12 items-start">
          {/* LEFT — Description */}
          <div>
            <p className="text-[18px] text-[var(--color-ink)] leading-[1.8] mb-5">
              Hi, I&apos;m Jewel — a frontend developer and web designer from the Philippines.
            </p>
            <p className="text-[18px] text-[var(--color-ink)] leading-[1.8] mb-5">
              I turn ideas into clean, accessible, interactive, and user-friendly web experiences that look as good as they perform.
            </p>
            <p className="text-[18px] text-[var(--color-ink)] leading-[1.8]">
              I leverage AI tools to streamline my workflow, prototype faster, and deliver high-quality results without compromising creativity.
            </p>
          </div>

          {/* CENTER — Vertical line with diamond */}
          <div className="hidden md:flex flex-col items-center justify-center relative h-full py-8">
            {/* Gradient line */}
            <div className="w-px h-full bg-gradient-to-b from-transparent via-[var(--color-ink)] to-transparent opacity-30" />
            {/* Diamond with glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 rotate-45 bg-[var(--color-ink)] shadow-[0_0_16px_rgba(26,58,90,0.4)]" />
            </div>
            {/* Small dots along the line */}
            <div className="absolute top-1/4 w-1.5 h-1.5 rounded-full bg-[var(--color-ink)] opacity-25" />
            <div className="absolute top-3/4 w-1.5 h-1.5 rounded-full bg-[var(--color-ink)] opacity-25" />
          </div>

          {/* RIGHT — Technologies */}
          <div className="text-center">
            <h3 className="text-[13px] tracking-[0.35em] text-[var(--color-ink)] mb-8">TECHNOLOGIES</h3>

            <div className="grid grid-cols-4 gap-6">
              {technologies.map((t) => (
                <div key={t.name} className="flex flex-col items-center gap-2 group cursor-default">
                  <div className="w-14 h-14 rounded-full border border-white/25 bg-white/5 flex items-center justify-center text-[var(--color-ink)] group-hover:border-[var(--color-cyan)] transition-all">
                    <TechIcon name={t.name} />
                  </div>
                  <span className="text-[11px] tracking-[0.05em] text-[var(--color-ink)] opacity-70 group-hover:opacity-100 transition-opacity">{t.name}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {["UI/UX", "Responsive", "Animations", "Performance", "Testing"].map((tag) => (
                <span key={tag} className="text-[13px] tracking-[0.1em] text-[var(--color-ink)]">
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
  const projects = [
    {
      id: "001", title: "Redwood Retreats", cat: "CABIN RENTAL PLATFORM",
      desc: "Full-stack cabin rental platform with real-time canvas animations, dynamic pricing engine, and booking system.",
      highlight: "Real-time animations + dynamic pricing",
      tech: ["Next.js", "TypeScript", "Canvas API", "Tailwind"],
      live: "https://redwood-retreats.vercel.app",
      code: "https://github.com/jewelcruzs0922-dev/redwood-retreats",
    },
    {
      id: "002", title: "Cosmic Ray Solar", cat: "SOLAR ENERGY PLATFORM",
      desc: "Solar company platform with Stripe payments integration, Sanity CMS for content management, and fully responsive design.",
      highlight: "Stripe payments + Sanity CMS",
      tech: ["Next.js", "Stripe", "Sanity", "Tailwind"],
      live: "https://cosmicray-solar.netlify.app",
      code: "https://github.com/jewelcruzs0922-dev/cosmicray-solar",
    },
  ];

  return (
    <section id="projects" className="h-full flex items-center justify-center py-16 px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-2 rotate-45 bg-[var(--color-ink)] opacity-30" />
          <span className="text-[10px] tracking-[0.4em] text-[var(--color-ink)] opacity-60">PROJECTS</span>
          <div className="flex-1 h-px bg-[var(--color-ink)] opacity-10" />
          <span className="text-[9px] tracking-[0.3em] text-[var(--color-ink-dim)] opacity-40">{projects.length.toString().padStart(2, "0")} ENTRIES</span>
        </div>

        {/* Asymmetric layout — first project big, second compact */}
        <div className="grid grid-cols-12 gap-3">
          {/* Project 1 — big featured card */}
          <div className="col-span-12 md:col-span-8 border border-white/15 bg-white/5 group hover:border-[var(--color-cyan)] transition-all">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rotate-45 bg-[var(--color-cyan)] opacity-40" />
                <span className="text-[8px] tracking-[0.25em] text-[var(--color-ink-dim)] opacity-50">{projects[0].cat}</span>
              </div>
              <span className="text-[8px] tracking-[0.2em] text-[var(--color-ink-dim)] opacity-30">NO.{projects[0].id}</span>
            </div>

            <div className="p-6">
              <h3 className="text-xl md:text-2xl tracking-[0.1em] text-[var(--color-ink)] mb-3 font-light">{projects[0].title}</h3>
              <p className="text-[12px] text-[var(--color-ink-dim)] leading-relaxed mb-4 opacity-60 max-w-lg">{projects[0].desc}</p>

              {/* Highlight badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--color-cyan)] border-opacity-20 bg-[var(--color-cyan)] bg-opacity-5 mb-5">
                <div className="w-1 h-1 rotate-45 bg-[var(--color-cyan)] opacity-50" />
                <span className="text-[9px] tracking-[0.15em] text-[var(--color-ink)]">{projects[0].highlight}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {projects[0].tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[7px] tracking-[0.15em] text-[var(--color-ink-dim)] border border-white/15 opacity-50">{t}</span>
                  ))}
                </div>
                <div className="flex-1" />
                <div className="flex gap-3">
                  <a href={projects[0].live} target="_blank" rel="noopener noreferrer" className="text-[9px] tracking-[0.2em] text-[var(--color-ink-dim)] hover:text-[var(--color-cyan)] transition-colors">LIVE</a>
                  <a href={projects[0].code} target="_blank" rel="noopener noreferrer" className="text-[9px] tracking-[0.2em] text-[var(--color-ink-dim)] hover:text-[var(--color-cyan)] transition-colors">CODE</a>
                </div>
              </div>
            </div>
          </div>

          {/* Project 2 — tall compact card */}
          <div className="col-span-12 md:col-span-4 border border-white/15 bg-white/5 group hover:border-[var(--color-cyan)] transition-all flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rotate-45 bg-[var(--color-cyan)] opacity-40" />
                <span className="text-[7px] tracking-[0.2em] text-[var(--color-ink-dim)] opacity-50">{projects[1].cat}</span>
              </div>
              <span className="text-[7px] tracking-[0.2em] text-[var(--color-ink-dim)] opacity-30">NO.{projects[1].id}</span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base tracking-[0.1em] text-[var(--color-ink)] mb-2 font-light">{projects[1].title}</h3>
              <p className="text-[11px] text-[var(--color-ink-dim)] leading-relaxed mb-4 opacity-55 flex-1">{projects[1].desc}</p>

              {/* Highlight */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[var(--color-cyan)] border-opacity-15 bg-[var(--color-cyan)] bg-opacity-5 mb-4 self-start">
                <div className="w-0.5 h-0.5 rotate-45 bg-[var(--color-cyan)] opacity-50" />
                <span className="text-[8px] tracking-[0.12em] text-[var(--color-ink)]">{projects[1].highlight}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {projects[1].tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[6px] tracking-[0.12em] text-[var(--color-ink-dim)] border border-white/15 opacity-45">{t}</span>
                ))}
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/10">
                <a href={projects[1].live} target="_blank" rel="noopener noreferrer" className="text-[8px] tracking-[0.2em] text-[var(--color-ink-dim)] hover:text-[var(--color-cyan)] transition-colors">LIVE</a>
                <a href={projects[1].code} target="_blank" rel="noopener noreferrer" className="text-[8px] tracking-[0.2em] text-[var(--color-ink-dim)] hover:text-[var(--color-cyan)] transition-colors">CODE</a>
              </div>
            </div>
          </div>
        </div>

        {/* More coming */}
        <div className="mt-3 flex items-center gap-3 opacity-25">
          <div className="w-1 h-1 rotate-45 bg-[var(--color-ink)]" />
          <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)]">MORE IN DEVELOPMENT</span>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONTACT
   ══════════════════════════════════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" className="h-full flex items-center justify-center py-16 px-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-2 rotate-45 bg-[var(--color-ink)] opacity-30" />
          <span className="text-[10px] tracking-[0.4em] text-[var(--color-ink)] opacity-60">CONTACT</span>
          <div className="flex-1 h-px bg-[var(--color-ink)] opacity-10" />
          <span className="text-[9px] tracking-[0.3em] text-[var(--color-ink-dim)] opacity-40">ACTIVE</span>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-3">
          {/* Big CTA — spans 8 cols */}
          <div className="col-span-12 md:col-span-8 p-6 border border-[var(--color-cyan)] border-opacity-15 bg-[var(--color-cyan)] bg-opacity-[0.03] relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--color-cyan)] opacity-[0.04] rounded-full translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="text-[24px] md:text-[32px] font-extralight tracking-[0.08em] text-[var(--color-ink)] leading-tight mb-1">
                HAVE A PROJECT
              </div>
              <div className="text-[24px] md:text-[32px] font-extralight tracking-[0.08em] text-[var(--color-ink)] leading-tight opacity-35 mb-4">
                IN MIND?
              </div>
              <p className="text-[12px] text-[var(--color-ink-dim)] leading-relaxed mb-5 max-w-md opacity-60">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              <a href="mailto:jewel@example.com" className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--color-cyan)] hover:bg-[var(--color-cyan)] group transition-all duration-300">
                <div className="w-1.5 h-1.5 rotate-45 bg-[var(--color-cyan)] opacity-50 group-hover:bg-white group-hover:opacity-70 transition-all" />
                <span className="text-[10px] tracking-[0.2em] text-[var(--color-ink)] group-hover:text-white transition-colors">jewel@example.com</span>
              </a>
            </div>
          </div>

          {/* Availability — spans 4 cols */}
          <div className="col-span-12 md:col-span-4 p-5 border border-white/15 bg-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-60 animate-pulse" />
                <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)] opacity-50">AVAILABLE</span>
              </div>
              <p className="text-[11px] text-[var(--color-ink-dim)] opacity-50 leading-relaxed">
                Open for freelance, collaborations, and full-time roles.
              </p>
            </div>
            <div className="mt-4 text-[8px] tracking-[0.2em] text-[var(--color-ink-dim)] opacity-30">PHILIPPINES • GMT+8</div>
          </div>

          {/* Link cards — 3 equal */}
          <a href="mailto:jewel@example.com" className="col-span-4 p-5 border border-[var(--color-cyan)] border-opacity-20 bg-white/5 hover:bg-[var(--color-cyan)] group transition-all duration-300 text-center">
            <div className="w-2 h-2 rotate-45 bg-[var(--color-cyan)] opacity-40 group-hover:bg-white group-hover:opacity-60 transition-all mx-auto mb-3" />
            <div className="text-[10px] tracking-[0.2em] text-[var(--color-ink)] group-hover:text-white transition-colors">EMAIL</div>
          </a>

          <a href="https://github.com/jewelcruzs0922-dev" target="_blank" rel="noopener noreferrer" className="col-span-4 p-5 border border-white/15 bg-white/5 hover:border-[var(--color-cyan)] group transition-all duration-300 text-center">
            <div className="w-2 h-2 rotate-45 border border-[var(--color-ink-dim)] opacity-25 group-hover:border-[var(--color-cyan)] group-hover:opacity-50 transition-all mx-auto mb-3" />
            <div className="text-[10px] tracking-[0.2em] text-[var(--color-ink)]">GITHUB</div>
          </a>

          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="col-span-4 p-5 border border-white/15 bg-white/5 hover:border-[var(--color-cyan)] group transition-all duration-300 text-center">
            <div className="w-2 h-2 rotate-45 border border-[var(--color-ink-dim)] opacity-25 group-hover:border-[var(--color-cyan)] group-hover:opacity-50 transition-all mx-auto mb-3" />
            <div className="text-[10px] tracking-[0.2em] text-[var(--color-ink)]">LINKEDIN</div>
          </a>
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
      <div className="max-w-5xl mx-auto flex items-center justify-between opacity-30">
        <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)]">JC</span>
        <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)]">2025</span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════════════ */
const SLIDES = ["home", "about", "projects", "contact"] as const;

export default function Home() {
  const [current, setCurrent] = useState(0);

  const goTo = (index: number) => {
    if (index === current) return;
    setCurrent(index);
  };

  const next = () => goTo(Math.min(current + 1, SLIDES.length - 1));
  const prev = () => goTo(Math.max(current - 1, 0));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="relative h-screen overflow-hidden">
      <main id="main-content" className="relative z-10 h-full">

        {/* Slides */}
        <div className="relative h-full">
          {/* Hero — full hexagon + star trail background */}
          <div className={`slide ${current === 0 ? "slide-active" : ""}`}>
            <Background currentSlide={current} />
            <Hero />
          </div>

          {/* About — subtle gradient + noise */}
          <div className={`slide ${current === 1 ? "slide-active" : ""}`}>
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(160deg, #c8e6f4 0%, #d4ecf8 40%, #e0e8f0 70%, #e8e0ec 100%)"
            }} />
            <div className="noise-overlay" />
            <div className="relative z-10 h-full"><About /></div>
          </div>

          {/* Projects — darker shift */}
          <div className={`slide ${current === 2 ? "slide-active" : ""}`}>
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(200deg, #bcdcf0 0%, #c8e2f4 30%, #d0e4f0 60%, #d8dce8 100%)"
            }} />
            <div className="noise-overlay" />
            <div className="relative z-10 h-full"><Projects /></div>
          </div>

          {/* Contact — deepest tone */}
          <div className={`slide ${current === 3 ? "slide-active" : ""}`}>
            <div className="absolute inset-0 z-0" style={{
              background: "linear-gradient(160deg, #c4dced 0%, #d0e4f0 30%, #dce0e8 60%, #e8d8e0 100%)"
            }} />
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
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border border-[var(--color-ink-dim)] opacity-30 rotate-45 group-hover:border-[var(--color-cyan)] group-hover:opacity-60 transition-all duration-300" />
              <svg className="w-5 h-5 text-[var(--color-ink-dim)] group-hover:text-[var(--color-cyan)] transition-colors relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="hud text-[8px] tracking-[0.4em] text-[var(--color-ink-dim)] opacity-0 group-hover:opacity-60 transition-opacity -ml-2">PREV</span>
          </button>
        )}
        {current < SLIDES.length - 1 && (
          <button onClick={next} aria-label="Next slide"
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3 group">
            <span className="hud text-[8px] tracking-[0.4em] text-[var(--color-ink-dim)] opacity-0 group-hover:opacity-60 transition-opacity -mr-2">NEXT</span>
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
                  className="flex flex-col items-center gap-2.5 group outline-none focus:outline-none focus:ring-0 active:outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}>
                  {/* Crystal */}
                  <div className="relative">
                    {/* Glow layer */}
                    {isActive && (
                      <div className="absolute -inset-2 rotate-45 bg-[var(--color-cyan)] opacity-40 blur-md" />
                    )}
                    {/* Crystal body */}
                    <div className={`relative w-4 h-4 rotate-45 transition-all duration-300 border border-transparent ${
                      isActive
                        ? "bg-[var(--color-cyan)] shadow-[0_0_20px_rgba(120,216,240,0.8)]"
                        : isPast
                          ? "bg-white/50 shadow-[0_0_6px_rgba(255,255,255,0.3)]"
                          : "bg-white/30 border-white/40 group-hover:bg-white/50 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    }`} />
                  </div>
                  {/* Label */}
                  <span className={`text-[9px] tracking-[0.25em] transition-opacity duration-200 ${
                    isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-dim)] opacity-50 group-hover:opacity-80"
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
