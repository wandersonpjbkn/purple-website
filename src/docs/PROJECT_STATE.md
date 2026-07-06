# Project State — Purple (site)

> Observado / decidido até **2026-07-06**. Atualizar conforme avança.

## Decisões tomadas ✅

- **Arquitetura de camadas:** estratégia → posicionamento → identidade (verbal/visual) → conteúdo+IA → UI → dev. Construir o que **não** depende da aposta; reservar o que depende.
- **Discovery concluída (jul/2026):** o modelo de negócio validou alvo, oferta e posicionamento — ver `POSITIONING.md`. Os dois slots reservados (`{{POSITIONING_HOOK}}`, `{{SERVICE_OFFER}}`) foram **preenchidos** e `src/content/placeholders.ts` foi aposentado (conteúdo real em `src/data/home.json` e `src/data/services.json`).
- **Alvo:** empresas de médio porte (40+ colaboradores) sem área estruturada de comunicação/employer branding. Estratégia "entrega prática antes de consultoria".
- **Oferta no site:** catálogo de 7 serviços (formato rico: tagline, descrição, benefícios, processo) + 3 planos mensais recorrentes (Essencial, Cultura Ativa, Employer Branding Completo; permanência mínima 3 meses) + 3 projetos pontuais.
- **Sem preços publicados:** todos os planos/projetos são "Sob consulta" — venda consultiva; valores só na proposta.
- **Foco regional discreto:** Americana–SP aparece apenas em contato/footer; o posicionamento não é amarrado à região.
- **Refator do repo (Grupos 1–7):** órfãos removidos; tokens em `_tokens.scss`; DRY (`BaseButton` único); página **Abordagem**; consentimento LGPD autoral + GTM só após opt-in.
- **Iconografia real:** `BaseIcon` renderiza o set próprio de `src/components/ui/icons.ts` (stroke + glifos de marca preenchidos), com fallback gracioso para nome desconhecido.
- **Newsletter do footer removida:** não havia backend; o bloco morto saiu do `AppFooter` (histórico no git).

## Em validação 🔬

- **Conversão da oferta publicada** — reação real de compradores aos planos "sob consulta" (primeiro ciclo de prospecção outbound).

## Pendências ⏳

- **Fontes dos números do hero da Home:** os stats restaurados (64% sem engajamento · 14x mais produtivas · 23% mais receita · +43% de engajamento no card) são dados reais usados desde o `develop`, mas as referências exatas se perderam na adaptação — campos `source` em `home.json.hero` estão vazios aguardando confirmação da dupla. Candidata citada no modelo de negócio para o 43%: redução de custo de atração com EVP estruturada (ESPM / Jornal Empresas & Negócios, 2026). **Preencher `source` assim que confirmadas.**
- **Imagens:** slots prontos com fallback; arquivos a subir pela dupla — ver `IMAGES.md` (foto da Suelen, logo do header, 2 fotos de seção).
- **Go-live SEO:** robots segue `noindex, nofollow` (fonte única em `App.vue`) até decisão explícita de lançamento. Checklist do go-live: preencher fontes pendentes, subir imagens, configurar EmailJS (`index.html`), flipar robots + `public/robots.txt`.

## Nota de método

Risco recorrente do projeto: o **build** (confortável, controlável, sem rejeição)
virar fuga do **discovery** (relacional, com rejeição). A espera terminou do jeito
certo: o site só foi preenchido **depois** que o modelo de negócio existiu. O
próximo risco é o inverso — polir o site em vez de prospectar. O site está pronto;
a fila agora é comercial.
