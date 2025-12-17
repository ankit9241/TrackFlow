import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(path.resolve(__dirname, 'tailwind.config.cjs')),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173,
    open: true
  }
})