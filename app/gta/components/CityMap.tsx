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
