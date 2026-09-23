import { Fragment } from "react";
import SlideDeck from "@/components/slide-deck";
import Hero from "@/components/hero";
import About from "@/components/about";
import Projects from "@/components/projects";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <SlideDeck
      slides={[
        /* Hero — full hexagon + star trail background */
        <Fragment key="home">
          {/* Decorative gradient orbs */}
          <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full z-[2]" style={{ background: "var(--gradient-orb-cyan)" }} aria-hidden="true" />
          <div className="absolute bottom-[25%] right-[10%] w-80 h-80 rounded-full z-[2]" style={{ background: "var(--gradient-orb-pink)" }} aria-hidden="true" />
          <Hero />
        </Fragment>,

        /* About — marble texture */
        <Fragment key="about">
          <div className="absolute inset-0 z-0" style={{ background: "var(--gradient-about)" }} aria-hidden="true" />
          <div className="noise-overlay" aria-hidden="true" />

          {/* Primary veins */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-[1] opacity-[0.30] marble-vein-1" viewBox="0 0 400 400" preserveAspectRatio="none">
            <defs>
              <filter id="whiteGlow">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g fill="none" stroke="white" strokeWidth="2" filter="url(#whiteGlow)">
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
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-[1] opacity-[0.22] marble-vein-2" viewBox="0 0 400 400" preserveAspectRatio="none">
            <g fill="none" stroke="white" strokeWidth="1.5" filter="url(#whiteGlow)">
              <path d="M0 70 Q120 50 240 80 T400 65" />
              <path d="M0 130 Q80 110 160 140 T320 120 T400 135" />
              <path d="M0 180 Q100 160 200 190 T400 175" />
              <path d="M0 230 Q70 210 140 240 T280 220 T400 235" />
              <path d="M0 280 Q90 260 180 290 T360 270 T400 285" />
              <path d="M0 330 Q100 310 200 340 T400 325" />
            </g>
          </svg>

          {/* Tertiary veins */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-[1] opacity-[0.15] marble-vein-3" viewBox="0 0 400 400" preserveAspectRatio="none">
            <g fill="none" stroke="white" strokeWidth="1" filter="url(#whiteGlow)">
              <path d="M0 80 Q140 60 280 90 T400 75" />
              <path d="M0 160 Q90 140 180 170 T360 150 T400 165" />
              <path d="M0 240 Q110 220 220 250 T400 235" />
              <path d="M0 310 Q80 290 160 320 T320 300 T400 315" />
              <path d="M0 370 Q100 350 200 380 T400 365" />
            </g>
          </svg>

          {/* Cyan tint veins */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-[2] opacity-[0.08] marble-vein-4" viewBox="0 0 400 400" preserveAspectRatio="none">
            <g fill="none" stroke="white" strokeWidth="1" filter="url(#whiteGlow)">
              <path d="M0 75 Q100 55 200 85 T400 70" />
              <path d="M0 195 Q120 175 240 205 T400 190" />
              <path d="M0 315 Q90 295 180 325 T360 305 T400 318" />
            </g>
          </svg>

          {/* Pink tint veins */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-[2] opacity-[0.08] marble-vein-5" viewBox="0 0 400 400" preserveAspectRatio="none">
            <g fill="none" stroke="white" strokeWidth="1" filter="url(#whiteGlow)">
              <path d="M0 115 Q80 95 160 125 T320 105 T400 118" />
              <path d="M0 255 Q100 235 200 265 T400 252" />
            </g>
          </svg>

          <div className="relative z-10 h-full"><About /></div>
        </Fragment>,

        /* Projects — blue pink */
        <Fragment key="projects">
          <div className="absolute inset-0 z-0" style={{ background: "var(--gradient-projects)" }} aria-hidden="true" />
          {/* Abstract overlapping diagonal shapes — animated (desktop) */}
          <svg id="projects-smil" aria-hidden="true" className="absolute inset-0 w-full h-full z-[1] pointer-events-none hidden md:block" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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
                <rect x="-200" y="-100" width="900" height="900" rx="20" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2">
                  <animateTransform attributeName="transform" type="rotate" values="-30 250 350;-22 250 350;-30 250 350" dur="8s" repeatCount="indefinite" />
                </rect>
              </g>
              <g className="diamond-float diamond-2">
                <rect x="100" y="-200" width="800" height="800" rx="20" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="1.8">
                  <animateTransform attributeName="transform" type="rotate" values="-30 500 200;-38 500 200;-30 500 200" dur="10s" repeatCount="indefinite" />
                </rect>
              </g>
              <g className="diamond-float diamond-3">
                <rect x="400" y="-100" width="700" height="700" rx="20" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="1.8">
                  <animateTransform attributeName="transform" type="rotate" values="-30 750 250;-22 750 250;-30 750 250" dur="9s" repeatCount="indefinite" />
                </rect>
              </g>
              <g className="diamond-float diamond-4">
                <rect x="600" y="0" width="600" height="600" rx="20" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5">
                  <animateTransform attributeName="transform" type="rotate" values="-30 900 300;-38 900 300;-30 900 300" dur="11s" repeatCount="indefinite" />
                </rect>
              </g>
              <g className="diamond-float diamond-5">
                <rect x="300" y="200" width="500" height="500" rx="20" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5">
                  <animateTransform attributeName="transform" type="rotate" values="-30 550 450;-22 550 450;-30 550 450" dur="7s" repeatCount="indefinite" />
                </rect>
              </g>
              <g className="diamond-float diamond-6">
                <rect x="100" y="100" width="600" height="600" rx="20" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1.2">
                  <animateTransform attributeName="transform" type="rotate" values="-30 400 400;-38 400 400;-30 400 400" dur="12s" repeatCount="indefinite" />
                </rect>
              </g>
              <g className="diamond-float diamond-7">
                <rect x="200" y="50" width="400" height="400" rx="10" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1">
                  <animateTransform attributeName="transform" type="rotate" values="-30 400 250;-22 400 250;-30 400 250" dur="9s" repeatCount="indefinite" />
                </rect>
              </g>
              <g className="diamond-float diamond-8">
                <rect x="500" y="150" width="350" height="350" rx="10" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="0.8">
                  <animateTransform attributeName="transform" type="rotate" values="-30 675 325;-38 675 325;-30 675 325" dur="10s" repeatCount="indefinite" />
                </rect>
              </g>
            </g>
          </svg>
          {/* Abstract overlapping diagonal shapes — static (mobile) */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-[1] pointer-events-none block md:hidden" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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
              <rect className="diamond-float diamond-1" x="-200" y="-100" width="900" height="900" rx="20" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" transform="rotate(-30 250 350)" />
              <rect className="diamond-float diamond-2" x="100" y="-200" width="800" height="800" rx="20" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="1.8" transform="rotate(-30 500 200)" />
              <rect className="diamond-float diamond-3" x="400" y="-100" width="700" height="700" rx="20" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="1.8" transform="rotate(-30 750 250)" />
              <rect className="diamond-float diamond-4" x="600" y="0" width="600" height="600" rx="20" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" transform="rotate(-30 900 300)" />
              <rect className="diamond-float diamond-5" x="300" y="200" width="500" height="500" rx="20" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" transform="rotate(-30 550 450)" />
              <rect className="diamond-float diamond-6" x="100" y="100" width="600" height="600" rx="20" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" transform="rotate(-30 400 400)" />
              <rect className="diamond-float diamond-7" x="200" y="50" width="400" height="400" rx="10" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1" transform="rotate(-30 400 250)" />
              <rect className="diamond-float diamond-8" x="500" y="150" width="350" height="350" rx="10" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="0.8" transform="rotate(-30 675 325)" />
            </g>
          </svg>
          {/* Decorative gradient orbs */}
          <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full" style={{ background: "var(--gradient-orb-cyan-strong)" }} aria-hidden="true" />
          <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full" style={{ background: "var(--gradient-orb-pink-strong)" }} aria-hidden="true" />
          <div className="noise-overlay" aria-hidden="true" />
          <div className="relative z-10 h-full"><Projects /></div>
        </Fragment>,

        /* Contact — geometric */
        <Fragment key="contact">
          {/* Base — blue pink gradient */}
          <div className="absolute inset-0 z-0" style={{ background: "var(--gradient-contact)" }} aria-hidden="true" />
          {/* Geometric diamond pattern */}
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full z-[1] pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
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
          <div className="noise-overlay" aria-hidden="true" />
          <div className="relative z-10 h-full">
            <Contact />
            <Footer />
          </div>
        </Fragment>,
      ]}
    />
  );
}
