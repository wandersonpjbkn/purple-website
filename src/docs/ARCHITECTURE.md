# Architecture (as-built) — site Purple

> Verdade técnica observada no repositório em **2026-07-06**. Gerado lendo o
> código, não as intenções. Estratégia mora em [`PRODUCT_VISION`](PRODUCT_VISION.md) ·
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
    blog/            PostCard, BlogPagination
  composables/       usePageMeta, useBlog, useCdnAsset, useContact (reexport em index.ts) · useMail, useTurnstile, useContactForm (import direto)
  data/              team, panorama, approach, about, footer, home, services, faq, privacy, pages (.json)
  stores/            consent.ts  (Pinia + persistedstate — consentimento LGPD)
  plugins/           vite-plugin-blog.ts
  styles/            7-1 (abstracts, base, layout, components, sections) + main.scss
  types/             team.ts, post.ts
  docs/              esta documentação
content/posts/       *.md  (fonte real do blog)
public/              robots.txt, images/
```

## Camadas / fluxo de boot ✅

1. `main.ts` cria o app e registra: **Pinia** (`createPinia` + `pinia-plugin-persistedstate`), **unhead**, **router**.
2. `App.vue` monta o shell e define head global: `lang="pt-BR"` e **`robots: noindex, nofollow`**.
3. Páginas são componentes de rota (lazy `import()`), cada uma chama `usePageMeta(...)`.

**Pinia ✅** — registrado com `pinia-plugin-persistedstate`. Tem **uma store**:
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

## Blog via Vite plugin ✅

`src/plugins/vite-plugin-blog.ts` expõe o módulo virtual **`virtual:blog-posts`**:

- Lê `content/posts/*.md` no `load()`; parser de **frontmatter YAML próprio** (não usa lib) e **markdown→HTML por regex** (`markdownToHtml`): tabelas GFM, code blocks, blockquotes, headings com `id` de âncora, listas, inline.
- Calcula `readTime` (≈200 wpm) e `wordCount`; ordena por data desc.
- Exporta `posts`, `getPost`, `getPostsByAuthor`, `getPostsByCategory`, `getFeaturedPosts`, `getAllCategories`.
- Tipos do módulo declarados em `src/vite-env.d.ts`.
- **HMR**: `fs.watch` em `content/posts` dispara `full-reload`.
- Consumido por `useBlog`, `BlogPage`, `BlogPostPage`, `AuthorPage`, `PostCard` **e a Home** (destaques via `posts.slice(0, 3)`).

**Fonte única ✅** — todo o blog (inclusive os destaques da Home) lê de
`virtual:blog-posts`. O stack legado (`posts.json` → `BlogList` → `BlogCard`) foi
removido; a Home renderiza `PostCard` como as demais telas.

## Formulário de contato ✅

Fluxo **Turnstile → Worker → Resend**, sem dependência de serviço de e-mail transacional no front:

- **`TurnstileWidget.vue`** (`components/forms/`) + **`useTurnstile`** renderizam o widget anti-spam da Cloudflare (`window.turnstile`, script carregado por CDN em `index.html`) usando `VITE_TURNSTILE_SITE_KEY`; emite `verified`/`expired`/`error` com o token do desafio.
- **`useMail`** (`composables/useMail.ts`) faz `POST` do payload (`contact`, `interest`, `metadata`, `turnstileToken`) para `VITE_CONTACT_API_URL`, com timeout de 10s via `AbortController`.
- **`workers/mail/`** — Cloudflare Worker próprio (Wrangler; não faz parte do build do site): valida origem (CORS via `ALLOWED_ORIGIN`/`ALLOWED_ORIGIN_WWW`), valida campos obrigatórios, **revalida o token do Turnstile no servidor** (`siteverify`, com `TURNSTILE_SECRET`) e, se válido, envia o e-mail via **API do Resend** (`RESEND_API_KEY`) para `contato@purplecomunicacao.com.br`. Deploy e secrets são geridos fora deste repo (`wrangler deploy` + `wrangler secret put`), não pelo `yarn build` do site.
- **`useContact`** (`composables/useContact.ts`) continua isolado — só dados estáticos de contato (título/subtítulo/telefone/e-mail/endereço), não tem relação com o envio.

## SEO / meta ✅

`usePageMeta` (em `composables/usePageMeta.ts`) emite `useSeoMeta` (OG/Twitter) + **JSON-LD** (WebPage/Article) + canonical, lendo `VITE_SITE_URL`.

- **`robots` tem fonte única ✅:** só o `App.vue` define `robots`, hoje **`noindex, nofollow`** (site pré-lançamento). `usePageMeta` **não** emite mais `robots` (removido para eliminar o conflito anterior). Reforçado por `public/robots.txt` (`Disallow: /`). Quando o site for ao ar, basta trocar a linha no `App.vue`.

## Build & deploy

- **Build ✅:** `yarn build` = `vue-tsc --build` (type-check) + `vite build` → `dist/` (SPA estática). `yarn dev`, `yarn preview`, `yarn lint`, `yarn format`.
- **Prerender estático (SEO) ✅:** `yarn prerender` (`scripts/prerender.mjs`) sobe o `dist/` num Chromium headless (`playwright-core`) e grava o HTML renderizado de cada rota estática em `dist/<rota>/index.html` (Home, Sobre, Abordagem, Serviços, Contato, Blog, FAQ, Privacidade). Os scripts do bundle ficam — o SPA assume no cliente; crawlers recebem o conteúdo + `<title>`/meta por página. **Não** faz parte de `yarn build`: requer um Chromium (auto-detecta, ou `PRERENDER_CHROMIUM`/`npx playwright install`). `yarn build:static` = `build` + `prerender`. Posts de blog (dinâmicos) seguem client-rendered.
- **Deploy (Render) ⏳:** alvo declarado, mas **não há infra no repo** (sem `render.yaml`/`Dockerfile`/`_redirects`). Por ser SPA com history mode, o host precisa de **rewrite `/* → /index.html`** — ainda não configurado. Para servir o prerender, o build do deploy deve rodar `build:static` (com Chromium disponível).

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
  O `<script>` do GTM **só carrega após opt-in** — o banner chama
  `useGtm()?.enable(true/false)`.

## Instalado mas inativo (cuidado ao documentar) 🟡

- **vite-plugin-pwa** — dependência presente, **ausente** de `vite.config.ts` (não há PWA ativo).
