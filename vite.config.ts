import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root of burmagems.github.io.
  base: '/',
  plugins: [react(), tailwindcss()],
})
