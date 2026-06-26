import { describe, it, expect } from 'vitest'

import { parseFrontmatter, slugify, markdownToHtml, countWords } from '@/plugins/vite-plugin-blog'

describe('slugify', () => {
  it('normaliza acentos, espaços e maiúsculas', () => {
    expect(slugify('Comunicação Interna')).toBe('comunicacao-interna')
  })

  it('remove caracteres especiais', () => {
    expect(slugify('Olá, mundo! (2026)')).toBe('ola-mundo-2026')
  })
})

describe('parseFrontmatter', () => {
  it('extrai chaves, arrays, booleanos e números; separa o corpo', () => {
    const raw = [
      '---',
      'title: Meu Post',
      'tags: [rh, cultura]',
      'featured: true',
      'readTime: 5',
      '---',
      'Conteúdo do corpo.',
    ].join('\n')

    const { fm, body } = parseFrontmatter(raw)

    expect(fm.title).toBe('Meu Post')
    expect(fm.tags).toEqual(['rh', 'cultura'])
    expect(fm.featured).toBe(true)
    expect(fm.readTime).toBe(5)
    expect(body.trim()).toBe('Conteúdo do corpo.')
  })

  it('sem frontmatter, retorna fm vazio e corpo intacto', () => {
    const { fm, body } = parseFrontmatter('Só corpo, sem frontmatter.')
    expect(fm).toEqual({})
    expect(body).toContain('Só corpo')
  })
})

describe('markdownToHtml', () => {
  it('gera headings com id de âncora', () => {
    expect(markdownToHtml('## Como atuamos')).toContain('<h2 id="como-atuamos">Como atuamos</h2>')
  })

  it('converte negrito, itálico, código e links', () => {
    const html = markdownToHtml('Texto **forte**, *ênfase*, `código` e [link](https://ex.com).')
    expect(html).toContain('<strong>forte</strong>')
    expect(html).toContain('<em>ênfase</em>')
    expect(html).toContain('<code>código</code>')
    expect(html).toContain('<a href="https://ex.com">link</a>')
  })

  it('converte lista não ordenada', () => {
    const html = markdownToHtml('- um\n- dois')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>um</li>')
  })
})

describe('countWords', () => {
  it('conta palavras ignorando espaços extras', () => {
    expect(countWords('  uma   duas três ')).toBe(3)
  })
})
