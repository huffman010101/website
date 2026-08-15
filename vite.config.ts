import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      workbox: {
        // Precache everything the app ships (including the PDF worker
        // chunk, loaded via dynamic import) so the whole site works with
        // no network at all after the first visit.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,mjs}'],
        navigateFallback: '/website/index.html',
        // HashRouter means every real route is served from index.html;
        // never try to fetch a network path for in-app navigation.
        navigateFallbackDenylist: [/^\/website\/?$/],
        // Without these, a brand-new service worker installs quietly in
        // the background but does NOT take control of the tab that's
        // already open — offline only starts working after you close and
        // reopen the site a second time. Force it to take over immediately
        // on first visit instead.
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'FINdr — Finance Career Discovery',
        short_name: 'FINdr',
        description: 'Discover, prepare for, and practise your way into a finance career — fully offline-capable.',
        start_url: '/website/',
        scope: '/website/',
        display: 'standalone',
        background_color: '#0a0e14',
        theme_color: '#0a0e14',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  base: '/website/',
})
