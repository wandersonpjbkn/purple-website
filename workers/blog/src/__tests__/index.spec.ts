import { describe, it, expect } from 'vitest'

import { parseFrontmatter, slugify, markdownToHtml, countWords } from '../index'

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

  it('converte imagem', () => {
    const html = markdownToHtml('![Foto da equipe](https://ex.com/foto.jpg)')
    expect(html).toContain('<img alt="Foto da equipe" src="https://ex.com/foto.jpg">')
  })

  it('não confunde imagem com link', () => {
    const html = markdownToHtml('![capa](https://ex.com/capa.jpg) e um [link](https://ex.com)')
    expect(html).toContain('<img alt="capa" src="https://ex.com/capa.jpg">')
    expect(html).toContain('<a href="https://ex.com">link</a>')
    expect(html).not.toContain('<a href="https://ex.com/capa.jpg">')
  })
})

describe('markdownToHtml — tabelas', () => {
  it('rotula cada célula com o cabeçalho da coluna, para o empilhamento no mobile', () => {
    const html = markdownToHtml('| Indicador | Com programa |\n| --- | --- |\n| Bem-estar | **61%** |')

    expect(html).toContain('<th>Indicador</th><th>Com programa</th>')
    expect(html).toContain('<td data-label="Indicador">Bem-estar</td>')
    expect(html).toContain('<td data-label="Com programa"><strong>61%</strong></td>')
  })

  it('tira a marcação do rótulo e escapa aspas, sem quebrar o atributo', () => {
    const html = markdownToHtml('| **Frente** | O "plano" |\n| --- | --- |\n| a | b |')

    expect(html).toContain('<th><strong>Frente</strong></th>')
    expect(html).toContain('<td data-label="Frente">a</td>')
    expect(html).toContain('<td data-label="O &quot;plano&quot;">b</td>')
  })
})

describe('countWords', () => {
  it('conta palavras ignorando espaços extras', () => {
    expect(countWords('  uma   duas três ')).toBe(3)
  })
})
