import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Drop all console.* and debugger statements in production bundle
    minify: 'esbuild',
    target: 'es2015',
  },
  esbuild: {
    // Remove console.log/warn/error and debugger in production
    drop: ['console', 'debugger'],
  },
})


