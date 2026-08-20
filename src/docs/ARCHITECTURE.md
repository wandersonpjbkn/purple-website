# Architecture (as-built) — site Purple

> Verdade técnica observada no repositório em **2026-07-09**. Gerado lendo o
> código, não as intenções. Histórico de mudanças: [`CHANGELOG`](../../CHANGELOG.md).
> Estratégia mora em [`PRODUCT_VISION`](PRODUCT_VISION.md) ·
> [`POSITIONING`](POSITIONING.md) · [`PROJECT_STATE`](PROJECT_STATE.md).
> Conteúdo: [`CONTENT_MODEL`](CONTENT_MODEL.md) · UI: [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md) ·
> testes: [`TESTING`](TESTING.md).

Status: ✅ no código · 🟡 presente mas não ativo/coerente · ⏳ ausente (intenção, não fato).

## Stack ✅

- **Vue 3.5** (SFC `<script setup lang="ts">`) + **TypeScript** (`~5.9`).
- **Vite 7** como bundler/dev server; alias `@ → ./src`.
- **vue-router 5** em `createWebHistory` (SPA, sem SSR).
- **@unhead/vue** para `<head>`/SEO.
- **Sass** (`.scss`, arquitetura 7-1) — sem CSS-in-JS, sem Tailwind.
- Node: `^20.19.0 || >=22.12.0`. Gerenciador: **Yarn 1** (`yarn.lock`).

## Estrutura de pastas ✅

```
src/
  main.ts            bootstrap (createApp + pinia + unhead + router)
  App.vue            shell: skip-link / AppHeader / <RouterView/> / AppFooter + head global
  router/index.ts    11 rotas, lazy-loaded (inclui catch-all 404)
  pages/             Home, About, Abordagem, Services, Blog, BlogPost, Author, Contact, Faq, Privacy, NotFound
  components/
    layout/          AppHeader, AppFooter, CookieConsent
    sections/        CtaBanner, FaqSection, PageHero
    ui/              BaseButton, BaseContainer, BaseIcon (+ icons.ts), BrandLogo, MediaBlock, FeaturePillar, StatCard, ServiceTeaserCard, TeamCard
    ui/avatar        BaseAvatar, AvImage, AvInitials
    blog/            PostCard, BlogPagination, CategoryFilter
  composables/       usePageMeta, useBlog, useBlogData, useBlogCache, useCdnAsset, useContact, useMail, useTurnstile, useContactForm, useWhatsapp, useCtaTracking, useTypewriter (reexport em index.ts)
  data/              team, panorama, approach, about, footer, home, services, faq, privacy, pages (.json)
  stores/            consent.ts  (Pinia + persistedstate — consentimento LGPD)
  styles/            7-1 (abstracts, base, layout, components, sections) + main.scss
  types/             team.ts, blog.ts
  docs/              esta documentação
public/              robots.txt, images/
```

## Camadas / fluxo de boot ✅

1. `main.ts` cria o app e registra: **Pinia** (`createPinia` + `pinia-plugin-persistedstate`), **unhead**, **router**.
2. `App.vue` monta o shell e define head global: `lang="pt-BR"` e **`robots: index, follow`**.
3. Páginas são componentes de rota (lazy `import()`), cada uma chama `usePageMeta(...)`.

**Pinia ✅** — registrado com `pinia-plugin-persistedstate`. Store atual:
`src/stores/consent.ts` (consentimento LGPD, persistido em localStorage).

## Roteamento ✅

11 rotas em `src/router/index.ts` (todas `() => import()`):

| path                | name        | página        |
| ------------------- | ----------- | ------------- |
| `/`                 | home        | HomePage      |
| `/sobre`            | about       | AboutPage     |
| `/abordagem`        | approach    | AbordagemPage |
| `/servicos`         | services    | ServicesPage  |
| `/blog`             | blog        | BlogPage      |
| `/blog/autor/:slug` | blog-author | AuthorPage    |
| `/blog/:slug`       | blog-post   | BlogPostPage  |
| `/contato`          | contact     | ContactPage   |
| `/faq`              | faq         | FaqPage       |
| `/privacidade`      | privacy     | PrivacyPage   |
| `/:pathMatch(.*)*`  | not-found   | NotFoundPage  |

