# GTA VI Interactive Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scrollable `/gta` page with a full-screen interactive Vice City SVG map where clicking neon blip markers opens sliding detail panels containing all resume content.

**Architecture:** Single-screen experience: `EntryAnimation` (inline in page.tsx) → map reveal. `CityMap` SVG fills the viewport below the 52px HUD. Clicking a marker sets `selectedId` in `page.tsx`; `DetailPanel` reads it to slide in the correct panel. All old scrollable section components are deleted; their content moves into 6 dedicated panel components.

**Tech Stack:** Next.js 15.5.19 App Router, React 18, Tailwind CSS 3, SVG (inline, no external libraries), CSS `transition` for panel animation, `useEffect` timeout for skill bar trigger

## Global Constraints

- All component files must have `"use client"` as the first line
- Font classes: `font-bebas` (Bebas Neue), `font-inter` (Inter) from `tailwind.config.ts`
- GTA color tokens on `:root`: `--gta-bg:#0A0A1A`, `--gta-pink:#FF006E`, `--gta-cyan:#00F5FF`, `--gta-orange:#FF6B35`, `--gta-purple:#7B2FBE`, `--gta-gold:#FFD700`, `--gta-green:#1DB954`
- Keyframes already in `globals.css`: `fadeIn`, `slideUp`, `slideInLeft`, `slideInRight`, `ping-slow`, `progressFill`
- `.ping-slow` class: `animation: ping-slow 1.8s ease-out infinite` — used on SVG circles (needs `transformBox: "fill-box"` inline style for correct SVG scaling)
- No new npm packages
- `app/gta/page.tsx` must NOT have named exports (Next.js App Router)
- Marker ids: `"about"`, `"experience"`, `"skills"`, `"projects"`, `"education"`, `"contact"`
- SVG viewBox: `"0 0 900 560"`, HUD height: `52px`

---

### Task 1: Scaffold — delete old files, create markers.ts, stubs, rewrite page.tsx

**Files:**
- Delete: `app/gta/components/LoadingScreen.tsx`, `app/gta/components/MissionLog.tsx`, `app/gta/components/Attributes.tsx`, `app/gta/components/HeistBoard.tsx`, `app/gta/components/SafeHouse.tsx`, `app/gta/components/IFruitPhone.tsx`, `app/gta/components/DistrictMap.tsx`, `app/gta/constants.ts`
- Create: `app/gta/markers.ts`
- Create stubs: `app/gta/components/CityMap.tsx`, `app/gta/components/DetailPanel.tsx`, `app/gta/components/panels/AboutPanel.tsx`, `app/gta/components/panels/ExperiencePanel.tsx`, `app/gta/components/panels/SkillsPanel.tsx`, `app/gta/components/panels/ProjectsPanel.tsx`, `app/gta/components/panels/EducationPanel.tsx`, `app/gta/components/panels/ContactPanel.tsx`
- Rewrite: `app/gta/page.tsx`, `app/gta/components/HudNavbar.tsx` (stub only — full impl in Task 2)

**Interfaces:**
- Produces: `MARKERS` constant and `MarkerId` type from `app/gta/markers.ts` — used by all later tasks

- [ ] **Step 1: Delete old component files**

```powershell
Remove-Item "app/gta/components/LoadingScreen.tsx","app/gta/components/MissionLog.tsx","app/gta/components/Attributes.tsx","app/gta/components/HeistBoard.tsx","app/gta/components/SafeHouse.tsx","app/gta/components/IFruitPhone.tsx","app/gta/components/DistrictMap.tsx","app/gta/constants.ts"
```

- [ ] **Step 2: Create `app/gta/markers.ts`**

```ts
export const MARKERS = [
  { id: "about",      district: "VICE CITY BEACH",  color: "#FF006E", cx: 680, cy: 420 },
  { id: "experience", district: "MISSION DISTRICT", color: "#FF6B35", cx: 320, cy: 280 },
  { id: "skills",     district: "SKILLS ZONE",      color: "#00F5FF", cx: 180, cy: 160 },
  { id: "projects",   district: "HEIST QUARTER",    color: "#7B2FBE", cx: 140, cy: 340 },
  { id: "education",  district: "VICE ACADEMY",     color: "#FFD700", cx: 440, cy: 130 },
  { id: "contact",    district: "IFRUIT NETWORK",   color: "#1DB954", cx: 580, cy: 210 },
] as const;

export type MarkerId = (typeof MARKERS)[number]["id"];
```

