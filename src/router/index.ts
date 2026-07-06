import { createRouter, createWebHistory } from 'vue-router'

import { baseRoutes } from './modules/base'
import { blogRoutes } from './modules/blog'

const router = createRouter({
  history: createWebHistory(),
  routes: [...baseRoutes, ...blogRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Âncoras (ex.: /servicos#endomarketing) rolam até a seção do serviço.
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
