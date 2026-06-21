"use client";
import { useState, useEffect } from "react";

const TIPS = [
  "Tip: This developer never misses a deadline",
  "Tip: Hire before competitors do",
  "Tip: 4+ years of production software shipped",
  "Tip: Azure certified. Three times.",
  "Tip: Builds things that actually work in prod",
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  // Progress bar: fills over ~2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 200);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Tip rotation — only after load
  useEffect(() => {
    if (!loaded) return;
    const cycle = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((i) => (i + 1) % TIPS.length);
        setTipVisible(true);
      }, 450);
    }, 3500);
    return () => clearInterval(cycle);
  }, [loaded]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "var(--gta-bg)" }}
    >
      {/* Sunset gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,0,110,0.22) 0%, rgba(255,107,53,0.12) 25%, rgba(123,47,190,0.07) 55%, transparent 100%)",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)",
        }}
      />

      {/* Noise overlay (reuse existing .noise class) */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Palm trees */}
      <PalmTree
        style={{ position: "absolute", bottom: 0, left: "2rem", opacity: 0.28 }}
      />
      <PalmTree
        style={{
          position: "absolute",
          bottom: 0,
          right: "3rem",
          opacity: 0.18,
          transform: "scaleX(-1) scale(0.85)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5 w-full max-w-2xl">
        {/* Name */}
        <h1
          className="font-bebas leading-none tracking-wider text-6xl sm:text-8xl md:text-[110px]"
          style={{
            color: "var(--gta-pink)",
            textShadow: "0 0 18px rgba(255,0,110,0.8), 0 0 40px rgba(255,0,110,0.4)",
            animation: loaded ? "flicker 6s ease-in-out 2s infinite" : "none",
          }}
        >
          PARTH KHATRI
        </h1>

        {/* Title */}
        <p
          className="font-inter text-white/55 text-sm sm:text-base tracking-[0.45em] uppercase"
        >
          Sr. Software Engineer
        </p>

        {/* Wanted stars */}
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="text-xl sm:text-2xl"
              style={{ color: "var(--gta-pink)", textShadow: "0 0 8px rgba(255,0,110,0.7)" }}
            >
              ★
            </span>
          ))}
          <span className="text-xl sm:text-2xl text-white/15">★</span>
        </div>

        {/* Progress bar */}
        {!loaded && (
          <div className="w-full max-w-sm mt-2">
            <p
              className="font-inter text-white/35 text-xs tracking-[0.25em] uppercase mb-2"
            >
              INITIALIZING PARTH KHATRI...
            </p>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--gta-pink), var(--gta-orange))",
                  boxShadow: "0 0 10px rgba(255,0,110,0.7)",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
          </div>
        )}

        {/* Scroll hint */}
        {loaded && (
          <p
            className="font-inter text-white/30 text-xs tracking-[0.3em] uppercase"
            style={{ animation: "blink 1.4s ease-in-out infinite" }}
          >
            ↓ SCROLL TO EXPLORE
          </p>
        )}
      </div>

      {/* Rotating tips — bottom left */}
      {loaded && (
        <div
          className="absolute bottom-8 left-5 sm:left-8 max-w-[240px] sm:max-w-xs"
          style={{
            opacity: tipVisible ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
        >
          <p className="font-inter text-white/35 text-xs leading-relaxed">
            {TIPS[tipIndex]}
          </p>
        </div>
      )}
    </div>
  );
}

function PalmTree({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="70"
      height="190"
      viewBox="0 0 70 190"
      fill="none"
      className="gta-sway"
      style={style}
    >
      {/* Trunk */}
      <path
        d="M34 190 Q32 145 36 95 Q40 48 38 18"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Fronds */}
      <path d="M38 18 Q18 8  0 28"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 18 Q56 4 70 18"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 18 Q28 -4 14 2"  stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 18 Q52 -4 62 6"  stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 18 Q38 2 26 -8"  stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