`scrollBehavior` rola ao topo (smooth) a cada navegação (e a âncoras `#id` com offset). São **6 páginas no menu** (Home · Sobre · Abordagem · Serviços · Blog · Contato); `blog-author`/`blog-post` são detalhe; `faq`/`privacy` vivem no rodapé; a catch-all `not-found` renderiza a `NotFoundPage`.

## Blog via Cloudflare Worker + R2 ✅

O front busca os posts **em runtime**, direto do Worker (`workers/blog/src/index.ts`) —
não existe mais módulo virtual nem fetch em build-time; o bundle não carrega
post nenhum e conteúdo novo aparece sem rebuild no Render.

- **Endpoints do Worker** (base = `VITE_POSTS_API_URL`, default
  `http://localhost:8787`): `GET /index` → array de **metadados** sem `html`
  (`PostMeta[]`, ordenado por data desc); `GET /posts/:slug` → post completo
  com `html` (404 se não existir); `GET /` e `GET /posts` → array completo
  **legado** (mantido na transição, remoção futura); `POST /deploy` →
  autenticado por token, purga o cache do `/index` (PoP local) e dispara o
  hook do Render — o hook agora é **opcional**: só refresca o snapshot SEO
  prerenderizado do `/blog`, não o conteúdo.
- **Edge cache** (`caches.default`): `/index` com `Cache-Control` de 300s e
  `/posts/:slug` de 3600s, ambos com **ETag fraco** (djb2 do JSON) e resposta
  `304` para `If-None-Match`. As respostas são cacheadas **sem** headers CORS;
  `Access-Control-Allow-Origin` (+ `Access-Control-Expose-Headers: ETag`) é
  anexado por request.
- O parsing continua no Worker — **frontmatter YAML próprio** (não usa lib) e
  **markdown→HTML por regex** (tabelas GFM, code blocks, blockquotes, headings
  com `id` de âncora, listas, inline); `readTime` (≈200 wpm) e `wordCount`
  idem. A listagem do R2 pagina com cursor (suporta >1000 objetos).
- **Camada de dados no front:** `useBlogData` (singleton por módulo — Home,
  Blog, Post e Author compartilham um fetch) faz **stale-while-revalidate**
  sobre IndexedDB via `useBlogCache` (DB `purple-blog`, stores `meta` e
  `posts`): índice servido do cache na hora e revalidado em background
  (throttle de 60s + dedupe de chamadas concorrentes); posts individuais são
  buscados sob demanda por slug e considerados frescos quando o `stamp`
  gravado bate com o ETag do índice atual. Sem IndexedDB (Safari privado),
  degrada para network-only. Tipos em `src/types/blog.ts`.
- **Falha de rede é silenciosa por design (agora em runtime):** o estado
  mantém o cache (ou lista vazia) com um `console.error`. `BlogPage.vue`
  mostra skeleton enquanto o índice carrega e a mensagem de "não foi possível
  carregar" só depois de `isReady`; `BlogPostPage.vue` tem estados
  `loading | ready | not-found` — o 404 nunca pisca durante a carga.
- Consumido por `useBlog` (filtro/busca/paginação client-side sobre o índice),
  `BlogPage`, `BlogPostPage`, `AuthorPage`, `PostCard` **e a Home**
  (destaques via `posts.slice(0, 3)` reativo).

**Fonte única ✅** — todo o blog (inclusive os destaques da Home) lê de
`useBlogData`; não há outra fonte de posts no repositório.

## Formulário de contato ✅

Fluxo **Turnstile → Worker → Resend**, sem dependência de serviço de e-mail transacional no front:

