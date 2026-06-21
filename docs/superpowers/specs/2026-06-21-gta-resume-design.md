# GTA VI Style Resume — Design Spec
**Date:** 2026-06-21  
**Author:** Parth Khatri  
**Status:** Approved for implementation

---

## Overview

Add a GTA VI / Vice City-inspired resume experience to the existing Spotify Wrapped resume webapp. The GTA page is a **scrollable single-page** experience — completely different interaction model from the slide-based Wrapped style. A new style selector landing page lets visitors choose between the two.

---

## Routes

| Route | Description |
|---|---|
| `/` | New style selector — split screen, replaces current landing |
| `/wrapped` | Current Spotify Wrapped resume — moved here unchanged |
| `/gta` | New GTA VI scrollable resume |

---

## File Structure

```
app/
  page.tsx                        ← replaced: style selector
  wrapped/
    page.tsx                      ← current app/page.tsx moved here (no changes)
  gta/
    page.tsx                      ← GTA page shell + scroll orchestration
    components/
      HudNavbar.tsx               ← fixed top HUD + map icon
      DistrictMap.tsx             ← full-screen map overlay
      LoadingScreen.tsx           ← hero section
      MissionLog.tsx              ← experience section
      Attributes.tsx              ← skills section
      HeistBoard.tsx              ← projects section
      SafeHouse.tsx               ← education & certs section
      IFruitPhone.tsx             ← contact section
  globals.css                     ← shared + GTA keyframes appended
```

---

## Style Selector (`/`)

### Layout
- Full screen, dark background (`#0A0A1A`)
- Two halves split vertically down the center
- Thin dividing line with a `◆` separator at midpoint
- Each half is a clickable area → navigates to its route

### Left Half — Wrapped
- Background bleeds into Wrapped green/black palette (`#0a1a0d`)
- Spotify green (`#1DB954`) ambient glow
- Badge: `DEV WRAPPED` in Wrapped style
- Title: `Spotify Style` in bold white
- Subtitle: `The story so far.`
- Hover: slight brightness increase + scale(1.02)

### Right Half — GTA VI
- Background bleeds into GTA pink/coral (`#1a0a14`)
- Neon pink (`#FF006E`) ambient glow
- Badge: `GTA VI STYLE` in Pricedown-style font
- Title: `Vice City Style` with neon glow
- Subtitle: `Welcome to Vice City.`
- Hover: slight brightness increase + scale(1.02)

### Mobile
- Stack vertically: Wrapped on top, GTA below
- Each half takes 50vh

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0A0A1A` | Page background |
| `--pink` | `#FF006E` | Primary accent, neon glow |
| `--cyan` | `#00F5FF` | Secondary accent |
| `--orange` | `#FF6B35` | Tertiary accent |
| `--purple` | `#7B2FBE` | Section accents |
| `--text` | `#FFFFFF` | Primary text |
| `--text-muted` | `rgba(255,255,255,0.6)` | Secondary text |

---

## Typography

- **Headings:** Bebas Neue (Google Fonts) — bold condensed uppercase, GTA feel. Used for all section headers and the HUD name.
- **Body:** Inter (Google Fonts) — clean, readable for card content.
- **Neon glow effect on headings:** `text-shadow: 0 0 20px currentColor, 0 0 40px currentColor`

> Note: Bebas Neue is the closest reliably available alternative to Pricedown. If Pricedown is self-hosted later, swap the font-family declaration only.

---

## Fixed HUD Navbar

Always visible at top while scrolling through `/gta`.

### Layout
```
[ MAP ICON ]   PARTH KHATRI   [ CURRENT AREA ]
```

- Background: `rgba(10,10,26,0.85)` + `backdrop-filter: blur(12px)`
- Bottom border: `1px solid rgba(255,0,110,0.4)` with pink glow
- Height: `52px`

### Elements
- **Left:** Radar/map icon (SVG circle with blip). Click → opens District Map overlay. `M` key also toggles it.
- **Center:** `PARTH KHATRI` in Bebas Neue, small (16px), white
- **Right:** Current section area name — updates automatically on scroll via Intersection Observer. Displayed in pink, uppercase tracking.

