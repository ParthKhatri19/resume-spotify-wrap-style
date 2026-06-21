# GTA VI Interactive Map — Design Spec
**Date:** 2026-06-21
**Author:** Parth Khatri
**Status:** Approved for implementation

---

## Overview

Replace the current scrollable `/gta` page (6 stacked sections + district map overlay) with a **single-screen interactive map experience**. The map IS the resume. Visitors land on a full-screen Vice City-style overhead map, click neon blip markers to open sliding detail panels, and read all resume content without ever leaving the map.

This replaces the old architecture entirely. The style selector at `/` and the `/wrapped` page are unchanged.

---

## Routes (unchanged)

| Route | Description |
|---|---|
| `/` | Style selector — unchanged |
| `/wrapped` | Spotify Wrapped resume — unchanged |
| `/gta` | **Rewritten:** Interactive map experience |

---

## File Structure

### New files
```
app/gta/
  page.tsx                        ← rewritten: map shell, panel state
  components/
    CityMap.tsx                   ← full SVG Vice City map + 6 markers
    DetailPanel.tsx               ← sliding panel container (layout only)
    HudNavbar.tsx                 ← simplified: no activeSection tracking
    panels/
      AboutPanel.tsx              ← name, title, wanted stars, tagline
      ExperiencePanel.tsx         ← job title, duration, briefing bullets, skills unlocked
      SkillsPanel.tsx             ← language bars + tech stack tag groups
      ProjectsPanel.tsx           ← 3 project cards (heist style)
      EducationPanel.tsx          ← education card + 6 cert rows
      ContactPanel.tsx            ← email, phone, LinkedIn, GitHub links
```

### Deleted files (old scrollable architecture)
```
app/gta/components/LoadingScreen.tsx
app/gta/components/MissionLog.tsx
app/gta/components/Attributes.tsx
app/gta/components/HeistBoard.tsx
app/gta/components/SafeHouse.tsx
app/gta/components/IFruitPhone.tsx
app/gta/components/DistrictMap.tsx
```

`app/gta/constants.ts` — SECTIONS constant removed (no longer needed); file deleted.

---

## Color Palette (unchanged from existing GTA tokens)

All colors reference existing CSS custom properties defined in `globals.css`:

| Token | Value |
|---|---|
| `--gta-bg` | `#0A0A1A` |
| `--gta-pink` | `#FF006E` |
| `--gta-cyan` | `#00F5FF` |
| `--gta-orange` | `#FF6B35` |
| `--gta-purple` | `#7B2FBE` |
| `--gta-gold` | `#FFD700` |
| `--gta-green` | `#1DB954` |

---

## Typography (unchanged)

- `font-bebas` — district names, panel headers, map labels
- `font-inter` — body text, bullet points, contact info

---

## Entry Animation

On first load of `/gta`, a brief entry sequence plays before the map is shown:

1. Full-screen dark overlay with a progress bar
2. Label: `LOADING VICE CITY...` in Bebas Neue
3. Bar fills left-to-right over ~1.5s (CSS `@keyframes progressFill` — already in globals.css)
4. On complete: overlay fades out, map fades in (`fadeIn` keyframe — already in globals.css)
5. State: `loaded` boolean in `page.tsx`

No tip rotation, no palm trees, no wanted stars in the entry — keep it fast.

---

## HUD Navbar (simplified)

Fixed 52px bar at top. Same visual style (blur + pink border).

```
[ ◎ ]   PARTH KHATRI   [ SELECTED DISTRICT NAME ]
```

- **Left:** Radar icon (same SVG as before) — clicking it closes the open panel (if any)
- **Center:** `PARTH KHATRI` in Bebas Neue
- **Right:** Name of currently selected marker's district, in `--gta-pink`. Empty string when no marker selected.

Props: `{ selectedDistrict: string | null, onRadarClick: () => void }`

---

## City Map (CityMap.tsx)

### SVG Canvas
- `viewBox="0 0 900 560"` — wide landscape format
- `width="100%" height="100%"` — fills the screen below the 52px HUD
- Background rect: `#080814`

### Terrain Layers (bottom to top)

