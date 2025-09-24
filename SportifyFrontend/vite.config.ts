import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 publicDir: 'public',
  plugins: [react()],
  server: {
    proxy: {
      '/rest': 'http://localhost:8081' 
    }
  }
});