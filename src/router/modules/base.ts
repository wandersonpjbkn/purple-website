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
  // Catch-all 404 — o menor score de match, então não intercepta rotas válidas
  // (inclusive as de blog registradas à parte).
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]
