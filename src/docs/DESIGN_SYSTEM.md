# Design system — site Purple

Site de poucas páginas: um conjunto de tokens e componentes Base, não um
design system de produto. Valores de token estão em
`src/styles/abstracts/_tokens.scss`, mixins em `abstracts/_mixins.scss` e cada
componente em `src/components/`. Este doc guarda só as regras e os porquês.

## Tokens

- **Tokens antes de valor cru.** Cor, tipografia, espaçamento, raio e sombra
  vêm de `_tokens.scss`. Valor fora da escala: decidir entre arredondar para
  a escala existente ou acrescentar o valor a ela; nunca escrever o valor
  solto.
- **Lime é cor de marca co-titular do roxo, não acento pontual:**
  "resultado / positivo / ação secundária". `--lime` puro não passa contraste
  como texto sobre fundo claro; para texto e link, `--lime-ink`.
- **`--section-dark` é mais claro e quente que `--purple-900`**, para
  suavizar o contraste com as seções claras; `--purple-900` fica para
  acentos.
- **Um vermelho só:** `--danger*` é a fonte única do erro de validação.
- **O passo intermediário de raio e sombra não se chama `-md`:** é o token sem
  sufixo (`--radius`, `--shadow`).
- **Fonte local, sem Google Fonts:** Plus Jakarta Sans servida do próprio
  site, para tirar a cadeia `googleapis.com → gstatic.com` do caminho crítico
  de renderização.
- **Breakpoints são mobile-last** (`respond-to` usa `max-width`).

## Proporção 60/30/10 — neutro/roxo/lima

Neutro ≈ 60% (fundo, blocos claros, cards, header/footer), roxo ≈ 30% (texto,
headings, botões primários, poucas seções escuras), lima ≤ 10% (detalhes,
ícones, sublinhados, botão do CTA; nunca fundo de seção inteira). Conferir com
`yarn color-audit`, que gera um relatório por rota a partir de screenshot: não
é teste e não roda na CI.

## Componentes

- **Um caminho de botão:** CTA com variante de marca é sempre `BaseButton`
  (regra completa em [`CONVENTIONS`](CONVENTIONS.md)).
- **Ícone é sempre `BaseIcon`**, nunca emoji nem glifo tipográfico
  (`→ ← ✕`). Ícone novo é uma entrada nova em `icons.ts`. Glifos de marca são
  preenchidos; o resto é traço.
- **`BaseIcon` herda a cor do pai** (`currentColor`): sobre fundo escuro, o
  contêiner precisa definir `color`, senão o ícone some (escuro sobre escuro).
- **O glifo do WhatsApp existe só para o compartilhar do post:** o CTA de
  contato não leva a marca do canal.
- **Imagem nunca aparece quebrada:** `MediaBlock` e `BaseAvatar` têm fallback
  (gradiente e inicial).
- **Estatística sobre fundo escuro tem um padrão só:** `.stat-grid` +
  `StatCard`. Número de destaque separa valor (cor de texto) e sinal ou sufixo
  (`%`, `x`) em `--lime`; preservar isso em blocos numéricos novos.

## Nomes — BEM

`bloco__elemento--modificador`. Utilitários sem BEM sancionados: `.lead`,
`.section-eyebrow` (+ `--lime`), `.text-link`, `.section-block` (+ `--alt`,
`--sm`, `--dark`).

## Tema escuro

Não há alternância claro/escuro. "Escuro" é uma seção com fundo
`--section-dark` e texto `--on-dark-*`; `.section-block--dark` aplica o fundo
e o contexto de texto aos filhos, para não repetir cor em cada seção.