### Area Names (per section)
| Section | Area Name |
|---|---|
| Loading Screen | `VICE CITY LOADING...` |
| Mission Log | `MISSION DISTRICT` |
| Attributes | `SKILLS ZONE` |
| Heist Board | `HEIST QUARTER` |
| Safe House | `VICE ACADEMY` |
| iFruit Phone | `IFRUIT NETWORK` |

---

## District Map Overlay

Triggered by: map icon click OR `M` key. Dismissed by: `ESC`, `X` button, or clicking a district.

### Layout
- Full-screen overlay: `rgba(10,10,26,0.95)` background
- Subtle scanline texture over entire overlay
- `X` close button top-right, neon pink
- Title: `VICE CITY` in large Bebas Neue at top

### Map
- CSS-drawn map — no real GTA assets
- 6 irregular district polygons using `clip-path`
- Each district has:
  - Neon-glowing border in its accent color
  - District name in Bebas Neue (uppercase)
  - Section label underneath in small Inter
  - Current active district pulses (opacity animation)
- Click any district → smooth scroll to that section + close overlay

### Districts & Colors
| District | Section | Color |
|---|---|---|
| VICE CITY BEACH | Loading Screen | `#FF006E` (pink) |
| MISSION DISTRICT | Experience | `#FF6B35` (orange) |
| SKILLS ZONE | Attributes | `#00F5FF` (cyan) |
| HEIST QUARTER | Projects | `#7B2FBE` (purple) |
| VICE ACADEMY | Education & Certs | `#FFD700` (gold) |
| IFRUIT NETWORK | Contact | `#1DB954` (green) |

---

## Section 1: Loading Screen (Hero)

Full viewport height. First thing visitors see.

### Background
- Deep navy base (`#0A0A1A`)
- Sunset gradient layered on top: pink → orange → purple at bottom horizon (`background: linear-gradient(to top, #FF006E22, #FF6B3522, #7B2FBE11, transparent)`)
- Palm tree silhouettes: 2–3 SVG palm trees, CSS `sway` animation (gentle left-right, 4s ease-in-out infinite)
- Grain/noise texture overlay: `opacity: 0.04` CSS noise SVG
- Scanline overlay: `repeating-linear-gradient` at `opacity: 0.03`

### Content (centered)
1. **Progress bar** (animates over 2s on page load):
   - Label: `INITIALIZING PARTH KHATRI...`
   - Bar: full width, pink fill, glow effect
   - After 2s: bar completes, content fades in
2. **Name:** `PARTH KHATRI` — massive Bebas Neue, neon pink glow, subtle flicker animation
3. **Title:** `SR. SOFTWARE ENGINEER` — Inter, white/70, wide tracking
4. **Wanted stars:** `★★★★☆` — 4 filled (4+ years), 1 empty. Pink color.
5. **Scroll hint:** pulsing `↓` arrow at bottom center with `SCROLL TO EXPLORE` text

### Bottom-left: Rotating Tips
Cycle every 3.5s with fade transition:
- `Tip: This developer never misses a deadline`
- `Tip: Hire before competitors do`
- `Tip: 4+ years of production software shipped`
- `Tip: Azure certified. Three times.`
- `Tip: Builds things that actually work in prod`

---

## Section 2: Mission Log (Experience)

### Background
- Dark charcoal (`#0f0f1a`) with subtle dot grid pattern

### Header
- `MISSION LOG` in Bebas Neue, orange glow
- Area tag: `MISSION DISTRICT` in small pink text

