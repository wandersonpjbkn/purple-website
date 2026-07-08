import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueDevTools from 'vite-plugin-vue-devtools'

import { blogPlugin } from './src/plugins/vite-plugin-blog'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue(), blogPlugin(env.VITE_POSTS_API_URL), svgLoader(), vueDevTools()],
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
  }
})
