import { Marked, type Tokens } from 'marked'

export interface MarkdownOptions {
  cdnUrl?: string
}

const CALLOUTS = {
  stat: 'Em números',
  summary: 'Resumo',
} as const

type CalloutType = keyof typeof CALLOUTS

const CALLOUT_MARKER = /^\[!(\w+)\][ \t]*([^\n]*)\n?/
const IMAGE_SIZE_FRAGMENT = /#(\d+)x(\d+)$/
const URL_SCHEME = /^([a-z][a-z0-9+.-]*):/i
const LINK_SCHEMES = new Set(['http', 'https', 'mailto', 'tel'])
const IMAGE_SCHEMES = new Set(['http', 'https'])

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const plainText = (value: string): string => value.replace(/[*_`[\]]/g, '').trim()

const isCalloutType = (value: string): value is CalloutType => Object.hasOwn(CALLOUTS, value)

const hasAllowedScheme = (url: string, schemes: Set<string>): boolean => {
  const scheme = URL_SCHEME.exec(url.replace(/[\u0000-\u0020\u007f]/g, ''))?.[1]
  return scheme === undefined || schemes.has(scheme.toLowerCase())
}

const isRelativePath = (href: string): boolean => !URL_SCHEME.test(href) && !href.startsWith('/')

const resolveImageSrc = (href: string, cdnUrl: string | undefined): string =>
  cdnUrl && isRelativePath(href) ? `${cdnUrl.replace(/\/$/, '')}/${href.replace(/^\.\//, '')}` : href

const imageTag = ({ href, text }: Tokens.Image, cdnUrl: string | undefined): string | null => {
  const size = IMAGE_SIZE_FRAGMENT.exec(href)
  const src = resolveImageSrc(href.replace(IMAGE_SIZE_FRAGMENT, ''), cdnUrl)
  if (!hasAllowedScheme(src, IMAGE_SCHEMES)) return null

  const dimensions = size ? ` width="${size[1] ?? ''}" height="${size[2] ?? ''}"` : ''
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(text)}"${dimensions} loading="lazy" decoding="async">`
}

const createParser = ({ cdnUrl }: MarkdownOptions): Marked => {
  const headingCounters: Record<string, number> = {}
  const parser = new Marked({ gfm: true })

  parser.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const level = Math.max(depth, 2)
        const base = slugify(text)
        const count = (headingCounters[base] ?? 0) + 1
        headingCounters[base] = count
        const id = count > 1 ? `${base}-${count}` : base
        return `<h${level} id="${id}">${this.parser.parseInline(tokens)}</h${level}>\n`
      },

      paragraph({ tokens }) {
        const [only] = tokens
        const image = tokens.length === 1 && only?.type === 'image' ? (only as Tokens.Image) : null
        const img = image ? imageTag(image, cdnUrl) : null
        if (image && img) {
          const caption = image.title ? `<figcaption>${escapeHtml(image.title)}</figcaption>` : ''
          return `<figure>${img}${caption}</figure>\n`
        }
        return `<p>${this.parser.parseInline(tokens)}</p>\n`
      },

      image(token) {
        return imageTag(token, cdnUrl) ?? escapeHtml(token.text)
      },

      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens)
        if (!hasAllowedScheme(href, LINK_SCHEMES)) return text
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
        return `<a href="${escapeHtml(href)}"${titleAttr}>${text}</a>`
      },

      html(token) {
        const text = escapeHtml(token.text.trim())
        return 'block' in token && token.block ? `<p>${text}</p>\n` : text
      },

      table({ header, rows }) {
        const labels = header.map(cell => escapeHtml(plainText(cell.text)))
        const th = header.map(cell => `<th>${this.parser.parseInline(cell.tokens)}</th>`).join('')
        const trs = rows
          .map(row => {
            const tds = row
              .map((cell, i) => {
                const label = labels[i]
                const content = this.parser.parseInline(cell.tokens)
                return label ? `<td data-label="${label}">${content}</td>` : `<td>${content}</td>`
              })
              .join('')
            return `<tr>${tds}</tr>`
          })
          .join('')
        return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>\n`
      },

      blockquote({ tokens }) {
        const [first] = tokens
        const marker = first?.type === 'paragraph' ? CALLOUT_MARKER.exec((first as Tokens.Paragraph).text) : null
        const type = marker?.[1]?.toLowerCase() ?? ''

        if (!marker || !first || !isCalloutType(type)) {
          return `<blockquote>\n${this.parser.parse(tokens)}</blockquote>\n`
        }

        const title = escapeHtml(marker[2]?.trim() || CALLOUTS[type])
        const rest = (first as Tokens.Paragraph).text.slice(marker[0].length)
        const body = [rest ? parser.lexer(rest) : [], tokens.slice(1)].flat()
        return `<div class="callout callout--${type}" role="note"><p class="callout__title">${title}</p>${this.parser.parse(body)}</div>\n`
      },
    },
  })

  return parser
}

export const markdownToHtml = (md: string, options: MarkdownOptions = {}): string =>
  createParser(options).parse(md, { async: false })
