# Project State — Purple (site)

> Observado / decidido até **2026-06-26**. Atualizar conforme avança.

## Decisões tomadas ✅

- **Arquitetura de camadas:** estratégia → posicionamento → identidade (verbal/visual) → conteúdo+IA → UI → dev. Construir o que **não** depende da aposta; reservar o que depende.
- **O site não vai ao ar** até os dois slots (`{{POSITIONING_HOOK}}`, `{{SERVICE_OFFER}}`) serem preenchidos por discovery.
- **Refator do repo (Grupos 1–6 do alinhamento):** remoção de componentes órfãos; tokens de espaçamento/tipografia/dark em `_tokens.scss`; DRY (botão único via `BaseButton`, fonte única de stats, utilitários `.section--alt`/eyebrow); página **Abordagem** criada (move "processo" e "Nossa abordagem"); placeholders isolados em `src/content/placeholders.ts`.
- **Grupo 7 (consentimento LGPD autoral + GTM):** ✅ feito — store Pinia persistido (`stores/consent.ts`), banner `CookieConsent`, GTM (`createGtm`) carregado **só após opt-in** de análise.
- **Escopo:** blog mantido (6 páginas no menu); deps Pinia/GTM mantidas para uso futuro; consentimento LGPD local e autoral **antes** de carregar o GTM.
- **`{{SERVICE_OFFER}}` = opção 3:** catálogo inteiro vira placeholder; filosofia/processo moram na Abordagem; catálogo antigo preservado como hipótese fora do render.

## Em validação 🔬

- **Posicionamento** (cunha NR-1 / risco psicossocial) — via entrevistas + form Tally.
- **Oferta e preço** do Diagnóstico — via reação nas entrevistas.

## Perguntas em aberto ⏳

- Qual enquadramento o comprador realmente escolhe? (comunicação interna · cultura/liderança · risco psicossocial/NR-1 · retenção)
- Quem é o comprador econômico (quem assina)?
- Nome do produto ("diagnóstico" atrai ou assusta?), escopo, faixa de preço.

## Bloqueios ⛔

- Hero e seção de Serviços bloqueados **de propósito** até a discovery preencher os slots.

## Nota de método

Risco recorrente do projeto: o **build** (confortável, controlável, sem rejeição)
virar fuga do **discovery** (relacional, com rejeição). Manter o site
honestamente "à espera" é proposital — protege contra "polir pra não escutar".
