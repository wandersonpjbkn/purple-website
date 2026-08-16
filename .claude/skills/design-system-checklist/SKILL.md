---
name: design-system-checklist
description: Checklist do design system deste repositório (site Purple) — tokens antes de valor cru, proporção de cor 60/30/10 + yarn color-audit, reuso de componentes Base/ui existentes antes de criar um novo, mixins SCSS já disponíveis, padrão de tema escuro, convenção de números com sinal em lime. Use PROATIVAMENTE antes de escrever CSS/SCSS novo ou criar um componente Vue neste repositório — fonte completa em src/docs/DESIGN_SYSTEM.md.
---

# Checklist de design system — site Purple

Fonte completa: [`DESIGN_SYSTEM.md`](../../../src/docs/DESIGN_SYSTEM.md).
Rodar antes de escrever CSS novo ou criar um componente — evita reinventar o
que já existe ou fugir da paleta/proporção sem perceber.

## Antes de escrever CSS novo

- [ ] O valor tem correspondência em `_tokens.scss`? Usar o token, não o
      valor cru.
- [ ] Sem correspondência: cabe "arredondar" pra escala existente, ou a
      escala precisa crescer? Decidir explicitamente, não empurrar com o pé.
- [ ] Existe um mixin em `abstracts/_mixins.scss` que já resolve isso?
      (`respond-to`, `card-surface`, `card-hover`, `top-accent-line`,
      `radial-glow`, `eyebrow`, `line-clamp`) — conferir antes de escrever o
      equivalente à mão.
- [ ] Nome de classe em BEM (`bloco__elemento--modificador`); utilitários
      sem BEM só os já sancionados (`.lead`, `.section-eyebrow`,
      `.text-link`, `.section-block`).

## Antes de criar um componente novo

- [ ] Já existe algo em `ui/` (`BaseButton`, `BaseContainer`, `BaseIcon`,
      `BrandLogo`, `MediaBlock`, `FeaturePillar`, `StatCard`,
      `ServiceTeaserCard`, `TeamCard`, `BaseAvatar`), `sections/`
      (`CtaBanner`, `FaqSection`, `PageHero`), `layout/` (`AppHeader`,
      `AppFooter`) ou `blog/` (`PostCard`, `BlogPagination`) que já resolve
      isso?
- [ ] Ícone novo → entrada em `icons.ts` (nunca editar `BaseIcon.vue`).
- [ ] Slot de imagem novo → `MediaBlock` (fallback gracioso a gradiente) ou
      `useCdnAsset` (padrão de avatar/capa), não `<img>` cru sem fallback.
- [ ] Estatística em destaque (número + sufixo + label [+ fonte]) sobre
      fundo escuro → `StatCard` + `.stat-grid`, não um card novo do zero.

## Cor

- [ ] Proporção da composição visual: neutro ≈60% dominante, roxo ≈30%
      secundário, lima ≤10% acento — lima **nunca** é fundo de seção
      inteira, só detalhe/ícone/sublinhado/botão.
- [ ] Depois de mudança visual relevante, rodar `yarn color-audit` pra
      conferir a proporção por rota (é relatório, não assertion — não
      substitui revisão visual).
- [ ] Número em destaque: valor na cor de texto padrão, sinal/sufixo (`%`,
      `x`) em `var(--lime)` — preservar essa separação em blocos numéricos
      novos.

## Tema escuro

- [ ] Não existe toggle claro/escuro — "escuro" é `.section-block--dark` /
      `--section-dark` usando os tokens `--on-dark-*` para texto/borda.
- [ ] `BaseIcon` herda `currentColor` — sobre fundo escuro, o container
      precisa setar `color` explícito (`--lime`/`--on-dark`), senão o ícone
      herda `--text` e some (escuro sobre escuro).
