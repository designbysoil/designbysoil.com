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

## Site Animation Rules

These rules govern all CSS motion on the site and are derived from the HeroArt animation system. Apply them whenever adding or modifying animations.

### Speed

| Layer | Duration range | Notes |
|---|---|---|
| Micro-drift (shape-level float) | **3.2–5.1s** | Individual shapes; fast enough to feel alive |
| Mid-drift (group/pair float) | **4.3–5.1s** | Enclosing group; slightly slower than shapes inside |
| Macro orbit (structured travel) | **24s** | Only for hold-snap-hold orbit cycles; not for simple drift |

Never use durations above ~6s for organic drift — motion becomes imperceptibly slow and reads as static.

### Direction and timing

- Always use `animation-direction: alternate` on drift animations — shapes reverse naturally, no hard resets or jumps.
- Always use `animation-timing-function: ease-in-out` on drift — smooth deceleration at both ends.
- Use `animation-iteration-count: infinite`.

### Amplitude

Keep motion small so it reads as alive, not restless:

- **Translate**: ±3–4% of the container (or ±8–15px for fixed SVG coordinate systems)
- **Rotate**: ±2–4deg for organic shapes; no rotation on circles (it's invisible)

### Phase offset (negative delays)

All animations start pre-running via negative `animation-delay` so elements are in motion on page load and never sync up:

```css
/* Example offsets — stagger by 0.7–1.5s increments */
animation-delay: 0s;
animation-delay: -1.5s;
animation-delay: -0.8s;
animation-delay: -2.1s;
```

Choose delays that are not integer multiples of each other or of the animation duration.

### Non-repetition

With only `from/to` keyframes and `alternate`, a shape traces an exact A→B→A path. To make the path feel non-repeating, add **one intermediate keyframe at a non-50% position** with an offset that is not on the straight line between start and end:

```css
@keyframes example {
  from { transform: translate(0, 0) rotate(0deg); }
  40%  { transform: translate(6px, -8px) rotate(2deg); } /* off-axis mid-point */
  to   { transform: translate(-8px, 6px) rotate(-3deg); }
}
```

The `ease-in-out` curve hits the 40% stop at a different position on the forward vs backward pass, making each cycle feel slightly different.

### Hold-snap-hold (macro orbit only)

For structured orbital motion only (not micro-drift): encode static **holds** as repeated keyframe values, then snap to the next position using `cubic-bezier(0.22, 0, 0, 1)` (strong ease-out deceleration) set on the *preceding* hold keyframe. This makes motion read as: pause → sharp move → pause.

```css
8.33%  { rotate: 0deg;    animation-timing-function: cubic-bezier(0.22, 0, 0, 1); }
10%    { rotate: 165deg; }
20%    { rotate: 165deg;  animation-timing-function: cubic-bezier(0.22, 0, 0, 1); }
```

Do **not** use hold-snap-hold for organic/micro drift — it will look mechanical.

### Reduced motion

All animations must be suppressed in `@media (prefers-reduced-motion: reduce)`:
```css
animation: none !important;
transform: none !important; /* or restore centering as needed */
```

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
