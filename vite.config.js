import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'  // Asegúrate de que este sea el camino correcto
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://service-appphonebook.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
