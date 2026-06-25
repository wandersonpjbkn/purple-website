import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/servicos',
      name: 'services',
      component: () => import('@/pages/ServicesPage.vue'),
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('@/pages/AboutPage.vue'),
    },
    {
      path: '/abordagem',
      name: 'approach',
      component: () => import('@/pages/AbordagemPage.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/pages/BlogPage.vue'),
    },
    {
      path: '/blog/autor/:slug',
      name: 'blog-author',
      component: () => import('@/pages/AuthorPage.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('@/pages/BlogPostPage.vue'),
    },
    {
      path: '/contato',
      name: 'contact',
      component: () => import('@/pages/ContactPage.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
