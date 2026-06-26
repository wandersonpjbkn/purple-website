export const baseRoutes = [
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
    path: '/contato',
    name: 'contact',
    component: () => import('@/pages/ContactPage.vue'),
  },
]
