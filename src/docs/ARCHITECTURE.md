# Architecture (as-built) — site Purple

> Verdade técnica observada no repositório em **2026-06-26**. Gerado lendo o
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
  App.vue            shell: AppHeader / <RouterView/> / AppFooter + head global
  router/index.ts    8 rotas, lazy-loaded
  pages/             Home, About, Abordagem, Services, Blog, BlogPost, Author, Contact
  components/
    layout/          AppHeader, AppFooter
    sections/        CtaBanner
    ui/              BaseButton, BaseContainer, BaseIcon, FeaturePillar, TeamCard, AuthorAvatar
    blog/            BlogList, BlogCard, PostCard, BlogPagination, BlogSidebar
  composables/       useBlog, useEmailJS, usePageMeta (reexport em index.ts)
  content/           placeholders.ts  (conteúdo em validação — ver CONTENT_MODEL)
  data/              site.json, posts.json, authors.json
  plugins/           vite-plugin-blog.ts
  styles/            7-1 (abstracts, base, layout, components, sections) + main.scss
  types/             blog.ts, post.ts, site.ts
  docs/              esta documentação
content/posts/       *.md  (fonte real do blog)
public/              robots.txt, images/
```

## Camadas / fluxo de boot ✅

1. `main.ts` cria o app e registra: **Pinia** (`createPinia` + `pinia-plugin-persistedstate`), **unhead**, **router**.
2. `App.vue` monta o shell e define head global: `lang="pt-BR"` e **`robots: noindex, nofollow`**.
3. Páginas são componentes de rota (lazy `import()`), cada uma chama `usePageMeta(...)`.

**Pinia 🟡** — registrado, porém **não há nenhuma store** em `src/`. Fica para uso futuro (decisão em [`PROJECT_STATE`](PROJECT_STATE.md)).

## Roteamento ✅

8 rotas em `src/router/index.ts` (todas `() => import()`):

| path | name | página |
|---|---|---|
| `/` | home | HomePage |
| `/sobre` | about | AboutPage |
| `/abordagem` | approach | AbordagemPage |
| `/servicos` | services | ServicesPage |
| `/blog` | blog | BlogPage |
| `/blog/autor/:slug` | blog-author | AuthorPage |
| `/blog/:slug` | blog-post | BlogPostPage |
| `/contato` | contact | ContactPage |

`scrollBehavior` rola ao topo (smooth) a cada navegação. São **6 páginas no menu** (Home · Sobre · Abordagem · Serviços · Blog · Contato); `blog-author` e `blog-post` são telas de detalhe.

## Blog via Vite plugin ✅

`src/plugins/vite-plugin-blog.ts` expõe o módulo virtual **`virtual:blog-posts`**:

- Lê `content/posts/*.md` no `load()`; parser de **frontmatter YAML próprio** (não usa lib) e **markdown→HTML por regex** (`markdownToHtml`): tabelas GFM, code blocks, blockquotes, headings com `id` de âncora, listas, inline.
- Calcula `readTime` (≈200 wpm) e `wordCount`; ordena por data desc.
- Exporta `posts`, `getPost`, `getPostsByAuthor`, `getPostsByCategory`, `getFeaturedPosts`, `getAllCategories`.
- Tipos do módulo declarados em `src/vite-env.d.ts`.
- **HMR**: `fs.watch` em `content/posts` dispara `full-reload`.
- Consumido por `useBlog`, `BlogPage`, `BlogPostPage`, `AuthorPage`, `PostCard`.

**Duplicidade de fonte 🟡** — `content/posts/` tem **4** `.md` (fonte do plugin), mas a Home importa os destaques de `src/data/posts.json` (**3** entradas, formato diferente: `id`/`content`). As duas fontes podem divergir. Convém unificar a Home no `virtual:blog-posts` — ver pendência em [`PROJECT_STATE`](PROJECT_STATE.md).

## Formulário de contato ✅

`useEmailJS` usa o `window.emailjs` carregado por **CDN** em `index.html` (não é dependência npm). Lê `VITE_EMAILJS_SERVICE_ID`/`TEMPLATE_ID`. Sem env, **simula sucesso** (1s) para não travar dev. A `publicKey` está como `'SUA_PUBLIC_KEY'` placeholder no `index.html` ⏳.

## SEO / meta ✅ (com conflito 🟡)

`usePageMeta` (em `composables/usePageMeta.ts`) emite `useSeoMeta` (OG/Twitter) + **JSON-LD** (WebPage/Article) + canonical, lendo `VITE_SITE_URL`.

- **Conflito de `robots`:** `App.vue` define global **`noindex, nofollow`**, enquanto `usePageMeta` emite `index, follow` por página (nenhuma passa `noIndex`). O resultado depende da ordem de merge do unhead — **não documentar como indexável**. Alinhado à decisão de não publicar ainda, `public/robots.txt` faz `Disallow: /`.

## Build & deploy

- **Build ✅:** `yarn build` = `vue-tsc --build` (type-check) + `vite build` → `dist/` (SPA estática). `yarn dev`, `yarn preview`, `yarn lint`, `yarn format`.
- **Deploy (Render) ⏳:** alvo declarado, mas **não há infra no repo** (sem `render.yaml`/`Dockerfile`/`_redirects`). Por ser SPA com history mode, o host precisa de **rewrite `/* → /index.html`** — ainda não configurado aqui.

## Instalado mas inativo (cuidado ao documentar) 🟡

- **vite-plugin-pwa** — dependência presente, **ausente** de `vite.config.ts` (não há PWA ativo).
- **@gtm-support/vue-gtm** — importado e **comentado** em `main.ts`; entra junto do consentimento LGPD (Grupo 7, ver [`PROJECT_STATE`](PROJECT_STATE.md)).
- **Pinia / persistedstate** — registrados, sem store.
- `src/types/site.ts` — **não é importado** por ninguém (tipo morto; `site.json` não é tipado por ele).
