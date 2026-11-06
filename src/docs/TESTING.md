# Testing & BDD — site Purple

> Estado real em **2026-11-05** + diretrizes para quando houver testes.
> Histórico de mudanças: [`CHANGELOG`](../../CHANGELOG.md). Relacionados:
> [`ARCHITECTURE`](ARCHITECTURE.md) · [`CONTENT_MODEL`](CONTENT_MODEL.md).

Status: ✅ existe no repo · ⏳ proposto (não existe ainda).

## Verdade hoje ✅/⏳

- **Runner: Vitest 3** (`vitest.config.ts` próprio, standalone) + **@vue/test-utils**
  - **jsdom**. Roda com **`yarn test`** (`vitest run`) ou `yarn test:watch`.
- **130 testes** em 25 arquivos `*.spec.ts`, co-locados em `__tests__/` (já
  excluídos do build app pelo `tsconfig.app.json`). `workers/**` é excluído do
  `vitest.config.ts` da raiz — **cada Worker roda sua própria suíte** (ver
  abaixo): `workers/blog` com 68 testes e `workers/mail` com 15. Total do repo:
  **213 testes unitários** em 3 suítes, mais 8 cenários e2e.
- **fake-indexeddb** (devDependency) fornece um IndexedDB em memória para os
  testes de `useBlogCache` — o runtime continua sem dependência nova.
- **Portões de qualidade ✅** (rodar antes de subir):
  - **Testes:** `yarn test`.
  - **Type-check:** `yarn ts` (`vue-tsc --build`), também dentro de `yarn build`.
  - **Lint:** `yarn lint` · **Format:** `yarn format`.
- Nota: ao fim de `yarn test` aparece _"something prevents Vite server from
  exiting"_ — aviso **benigno** do Vitest (saída 0, testes passam).

### Coberto hoje ✅

