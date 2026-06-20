# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint via next lint
npm run start    # Serve production build
```

## Architecture

Single-page Next.js App Router app. All content lives in three files:

- `app/page.tsx` — the entire app: slide state machine + all 7 slide components in one file
- `app/globals.css` — all keyframe animations (`slideUp`, `fadeIn`, `scaleIn`, `shimmer`, `float1/2`, `ping-slow`) and utility classes (`.blob-1`, `.blob-2`, `.project-card`, `.ping-slow`, `.shimmer-text`)
- `app/layout.tsx` — metadata only

## Slide System

Slides are driven by a `current` index into the `SLIDES` tuple. Navigation: keyboard arrows/space, click (right 75% = next, left 25% = prev), or touch swipe. Transitions use inline `opacity`/`transform` styles toggled by a `visible` boolean with a 350ms fade-out before advancing.

Each slide component receives an `animKey` prop (as React `key`) to force remount and restart CSS animations on every visit.

Slide order: `intro → experience → languages → projects → certifications → arsenal → contact`

## Aesthetic Rules

Spotify Wrapped style: dark backgrounds, vibrant gradient blobs (`.blob-1`/`.blob-2` classes for floating animation), bold oversized typography, staggered entry animations via `animation: slideUp/fadeIn/scaleIn Xs ease-out Ys both` inline styles. Each slide has its own color theme.

Animation pattern used throughout:
```tsx
style={{ animation: "slideUp 0.6s ease-out 0.3s both" }}
```
The `both` fill-mode is critical — keeps elements hidden before the delay fires.

## Mobile Considerations

The root div is `h-screen overflow-hidden` — all slide content must fit within viewport height. For mobile: prefer `text-4xl sm:text-5xl md:text-6xl` responsive sizing over fixed large values. Avoid `px-8` on slides with large text; `px-5 sm:px-8` is safer. The Experience slide's oversized stat (`text-[120px]`) is the most likely to overflow on small screens.
