# Docs — Purple Comunicação (site institucional)

Estes docs guardam só o que o código não diz: decisões e porquês, regras que
nenhum lint impõe, produto e como operar o que fica fora do repositório. O
que o código já mostra (estrutura, campos, contagens, valores de token) não
se repete aqui. O histórico de mudanças mora no
[`CHANGELOG`](../../CHANGELOG.md); nenhum doc narra o que mudou.

| Doc                                   | Para quê                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| [`PRODUCT_VISION`](PRODUCT_VISION.md) | Quem é a Purple, quem é o cliente, território e oferta                   |
| [`POSITIONING`](POSITIONING.md)       | Posicionamento validado                                                  |
| [`PROJECT_STATE`](PROJECT_STATE.md)   | Decisões de produto em vigor, pendências e recomendações abertas         |
| [`ARCHITECTURE`](ARCHITECTURE.md)     | Decisões técnicas: blog, Workers, SEO, prerender e deploy, consentimento |
| [`CONVENTIONS`](CONVENTIONS.md)       | Regras de código, estilo e UX (inclui as decisões de UX do site)         |
| [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md)   | Regras de tokens, cor e componentes                                      |
| [`CONTENT_MODEL`](CONTENT_MODEL.md)   | Guia de autoria: posts, dados das páginas e imagens                      |
| [`TESTING`](TESTING.md)               | Política de testes e o que se confere à mão                              |

## Princípio

**Nunca documentar como fato o que não foi observado.** Doc fabricado é pior
que doc ausente, porque quem lê confia nele. Regra que dá para verificar por
máquina vira teste ou lint, não frase.