1. **Ocean** — right 35% of canvas, dark teal polygon: `fill="#050f1a"`, subtle horizontal wave lines (`rgba(0,245,255,0.06)`)
2. **Beach strip** — thin diagonal strip between city and ocean: `fill="rgba(180,140,80,0.15)"`
3. **City base** — left 65%: `fill="#0a0a18"`
4. **City blocks** — ~25 dark rectangles scattered in grid pattern: `fill="rgba(255,255,255,0.03)"`, `stroke="rgba(255,255,255,0.06)"`, strokeWidth 0.5
5. **Roads** — thin polylines forming a loose grid + one diagonal highway: `stroke="rgba(255,255,255,0.1)"`, strokeWidth 1. Highway: strokeWidth 2, `rgba(255,255,255,0.18)`
6. **Scanline overlay** — full-canvas rect with `repeating-linear-gradient` at opacity 0.03
7. **6 Markers** — rendered on top of everything

### Markers

Each marker is an SVG `<g>` element positioned at fixed `(cx, cy)` coordinates:

| Marker id | District | Color | cx | cy |
|---|---|---|---|---|
| `about` | VICE CITY BEACH | `#FF006E` | 680 | 420 |
| `experience` | MISSION DISTRICT | `#FF6B35` | 320 | 280 |
| `skills` | SKILLS ZONE | `#00F5FF` | 180 | 160 |
| `projects` | HEIST QUARTER | `#7B2FBE` | 140 | 340 |
| `education` | VICE ACADEMY | `#FFD700` | 440 | 130 |
| `contact` | IFRUIT NETWORK | `#1DB954` | 600 | 200 |

Each marker `<g>` contains:
- **Ping ring:** `<circle>` r=16, same color, opacity 0.35, `animation: ping-slow 1.8s ease-out infinite` (already in globals.css)
- **Inner dot:** `<circle>` r=7, solid fill, color
- **Label:** `<text>` district name, Bebas Neue, 10px, color, centered below dot at `cy+18`
- **Selected state:** ping ring r=20, inner dot r=9, label font-weight bold, drop-shadow filter `drop-shadow(0 0 8px color)`
- **Hover state:** handled via `onMouseEnter`/`onMouseLeave` in React, sets `hoveredId` state, applies `transform="scale(1.2)"` on the `<g>` with `transform-origin` at `cx cy`

Props: `{ selectedId: string | null, onSelect: (id: string) => void }`

### Map Dim on Panel Open
When a panel is open, the `<svg>` gets `style={{ opacity: 0.45, transition: "opacity 0.3s" }}`. Clicking the SVG background (not a marker) while a panel is open fires `onSelect(null)` to close it.

---

## Detail Panel (DetailPanel.tsx)

### Layout
- **Desktop (sm+):** Fixed right sidebar, `top: 52px`, `right: 0`, `bottom: 0`, `width: 380px`
- **Mobile:** Fixed bottom sheet, `left: 0`, `right: 0`, `bottom: 0`, `height: 65vh`
- Background: `rgba(8,8,20,0.97)` + `backdrop-filter: blur(20px)`
- Left border (desktop): `2px solid {markerColor}` with glow
- Top border (mobile): `2px solid {markerColor}` with glow
- Entry: desktop slides in from right (`transform: translateX(100%)` → `translateX(0)`), mobile slides up from bottom (`translateY(100%)` → `translateY(0)`), both use CSS `transition: transform 0.3s cubic-bezier(0.22,1,0.36,1)` driven by React state (not keyframes)

### Header
```
[ ◉ VICE CITY BEACH ]         [ ✕ ]
  ABOUT
```
- Colored district label (Bebas Neue, `color: markerColor`)
- Panel title below (Bebas Neue, white, larger)
- `✕` top-right closes panel (`onClose`)

### Scrollable content area
`overflow-y: auto`, custom scrollbar styled dark. Each panel component is rendered inside here.

Props: `{ selectedId: string | null, onClose: () => void }`

The panel renders the correct panel component via a lookup map:
```ts
const PANEL_MAP = {
  about:      <AboutPanel />,
  experience: <ExperiencePanel />,
  skills:     <SkillsPanel />,
  projects:   <ProjectsPanel />,
  education:  <EducationPanel />,
  contact:    <ContactPanel />,
};
```

