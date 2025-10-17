import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['playwright', 'playwright-core', '@playwright/mcp', 'chromium-bidi']
  },
  ssr: {
    noExternal: []
  },
  resolve: {
    alias: {
      // Prevent Vite from trying to bundle playwright
      'playwright': 'playwright',
      'playwright-core': 'playwright-core'
    }
  }
})