### Mission Card — Denali Software Solution
```
┌─────────────────────────────────────────┐
│ ⭐⭐⭐⭐☆  DIFFICULTY: SENIOR            │
│                                         │
│ MISSION: SR. SOFTWARE ENGINEER          │
│ EMPLOYER: Denali Software Solution      │
│ DURATION: Jan 2022 → Present            │
│ LOCATION: Ahmedabad, Gujarat, India     │
├─────────────────────────────────────────┤
│ MISSION BRIEFING:                       │
│ • Built production ASP.NET Core APIs    │
│ • Real-time chat with Twilio            │
│ • Geo-optimized route management        │
│ • Angular frontend with Kendo Grid      │
│ • MS SQL Server: stored procs, triggers │
│ • API encryption + role-based access    │
├─────────────────────────────────────────┤
│ ✅ MISSION PASSED!   +4 Years XP        │
│ SKILLS UNLOCKED: C#, Azure, Angular...  │
└─────────────────────────────────────────┘
```

- Card border: orange glow
- On scroll-enter: `MISSION PASSED ✅` green banner sweeps across the card (CSS slide animation)
- Difficulty stars styled like GTA mission rating

---

## Section 3: Attributes (Skills)

### Background
- Deep navy with faint hex grid overlay

### Header
- `ATTRIBUTES` in Bebas Neue, cyan glow

### Layout
Two columns:
- **Left: Languages** — 6 stat bars
- **Right: Tech Stack** — category tag groups

### Language Bars
GTA-style: blockier bars (height `10px`), colored per language, glow on fill

| Language | % | Color |
|---|---|---|
| C# | 92% | `#9B59B6` |
| Python | 78% | `#3498DB` |
| JavaScript | 85% | `#F1C40F` |
| TypeScript | 80% | `#2980B9` |
| SQL | 88% | `#E74C3C` |
| HTML & CSS | 75% | `#E67E22` |

Bars animate fill left-to-right on scroll into view (Intersection Observer).

### Tech Stack Tags
Grouped by category, each with colored glow border:
- **Backend:** ASP.NET Core, REST API, JWT Auth, ASP.NET MVC
- **Frontend:** Angular, TypeScript, Kendo Grid, HTML & CSS
- **Database:** MS SQL Server, Stored Procs, DB Triggers, Query Optimization
- **Security:** API Encryption, Role-based Access, Symmetric Keys
- **Integrations:** Twilio, Google Maps API, Fishbowl Inventory, Excel Import
- **Cloud & AI:** Azure, Devin, Cursor, Claude Code

---

## Section 4: Heist Board (Projects)

### Background
- Dark brown/charcoal with subtle corkboard texture (CSS `repeating-linear-gradient` crosshatch)

### Header
- `ACTIVE HEISTS` in Bebas Neue, purple glow

### Project Cards (3 total)
Polaroid-style, each with slight random rotation (`rotate(-1.5deg)`, `rotate(0.5deg)`, `rotate(-0.8deg)`).

**Card 1: Booking & Chat Platform**
- 🎯 HEIST: Booking & Chat Platform
- 👥 CREW: ASP.NET • Twilio • MSSQL • JWT
- 💰 PAYOUT: Real-time chef booking + secure chat
- ⭐ DIFFICULTY: ★★★★☆
- STATUS: `COMPLETE` (orange glow badge)

**Card 2: Sales & Route Management**
- 🎯 HEIST: Sales & Route Management
- 👥 CREW: Google Maps API • ASP.NET • Fishbowl
- 💰 PAYOUT: Geo-optimized route planning for field sales
- ⭐ DIFFICULTY: ★★★★☆
- STATUS: `COMPLETE` (green glow badge)

**Card 3: Secure Supply Portal**
- 🎯 HEIST: Secure Supply Portal
- 👥 CREW: Angular • API Encryption • MS SQL
- 💰 PAYOUT: HIPAA-grade secure medical supply ordering
- ⭐ DIFFICULTY: ★★★★★
- STATUS: `COMPLETE` (blue glow badge)

**Hover effect:** card lifts (`translateY(-6px) rotate(0deg)`), glow intensifies, scale(1.02).

---

## Section 5: Safe House (Education & Certs)

### Background
- Deep navy with subtle property grid lines

### Header
- `PROPERTIES` in Bebas Neue, gold glow