---

## Panel Content

### AboutPanel
- `PARTH KHATRI` in large Bebas Neue, pink glow
- `SR. SOFTWARE ENGINEER` subtitle
- Wanted stars: `★★★★☆` in pink
- Tagline: `"4+ years shipping production software"`
- Location: `📍 Ahmedabad, Gujarat, India`

### ExperiencePanel
- Title: `MISSION LOG`
- Job: `SR. SOFTWARE ENGINEER` / `Jan 2022 → Present`
- Duration badge: `+4 Years XP` in orange
- 7 briefing bullets (same as before)
- Skills unlocked tags: C#, Azure, Angular, Twilio, SQL Server, TypeScript

### SkillsPanel
- Title: `ATTRIBUTES`
- 6 language bars with scroll-triggered animation (IntersectionObserver on panel mount)
- 6 tech stack groups with colored tag pills
- Same data as existing Attributes.tsx

### ProjectsPanel
- Title: `ACTIVE HEISTS`
- 3 project cards stacked vertically (no rotation — panel is narrow)
- Same data as existing HeistBoard.tsx

### EducationPanel
- Title: `PROPERTIES`
- Education card: Indus University, B.Tech, 2018-2022, CGPA 9.56
- 6 cert rows: AZ-400 (2025), Azure Dev Associate (2024), AZ-900 (2024), Python for Everybody (2021), Python Data Structures (2020), Data Science in Python (2020)
- Same visual style as existing SafeHouse.tsx

### ContactPanel
- Title: `IFRUIT NETWORK`
- Live clock (HH:MM, 24h)
- 4 contact rows: Email, Phone, LinkedIn, GitHub (disabled)
- Same data as existing IFruitPhone.tsx

---

## Page Shell (page.tsx)

State:
```ts
const [loaded, setLoaded] = useState(false);       // entry animation complete
const [selectedId, setSelectedId] = useState<string | null>(null);
```

Logic:
- Entry animation: `useEffect` with `setTimeout(1500)` sets `loaded = true`
- `handleSelect(id)`: sets `selectedId = id`
- `handleClose()`: sets `selectedId = null`

Render:
```
<div h-screen overflow-hidden>
  {!loaded && <EntryAnimation />}
  {loaded && (
    <>
      <HudNavbar selectedDistrict={...} onRadarClick={handleClose} />
      <CityMap selectedId={selectedId} onSelect={handleSelect} />
      <DetailPanel selectedId={selectedId} onClose={handleClose} />
    </>
  )}
</div>
```

The `EntryAnimation` is an inline component in `page.tsx` (small enough to not warrant its own file) — progress bar + `LOADING VICE CITY...` label.

---

## Animations

All new animations use existing keyframes already in `globals.css`:
- `fadeIn` — map reveal, entry overlay fade-out
- `progressFill` — entry animation bar fill
- `ping-slow` — marker rings
- `slideUp` — panel content stagger

Detail panel open/close uses CSS `transition` on `transform`, not keyframes. No new keyframes needed.

---

## Mobile Responsiveness

- CityMap: SVG scales via `viewBox` — works on all widths. On very small screens (<380px) the city will pan/zoom naturally via SVG scaling.
- DetailPanel: bottom sheet on mobile (below `sm:` breakpoint), right sidebar on `sm+`
- HudNavbar: same as before — radar icon + name only, district name hidden on xs
- Markers: touch targets are the `<g>` elements with `cursor: pointer`; the ping ring (r=16) provides adequate tap area

---

## What's Removed

- All 7 old section components (LoadingScreen, MissionLog, Attributes, HeistBoard, SafeHouse, IFruitPhone, DistrictMap)
- `app/gta/constants.ts` (SECTIONS constant)
- M-key map toggle (no longer needed)
- Scroll-based IntersectionObserver for activeSection tracking

---

## What's Out of Scope (v2)

- Animated cars/pedestrians on the map
- Real GTA VI asset textures (licensed)
- Map zoom/pan interaction
- GitHub link (still placeholder until URL provided)
- Sound effects
