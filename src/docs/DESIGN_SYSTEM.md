# Design System (as-built) — site Purple

> Verdade observada no código em **2026-07-06**. É um site de poucas páginas:
> isto é um **conjunto de tokens + componentes Base**, não um design system de
> produto. Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) ·
> [`CONTENT_MODEL`](CONTENT_MODEL.md) · [`POSITIONING`](POSITIONING.md).

Status: ✅ no código · 🟡 parcial/provisório · ⏳ pendente.

## Fonte única de tokens ✅

Tudo em **`src/styles/abstracts/_tokens.scss`** como CSS custom properties em
`:root`. Editar cor/tipografia/espaçamento = editar este arquivo.

**Cor — paleta de marca**
`--purple-900 #1a0533` · `-800 #2d0b55` · `-700 #4a1280` · `-600 #6b1faa` ·
`--purple #8b2fcc` · `-400 #a855d4` · `-100 #f0e4fb` · `-50 #faf5ff`.
Acento: `--lime #c5e22e` · `--lime-dark #9bb81f` · `--lime-light #e8f79a`.
Canais RGB para `rgba()` com opacidade variável: `--purple-rgb`, `--lime-rgb`.

**Cor — sobre fundo escuro** (`--on-dark #fff`, `--on-dark-strong .85`,
`--on-dark-muted .6`, `--on-dark-subtle .35`, `--on-dark-surface .05`,
`--on-dark-border .08`) e marca **WhatsApp** (`--whatsapp #25d366`, `-dark #1ebe59`).

**Texto/superfície:** `--ink`, `--text`, `--muted`, `--subtle` · `--surface`,
`--bg`, `--bg-alt` · `--border`, `--border-subtle`.

**Tipografia:** `--font: 'Plus Jakarta Sans'` (via Google Fonts no `index.html`).
Escala de corpo/UI: `--text-xs .75rem` → `-sm .875` → `-base 1` → `-lead 1.08`
→ `-lg 1.2` → `-xl 1.5` → `-2xl 2` → `-3xl 2.8rem`.
**Headings** (h1–h4) ficam em `base/_typography.scss` com `clamp()` fluido.

**Espaçamento:** escala `--space-1 .25rem` … `--space-20 5rem` (número = rem×4).

**Forma/elevação:** `--radius-sm/md/lg/xl/pill`, `--shadow-sm/md/lg/glow`,
`--container 1200px`, `--ease`, `--ease-out`.

> ⚠️ Os tokens `--space-*` e `--text-*` existem ✅, mas a **aplicação ainda é
> parcial** 🟡: muitos componentes usam `rem` cru. Não é regressão — é o nível
> de migração atual. Novos estilos devem preferir os tokens.

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
`card-hover`, `top-accent-line`, `radial-glow`, `eyebrow`, `fluid-type`,
`line-clamp`.

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
  mapa tipado **`src/components/ui/icons.ts`** (17 ícones, viewBox 24×24).
  Famílias: stroke (`currentColor`, width 1.75, caps/joins redondos) e **glifos
  de marca preenchidos** (`fill: true` — `whatsapp`, `linkedin`). Nome
  desconhecido cai num placeholder neutro (degradação graciosa — coberto por
  teste). Glifos tipográficos (`→ ← ✕`) seguem como **texto**, não como ícone.
- `MediaBlock` — slot de imagem com fallback: `<img>` opcional sobre o gradiente
  decorativo do `.visual-block`; em erro/ausência do arquivo, só o gradiente
  aparece (nunca broken image). Assets pendentes em [`IMAGES`](IMAGES.md).
- `FeaturePillar` (`icon`/`title`/`description` + `dark`), `TeamCard`.
- `BaseAvatar` (`ui/avatar/`) — imagem com **fallback de inicial** ao falhar o
  load (compõe `AvImage` + `AvInitials`); tamanhos `sm/md/lg/xl`. **Estilo
  co-localizado** (scoped + `:deep()`), não global.

**sections/** `CtaBanner` · **layout/** `AppHeader`, `AppFooter` ·
**blog/** `BlogList`, `BlogCard`, `PostCard`, `BlogPagination`, `BlogSidebar`.

## Números com valor + sinal em lime ✅ (convenção de exibição)

Números de destaque separam **valor** (cor de texto padrão) e **sinal/sufixo**
(`%`, `x`) em `var(--lime)` — classes `hero__stat-sign`, `hero__card-sign` e os
`span` internos de `panorama-card__number`/`data-stat-card__number`. A barra do
card do hero usa gradiente `purple → lime`. É o detalhamento fino de cor herdado
do develop: preservar ao criar novos blocos numéricos.

> Os antigos placeholders de conteúdo (⛔) foram preenchidos pela discovery —
> ver [`CONTENT_MODEL`](CONTENT_MODEL.md) e [`POSITIONING`](POSITIONING.md).

## Tema escuro ✅

Não há toggle claro/escuro. "Dark" = seções de fundo `--purple-900` que usam os
tokens `--on-dark-*` para texto/bordas. (Esses tokens foram restaurados após um
bug de auto-referência — ver histórico git.)
