# Conteúdo e imagens — guia de autoria

Como escrever e publicar conteúdo no site: posts do blog, dados das páginas e
imagens. Os campos de cada arquivo se leem no próprio `src/data/*.json` e nos
tipos em `src/types/`.

## Onde mora cada conteúdo

- **Páginas:** `src/data/*.json`, um arquivo por domínio. `services.json` é a
  fonte única da oferta; `team.json` é a fonte única do time **e** dos autores
  do blog (`isAuthor` marca quem assina posts).
- **Blog:** arquivos `.md` no bucket R2 `purple-comunica`, em
  `posts/<slug>.md`. O conteúdo do blog não está neste repositório. Publicar:
  ver `workers/blog/README.md`.
- **A filosofia e o processo moram na Abordagem; Serviços é só oferta**
  (catálogo, planos e projetos).

## Regras editoriais

- **Todo número publicado cita a fonte** (campo `source`, ou no próprio texto
  quando o dado está em prosa). Compromisso da Purple (ver
  [`PRODUCT_VISION`](PRODUCT_VISION.md)); `src/data/__tests__/sources.spec.ts`
  falha se um stat ficar sem fonte. Conteúdo factual novo sem fonte não entra.
- **Sem preço publicado:** planos são "Sob consulta" (decisão de produto,
  guardada por `services.spec.ts`).
- **Ícones em dados são nomes semânticos** do mapa `icons.ts`, nunca emoji.

## Post do blog

### Frontmatter

`title`, `slug` (opcional; padrão é o nome do arquivo), `excerpt`, `date`,
`author` (slug de `team.json`), `category`, `tags`, `readTime` (opcional;
calculado a ≈200 palavras por minuto), `featured`, `cover` e `coverAlt`
(opcional). `title`, `excerpt` e `cover` também são o `<title>`, a description
e a imagem do preview de link (LinkedIn, WhatsApp).

- **`cover`** é um caminho relativo no CDN (ex.: `blog/post-6.jpg`). A capa
  ideal é **16:9, ≥1200×675**; outra proporção é cortada pelas bordas.
- **`coverAlt`** descreve a capa **só quando ela informa algo que o título não
  diz** (um gráfico, uma pessoa específica). Sem ele, a capa é tratada como
  ilustrativa.

### Corpo

- **Seções:** `##` e abaixo. `#` é rebaixado a `##`, porque o título do post
  já é o `h1` da página.
- **Imagens:** `![alt](caminho)`. Caminho relativo vai para o CDN. Informe as
  dimensões para evitar salto de layout: `blog/grafico.png#1200x800`. Imagem
  sozinha no parágrafo vira figura, e o título vira legenda:
  `![Equipe reunida](blog/equipe.jpg#1200x800 "Time da Purple em 2026")`.
  `alt` descreve a imagem; a legenda complementa, sem repetir um no outro.
- **Callouts — só dois tipos, no máximo um de cada por post:**
  - `> [!summary]` — "Resumo": a ideia do artigo em uma ou duas frases.
  - `> [!stat] Título opcional` — "Em números": o dado que sustenta o
    argumento, **com fonte** no texto.

  ```
  > [!stat] Afastamentos em 2025
  > **546.254** afastamentos por transtornos mentais (Ministério da Previdência Social).
  ```

  Outro tipo (`[!note]`…) vira citação comum.

- **HTML cru não é aceito:** tags no `.md` aparecem como texto. Links só
  `http(s)`, `mailto`, `tel`, relativo ou `#`.
- **Tabelas** em sintaxe GFM. No celular, cada célula aparece com o texto do
  cabeçalho da coluna ao lado: o cabeçalho precisa fazer sentido lido junto de
  cada valor.

## Imagens das páginas

- **Para ativar uma imagem, basta subir o arquivo no caminho que o dado
  aponta** — nenhuma mudança de código. Todo slot tem fallback: gradiente da
  marca (`MediaBlock`), iniciais (`BaseAvatar`) ou placeholder da categoria
  (capa de post). Imagem quebrada nunca aparece.
- **Imagens do CDN** usam caminho relativo no dado (ex.: `team/suelen.jpg`,
  `sections/about.jpg`), resolvido com `VITE_CDN_URL` no site e `CDN_URL` no
  Worker do blog. Os dois precisam ter o mesmo valor; sem `CDN_URL`, o preview
  de link do post cai na imagem padrão.
- **Logo:** `src/assets/brand/logo-ppl.svg` é um placeholder; substituir pelo
  definitivo, SVG horizontal ~170×32 com fundo transparente.
- **Favicon, ícone de toque e imagem padrão de preview** são gerados da marca
  por `scripts/gen-brand-assets.mjs`; rodar de novo se o logo ou a paleta
  mudar. O `.ico` existe porque o Google e os navegadores buscam
  `/favicon.ico` mesmo quando a página declara outros ícones.
- **Preparação:** comprimir antes de subir (alvo < 300 KB por foto; JPG em
  qualidade ~80 costuma bastar). Os slots usam `object-fit: cover`: sobras de
  enquadramento são cortadas, não distorcidas.
