// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://designbysoil.com',
  output: 'static',
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
