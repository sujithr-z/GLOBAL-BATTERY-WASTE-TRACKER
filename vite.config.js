import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Custom domain / Render serve from root
  base: '/',

  build: {
    // Raise warning threshold — maplibre is intentionally large
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split into separate cached chunks — function form required by Vite 8 (rolldown)
        manualChunks(id) {
          if (id.includes('maplibre-gl'))   return 'maplibre';
          if (id.includes('recharts'))       return 'recharts';
          if (id.includes('lucide-react'))   return 'lucide';
          if (id.includes('node_modules/react')) return 'react-vendor';
        },
      },
    },
  },
})
