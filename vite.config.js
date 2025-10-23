import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // expose dev server to the local network so other devices (like your phone) can connect
  server: {
    host: true,      // binds to 0.0.0.0
    port: 5173,      // change if you prefer a different port
    strictPort: false // if port in use, Vite will try a different one when false
  }
})
