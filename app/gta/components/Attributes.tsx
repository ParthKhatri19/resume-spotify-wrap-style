"use client";
import { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { name: "C#",         pct: 92, color: "#9B59B6" },
  { name: "Python",     pct: 78, color: "#3498DB" },
  { name: "JavaScript", pct: 85, color: "#F1C40F" },
  { name: "TypeScript", pct: 80, color: "#2980B9" },
  { name: "SQL",        pct: 88, color: "#E74C3C" },
  { name: "HTML & CSS", pct: 75, color: "#E67E22" },
];

const TECH_GROUPS = [
  { category: "Backend",      color: "#FF6B35", skills: ["ASP.NET Core", "REST API", "JWT Auth", "ASP.NET MVC", "ITextSharp"] },
  { category: "Frontend",     color: "#A855F7", skills: ["Angular", "TypeScript", "Kendo Grid", "HTML & CSS", "SEO"] },
  { category: "Database",     color: "#22C55E", skills: ["MS SQL Server", "Stored Procs", "DB Triggers", "Symmetric Keys", "Query Optimization"] },
  { category: "Security",     color: "#EF4444", skills: ["API Encryption", "Role-based Access", "Certificate Auth", "Secure DB Fields"] },
  { category: "Integrations", color: "#38BDF8", skills: ["Twilio", "Google Maps API", "Excel Import", "Fishbowl Inventory"] },
  { category: "Cloud & AI",   color: "#1DB954", skills: ["Azure", "Devin", "Cursor", "Claude Code"] },
];

export default function Attributes() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #08091a 0%, #0d0d20 100%)" }}
    >
      {/* Hex grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,245,255,0.4) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p className="font-inter text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gta-cyan)" }}>
            SKILLS ZONE
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(0,245,255,0.4)" }}
          >
            ATTRIBUTES
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
          {/* Languages */}
          <div>
            <p
              className="font-bebas text-xl tracking-widest mb-4"
              style={{ color: "var(--gta-cyan)", letterSpacing: "0.2em" }}
            >
              LANGUAGES
            </p>
            <div className="flex flex-col gap-3.5">
              {LANGUAGES.map((lang, i) => (
                <div
                  key={lang.name}
                  className="flex items-center gap-3"
                  style={{ animation: `slideUp 0.5s ease-out ${0.2 + i * 0.08}s both` }}
                >
                  <span className="font-inter text-white/80 text-sm w-24 shrink-0">{lang.name}</span>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: "10px", background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: started ? `${lang.pct}%` : "0%",
                        background: lang.color,
                        boxShadow: started ? `0 0 8px ${lang.color}88` : "none",
                        transition: `width 1s ease-out ${0.3 + i * 0.1}s, box-shadow 1s ease-out ${0.3 + i * 0.1}s`,
                      }}
                    />
                  </div>
                  <span className="font-inter text-white/35 text-xs w-8 text-right">{lang.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <p
              className="font-bebas text-xl tracking-widest mb-4"
              style={{ color: "var(--gta-cyan)", letterSpacing: "0.2em" }}
            >
              TECH STACK
            </p>
            <div className="flex flex-col gap-3">
              {TECH_GROUPS.map((group, i) => (
                <div
                  key={group.category}
                  className="rounded-xl p-3"
                  style={{
                    background: `${group.color}0d`,
                    border: `1px solid ${group.color}28`,
                    animation: `slideUp 0.5s ease-out ${0.25 + i * 0.07}s both`,
                  }}
                >
                  <p
                    className="font-bebas text-xs tracking-widest mb-1.5"
                    style={{ color: group.color }}
                  >
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="font-inter text-white/65 text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
