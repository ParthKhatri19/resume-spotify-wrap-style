"use client";
import { useState, useEffect } from "react";

const LANGUAGES = [
  { name: "C#",         pct: 92, color: "#9B59B6" },
  { name: "Python",     pct: 78, color: "#3498DB" },
  { name: "JavaScript", pct: 85, color: "#F1C40F" },
  { name: "TypeScript", pct: 80, color: "#2980B9" },
  { name: "SQL",        pct: 88, color: "#E74C3C" },
  { name: "HTML & CSS", pct: 75, color: "#E67E22" },
];

const TECH_GROUPS = [
  { label: "Backend",      color: "#FF6B35", tags: ["ASP.NET Core", "REST API", "JWT Auth", "ASP.NET MVC"] },
  { label: "Frontend",     color: "#A855F7", tags: ["Angular", "TypeScript", "Kendo Grid", "HTML & CSS"] },
  { label: "Database",     color: "#22C55E", tags: ["MS SQL Server", "Stored Procs", "DB Triggers", "Query Optimization"] },
  { label: "Security",     color: "#EF4444", tags: ["API Encryption", "Role-based Access", "Symmetric Keys"] },
  { label: "Integrations", color: "#38BDF8", tags: ["Twilio", "Google Maps API", "Fishbowl Inventory", "Excel Import"] },
  { label: "Cloud & AI",   color: "#1DB954", tags: ["Azure", "Devin", "Cursor", "Claude Code"] },
];

export default function SkillsPanel() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Language bars */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-3">
          LANGUAGE STATS
        </p>
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang, i) => (
            <div key={lang.name}>
              <div className="flex justify-between mb-1">
                <span className="font-inter text-white/70 text-xs">{lang.name}</span>
                <span className="font-inter text-white/40 text-xs">{lang.pct}%</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: started ? `${lang.pct}%` : "0%",
                    background: lang.color,
                    boxShadow: `0 0 6px ${lang.color}88`,
                    transition: `width 0.8s ease-out ${i * 0.08}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech groups */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.5s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-3">
          TECH STACK
        </p>
        <div className="flex flex-col gap-3">
          {TECH_GROUPS.map((group) => (
            <div key={group.label}>
              <p
                className="font-bebas text-xs tracking-wider mb-1.5"
                style={{ color: group.color }}
              >
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-inter text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: `${group.color}12`,
                      border: `1px solid ${group.color}30`,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
