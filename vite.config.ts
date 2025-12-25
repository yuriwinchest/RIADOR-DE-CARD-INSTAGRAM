import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Aumenta o limite de aviso para 1000KB (1MB)
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa dependências grandes em chunks separados
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'canvas-vendor': ['html2canvas', 'react-rnd'],
        },
      },
    },
  },
})
