import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Vite 8 uses oxc as its default minifier (esbuild is deprecated)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // oxc is the default minifier in Vite 8 — no esbuild needed
    minify: 'oxc',
    target: 'es2015',
  },
})
