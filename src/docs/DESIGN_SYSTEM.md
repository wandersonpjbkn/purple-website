# Design System (as-built) — site Purple

> Verdade observada no código em **2026-07-08**. É um site de poucas páginas:
> isto é um **conjunto de tokens + componentes Base**, não um design system de
> produto. Histórico de mudanças: [`CHANGELOG`](../../CHANGELOG.md).
> Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) ·
> [`CONTENT_MODEL`](CONTENT_MODEL.md) · [`POSITIONING`](POSITIONING.md).

Status: ✅ no código · 🟡 parcial/provisório · ⏳ pendente.

## Fonte única de tokens ✅

Tudo em **`src/styles/abstracts/_tokens.scss`** como CSS custom properties em
`:root`. Editar cor/tipografia/espaçamento = editar este arquivo.

**Cor — paleta de marca**
`--purple-900 #1a0533` · `-800 #2d0b55` · `-700 #4a1280` · `-600 #6b1faa` ·
`--purple #8b2fcc` · `-400 #a855d4` · `-100 #f0e4fb` · `-50 #faf5ff`.
**Lime é cor de marca co-titular do roxo (não acento pontual).** Papel no
sistema: "resultado / positivo / ação secundária".
`--lime #c5e22e` · `--lime-dark #9bb81f` · `--lime-light #e8f79a` · `--lime-ink #5f7213`
(verde escurecido para **texto/link sobre fundo claro** — `--lime` puro não passa
contraste em texto). Canais RGB para `rgba()`: `--purple-rgb`, `--lime-rgb`,
`--bg-rgb`, `--on-dark-rgb`.

**Fundo escuro das seções:** `--section-dark #241047` (roxo profundo, porém mais
quente/claro que `--purple-900`, para suavizar o contraste com as seções claras)
e `--section-dark-2 #2d1556` (cards de stat). `--purple-900` fica para acentos.

**Cor — sobre fundo escuro** (`--on-dark #fff`, `--on-dark-strong .88`,
`--on-dark-muted .74`, `--on-dark-subtle .55`, `--on-dark-surface .06`,
`--on-dark-border .1` — muted/subtle subidos para passar AA nas legendas) e marca

**Texto/superfície:** `--ink`, `--text`, `--muted`, `--subtle` · `--surface`,
`--bg`, `--bg-alt` · `--border`, `--border-subtle`.

**Tipografia:** `--font: 'Plus Jakarta Sans'` (via Google Fonts no `index.html`).
Escala de corpo/UI: `--text-xs .75rem` → `-sm .875` → `-base 1` → `-lead 1.08`
→ `-lg 1.2` → `-xl 1.5` → `-2xl 2` → `-3xl 2.8rem`.
**Headings** (h1–h4) ficam em `base/_typography.scss` com `clamp()` fluido.

**Espaçamento:** escala `--space-1 .25rem` … `--space-20 5rem` (número = rem×4).

**Forma/elevação:** `--radius-sm/md/lg/xl/pill`, `--shadow-sm/md/lg/glow`,
`--container 1200px`, `--ease`, `--ease-out`.

> Novos estilos devem preferir os tokens sempre que o valor existir na escala.
> Caso o novo estilo não possua correspondência com a escala, analisar
> implementação: faz sentido "arredondar" para caber na escala
> existente ou se faz sentido atualizar a escala existente com o novo
> valor.

## Proporção 60/30/10 — neutro/roxo/lima ✅ (regra de composição)

Composição visual do site segue **neutro ≈ 60% dominante** (fundo de página,
blocos claros, cards, header/footer) · **roxo ≈ 30% secundário** (tinta de
texto/heading, botões primários, um punhado de seções de fundo escuro — CTA,
panorama, 1 card em destaque) · **lima ≤ 10% acento** (nunca fundo de seção
inteira — só detalhes, ícones, sublinhados, botão do CTA). Conferir/reconferir
com `yarn color-audit` (`scripts/color-audit.mjs`): relatório de proporção por
rota, feito sobre screenshot full-page — **não é teste** (não faz assertions,
não roda em `yarn test`/CI).

## Arquitetura SCSS ✅

7-1 em `src/styles/`, orquestrada por `main.scss` na ordem
`abstracts → base → layout → components → sections`. `vite.config.ts` injeta
`@use "sass:map"` e `@use "sass:math"` em todo `.scss`.

**Posse de estilo:** `src/styles/*` é só para o que é global (reset, tokens,
layout, primitivos compartilhados). Estilo de um único componente mora **no
componente** (scoped + `:deep()`), para não virar uma camada frouxa sobrescrita
por scoped de página. Regra completa em [`CONVENTIONS`](CONVENTIONS.md).

