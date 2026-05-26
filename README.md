# designbysoil.com

Portfolio website for [Abdul Rehman Khawar](https://designbysoil.com) — a digital designer based in Canada, working globally on purpose-driven brand experiences.

## Stack

- [Astro](https://astro.build) 6.x — static site generation
- TypeScript (strict)
- SCSS
- YAML data layer for project content
- Deployed on [Netlify](https://netlify.com)

## Development

**Requirements:** Node >= 18.17.0

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # Outputs to dist/
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
  components/          # Reusable UI components
  layouts/             # Page shell (BaseLayout.astro)
  pages/               # File-based routes
    index.astro        # Homepage
    work/              # Project gallery
    information/       # About & contact
    project/[slug]/    # Dynamic project pages
  data/
    projects.yaml      # Project metadata & image URLs
  styles/
    global.scss        # Design tokens, typography, reset
  utils/
    placeholder.ts     # Blur placeholder generator (LQIP)
public/                # Static assets (fonts, favicon)
```

## Content

Project content is managed in `src/data/projects.yaml`. Images are hosted on Contentful CDN and referenced by URL with optimization parameters.

## Featured Projects

- Qatar Foundation Navigation Redesign
- Meedan Health Desk
- Guardiãs da Resistência Podcast
- Misinfodemia Podcast
- Meedan Credibility Catalog
- Meedan Team Survey Results
- 2020 Misinfodemic Report
