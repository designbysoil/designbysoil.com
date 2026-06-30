// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://designbysoil.com',
  output: 'static',
  build: {
    // Inline all CSS into the HTML to remove render-blocking stylesheet
    // requests on the critical path (improves FCP/LCP). The site's CSS is
    // small, so the per-page HTML cost is negligible.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap(),
  ],
  image: {
    domains: ['images.ctfassets.net'],
  },
  vite: {
    plugins: [yaml()],
  },
});
