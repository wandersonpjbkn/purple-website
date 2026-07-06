import { createRouter, createWebHistory } from 'vue-router'

import { baseRoutes } from './modules/base'
import { blogRoutes } from './modules/blog'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...baseRoutes,
    ...blogRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
