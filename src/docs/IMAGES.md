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

## Assets pendentes ⏳

| Slot                         | Caminho exato                               | Formato | Proporção                        | Tamanho mínimo       | Observações                                                                        |
| ---------------------------- | ------------------------------------------- | ------- | -------------------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| Foto da Suelen (time)        | `public/images/team/suelen.jpg`             | JPG     | 1:1 (quadrada)                   | 640×640px            | Mesmo enquadramento/estilo da `wanderson.jpg` já existente                         |
| Logo definitivo              | `src/assets/brand/logo-ppl.svg`             | SVG     | ~170×32 (horizontal)             | —                    | **Substituir o placeholder** existente; fundo transparente. Inline via `BrandLogo` |
| Seção destaque da Home       | `public/images/sections/home-highlight.jpg` | JPG     | ~4:3 vertical-friendly           | 1200px no lado maior | Aparece ao lado de "Na busca pelo crescimento…"; foto de time/ambiente de trabalho |
| Seção "Nossa crença" (Sobre) | `public/images/sections/about.jpg`          | JPG     | ~4:3                             | 1200px no lado maior | Ideal: foto dos fundadores ou do trabalho em contexto                              |

## Assets já entregues ✅

| Slot                    | Caminho                                        |
| ----------------------- | ---------------------------------------------- |
| Foto do Wanderson       | `public/images/team/wanderson.jpg`             |
| Capas do blog (4 posts) | `public/images/blog/post-1.jpg` … `post-4.jpg` |
| Logo placeholder        | `src/assets/brand/logo-ppl.svg` (trocar pelo definitivo) |
| Favicon / touch / OG    | `public/favicon.svg` · `favicon.png` · `apple-touch-icon.png` · `og-default.jpg` |

> Os assets de marca raster (favicon PNG, apple-touch, OG 1200×630) são gerados
> da marca por `scripts/gen-brand-assets.mjs` (Chromium headless) — rodar de novo
> se o logo/paleta mudar.

## Dicas de preparação

- Comprimir antes de subir (ex.: Squoosh, TinyPNG) — alvo < 300 KB por foto.
- JPGs em qualidade ~80 costumam bastar; o `MediaBlock` usa `object-fit: cover`,
  então sobras de enquadramento são cortadas pelas bordas, não distorcidas.
- Depois de subir, conferir em `yarn dev`: Home (`/`), Sobre (`/sobre`) e header.
