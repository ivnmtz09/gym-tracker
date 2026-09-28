import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ForgeFit',
        short_name: 'ForgeFit',
        description: 'Track your fitness journey and evolve.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
      }
    })
  ],
})
