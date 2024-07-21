import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://service-appphonebook.onrender.com/api/persons',
        changeOrigin: true,
      },
    }
  },
})
