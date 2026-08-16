# CLAUDE.md

Instruções para o Claude Code neste repositório. Valem para **toda**
solicitação feita aqui, sem exceção — independente da superfície (extensão,
terminal ou web).

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

Isso também vale ao contrário: se a pesquisa, a implementação ou um achado
novo mostrar que uma instrução do doc não é mais a melhor prática, **levante
isso explicitamente** — cite o achado, proponha a atualização. Seguir uma
instrução do doc sem questionar quando há evidência em contrário não é
aceitável; a fonte de verdade tem prioridade sobre preferência genérica, mas
não é dogma incontestável diante de evidência nova. A decisão de qual lado
vence é do usuário — o trabalho é tornar o conflito visível, nunca escondê-lo
(nem seguindo cego, nem corrigindo por conta própria sem avisar).

## Processo de entrega

Toda mudança substantiva (feature nova, decisão de UX/produto/arquitetura,
qualquer coisa que altere comportamento visível/interativo ou conteúdo
público) segue o processo Double Diamond descrito na skill
[`double-diamond-delivery`](.claude/skills/double-diamond-delivery/SKILL.md)
— discovery (docs + pesquisa de mercado) → define (plano) → develop →
deliver (testes, conformidade com as docs, contraste, acessibilidade, leis
de UX, heurísticas de Nielsen). Invoque essa skill antes de propor plano ou
implementar. Mudanças mecânicas/triviais (typo, config, bug óbvio de uma
linha) dispensam a pesquisa online do discovery, mas nunca dispensam a
leitura das docs (acima) nem o checklist de deliver — critério completo na
skill.

Nenhuma entrega é considerada concluída sem esse processo ter acontecido.
