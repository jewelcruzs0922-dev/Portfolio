"use client";

import { useEffect, useRef, useCallback } from "react";

export default function HexagonCanvas({ currentSlide }: { currentSlide: number }) {
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
        const dx = (x - cx) / (w * (isMobile ? 0.35 : 0.45));
        const dy = (y - cy) / (h_screen * (isMobile ? 0.3 : 0.5));
        if (dx * dx + dy * dy < (isMobile ? 1.5 : 0.85)) continue;
        if (ny > cutoffY) continue;
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

        const ig = ctx.createRadialGradient(x, y, 0, x, y, size);
        ig.addColorStop(0, `hsla(${hue}, ${sat}%, ${lit}%, ${a * 0.5})`);
        ig.addColorStop(0.7, `hsla(${hue}, ${sat - 10}%, ${lit - 5}%, ${a * 0.2})`);
        ig.addColorStop(1, `hsla(${hue}, ${sat - 20}%, ${lit}%, 0)`);
        ctx.fillStyle = ig;
        ctx.fill();

        ctx.strokeStyle = `hsla(210, 70%, 80%, ${a})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = `hsla(330, 60%, 85%, ${a * 0.5})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + (size - 1), y);
        ctx.lineTo(x + (size - 1) * 0.5, y - (size - 1) * 0.866);
        ctx.strokeStyle = `hsla(${hue + 15}, 40%, 95%, ${a * 0.85})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = `hsla(${hue}, 60%, 90%, 0.75)`;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo(x + (size - 1) * 0.5, y - (size - 1) * 0.866);
        ctx.lineTo(x - (size - 1) * 0.5, y - (size - 1) * 0.866);
        ctx.strokeStyle = `hsla(${hue + 20}, 35%, 92%, ${a * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

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

      for (let i = 0; i < trailCount; i++) {
        const radius = 30 + i * 8;
        const arcLen = 0.5 + (i % 5) * 0.6 + Math.sin(t * 0.8 + i) * 0.15;
        const sa = baseAngles[i] + t * (0.25 + (i % 3) * 0.1) + Math.sin(t * 0.5 + i * 0.3) * 0.05;
        const alpha = 0.35 + (1 - i / trailCount) * 0.5;
        const lw = 1.2 + (i % 4) * 0.4;

        const ratio = i / trailCount;
        const cr = Math.round(180 + ratio * 60);
        const cg = Math.round(220 - ratio * 30);
        const cb = 255;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, sa, sa + arcLen);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.15})`;
        ctx.lineWidth = lw + 6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, sa, sa + arcLen);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.3})`;
        ctx.lineWidth = lw + 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, sa, sa + arcLen);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = lw;
        ctx.stroke();

        const hx = centerX + radius * Math.cos(sa + arcLen);
        const hy = centerY + radius * Math.sin(sa + arcLen);

        const headGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 5);
        headGrad.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        headGrad.addColorStop(0.3, `rgba(${cr},${cg},${cb},${alpha * 0.5})`);
        headGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha * 1.5, 1)})`;
        ctx.fill();

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

          ctx.beginPath();
          ctx.moveTo(sx, sy - sr);
          ctx.quadraticCurveTo(sx + sr * 0.3, sy - sr * 0.3, sx + sr, sy);
          ctx.quadraticCurveTo(sx + sr * 0.3, sy + sr * 0.3, sx, sy + sr);
          ctx.quadraticCurveTo(sx - sr * 0.3, sy + sr * 0.3, sx - sr, sy);
          ctx.quadraticCurveTo(sx - sr * 0.3, sy - sr * 0.3, sx, sy);
          ctx.closePath();
          ctx.fillStyle = `rgba(255,255,255,${0.7 * twinkle})`;
          ctx.fill();

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
