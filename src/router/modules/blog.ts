export const blogRoutes = [
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
]
