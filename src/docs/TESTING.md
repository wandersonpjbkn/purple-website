# Testes — site Purple

Política de testes e o que só se faz à mão. O que cada suíte cobre se lê nos
próprios `*.spec.ts`; os comandos estão no `package.json` da raiz e de cada
Worker.

## Right-size (importante)

É um site institucional de **poucas páginas**, não um produto. **Não buscar
cobertura alta.** Testar comportamento que quebraria silenciosamente; deixar o
resto para type-check, lint e revisão visual.

## O que vale testar

1. **Lógica pura:** parsing e rotas dos Workers, composables com regra
   (cache do blog, busca, envio e validação do formulário).
2. **Smoke de render** das páginas.
3. **Integridade do conteúdo publicado:** sem placeholder, sem preço, ícones
   válidos, todo número com fonte, toda rota citada pelos dados existindo.
4. **Consentimento (LGPD):** store e aviso de cookies.
5. **Invariante que hoje só existe em texto:** se uma regra de doc pode ser
   verificada por máquina, ela vira teste ou lint em vez de frase.

**Não** testar: snapshot de copy (o texto muda sem ser bug) nem detalhe
visual. `yarn color-audit` é um relatório de proporção de cor, não um teste.

## Suítes

- **Raiz:** Vitest + `@vue/test-utils` + jsdom (`yarn test`). Os Workers ficam
  fora do `vitest.config.ts` da raiz: cada um roda a própria suíte
  (`cd workers/<nome> && yarn test`).
- **e2e:** Playwright (`yarn test:e2e`) sobe o front e o Worker do blog com o
  R2 real. Antes do primeiro uso: `npx playwright install chromium`.
- **`workers/shared`** não tem suíte própria; seus testes moram na suíte do
  mail.
- Ao fim de `yarn test` aparece _"something prevents Vite server from
  exiting"_: aviso benigno do Vitest (saída 0).

## Decisões que os testes não mostram

- **O e2e nunca envia e-mail.** O `VITE_CONTACT_API_URL` local aponta para o
  Worker de mail de **produção**, então o smoke bloqueia o Turnstile real,
  injeta um `window.turnstile` falso e intercepta o `POST` com uma resposta
  simulada.
- **Turnstile e Resend reais não são exercitados** nas suítes dos Workers:
  dependem de rede e segredos; o `fetch` é substituído por stub e o SDK do
  Sentry por mock.
- **Smoke de página** precisa do router com as rotas reais (memória) e de
  `createHead()` em `global.plugins`, porque `usePageMeta` usa `useRoute` e
  `useSeoMeta`.

## O que se confere à mão

**Regressão de conteúdo publicado.** Ao mexer no parser do blog
(`workers/blog/src/markdown.ts`), comparar o HTML de todos os posts do R2
antes × depois (HEAD × working tree) e explicar cada diferença.

**Reescrita real das páginas `/blog/*`.** O `HTMLRewriter` só existe no
runtime do Workers; nos testes ele é um fake. Para conferir como um cliente
sem JS recebe o post:

1. Em `workers/blog`, para cada post:
   `yarn wrangler r2 object put purple-comunica/posts/<slug>.md --file <md> --local`.
2. `cd workers/blog && yarn wrangler dev --local --var SITE_ORIGIN:http://localhost:4181 --var CDN_URL:<cdn>`.
3. Na raiz, `VITE_POSTS_API_URL=http://localhost:8787 yarn build:static` e
   servir `dist/` na porta 4181 (ex.: `python3 -m http.server 4181` dentro de
   `dist/`).
4. `curl -A 'facebookexternalhit/1.1' http://localhost:8787/blog/<slug>` e
   conferir `<title>`, `og:title` e `og:image` (e 404 para slug inexistente).

## Convenções

- Co-localizar em `__tests__/`; nome `*.spec.ts`.
- Descrições em pt-BR descrevendo **comportamento**, não implementação, no
  estilo Given/When/Then:

```
Funcionalidade: Oferta publicada
  Cenário: página de Serviços sem preços
    Dado o catálogo e os planos carregados de services.json
    Quando a página de Serviços é renderizada
    Então os planos aparecem com "Sob consulta"
    E nenhum valor em R$ é exibido
```

- Comentários em `__tests__/` e `e2e/` podem ser em português (bypass da regra
  de idioma em [`CONVENTIONS`](CONVENTIONS.md#idioma-)).
- **Não afirmar como testado o que não tem teste.**
