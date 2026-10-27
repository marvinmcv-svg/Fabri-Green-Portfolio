# Fabrizio Saunero — Portfolio

A world-class single-page portfolio for student-athlete **Fabrizio Saunero**: golfer, basketball player, community fundraiser, and young professional. Dark editorial sports-magazine aesthetic — near-black canvas, volt-lime accent, oversized display typography.

## Highlights

- **Hero** — giant stacked typography, trophy portrait, animated stat counters (25 hrs/wk training, 5 titles, $7,000 raised, 6 jobs held)
- **01 Athletics** — autoplay golf-swing video, team photos, trophy cabinet, team roster
- **02 Community** — $7,000 / 15-surgeries impact story and commitments
- **03 Work** — photo collage + 6-job experience ledger
- **04 Independence** — skills toolkit, languages, education
- **Highlights Reel** — custom video player with a 5-clip playlist (play/pause/mute)
- **Gallery** — masonry photo grid with accessible lightbox (keyboard navigation)
- **Closing** — contact cards and footer

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, custom design tokens, grain texture, marquee keyframes |
| Motion | Framer Motion (scroll reveals, counters, reduced-motion aware) |
| Fonts | Anton (display), Inter (body), Instrument Serif (italic accents) |
| Data | Content modeled in `src/data.ts` from Fabrizio's copy & resume |
| QA | Playwright E2E suite — 149 checks, 6 viewports, 100% pass |

## Project Structure

```
src/
  app/            # layout, page, globals.css
  components/     # nav, hero, marquee, intro, athletics, community,
                  # work, independence, highlights, gallery, closing
  data.ts         # all copy + resume facts
public/
  media/
    images/       # curated photography
    videos/       # highlight clips + poster frames
scripts/
  e2e_portfolio_test.py   # Playwright E2E suite (149 checks)
  run_e2e.sh              # server + test runner
  e2e-shots/              # evidence screenshots (desktop + mobile)
```

## Getting Started

```bash
bun install        # or npm install
bun run dev        # http://localhost:3000
```

## Quality Assurance

The site is verified end-to-end with a Playwright suite covering:

- **Structure** — section order, headings, SEO meta, fonts, media attributes, lazy-loading
- **Overrides & stacking** — z-index layering, click-interception sweeps, anchor alignment vs fixed nav
- **Interactions** — nav, autoplay video, custom player, lightbox (mouse + keyboard), counters
- **Mobile matrix** — iPhone 14 (390px), small Android (360px), iPhone SE (320px), iPad (768px), landscape (844×390) with touch emulation: no horizontal overflow, tap targets ≥ 40px, fonts ≥ 11px
- **Zero console errors, zero failed network requests**

```bash
bash scripts/run_e2e.sh
```

Result: **149/149 checks pass** across desktop 1920×1080 and 5 mobile/touch viewports.
