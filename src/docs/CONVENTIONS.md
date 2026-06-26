# Code Conventions — site Purple

> As-built + acordadas com a dupla. Valem para todo código novo; o existente é
> migrado quando tocado. Relacionados: [`ARCHITECTURE`](ARCHITECTURE.md) ·
> [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md).

## Idioma ✅

**Código em inglês; conteúdo em português.**

- **Inglês:** nomes de variáveis/funções/arquivos, chaves de JSON, comentários,
  mensagens de commit, nomes de branch, identificadores em geral.
- **Português:** o que é **informação/conteúdo** exibido ou redigido para humanos
  — copy do site, valores de conteúdo no `src/data/*.json`, posts do blog, e
  **esta documentação** (escrita para a dupla).

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

## Comentários ✅

Priorizar **código legível** > comentário. Comentar o **porquê** (decisão,
contexto não óbvio, armadilha), não o **o quê** (que o código já diz). Em testes,
comentar só quando ajuda.

## Dados ✅

`src/data/*.json` é a fonte de dados estáticos, **fragmentada por domínio**
(`team`, `panorama`, `contact`, `approach`, `about`, `footer`, `home`) — sem um
arquivo "site" genérico. Toda afirmação factual carrega `source`
(ver [`CONTENT_MODEL`](CONTENT_MODEL.md)). Conteúdo em validação fica em
`src/content/placeholders.ts`.