### Education Card
```
🏛️ VICE ACADEMY — INDUS UNIVERSITY
📍 Ahmedabad, Gujarat
🎓 B.Tech Computer Engineering
📅 2018 – 2022
⭐ CGPA: 9.56 / 10
✅ PURCHASED
```

### Certifications (6 — styled as property upgrades)
Highlighted (Azure tier):
- 🚀 DevOps Engineer Expert (AZ-400) — 2024
- ⚡ Azure Developer Associate — 2024
- ☁️ Azure Fundamentals — 2024

Standard tier:
- 🐍 Python for Everybody — 2021
- 📊 Python Data Structure — 2020
- 🔬 Data Science in Python — 2020

Each cert card: `✅ PURCHASED` badge + year. Azure certs have gold border glow, Python certs have standard white/10 border.

---

## Section 6: iFruit Phone (Contact)

### Background
- Deep black (`#050508`) with subtle neon grid

### Layout
- `iFRUIT` header in Bebas Neue, green glow
- CSS-drawn phone frame centered on screen
- Phone screen content:

### Phone Screen
```
  📱 iFRUIT OS
  ─────────────────
  📧 EMAIL
     parth55610@gmail.com

  📞 PHONE
     +91 94299 13616

  💼 LINKEDIN
     linkedin.com/in/parth-khatri-398216138

  🐙 GITHUB
     [To be added]
  ─────────────────
  📍 Ahmedabad, Gujarat, India
```

Each contact row is tappable (opens mailto/tel/URL). Tap feedback: subtle scale pulse.

### Footer
Below phone: `"Let's build something."` in large Bebas Neue  
Small text: `© 2026 Parth Khatri`

---

## Animations

| Animation | Trigger | Implementation |
|---|---|---|
| Loading progress bar | Page load | CSS `@keyframes`, 2s duration |
| Palm tree sway | Continuous | CSS `@keyframes sway`, 4s infinite |
| Grain texture | Continuous | Static CSS SVG noise overlay |
| Tip text rotation | Continuous | JS `setInterval`, 3.5s, fade transition |
| HUD area name update | Scroll | Intersection Observer |
| District map open/close | Click / M key | CSS opacity + scale transition |
| MISSION PASSED banner | Scroll into view | CSS `slideAcross` keyframe |
| Skill bar fill | Scroll into view | Intersection Observer + CSS transition |
| Heist card hover | Hover | CSS transform + box-shadow |
| Section entrance | Scroll into view | `slideUp` / `fadeIn` CSS (reuse from globals.css) |
| Neon flicker on headings | Continuous | CSS `@keyframes flicker`, subtle, 6s infinite |

---

## Scroll & Navigation

- **Scroll detection:** `IntersectionObserver` on each section's root element. When a section is ≥40% visible, it becomes "active" → updates HUD area name.
- **Smooth scroll:** CSS `scroll-behavior: smooth` on `html`. District map clicks use `element.scrollIntoView({ behavior: 'smooth' })`.
- **No slide transitions** — this is a standard scroll page, unlike Wrapped.

---

## Dependencies

No new npm packages required beyond what's already installed.

- **Bebas Neue + Inter:** Google Fonts via `next/font/google` (already used pattern in Next.js)
- **Intersection Observer:** Native browser API
- **CSS animations:** All custom, added to `globals.css`

---

## Mobile Responsiveness

- HUD navbar: map icon + name only on small screens (hide area name label)
- Loading screen: name font scales down (`text-6xl` mobile → `text-9xl` desktop)
- District map: districts stack as a list on mobile instead of polygon layout
- Heist cards: single column on mobile, rotation removed
- iFruit phone: phone frame shrinks, full width on small screens
- All sections: `px-4 sm:px-8` padding pattern (matches existing Wrapped approach)

---

## What's Explicitly Out of Scope (v1)

- Sound effects
- Rain toggle
- Helicopter spotlight
- Konami code easter egg  
- Custom cursor
- Open Graph image
- GitHub link (added later when URL is provided)
- Page title changes per section

These can be added as follow-on tasks without touching the core architecture.
