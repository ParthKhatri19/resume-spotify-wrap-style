"use client";

const CERTS = [
  { name: "DevOps Engineer Expert (AZ-400)", year: "2025", icon: "🚀", tier: "azure" },
  { name: "Azure Developer Associate",       year: "2024", icon: "⚡", tier: "azure" },
  { name: "Azure Fundamentals (AZ-900)",     year: "2024", icon: "☁️", tier: "azure" },
  { name: "Python for Everybody",            year: "2021", icon: "🐍", tier: "standard" },
  { name: "Python Data Structures",          year: "2020", icon: "📊", tier: "standard" },
  { name: "Data Science in Python",          year: "2020", icon: "🔬", tier: "standard" },
];

export default function EducationPanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* Education card */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(255,215,0,0.06)",
          border: "1px solid rgba(255,215,0,0.3)",
          animation: "slideUp 0.5s ease-out 0.1s both",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏛️</span>
          <div className="flex-1">
            <p className="font-bebas text-base tracking-wide text-white leading-tight">
              INDUS UNIVERSITY
            </p>
            <p className="font-inter text-white/50 text-xs">B.Tech Computer Engineering</p>
            <p className="font-inter text-white/30 text-[10px] mt-0.5">
              📍 Ahmedabad · 2018 – 2022
            </p>
            <div className="flex items-center justify-between mt-2">
              <span
                className="font-bebas text-[10px] tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,215,0,0.12)",
                  border: "1px solid rgba(255,215,0,0.35)",
                  color: "var(--gta-gold)",
                }}
              >
                ✅ PURCHASED
              </span>
              <span className="font-bebas text-xl leading-none" style={{ color: "var(--gta-gold)" }}>
                9.56 <span className="text-xs text-white/30">/ 10</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Certs */}
      <div>
        <p
          className="font-bebas text-sm tracking-widest mb-2"
          style={{ color: "var(--gta-gold)", animation: "fadeIn 0.5s ease-out 0.25s both" }}
        >
          PROPERTY UPGRADES
        </p>
        <div className="flex flex-col gap-2">
          {CERTS.map((cert, i) => {
            const isAzure = cert.tier === "azure";
            return (
              <div
                key={cert.name}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{
                  background: isAzure ? "rgba(255,215,0,0.07)" : "rgba(255,255,255,0.03)",
                  border: isAzure ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  animation: `${i % 2 === 0 ? "slideInLeft" : "slideInRight"} 0.5s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.06}s both`,
                }}
              >
                <span className="text-base">{cert.icon}</span>
                <p
                  className="font-inter text-xs font-semibold flex-1 truncate"
                  style={{ color: isAzure ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)" }}
                >
                  {cert.name}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="font-inter text-xs font-bold"
                    style={{ color: isAzure ? "var(--gta-gold)" : "rgba(255,255,255,0.2)" }}
                  >
                    {cert.year}
                  </span>
                  {isAzure && (
                    <div
                      className="w-1.5 h-1.5 rounded-full ping-slow"
                      style={{ background: "var(--gta-gold)" }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
