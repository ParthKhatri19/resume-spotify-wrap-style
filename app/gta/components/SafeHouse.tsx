"use client";

const CERTS = [
  { name: "DevOps Engineer Expert (AZ-400)", year: "2025", icon: "🚀", tier: "azure" },
  { name: "Azure Developer Associate",       year: "2024", icon: "⚡", tier: "azure" },
  { name: "Azure Fundamentals (AZ-900)",     year: "2024", icon: "☁️", tier: "azure" },
  { name: "Python for Everybody",            year: "2021", icon: "🐍", tier: "standard" },
  { name: "Python Data Structures",          year: "2020", icon: "📊", tier: "standard" },
  { name: "Data Science in Python",          year: "2020", icon: "🔬", tier: "standard" },
];

export default function SafeHouse() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0c0a00 0%, #111008 100%)" }}
    >
      {/* Property grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,215,0,0.15) 0px, rgba(255,215,0,0.15) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,215,0,0.15) 0px, rgba(255,215,0,0.15) 1px, transparent 1px, transparent 40px)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p className="font-inter text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gta-gold)" }}>
            VICE ACADEMY
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(255,215,0,0.4)" }}
          >
            PROPERTIES
          </h2>
        </div>

        {/* Education card */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: "rgba(255,215,0,0.06)",
            border: "1px solid rgba(255,215,0,0.3)",
            boxShadow: "0 0 20px rgba(255,215,0,0.06)",
            animation: "slideUp 0.6s ease-out 0.2s both",
          }}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🏛️</span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="font-bebas text-xl tracking-wide text-white leading-tight">
                    INDUS UNIVERSITY
                  </p>
                  <p className="font-inter text-white/50 text-sm">B.Tech Computer Engineering</p>
                  <p className="font-inter text-white/35 text-xs mt-0.5">📍 Ahmedabad, Gujarat · 2018 – 2022</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bebas text-2xl leading-none" style={{ color: "var(--gta-gold)" }}>9.56</p>
                  <p className="font-inter text-white/35 text-[10px] uppercase tracking-wider">CGPA / 10</p>
                </div>
              </div>
              <div className="mt-3">
                <span
                  className="font-bebas text-xs tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,215,0,0.12)",
                    border: "1px solid rgba(255,215,0,0.35)",
                    color: "var(--gta-gold)",
                  }}
                >
                  ✅ PURCHASED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Certs header */}
        <p
          className="font-bebas text-lg tracking-widest mb-3"
          style={{ color: "var(--gta-gold)", animation: "fadeIn 0.5s ease-out 0.35s both" }}
        >
          PROPERTY UPGRADES
        </p>

        {/* Cert cards */}
        <div className="flex flex-col gap-2">
          {CERTS.map((cert, i) => {
            const isAzure = cert.tier === "azure";
            return (
              <div
                key={cert.name}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: isAzure ? "rgba(255,215,0,0.07)" : "rgba(255,255,255,0.03)",
                  border: isAzure
                    ? "1px solid rgba(255,215,0,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
                  animation: `${i % 2 === 0 ? "slideInLeft" : "slideInRight"} 0.5s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.07}s both`,
                }}
              >
                <span className="text-lg">{cert.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-inter text-sm font-semibold leading-snug truncate"
                    style={{ color: isAzure ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}
                  >
                    {cert.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="font-inter text-xs font-bold"
                    style={{ color: isAzure ? "var(--gta-gold)" : "rgba(255,255,255,0.25)" }}
                  >
                    {cert.year}
                  </span>
                  {isAzure && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: "var(--gta-gold)",
                        animation: "ping-slow 1.8s ease-out infinite",
                      }}
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
