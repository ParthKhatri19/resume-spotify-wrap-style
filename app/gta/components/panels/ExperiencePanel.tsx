"use client";

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

export default function ExperiencePanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
        <p className="font-bebas text-xl tracking-wide text-white leading-tight">
          SR. SOFTWARE ENGINEER
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="font-inter text-white/50 text-xs">Jan 2022 → Present</span>
          <span
            className="font-bebas text-xs px-2 py-0.5 rounded-full tracking-wider"
            style={{
              background: "rgba(255,107,53,0.15)",
              border: "1px solid rgba(255,107,53,0.35)",
              color: "var(--gta-orange)",
            }}
          >
            +4 Years XP
          </span>
        </div>
        <p className="font-inter text-white/30 text-xs mt-1">📍 Ahmedabad, Gujarat, India</p>
      </div>

      {/* Difficulty stars */}
      <div
        className="flex items-center gap-1"
        style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
      >
        <span className="font-inter text-white/30 text-[10px] uppercase tracking-wider mr-2">Difficulty</span>
        {"★★★★".split("").map((s, i) => (
          <span key={i} style={{ color: "var(--gta-orange)", fontSize: "14px" }}>{s}</span>
        ))}
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px" }}>★</span>
      </div>

      {/* Briefing */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-2">
          MISSION BRIEFING
        </p>
        <ul className="flex flex-col gap-2">
          {BRIEFING.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 font-inter text-white/70 text-xs leading-snug"
              style={{ animation: `slideUp 0.4s ease-out ${0.25 + i * 0.05}s both` }}
            >
              <span style={{ color: "var(--gta-orange)", marginTop: "1px", flexShrink: 0 }}>›</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills unlocked */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.65s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-2">
          SKILLS UNLOCKED
        </p>
        <div className="flex flex-wrap gap-2">
          {UNLOCKED.map((skill) => (
            <span
              key={skill}
              className="font-inter text-xs px-2 py-1 rounded-full font-semibold"
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
  );
}
