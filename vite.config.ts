import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueDevTools from 'vite-plugin-vue-devtools'

import { blogPlugin } from './src/plugins/vite-plugin-blog'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    blogPlugin(),
    svgLoader(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
