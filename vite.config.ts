import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root of myanmarnativegems.github.io.
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // i18next + react-i18next + both bundled locale dictionaries push the
    // main chunk just over Vite's default 500kB warning threshold (it was
    // ~427kB before i18n). Both locales are intentionally bundled — not
    // lazy-loaded — so switching languages is instant with no network
    // request; raise the threshold instead of splitting a ~150kB-gzipped
    // bundle that's still well within a normal performance budget.
    chunkSizeWarningLimit: 600,
  },
})