- [ ] **Step 3: Create the `panels/` directory and all stub files**

Create `app/gta/components/panels/AboutPanel.tsx`:
```tsx
"use client";
export default function AboutPanel() { return null; }
```

Create identical stubs for `ExperiencePanel.tsx`, `SkillsPanel.tsx`, `ProjectsPanel.tsx`, `EducationPanel.tsx`, `ContactPanel.tsx` — same one-liner pattern, different function names.

- [ ] **Step 4: Create stub `app/gta/components/CityMap.tsx`**

```tsx
"use client";
export default function CityMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return null;
}
```

- [ ] **Step 5: Create stub `app/gta/components/DetailPanel.tsx`**

```tsx
"use client";
export default function DetailPanel({
  selectedId,
  onClose,
}: {
  selectedId: string | null;
  onClose: () => void;
}) {
  return null;
}
```

- [ ] **Step 6: Create stub `app/gta/components/HudNavbar.tsx`**

```tsx
"use client";
export default function HudNavbar({
  selectedDistrict,
  onRadarClick,
}: {
  selectedDistrict: string | null;
  onRadarClick: () => void;
}) {
  return null;
}
```

- [ ] **Step 7: Rewrite `app/gta/page.tsx`**

```tsx
"use client";
import { useState, useEffect } from "react";
import { MARKERS } from "./markers";
import HudNavbar from "./components/HudNavbar";
import CityMap from "./components/CityMap";
import DetailPanel from "./components/DetailPanel";

function EntryAnimation({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "var(--gta-bg)" }}
    >
      <p
        className="font-bebas text-2xl tracking-[0.3em] mb-6"
        style={{ color: "var(--gta-pink)", textShadow: "0 0 20px rgba(255,0,110,0.6)" }}
      >
        LOADING VICE CITY...
      </p>
      <div
        className="w-64 h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: "var(--gta-pink)",
            boxShadow: "0 0 8px rgba(255,0,110,0.8)",
          }}
        />
      </div>
      <p className="font-inter text-white/25 text-xs tracking-widest mt-4 uppercase">
        {progress < 100 ? "Initializing..." : "Ready"}
      </p>
    </div>
  );
}

export default function GTAPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string | null) => setSelectedId(id);
  const handleClose = () => setSelectedId(null);

  const selectedDistrict =
    selectedId ? (MARKERS.find((m) => m.id === selectedId)?.district ?? null) : null;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--gta-bg)" }}
    >
      {!loaded && <EntryAnimation onComplete={() => setLoaded(true)} />}
      {loaded && (
        <div
          className="relative w-full h-full"
          style={{ animation: "fadeIn 0.5s ease-out both" }}
        >
          <HudNavbar selectedDistrict={selectedDistrict} onRadarClick={handleClose} />
          <div className="absolute inset-0" style={{ top: "52px" }}>
            <CityMap selectedId={selectedId} onSelect={handleSelect} />
          </div>
          <DetailPanel selectedId={selectedId} onClose={handleClose} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Verify build passes**

```powershell
npm run build
```

Expected: `✓ Compiled successfully` — all 3 routes build. The GTA page renders the entry animation (stubs return null, so map area will be blank after loading, which is expected at this stage).

- [ ] **Step 9: Commit**

```powershell
git add app/gta/ ; git commit -m "feat: scaffold GTA map — delete old sections, add markers.ts, stubs, rewrite page.tsx"
```

---

### Task 2: HudNavbar (simplified)

**Files:**
- Rewrite: `app/gta/components/HudNavbar.tsx`

**Interfaces:**
- Consumes: `{ selectedDistrict: string | null; onRadarClick: () => void }` (from page.tsx)

- [ ] **Step 1: Rewrite `app/gta/components/HudNavbar.tsx`**

```tsx
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
        aria-label="Close panel"
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
```

- [ ] **Step 2: Verify build**

```powershell
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Visual check**

```powershell
npm run dev
```

Open `http://localhost:3000/gta`. After the entry animation completes, the HUD bar should be visible at the top: radar icon left, `PARTH KHATRI` centered, nothing on the right (no marker selected yet). The map area below is blank (CityMap stub returns null).

- [ ] **Step 4: Commit**

```powershell
git add app/gta/components/HudNavbar.tsx ; git commit -m "feat: simplify GTA HUD navbar for map experience"
```

---

### Task 3: CityMap — SVG Vice City terrain + markers

