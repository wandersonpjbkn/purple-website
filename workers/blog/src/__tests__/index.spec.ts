import { describe, it, expect } from 'vitest'

import { parseFrontmatter, countWords } from '../index'
import { slugify, markdownToHtml } from '../markdown'

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

  it('converte imagem inline, preguiçosa e com alt', () => {
    const html = markdownToHtml('Veja ![Foto da equipe](https://ex.com/foto.jpg) aqui.')
    expect(html).toContain('<img src="https://ex.com/foto.jpg" alt="Foto da equipe" loading="lazy" decoding="async">')
  })

  it('não confunde imagem com link', () => {
    const html = markdownToHtml('![capa](https://ex.com/capa.jpg) e um [link](https://ex.com)')
    expect(html).toContain('<img src="https://ex.com/capa.jpg" alt="capa"')
    expect(html).toContain('<a href="https://ex.com">link</a>')
    expect(html).not.toContain('<a href="https://ex.com/capa.jpg">')
  })
})

describe('markdownToHtml — imagens em bloco', () => {
  const cdnUrl = 'https://cdn.example'

  it('resolve caminho relativo para o CDN, em vez de para a URL do post', () => {
    const html = markdownToHtml('![Equipe](blog/equipe.jpg)', { cdnUrl })
    expect(html).toContain('src="https://cdn.example/blog/equipe.jpg"')
  })

  it('mantém URL absoluta e caminho do próprio site como estão', () => {
    expect(markdownToHtml('![a](https://outro.com/a.jpg)', { cdnUrl })).toContain('src="https://outro.com/a.jpg"')
    expect(markdownToHtml('![a](/og-default.jpg)', { cdnUrl })).toContain('src="/og-default.jpg"')
  })

  it('imagem sozinha no parágrafo vira <figure>, com legenda vinda do título', () => {
    const html = markdownToHtml('![Equipe reunida](blog/equipe.jpg "Time da Purple em 2026")', { cdnUrl })
    expect(html).toBe(
      '<figure><img src="https://cdn.example/blog/equipe.jpg" alt="Equipe reunida" loading="lazy" decoding="async"><figcaption>Time da Purple em 2026</figcaption></figure>\n'
    )
  })

  it('lê as dimensões do fragmento #LxA, sem levá-lo para a URL', () => {
    const html = markdownToHtml('![Gráfico](blog/grafico.png#1200x800)', { cdnUrl })
    expect(html).toContain('src="https://cdn.example/blog/grafico.png" alt="Gráfico" width="1200" height="800"')
  })

  it('descarta imagem com esquema perigoso, mantendo só o texto alternativo', () => {
    const html = markdownToHtml('![x](javascript:alert(1))')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('javascript')
  })
})

describe('markdownToHtml — blocos', () => {
  it('junta linhas ">" consecutivas num único blockquote', () => {
    const html = markdownToHtml('> linha um\n> linha dois')
    expect(html.match(/<blockquote>/g)).toHaveLength(1)
    expect(html).toContain('linha um')
    expect(html).toContain('linha dois')
  })

  it('envolve em <p> o parágrafo que vem logo depois de uma tabela ou lista', () => {
    const html = markdownToHtml(
      '| a | b |\n| --- | --- |\n| 1 | 2 |\n\nDepois da tabela.\n\n- item\n\nDepois da lista.'
    )
    expect(html).toContain('<p>Depois da tabela.</p>')
    expect(html).toContain('<p>Depois da lista.</p>')
  })

  it('não envolve figura em parágrafo', () => {
    expect(markdownToHtml('![a](https://ex.com/a.jpg "legenda")')).not.toContain('<p><figure>')
  })

  it('rebaixa "#" para h2, para a página manter um único h1', () => {
    expect(markdownToHtml('# Título')).toContain('<h2 id="titulo">Título</h2>')
  })
})

describe('markdownToHtml — segurança', () => {
  it('escapa HTML cru, de bloco e inline, em vez de repassá-lo ao v-html', () => {
    const html = markdownToHtml('<script>alert(1)</script>\n\nTexto <img src=x onerror=alert(1)> fim.')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('remove o link com esquema perigoso, mantendo o texto', () => {
    for (const href of ['javascript:alert(1)', 'JAVASCRIPT:alert(1)', 'java\tscript:alert(1)', 'data:text/html,x']) {
      const html = markdownToHtml(`[clique](<${href}>)`)
      expect(html).toContain('clique')
      expect(html).not.toContain('<a')
    }
  })

  it('mantém links http(s), mailto, tel, âncora e relativos', () => {
    for (const href of ['https://ex.com', 'mailto:a@b.com', 'tel:+5519', '#secao', '/blog', 'outro-post']) {
      expect(markdownToHtml(`[x](${href})`)).toContain(`<a href="${href}">x</a>`)
    }
  })
})

describe('markdownToHtml — callouts', () => {
  it('[!summary] vira um bloco de resumo com título padrão', () => {
    const html = markdownToHtml('> [!summary]\n> Comunicar bem reduz ruído.')
    expect(html).toBe(
      '<div class="callout callout--summary" role="note"><p class="callout__title">Resumo</p><p>Comunicar bem reduz ruído.</p>\n</div>\n'
    )
  })

  it('[!stat] aceita título próprio na mesma linha do marcador', () => {
    const html = markdownToHtml('> [!stat] Afastamentos em 2025\n> **546 mil** afastamentos por transtornos mentais.')
    expect(html).toContain('<div class="callout callout--stat" role="note">')
    expect(html).toContain('<p class="callout__title">Afastamentos em 2025</p>')
    expect(html).toContain('<strong>546 mil</strong>')
  })

  it('tipo desconhecido continua sendo uma citação comum', () => {
    const html = markdownToHtml('> [!note]\n> Texto.')
    expect(html).toContain('<blockquote>')
    expect(html).not.toContain('callout')
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