| Arquivo                                             | O que valida                                                                                                                                                                                                                                        |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `composables/__tests__/useBlog.spec.ts`             | filtro por termo/categoria, paginação, clamp de página, `clearFilters` — `useBlogData` mockado (`vi.mock`) com fixture própria, sem depender de rede                                                                                                |
| `composables/__tests__/useBlogData.spec.ts`         | SWR do índice: cache hit serve e revalida, miss vai à rede, falha de rede não lança (mantém cache/vazio), dedupe de chamadas concorrentes, categorias contadas; `getPost` por stamp, 404 → null, stale em offline                                   |
| `composables/__tests__/useBlogCache.spec.ts`        | round-trip índice/post no IndexedDB (`fake-indexeddb`); degrada para `null`/no-op sem IndexedDB                                                                                                                                                     |
| `composables/__tests__/useTypewriter.spec.ts`       | digitação letra a letra, pausa fora da viewport/aba oculta e retomada sem reset, `prefers-reduced-motion`, cleanup no unmount                                                                                                                       |
| `components/blog/__tests__/CategoryFilter.spec.ts`  | Todos + quick pills limitadas, dropdown com todas as categorias (`aria-expanded`), emissão de seleção, Escape fecha devolvendo foco, categoria ativa refletida no trigger                                                                           |
| `components/blog/__tests__/PostCard.spec.ts`        | capa do CDN com `alt=""` (decorativa); em erro de carga, troca pelo placeholder da categoria                                                                                                                                                        |
| `composables/__tests__/useMail.spec.ts`             | envio com sucesso; erro quando a API responde `success: false`; timeout (`AbortController`); `reset`                                                                                                                                                |
| `composables/__tests__/useContactForm.spec.ts`      | validação por campo (nome, e-mail, assunto, mensagem ≥ 10 chars), formulário válido sem erros, `clearForm`                                                                                                                                          |
| `data/__tests__/services.spec.ts`                   | **integridade do conteúdo publicado**: sem `{{...}}`, sem preços (`R$`), catálogo 7 completo, 3 planos "Sob consulta", ícones referenciados existem em `icons.ts`, hero com `source`                                                                |
| `components/ui/__tests__/BaseIcon.spec.ts`          | paths reais por `name`, glifo de marca preenchido, fallback p/ nome desconhecido, aria (`label`)                                                                                                                                                    |
| `pages/__tests__/HomePage.spec.ts`                  | smoke de render: hero validado (stats valor+sinal, card, tags), teaser 4+1 featured                                                                                                                                                                 |
| `pages/__tests__/ServicesPage.spec.ts`              | smoke de render: catálogo com âncoras, 3 `package-card` sem preço, projetos                                                                                                                                                                         |
| `data/__tests__/footer.spec.ts`                     | tópicos do rodapé apontam para `id` real de `services.catalog`, sem destino repetido                                                                                                                                                                |
| `scripts/__tests__/dist-server.spec.ts`             | servidor estático do prerender: serve o shell original mesmo depois de `dist/index.html` virar snapshot (o que duplicava o JSON-LD), serve do disco o arquivo que existe, recusa rodar sobre um `dist/` já prerenderizado ou sem build              |
| `scripts/__tests__/render-routes.spec.ts`           | `render.yaml` tem um rewrite por rota de `ROUTES` (`scripts/shared.mjs`) e mantém a catch-all de SPA por último — sem isso a catch-all engole as rotas e anula o prerender (ver `ARCHITECTURE.md`)                                                  |
| `scripts/__tests__/sitemap.spec.ts`                 | `public/sitemap.xml` lista exatamente `ROUTES` + autores de `team.json`; `robots.txt` declara os dois sitemaps                                                                                                                                      |
| `stores/__tests__/consent.spec.ts`                  | transições do consentimento LGPD + getters                                                                                                                                                                                                          |
| `components/__tests__/CookieConsent.spec.ts`        | banner aparece/oculta; aceitar/recusar/Esc; não bloqueia a página (sem overlay, trava de rolagem, `aria-modal` nem roubo de foco)                                                                                                                   |
| `components/ui/__tests__/BaseCombobox.spec.ts`      | combobox de interesse: abre com a lista completa ao focar, filtra ao digitar, "Nenhum resultado", emite a opção clicada, setas + Enter selecionam a destacada, Esc reverte mantendo o foco, clique fora não emite valor inválido, `focus()` exposto |
| `composables/__tests__/useServiceInterest.spec.ts`  | resolve `id` de serviço/plano para o rótulo (e string vazia para slug desconhecido/ausente, incluindo o formato de array do vue-router); lista catálogo + planos + as duas opções genéricas                                                         |
| `composables/__tests__/useWhatsapp.spec.ts`         | monta a URL `wa.me` a partir do telefone de contato, codifica acentos/espaços/pontuação e reage a `ref` de mensagem                                                                                                                                 |
| `composables/__tests__/useShareLinks.spec.ts`       | UTM de compartilhamento (source/medium/campaign, preserva parâmetros), URL canônica do post a partir de `SITE_URL`, links de LinkedIn/X/WhatsApp com título e reatividade ao trocar de post                                                         |
| `components/blog/__tests__/PostShare.spec.ts`       | links de saída em nova aba com nome acessível; copiar link com UTM `copy`, aviso visível e `role="status"`, erro de cópia e volta do rótulo; gaveta nativa só quando o navegador oferece, com UTM `native`                                          |
| `components/ui/__tests__/ServiceTeaserCard.spec.ts` | link "Conhecer o serviço" para a âncora do serviço, classe que estende o link ao card inteiro e variante `horizontal`                                                                                                                               |
| `composables/__tests__/useCtaTracking.spec.ts`      | `whatsapp_click` e `contact_form_submit` com categoria/ação/label corretos, mesclando dados extras; não lança quando o GTM não está configurado                                                                                                     |

> Padrão dos smokes de página: `createRouter(createMemoryHistory, rotas reais)` +
> `createHead()` de `@unhead/vue/client` em `global.plugins` — necessários porque
> `usePageMeta` usa `useRoute` + `useSeoMeta`.

### `workers/blog` — suíte própria ✅

