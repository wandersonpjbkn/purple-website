import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,

        // Garante que o roteamento SPA funcione offline (qualquer /livro/42, /categoria/...)
        navigateFallback: '/index.html',

        // Padrões de URL para excluir do navigateFallback
        // (evita interceptar o CSV do Sheets, que tem domínio externo)
        navigateFallbackDenylist: [/^\/api\//, /^https?:\/\//],

        runtimeCaching: [
          // ── Google Sheets CSV ──────────────────────────────────────────────
          // NetworkFirst: tenta buscar dados frescos, cai para cache SW se offline.
          // Junto com o cache Pinia (localStorage, TTL), o catálogo fica
          // disponível offline mesmo depois que o TTL do Pinia expira.
          {
            urlPattern: /^https:\/\/docs\.google\.com\/spreadsheets\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'sheets-data',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 3, // 3d
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // ── Google Fonts — CSS ─────────────────────────────────────────────
          // StaleWhileRevalidate: serve do cache imediatamente, atualiza em background.
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7d
              },
            },
          },

          // ── Google Fonts — arquivos de fonte (.woff2) ──────────────────────
          // CacheFirst: fontes não mudam, servir do cache é sempre correto.
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1y
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Ecos Catálogo',
        short_name: 'Ecos Catálogo',
        description: 'Catálogo de indicações do Clube Ecos Literários',
        start_url: '/',
        scope: '/',
        theme_color: '#0b1956',
        background_color: '#fb9ebb',
        display: 'fullscreen',
        orientation: 'portrait',
        lang: 'pt-BR',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
          {
            src: '/icons/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    svgLoader(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
