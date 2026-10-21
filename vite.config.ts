import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps asset paths relative so the build works on GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // three.js is ~500 kB but only loaded on demand by the 3D scenes
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