O parsing (`parseFrontmatter` e `countWords` em `index.ts`; `slugify` e
`markdownToHtml` em `markdown.ts`) roda no Worker, não no front-end — por isso tem sua própria
suíte, independente da raiz: `workers/blog/vitest.config.ts` (ambiente
`node`) — `index.spec.ts` (parsing), `routes.spec.ts` (rotas `/index`,
`/posts/:slug`, edge cache/ETag/304, CORS, `/deploy` com purge, `500` sem
detalhe interno e com o motivo no log, falha do hook do Render no log, evento enviado ao Sentry com o SDK em mock, slug e página malformados sem
registrar falha; R2 fake em memória), `security.spec.ts` (`timingSafeEqual`), `postPage.spec.ts` (head do
post: título, canonical, OG com a capa via CDN ou a imagem padrão com
dimensões, JSON-LD com a chave `jsonld` e sem como fechar a tag) e
`sitePages.spec.ts` (`/blog/:slug` e `/blog/autor/:slug` no domínio do site:
post do índice, post recém-publicado fora do índice em cache, 404, repasse à
origem quando o shell falha, métodos/arquivos repassados, snapshot de autor e
fallback para o shell; `/sitemap-posts.xml` gerado do R2), **68 testes**. `index.spec.ts` cobre o parser:
`data-label` das tabelas, imagens (CDN, `<figure>` com legenda, `#LxA`,
esquema perigoso descartado), blockquote de várias linhas num bloco só,
parágrafo depois de tabela/lista envolvido em `<p>`, `#` rebaixado,
HTML cru escapado, links `javascript:`/`data:` (inclusive com tab no meio)
removidos e callouts (`[!summary]`, `[!stat]` com título próprio, tipo
desconhecido vira citação).

**Regressão de conteúdo publicado:** ao mexer no parser, comparar o HTML de
todos os posts do R2 antes × depois (HEAD × working tree) e explicar cada
diferença. Roda com `cd workers/blog && yarn test`.

O `HTMLRewriter` só existe no runtime do Workers: em `sitePages.spec.ts` ele é
um fake que registra o que cada handler faria. A reescrita real é conferida à
mão, simulando um cliente sem JS:

1. `yarn wrangler r2 object put purple-comunica/posts/<slug>.md --file <md> --local`
   (em `workers/blog`) para cada post;
2. `cd workers/blog && yarn wrangler dev --local --var SITE_ORIGIN:http://localhost:4181 --var CDN_URL:<cdn>`;
3. na raiz, `VITE_POSTS_API_URL=http://localhost:8787 yarn build:static` e
   servir `dist/` em `4181` (ex.: `python3 -m http.server 4181` dentro de `dist/`);
4. `curl -A 'facebookexternalhit/1.1' http://localhost:8787/blog/<slug>` e
   conferir `<title>`, `og:title` e `og:image` (e 404 para slug inexistente).

### `workers/mail` — suíte própria ✅

Mesmo arranjo: `workers/mail/vitest.config.ts` (ambiente `node`), **15 testes**
— `validate.spec.ts` (payload completo aceito; falta de nome, de token do
Turnstile ou de serviço de interesse rejeitada), `emailTemplate.spec.ts`
(`buildEmail` inclui todos os campos **e escapa HTML** do que veio do
formulário) e `index.spec.ts` (recusa do Resend registra status, `name` e `message` no
log e responde `500` com a mensagem genérica, sem repassar o erro; erro
inesperado idem, com `request_failed`; o evento também vai ao Sentry, com o
SDK substituído por mock; corpo que não é JSON responde `400` sem registrar
falha; `fetch` substituído por stub, sem rede) e
`monitoring.spec.ts` (opções de `workers/shared/monitoring.ts`: DSN do
ambiente, `SENTRY_ENVIRONMENT` com padrão `production`, tag `service`, coleta
de dado pessoal desligada, e `reportFailure`
gravando o log e enviando ao Sentry; mora na suíte do mail porque
`workers/shared` não tem suíte própria). Roda com `cd workers/mail && yarn test`.
Turnstile e Resend reais não são exercitados: dependem de rede e segredos.

### `e2e/` — smoke Playwright ✅

`playwright.config.ts` (raiz) sobe dois `webServer` (frontend `yarn dev` +
`workers/blog` com `yarn dev --remote`, que dá acesso ao R2 real em vez da
emulação local vazia) e roda `e2e/smoke.spec.ts` contra `http://localhost:5173`.
São **8 testes**, roda com `yarn test:e2e`: um por página do menu
(`src/data/pages.json`, 6 no total) mais dois do formulário de contato — o
envio simulado com sucesso e o caminho de erro (campos vazios bloqueiam o
envio e o foco vai para o primeiro campo inválido).

