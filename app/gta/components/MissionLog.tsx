"use client";
import { useState, useEffect, useRef } from "react";

const BRIEFING = [
  "Built production ASP.NET Core APIs serving real customers",
  "Implemented real-time chef booking with Twilio SMS/chat",
  "Developed geo-optimized route management with Google Maps API",
  "Built Angular frontend with Kendo Grid for enterprise data views",
  "Designed MS SQL Server schemas with stored procs and triggers",
  "Implemented API encryption, JWT auth, and role-based access control",
  "Integrated Fishbowl Inventory and Excel import/export pipelines",
];

const UNLOCKED = ["C#", "Azure", "Angular", "Twilio", "SQL Server", "TypeScript"];

export default function MissionLog() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setBannerVisible(true);
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-4"
      style={{
        background: "linear-gradient(160deg, #0d0d1a 0%, #111118 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,107,53,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Section header */}
        <div className="mb-8 text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p
            className="font-inter text-xs tracking-[0.35em] uppercase mb-2"
            style={{ color: "var(--gta-orange)" }}
          >
            MISSION DISTRICT
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(255,107,53,0.5)" }}
          >
            MISSION LOG
          </h2>
        </div>

        {/* Mission card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,107,53,0.05)",
            border: "1px solid rgba(255,107,53,0.3)",
            boxShadow: "0 0 30px rgba(255,107,53,0.08)",
            animation: "slideUp 0.6s ease-out 0.2s both",
          }}
        >
          {/* MISSION PASSED banner */}
          {bannerVisible && (
            <div
              className="absolute top-0 left-0 right-0 flex items-center justify-center gap-3 py-2 z-20"
              style={{
                background: "linear-gradient(90deg, #16a34a, #15803d)",
                animation: "slideAcross 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s both",
              }}
            >
              <span className="text-white font-black text-sm tracking-widest uppercase font-inter">
                ✅ MISSION PASSED!
              </span>
            </div>
          )}

          {/* Card header */}
          <div className="px-5 sm:px-6 pt-12 pb-4 border-b border-white/10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-tight">
                  SR. SOFTWARE ENGINEER
                </p>
              </div>
              {/* Difficulty */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="font-inter text-white/30 text-[10px] uppercase tracking-wider">Difficulty</p>
                <div className="flex gap-0.5">
                  {"★★★★".split("").map((s, i) => (
                    <span key={i} style={{ color: "var(--gta-orange)", fontSize: "14px" }}>{s}</span>
                  ))}
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px" }}>★</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              <InfoRow label="DURATION" value="Jan 2022 → Present" />
              <InfoRow label="LOCATION" value="Ahmedabad, Gujarat, India" />
              <InfoRow label="XP GAINED" value="+4 Years" color="var(--gta-orange)" />
            </div>
          </div>

          {/* Briefing */}
          <div className="px-5 sm:px-6 py-4 border-b border-white/10">
            <p
              className="font-inter text-white/40 text-[10px] tracking-[0.25em] uppercase mb-3"
            >
              MISSION BRIEFING
            </p>
            <ul className="flex flex-col gap-2">
              {BRIEFING.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-inter text-white/70 text-sm leading-snug"
                  style={{ animation: `slideUp 0.4s ease-out ${0.4 + i * 0.06}s both` }}
                >
                  <span style={{ color: "var(--gta-orange)", marginTop: "2px", flexShrink: 0 }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills unlocked */}
          <div className="px-5 sm:px-6 py-4">
            <p className="font-inter text-white/40 text-[10px] tracking-[0.25em] uppercase mb-3">
              SKILLS UNLOCKED
            </p>
            <div className="flex flex-wrap gap-2">
              {UNLOCKED.map((skill) => (
                <span
                  key={skill}
                  className="font-inter text-xs px-3 py-1 rounded-full font-semibold"
                  style={{
                    background: "rgba(255,107,53,0.12)",
                    border: "1px solid rgba(255,107,53,0.35)",
                    color: "var(--gta-orange)",
                  }}
                >
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="font-inter text-white/30 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="font-inter text-sm font-semibold mt-0.5" style={{ color: color ?? "rgba(255,255,255,0.8)" }}>
        {value}
      </p>
    </div>
  );
}
