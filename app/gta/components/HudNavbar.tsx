"use client";

interface HudNavbarProps {
  activeSection: string;
  sections: readonly { id: string; area: string }[];
  onMapOpen: () => void;
}

export default function HudNavbar({ activeSection, sections, onMapOpen }: HudNavbarProps) {
  const currentArea = sections.find((s) => s.id === activeSection)?.area ?? "VICE CITY";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-[52px]"
      style={{
        background: "rgba(10,10,26,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,0,110,0.35)",
        boxShadow: "0 1px 24px rgba(255,0,110,0.12)",
      }}
    >
      {/* Map icon + label */}
      <button
        onClick={onMapOpen}
        className="flex items-center gap-2 group"
        aria-label="Open district map (press M)"
        title="Open district map (M)"
      >
        <RadarIcon />
        <span
          className="hidden sm:block text-xs tracking-[0.25em] uppercase font-semibold transition-colors duration-200 group-hover:text-white"
          style={{ color: "rgba(255,0,110,0.7)", fontFamily: "var(--font-inter)" }}
        >
          MAP
        </span>
      </button>

      {/* Center: name */}
      <span
        className="font-bebas tracking-[0.2em] text-white text-base sm:text-lg absolute left-1/2 -translate-x-1/2"
      >
        PARTH KHATRI
      </span>

      {/* Right: active area */}
      <span
        key={currentArea}
        className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold"
        style={{
          color: "var(--gta-pink)",
          fontFamily: "var(--font-inter)",
          animation: "fadeIn 0.3s ease-out both",
          maxWidth: "140px",
          textAlign: "right",
          lineHeight: 1.2,
        }}
      >
        {currentArea}
      </span>
    </nav>
  );
}

function RadarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="group-hover:opacity-100 transition-opacity duration-200"
      style={{ opacity: 0.75 }}
    >
      {/* Outer rings */}
      <circle cx="12" cy="12" r="10" stroke="rgba(255,0,110,0.5)" strokeWidth="1" />
      <circle cx="12" cy="12" r="6"  stroke="rgba(255,0,110,0.35)" strokeWidth="1" />
      <circle cx="12" cy="12" r="2.5" stroke="rgba(255,0,110,0.5)" strokeWidth="1" />
      {/* Cross hairs */}
      <line x1="12" y1="2"  x2="12" y2="22" stroke="rgba(255,0,110,0.2)" strokeWidth="0.75" />
      <line x1="2"  y1="12" x2="22" y2="12" stroke="rgba(255,0,110,0.2)" strokeWidth="0.75" />
      {/* Blip */}
      <circle cx="16" cy="9" r="1.8" fill="#FF006E" />
      <circle cx="16" cy="9" r="1.8" fill="#FF006E" opacity="0.45" className="animate-ping" style={{ animationDuration: "1.8s" }} />
    </svg>
  );
}
