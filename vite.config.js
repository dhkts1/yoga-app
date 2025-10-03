import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Mindful Yoga App',
        short_name: 'Yoga App',
        description: 'A mindful yoga practice app with voice coaching and progress tracking',
        theme_color: '#8FA68E',
        background_color: '#F5F3F0',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true // Enable PWA in development
      }
    })
  ],
  build: {
    // Optimize for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // State management
          'vendor-state': ['zustand'],
          // UI libraries
          'vendor-ui': ['framer-motion', 'lucide-react'],
          // Design system components
          'design-system': ['./src/components/design-system/index.js'],
          // Yoga data (poses, sessions, programs)
          'yoga-data': ['./src/data/poses.js', './src/data/poses_extended.js', './src/data/sessions.js', './src/data/programs.js', './src/data/breathing.js'],
          // Charts (heavy components from Insights)
          'charts': ['./src/components/charts/SimpleBarChart.jsx', './src/components/charts/HeatmapCalendar.jsx']
        }
      }
    }
  }
})
