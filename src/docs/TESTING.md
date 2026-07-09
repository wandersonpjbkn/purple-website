# Testing & BDD — site Purple

> Estado real em **2026-07-09** + diretrizes para quando houver testes.
> Histórico de mudanças: [`CHANGELOG`](../../CHANGELOG.md). Relacionados:
> [`ARCHITECTURE`](ARCHITECTURE.md) · [`CONTENT_MODEL`](CONTENT_MODEL.md).

Status: ✅ existe no repo · ⏳ proposto (não existe ainda).

## Verdade hoje ✅/⏳

- **Runner: Vitest 3** (`vitest.config.ts` próprio, standalone) + **@vue/test-utils**
  - **jsdom**. Roda com **`yarn test`** (`vitest run`) ou `yarn test:watch`.
- **66 testes** em 13 arquivos `*.spec.ts`, co-locados em `__tests__/` (já
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

### Ainda pendente ⏳

- **Smoke de render** das demais páginas (Sobre, Abordagem, Contato, Blog) —
  Home e Serviços ✅.
- **Playwright e2e** (1 smoke navegando as 6 páginas + envio simulado).
- **Testes em `workers/mail`** — só `workers/blog` tem suíte própria hoje.

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
visuais/pixel.

## Ferramentas ⏳ (ainda não adicionadas)

- **Playwright** para 1 smoke e2e (Chromium já disponível no ambiente). Manter
  mínimo: navegar pelas 6 páginas, enviar o form em modo simulado.

## Convenções ✅

- Co-localizar em `__tests__/` (já excluído do build app); nome `*.spec.ts`.
- Descrições em pt-BR descrevendo **comportamento**, não implementação.

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
