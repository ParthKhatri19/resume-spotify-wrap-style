"use client";

export default function AboutPanel() {
  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
        <p
          className="font-bebas text-4xl leading-none"
          style={{
            color: "var(--gta-pink)",
            textShadow: "0 0 24px rgba(255,0,110,0.5)",
          }}
        >
          PARTH KHATRI
        </p>
        <p className="font-inter text-white/60 text-sm tracking-[0.2em] uppercase mt-1">
          Sr. Software Engineer
        </p>
      </div>

      {/* Wanted stars */}
      <div
        className="flex items-center gap-1"
        style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}
      >
        {"★★★★".split("").map((s, i) => (
          <span key={i} style={{ color: "var(--gta-pink)", fontSize: "20px" }}>{s}</span>
        ))}
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "20px" }}>★</span>
        <span className="font-inter text-white/30 text-xs ml-2 tracking-wider">WANTED LEVEL</span>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 gap-3"
        style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}
      >
        {[
          { label: "YEARS XP",   value: "4+" },
          { label: "PROJECTS",   value: "3+" },
          { label: "CERTS",      value: "6"  },
          { label: "LANGUAGES",  value: "6"  },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl px-4 py-3 text-center"
            style={{
              background: "rgba(255,0,110,0.08)",
              border: "1px solid rgba(255,0,110,0.2)",
            }}
          >
            <p className="font-bebas text-2xl leading-none" style={{ color: "var(--gta-pink)" }}>
              {stat.value}
            </p>
            <p className="font-inter text-white/35 text-[10px] tracking-widest uppercase mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <p
        className="font-inter text-white/55 text-sm leading-relaxed"
        style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}
      >
        4+ years shipping production software. Azure certified three times. Builds things that actually work in prod.
      </p>

      {/* Location */}
      <p
        className="font-inter text-white/35 text-xs tracking-wider"
        style={{ animation: "slideUp 0.5s ease-out 0.5s both" }}
      >
        📍 Ahmedabad, Gujarat, India
      </p>
    </div>
  );
}
