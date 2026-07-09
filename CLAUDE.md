# CLAUDE.md

Instruções para o Claude Code neste repositório.

## Documentação como fonte de verdade

Antes de inspecionar código, propor um plano ou implementar qualquer mudança,
leia **sempre** a documentação em [`src/docs/*.md`](src/docs/):

- `ARCHITECTURE.md`
- `CONTENT_MODEL.md`
- `CONVENTIONS.md`
- `DESIGN_SYSTEM.md`
- `IMAGES.md`
- `POSITIONING.md`
- `PRODUCT_VISION.md`
- `PROJECT_STATE.md`
- `README.md`
- `TESTING.md`
- `UX_REVIEW.md`

O que estiver determinado nesses documentos deve ser tratado como **guideline
inflingível** — a fonte de verdade do projeto tem prioridade sobre convenções
genéricas, preferências de estilo do modelo ou padrões inferidos apenas pela
leitura do código.

## Quando o código diverge da documentação

Se, durante a inspeção do código ou a elaboração de um plano, você notar que o
estado atual do código **diverge** do que está descrito nessas docs, informe
isso **explicitamente no plano** (ou na resposta, se não houver plano formal).
Não corrija silenciosamente nem ignore a divergência — torne-a visível para
que o usuário decida como proceder.

## As docs também evoluem

Apesar de serem a fonte de verdade, os documentos em `src/docs/` não são
estáticos: eles evoluem junto com o projeto. Quando uma tarefa exigir mudança
de comportamento, arquitetura, convenção ou conteúdo que já está documentado,
atualize o documento correspondente como parte da tarefa, mantendo a
documentação sempre alinhada com a realidade do código.
