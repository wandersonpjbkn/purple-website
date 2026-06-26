# Testing & BDD — site Purple

> Estado real em **2026-06-26** + diretrizes para quando houver testes.
> Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) · [`CONTENT_MODEL`](CONTENT_MODEL.md).

Status: ✅ existe no repo · ⏳ proposto (não existe ainda).

## Verdade hoje ✅/⏳

- **Não há test runner nem testes** no repositório ⏳. Sem `vitest`/`playwright`
  em `package.json`, sem `*.spec.ts`, sem `__tests__/`.
- O `tsconfig.app.json` já **exclui `src/**/__tests__/*`** — a convenção de pasta
  está reservada, só falta o runner.
- **Portões de qualidade que existem ✅** e devem rodar antes de subir:
  - **Type-check:** `yarn ts` (`vue-tsc --build`), também dentro de `yarn build`.
  - **Lint:** `yarn lint` (ESLint flat config + plugin Vue + Prettier).
  - **Format:** `yarn format` (Prettier).

## Right-size (importante) 

É um site institucional de **poucas páginas**, não um produto. **Não buscar
cobertura alta.** Testar comportamento que quebraria silenciosamente; deixar o
resto para type-check + lint + revisão visual. Enquanto hero e Serviços estão em
placeholder (⛔, ver [`CONTENT_MODEL`](CONTENT_MODEL.md)), **não** escrever testes
que fixem esse copy.

## O que vale testar (prioridade) ⏳

1. **Lógica pura — alto valor, fácil:**
   - `vite-plugin-blog`: `parseFrontmatter`, `markdownToHtml`, ordenação por data,
     `getPost/getPostsByAuthor/getPostsByCategory/getFeaturedPosts/getAllCategories`.
   - `useBlog`: filtro por categoria/busca, paginação, `clearFilters`.
   - `useEmailJS`: validação e o fallback "simula sucesso sem env".
   - validação do form de Contato (`validate()` em `ContactPage`).
2. **Smoke de render:** cada uma das 6 páginas monta sem erro (rota → componente).
3. **Guardas de placeholder:** garantir que hero e Serviços **renderizam
   `{{POSITIONING_HOOK}}`/`{{SERVICE_OFFER}}`** enquanto a flag de validação não
   virar — protege contra publicar copy não validado por engano.

**Não** testar: snapshot de copy em validação, detalhes visuais/pixel, o
placeholder do `BaseIcon` (muda quando vier o set SVG real).

## Ferramentas sugeridas (se/quando adicionar) ⏳

- **Vitest** + **@vue/test-utils** para unidade/componente (integra com Vite e o
  alias `@`). Ideal para a lógica pura acima.
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
