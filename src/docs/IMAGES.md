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
- **`PostCard.vue`** usa `useCdnAsset(post.cover)` direto no `<img>` da capa do
  post, **sem** handler de erro: se a URL do CDN quebrar (404, `VITE_CDN_URL`
  ausente etc.), aparece o ícone nativo de imagem quebrada em vez de um
  fallback — assimetria real em relação ao `TeamCard`/`BaseAvatar`, registrada
  aqui como pendência de robustez (não é falha de acessibilidade, já que o
  `alt` do post continua presente).

## Assets pendentes ⏳

| Slot            | Caminho exato                   | Formato | Proporção            | Tamanho mínimo | Observações                                                                        |
| --------------- | ------------------------------- | ------- | -------------------- | -------------- | ---------------------------------------------------------------------------------- |
| Logo definitivo | `src/assets/brand/logo-ppl.svg` | SVG     | ~170×32 (horizontal) | —              | **Substituir o placeholder** existente; fundo transparente. Inline via `BrandLogo` |

## Assets já entregues ✅

| Slot                         | Caminho                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Foto do Wanderson            | `team/wanderson.jpg`                                                             |
| Foto da Suelen               | `team/suelen.jpg`                                                                |
| Seção destaque da Home       | `sections/home-highlight.jpg`                                                    |
| Seção "Nossa crença" (Sobre) | `sections/about.jpg`                                                             |
| Capas do blog (4 posts)      | `blog/post-1.jpg` … `post-4.jpg`                                                 |
| Logo placeholder             | `src/assets/brand/logo-ppl.svg` (trocar pelo definitivo)                         |
| Favicon / touch / OG         | `public/favicon.svg` · `favicon.png` · `apple-touch-icon.png` · `og-default.jpg` |

> Os assets de marca raster (favicon PNG, apple-touch, OG 1200×630) são gerados
> da marca por `scripts/gen-brand-assets.mjs` (Chromium headless) — rodar de novo
> se o logo/paleta mudar.

## Dicas de preparação

- Comprimir antes de subir (ex.: Squoosh, TinyPNG) — alvo < 300 KB por foto.
- JPGs em qualidade ~80 costumam bastar; o `MediaBlock` usa `object-fit: cover`,
  então sobras de enquadramento são cortadas pelas bordas, não distorcidas.
- Depois de subir, conferir em `yarn dev`: Home (`/`), Sobre (`/sobre`) e header.