`abstracts/_mixins.scss` traz: `respond-to($bp)` (breakpoints `xl 1280 · lg 1024
· md 900 · sm 640 · xs 420`, **mobile-last/`max-width`**), `card-surface`,
`card-hover`, `top-accent-line`, `radial-glow`, `eyebrow`, `line-clamp`.

## Convenção de nomes — BEM ✅

`bloco__elemento--modificador` (ex.: `service-card__icon`,
`hero__stat-divider`, `section-block--alt`, `feature-pillar--dark`). Utilitários
sem BEM: `.lead`, `.section-eyebrow` (+ `--lime`), `.text-link`, `.section-block`
(+ `--alt`, `--sm`).

## Componentes ✅

**ui/**

- `BaseButton` — `<component :is="tag">` polimórfico; `variant: primary |
secondary | ghost | lime`; `.button--lg`; só passa `to` quando `tag="RouterLink"`.
  **Caminho único de botão** — não escrever `class="button primary"` à mão.
- `BaseContainer` — wrapper `.container` (largura/centralização).
- `BaseIcon` — **sistema de ícones real ✅**: renderiza por `name` a partir do
  mapa tipado **`src/components/ui/icons.ts`** (21 ícones, viewBox 24×24).
  Famílias: stroke (`currentColor`, width 1.75, caps/joins redondos) e **glifos
  de marca preenchidos** (`fill: true` — `linkedin`; `instagram` é
  stroke). Nome desconhecido cai num placeholder neutro (degradação graciosa —
  coberto por teste). Não introduzir glifos tipográficos (exemplo: `→ ← ✕`).
  ⚠️ `BaseIcon` **herda a cor do pai** (`currentColor`): sobre fundo escuro, o
  contêiner precisa setar `color` (ex.: `--lime`/`--on-dark`), senão o ícone
  herda `--text` e some (escuro-sobre-escuro).
- `BrandLogo` — logo inline (via `vite-svg-loader`) a partir de
  `src/assets/brand/logo-ppl.svg`, com fallback ao wordmark textual; recolorível
  por CSS. Usado no header e no footer.
- `MediaBlock` — slot de imagem com fallback: `<img>` opcional sobre o gradiente
  decorativo do `.visual-block`; em erro/ausência do arquivo, só o gradiente
  aparece (nunca broken image). Assets pendentes em [`IMAGES`](IMAGES.md).
- `FeaturePillar` (`icon`/`title`/`description` + `dark`), `TeamCard`.
- `BaseAvatar` (`ui/avatar/`) — imagem com **fallback de inicial** ao falhar o
  load (compõe `AvImage` + `AvInitials`); tamanhos `sm/md/lg/xl`. **Estilo
  co-localizado** (scoped + `:deep()`), não global.

**sections/** `CtaBanner`, `FaqSection`, `PageHero` · **layout/** `AppHeader`,
`AppFooter` · **ui/** (+ `StatCard`, `ServiceTeaserCard`) · **blog/** `PostCard`,
`BlogPagination`.

## Stat grid canônico ✅

Estatísticas sobre fundo escuro (número + sufixo + label [+ body] + fonte) usam
**um** padrão: o layout `.stat-grid` em `src/styles/sections/_stats.scss`
(`--stat-cols`, hairline de 1px via `gap` + `--on-dark-border`; modificador
`--cols-3`) e o card é o componente **`StatCard.vue`** (dono do estilo `.stat-card`

- `--highlight`; props `number/suffix/label/body/source/highlight`). Usado na Home
  (panorama, `--cols-3`) e na Sobre (dados).

## Números com valor + sinal em lime ✅ (convenção de exibição)

Números de destaque separam **valor** (cor de texto padrão) e **sinal/sufixo**
(`%`, `x`) em `var(--lime)` — classes `hero__stat-sign`, `hero__card-sign` e o
`span` interno de `stat-card__number`. A barra do card do hero usa gradiente
`purple → lime`. Preservar ao criar novos blocos numéricos.

## Tema escuro ✅

Não há toggle claro/escuro. "Dark" = seções de fundo `--section-dark` que usam os
tokens `--on-dark-*` para texto/bordas. O modificador `.section-block--dark`
(em `layout/_grid.scss`) aplica o fundo **e** o contexto de texto on-dark aos
filhos (`h2`/`.lead`), evitando repetir cor inline em cada seção escura.