**Files:**
- Rewrite: `app/gta/components/CityMap.tsx`
- Modify: `app/globals.css` — add `transform-box: fill-box` to `.ping-slow` for SVG compatibility

**Interfaces:**
- Consumes: `MARKERS` from `app/gta/markers.ts`
- Props: `{ selectedId: string | null; onSelect: (id: string | null) => void }`

- [ ] **Step 1: Update `.ping-slow` in `app/globals.css`**

Find the existing `.ping-slow` rule (line ~144) and add two properties:

```css
.ping-slow {
  animation: ping-slow 1.8s ease-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}
```

- [ ] **Step 2: Implement `app/gta/components/CityMap.tsx`**

```tsx
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
        <defs>
          <pattern id="scanlines" x="0" y="0" width="1" height="6" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="3" fill="rgba(0,0,0,0.04)" />
          </pattern>
        </defs>

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
```

- [ ] **Step 3: Verify build**

```powershell
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Visual check**

```powershell
npm run dev
```

Open `http://localhost:3000/gta`. After entry animation: the full Vice City map should be visible — dark city grid with roads, diagonal highway, beach strip, dark ocean on the right, 6 glowing neon markers with pulsing ping rings. Hover a marker to see it scale up. Click a marker — the map dims (opacity 0.45) and the HUD right side shows the district name. Click the map background — map returns to full opacity. (DetailPanel still returns null so no panel slides in yet.)

- [ ] **Step 5: Commit**

```powershell
git add app/gta/components/CityMap.tsx app/globals.css ; git commit -m "feat: implement Vice City SVG map with terrain and interactive markers"
```

---

### Task 4: DetailPanel — sliding container with panel routing

**Files:**
- Rewrite: `app/gta/components/DetailPanel.tsx`

**Interfaces:**
- Consumes: `MARKERS` from `app/gta/markers.ts`, 6 panel components from `panels/`
- Props: `{ selectedId: string | null; onClose: () => void }`

- [ ] **Step 1: Implement `app/gta/components/DetailPanel.tsx`**

```tsx
"use client";
import { MARKERS } from "../markers";
import AboutPanel      from "./panels/AboutPanel";
import ExperiencePanel from "./panels/ExperiencePanel";
import SkillsPanel     from "./panels/SkillsPanel";
import ProjectsPanel   from "./panels/ProjectsPanel";
import EducationPanel  from "./panels/EducationPanel";
import ContactPanel    from "./panels/ContactPanel";

const PANEL_TITLES: Record<string, string> = {
  about:      "ABOUT",
  experience: "MISSION LOG",
  skills:     "ATTRIBUTES",
  projects:   "ACTIVE HEISTS",
  education:  "PROPERTIES",
  contact:    "IFRUIT NETWORK",
};

const PANEL_COMPONENTS = {
  about:      AboutPanel,
  experience: ExperiencePanel,
  skills:     SkillsPanel,
  projects:   ProjectsPanel,
  education:  EducationPanel,
  contact:    ContactPanel,
};

export default function DetailPanel({
  selectedId,
  onClose,
}: {
  selectedId: string | null;
  onClose: () => void;
}) {
  const marker = selectedId ? MARKERS.find((m) => m.id === selectedId) : null;
  const isOpen = !!selectedId && !!marker;
  const PanelContent = selectedId
    ? PANEL_COMPONENTS[selectedId as keyof typeof PANEL_COMPONENTS] ?? null
    : null;

  return (
    <>
      {/* Desktop: right sidebar */}
      <div
        className="fixed top-0 right-0 bottom-0 hidden sm:flex flex-col z-40"
        style={{
          width: "380px",
          paddingTop: "52px",
          background: "rgba(8,8,20,0.97)",
          backdropFilter: "blur(20px)",
          borderLeft: isOpen ? `2px solid ${marker?.color}` : "2px solid transparent",
          boxShadow: isOpen ? `inset 0 0 20px ${marker?.color}18` : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {marker && (
          <>
            {/* Panel header */}
            <div
              className="flex items-start justify-between px-5 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${marker.color}22` }}
            >
              <div>
                <p
                  className="font-bebas text-xs tracking-[0.25em] uppercase mb-1"
                  style={{ color: marker.color }}
                >
                  ◉ {marker.district}
                </p>
                <p className="font-bebas text-2xl tracking-wider text-white">
                  {PANEL_TITLES[selectedId!]}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white text-xl leading-none transition-colors mt-1 font-inter"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${marker.color}44 transparent` }}>
              {PanelContent && <PanelContent />}
            </div>
          </>
        )}
      </div>

      {/* Mobile: bottom sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 flex sm:hidden flex-col z-40"
        style={{
          height: "65vh",
          background: "rgba(8,8,20,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: isOpen ? `2px solid ${marker?.color}` : "2px solid transparent",
          boxShadow: isOpen ? `0 -8px 30px ${marker?.color}18` : "none",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s",
          borderRadius: "16px 16px 0 0",
        }}
      >
        {marker && (
          <>
            {/* Panel header */}
            <div
              className="flex items-start justify-between px-5 pt-4 pb-3 flex-shrink-0"
              style={{ borderBottom: `1px solid ${marker.color}22` }}
            >
              <div>
                <p
                  className="font-bebas text-xs tracking-[0.25em] uppercase mb-1"
                  style={{ color: marker.color }}
                >
                  ◉ {marker.district}
                </p>
                <p className="font-bebas text-xl tracking-wider text-white">
                  {PANEL_TITLES[selectedId!]}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white text-xl leading-none transition-colors mt-1 font-inter"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${marker.color}44 transparent` }}>
              {PanelContent && <PanelContent />}
            </div>
          </>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```powershell
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Visual check**

```powershell
npm run dev
```

Open `http://localhost:3000/gta`. Click any marker — the panel should slide in from the right (desktop) showing the district name + panel title. Content area will be empty (stubs). Click `✕` or the map background — panel slides back out. Test on mobile viewport (browser DevTools → toggle device) — panel should slide up from bottom.

