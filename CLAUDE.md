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
