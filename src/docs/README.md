# Docs — Purple Comunicação (site institucional)

Documentação viva do projeto do site da Purple. Mesma prática dos `/docs`
orientados a agentes de IA: cada arquivo descreve **o que é verdade hoje**,
separando o que está **decidido** do que ainda é **hipótese**.

## Mapa de documentos

**Estratégia** (vêm da reflexão):

- [`PRODUCT_VISION.md`](PRODUCT_VISION.md) — quem é a Purple, quem é o cliente, território de atuação
- [`POSITIONING.md`](POSITIONING.md) — a hipótese de posicionamento (a cunha), os slots reservados e como se validam
- [`PROJECT_STATE.md`](PROJECT_STATE.md) — decisões tomadas, perguntas em aberto, o que está em andamento

**Técnicos** (gerados lendo o repositório real — a verdade técnica mora no código):

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — stack, pastas, camadas, blog via Vite plugin, build e deploy
- [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) — tokens reais, componentes Base/Ui, BEM e os placeholders
- [`CONTENT_MODEL.md`](CONTENT_MODEL.md) — `site.json`, as 6 páginas/IA, e a regra de placeholders
- [`TESTING.md`](TESTING.md) — estado dos testes hoje + diretrizes BDD (right-sized)

## Convenção de status

✅ decidido / validado · 🟡 hipótese forte (não validada) · 🔬 em validação (discovery) · ⏳ pendente · ⛔ bloqueado (de propósito)

## Princípio (o que separa estes docs dos técnicos)

A verdade mora onde o trabalho aconteceu. Estratégia e visão vêm da reflexão
(estes arquivos). Detalhe técnico vem do código (gerado observando o repo).
**Nunca documentar como fato técnico o que não foi observado no código** — doc
de agente fabricado é pior que doc ausente, porque o agente confia nele.