- **Turnstile real é bloqueado e mocado** (`page.route` aborta
  `challenges.cloudflare.com` + `page.addInitScript` injeta um
  `window.turnstile` falso que "verifica" na hora): o CDN real não é
  alcançável de forma confiável neste tipo de ambiente (headless/CI) e,
  mais importante, `VITE_CONTACT_API_URL` local aponta para o Worker de
  mail de **produção** (`mail.purplecomunicacao.com.br` → Resend → Gmail
  real da Purple) — testar contra ele geraria e-mail real. O POST para esse
  host também é interceptado e respondido com um mock (`{ success: true }`),
  então o "envio simulado" nunca sai do browser.
- `e2e/tsconfig.json` (referenciado em `tsconfig.json`) dá ao smoke o mesmo
  lib DOM do app; `vitest.config.ts` exclui `e2e/**`.

### Ainda pendente ⏳

- **Smoke de render** das demais páginas (Sobre, Abordagem, Contato, Blog) —
  Home e Serviços ✅.
- **Paginação numerada da busca do blog** não foi exercitada pelo smoke nem
  pela auditoria de 2026-07-09 (ver `UX_REVIEW.md`): o R2 real só tem 4
  posts hoje, abaixo do tamanho de página — cenário sem conteúdo suficiente
  para forçar a paginação a aparecer.

## Right-size (importante)

É um site institucional de **poucas páginas**, não um produto. **Não buscar
cobertura alta.** Testar comportamento que quebraria silenciosamente; deixar o
resto para type-check + lint + revisão visual.

## O que vale testar (prioridade)

1. **Lógica pura — alto valor, fácil:**
   - ✅ `workers/blog` (parsing + rotas/cache/CORS) e `workers/mail` (validação
     - template) — suítes próprias, ver acima.
   - ✅ `useBlogData` / `useBlogCache`: SWR, invalidação por stamp, degradação sem rede/IndexedDB.
   - ✅ `useBlog`: filtro por categoria/busca, paginação, `clearFilters`.
   - ✅ `useMail`: envio, erro da API, timeout, `reset`.
   - ✅ `useContactForm`: validação por campo, formulário válido, `clearForm`.
2. **Smoke de render:** ✅ Home e Serviços · ⏳ demais páginas.
3. ✅ **Integridade do conteúdo publicado** (sem placeholder, sem preço, ícones válidos).
4. ✅ **Consentimento LGPD:** store + banner `CookieConsent`.

**Não** testar: snapshot de copy (o texto muda sem ser bug), detalhes
visuais/pixel. (`scripts/color-audit.mjs` é um relatório de proporção de
cor, não um teste com assertions — não roda em `yarn test`/CI; ver
`DESIGN_SYSTEM.md`.)

## Ferramentas ✅

- **Playwright** (`@playwright/test`) — smoke e2e em `e2e/`, ver seção acima.
  Binário do Chromium não vem pré-instalado no ambiente; `npx playwright
install chromium` antes do primeiro `yarn test:e2e`.

## Convenções ✅

- Co-localizar em `__tests__/` (já excluído do build app); nome `*.spec.ts`.
- Descrições em pt-BR descrevendo **comportamento**, não implementação.
- Comentários em `__tests__/` e `e2e/` têm bypass da regra de inglês do
  [`CONVENTIONS`](CONVENTIONS.md#idioma-) — podem ser em português,
  acompanhando o estilo Given/When/Then das descrições acima.

## Estilo BDD (Given / When / Then)

Descrever **comportamento**, não implementação. Exemplos no formato-alvo:

```
Funcionalidade: Busca no blog
  Cenário: filtrar por termo no título
    Dado uma lista de posts carregada de useBlogData
    Quando o visitante digita um termo que casa com um título
    Então só os posts correspondentes aparecem
    E a paginação reinicia na página 1

Funcionalidade: Oferta publicada
  Cenário: página de Serviços sem preços
    Dado o catálogo e os planos carregados de services.json
    Quando a página de Serviços é renderizada
    Então os 3 planos aparecem com "Sob consulta"
    E nenhum valor em R$ é exibido
```

Mantém-se o princípio dos docs: **não afirmar como testado o que não tem teste.**
Este arquivo é diretriz; vira ✅ item a item conforme os testes forem escritos.
