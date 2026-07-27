import { defineConfig } from 'vite'

// Relative base so the site works on any host / GitHub Pages sub-path
// (e.g. https://<user>.github.io/<repo>/) and even opened from a file path.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    target: 'es2020',
  },
})
