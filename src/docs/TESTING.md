# Testing & BDD — site Purple

> Estado real em **2026-06-26** + diretrizes para quando houver testes.
> Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) · [`CONTENT_MODEL`](CONTENT_MODEL.md).

Status: ✅ existe no repo · ⏳ proposto (não existe ainda).

## Verdade hoje ✅/⏳

- **Runner: Vitest 3** (`vitest.config.ts` próprio, standalone) + **@vue/test-utils**
  - **jsdom**. Roda com **`yarn test`** (`vitest run`) ou `yarn test:watch`.
- **31 testes** em 6 arquivos `*.spec.ts`, co-locados em `__tests__/` (já
  excluídos do build app pelo `tsconfig.app.json`).
- **Portões de qualidade ✅** (rodar antes de subir):
  - **Testes:** `yarn test`.
  - **Type-check:** `yarn ts` (`vue-tsc --build`), também dentro de `yarn build`.
  - **Lint:** `yarn lint` · **Format:** `yarn format`.
- Nota: ao fim de `yarn test` aparece _"something prevents Vite server from
  exiting"_ — aviso **benigno** do Vitest (saída 0, testes passam).

### Coberto hoje ✅

| Arquivo                                      | O que valida                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `plugins/__tests__/vite-plugin-blog.spec.ts` | `slugify`, `parseFrontmatter`, `markdownToHtml`, `countWords`          |
| `composables/__tests__/useBlog.spec.ts`      | filtro por termo/categoria, paginação, clamp de página, `clearFilters` |
| `composables/__tests__/useEmailJS.spec.ts`   | fallback "simula sucesso" sem env; erro sem SDK; envio com SDK         |
| `content/__tests__/placeholders.spec.ts`     | **guarda de placeholder** (hero/oferta não publicam copy final)        |
| `stores/__tests__/consent.spec.ts`           | transições do consentimento LGPD + getters                             |
| `components/__tests__/CookieConsent.spec.ts` | banner aparece/oculta; aceitar/recusar                                 |

> Para tornar os helpers do blog testáveis, `vite-plugin-blog.ts` passou a
> **exportar** `parseFrontmatter/slugify/markdownToHtml/countWords` (sem mudança
> de comportamento).

### Ainda pendente ⏳

- **Validação do form de Contato** via mount do `ContactPage` (hoje a lógica
  `validate()` é interna ao componente).
- **Smoke de render** das 6 páginas (rota → componente monta sem erro).
- **Playwright e2e** (1 smoke navegando as 6 páginas + envio simulado).

## Right-size (importante)

É um site institucional de **poucas páginas**, não um produto. **Não buscar
cobertura alta.** Testar comportamento que quebraria silenciosamente; deixar o
resto para type-check + lint + revisão visual. Enquanto hero e Serviços estão em
placeholder (⛔, ver [`CONTENT_MODEL`](CONTENT_MODEL.md)), **não** escrever testes
que fixem esse copy.

## O que vale testar (prioridade) ⏳

1. **Lógica pura — alto valor, fácil:**
   - ✅ `vite-plugin-blog`: `parseFrontmatter`, `markdownToHtml`, `slugify`, `countWords`.
   - ✅ `useBlog`: filtro por categoria/busca, paginação, `clearFilters`.
   - ✅ `useEmailJS`: fallback "simula sucesso sem env" + erro/envio com SDK.
   - ⏳ validação do form de Contato (`validate()` em `ContactPage`).
2. ⏳ **Smoke de render:** cada uma das 6 páginas monta sem erro (rota → componente).
3. ✅ **Guardas de placeholder:** hero e Serviços só renderizam
   `{{POSITIONING_HOOK}}`/`{{SERVICE_OFFER}}` enquanto não validados.
4. ✅ **Consentimento LGPD:** store + banner `CookieConsent`.

**Não** testar: snapshot de copy em validação, detalhes visuais/pixel, o
placeholder do `BaseIcon` (muda quando vier o set SVG real).

## Ferramentas ⏳ (ainda não adicionadas)

- **Playwright** para 1 smoke e2e (Chromium já disponível no ambiente). Manter
  mínimo: navegar pelas 6 páginas, enviar o form em modo simulado.

## Convenções propostas ⏳

- Co-localizar em `__tests__/` (já excluído do build app); nome `*.spec.ts`.
- Script `test` em `package.json` quando o runner entrar.

## Estilo BDD (Given / When / Then)

Descrever **comportamento**, não implementação. Exemplos no formato-alvo:

```
Funcionalidade: Busca no blog
  Cenário: filtrar por termo no título
    Dado uma lista de posts carregada de virtual:blog-posts
    Quando o visitante digita um termo que casa com um título
    Então só os posts correspondentes aparecem
    E a paginação reinicia na página 1

Funcionalidade: Form de contato
  Cenário: campos obrigatórios vazios
    Dado o formulário de contato aberto
    Quando o visitante envia sem nome/e-mail/assunto/mensagem
    Então cada campo inválido mostra sua mensagem de erro
    E nenhum envio é disparado

Funcionalidade: Conteúdo em validação
  Cenário: hero não publica copy não validado
    Dado que o posicionamento ainda está em placeholders.ts
    Quando a Home é renderizada
    Então o hero exibe {{POSITIONING_HOOK}}, não copy final
```

Mantém-se o princípio dos docs: **não afirmar como testado o que não tem teste.**
Este arquivo é diretriz; vira ✅ item a item conforme os testes forem escritos.
