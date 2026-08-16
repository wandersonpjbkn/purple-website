---
name: testing-checklist
description: Checklist de testes deste repositório (site Purple) — right-size (não perseguir cobertura, é site institucional pequeno), o que vale testar por prioridade, estilo BDD Given/When/Then em pt-BR nas descrições, convenções de co-localização/nomenclatura, comandos de quality gate (yarn test/ts/lint/format). Use PROATIVAMENTE ao escrever ou revisar testes neste repositório — fonte completa em src/docs/TESTING.md.
---

# Checklist de testes — site Purple

Fonte completa: [`TESTING.md`](../../../src/docs/TESTING.md). Vitest 3 +
`@vue/test-utils` + jsdom (`yarn test`); smoke e2e via Playwright (`yarn
test:e2e`, requer `npx playwright install chromium` na primeira vez).

## Antes de escrever um teste

- [ ] **Right-size**: é site institucional de poucas páginas, não produto —
      não perseguir cobertura alta. Testar o que quebraria **silenciosamente**;
      o resto fica para type-check + lint + revisão visual.
- [ ] Prioridade, nesta ordem: 1) lógica pura em composable (alto valor,
      fácil), 2) smoke de render de página, 3) integridade do conteúdo
      publicado (sem placeholder tipo `{{...}}`, sem preço em R$, ícones
      referenciados existem em `icons.ts`), 4) consentimento LGPD
      (store + banner).
- [ ] **Não testar**: snapshot de copy (o texto muda sem ser bug), detalhe
      visual/pixel. `scripts/color-audit.mjs` é relatório de proporção de
      cor, não assertion — não roda em `yarn test`/CI.

## Forma do teste

- [ ] Co-localizado em `__tests__/` (já excluído do build do app), arquivo
      `*.spec.ts`.
- [ ] Descrição em pt-BR descrevendo **comportamento**, não implementação —
      estilo Given/When/Then.
- [ ] Comentário em `__tests__/`/`e2e/` pode ser pt-BR (bypass da regra de
      idioma de `CONVENTIONS.md`) — só quando ajuda a entender.
- [ ] Smoke de página segue o padrão: `createRouter(createMemoryHistory,
      rotas reais)` + `createHead()` de `@unhead/vue/client` em
      `global.plugins` — necessário porque `usePageMeta` usa
      `useRoute`/`useSeoMeta`.

## Antes de considerar a entrega pronta

- [ ] `yarn test` — passa.
- [ ] `yarn ts` — passa (também roda dentro de `yarn build`).
- [ ] `yarn lint` — passa.
- [ ] Componente/composable novo ou com comportamento mudado: tem teste, ou
      a ausência foi justificada explicitamente pelo critério de right-size
      acima (não por esquecimento)?
