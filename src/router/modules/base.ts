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
    component: () => import('@/pages/ApproachPage.vue'),
  },
  {
    path: '/contato',
    name: 'contact',
    component: () => import('@/pages/ContactPage.vue'),
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/pages/FaqPage.vue'),
  },
  {
    path: '/privacidade',
    name: 'privacy',
    component: () => import('@/pages/PrivacyPage.vue'),
  },
]
