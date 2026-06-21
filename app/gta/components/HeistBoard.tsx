"use client";

const HEISTS = [
  {
    name: "Booking & Chat Platform",
    crew: "ASP.NET Core · Twilio · MSSQL · JWT",
    payout: "Real-time chef booking + secure live chat for customers",
    difficulty: 4,
    status: "COMPLETE",
    statusColor: "#FF6B35",
    glowColor: "#FF6B35",
    icon: "💬",
    rotate: "-1.5deg",
  },
  {
    name: "Sales & Route Management",
    crew: "Google Maps API · ASP.NET · Fishbowl Inventory",
    payout: "Geo-optimized field sales routing reducing travel time by 30%",
    difficulty: 4,
    status: "COMPLETE",
    statusColor: "#22C55E",
    glowColor: "#22C55E",
    icon: "🗺️",
    rotate: "0.8deg",
  },
  {
    name: "Secure Supply Portal",
    crew: "Angular · API Encryption · MS SQL · SEO",
    payout: "HIPAA-grade medical supply ordering with symmetric key encryption",
    difficulty: 5,
    status: "COMPLETE",
    statusColor: "#3B82F6",
    glowColor: "#3B82F6",
    icon: "🔐",
    rotate: "-0.7deg",
  },
];

export default function HeistBoard() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #100d0a 0%, #181410 100%)",
      }}
    >
      {/* Corkboard texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(255,107,53,0.08) 14px, rgba(255,107,53,0.08) 15px), repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,107,53,0.08) 14px, rgba(255,107,53,0.08) 15px)",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p className="font-inter text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gta-purple)" }}>
            HEIST QUARTER
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(123,47,190,0.5)" }}
          >
            ACTIVE HEISTS
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-5 sm:gap-4">
          {HEISTS.map((h, i) => (
            <div
              key={h.name}
              className="group flex flex-col gap-3 rounded-2xl p-4 cursor-default"
              style={{
                background: `${h.glowColor}0a`,
                border: `1px solid ${h.glowColor}25`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                animation: `slideUp 0.6s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.12}s both`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "rotate(0deg) translateY(-6px) scale(1.02)";
                el.style.boxShadow = `0 16px 40px ${h.glowColor}30`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = `rotate(${h.rotate})`;
                el.style.boxShadow = "none";
              }}
            >
              {/* Icon + name */}
              <div className="flex items-start gap-2">
                <span className="text-2xl">{h.icon}</span>
                <div>
                  <p
                    className="font-inter text-[10px] uppercase tracking-widest mb-0.5"
                    style={{ color: h.glowColor }}
                  >
                    🎯 HEIST
                  </p>
                  <p className="font-bebas text-base sm:text-lg text-white leading-tight tracking-wide">
                    {h.name}
                  </p>
                </div>
              </div>

              {/* Crew */}
              <div>
                <p className="font-inter text-[10px] text-white/30 uppercase tracking-wider mb-1">
                  👥 CREW
                </p>
                <p className="font-inter text-white/55 text-xs leading-relaxed">{h.crew}</p>
              </div>

              {/* Payout */}
              <div>
                <p className="font-inter text-[10px] text-white/30 uppercase tracking-wider mb-1">
                  💰 PAYOUT
                </p>
                <p className="font-inter text-white/70 text-xs leading-relaxed">{h.payout}</p>
              </div>

              {/* Footer: difficulty + status */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/8">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span
                      key={si}
                      style={{
                        color: si < h.difficulty ? h.glowColor : "rgba(255,255,255,0.12)",
                        fontSize: "11px",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span
                  className="font-bebas text-xs tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: `${h.statusColor}18`,
                    border: `1px solid ${h.statusColor}40`,
                    color: h.statusColor,
                  }}
                >
                  {h.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
