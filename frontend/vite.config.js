import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Always 5173: the API only accepts the origins listed in FRONTEND_ORIGIN,
  // so a silent switch to another port would look like "cannot reach the server".
  server: { port: 5173, strictPort: true },
})
