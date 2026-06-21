# GTA VI Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GTA VI / Vice City-style scrollable resume at `/gta`, a style selector at `/`, and move the existing Wrapped resume to `/wrapped`.

**Architecture:** The GTA page is a standard vertical-scroll page (not slides) with a fixed HUD navbar and a full-screen SVG district map overlay. Each section is a self-contained component. Intersection Observer drives the active-section tracker in the navbar and map. No new npm packages are needed.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS 3, TypeScript, Google Fonts (Bebas Neue + Inter via `next/font/google`), native Intersection Observer API, CSS keyframe animations.

## Global Constraints

- Next.js 15.5.19, React 19 — no downgrade
- No new npm dependencies (no Framer Motion, no Howler.js)
- All components in `app/gta/components/` must start with `"use client"` (they use state/effects/refs)
- GTA color tokens: `--gta-bg: #0A0A1A`, `--gta-pink: #FF006E`, `--gta-cyan: #00F5FF`, `--gta-orange: #FF6B35`, `--gta-purple: #7B2FBE`, `--gta-gold: #FFD700`, `--gta-green: #1DB954`
- Font classes: `font-bebas` (Bebas Neue, headings), `font-inter` (Inter, body)
- Fixed HUD navbar height: `52px` — all section content must account for `pt-[52px]`
- LinkedIn URL: `https://www.linkedin.com/in/parth-khatri-398216138`
- GitHub: placeholder `#` for now
- Verification method: `npm run build` (TypeScript + lint) + `npm run dev` visual check

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/layout.tsx` | Modify | Add Bebas Neue + Inter font variables |
| `tailwind.config.ts` | Modify | Add `font-bebas`, `font-inter` to fontFamily |
| `app/globals.css` | Modify | Remove global `overflow:hidden`, add GTA CSS vars + keyframes |
| `app/page.tsx` | Modify | Replace with split-screen style selector |
| `app/wrapped/page.tsx` | Create | Copy of original `app/page.tsx` (unchanged) |
| `app/gta/page.tsx` | Create | GTA shell: section tracking, map open/close, layout |
| `app/gta/components/HudNavbar.tsx` | Create | Fixed top HUD: map icon, name, active area name |
| `app/gta/components/DistrictMap.tsx` | Create | Full-screen SVG map overlay, district click navigation |
| `app/gta/components/LoadingScreen.tsx` | Create | Hero: progress bar, name, palm trees, rotating tips |
| `app/gta/components/MissionLog.tsx` | Create | Experience as mission card with MISSION PASSED banner |
| `app/gta/components/Attributes.tsx` | Create | Skill bars + tech tag groups, scroll-triggered animation |
| `app/gta/components/HeistBoard.tsx` | Create | Projects as polaroid-style heist cards |
| `app/gta/components/SafeHouse.tsx` | Create | Education + certs as owned properties |
| `app/gta/components/IFruitPhone.tsx` | Create | Contact as GTA phone UI |

---

## Task 1: Foundation — Fonts, Tailwind, CSS Variables & Keyframes

**Files:**
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `font-bebas` and `font-inter` Tailwind classes usable in all subsequent tasks
- Produces: CSS custom properties `--gta-*` usable via `style={{ color: "var(--gta-pink)" }}`
- Produces: CSS keyframes `flicker`, `sway`, `slideAcross`, `progressFill`, `blink`, `neonPulse`

- [ ] **Step 1: Update `app/layout.tsx` to add Bebas Neue and Inter fonts**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parth Khatri — Dev Wrapped",
  description: "Parth Khatri's interactive developer resume",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Update `tailwind.config.ts` to add font families**

Replace the `theme.extend` block:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-circular)", "system-ui", "sans-serif"],
        bebas: ["var(--font-bebas)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "count-up": "countUp 1s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "bar-grow": "barGrow 1s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        countUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        barGrow: {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Update `app/globals.css` — remove global overflow:hidden, add GTA tokens + keyframes**

The current `html, body { overflow: hidden }` blocks GTA page scroll. The Wrapped page's root div already has `overflow-hidden h-screen` so removing it from globals is safe.

Append the following block at the **end** of `app/globals.css` (after all existing content):

```css
/* ── GTA color tokens ─────────────────────────────────────────── */
:root {
  --gta-bg:     #0A0A1A;
  --gta-pink:   #FF006E;
  --gta-cyan:   #00F5FF;
  --gta-orange: #FF6B35;
  --gta-purple: #7B2FBE;
  --gta-gold:   #FFD700;
  --gta-green:  #1DB954;
}

/* ── GTA keyframes ────────────────────────────────────────────── */

/* Subtle neon heading flicker */
@keyframes flicker {
  0%, 92%, 100% { opacity: 1; }
  93%            { opacity: 0.82; }
  94%            { opacity: 1; }
  96%            { opacity: 0.65; }
  97%            { opacity: 1; }
}

