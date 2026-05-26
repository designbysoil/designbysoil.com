# CLAUDE.md

## Project Overview

Portfolio website for Abdul Rehman Khawar (designbysoil.com) — a digital designer based in Canada. Built with Astro as a fully static site, deployed to Netlify.

## Tech Stack

- **Framework:** Astro 6.x (static output)
- **Language:** TypeScript (strict)
- **Styling:** SCSS (`src/styles/global.scss`)
- **Data:** YAML (`src/data/projects.yaml`)
- **Deploy:** Netlify (`netlify.toml`)

## Commands

```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Build to dist/
npm run preview  # Preview built output
```

## Project Structure

```
src/
  components/    # Reusable Astro components
  layouts/       # BaseLayout.astro wraps all pages
  pages/         # File-based routing
    index.astro
    work/
    information/
    project/[slug]/
  data/
    projects.yaml  # All project metadata + image URLs
  styles/
    global.scss    # CSS vars, typography, reset
  utils/
    placeholder.ts # LQIP blur placeholder generator
public/            # Static assets (fonts, favicon)
```

## Key Conventions

- **Images** are served from Contentful CDN (`ctfassets.net`). Use Contentful URL params for optimization: `?w=`, `?q=90`, `?fl=progressive`, `?fit=fill`.
- **Fonts** are self-hosted woff2 (Suisse Intl), preloaded in BaseLayout.
- **Animations** use `IntersectionObserver` for scroll reveals and `requestAnimationFrame` for frame-loop animations. Always respect `prefers-reduced-motion`.
- **Color scheme** is dark: `#161616` background, `#ecf0f3` text. Per-project accent colors are defined in `projects.yaml`.
- **No JS framework** — all interactivity is vanilla JS inside `<script>` tags in `.astro` files.

## Hero Art Animation (`src/components/HeroArt.astro`)

Three shape pairs (rect + circle) that orbit and rotate. All CSS, no JS except the `is-loaded` class toggle on `requestAnimationFrame`.

### Structure (4 layers deep)

```
.hero-art                     — relative container, aspect-ratio 854/866
  .hero-art__pair--N          — absolute inset:0, drives orbit + rotation
    .hero-art__drift--N       — absolute inset:0, drives pair-level drift
      .hero-art__shape        — absolutely positioned rect or circle
```

### Pair animation (on `.hero-art__pair`)

- `animation-duration: 24s, 24s` — both pair-rotate and pair-travel run on a 24s cycle
- `animation-direction: alternate` — after 3 CW cycles the whole system reverses to 3 CCW cycles, forever
- `animation-timing-function: cubic-bezier(0.95, 0, 0.05, 1)` — base curve (overridden per keyframe at snap points)
- Each pair-rotate keyframe embeds **3 full rotations** (0→1080deg or 0→-1080deg) so `alternate` reverses a full set of 3 at once
- Pre-snap keyframes carry `animation-timing-function: cubic-bezier(0.22, 0, 0, 1)` (strong ease-out) so snaps decelerate into position
- Transform origins: pair-1 `75.4% 26.7%`, pair-2 `29% 31%`, pair-3 `64.9% 75.9%`

### Pair-level drift (on `.hero-art__drift`)

Slow `ease-in-out alternate` float — each pair drifts in a different direction with a different duration so they never sync:

| Element | Direction | Duration | Delay |
|---|---|---|---|
| drift-1 | `+2.6% +1.8%` | 4.3s | 0s |
| drift-2 | `-1.9% +2.8%` | 5.1s | −1.7s |
| drift-3 | `+1.4% −2.4%` | 4.7s | −0.9s |

### Shape-level drift (on individual shapes)

Each rect and circle has its own slow `ease-in-out alternate` drift in opposing directions within the pair, creating organic independent motion:

| Shape | Direction | Duration | Delay |
|---|---|---|---|
| rect-orange | `+4% −3%` | 3.7s | 0s |
| circle-right | `−3% +4%` | 4.3s | −1.5s |
| rect-pink | `−4% −3%` | 3.2s | −0.8s |
| circle-upper | `+3% +4%` | 4.8s | −2.1s |
| rect-blue | `+3% +4%` | 3.9s | −1.1s |
| circle-lower | `−4% +3%` | 4.1s | −0.4s |

Shape drift keyframes use `calc(-50% + offset)` to preserve the `translate: -50% -50%` centering.

### Reduced motion

All pair, drift, and shape animations are suppressed with `animation: none !important`. Shapes get `translate: -50% -50% !important` to restore centering, and `opacity: 1 !important` to skip the fade-in.

## Adding a New Project

1. Add an entry to `src/data/projects.yaml` with slug, title, client, color, hero/thumbnail URLs, toolkit, and image arrays.
2. The dynamic route `src/pages/project/[slug]/index.astro` picks it up automatically.
3. Upload images to Contentful and use the CDN URLs with optimization params.

## Styling Notes

- Type scale uses a 1.25 ratio (14px–48px).
- Breakpoints: 479px, 767px, 991px (mobile-first).
- CSS custom properties are defined in `global.scss` — prefer those over hardcoded values.

## Analytics

Google Analytics tag `G-CZP9MB8BPY` is loaded in `BaseLayout.astro`.
