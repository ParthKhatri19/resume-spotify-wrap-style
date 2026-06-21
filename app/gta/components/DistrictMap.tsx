"use client";

interface Props {
  isOpen: boolean;
  activeSection: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const DISTRICTS = [
  {
    id: "ifruit-phone",
    name: "IFRUIT NETWORK",
    sublabel: "Contact",
    color: "#1DB954",
    // Top strip — full width
    points: "0,0 480,0 480,62 260,78 0,70",
    labelX: 240, labelY: 35,
  },
  {
    id: "heist-board",
    name: "HEIST QUARTER",
    sublabel: "Projects",
    color: "#7B2FBE",
    // Upper left block
    points: "0,70 260,78 250,200 0,205",
    labelX: 108, labelY: 145,
  },
  {
    id: "safe-house",
    name: "VICE ACADEMY",
    sublabel: "Education",
    color: "#FFD700",
    // Upper right block
    points: "260,78 480,62 480,200 250,200",
    labelX: 370, labelY: 145,
  },
  {
    id: "hero",
    name: "VICE CITY BEACH",
    sublabel: "Loading Screen",
    color: "#FF006E",
    // Bottom left
    points: "0,205 155,200 155,300 0,300",
    labelX: 60, labelY: 258,
  },
  {
    id: "mission-log",
    name: "MISSION DISTRICT",
    sublabel: "Experience",
    color: "#FF6B35",
    // Bottom center
    points: "155,200 325,205 325,300 155,300",
    labelX: 240, labelY: 258,
  },
  {
    id: "attributes",
    name: "SKILLS ZONE",
    sublabel: "Attributes",
    color: "#00F5FF",
    // Bottom right
    points: "325,205 480,200 480,300 325,300",
    labelX: 400, labelY: 258,
  },
] as const;

export default function DistrictMap({ isOpen, activeSection, onClose, onNavigate }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: "rgba(8,8,20,0.96)",
        animation: "fadeIn 0.2s ease-out both",
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px)",
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-5 text-white/50 hover:text-white text-2xl leading-none transition-colors z-10 font-inter"
        aria-label="Close map (Esc)"
      >
        ✕
      </button>

      {/* Header */}
      <div className="relative z-10 mb-6 text-center">
        <p
          className="font-bebas text-4xl sm:text-5xl tracking-widest"
          style={{ color: "var(--gta-pink)", textShadow: "0 0 20px rgba(255,0,110,0.6)" }}
        >
          VICE CITY
        </p>
        <p className="font-inter text-white/30 text-xs tracking-[0.3em] uppercase mt-1">
          Press M or ESC to close · Click a district to navigate
        </p>
      </div>

      {/* SVG Map — desktop */}
      <div className="relative z-10 w-full max-w-lg px-4 hidden sm:block">
        <svg
          viewBox="0 0 480 300"
          className="w-full"
          style={{ filter: "drop-shadow(0 0 24px rgba(255,0,110,0.15))" }}
        >
          {DISTRICTS.map((d) => {
            const isActive = d.id === activeSection;
            return (
              <g
                key={d.id}
                onClick={() => onNavigate(d.id)}
                style={{ cursor: "pointer" }}
                className="group"
              >
                <polygon
                  points={d.points}
                  fill={isActive ? `${d.color}28` : `${d.color}0e`}
                  stroke={d.color}
                  strokeWidth={isActive ? "2" : "1"}
                  style={{
                    opacity: isActive ? 1 : 0.75,
                    filter: isActive ? `drop-shadow(0 0 6px ${d.color})` : "none",
                    transition: "all 0.2s ease",
                  }}
                />
                {/* District name */}
                <text
                  x={d.labelX}
                  y={d.labelY - 7}
                  textAnchor="middle"
                  fill={d.color}
                  fontSize="9"
                  fontFamily="var(--font-bebas)"
                  letterSpacing="2"
                  style={{ opacity: isActive ? 1 : 0.8 }}
                >
                  {d.name}
                </text>
                {/* Sub-label */}
                <text
                  x={d.labelX}
                  y={d.labelY + 5}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="6"
                  fontFamily="var(--font-inter)"
                  letterSpacing="1"
                >
                  {d.sublabel}
                </text>
                {/* Active blip */}
                {isActive && (
                  <circle
                    cx={d.labelX}
                    cy={d.labelY + 16}
                    r="3"
                    fill={d.color}
                    className="gta-neon-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* List fallback — mobile */}
      <div className="sm:hidden relative z-10 w-full max-w-sm px-6 flex flex-col gap-2">
        {DISTRICTS.map((d) => {
          const isActive = d.id === activeSection;
          return (
            <button
              key={d.id}
              onClick={() => onNavigate(d.id)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all"
              style={{
                background: isActive ? `${d.color}20` : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? d.color : "rgba(255,255,255,0.1)"}`,
                boxShadow: isActive ? `0 0 12px ${d.color}44` : "none",
              }}
            >
              <div>
                <p className="font-bebas tracking-wider text-sm" style={{ color: d.color }}>
                  {d.name}
                </p>
                <p className="font-inter text-white/40 text-xs">{d.sublabel}</p>
              </div>
              {isActive && (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