- **`TurnstileWidget.vue`** (`components/forms/`) + **`useTurnstile`** renderizam o widget anti-spam da Cloudflare (`window.turnstile`, script carregado por CDN em `index.html`) usando `VITE_TURNSTILE_SITE_KEY`; emite `verified`/`expired`/`error` com o token do desafio.
- **`useMail`** (`composables/useMail.ts`) faz `POST` do payload (`contact`, `interest`, `metadata`, `turnstileToken`) para `VITE_CONTACT_API_URL`, com timeout de 10s via `AbortController`.
- **`workers/mail/`** — Cloudflare Worker próprio (Wrangler; não faz parte do build do site): valida origem (CORS via `ALLOWED_ORIGIN`/`ALLOWED_ORIGIN_WWW`, `workers/shared/http.ts`), valida campos obrigatórios, **revalida o token do Turnstile no servidor** (`siteverify`, com `TURNSTILE_SECRET`) e, se válido, envia o e-mail via **API do Resend** (`RESEND_API_KEY`) para `purplecomunica@gmail.com`. Deploy e secrets são geridos fora deste repo (`wrangler deploy` + `wrangler secret put`), não pelo `yarn build` do site.
- **`useContact`** (`composables/useContact.ts`) continua isolado — só dados estáticos de contato (título/subtítulo/telefone/e-mail/endereço), não tem relação com o envio.

## SEO / meta ✅

`usePageMeta` (em `composables/usePageMeta.ts`) emite `useSeoMeta` (OG/Twitter) + **JSON-LD** (WebPage/Article) + canonical, lendo `VITE_SITE_URL`.

- **`robots` tem fonte única ✅:** só o `App.vue` define `robots`, hoje **`index, follow`** (site aberto à indexação desde 2026-07-09). `usePageMeta` não emite `robots` — evita duas fontes divergentes. `public/robots.txt` permite crawling (`Allow: /`) e aponta `Sitemap: https://purplecomunicacao.com.br/sitemap.xml`. **O que é servido em produção não é só esse arquivo:** o Cloudflare injeta na frente dele um preâmbulo de _Content Signals_ (`search=yes,ai-train=no`) e um bloco de `Disallow: /` para crawlers de IA (GPTBot, ClaudeBot, CCBot, Amazonbot, Google-Extended, meta-externalagent…). Googlebot segue liberado; a decisão sobre os crawlers de IA é de negócio e mora no painel do Cloudflare, não neste repo.
- **`public/sitemap.xml` ✅:** estático, lista as 8 rotas estáticas (mesma lista de `ROUTES` em `scripts/shared.mjs`, usada pelo prerender) — copiado para `dist/` em todo build, sem depender do passo de prerender. Posts do blog (dinâmicos, servidos pelo Worker/R2) não entram no sitemap; descoberta via crawling dos links internos (`/blog` → cada post).

## Build & deploy

