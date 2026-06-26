const name = 'blog';

export const blogRoutes = [
  {
    path: `/${name}`,
    name,
    component: () => import('@/pages/BlogPage.vue'),
  },
  {
    path: `/${name}/autor/:slug`,
    name: `${name}-author`,
    component: () => import('@/pages/AuthorPage.vue'),
  },
  {
    path: `/${name}/:slug`,
    name: `${name}-post`,
    component: () => import('@/pages/BlogPostPage.vue'),
  },
]
