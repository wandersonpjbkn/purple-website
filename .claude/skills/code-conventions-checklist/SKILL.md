---
name: code-conventions-checklist
description: Checklist das convenções de código deste repositório (site Purple) — idioma, comentários (só-o-porquê, nunca histórico), BaseButton único, tokens antes de valor cru, BEM, ícones via BaseIcon, posse de estilo (scoped/:deep()), DRY, SOLID aplicado a composables/componentes, código morto, viés cognitivo, barrel de composables, rotas por nome, e onde registrar cada tipo de informação (doc de domínio vs CHANGELOG vs UX_REVIEW vs comentário). Use PROATIVAMENTE ao escrever ou revisar qualquer código Vue/TS/SCSS neste repositório, antes de considerar a mudança pronta — fonte completa em src/docs/CONVENTIONS.md.
---

# Checklist de convenções — site Purple

Fonte completa e canônica: [`CONVENTIONS.md`](../../../src/docs/CONVENTIONS.md).
Este checklist não substitui a leitura da doc — é o "rodar antes de
considerar pronto", pra não depender de lembrar tudo de memória a cada
sessão nova.

## Idioma

- [ ] Código, comentários, nomes, mensagens de commit: inglês.
- [ ] Conteúdo (copy do site, valores em `src/data/*.json`, posts, esta
      documentação): português.
- [ ] Exceção: comentários em `__tests__/` e `e2e/` podem ser pt-BR
      (acompanhando o estilo Given/When/Then das descrições de teste).

## Comentários — o mais fácil de infringir

- [ ] Comenta o **porquê** (decisão não óbvia, armadilha), nunca o **quê**
      (código legível já diz o quê).
- [ ] Nunca narra o passado ("antes fazia X", "foi corrigido de Y para Z",
      "mudou porque...") — isso é `CHANGELOG.md`, não comentário de código.
- [ ] Exceção única e permanente: viés cognitivo usado deliberadamente numa
      decisão de UI carrega **exatamente 1** comentário permanente
      declarando qual viés e onde — esse nunca é removido, nem em refino
      futuro.

## Onde registrar o quê

- [ ] Estado atual / como o sistema funciona hoje → `src/docs/*.md` (a doc
      de domínio certa — `ARCHITECTURE`, `CONTENT_MODEL`, etc.).
- [ ] Histórico de decisões/mudanças já concluídas → `CHANGELOG.md` — doc de
      domínio nenhuma narra isso.
- [ ] Achado de heurística/lei de UX, exceção, decisão de produto sobre UI →
      `UX_REVIEW.md`, não citado inline no código.
- [ ] Decisão não óbvia que precisa sobreviver junto ao código → comentário
      (regra "Comentários" acima).

## Vue / UI

- [ ] CTA com peso de marca (`variant: primary | secondary | ghost | lime`)
      sempre via `BaseButton` — nunca `class="button primary"` à mão.
      Controle estrutural sem variante de marca (paginação, trigger de
      accordion, seletor de card, menu) é `<button>` com estilo próprio —
      não precisa de `BaseButton` (padrão já em `BlogPagination.vue`,
      `FaqSection.vue`, `AppHeader.vue`, `CategoryFilter.vue`).
- [ ] Cor/espaçamento/tipografia vêm de `_tokens.scss` — não valor cru sem
      checar correspondência na escala primeiro.
- [ ] Classes em BEM (`bloco__elemento--modificador`).
- [ ] Ícones via `BaseIcon` — nunca emoji ou glifo tipográfico (`→ ← ✕`) no
      markup.

## Posse de estilo (SCSS)

- [ ] Estilo de um componente mora nele (`<style scoped>`); `:deep()` só
      cirúrgico, ancorado ao próprio container, nunca um seletor largo que
      alcance componente aninhado.
- [ ] `src/styles/*` só para o que é genuinamente global (reset, tokens,
      layout, primitivos compartilhados) — não o estilo de um componente
      único.
- [ ] Página estiliza suas próprias classes/layout; nunca reestiliza o
      interno de outro componente.

## DRY

- [ ] CSS repetido e quase idêntico em mais de um lugar → utilitário/classe
      compartilhada num partial global apropriado.
- [ ] Markup repetido → componente, com o estilo co-localizado nele.
- [ ] Variação de uso único ou com estrutura diferente **não** força
      abstração — DRY é para repetição real, não para unir coisas só
      parecidas.

## SOLID (sem classes — composables, componentes, props)

- [ ] **S** — lógica pura (validação, formatação, cálculo) vive num
      composable testável, não solta dentro do `<script setup>` de uma
      página.
- [ ] **O** — estender é adicionar, não editar: novo ícone = nova entrada em
      `icons.ts` (nunca mexer em `BaseIcon.vue`); novo recurso de markdown
      do blog = novo `replace` (os passes existentes não mudam).
- [ ] **L** — variantes polimórficas honram o mesmo contrato em todo call
      site (`BaseButton tag="RouterLink"` sempre recebe `to`; `tag="a"`
      sempre `href`).
- [ ] **I** — prop declarada e nunca lida/repassada é código morto, não
      interface "por via das dúvidas".
- [ ] **D** — módulo de alto nível não depende direto de detalhe de baixo
      nível (ex.: `useMail` isola o `fetch()`; `useTurnstile` isola
      `window.turnstile`) — **não vale** para `src/data/*.json`: essa é a
      fonte única de conteúdo por decisão arquitetural, não um detalhe de
      baixo nível a inverter.

## Código morto

- [ ] Código, dado ou trecho de doc sem uso é removido ao ser encontrado —
      só permanece com um comentário explícito (`// keep: ...`) justificando
      por quê.

## Composables

- [ ] Todo composable é reexportado por `src/composables/index.ts`; código
      de aplicação importa sempre de `@/composables`, nunca por caminho
      direto — exceção: o teste unitário do próprio composable.

## Roteamento e listas de navegação

- [ ] Listas de menu/rodapé referenciam rota por **nome** (`routeName`),
      nunca `path` hardcoded fora de `router/modules/*`.
- [ ] Repetição de markup para item de lista usa `v-for` sobre uma única
      fonte de dados — não declarações repetidas por item.
