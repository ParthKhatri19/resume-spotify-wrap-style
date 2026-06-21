"use client";

const PROJECTS = [
  {
    title:      "Booking & Chat Platform",
    crew:       ["ASP.NET", "Twilio", "MSSQL", "JWT"],
    payout:     "Real-time chef booking + secure chat",
    difficulty: 4,
    color:      "#FF6B35",
    status:     "COMPLETE",
  },
  {
    title:      "Sales & Route Management",
    crew:       ["Google Maps API", "ASP.NET", "Fishbowl"],
    payout:     "Geo-optimized route planning for field sales",
    difficulty: 4,
    color:      "#22C55E",
    status:     "COMPLETE",
  },
  {
    title:      "Secure Supply Portal",
    crew:       ["Angular", "API Encryption", "MS SQL"],
    payout:     "HIPAA-grade secure medical supply ordering",
    difficulty: 5,
    color:      "#3B82F6",
    status:     "COMPLETE",
  },
];

export default function ProjectsPanel() {
  return (
    <div className="flex flex-col gap-4">
      {PROJECTS.map((p, i) => (
        <div
          key={p.title}
          className="rounded-xl p-4"
          style={{
            background: `${p.color}08`,
            border: `1px solid ${p.color}30`,
            animation: `slideUp 0.5s ease-out ${0.1 + i * 0.1}s both`,
          }}
        >
          {/* Status badge */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="font-bebas text-[10px] tracking-widest px-2 py-0.5 rounded-full"
              style={{
                background: `${p.color}18`,
                border: `1px solid ${p.color}40`,
                color: p.color,
              }}
            >
              ✓ {p.status}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, j) => (
                <span
                  key={j}
                  style={{ color: j < p.difficulty ? p.color : "rgba(255,255,255,0.1)", fontSize: "11px" }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <p className="font-bebas text-base tracking-wide text-white leading-tight mb-1">
            🎯 {p.title}
          </p>

          {/* Payout */}
          <p className="font-inter text-white/55 text-xs leading-snug mb-2">
            💰 {p.payout}
          </p>

          {/* Crew tags */}
          <div className="flex flex-wrap gap-1">
            {p.crew.map((tag) => (
              <span
                key={tag}
                className="font-inter text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
