import { describe, it, expect } from 'vitest'

import about from '@/data/about.json'
import home from '@/data/home.json'
import panorama from '@/data/panorama.json'

const stats = [
  ...home.hero.stats.map(stat => ({ where: 'home.hero.stats', stat })),
  ...panorama.stats.map(stat => ({ where: 'panorama.stats', stat })),
  ...about.dataStats.map(stat => ({ where: 'about.dataStats', stat })),
]

describe('fonte de cada número publicado', () => {
  it.each(stats)('$where cita a fonte', ({ stat }) => {
    expect(stat.source.trim()).not.toBe('')
  })
})
