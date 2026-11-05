import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

import PostCard from '@/components/blog/PostCard.vue'

import type { PostMeta } from '@/types/blog'

const post: PostMeta = {
  title: 'Dá para ser feliz no trabalho?',
  slug: 'da-para-ser-feliz-no-trabalho',
  excerpt: 'Resumo.',
  date: '2026-10-29',
  author: 'suelen-fernanda',
  category: 'Bem-estar',
  tags: [],
  readTime: 7,
  featured: false,
  cover: 'blog/post-5.jpg',
  wordCount: 1400,
}

const mountCard = () =>
  mount(PostCard, {
    props: { post },
    global: {
      plugins: [createRouter({ history: createMemoryHistory(), routes: [{ path: '/:p(.*)*', component: {} }] })],
    },
  })

describe('PostCard — capa', () => {
  it('mostra a capa do CDN como imagem decorativa', () => {
    const img = mountCard().get('.post-card__cover img')

    expect(img.attributes('src')).toContain('blog/post-5.jpg')
    expect(img.attributes('alt')).toBe('')
  })

  it('se a capa falhar ao carregar, troca pelo placeholder da categoria em vez do ícone quebrado', async () => {
    const wrapper = mountCard()

    await wrapper.get('.post-card__cover img').trigger('error')

    expect(wrapper.find('.post-card__cover img').exists()).toBe(false)
    expect(wrapper.get('.post-card__cover-letter').text()).toBe('B')
  })
})