- [ ] **Step 4: Commit**

```powershell
git add app/gta/components/DetailPanel.tsx ; git commit -m "feat: implement GTA detail panel with slide-in animation and mobile sheet"
```

---

### Task 5: About + Experience panels

**Files:**
- Rewrite: `app/gta/components/panels/AboutPanel.tsx`
- Rewrite: `app/gta/components/panels/ExperiencePanel.tsx`

**Interfaces:**
- No props — standalone content panels

- [ ] **Step 1: Implement `app/gta/components/panels/AboutPanel.tsx`**

```tsx
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
```

- [ ] **Step 2: Implement `app/gta/components/panels/ExperiencePanel.tsx`**

```tsx
"use client";

const BRIEFING = [
  "Built production ASP.NET Core APIs serving real customers",
  "Implemented real-time chef booking with Twilio SMS/chat",
  "Developed geo-optimized route management with Google Maps API",
  "Built Angular frontend with Kendo Grid for enterprise data views",
  "Designed MS SQL Server schemas with stored procs and triggers",
  "Implemented API encryption, JWT auth, and role-based access control",
  "Integrated Fishbowl Inventory and Excel import/export pipelines",
];

const UNLOCKED = ["C#", "Azure", "Angular", "Twilio", "SQL Server", "TypeScript"];

export default function ExperiencePanel() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
        <p className="font-bebas text-xl tracking-wide text-white leading-tight">
          SR. SOFTWARE ENGINEER
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="font-inter text-white/50 text-xs">Jan 2022 → Present</span>
          <span
            className="font-bebas text-xs px-2 py-0.5 rounded-full tracking-wider"
            style={{
              background: "rgba(255,107,53,0.15)",
              border: "1px solid rgba(255,107,53,0.35)",
              color: "var(--gta-orange)",
            }}
          >
            +4 Years XP
          </span>
        </div>
        <p className="font-inter text-white/30 text-xs mt-1">📍 Ahmedabad, Gujarat, India</p>
      </div>

      {/* Difficulty stars */}
      <div
        className="flex items-center gap-1"
        style={{ animation: "slideUp 0.5s ease-out 0.15s both" }}
      >
        <span className="font-inter text-white/30 text-[10px] uppercase tracking-wider mr-2">Difficulty</span>
        {"★★★★".split("").map((s, i) => (
          <span key={i} style={{ color: "var(--gta-orange)", fontSize: "14px" }}>{s}</span>
        ))}
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px" }}>★</span>
      </div>

      {/* Briefing */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-2">
          MISSION BRIEFING
        </p>
        <ul className="flex flex-col gap-2">
          {BRIEFING.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 font-inter text-white/70 text-xs leading-snug"
              style={{ animation: `slideUp 0.4s ease-out ${0.25 + i * 0.05}s both` }}
            >
              <span style={{ color: "var(--gta-orange)", marginTop: "1px", flexShrink: 0 }}>›</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills unlocked */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.65s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-2">
          SKILLS UNLOCKED
        </p>
        <div className="flex flex-wrap gap-2">
          {UNLOCKED.map((skill) => (
            <span
              key={skill}
              className="font-inter text-xs px-2 py-1 rounded-full font-semibold"
              style={{
                background: "rgba(255,107,53,0.12)",
                border: "1px solid rgba(255,107,53,0.35)",
                color: "var(--gta-orange)",
              }}
            >
              + {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```powershell
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Visual check**