- **Build ✅:** `yarn build` = `vue-tsc --build` (type-check) + `vite build` → `dist/` (SPA estática). `yarn dev`, `yarn preview`, `yarn lint`, `yarn format`.
- **Prerender estático (SEO) ✅:** `yarn prerender` (`scripts/prerender.mjs`) sobe o `dist/` num Chromium headless (`playwright-core`) e grava o HTML renderizado de cada rota estática em `dist/<rota>/index.html` (Home, Sobre, Abordagem, Serviços, Contato, Blog, FAQ, Privacidade). Nas rotas `/` e `/blog`, espera **os cards** (`.post-card`) carregarem do Worker; se não vierem, recarrega a página e tenta uma segunda vez. Persistindo a falha, avisa no log (`[prerender] AVISO: …`) e **segue publicando** — mas remove do snapshot o bloco de erro do blog (`.home-blog-empty`/`.blog-empty`) antes de gravar, junto com o `overflow` travado pelo `CookieConsent`. O motivo é o mesmo nos dois casos: estado transitório de runtime não pode congelar num HTML que crawler lê como conteúdo da página. Os scripts do bundle ficam — o SPA assume no cliente e revalida os posts; crawlers recebem o conteúdo + `<title>`/meta por página. **Não** faz parte de `yarn build`: requer um Chromium (auto-detecta, ou `PRERENDER_CHROMIUM`/`npx playwright install`). `yarn build:static` = `build` + `prerender`. Posts de blog (dinâmicos) seguem client-rendered.
- **Deploy (Render) ✅ no painel / 🟡 no repo:** Static Site já existe e está conectado ao repo — **auto-deploy** a cada commit na branch e as **regras de rota** estão configurados **no painel** do Render. `render.yaml` foi adicionado como infra-as-code/documentação dessa config (Build Command, `staticPublishPath: dist`, regras de rota, chaves de `envVars` com `sync: false`); como o serviço foi criado manualmente (não via Blueprint), o arquivo **não se aplica sozinho** — é referência, sincronizável depois se decidirem migrar para Blueprint. **Regras de rota — a catch-all sozinha não basta ⚠️:** o Render só ignora as regras quando existe um recurso no **caminho exato** pedido ("Render does not apply redirect or rewrite rules to a path if a resource exists at that path"), e não faz resolução de índice de diretório. `/blog` não é um recurso — o arquivo é `/blog/index.html` — então uma catch-all `/* → /index.html` sozinha engole **todas** as rotas e devolve a home, com o `<title>`, o `canonical` e as OG tags da home, anulando o prerender inteiro (`/blog/` com barra servia o arquivo certo; `/blog` sem barra, não). Por isso `render.yaml` declara **um rewrite por rota prerenderizada** (`/sobre → /sobre/index.html` etc.) **antes** da catch-all, que permanece por último para `/blog/:slug`, `/blog/autor/:slug` e o 404. O teste `scripts/__tests__/render-routes.spec.ts` guarda essa correspondência entre `ROUTES` e as regras do arquivo. `.node-version` (`22.22.3`) fixa a versão do Node no build (Render nem sempre respeita só o `engines` do `package.json`). Build Command passou a rodar o prerender a cada deploy: `(npx playwright-core install-deps chromium || true) && npx playwright-core install chromium && yarn build:static` — 🟡 **não validado em produção**: se o ambiente de build do Render não tiver as libs de sistema do Chromium (sem `sudo`/`apt-get` confirmado), o passo de prerender falha e derruba o build; contingência é trocar o Build Command para `yarn build` (sem prerender) até resolver.

## Consentimento LGPD + GTM ✅

Solução **autoral e local**, sem biblioteca de consentimento de terceiros:

- **Store** `src/stores/consent.ts` (Pinia + persistedstate → localStorage): uma
  categoria opcional `analytics` (`unset | accepted | rejected`); "necessário" é
  implícito.
- **Banner** `components/layout/CookieConsent.vue` — aparece enquanto a escolha é
  `unset`; **Aceitar/Recusar** via `BaseButton`. Rodapé tem "Preferências de
  cookies" (`consent.reopen()`).
- **GTM** (`@gtm-support/vue-gtm`, `createGtm`) é registrado em `main.ts` **só se
  houver `VITE_GTM_ID`**, com `enabled` partindo do consentimento já persistido.
  O pacote em si é carregado via `import()` dinâmico dentro desse `if` (não no
  topo do módulo) — sem `VITE_GTM_ID`, o código do GTM nunca é buscado nem
  entra no chunk principal. O `import()` é aguardado (`await`) antes de
  `app.mount()` porque `useGtm()` é chamado de forma síncrona em tempo de
  `setup()` (ex.: `useCtaTracking.ts`) — registrar o plugin depois do mount
  faria esse `useGtm()` capturar `undefined` para sempre. O `<script>` do GTM
  em si **só carrega após opt-in** — o banner chama `useGtm()?.enable(true/false)`.

## Instalado mas inativo (cuidado ao documentar) 🟡

- **vite-plugin-pwa** — dependência presente, **ausente** de `vite.config.ts` (não há PWA ativo).