/* Palm tree sway */
@keyframes sway {
  0%, 100% { transform: rotate(-3deg); }
  50%       { transform: rotate(3deg); }
}

/* MISSION PASSED banner sweep */
@keyframes slideAcross {
  from { transform: translateX(-110%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

/* Loading progress bar fill */
@keyframes progressFill {
  from { width: 0%; }
  to   { width: 100%; }
}

/* Blinking cursor / scroll hint */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* Neon glow pulse on district hover */
@keyframes neonPulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

/* GTA utility classes */
.gta-flicker   { animation: flicker 6s ease-in-out infinite; }
.gta-sway      { animation: sway 4s ease-in-out infinite; transform-origin: bottom center; }
.gta-blink     { animation: blink 1.4s ease-in-out infinite; }
.gta-neon-pulse { animation: neonPulse 2s ease-in-out infinite; }
```

Also find and update the `html, body` block in globals.css. Change:
```css
html,
body {
  height: 100%;
  overflow: hidden;
}
```
To:
```css
html,
body {
  height: 100%;
}
```

- [ ] **Step 4: Build to verify fonts resolve**

```bash
npm run build
```

Expected: Build succeeds (or shows only pre-existing lint warnings). Confirm no `Module not found` or font errors.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx tailwind.config.ts app/globals.css
git commit -m "feat: add Bebas Neue/Inter fonts, GTA CSS tokens and keyframes"
```

---

## Task 2: Style Selector at `/` + Move Wrapped to `/wrapped`

**Files:**
- Create: `app/wrapped/page.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: Nothing from other tasks (self-contained routes)
- Produces: `/` renders selector, `/wrapped` renders existing resume unchanged

- [ ] **Step 1: Create `app/wrapped/page.tsx`**

Copy the entire current contents of `app/page.tsx` verbatim into `app/wrapped/page.tsx`. Do not change a single line. The Wrapped resume must work identically at its new route.

```bash
# In PowerShell:
Copy-Item "app/page.tsx" "app/wrapped/page.tsx" -Force
```

- [ ] **Step 2: Verify `/wrapped` works**

```bash
npm run dev
```

Navigate to `http://localhost:3000/wrapped`. The Spotify Wrapped resume should work exactly as before — all 7 slides, keyboard nav, swipe, animations.

- [ ] **Step 3: Replace `app/page.tsx` with style selector**

```tsx
"use client";
import { useRouter } from "next/navigation";

export default function StyleSelector() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col sm:flex-row">
      {/* ── Wrapped Half ── */}
      <button
        className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group border-0 p-0"
        style={{ background: "#040d06" }}
        onClick={() => router.push("/wrapped")}
        aria-label="Open Spotify Wrapped style resume"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 55%, #1DB954, transparent 65%)" }}
        />
        {/* Hover scale layer */}
        <div className="absolute inset-0 scale-100 group-hover:scale-[1.02] transition-transform duration-400" />

        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
          <span className="bg-[#1DB954] text-black text-xs font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full">
            DEV WRAPPED
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Spotify Style
          </h2>
          <p className="text-white/40 text-sm tracking-wider">The story so far.</p>
          <span className="mt-2 text-white/25 text-xs tracking-widest uppercase">
            Click to enter →
          </span>
        </div>
      </button>

      {/* ── Divider ── */}
      <div className="hidden sm:flex items-center justify-center absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-20">
        <span className="absolute text-white/25 text-sm bg-black px-1">◆</span>
      </div>
      <div className="h-px bg-white/10 w-full sm:hidden flex-none" />

      {/* ── GTA Half ── */}
      <button
        className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group border-0 p-0"
        style={{ background: "#0a0412" }}
        onClick={() => router.push("/gta")}
        aria-label="Open GTA VI style resume"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle at 50% 55%, #FF006E, transparent 65%)" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
          <span
            className="font-bebas text-xs tracking-[0.3em] uppercase px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,0,110,0.15)",
              border: "1px solid rgba(255,0,110,0.45)",
              color: "var(--gta-pink)",
              letterSpacing: "0.3em",
            }}
          >
            GTA VI STYLE
          </span>
          <h2
            className="font-bebas text-4xl sm:text-5xl tracking-wider text-white leading-tight"
            style={{ textShadow: "0 0 30px rgba(255,0,110,0.4)" }}
          >
            VICE CITY STYLE
          </h2>
          <p className="font-inter text-white/40 text-sm tracking-wider">
            Welcome to Vice City.
          </p>
          <span className="mt-2 text-white/25 text-xs tracking-widest uppercase font-inter">
            Click to enter →
          </span>
        </div>
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Verify selector at `/`**

```bash
npm run dev
```

Navigate to `http://localhost:3000`. You should see a split-screen: left half dark green (Wrapped), right half dark purple (GTA). Clicking left goes to `/wrapped`, right goes to `/gta` (shows 404 for now — expected).

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: Builds successfully with no type errors.

- [ ] **Step 6: Commit**

```bash
git add app/wrapped/page.tsx app/page.tsx
git commit -m "feat: add style selector at /, move Wrapped resume to /wrapped"
```

---

## Task 3: GTA Page Shell

**Files:**
- Create: `app/gta/page.tsx`

**Interfaces:**
- Consumes: `HudNavbar`, `DistrictMap`, `LoadingScreen`, `MissionLog`, `Attributes`, `HeistBoard`, `SafeHouse`, `IFruitPhone` (all created in later tasks — stub imports are fine for now)
- Produces:
  - `activeSection: string` — current section id, passed to `HudNavbar` and `DistrictMap`
  - `mapOpen: boolean` — controls `DistrictMap` visibility
  - `navigateTo(sectionId: string): void` — smooth-scrolls to a section by id

- [ ] **Step 1: Create `app/gta/page.tsx` with section tracking and layout**

```tsx
"use client";
import { useState, useEffect } from "react";
import HudNavbar from "./components/HudNavbar";
import DistrictMap from "./components/DistrictMap";
import LoadingScreen from "./components/LoadingScreen";
import MissionLog from "./components/MissionLog";
import Attributes from "./components/Attributes";
import HeistBoard from "./components/HeistBoard";
import SafeHouse from "./components/SafeHouse";
import IFruitPhone from "./components/IFruitPhone";

export const SECTIONS = [
  { id: "hero",         area: "VICE CITY LOADING..." },
  { id: "mission-log",  area: "MISSION DISTRICT" },
  { id: "attributes",   area: "SKILLS ZONE" },
  { id: "heist-board",  area: "HEIST QUARTER" },
  { id: "safe-house",   area: "VICE ACADEMY" },
  { id: "ifruit-phone", area: "IFRUIT NETWORK" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export default function GTAPage() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-52px 0px 0px 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") setMapOpen((v) => !v);
      if (e.key === "Escape") setMapOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navigateTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMapOpen(false);
  };

  return (
    <div className="relative" style={{ background: "var(--gta-bg)", fontFamily: "var(--font-inter)" }}>
      <HudNavbar
        activeSection={activeSection}
        sections={SECTIONS}
        onMapOpen={() => setMapOpen(true)}
      />
      <DistrictMap
        isOpen={mapOpen}
        activeSection={activeSection}
        sections={SECTIONS}
        onClose={() => setMapOpen(false)}
        onNavigate={navigateTo}
      />
      <section id="hero">
        <LoadingScreen />
      </section>
      <section id="mission-log">
        <MissionLog />
      </section>
      <section id="attributes">
        <Attributes />
      </section>
      <section id="heist-board">
        <HeistBoard />
      </section>
      <section id="safe-house">
        <SafeHouse />
      </section>
      <section id="ifruit-phone">
        <IFruitPhone />
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Create stub files for all 8 components so the import resolves**

Create each of these files with a minimal stub. Replace content fully in later tasks.

`app/gta/components/HudNavbar.tsx`:
```tsx
"use client";
export default function HudNavbar(_props: {
  activeSection: string;
  sections: readonly { id: string; area: string }[];
  onMapOpen: () => void;
}) {
  return <div className="fixed top-0 left-0 right-0 h-[52px] z-50 bg-black/80 border-b border-pink-600/40" />;
}
```

`app/gta/components/DistrictMap.tsx`:
```tsx
"use client";
export default function DistrictMap(_props: {
  isOpen: boolean;
  activeSection: string;
  sections: readonly { id: string; area: string }[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  return null;
}
```

`app/gta/components/LoadingScreen.tsx`:
```tsx
"use client";
export default function LoadingScreen() {
  return <div className="h-screen flex items-center justify-center text-white font-bebas text-4xl">LOADING SCREEN</div>;
}
```

`app/gta/components/MissionLog.tsx`:
```tsx
"use client";
export default function MissionLog() {
  return <div className="min-h-screen flex items-center justify-center text-white font-bebas text-4xl">MISSION LOG</div>;
}
```

`app/gta/components/Attributes.tsx`:
```tsx
"use client";
export default function Attributes() {
  return <div className="min-h-screen flex items-center justify-center text-white font-bebas text-4xl">ATTRIBUTES</div>;
}
```

`app/gta/components/HeistBoard.tsx`:
```tsx
"use client";
export default function HeistBoard() {
  return <div className="min-h-screen flex items-center justify-center text-white font-bebas text-4xl">HEIST BOARD</div>;
}
```

`app/gta/components/SafeHouse.tsx`:
```tsx
"use client";
export default function SafeHouse() {
  return <div className="min-h-screen flex items-center justify-center text-white font-bebas text-4xl">SAFE HOUSE</div>;
}
```

`app/gta/components/IFruitPhone.tsx`:
```tsx
"use client";
export default function IFruitPhone() {
  return <div className="min-h-screen flex items-center justify-center text-white font-bebas text-4xl">IFRUIT PHONE</div>;
}
```

- [ ] **Step 3: Build to confirm all imports resolve**

```bash
npm run build
```

Expected: Build succeeds. Navigate to `http://localhost:3000/gta` after `npm run dev` — should see stacked placeholder sections.

- [ ] **Step 4: Commit**

```bash
git add app/gta/
git commit -m "feat: scaffold GTA page shell with section tracking and component stubs"
```

---

## Task 4: HUD Navbar

**Files:**
- Modify: `app/gta/components/HudNavbar.tsx`

**Interfaces:**
- Consumes: `activeSection: string`, `sections: readonly {id,area}[]`, `onMapOpen: () => void`
- Produces: Fixed 52px navbar rendered at `z-50`, displays active area name, map icon triggers `onMapOpen`

- [ ] **Step 1: Replace `app/gta/components/HudNavbar.tsx` with full implementation**

```tsx
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
```

- [ ] **Step 2: Verify HUD navbar in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/gta`. Should see a blurred dark navbar at top with pink left border glow, radar icon left, "PARTH KHATRI" center, area name right. Area name changes as you scroll through placeholder sections.

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/gta/components/HudNavbar.tsx
git commit -m "feat: add GTA HUD navbar with radar icon and active area tracker"
```

---

## Task 5: District Map Overlay

**Files:**
- Modify: `app/gta/components/DistrictMap.tsx`

**Interfaces:**
- Consumes: `isOpen: boolean`, `activeSection: string`, `sections: readonly {id,area}[]`, `onClose: () => void`, `onNavigate: (id: string) => void`
- Produces: Full-screen overlay with SVG district map; clicking a district calls `onNavigate(sectionId)`

- [ ] **Step 1: Replace `app/gta/components/DistrictMap.tsx` with full implementation**

```tsx
"use client";

interface Props {
  isOpen: boolean;
  activeSection: string;
  sections: readonly { id: string; area: string }[];
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
```

- [ ] **Step 2: Verify district map in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/gta`. Press `M`. Full-screen dark overlay appears with Vice City SVG map. Clicking a district should smooth-scroll to that stub section and close the overlay. On mobile (viewport <640px), a list appears instead of the SVG.

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/gta/components/DistrictMap.tsx
git commit -m "feat: add GTA district map overlay with SVG districts and M-key toggle"
```

---

## Task 6: Loading Screen

**Files:**
- Modify: `app/gta/components/LoadingScreen.tsx`

**Interfaces:**
- Consumes: Nothing (self-contained, all data hardcoded)
- Produces: Full-viewport-height hero section with id usable by Intersection Observer in parent

- [ ] **Step 1: Replace `app/gta/components/LoadingScreen.tsx` with full implementation**

```tsx
"use client";
import { useState, useEffect } from "react";

const TIPS = [
  "Tip: This developer never misses a deadline",
  "Tip: Hire before competitors do",
  "Tip: 4+ years of production software shipped",
  "Tip: Azure certified. Three times.",
  "Tip: Builds things that actually work in prod",
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  // Progress bar: fills over ~2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 200);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Tip rotation — only after load
  useEffect(() => {
    if (!loaded) return;
    const cycle = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((i) => (i + 1) % TIPS.length);
        setTipVisible(true);
      }, 450);
    }, 3500);
    return () => clearInterval(cycle);
  }, [loaded]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "var(--gta-bg)" }}
    >
      {/* Sunset gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,0,110,0.22) 0%, rgba(255,107,53,0.12) 25%, rgba(123,47,190,0.07) 55%, transparent 100%)",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)",
        }}
      />

      {/* Noise overlay (reuse existing .noise class) */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Palm trees */}
      <PalmTree
        style={{ position: "absolute", bottom: 0, left: "2rem", opacity: 0.28 }}
      />
      <PalmTree
        style={{
          position: "absolute",
          bottom: 0,
          right: "3rem",
          opacity: 0.18,
          transform: "scaleX(-1) scale(0.85)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5 w-full max-w-2xl">
        {/* Name */}
        <h1
          className="font-bebas leading-none tracking-wider text-6xl sm:text-8xl md:text-[110px]"
          style={{
            color: "var(--gta-pink)",
            textShadow: "0 0 18px rgba(255,0,110,0.8), 0 0 40px rgba(255,0,110,0.4)",
            animation: loaded ? "flicker 6s ease-in-out 2s infinite" : "none",
          }}
        >
          PARTH KHATRI
        </h1>

        {/* Title */}
        <p
          className="font-inter text-white/55 text-sm sm:text-base tracking-[0.45em] uppercase"
        >
          Sr. Software Engineer
        </p>

        {/* Wanted stars */}
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="text-xl sm:text-2xl"
              style={{ color: "var(--gta-pink)", textShadow: "0 0 8px rgba(255,0,110,0.7)" }}
            >
              ★
            </span>
          ))}
          <span className="text-xl sm:text-2xl text-white/15">★</span>
        </div>

        {/* Progress bar */}
        {!loaded && (
          <div className="w-full max-w-sm mt-2">
            <p
              className="font-inter text-white/35 text-xs tracking-[0.25em] uppercase mb-2"
            >
              INITIALIZING PARTH KHATRI...
            </p>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--gta-pink), var(--gta-orange))",
                  boxShadow: "0 0 10px rgba(255,0,110,0.7)",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
          </div>
        )}

        {/* Scroll hint */}
        {loaded && (
          <p
            className="font-inter text-white/30 text-xs tracking-[0.3em] uppercase gta-blink"
            style={{ animation: "blink 1.4s ease-in-out infinite" }}
          >
            ↓ SCROLL TO EXPLORE
          </p>
        )}
      </div>

      {/* Rotating tips — bottom left */}
      {loaded && (
        <div
          className="absolute bottom-8 left-5 sm:left-8 max-w-[240px] sm:max-w-xs"
          style={{
            opacity: tipVisible ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
        >
          <p className="font-inter text-white/35 text-xs leading-relaxed">
            {TIPS[tipIndex]}
          </p>
        </div>
      )}
    </div>
  );
}

function PalmTree({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="70"
      height="190"
      viewBox="0 0 70 190"
      fill="none"
      className="gta-sway"
      style={style}
    >
      {/* Trunk */}
      <path
        d="M34 190 Q32 145 36 95 Q40 48 38 18"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Fronds */}
      <path d="M38 18 Q18 8  0 28"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 18 Q56 4 70 18"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 18 Q28 -4 14 2"  stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 18 Q52 -4 62 6"  stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 18 Q38 2 26 -8"  stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
```

- [ ] **Step 2: Verify loading screen in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/gta`. Should see: dark navy background with pink/orange sunset glow at bottom, two pale palm trees swaying, "PARTH KHATRI" in giant pink glowing Bebas Neue font, 4 filled stars + 1 empty, animated progress bar filling over ~2.5s, then tips rotating bottom-left and "SCROLL TO EXPLORE" blinking.

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/gta/components/LoadingScreen.tsx
git commit -m "feat: add GTA loading screen with progress bar, palm trees, and tip rotation"
```

---

## Task 7: Mission Log

**Files:**
- Modify: `app/gta/components/MissionLog.tsx`

**Interfaces:**
- Consumes: Nothing (hardcoded data)
- Produces: Full-height section; `MISSION PASSED` banner triggers on scroll via Intersection Observer

- [ ] **Step 1: Replace `app/gta/components/MissionLog.tsx` with full implementation**

```tsx
"use client";
import { useState, useEffect, useRef } from "react";

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

export default function MissionLog() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setBannerVisible(true);
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-4"
      style={{
        background: "linear-gradient(160deg, #0d0d1a 0%, #111118 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,107,53,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        {/* Section header */}
        <div className="mb-8 text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p
            className="font-inter text-xs tracking-[0.35em] uppercase mb-2"
            style={{ color: "var(--gta-orange)" }}
          >
            MISSION DISTRICT
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(255,107,53,0.5)" }}
          >
            MISSION LOG
          </h2>
        </div>

        {/* Mission card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,107,53,0.05)",
            border: "1px solid rgba(255,107,53,0.3)",
            boxShadow: "0 0 30px rgba(255,107,53,0.08)",
            animation: "slideUp 0.6s ease-out 0.2s both",
          }}
        >
          {/* MISSION PASSED banner */}
          {bannerVisible && (
            <div
              className="absolute top-0 left-0 right-0 flex items-center justify-center gap-3 py-2 z-20"
              style={{
                background: "linear-gradient(90deg, #16a34a, #15803d)",
                animation: "slideAcross 0.6s cubic-bezier(0.22,1,0.36,1) 0.5s both",
              }}
            >
              <span className="text-white font-black text-sm tracking-widest uppercase font-inter">
                ✅ MISSION PASSED!
              </span>
            </div>
          )}

          {/* Card header */}
          <div className="px-5 sm:px-6 pt-12 pb-4 border-b border-white/10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-tight">
                  SR. SOFTWARE ENGINEER
                </p>
                <p className="font-inter text-white/50 text-sm mt-0.5">Denali Software Solution</p>
              </div>
              {/* Difficulty */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="font-inter text-white/30 text-[10px] uppercase tracking-wider">Difficulty</p>
                <div className="flex gap-0.5">
                  {"★★★★".split("").map((s, i) => (
                    <span key={i} style={{ color: "var(--gta-orange)", fontSize: "14px" }}>{s}</span>
                  ))}
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "14px" }}>★</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              <InfoRow label="DURATION" value="Jan 2022 → Present" />
              <InfoRow label="LOCATION" value="Ahmedabad, Gujarat, India" />
              <InfoRow label="XP GAINED" value="+4 Years" color="var(--gta-orange)" />
            </div>
          </div>

          {/* Briefing */}
          <div className="px-5 sm:px-6 py-4 border-b border-white/10">
            <p
              className="font-inter text-white/40 text-[10px] tracking-[0.25em] uppercase mb-3"
            >
              MISSION BRIEFING
            </p>
            <ul className="flex flex-col gap-2">
              {BRIEFING.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-inter text-white/70 text-sm leading-snug"
                  style={{ animation: `slideUp 0.4s ease-out ${0.4 + i * 0.06}s both` }}
                >
                  <span style={{ color: "var(--gta-orange)", marginTop: "2px", flexShrink: 0 }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills unlocked */}
          <div className="px-5 sm:px-6 py-4">
            <p className="font-inter text-white/40 text-[10px] tracking-[0.25em] uppercase mb-3">
              SKILLS UNLOCKED
            </p>
            <div className="flex flex-wrap gap-2">
              {UNLOCKED.map((skill) => (
                <span
                  key={skill}
                  className="font-inter text-xs px-3 py-1 rounded-full font-semibold"
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
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="font-inter text-white/30 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="font-inter text-sm font-semibold mt-0.5" style={{ color: color ?? "rgba(255,255,255,0.8)" }}>
        {value}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify Mission Log in browser**

```bash
npm run dev
```

Scroll to the Mission Log section at `/gta`. The MISSION PASSED green banner should sweep from left when the card enters the viewport. Briefing items stagger in.

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/gta/components/MissionLog.tsx
git commit -m "feat: add GTA mission log section with MISSION PASSED scroll animation"
```

---

## Task 8: Attributes (Skills)

**Files:**
- Modify: `app/gta/components/Attributes.tsx`

**Interfaces:**
- Consumes: Nothing (hardcoded data)
- Produces: Skill bars animate on scroll; tech tags grouped by category

- [ ] **Step 1: Replace `app/gta/components/Attributes.tsx` with full implementation**

```tsx
"use client";
import { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { name: "C#",         pct: 92, color: "#9B59B6" },
  { name: "Python",     pct: 78, color: "#3498DB" },
  { name: "JavaScript", pct: 85, color: "#F1C40F" },
  { name: "TypeScript", pct: 80, color: "#2980B9" },
  { name: "SQL",        pct: 88, color: "#E74C3C" },
  { name: "HTML & CSS", pct: 75, color: "#E67E22" },
];

const TECH_GROUPS = [
  { category: "Backend",      color: "#FF6B35", skills: ["ASP.NET Core", "REST API", "JWT Auth", "ASP.NET MVC", "ITextSharp"] },
  { category: "Frontend",     color: "#A855F7", skills: ["Angular", "TypeScript", "Kendo Grid", "HTML & CSS", "SEO"] },
  { category: "Database",     color: "#22C55E", skills: ["MS SQL Server", "Stored Procs", "DB Triggers", "Symmetric Keys", "Query Optimization"] },
  { category: "Security",     color: "#EF4444", skills: ["API Encryption", "Role-based Access", "Certificate Auth", "Secure DB Fields"] },
  { category: "Integrations", color: "#38BDF8", skills: ["Twilio", "Google Maps API", "Excel Import", "Fishbowl Inventory"] },
  { category: "Cloud & AI",   color: "#1DB954", skills: ["Azure", "Devin", "Cursor", "Claude Code"] },
];

export default function Attributes() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #08091a 0%, #0d0d20 100%)" }}
    >
      {/* Hex grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,245,255,0.4) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p className="font-inter text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gta-cyan)" }}>
            SKILLS ZONE
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(0,245,255,0.4)" }}
          >
            ATTRIBUTES
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
          {/* Languages */}
          <div>
            <p
              className="font-bebas text-xl tracking-widest mb-4"
              style={{ color: "var(--gta-cyan)", letterSpacing: "0.2em" }}
            >
              LANGUAGES
            </p>
            <div className="flex flex-col gap-3.5">
              {LANGUAGES.map((lang, i) => (
                <div
                  key={lang.name}
                  className="flex items-center gap-3"
                  style={{ animation: `slideUp 0.5s ease-out ${0.2 + i * 0.08}s both` }}
                >
                  <span className="font-inter text-white/80 text-sm w-24 shrink-0">{lang.name}</span>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: "10px", background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: started ? `${lang.pct}%` : "0%",
                        background: lang.color,
                        boxShadow: started ? `0 0 8px ${lang.color}88` : "none",
                        transition: `width 1s ease-out ${0.3 + i * 0.1}s, box-shadow 1s ease-out ${0.3 + i * 0.1}s`,
                      }}
                    />
                  </div>
                  <span className="font-inter text-white/35 text-xs w-8 text-right">{lang.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <p
              className="font-bebas text-xl tracking-widest mb-4"
              style={{ color: "var(--gta-cyan)", letterSpacing: "0.2em" }}
            >
              TECH STACK
            </p>
            <div className="flex flex-col gap-3">
              {TECH_GROUPS.map((group, i) => (
                <div
                  key={group.category}
                  className="rounded-xl p-3"
                  style={{
                    background: `${group.color}0d`,
                    border: `1px solid ${group.color}28`,
                    animation: `slideUp 0.5s ease-out ${0.25 + i * 0.07}s both`,
                  }}
                >
                  <p
                    className="font-bebas text-xs tracking-widest mb-1.5"
                    style={{ color: group.color }}
                  >
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="font-inter text-white/65 text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to Attributes section. Skill bars should animate from 0% to their target widths with a colored glow. Tech stack groups stagger in.

- [ ] **Step 3: Build check + commit**

```bash
npm run build
git add app/gta/components/Attributes.tsx
git commit -m "feat: add GTA attributes section with scroll-triggered skill bars"
```

---

## Task 9: Heist Board (Projects)

**Files:**
- Modify: `app/gta/components/HeistBoard.tsx`

**Interfaces:**
- Consumes: Nothing (hardcoded data)
- Produces: 3 polaroid-style heist cards with hover lift + glow

- [ ] **Step 1: Replace `app/gta/components/HeistBoard.tsx` with full implementation**

```tsx
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
                transform: `rotate(${h.rotate})`,
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
```

- [ ] **Step 2: Verify in browser**

Scroll to Heist Board. 3 polaroid cards appear with slight rotations. Hover lifts and un-rotates each card with a glow. On mobile, stacks to single column.

- [ ] **Step 3: Build check + commit**

```bash
npm run build
git add app/gta/components/HeistBoard.tsx
git commit -m "feat: add GTA heist board with polaroid-style project cards"
```

---

## Task 10: Safe House (Education & Certifications)

**Files:**
- Modify: `app/gta/components/SafeHouse.tsx`

**Interfaces:**
- Consumes: Nothing (hardcoded data)
- Produces: Education card + 6 cert upgrade cards, Azure tier highlighted in gold

- [ ] **Step 1: Replace `app/gta/components/SafeHouse.tsx` with full implementation**

```tsx
"use client";

const CERTS = [
  { name: "DevOps Engineer Expert (AZ-400)", year: "2024", icon: "🚀", tier: "azure" },
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
```

- [ ] **Step 2: Verify in browser**

Scroll to Safe House. Education card appears with gold glow, 9.56 CGPA prominent. Azure certs have gold borders and pulsing dots. Python certs are dimmer.

- [ ] **Step 3: Build check + commit**

```bash
npm run build
git add app/gta/components/SafeHouse.tsx
git commit -m "feat: add GTA safe house section with education and cert property cards"
```

---

## Task 11: iFruit Phone (Contact)

**Files:**
- Modify: `app/gta/components/IFruitPhone.tsx`

**Interfaces:**
- Consumes: Nothing (hardcoded contact data)
- Produces: GTA phone frame UI; all links are clickable `<a>` tags

- [ ] **Step 1: Replace `app/gta/components/IFruitPhone.tsx` with full implementation**

```tsx
"use client";
import { useState, useEffect } from "react";

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const CONTACTS = [
  {
    icon: "📧",
    label: "EMAIL",
    value: "parth55610@gmail.com",
    href: "mailto:parth55610@gmail.com",
    color: "#FF006E",
  },
  {
    icon: "📞",
    label: "PHONE",
    value: "+91 94299 13616",
    href: "tel:+919429913616",
    color: "#00F5FF",
  },
  {
    icon: "💼",
    label: "LINKEDIN",
    value: "parth-khatri-398216138",
    href: "https://www.linkedin.com/in/parth-khatri-398216138",
    color: "#0A66C2",
  },
  {
    icon: "🐙",
    label: "GITHUB",
    value: "Coming soon",
    href: "#",
    color: "rgba(255,255,255,0.3)",
  },
];

export default function IFruitPhone() {
  const time = useClock();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050508 0%, #080810 100%)" }}
    >
      {/* Neon grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,245,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Header */}
        <div className="text-center" style={{ animation: "slideUp 0.6s ease-out 0.1s both" }}>
          <p className="font-inter text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "var(--gta-green)" }}>
            IFRUIT NETWORK
          </p>
          <h2
            className="font-bebas text-5xl sm:text-6xl tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(29,185,84,0.4)" }}
          >
            iFRUIT
          </h2>
        </div>

        {/* Phone frame */}
        <div
          className="w-[260px] sm:w-[280px] rounded-[36px] overflow-hidden flex flex-col"
          style={{
            background: "#111118",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(29,185,84,0.12)",
            animation: "slideUp 0.7s ease-out 0.25s both",
          }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-5 pt-4 pb-2"
            style={{ background: "#0d0d14" }}
          >
            <span className="font-inter text-white/60 text-[11px] font-semibold">{time}</span>
            <div className="flex items-center gap-1 opacity-50">
              <span className="text-white text-[10px]">●●●</span>
            </div>
          </div>

          {/* App header */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: "#0d0d14", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-lg">📱</span>
            <span className="font-bebas text-white tracking-widest text-base">CONTACTS</span>
          </div>

          {/* Contact list */}
          <div className="flex flex-col px-3 py-3 gap-1" style={{ background: "#111118" }}>
            {CONTACTS.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                  animation: `slideUp 0.5s ease-out ${0.4 + i * 0.07}s both`,
                  opacity: c.href === "#" ? 0.45 : 1,
                  pointerEvents: c.href === "#" ? "none" : "auto",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${c.color}18`, border: `1px solid ${c.color}30` }}
                >
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-inter text-white/35 text-[9px] uppercase tracking-widest">{c.label}</p>
                  <p
                    className="font-inter text-sm font-medium truncate mt-0.5"
                    style={{ color: c.href === "#" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)" }}
                  >
                    {c.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Home bar */}
          <div className="flex justify-center pb-3 pt-2" style={{ background: "#111118" }}>
            <div className="w-20 h-1 rounded-full bg-white/20" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center" style={{ animation: "fadeIn 0.6s ease-out 0.8s both" }}>
          <p
            className="font-bebas text-3xl sm:text-4xl text-white tracking-wider"
            style={{ textShadow: "0 0 16px rgba(29,185,84,0.4)" }}
          >
            Let&apos;s build something.
          </p>
          <p className="font-inter text-white/25 text-xs mt-2 tracking-wider">
            📍 Ahmedabad, Gujarat, India
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-5 font-inter text-white/15 text-xs tracking-wider">
        © 2026 Parth Khatri
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll to bottom. Phone frame appears centered with live clock in status bar. Email, phone, and LinkedIn contacts are tappable. GitHub shows as dimmed/disabled. "Let's build something." CTA below.

- [ ] **Step 3: Final full-page scroll test**

Navigate to `http://localhost:3000/gta` and scroll through all 6 sections end to end:
1. Loading screen progress bar fills, tips rotate, palm trees sway
2. HUD area name updates correctly as each section enters view
3. Mission Log shows MISSION PASSED banner on scroll enter
4. Attributes: skill bars fill with color+glow
5. Heist Board: polaroid cards hover correctly
6. Safe House: Azure certs glow gold
7. iFruit Phone: all contact links open correctly
8. Press M at any point — district map opens, click a district, scroll jumps there, map closes

Also test `http://localhost:3000` → selector works, both halves clickable.
Also test `http://localhost:3000/wrapped` → original resume unaffected.

- [ ] **Step 4: Final build + lint**

```bash
npm run build && npm run lint
```

Expected: Build succeeds, no type errors, no lint errors.

- [ ] **Step 5: Final commit**

```bash
git add app/gta/components/IFruitPhone.tsx
git commit -m "feat: add GTA iFruit phone contact section with live clock and social links"
```

---

## Self-Review Checklist (done)

**Spec coverage:**
- ✅ Style selector `/` — Task 2
- ✅ Move Wrapped to `/wrapped` — Task 2
- ✅ GTA page shell + scroll tracking — Task 3
- ✅ HUD navbar with area name — Task 4
- ✅ District map overlay with SVG, M key, click navigation — Task 5
- ✅ Loading screen: progress bar, tips, palm trees, wanted stars — Task 6
- ✅ Mission Log: mission card, MISSION PASSED banner — Task 7
- ✅ Attributes: language bars + tech stack groups — Task 8
- ✅ Heist Board: 3 polaroid cards with hover — Task 9
- ✅ Safe House: education + 6 certs — Task 10
- ✅ iFruit Phone: live clock, email, phone, LinkedIn, GitHub stub — Task 11
- ✅ Bebas Neue font — Task 1
- ✅ GTA CSS tokens + keyframes — Task 1
- ✅ Fix global overflow:hidden for scroll — Task 1

**Out-of-scope confirmed not in plan:** sounds, rain, easter eggs, cursor, OG image.

**Type consistency:** All component prop interfaces defined in each task, match how `page.tsx` calls them in Task 3.
