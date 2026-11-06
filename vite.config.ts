import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueDevTools from 'vite-plugin-vue-devtools'
import { sentryVitePlugin } from '@sentry/vite-plugin'

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN

// SPA shell copy

const spaShell = (): Plugin => ({
  name: 'spa-shell',
  apply: 'build',
  enforce: 'post',
  generateBundle(_, bundle) {
    const index = bundle['index.html']
    if (index?.type !== 'asset') return
    this.emitFile({ type: 'asset', fileName: 'spa-shell.html', source: index.source })
  },
})

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    vueDevTools(),
    spaShell(),
    !!sentryAuthToken &&
      sentryVitePlugin({
        org: 'wi-studio',
        project: 'purple-website',
        authToken: sentryAuthToken,
        telemetry: false,
        sourcemaps: { filesToDeleteAfterUpload: ['dist/**/*.map'] },
      }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:map";
          @use "sass:math";
        `,
      },
    },
  },
  build: {
    sourcemap: sentryAuthToken ? 'hidden' : false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]',
      },
    },
  },
})
