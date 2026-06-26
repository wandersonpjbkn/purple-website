# Content Model (as-built) — site Purple

> Verdade observada no código em **2026-06-26**. Onde mora cada conteúdo e qual
> é a regra de validação. Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) ·
> [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md) · [`POSITIONING`](POSITIONING.md) ·
> [`PROJECT_STATE`](PROJECT_STATE.md).

Status: ✅ dado real publicável · ⛔ bloqueado (placeholder até validar) · 🟡 a unificar.

## Duas fontes de conteúdo ✅/⛔

| Fonte                         | Papel                                                         | Status |
| ----------------------------- | ------------------------------------------------------------- | ------ |
| `src/data/*.json`             | Dados **reais já validados** (fragmentados por domínio)       | ✅     |
| `src/content/placeholders.ts` | Conteúdo **em validação** (posicionamento + oferta)           | ⛔     |
| `content/posts/*.md`          | Blog (via `virtual:blog-posts`); autores resolvidos em `team` | ✅     |

**Regra inegociável:** posicionamento (hero) e oferta de Serviços ficam em
**placeholders** até a discovery preencher os slots. O porquê está em
[`POSITIONING`](POSITIONING.md); o estado em [`PROJECT_STATE`](PROJECT_STATE.md).

## `src/data/*.json` — fragmentado por domínio ✅

Não há mais um `site.json` genérico: cada domínio tem seu arquivo.

- **`team.json`** — array de pessoas: `slug`, `name`, `role`, `bio`, `quote`, `avatar`, `linkedin`, `isAuthor`. **Fonte única do time E dos autores do blog** (antes duplicado em `site.team` + `authors.json`); `isAuthor` marca quem assina posts.
- **`panorama.json`** — seção de dados de mercado da Home: `eyebrow`, `title`, `subtitle`, `stats[]`, `context[]`.
- **`approach.json`** — `pillars[]`, `differentials[]`, `process` (`steps[]`); fonte única da página Abordagem.
- **`about.json`** — `title`, `intro`, `helpTitle`, `helpText`, `dataStats[]`.
- **`contact.json`** — `title`, `subtitle`, `phone`, `email`, `address` (usado por Contato e rodapé).
- **`footer.json`** — `newsletterTitle`, `aboutText`, `topics[]`.
- **`home.json`** — copy específica da Home: `hero` (`primaryCta`/`secondaryCta`), `highlight`, `cta`.

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

| Página        | Rota                                           | Seções → fonte                                                                                                                                                    |
| ------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**      | `/`                                            | hero ⛔`POSITIONING_HOOK` · highlight `home.highlight` · serviços ⛔`SERVICE_OFFER.items` · panorama `panorama` · blog (destaques) · time `team` · CTA `home.cta` |
| **Sobre**     | `/sobre`                                       | hero (copy no template) · crença `about.helpTitle/helpText` · time `team` · dados `about.dataStats` · CTA                                                         |
| **Abordagem** | `/abordagem`                                   | pilares `approach.pillars` · diferenciais `approach.differentials` · processo `approach.process` · CTA                                                            |
| **Serviços**  | `/servicos`                                    | hero ⛔`SERVICE_OFFER` · cards ⛔`SERVICE_OFFER.items` · CTA                                                                                                      |
| **Blog**      | `/blog` (+ `/blog/:slug`, `/blog/autor/:slug`) | `virtual:blog-posts` + `team` (autores)                                                                                                                           |
| **Contato**   | `/contato`                                     | `contact.*` + WhatsApp (`VITE_BASE_PHONE`) + form (`useEmailJS`)                                                                                                  |

Os destaques de blog na Home também vêm de `virtual:blog-posts` (`posts.slice(0, 3)`).

> A "filosofia/processo" foi consolidada na **Abordagem** (não em Serviços), por
> decisão de produto registrada em [`PROJECT_STATE`](PROJECT_STATE.md).

## Toda afirmação cita fonte ✅

Compromisso editorial da Purple (ver [`PRODUCT_VISION`](PRODUCT_VISION.md)): todo
dado/estatística exibido carrega a **fonte**. Verificável no código — cada item de
`panorama.stats` e `about.dataStats` tem `source`; os de `panorama.context`
citam a fonte no próprio texto. **Ao adicionar conteúdo factual, manter o `source`**
(pesquisa, relatório, revista/jornal). Conteúdo sem fonte não entra.

## Fonte de blog unificada ✅

Todo o blog (inclusive a Home) lê de `virtual:blog-posts`. O stack legado
(`src/data/posts.json` → `BlogList` → `BlogCard`) foi removido — não há mais duas
fontes divergentes.
