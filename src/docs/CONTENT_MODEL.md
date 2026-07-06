# Content Model (as-built) — site Purple

> Verdade observada no código em **2026-07-06**. Onde mora cada conteúdo e qual
> é a regra de validação. Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) ·
> [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md) · [`POSITIONING`](POSITIONING.md) ·
> [`PROJECT_STATE`](PROJECT_STATE.md) · [`IMAGES`](IMAGES.md).

Status: ✅ dado real publicável · ⏳ pendência registrada.

## Fonte única de conteúdo ✅

| Fonte                | Papel                                                         | Status |
| -------------------- | ------------------------------------------------------------- | ------ |
| `src/data/*.json`    | Todo o conteúdo do site (fragmentado por domínio)             | ✅     |
| `content/posts/*.md` | Blog (via `virtual:blog-posts`); autores resolvidos em `team` | ✅     |

> `src/content/placeholders.ts` foi **aposentado** (jul/2026): a discovery
> preencheu os dois slots reservados. O conteúdo validado vive em `home.json`
> (hero) e `services.json` (oferta). O rascunho `SERVICE_OFFER_DRAFT` foi
> absorvido/atualizado no catálogo de `services.json`; histórico no git.

## `src/data/*.json` — fragmentado por domínio ✅

Não há mais um `site.json` genérico: cada domínio tem seu arquivo.

- **`team.json`** — array de pessoas: `slug`, `name`, `role`, `bio`, `quote`, `avatar`, `linkedin`, `isAuthor`. **Fonte única do time E dos autores do blog**; `isAuthor` marca quem assina posts.
- **`panorama.json`** — seção de dados de mercado da Home: `eyebrow`, `title`, `subtitle`, `stats[]`, `context[]`.
- **`approach.json`** — `pillars[]`, `differentials[]`, `process` (`steps[]`); fonte única da página Abordagem.
- **`about.json`** — `title`, `intro`, `helpTitle`, `helpText`, `image`/`imageAlt` (slot de foto — ver `IMAGES.md`), `dataStats[]`.
- **`footer.json`** — `aboutText`, `topics[]`, `social[]` (`{ label, icon, url }` — LinkedIn/Instagram no rodapé).
- **`pages.json`** — array `{ name, to }` com os links do menu principal; fonte única da navegação, consumida por `AppHeader.vue` e `AppFooter.vue`.
- **`home.json`** — copy da Home:
  - `hero`: `eyebrow`, `titlePrefix` (com `<em>` de destaque), `rotating[]` (typewriter), `subtitle`, CTAs, `stats[]` (`{ value, sign, label, source }` — sinal renderiza em lime) e `card` (`{ label, value, sign, sub, barWidth, tags[], source }`).
  - `highlight` (inclui `image`/`imageAlt` — slot de foto), `cta`.
- **`services.json`** — **fonte única da oferta**:
  - `intro` (hero da página), `homeTeaser` (seção da Home);
  - `catalog[7]` — formato rico por serviço: `id` (âncora `/servicos#id`), `icon`, `title`, `tagline`, `summary` (cards/teaser), `description`, `benefits[]`, `process[]`, `featured` (exatamente 1 = card destacado da Home);
  - `packages` — 3 planos recorrentes (`audience`, `summary`, `includes[]`, `featured`), `priceLabel: "Sob consulta"` (**sem preços publicados — decisão de produto**), `ctaLabel`;
  - `projects` — 3 projetos pontuais (cada um com `serviceId`, âncora para o card do catálogo).
- **`faq.json`** — `eyebrow`, `title`, `subtitle`, `items[]` (`{ question, answer }`); consumido por `FaqSection` (página `/faq` e seção na Serviços).
- **`privacy.json`** — `updatedAt`, `intro`, `sections[]` (`{ title, paragraphs[] }`); política LGPD (**texto-base, pendente de revisão jurídica** — ver `PROJECT_STATE`).

Ícones em dados são **nomes semânticos** (`target`, `megaphone`…), renderizados
por `BaseIcon` a partir do mapa `src/components/ui/icons.ts` — não emojis (ver
[`DESIGN_SYSTEM`](DESIGN_SYSTEM.md)). O teste `src/data/__tests__/services.spec.ts`
garante que todo ícone referenciado existe no mapa.

## As 6 páginas e a Arquitetura de Informação ✅

| Página        | Rota                                           | Seções → fonte                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**      | `/`                                            | hero `home.hero` · highlight `home.highlight` (+ `MediaBlock`) · serviços `services.homeTeaser` + `services.catalog` (4 comuns + 1 featured) · panorama `panorama` · blog (destaques) · time `team` · CTA `home.cta` |
| **Sobre**     | `/sobre`                                       | hero (copy no template) · crença `about.helpTitle/helpText` (+ `MediaBlock` `about.image`) · time `team` · dados `about.dataStats` · CTA                                                                             |
| **Abordagem** | `/abordagem`                                   | pilares `approach.pillars` · diferenciais `approach.differentials` · processo `approach.process` · CTA                                                                                                               |
| **Serviços**  | `/servicos`                                    | hero `services.intro` · catálogo `services.catalog` (âncoras `#id`) · planos `services.packages` · projetos `services.projects` · CTA                                                                                |
| **Blog**      | `/blog` (+ `/blog/:slug`, `/blog/autor/:slug`) | `virtual:blog-posts` + `team` (autores)                                                                                                                                                                              |
| **Contato**   | `/contato`                                     | `useContact()` + WhatsApp (`VITE_BASE_PHONE`) + form (`useMail` + Turnstile → Worker → Resend)                                                                                                                       |

Os destaques de blog na Home também vêm de `virtual:blog-posts` (`posts.slice(0, 3)`).

Além das 6 do menu, há páginas institucionais no rodapé — **FAQ** (`/faq` ←
`faq.json`) e **Privacidade** (`/privacidade` ← `privacy.json`) — e uma
**404** (`NotFoundPage`, catch-all). Cada post do blog ganhou um CTA de conversão
(`CtaBanner`) + convite ao serviço relacionado (mapa categoria→`services.catalog`).

> A "filosofia/processo" segue consolidada na **Abordagem**; a página de
> Serviços é oferta (catálogo + planos + projetos), por decisão registrada em
> [`PROJECT_STATE`](PROJECT_STATE.md).

## Toda afirmação cita fonte ✅ (com pendência ⏳)

Compromisso editorial da Purple (ver [`PRODUCT_VISION`](PRODUCT_VISION.md)): todo
dado/estatística exibido carrega a **fonte**. Verificável no código — cada item de
`panorama.stats` e `about.dataStats` tem `source`; os de `panorama.context`
citam a fonte no próprio texto. **Exceção registrada:** os stats do hero
(`home.hero.stats` e `home.hero.card`) foram restaurados do develop com `source`
vazio, aguardando confirmação das referências pela dupla — pendência rastreada em
[`PROJECT_STATE`](PROJECT_STATE.md). **Ao adicionar conteúdo factual novo, o
`source` é obrigatório.** Não publicamos preços (decisão: "Sob consulta").

## Fonte de blog unificada ✅

Todo o blog (inclusive a Home) lê de `virtual:blog-posts`. O stack legado
(`src/data/posts.json` → `BlogList` → `BlogCard`) foi removido — não há mais duas
fontes divergentes.
