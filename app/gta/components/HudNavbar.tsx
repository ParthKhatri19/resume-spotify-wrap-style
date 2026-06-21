"use client";

function RadarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="rgba(255,0,110,0.5)" strokeWidth="1" />
      <circle cx="11" cy="11" r="6"  stroke="rgba(255,0,110,0.4)" strokeWidth="1" />
      <circle cx="11" cy="11" r="2"  stroke="rgba(255,0,110,0.6)" strokeWidth="1" />
      <circle
        cx="15" cy="7" r="2"
        fill="#FF006E"
        style={{ animation: "ping-slow 1.8s ease-out infinite", transformOrigin: "15px 7px" }}
      />
    </svg>
  );
}

export default function HudNavbar({
  selectedDistrict,
  onRadarClick,
}: {
  selectedDistrict: string | null;
  onRadarClick: () => void;
}) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 sm:px-6"
      style={{
        height: "52px",
        background: "rgba(10,10,26,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,0,110,0.35)",
      }}
    >
      {/* Left: radar icon */}
      <button
        onClick={onRadarClick}
        className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
        aria-label="Return to map"
      >
        <RadarIcon />
        <span className="hidden sm:block font-bebas text-xs tracking-[0.25em] text-white/50 uppercase">
          MAP
        </span>
      </button>

      {/* Center: name */}
      <p
        className="absolute left-1/2 -translate-x-1/2 font-bebas text-base tracking-widest text-white"
        style={{ letterSpacing: "0.2em" }}
      >
        PARTH KHATRI
      </p>

      {/* Right: selected district */}
      <div className="ml-auto">
        {selectedDistrict && (
          <p
            key={selectedDistrict}
            className="font-bebas text-xs tracking-[0.2em] uppercase"
            style={{
              color: "var(--gta-pink)",
              animation: "fadeIn 0.3s ease-out both",
            }}
          >
            {selectedDistrict}
          </p>
        )}
      </div>
    </div>
  );
}
