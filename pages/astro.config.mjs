// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mcpe-shield-ui.cosmicpe.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
