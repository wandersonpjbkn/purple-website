# Convenções — site Purple

Regras de código, estilo e UX que valem para todo código novo; o existente é
migrado quando tocado. O que um lint ou teste já impõe está marcado como tal.

## Idioma ✅

**Código e comentários em inglês; conteúdo em português.**

- **Inglês:** nomes de variáveis/funções/arquivos, chaves de JSON, mensagens de
  commit, nomes de branch, identificadores em geral e **os comentários de
  código** (ver regra de quando comentar em [Comentários](#comentários-)).
- **Português:** o que é **informação/conteúdo** exibido ou redigido para humanos
  — copy do site, valores de conteúdo no `src/data/*.json`, posts do blog e
  **esta documentação**.
- **Exceção — pastas de teste:** comentários dentro de `__tests__/` e `e2e/`
  têm **bypass** da regra de inglês e podem ser escritos em português,
  acompanhando o estilo Given/When/Then das descrições de teste (pt-BR, ver
  [`TESTING`](TESTING.md)). Fora dessas pastas, vale a regra normal (inglês).

## JavaScript / TypeScript ✅

- **Arrow functions por padrão.** Usar `function`/método só quando há perda de
  semântica: actions de store que dependem de `this`, declarações em `.d.ts`,
  código gerado em template-string.
- Preferir `const`; tipar o que é público (props, retornos de composables).

## Vue / UI ✅

- **Um caminho de botão para CTA com marca:** ação com peso de marca (variantes
  `primary | secondary | ghost | lime`) sempre via `BaseButton`; não escrever
  `class="button primary"` à mão. **Não se aplica** a controle estrutural sem
  variante de marca (paginação, trigger de accordion, seletor de card, botão
  de menu) — esses são `<button>` com estilo próprio, co-localizado no
  componente (ver "Posse de estilo" abaixo).
- **Tokens primeiro:** cor/espaçamento/tipografia vêm de `_tokens.scss`
  (`--space-*`, `--text-*`, etc.), não valores crus. Ver [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md).
- **BEM** para classes; **ícones via `BaseIcon`** (nunca emoji no markup ou glifo
  tipográfico).

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
  página. Um componente de página pode **orquestrar** vários composables, mas não deve
  **conter** a lógica que poderia ser testada isoladamente.
- **O — Aberto/fechado:** estender deve significar **adicionar**, não editar
  código existente. Exemplos: novo ícone = nova entrada em
  `components/ui/icons.ts` (nunca mexer em `BaseIcon.vue`); novo recurso de
  markdown no blog = novo renderer/extensão do `marked` em
  `workers/blog/src/markdown.ts` (os renderers existentes não mudam).
- **L — Substituição de Liskov:** variantes de um componente polimórfico
  precisam honrar o mesmo contrato em todo call site. Ex.: `BaseButton` com
  `tag="RouterLink"` sempre recebe `to`; com `tag="a"`, sempre `href` — nenhum
  call site deve depender de um comportamento que só uma das variantes tem.
- **I — Segregação de interface:** a prop de um componente só existe se o
  próprio componente a usa. Prop declarada e nunca lida/repassada é sinal de
  código morto (ver [Código morto](#código-morto-)).
- **D — Inversão de dependência:** um módulo de alto nível não deve depender
  direto de um detalhe de baixo nível — a dependência passa por uma
  abstração local (ex.: `useMail` isola o `fetch()` ao Worker de contato,
  `useTurnstile` isola o `window.turnstile`); nenhuma página toca essas APIs
  de baixo nível diretamente. **Não se aplica** ao acesso a `src/data/*.json` —
  essa é a fonte única de conteúdo por decisão arquitetural (ver
  [`CONTENT_MODEL`](CONTENT_MODEL.md)), não um detalhe de baixo nível a
  inverter. **Não confundir com [DRY](#sem-duplicação-dry-)** (acima): DRY é
  sobre não duplicar estrutura repetida; este "D" é sobre a direção da
  dependência entre módulos — princípios diferentes, letra coincidente.

## Comentários ✅

Priorizar **código legível** > comentário. Código novo só leva comentário
de **título de seção**, de uma linha, em inglês (ex.:
`// Site pages (/blog/* on the main domain)`). O **porquê** de uma decisão
não óbvia mora na doc de domínio (`ARCHITECTURE`, `CONTENT_MODEL`…), não no
código; comentários de porquê já existentes são migrados quando o trecho é
tocado. Exceções: o comentário de viés cognitivo (ver
[Vieses cognitivos](#vieses-cognitivos-)), a justificativa de um
`eslint-disable` e as pastas `__tests__/`/`e2e/`. Arquivos de configuração
(`*.toml`, `*.yaml`) podem explicar o que configuram. Nenhum comentário
registra passado (explica a situação atual). Informações que expliquem revisões,
alterações ou decisões passadas devem preferir o [`CHANGELOG`](../../CHANGELOG.md).
Em testes, comentar só quando ajuda. Idioma: inglês (ver [Idioma](#idioma-)) —
**exceto em `__tests__/` e `e2e/`**, onde o comentário pode ser em português
(bypass documentado em [Idioma](#idioma-)).

## Onde registrar o quê ✅

- **Como o sistema funciona hoje e por quê** → o doc do assunto em
  `src/docs/` (só o que o código não mostra).
- **Histórico de decisões e mudanças concluídas** → `CHANGELOG.md`; nenhum
  doc narra o que mudou.
- **Decisão de UX que vale para o site** → seção [UX](#ux-) deste doc;
  **recomendação ainda aberta** → [`PROJECT_STATE`](PROJECT_STATE.md). Nunca
  citada inline no código.
- **Regra verificável por máquina** → teste ou lint, não frase.

## Código morto ✅

Código, dado ou trecho de documentação sem uso é **removido ao ser encontrado**
— não se mantém "só porque pode ser útil depois". Só permanece se houver um
comentário explícito justificando por que precisa ficar (ex.: `// keep: ...`).

## UX ✅

Toda UI nova ou alterada segue as heurísticas de Nielsen e as leis de UX
usuais (Jakob, Fitts, Hick, Miller) e contraste WCAG AA. Isso é regra do
projeto, não algo a justificar comentário por comentário no código — a
heurística/lei não aparece citada inline. Decisões de UX que valem para o site
inteiro ficam abaixo; recomendações ainda abertas, em
[`PROJECT_STATE`](PROJECT_STATE.md).

### Funil de CTAs (decisão do dono do produto, 2026-07-09)

- **Macro-conversão = WhatsApp, primário; micro I = formulário, secundário;
  micro II = navegação de conteúdo, terciário.**
- **Cor não marca tipo de conversão.** `purple` é o primário padrão; `lime` é
  primário só quando o fundo não comporta `purple` por contraste. A cor é
  contraste e marca, nunca um código para "isto é o WhatsApp".
- **Por bloco:** macro + micro juntos (macro em destaque), ou micro I + micro
  II. Nunca micro em destaque com macro subordinado.
- **Peso, não contagem:** macro pesa ~2–3× uma micro; tela com muitas macros
  fica desequilibrada, então nem todo bloco precisa de WhatsApp.
- **Página-destino não convida à saída.** Contato e Serviços já são destino
  de conversão: sem CTA de saída acima da dobra ou no mesmo bloco. Por isso o
  hero de Serviços tem só o WhatsApp e os cards "Pedir proposta" têm só o
  formulário — intencional, não lacuna.

### Mesma função, mesmo componente

- **Catálogo de serviços é master-detail:** cards seletores de altura fixa e
  um painel de detalhe único abaixo, com anterior/próximo (mesmo padrão da
  paginação do blog, sem wraparound). Acordeão por item tem custo alto quando
  o conteúdo é longo, e um grid de acordeões fazia o card vizinho mudar de
  posição sob o cursor. A navegação fica fora da `<Transition>` do conteúdo
  para o foco não se perder a cada troca. O FAQ continua multi-open: lista de
  uma coluna, respostas curtas.
- **Card de serviço** é o mesmo `ServiceTeaserCard` na Home, na Abordagem e no
  fim do post, com o mesmo texto de link ("Conhecer o serviço") cobrindo o
  card inteiro.
- **Citação** tem um estilo só no site (post e `TeamCard`): centralizada entre
  fios, sem caixa tingida nem borda lateral.
- **Callouts do post são só dois** (`[!summary]` e `[!stat]`): destaque demais
  anula o destaque. Um terceiro tipo pede revisão desta seção.
- **Compartilhar o post** usa ícone da rede porque o ícone diz para onde o
  post vai; o veto à marca do WhatsApp vale só para o CTA de contato. O visual
  é distinto do `SocialLink` do rodapé: lá o link leva ao perfil da Purple,
  aqui leva o post para a rede de quem lê.

### Página do post

- **Capa sem título repetido no `alt`:** sem `coverAlt`, `alt=""`; o título já
  está ao lado.
- **Tabelas de 3+ colunas viram blocos por linha no celular**, cada célula com
  o rótulo da coluna. Ressalva conhecida: com `display: block`, alguns leitores
  de tela (VoiceOver/Safari) deixam de anunciar a tabela; o rótulo textual
  cobre o significado.

### Verificado e correto — não reabrir

Uma leitura do HTML sem executar JS acusa estes itens como falha, mas eles
estão certos:

- **H1 rotativo do hero:** as variantes do typewriter são `aria-hidden`, e um
  `span.sr-only` traz a lista completa.
- **Links de rede social:** texto vazio com `aria-label` descritivo e ícone
  SVG (WCAG 2.4.4 atendido).
- **"Um espaço para pessoas, feito por pessoas":** o espaço duplo é um
  `<br />` intencional.

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

Imposto por lint (`no-restricted-imports` em `eslint.config.ts`). Todo
composable em `src/composables/` é reexportado por
`src/composables/index.ts`; código de aplicação sempre importa de
`@/composables`, nunca por caminho direto ao arquivo (`@/composables/useX`)
— exceções: os próprios testes unitários do composable, que podem importar
direto o módulo que testam, e um composable que usa outro, que importa pelo
caminho do arquivo (`useBlog` → `@/composables/useBlogData`), sem passar pelo
barrel do qual ele mesmo faz parte.

## Roteamento e listas de navegação ✅

- Imposto por teste (`src/data/__tests__/routes.spec.ts`). Listas voltadas a
  menu/rodapé (`pages.json`, `footer.json`'s `legal`)
  referenciam rotas por **nome** (`routeName`, o `name` já declarado em
  `router/modules/*`), nunca por `path` hardcoded fora de `router/modules/*`
  — resolvido via `RouterLink :to="{ name: routeName }"`. Evita quebra
  silenciosa (404 no menu/rodapé) quando um path muda no router.
- Repetição de markup para itens de uma lista usa **`v-for`** sobre uma única
  fonte de dados — não declarações repetidas por item.
