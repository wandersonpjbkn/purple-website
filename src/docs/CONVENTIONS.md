# Code Conventions — site Purple

> As-built + acordadas com a dupla. Valem para todo código novo; o existente é
> migrado quando tocado. Histórico de mudanças: [`CHANGELOG`](../../CHANGELOG.md).
> Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) · [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md).

## Idioma ✅

**Código e comentários em inglês; conteúdo em português.**

- **Inglês:** nomes de variáveis/funções/arquivos, chaves de JSON, mensagens de
  commit, nomes de branch, identificadores em geral e **os comentários de
  código** (ver regra de quando comentar em [Comentários](#comentários-)).
- **Português:** o que é **informação/conteúdo** exibido ou redigido para humanos
  — copy do site, valores de conteúdo no `src/data/*.json`, posts do blog e
  **esta documentação**.

## JavaScript / TypeScript ✅

- **Arrow functions por padrão.** Usar `function`/método só quando há perda de
  semântica: actions de store que dependem de `this`, declarações em `.d.ts`,
  código gerado em template-string.
- Preferir `const`; tipar o que é público (props, retornos de composables).

## Vue / UI ✅

- **Um caminho de botão:** sempre `BaseButton` (variantes `primary | secondary |
ghost | lime`); não escrever `class="button primary"` à mão.
- **Tokens primeiro:** cor/espaçamento/tipografia vêm de `_tokens.scss`
  (`--space-*`, `--text-*`, etc.), não valores crus. Ver [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md).
- **BEM** para classes; **ícones via `BaseIcon`** (nunca emoji no markup).

## Estilos (SCSS) — posse e escopo ✅

Em Vue, o `scoped` **vence** o global (especificidade `[data-v-*]` + ordem de
carga). Então a regra é organizacional, não brigar com a cascata:

- **Componente é dono do seu estilo:** o visual de um componente mora **com ele**
  (`<style scoped>`); use `:deep()` para alcançar internos de subcomponentes
  (ex.: `BaseAvatar` estiliza o `<img>`/`.avatar__initial` de `AvImage`/`AvInitials`).
- **`src/styles/*` é só para o que é genuinamente global:** reset, tokens,
  layout, utilitários e primitivos compartilhados — **não** o estilo de um único
  componente (isso o deixaria numa camada frouxa, sobrescrita por qualquer scoped).
- **Página não re-estiliza interno de outro componente.** Estiliza as próprias
  classes/layout.
- **`:deep()` é cirúrgico:** reservado para conteúdo sem classe (markdown/`v-html`),
  ancorado ao seu container e a alvos estreitos (ex.: `:deep(p > img)`), nunca um
  elemento largo que alcance componentes aninhados.

## Sem duplicação (DRY) ✅

Uma estrutura não deve ser copiada e colada. Se uma estrutura CSS/HTML aparece em
**mais de um lugar** e é **muito idêntica**, segmentá-la seguindo as regras do
projeto:

- **Só CSS repetido** → utilitário/classe compartilhada (ex.: `.button-row`,
  `.section-block--dark`, `.stat-grid`) num partial global apropriado.
- **Markup repetido** → **componente** (ex.: `StatCard`, `ServiceTeaserCard`,
  `PageHero`), com o estilo co-localizado no componente (posse de estilo).

Variações de uso único ou com estrutura diferente (ex.: o card `--featured` da
Home, o card de projetos da Serviços) **não** forçam abstração — DRY vale quando a
repetição é real e quase idêntica, não para unir coisas só parecidas.

## SOLID ✅

Não há classes neste código (Composition API + funções). Os cinco princípios
ainda se aplicam, só que traduzidos para composables, componentes e tipos de
prop:

- **S — Responsabilidade única:** lógica pura (validação, formatação, cálculo)
  vive num **composable testável**, não dentro do `<script setup>` de uma
  página. Exemplos já seguidos: `useBlog` (filtro/paginação do blog),
  `useMail` (envio ao Worker), `useContactForm` (validação do formulário de contato).
  Um componente de página pode **orquestrar** vários composables, mas não deve
  **conter** a lógica que poderia ser testada isoladamente.
- **O — Aberto/fechado:** estender deve significar **adicionar**, não editar
  código existente. Exemplos: novo ícone = nova entrada em
  `components/ui/icons.ts` (nunca mexer em `BaseIcon.vue`); novo recurso de
  markdown no blog = novo `replace` em `workers/blog/src/index.ts`
  (`markdownToHtml` — os passes existentes não mudam).
- **L — Substituição de Liskov:** variantes de um componente polimórfico
  precisam honrar o mesmo contrato em todo call site. Ex.: `BaseButton` com
  `tag="RouterLink"` sempre recebe `to`; com `tag="a"`, sempre `href` — nenhum
  call site deve depender de um comportamento que só uma das variantes tem.
- **I — Segregação de interface:** a prop de um componente só existe se o
  próprio componente a usa. Prop declarada e nunca lida/repassada é sinal de
  código morto (ver [Código morto](#código-morto-)).
- **D — Inversão de dependência:** um módulo de alto nível não deve depender
  direto de um detalhe de baixo nível — a dependência passa por uma
  abstração local. Exemplo já seguido: `useMail` isola o `fetch()` ao Worker
  de contato (`VITE_CONTACT_API_URL`) atrás de `{ status, errorMsg, send, reset }`;
  `useTurnstile` isola o `window.turnstile` (script carregado via CDN) atrás de
  `{ token, status, render, reset, remove }` — nenhuma página toca essas APIs de
  baixo nível diretamente. **Não se aplica** ao acesso a `src/data/*.json` —
  essa é a fonte única de conteúdo por decisão arquitetural (ver
  [`CONTENT_MODEL`](CONTENT_MODEL.md)), não um detalhe de baixo nível a
  inverter. **Não confundir com [DRY](#sem-duplicação-dry-)** (acima): DRY é
  sobre não duplicar estrutura repetida; este "D" é sobre a direção da
  dependência entre módulos — princípios diferentes, letra coincidente.

## Comentários ✅

Priorizar **código legível** > comentário. Comentar o **porquê** (decisão,
contexto não óbvio, armadilha), não o **o quê** (que o código já diz). Em testes,
comentar só quando ajuda. Idioma: inglês (ver [Idioma](#idioma-)).

## Código morto ✅

Código, dado ou trecho de documentação sem uso é **removido ao ser encontrado**
— não se mantém "só porque pode ser útil depois". Só permanece se houver um
comentário explícito justificando por que precisa ficar (ex.: `// keep: ...`).

## Dados ✅

`src/data/*.json` é a fonte de dados estáticos, **fragmentada por domínio**
(`team`, `panorama`, `approach`, `about`, `footer`, `home`, `services`, `pages`)
— sem um arquivo "site" genérico. Toda afirmação factual carrega `source` (ver
[`CONTENT_MODEL`](CONTENT_MODEL.md)).

## UX ✅

Toda UI nova ou alterada segue as heurísticas de Nielsen e as leis de UX
usuais (Jakob, Fitts, Hick, Miller) e contraste WCAG AA. Isso é regra do
projeto, não algo a justificar comentário por comentário no código — a
heurística/lei não aparece citada inline; achados e exceções ficam
registrados em [`UX_REVIEW`](UX_REVIEW.md).

## Vieses cognitivos ✅

Decisões de design podem considerar deliberadamente vieses cognitivos (ex.:
ancoragem) para **orientar** — nunca para manipular — o usuário: sem esconder,
encolher ou dificultar a opção que não é a sugerida. Toda vez que uma decisão
de UI for motivada por um viés, o código carrega **exatamente um comentário
permanente** declarando qual viés foi usado e onde — esse comentário nunca
deve ser removido, mesmo em refino futuro (é a única exceção à regra de
[Comentários](#comentários-)). Exemplo já seguido: `CookieConsent.vue`
(ancoragem — comentário junto aos botões Aceitar/Recusar).

## Composables ✅

Todo composable em `src/composables/` é reexportado por
`src/composables/index.ts`; código de aplicação sempre importa de
`@/composables`, nunca por caminho direto ao arquivo (`@/composables/useX`)
— exceção: os próprios testes unitários do composable, que podem importar
direto o módulo que testam.

## Roteamento e listas de navegação ✅

- Listas voltadas a menu/rodapé (`pages.json`, `footer.json`'s `legal`)
  referenciam rotas por **nome** (`routeName`, o `name` já declarado em
  `router/modules/*`), nunca por `path` hardcoded fora de `router/modules/*`
  — resolvido via `RouterLink :to="{ name: routeName }"`. Evita quebra
  silenciosa (404 no menu/rodapé) quando um path muda no router.
- Repetição de markup para itens de uma lista usa **`v-for`** sobre uma única
  fonte de dados — não declarações repetidas por item.
