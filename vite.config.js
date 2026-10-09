import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Custom domain (batterywaste.org) serves from root — base must be '/'
  // If you remove the custom domain and go back to github.io, change this to:
  // base: '/GLOBAL-BATTERY-WASTE-TRACKER/'
  base: '/',

})

