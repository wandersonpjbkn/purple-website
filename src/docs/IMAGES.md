# Imagens — assets pendentes e como ativá-los

> Guia de upload: cada slot de imagem do site já está preparado no código com
> fallback elegante (gradiente da marca ou wordmark). **Para ativar uma imagem,
> basta subir o arquivo no caminho exato abaixo — nenhuma mudança de código.**

## Como funciona

- Slots de seção usam o componente `MediaBlock` (`src/components/ui/MediaBlock.vue`):
  enquanto o arquivo não existe (ou falha), renderiza o gradiente decorativo;
  quando o arquivo aparece, a foto entra com fade suave.
- O logo é o componente `BrandLogo` (header e footer): renderiza **inline** o SVG
  de `src/assets/brand/logo-ppl.svg` (via `vite-svg-loader`), com fallback ao
  wordmark textual `ppl.comunicação`. Hoje há um **placeholder** nesse caminho —
  basta substituí-lo pelo logo definitivo (mesmas proporções ~170×32).
- Avatares (`BaseAvatar`) caem em iniciais quando a foto não existe.

## Imagens via CDN (`useCdnAsset`) ✅

Um segundo mecanismo, paralelo ao `MediaBlock`: `src/composables/useCdnAsset.ts`
recebe um `path` relativo (guardado no dado, ex.: `post.cover`, `member.avatar`)
e devolve `` `${VITE_CDN_URL}/${path}` `` — ou `undefined` se não houver `path`
(não valida se `VITE_CDN_URL` está de fato configurada).

- **`TeamCard.vue`** passa o resultado como `:src` do `BaseAvatar` — se a URL
  falhar ao carregar, o `@error` do `AvImage` já cai para as iniciais (mesmo
  fallback gracioso descrito acima).
- **`HomePage.vue`** usa `useCdnAsset(home.hero.background)` numa custom
  property (`--src`) do `.hero__background`, não num `<img>` — é imagem
  decorativa de fundo, então a ausência do arquivo não deixa nada quebrado
  na tela (o fundo simplesmente não pinta).
- **`BlogPostPage.vue`** exibe a capa no topo do corpo (`<img>` com
  `width="1200" height="675"`, `aspect-ratio: 16 / 9`, `object-fit: cover`,
  `fetchpriority="high"`): a capa ideal é **16:9, ≥1200×675**; outra proporção
  é cortada pelas bordas. `alt` = `coverAlt` (ou vazio). Em erro de carga, a
  imagem é removida — nada de ícone quebrado. Também passa a mesma URL como `image` do
  `usePageMeta` — a capa vira `og:image`/`twitter:image` (URL absoluta, desde
  que `VITE_CDN_URL` seja absoluta). Para quem não executa JS, o Worker do blog
  monta a mesma URL com a variável `CDN_URL` (mesmo valor de `VITE_CDN_URL`);
  sem ela, cai na `og-default.jpg`.
- **Imagens do corpo do post** (markdown): o parser do Worker resolve caminho
  relativo para `CDN_URL` — mesmo contrato de `useCdnAsset`. Sintaxe e
  dimensões em [`CONTENT_MODEL`](CONTENT_MODEL.md).
- **`PostCard.vue`** usa `useCdnAsset(post.cover)` direto no `<img>` da capa do
  post (`alt=""`: o link da capa é `aria-hidden` e o título do card vem logo
  abaixo), **sem** handler de erro: se a URL do CDN quebrar (404, `VITE_CDN_URL`
  ausente etc.), aparece o ícone nativo de imagem quebrada em vez de um
  fallback — assimetria real em relação ao `TeamCard`/`BaseAvatar`, registrada
  aqui como pendência de robustez (não é falha de acessibilidade: a capa do
  card é decorativa).

## Assets pendentes ⏳

| Slot            | Caminho exato                   | Formato | Proporção            | Tamanho mínimo | Observações                                                                        |
| --------------- | ------------------------------- | ------- | -------------------- | -------------- | ---------------------------------------------------------------------------------- |
| Logo definitivo | `src/assets/brand/logo-ppl.svg` | SVG     | ~170×32 (horizontal) | —              | **Substituir o placeholder** existente; fundo transparente. Inline via `BrandLogo` |

## Assets já entregues ✅

| Slot                         | Caminho                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| Foto do Wanderson            | `team/wanderson.jpg`                                                                             |
| Foto da Suelen               | `team/suelen.jpg`                                                                                |
| Seção destaque da Home       | `sections/home-highlight.jpg`                                                                    |
| Seção "Nossa crença" (Sobre) | `sections/about.jpg`                                                                             |
| Fundo do hero da Home        | `sections/hero-bg-gradient.png`                                                                  |
| Capas do blog (4 posts)      | `blog/post-1.jpg` … `post-4.jpg`                                                                 |
| Logo placeholder             | `src/assets/brand/logo-ppl.svg` (trocar pelo definitivo)                                         |
| Favicon / touch / OG         | `public/favicon.ico` · `favicon.svg` · `favicon.png` · `apple-touch-icon.png` · `og-default.jpg` |

> Os assets de marca raster (favicon PNG, favicon ICO com 16/32/48, apple-touch,
> OG 1200×630) são gerados da marca por `scripts/gen-brand-assets.mjs` (Chromium
> headless) — rodar de novo se o logo/paleta mudar. O `.ico` existe porque o
> Google e os navegadores buscam `/favicon.ico` mesmo quando a página declara
> outros ícones.

## Dicas de preparação

- Comprimir antes de subir (ex.: Squoosh, TinyPNG) — alvo < 300 KB por foto.
- JPGs em qualidade ~80 costumam bastar; o `MediaBlock` usa `object-fit: cover`,
  então sobras de enquadramento são cortadas pelas bordas, não distorcidas.
- Depois de subir, conferir em `yarn dev`: Home (`/`), Sobre (`/sobre`) e header.
