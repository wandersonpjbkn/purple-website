# Testing & BDD — site Purple

> Estado real em **2026-07-09** + diretrizes para quando houver testes.
> Histórico de mudanças: [`CHANGELOG`](../../CHANGELOG.md). Relacionados:
> [`ARCHITECTURE`](ARCHITECTURE.md) · [`CONTENT_MODEL`](CONTENT_MODEL.md).

Status: ✅ existe no repo · ⏳ proposto (não existe ainda).

## Verdade hoje ✅/⏳

- **Runner: Vitest 3** (`vitest.config.ts` próprio, standalone) + **@vue/test-utils**
  - **jsdom**. Roda com **`yarn test`** (`vitest run`) ou `yarn test:watch`.
- **95 testes** em 19 arquivos `*.spec.ts`, co-locados em `__tests__/` (já
  excluídos do build app pelo `tsconfig.app.json`). `workers/**` é excluído do
  `vitest.config.ts` da raiz — cada Worker roda sua própria suíte (ver abaixo).
- **fake-indexeddb** (devDependency) fornece um IndexedDB em memória para os
  testes de `useBlogCache` — o runtime continua sem dependência nova.
- **Portões de qualidade ✅** (rodar antes de subir):
  - **Testes:** `yarn test`.
  - **Type-check:** `yarn ts` (`vue-tsc --build`), também dentro de `yarn build`.
  - **Lint:** `yarn lint` · **Format:** `yarn format`.
- Nota: ao fim de `yarn test` aparece _"something prevents Vite server from
  exiting"_ — aviso **benigno** do Vitest (saída 0, testes passam).

### Coberto hoje ✅

| Arquivo                                            | O que valida                                                                                                                                                                                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `composables/__tests__/useBlog.spec.ts`            | filtro por termo/categoria, paginação, clamp de página, `clearFilters` — `useBlogData` mockado (`vi.mock`) com fixture própria, sem depender de rede                                                              |
| `composables/__tests__/useBlogData.spec.ts`        | SWR do índice: cache hit serve e revalida, miss vai à rede, falha de rede não lança (mantém cache/vazio), dedupe de chamadas concorrentes, categorias contadas; `getPost` por stamp, 404 → null, stale em offline |
| `composables/__tests__/useBlogCache.spec.ts`       | round-trip índice/post no IndexedDB (`fake-indexeddb`); degrada para `null`/no-op sem IndexedDB                                                                                                                   |
| `composables/__tests__/useTypewriter.spec.ts`      | digitação letra a letra, pausa fora da viewport/aba oculta e retomada sem reset, `prefers-reduced-motion`, cleanup no unmount                                                                                     |
| `components/blog/__tests__/CategoryFilter.spec.ts` | Todos + quick pills limitadas, dropdown com todas as categorias (`aria-expanded`), emissão de seleção, Escape fecha devolvendo foco, categoria ativa refletida no trigger                                         |
| `composables/__tests__/useMail.spec.ts`            | envio com sucesso; erro quando a API responde `success: false`; timeout (`AbortController`); `reset`                                                                                                              |
| `composables/__tests__/useContactForm.spec.ts`     | validação por campo (nome, e-mail, assunto, mensagem ≥ 10 chars), formulário válido sem erros, `clearForm`                                                                                                        |
| `data/__tests__/services.spec.ts`                  | **integridade do conteúdo publicado**: sem `{{...}}`, sem preços (`R$`), catálogo 7 completo, 3 planos "Sob consulta", ícones referenciados existem em `icons.ts`, hero com `source`                              |
| `components/ui/__tests__/BaseIcon.spec.ts`         | paths reais por `name`, glifo de marca preenchido, fallback p/ nome desconhecido, aria (`label`)                                                                                                                  |
| `pages/__tests__/HomePage.spec.ts`                 | smoke de render: hero validado (stats valor+sinal, card, tags), teaser 4+1 featured                                                                                                                               |
| `pages/__tests__/ServicesPage.spec.ts`             | smoke de render: catálogo com âncoras, 3 `package-card` sem preço, projetos                                                                                                                                       |
| `data/__tests__/footer.spec.ts`                    | tópicos do rodapé apontam para `id` real de `services.catalog`, sem destino repetido                                                                                                                              |
| `scripts/__tests__/render-routes.spec.ts`          | `render.yaml` tem um rewrite por rota de `ROUTES` (`scripts/shared.mjs`) e mantém a catch-all de SPA por último — sem isso a catch-all engole as rotas e anula o prerender (ver `ARCHITECTURE.md`)                |
| `stores/__tests__/consent.spec.ts`                 | transições do consentimento LGPD + getters                                                                                                                                                                        |
| `components/__tests__/CookieConsent.spec.ts`       | banner aparece/oculta; aceitar/recusar                                                                                                                                                                            |

> Padrão dos smokes de página: `createRouter(createMemoryHistory, rotas reais)` +
> `createHead()` de `@unhead/vue/client` em `global.plugins` — necessários porque
> `usePageMeta` usa `useRoute` + `useSeoMeta`.

### `workers/blog` — suíte própria ✅

O parsing de markdown (`parseFrontmatter`, `slugify`, `markdownToHtml`,
`countWords`) roda no Worker, não no front-end — por isso tem sua própria
suíte, independente da raiz: `workers/blog/vitest.config.ts` (ambiente
`node`) — `index.spec.ts` (parsing), `routes.spec.ts` (rotas `/index`,
`/posts/:slug`, edge cache/ETag/304, CORS, `/deploy` com purge; R2 fake em
memória) e `security.spec.ts`, **26 testes**. Roda com
`cd workers/blog && yarn test`. `workers/mail` ainda não tem suíte própria.

### `e2e/` — smoke Playwright ✅

`playwright.config.ts` (raiz) sobe dois `webServer` (frontend `yarn dev` +
`workers/blog` com `yarn dev --remote`, que dá acesso ao R2 real em vez da
emulação local vazia) e roda `e2e/smoke.spec.ts` contra `http://localhost:5173`.
Cobre exatamente o escopo previsto: navega as 6 páginas do menu (`src/data/pages.json`)
e faz um envio simulado do formulário de contato — **8 testes**, roda com
`yarn test:e2e`.

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
  lib DOM do app; `vitest.config.ts` já excluía `e2e/**` desde antes.

### Ainda pendente ⏳

- **Smoke de render** das demais páginas (Sobre, Abordagem, Contato, Blog) —
  Home e Serviços ✅.
- **Testes em `workers/mail`** — só `workers/blog` tem suíte própria hoje.
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
   - ✅ `workers/blog` (parsing + rotas/cache/CORS) — suíte própria, ver acima.
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
