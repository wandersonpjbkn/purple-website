# Content Model (as-built) — site Purple

> Verdade observada no código em **2026-06-26**. Onde mora cada conteúdo e qual
> é a regra de validação. Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) ·
> [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md) · [`POSITIONING`](POSITIONING.md) ·
> [`PROJECT_STATE`](PROJECT_STATE.md).

Status: ✅ dado real publicável · ⛔ bloqueado (placeholder até validar) · 🟡 a unificar.

## Duas fontes de conteúdo ✅/⛔

| Fonte | Papel | Status |
|---|---|---|
| `src/data/site.json` | Dados **reais já validados** (stats, time, contato, abordagem) | ✅ |
| `src/content/placeholders.ts` | Conteúdo **em validação** (posicionamento + oferta) | ⛔ |
| `content/posts/*.md` + `src/data/authors.json` | Blog (via `virtual:blog-posts`) | ✅ |

**Regra inegociável:** posicionamento (hero) e oferta de Serviços ficam em
**placeholders** até a discovery preencher os slots. O porquê está em
[`POSITIONING`](POSITIONING.md); o estado em [`PROJECT_STATE`](PROJECT_STATE.md).

## `site.json` — estrutura real ✅

Chaves de topo: `brand`, `home`, `approach`, `about`, `contact`, `footer`.

- **`brand`** — `name`, `tagline`.
- **`home`** — `hero` (apenas `primaryCta`/`secondaryCta`; o texto saiu para o placeholder), `panorama` (`stats[]`, `context[]`), `highlight` (`benefits[]`), `cta`, `team[]`.
- **`approach`** — `pillars[]`, `differentials[]`, `process` (`steps[]`). Reúne o que antes estava espalhado em `home`/`about`/`services`; é a fonte única da página Abordagem.
- **`about`** — `title`, `intro`, `helpTitle`, `helpText`, `dataStats[]`.
- **`contact`** — `title`, `subtitle`, `phone`, `email`, `address`.
- **`footer`** — `newsletterTitle`, `aboutText`, `topics[]`.

Ícones em dados são **nomes semânticos** (`target`, `megaphone`…), renderizados
por `BaseIcon` — não emojis (ver [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md)).

## `placeholders.ts` — conteúdo em validação ⛔

- **`POSITIONING_HOOK`** → todo o hero da Home: `eyebrow`, `title`, `rotating[]`
  (typewriter), `subtitle`, `proofPoints[]`, `card`. Todos os valores são `{{POSITIONING_HOOK}}`.
- **`SERVICE_OFFER`** → enquadramento da seção/página de Serviços (`eyebrow`,
  `title`, `subtitle`) + `items[]` (cards genéricos `{{SERVICE_OFFER}}`). A
  **oferta inteira, inclusive nomes**, é placeholder.
- **`SERVICE_OFFER_DRAFT`** → catálogo antigo (Employer Branding, Endomarketing…)
  **preservado como rascunho-hipótese e NÃO renderizado** em nenhuma tela.

## As 6 páginas e a Arquitetura de Informação ✅

| Página | Rota | Seções → fonte |
|---|---|---|
| **Home** | `/` | hero ⛔`POSITIONING_HOOK` · highlight `home.highlight` · serviços ⛔`SERVICE_OFFER.items` · panorama `home.panorama` · blog (destaques) · time `home.team` · CTA |
| **Sobre** | `/sobre` | hero (copy no template) · crença `about.helpTitle/helpText` · time `home.team` · dados `about.dataStats` · CTA |
| **Abordagem** | `/abordagem` | pilares `approach.pillars` · diferenciais `approach.differentials` · processo `approach.process` · CTA |
| **Serviços** | `/servicos` | hero ⛔`SERVICE_OFFER` · cards ⛔`SERVICE_OFFER.items` · CTA |
| **Blog** | `/blog` (+ `/blog/:slug`, `/blog/autor/:slug`) | `virtual:blog-posts` + `authors.json` |
| **Contato** | `/contato` | `contact.*` + WhatsApp (`VITE_BASE_PHONE`) + form (`useEmailJS`) |

Os destaques de blog na Home também vêm de `virtual:blog-posts` (`posts.slice(0, 3)`).

> A "filosofia/processo" foi consolidada na **Abordagem** (não em Serviços), por
> decisão de produto registrada em [`PROJECT_STATE`](PROJECT_STATE.md).

## Fonte de blog unificada ✅

Todo o blog (inclusive a Home) lê de `virtual:blog-posts`. O stack legado
(`src/data/posts.json` → `BlogList` → `BlogCard`) foi removido — não há mais duas
fontes divergentes.
