# Testing & BDD — site Purple

> Estado real em **2026-07-06** + diretrizes para quando houver testes.
> Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) · [`CONTENT_MODEL`](CONTENT_MODEL.md).

Status: ✅ existe no repo · ⏳ proposto (não existe ainda).

## Verdade hoje ✅/⏳

- **Runner: Vitest 3** (`vitest.config.ts` próprio, standalone) + **@vue/test-utils**
  - **jsdom**. Roda com **`yarn test`** (`vitest run`) ou `yarn test:watch`.
- **43 testes** em 9 arquivos `*.spec.ts`, co-locados em `__tests__/` (já
  excluídos do build app pelo `tsconfig.app.json`).
- **Portões de qualidade ✅** (rodar antes de subir):
  - **Testes:** `yarn test`.
  - **Type-check:** `yarn ts` (`vue-tsc --build`), também dentro de `yarn build`.
  - **Lint:** `yarn lint` · **Format:** `yarn format`.
- Nota: ao fim de `yarn test` aparece _"something prevents Vite server from
  exiting"_ — aviso **benigno** do Vitest (saída 0, testes passam).

### Coberto hoje ✅

| Arquivo                                      | O que valida                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `plugins/__tests__/vite-plugin-blog.spec.ts` | `slugify`, `parseFrontmatter`, `markdownToHtml`, `countWords`                                                                                                                        |
| `composables/__tests__/useBlog.spec.ts`      | filtro por termo/categoria, paginação, clamp de página, `clearFilters`                                                                                                               |
| `composables/__tests__/useEmailJS.spec.ts`   | fallback "simula sucesso" sem env; erro sem SDK; envio com SDK                                                                                                                       |
| `data/__tests__/services.spec.ts`            | **integridade do conteúdo publicado**: sem `{{...}}`, sem preços (`R$`), catálogo 7 completo, 3 planos "Sob consulta", ícones referenciados existem em `icons.ts`, hero com `source` |
| `components/ui/__tests__/BaseIcon.spec.ts`   | paths reais por `name`, glifo de marca preenchido, fallback p/ nome desconhecido, aria (`label`)                                                                                     |
| `pages/__tests__/HomePage.spec.ts`           | smoke de render: hero validado (stats valor+sinal, card, tags), teaser 4+1 featured                                                                                                  |
| `pages/__tests__/ServicesPage.spec.ts`       | smoke de render: catálogo com âncoras, 3 `package-card` sem preço, projetos                                                                                                          |
| `stores/__tests__/consent.spec.ts`           | transições do consentimento LGPD + getters                                                                                                                                           |
| `components/__tests__/CookieConsent.spec.ts` | banner aparece/oculta; aceitar/recusar                                                                                                                                               |

> O antigo `content/__tests__/placeholders.spec.ts` (guarda de placeholder) foi
> **removido junto com os placeholders** — seu inverso vive agora em
> `data/__tests__/services.spec.ts` (garante que copy final foi publicada, sem
> tokens nem preços).

> Padrão dos smokes de página: `createRouter(createMemoryHistory, rotas reais)` +
> `createHead()` de `@unhead/vue/client` em `global.plugins` — necessários porque
> `usePageMeta` usa `useRoute` + `useSeoMeta`.

### Ainda pendente ⏳

- **Validação do form de Contato** via mount do `ContactPage` (hoje a lógica
  `validate()` é interna ao componente).
- **Smoke de render** das demais páginas (Sobre, Abordagem, Contato, Blog) —
  Home e Serviços ✅.
- **Playwright e2e** (1 smoke navegando as 6 páginas + envio simulado).

## Right-size (importante)

É um site institucional de **poucas páginas**, não um produto. **Não buscar
cobertura alta.** Testar comportamento que quebraria silenciosamente; deixar o
resto para type-check + lint + revisão visual.

## O que vale testar (prioridade)

1. **Lógica pura — alto valor, fácil:**
   - ✅ `vite-plugin-blog`: `parseFrontmatter`, `markdownToHtml`, `slugify`, `countWords`.
   - ✅ `useBlog`: filtro por categoria/busca, paginação, `clearFilters`.
   - ✅ `useEmailJS`: fallback "simula sucesso sem env" + erro/envio com SDK.
   - ⏳ validação do form de Contato (`validate()` em `ContactPage`).
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
    Dado uma lista de posts carregada de virtual:blog-posts
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
