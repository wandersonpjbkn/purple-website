import { createRouter, createWebHistory } from 'vue-router'

import { baseRoutes } from './modules/base'
import { blogRoutes } from './modules/blog'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...baseRoutes,
    ...blogRoutes,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
