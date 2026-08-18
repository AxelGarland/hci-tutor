import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative paths so the build works on GitHub Pages (/hci-tutor/) and at a domain root.
  base: './',
  server: { port: 5174, strictPort: true },
})
