import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /GLOBAL-BATTERY-WASTE-TRACKER/ — set base so
  // all asset paths (JS, CSS, worker, map tiles) resolve correctly.
  // Locally (npm run dev) this has no effect.
  base: '/GLOBAL-BATTERY-WASTE-TRACKER/',
})