```powershell
npm run dev
```

Click the **orange** MISSION DISTRICT marker → panel slides in → shows SR. SOFTWARE ENGINEER header, difficulty stars, 7 briefing bullets, skills unlocked tags.
Click the **pink** VICE CITY BEACH marker → panel shows name, wanted stars, 4 stat cards, tagline, location.

- [ ] **Step 5: Commit**

```powershell
git add app/gta/components/panels/AboutPanel.tsx app/gta/components/panels/ExperiencePanel.tsx ; git commit -m "feat: add about and experience detail panels"
```

---

### Task 6: Skills + Projects panels

**Files:**
- Rewrite: `app/gta/components/panels/SkillsPanel.tsx`
- Rewrite: `app/gta/components/panels/ProjectsPanel.tsx`

- [ ] **Step 1: Implement `app/gta/components/panels/SkillsPanel.tsx`**

```tsx
"use client";
import { useState, useEffect } from "react";

const LANGUAGES = [
  { name: "C#",         pct: 92, color: "#9B59B6" },
  { name: "Python",     pct: 78, color: "#3498DB" },
  { name: "JavaScript", pct: 85, color: "#F1C40F" },
  { name: "TypeScript", pct: 80, color: "#2980B9" },
  { name: "SQL",        pct: 88, color: "#E74C3C" },
  { name: "HTML & CSS", pct: 75, color: "#E67E22" },
];

const TECH_GROUPS = [
  { label: "Backend",      color: "#FF6B35", tags: ["ASP.NET Core", "REST API", "JWT Auth", "ASP.NET MVC"] },
  { label: "Frontend",     color: "#A855F7", tags: ["Angular", "TypeScript", "Kendo Grid", "HTML & CSS"] },
  { label: "Database",     color: "#22C55E", tags: ["MS SQL Server", "Stored Procs", "DB Triggers", "Query Optimization"] },
  { label: "Security",     color: "#EF4444", tags: ["API Encryption", "Role-based Access", "Symmetric Keys"] },
  { label: "Integrations", color: "#38BDF8", tags: ["Twilio", "Google Maps API", "Fishbowl Inventory", "Excel Import"] },
  { label: "Cloud & AI",   color: "#1DB954", tags: ["Azure", "Devin", "Cursor", "Claude Code"] },
];

export default function SkillsPanel() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Language bars */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-3">
          LANGUAGE STATS
        </p>
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((lang, i) => (
            <div key={lang.name}>
              <div className="flex justify-between mb-1">
                <span className="font-inter text-white/70 text-xs">{lang.name}</span>
                <span className="font-inter text-white/40 text-xs">{lang.pct}%</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: started ? `${lang.pct}%` : "0%",
                    background: lang.color,
                    boxShadow: `0 0 6px ${lang.color}88`,
                    transition: `width 0.8s ease-out ${i * 0.08}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech groups */}
      <div style={{ animation: "slideUp 0.5s ease-out 0.5s both" }}>
        <p className="font-inter text-white/35 text-[10px] tracking-[0.25em] uppercase mb-3">
          TECH STACK
        </p>
        <div className="flex flex-col gap-3">
          {TECH_GROUPS.map((group) => (
            <div key={group.label}>
              <p
                className="font-bebas text-xs tracking-wider mb-1.5"
                style={{ color: group.color }}
              >
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-inter text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: `${group.color}12`,
                      border: `1px solid ${group.color}30`,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement `app/gta/components/panels/ProjectsPanel.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify build**

```powershell
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Visual check**

```powershell
npm run dev
```

Click the **cyan** SKILLS ZONE marker → panel shows 6 language bars that animate left-to-right on open, then 6 tech groups with colored tags.
Click the **purple** HEIST QUARTER marker → panel shows 3 project cards stacked vertically, each with status badge, title, payout, and crew tags.

- [ ] **Step 5: Commit**

```powershell
git add app/gta/components/panels/SkillsPanel.tsx app/gta/components/panels/ProjectsPanel.tsx ; git commit -m "feat: add skills and projects detail panels"
```

---

### Task 7: Education + Contact panels

**Files:**
- Rewrite: `app/gta/components/panels/EducationPanel.tsx`
- Rewrite: `app/gta/components/panels/ContactPanel.tsx`

- [ ] **Step 1: Implement `app/gta/components/panels/EducationPanel.tsx`**

```tsx
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
```

- [ ] **Step 2: Implement `app/gta/components/panels/ContactPanel.tsx`**

```tsx
"use client";
import { useState, useEffect } from "react";

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const CONTACTS = [
  { icon: "📧", label: "EMAIL",    value: "parth55610@gmail.com",                         href: "mailto:parth55610@gmail.com",                       color: "#1DB954", disabled: false },
  { icon: "📞", label: "PHONE",    value: "+91 94299 13616",                              href: "tel:+919429913616",                                 color: "#00F5FF", disabled: false },
  { icon: "💼", label: "LINKEDIN", value: "parth-khatri-398216138",                       href: "https://www.linkedin.com/in/parth-khatri-398216138", color: "#0A66C2", disabled: false },
  { icon: "🐙", label: "GITHUB",   value: "Coming soon",                                  href: "#",                                                 color: "#808080", disabled: true  },
];

export default function ContactPanel() {
  const time = useClock();

  return (
    <div className="flex flex-col gap-5">
      {/* Clock */}
      <div
        className="text-center"
        style={{ animation: "fadeIn 0.5s ease-out 0.1s both" }}
      >
        <p
          className="font-bebas text-5xl tracking-widest"
          style={{ color: "var(--gta-green)", textShadow: "0 0 20px rgba(29,185,84,0.4)" }}
        >
          {time || "--:--"}
        </p>
        <p className="font-inter text-white/30 text-[10px] tracking-[0.3em] uppercase mt-1">
          LOCAL TIME
        </p>
      </div>

      {/* Contact rows */}
      <div className="flex flex-col gap-2">
        {CONTACTS.map((c, i) => (
          <a
            key={c.label}
            href={c.disabled ? undefined : c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
            style={{
              background: `${c.color}08`,
              border: `1px solid ${c.color}25`,
              opacity: c.disabled ? 0.4 : 1,
              pointerEvents: c.disabled ? "none" : "auto",
              cursor: c.disabled ? "default" : "pointer",
              animation: `slideUp 0.4s ease-out ${0.2 + i * 0.07}s both`,
            }}
          >
            <span className="text-lg flex-shrink-0">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p
                className="font-bebas text-[10px] tracking-[0.2em] mb-0.5"
                style={{ color: c.color }}
              >
                {c.label}
              </p>
              <p className="font-inter text-white/70 text-xs truncate">{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* CTA */}
      <p
        className="font-bebas text-xl tracking-wider text-center mt-2"
        style={{
          color: "var(--gta-green)",
          textShadow: "0 0 16px rgba(29,185,84,0.3)",
          animation: "slideUp 0.5s ease-out 0.55s both",
        }}
      >
        Let's build something.
      </p>
      <p
        className="font-inter text-white/20 text-[10px] text-center tracking-widest"
        style={{ animation: "fadeIn 0.5s ease-out 0.65s both" }}
      >
        © 2026 Parth Khatri
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```powershell
npm run build
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Full visual check**

```powershell
npm run dev
```

Test all 6 markers:
- **Pink** (VICE CITY BEACH) → About panel: name, stars, stats grid, tagline
- **Orange** (MISSION DISTRICT) → Experience panel: job, briefing, skills unlocked
- **Cyan** (SKILLS ZONE) → Skills panel: language bars animate on open, tech groups
- **Purple** (HEIST QUARTER) → Projects panel: 3 heist cards
- **Gold** (VICE ACADEMY) → Education panel: university card + 6 certs with alternating slide animation
- **Green** (IFRUIT NETWORK) → Contact panel: live clock, 4 contact rows, LinkedIn opens in new tab, GitHub dimmed

Also verify:
- Entry animation plays on first load (~1.5s progress bar, then map fades in)
- HUD district name updates when marker clicked
- Panel slides in/out on open/close
- Map dims when panel open, returns to full opacity when closed
- Mobile: panel slides up from bottom (use DevTools device toggle)

- [ ] **Step 5: Commit**

```powershell
git add app/gta/components/panels/EducationPanel.tsx app/gta/components/panels/ContactPanel.tsx ; git commit -m "feat: add education and contact detail panels — GTA map complete"
```
