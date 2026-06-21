"use client";
import { useState } from "react";
import { MARKERS } from "../markers";

const CITY_BLOCKS = [
  // Row 1 (y 5–55)
  { x: 5,   y: 5,  w: 78, h: 50 }, { x: 97,  y: 5,  w: 95, h: 50 },
  { x: 207, y: 5,  w: 95, h: 50 }, { x: 317, y: 5,  w: 95, h: 50 },
  { x: 427, y: 5,  w: 105, h: 50 }, { x: 547, y: 5,  w: 75, h: 50 },
  // Row 2 (y 65–130)
  { x: 5,   y: 65, w: 78, h: 63 }, { x: 97,  y: 65, w: 95, h: 63 },
  { x: 207, y: 65, w: 95, h: 63 }, { x: 317, y: 65, w: 95, h: 63 },
  { x: 427, y: 65, w: 105, h: 63 },
  // Row 3 (y 145–215)
  { x: 5,   y: 145, w: 78, h: 63 }, { x: 97,  y: 145, w: 95, h: 63 },
  { x: 207, y: 145, w: 95, h: 63 }, { x: 317, y: 145, w: 95, h: 63 },
  { x: 427, y: 145, w: 105, h: 63 }, { x: 547, y: 145, w: 75, h: 63 },
  // Row 4 (y 225–290)
  { x: 5,   y: 225, w: 78, h: 63 }, { x: 97,  y: 225, w: 95, h: 63 },
  { x: 207, y: 225, w: 95, h: 63 }, { x: 317, y: 225, w: 95, h: 63 },
  // Row 5 (y 305–365)
  { x: 5,   y: 305, w: 78, h: 63 }, { x: 97,  y: 305, w: 95, h: 63 },
  { x: 207, y: 305, w: 95, h: 63 }, { x: 317, y: 305, w: 95, h: 63 },
  // Row 6 (y 385–445)
  { x: 5,   y: 385, w: 78, h: 63 }, { x: 97,  y: 385, w: 95, h: 63 },
  { x: 207, y: 385, w: 95, h: 63 },
  // Row 7 (y 465–555)
  { x: 5,   y: 465, w: 78, h: 87 }, { x: 97,  y: 465, w: 95, h: 87 },
  { x: 207, y: 465, w: 95, h: 87 },
];

const DISTRICT_ZONES = [
  { id: "skills",     color: "#00F5FF", points: "0,0 200,0 200,220 0,220",                labelX: 100, labelY: 110 },
  { id: "education",  color: "#FFD700", points: "200,0 535,0 535,220 200,220",             labelX: 367, labelY: 110 },
  { id: "contact",    color: "#1DB954", points: "535,0 670,0 670,300 535,300",             labelX: 602, labelY: 150 },
  { id: "experience", color: "#FF6B35", points: "200,220 535,220 535,380 200,380",         labelX: 367, labelY: 300 },
  { id: "projects",   color: "#7B2FBE", points: "0,220 200,220 200,560 0,560",            labelX: 100, labelY: 390 },
  { id: "about",      color: "#FF006E", points: "630,0 700,0 715,140 695,280 725,420 705,560 620,560", labelX: 665, labelY: 390 },
] as const;

