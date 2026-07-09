# Project State — Purple (site)

> Observado / decidido até **2026-07-08**. Atualizar conforme avança.
> Histórico de decisões e mudanças anteriores: [`CHANGELOG`](../../CHANGELOG.md).

## Estado atual ✅

- **Arquitetura de camadas:** estratégia → posicionamento → identidade (verbal/visual) → conteúdo+IA → UI → dev. Construir o que **não** depende da aposta; reservar o que depende.
- **Alvo:** empresas de médio porte (40+ colaboradores) sem área estruturada de comunicação/employer branding. Estratégia "entrega prática antes de consultoria" — ver `POSITIONING.md`.
- **Oferta no site:** catálogo de 7 serviços (formato rico: tagline, descrição, benefícios, processo) + 3 planos mensais recorrentes (Essencial, Cultura Ativa, Employer Branding Completo; permanência mínima 3 meses) + 3 projetos pontuais.
- **Sem preços publicados:** todos os planos/projetos são "Sob consulta" — venda consultiva; valores só na proposta.
- **Foco regional discreto:** Americana–SP aparece apenas em contato/footer; o posicionamento não é amarrado à região.

## Em validação 🔬

- **Conversão da oferta publicada** — reação real de compradores aos planos "sob consulta" (primeiro ciclo de prospecção outbound).

## Pendências ⏳

- **Fontes dos números do hero da Home:** os stats restaurados (64% sem engajamento · 14x mais produtivas · 23% mais receita · +43% de engajamento no card) são dados reais usados desde o `develop`, mas as referências exatas se perderam na adaptação — campos `source` em `home.json.hero` estão vazios aguardando confirmação da dupla. Candidata citada no modelo de negócio para o 43%: redução de custo de atração com EVP estruturada (ESPM / Jornal Empresas & Negócios, 2026). **Preencher `source` assim que confirmadas.**
- **Imagens:** slots prontos com fallback; arquivos a subir pela dupla — ver `IMAGES.md` ( **logo definitivo** substituindo o placeholder em `src/assets/brand/logo-ppl.svg`).
- **Política de Privacidade:** `privacy.json` é **texto-base LGPD**; precisa de revisão jurídica antes do go-live.
- **Go-live SEO:** robots segue `noindex, nofollow` (fonte única em `App.vue`) até decisão explícita de lançamento. Checklist do go-live: preencher fontes pendentes, subir imagens e flipar robots + `public/robots.txt`.
