---
name: double-diamond-delivery
description: Processo obrigatório de trabalho neste repositório (site Purple) — leitura de src/docs/*.md e, para mudanças substantivas, o ciclo Double Diamond (discovery/define/develop/deliver) com checklist de testes, docs, contraste, acessibilidade, leis de UX e heurísticas de Nielsen. Use PROATIVAMENTE em toda solicitação feita neste repositório, antes de inspecionar código, propor plano ou implementar qualquer coisa — independente da superfície (extensão, terminal, web).
---

# Processo de entrega — site Purple

Este processo é mandatório para este repositório. Ele existe porque pedir a
mesma coisa a cada prompt não escala — a instrução mora aqui, não na memória
da conversa.

**Skills companheiras** (invocadas pelas fases Develop/Deliver abaixo, não
duplicadas aqui): [`code-conventions-checklist`](../code-conventions-checklist/SKILL.md)
(de `CONVENTIONS.md`), [`design-system-checklist`](../design-system-checklist/SKILL.md)
(de `DESIGN_SYSTEM.md`), [`testing-checklist`](../testing-checklist/SKILL.md)
(de `TESTING.md`). Cada uma é o checklist acionável extraído da doc
correspondente — a doc continua sendo a fonte de verdade, a skill só evita
ter que reconstruir o checklist de memória a cada sessão.

## 0. Sempre, sem exceção: ler `src/docs/*.md`

Antes de qualquer inspeção de código, plano ou implementação, leia **toda**
a documentação em [`src/docs/`](../../../src/docs/) (`ARCHITECTURE.md`,
`CONTENT_MODEL.md`, `CONVENTIONS.md`, `DESIGN_SYSTEM.md`, `IMAGES.md`,
`POSITIONING.md`, `PRODUCT_VISION.md`, `PROJECT_STATE.md`, `README.md`,
`TESTING.md`, `UX_REVIEW.md`). Isso vale para **toda** solicitação neste
repositório — mudança trivial ou não, extensão/CLI/web, não importa.

## 1. Escolher o nível de rigor

Antes de seguir, classifique a tarefa — essa calibração foi validada
explicitamente com o dono do produto (2026-08-16), não é um atalho inventado:

- **Mecânica/trivial** (typo, ajuste de config, dependência, bug óbvio de
  causa raiz clara e uma linha): pula a pesquisa online do Discovery abaixo,
  mas passa pelas fases 2 (Define, pode ser breve) e 4 (Deliver) — nunca pula
  Deliver.
- **Substantiva** (feature nova, decisão de UX/produto/arquitetura, qualquer
  coisa que muda comportamento visível/interativo ou conteúdo público):
  Double Diamond completo, as 4 fases abaixo, sem atalho.

Na dúvida entre as duas, trate como substantiva.

## 2. Discovery

- Ler `src/docs/*.md` (já feito no passo 0).
- Auditar o estado atual do código relevante à tarefa.
- Para tarefas substantivas: pesquisar online (WebSearch/WebFetch) mercado,
  concorrência e boas práticas — não decidir só do conhecimento pré-treinado
  quando a decisão é de UX/produto/design.
- Registrar (na resposta ou no plano) qualquer divergência encontrada entre
  código e docs, ou entre docs e o que a pesquisa/discovery revelou — nunca
  corrigir silenciosamente nem ignorar. Ver seção "Docs são fonte de verdade
  E evoluem" abaixo.

## 3. Define

- Propor um plano de ação concreto antes de implementar. Para qualquer coisa
  não-trivial, use `EnterPlanMode` (ferramenta já disponível) — não pule
  direto para código.
- O plano cita explicitamente qualquer divergência doc↔código encontrada no
  Discovery, para o usuário decidir como proceder.

## 4. Develop

- Implementar seguindo as skills [`code-conventions-checklist`](../code-conventions-checklist/SKILL.md)
  (idioma, comentários, BEM, tokens, DRY, SOLID) e
  [`design-system-checklist`](../design-system-checklist/SKILL.md) (tokens,
  reuso de componentes Base, proporção 60/30/10) — invocar as duas, não só
  ler de memória.

## 5. Deliver — checklist obrigatório

Nenhum item abaixo é pulado silenciosamente; se não se aplica à mudança,
diga explicitamente por que não se aplica.

- [ ] **Testes**: invocar [`testing-checklist`](../testing-checklist/SKILL.md);
      escrever/atualizar testes para o comportamento novo/mudado; rodar
      `yarn test`.
- [ ] **Type-check**: `yarn ts`.
- [ ] **Lint**: `yarn lint`.
- [ ] **Conformidade com as docs**: reconferir
      [`code-conventions-checklist`](../code-conventions-checklist/SKILL.md)
      e [`design-system-checklist`](../design-system-checklist/SKILL.md) —
      a entrega infringe alguma regra? As docs precisam ser atualizadas para
      refletir a nova realidade (ver "As docs também evoluem" no
      `CLAUDE.md` raiz)?
- [ ] **Contraste**: combinações de cor novas/alteradas passam WCAG AA (ver
      tokens em `DESIGN_SYSTEM.md`)?
- [ ] **Acessibilidade**: operável por teclado, `aria-*` corretos, foco não
      se perde em interações repetidas, alvos de toque ≥
      `--tap-target-min`, semântica de heading coerente.
- [ ] **Leis de UX**: Jakob, Fitts, Hick, Miller (regra já existente em
      `CONVENTIONS.md` § UX) — a UI nova/alterada as respeita?
- [ ] **Heurísticas de Nielsen** (as 10): visibilidade do status do sistema,
      correspondência com o mundo real, controle e liberdade do usuário,
      consistência e padrões, prevenção de erros, reconhecimento em vez de
      memorização, flexibilidade e eficiência, design minimalista,
      recuperação de erros, ajuda e documentação.
- [ ] Achados e exceções das duas checagens acima vão para `UX_REVIEW.md`
      (regra já existente em `CONVENTIONS.md` — não citar a heurística/lei
      inline no código, só no doc).

## Docs são fonte de verdade E evoluem

`src/docs/*.md` carrega o estado atual do projeto e deve ser seguido como
guideline inflingível — mas não é dogma incontestável. Quando o Discovery ou
o Develop revelar que uma instrução do doc não é mais a melhor prática (por
pesquisa de mercado, por um problema real encontrado, por uma decisão nova
do dono do produto), **isso precisa ser levantado explicitamente** — citar o
achado, propor a atualização do doc correspondente. Seguir a doc sem
questionar quando há evidência em contrário não é aceitável; do mesmo jeito,
ignorar ou reescrever a doc sem avisar também não é. A decisão de qual lado
vence é do usuário — o trabalho aqui é tornar o conflito visível, nunca
escondê-lo.

## Gate

Nenhuma entrega é considerada concluída sem os passos 0 (leitura das docs) e
1 (classificação de rigor) tendo acontecido, e sem o checklist do passo 5
percorrido item a item.