export default function CityMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: selectedId ? 0.45 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <svg
        viewBox="0 0 900 560"
        width="100%"
        height="100%"
        style={{ display: "block" }}
        onClick={() => onSelect(null)}
      >
        <defs>
          <pattern id="scanlines" x="0" y="0" width="1" height="6" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="3" fill="rgba(0,0,0,0.04)" />
          </pattern>
        </defs>

        {/* 1. Background */}
        <rect x="0" y="0" width="900" height="560" fill="#080814" />

        {/* 1b. District zones */}
        {DISTRICT_ZONES.map((zone) => {
          const isZoneSelected = zone.id === selectedId;
          const isZoneHovered  = zone.id === hoveredId;
          const district = MARKERS.find((m) => m.id === zone.id)?.district ?? "";
          return (
            <g key={zone.id} style={{ pointerEvents: "none" }}>
              <polygon
                points={zone.points}
                fill={zone.color}
                opacity={isZoneSelected ? 0.09 : isZoneHovered ? 0.065 : 0.04}
                style={{ transition: "opacity 0.3s ease" }}
              />
              <text
                x={zone.labelX}
                y={zone.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={zone.color}
                opacity={isZoneSelected ? 0.08 : 0.03}
                fontSize="28"
                fontFamily="var(--font-bebas)"
                letterSpacing="4"
                style={{ userSelect: "none", transition: "opacity 0.3s ease" }}
              >
                {district}
              </text>
            </g>
          );
        })}

        {/* 2. City blocks */}
        {CITY_BLOCKS.map((b, i) => (
          <rect
            key={i}
            x={b.x} y={b.y} width={b.w} height={b.h}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}

        {/* 3. Roads — horizontal */}
        {[60, 140, 220, 300, 380, 460].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="650" y2={y}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}
        {/* 3. Roads — vertical */}
        {[90, 200, 310, 420, 535].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="560"
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}
        {/* 3. Highway (diagonal) */}
        <line x1="0" y1="330" x2="640" y2="40"
          stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />

        {/* 4. Ocean polygon */}
        <polygon
          points="700,0 720,140 700,280 730,420 710,560 900,560 900,0"
          fill="#050f1a"
        />
        {/* 4. Beach strip */}
        <polygon
          points="675,0 695,140 675,280 705,420 685,560 710,560 730,420 700,280 720,140 700,0"
          fill="rgba(180,140,80,0.12)"
        />
        {/* 4. Wave lines in ocean */}
        {[80, 160, 240, 320, 400, 480].map((y) => (
          <line key={`w${y}`}
            x1="740" y1={y} x2="880" y2={y}
            stroke="rgba(0,245,255,0.06)" strokeWidth="1" />
        ))}

        {/* 4b. Landmark icons */}
        <g style={{ pointerEvents: "none" }} opacity="0.45">
          {/* Circuit chip — SKILLS ZONE (cx=180, cy=160) */}
          <g transform="translate(178,132)">
            <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#00F5FF" strokeWidth="1.5" rx="2" />
            <circle cx="0" cy="0" r="2.5" fill="#00F5FF" />
            <line x1="-12" y1="-4" x2="-8" y2="-4" stroke="#00F5FF" strokeWidth="1" />
            <line x1="-12" y1="4"  x2="-8" y2="4"  stroke="#00F5FF" strokeWidth="1" />
            <line x1="8"  y1="-4" x2="12" y2="-4"  stroke="#00F5FF" strokeWidth="1" />
            <line x1="8"  y1="4"  x2="12" y2="4"   stroke="#00F5FF" strokeWidth="1" />
            <line x1="-4" y1="-12" x2="-4" y2="-8" stroke="#00F5FF" strokeWidth="1" />
            <line x1="4"  y1="-12" x2="4"  y2="-8" stroke="#00F5FF" strokeWidth="1" />
          </g>

          {/* Graduation cap — VICE ACADEMY (cx=440, cy=130) */}
          <g transform="translate(445,100)">
            <polygon points="0,-14 14,-7 0,0 -14,-7" fill="#FFD700" />
            <line x1="14" y1="-7" x2="14" y2="4"   stroke="#FFD700" strokeWidth="1.5" />
            <circle cx="14" cy="6" r="2" fill="#FFD700" />
          </g>

          {/* Signal tower — IFRUIT NETWORK (cx=580, cy=210) */}
          <g transform="translate(562,182)">
            <line x1="0"   y1="-20" x2="0"  y2="8"  stroke="#1DB954" strokeWidth="1.5" />
            <line x1="-9"  y1="-4"  x2="9"  y2="-4" stroke="#1DB954" strokeWidth="1.5" />
            <line x1="-6"  y1="-11" x2="6"  y2="-11" stroke="#1DB954" strokeWidth="1" />
            <line x1="-11" y1="8"   x2="11" y2="8"  stroke="#1DB954" strokeWidth="2" />
            <path d="M-13,-18 Q-19,-10 -13,-2" fill="none" stroke="#1DB954" strokeWidth="1" opacity="0.6" />
            <path d="M13,-18 Q19,-10 13,-2"   fill="none" stroke="#1DB954" strokeWidth="1" opacity="0.6" />
          </g>

          {/* Crosshair target — MISSION DISTRICT (cx=320, cy=280) */}
          <g transform="translate(318,258)">
            <circle cx="0" cy="0" r="10" fill="none" stroke="#FF6B35" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3.5" fill="none" stroke="#FF6B35" strokeWidth="1" />
            <line x1="0"   y1="-15" x2="0"   y2="-11" stroke="#FF6B35" strokeWidth="1.5" />
            <line x1="0"   y1="11"  x2="0"   y2="15"  stroke="#FF6B35" strokeWidth="1.5" />
            <line x1="-15" y1="0"   x2="-11" y2="0"   stroke="#FF6B35" strokeWidth="1.5" />
            <line x1="11"  y1="0"   x2="15"  y2="0"   stroke="#FF6B35" strokeWidth="1.5" />
          </g>

          {/* Skull — HEIST QUARTER (cx=140, cy=340) */}
          <g transform="translate(142,315)">
            <circle cx="0" cy="-7" r="9" fill="none" stroke="#7B2FBE" strokeWidth="1.5" />
            <circle cx="-3" cy="-8" r="2" fill="#7B2FBE" />
            <circle cx="3"  cy="-8" r="2" fill="#7B2FBE" />
            <rect x="-6" y="1"   width="3.5" height="3.5" fill="#7B2FBE" rx="0.5" />
            <rect x="-1" y="1"   width="3.5" height="3.5" fill="#7B2FBE" rx="0.5" />
            <rect x="4"  y="1"   width="3.5" height="3.5" fill="#7B2FBE" rx="0.5" />
          </g>

          {/* Palm tree — VICE CITY BEACH (cx=680, cy=420) */}
          <g transform="translate(653,375)">
            <rect x="-1.5" y="-14" width="3" height="16" fill="#FF006E" rx="1" />
            <path d="M0,-14 Q-11,-23 -15,-17 Q-9,-13 0,-14" fill="#FF006E" />
            <path d="M0,-14 Q11,-23 15,-17  Q9,-13  0,-14" fill="#FF006E" />
            <path d="M0,-14 Q-3,-25 0,-27   Q3,-25  0,-14" fill="#FF006E" />
          </g>
        </g>

        {/* 5. Scanline overlay */}
        <rect
          x="0" y="0" width="900" height="560"
          fill="url(#scanlines)"
          style={{ pointerEvents: "none" }}
        />

        {/* 6. Markers */}
        {MARKERS.map((m) => {
          const isSelected = m.id === selectedId;
          const isHovered  = m.id === hoveredId;
          return (
            <g
              key={m.id}
              onClick={(e) => { e.stopPropagation(); onSelect(m.id); }}
              onMouseEnter={() => setHoveredId(m.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                cursor: "pointer",
                transform: isHovered && !isSelected ? "scale(1.15)" : "scale(1)",
                transformOrigin: `${m.cx}px ${m.cy}px`,
                transition: "transform 0.15s ease",
              }}
            >
              {/* Ping ring */}
              <circle
                cx={m.cx} cy={m.cy}
                r={isSelected ? 22 : 16}
                fill="none"
                stroke={m.color}
                strokeWidth="1"
                opacity={isSelected ? 0.5 : 0.35}
                className="ping-slow"
              />
              {/* Second ring (selected only) */}
              {isSelected && (
                <circle
                  cx={m.cx} cy={m.cy} r="32"
                  fill="none"
                  stroke={m.color}
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              )}
              {/* Inner dot */}
              <circle
                cx={m.cx} cy={m.cy}
                r={isSelected ? 9 : 7}
                fill={m.color}
                style={{
                  filter: isSelected
                    ? `drop-shadow(0 0 8px ${m.color})`
                    : `drop-shadow(0 0 4px ${m.color})`,
                }}
              />
              {/* District label */}
              <text
                x={m.cx} y={m.cy + 22}
                textAnchor="middle"
                fill={m.color}
                fontSize={isSelected ? "9.5" : "8.5"}
                fontFamily="var(--font-bebas)"
                letterSpacing="1.5"
                fontWeight={isSelected ? "bold" : "normal"}
                opacity={isSelected ? 1 : 0.8}
              >
                {m.district}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
