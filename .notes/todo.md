# ✅ TODO — CRM de Follow-up para Pequenas Equipes de Vendas (MVP)

**Fonte:** [PRD – CRM de Follow-up para Pequenas Equipes de Vendas (MVP)](<../PRD – CRM de Follow-up para Pequenas Equipes de Vendas (MVP).md>)
**Atualizado em:** 17/10/2026 · **Fase atual:** 1 — Fundação · **Prazo recalibrado: ~6–8 semanas** (ritmo ~20–25h/semana)

---

## 🧭 Norte do MVP (leia antes de qualquer tarefa)

- **Tese:** o vendedor ganha valor no primeiro dia — ele abre o app e sabe **quem chamar e por quê**.
- **Métrica norte:** negócios com **próxima ação agendada e executada no prazo**.
- **Escopo congelado:** só P0 entra no MVP. Item novo só entra trocando por outro item (risco nº 5 do PRD).
- **Prioridade:** P0 = obrigatório para lançar · P1 = MVP+ (`015`) · P2 = fase posterior.

### ✅ Decisões fechadas em 17/10/2026 (ver `000`)

Better Auth (scrypt) · Supabase Postgres **São Paulo** + Vercel **gru1** · multi-tenant desde o dia 1 · lead do formulário → responsável padrão configurável · segmento genérico até as entrevistas · jobs via Vercel Cron.

---

## ⏳ Em Progresso

- [ ] **001 · Fundação: repositório, stack e infra mínima** → [001-fundacao-setup.md](001-fundacao-setup.md)
  - [x] Scaffold Next.js 16 + TypeScript + Tailwind + ESLint
  - [x] Git + README do projeto + marca (pt-BR)
  - [x] Prettier + ESLint integrados (scripts `format`/`format:check`)
  - [x] Validação de env com Zod (`lib/env.ts`) + `.env.example` + `.gitignore` ajustado
  - [x] Configs de teste criadas (`vitest.config.ts` + `playwright.config.ts`)
  - [x] Dependências instaladas (npm muito lento nesta máquina — ~40min no total)
  - [x] **Prisma 7.10.1** (CLI+client, exato) + `@prisma/adapter-pg` + `pg` + singleton em `lib/prisma.ts`
  - [x] `prisma init` + `prisma generate` validados (client gerado em `lib/generated/prisma`)
  - [x] shadcn/ui inicializado + 8 componentes base (button, input, label, card, skeleton, sonner, badge, separator)
  - [x] Build de produção, lint e typecheck passando
  - [ ] Supabase: projeto criado e `.env` preenchido → **precisa da conta do dono**
  - [ ] Vercel + CI (GitHub Actions) + Sentry + PostHog → **precisam das contas do dono**

> Na sequência: **002 · Modelo de dados** (schema Prisma completo) → **004 · Isolamento multi-tenant** → **003 · Auth**.
> Nota para a 002: avaliar `npx prisma dev` (Postgres local do Prisma 7) para desbloquear migrations antes do Supabase ficar pronto.

---

## 📋 Backlog (Próximas Tarefas)

### Bloco 1 — Fundação *(semana 1)*

- [ ] **002 · Modelo de dados, migrations e seed** (todas as entidades, enums, índices, funil padrão) → [002-modelo-de-dados.md](002-modelo-de-dados.md)
- [ ] **004 · Isolamento multi-tenant** (extensão do Prisma + testes) — começar já, retrabalho depois é caro → [004-isolamento-multi-tenant.md](004-isolamento-multi-tenant.md)

### Bloco 2 — Contas e acesso *(semana 2)*

- [ ] **003 · Auth, contas, papéis e convites** (Better Auth) (RF-01..RF-04) → [003-auth-contas-convites.md](003-auth-contas-convites.md)

### Bloco 3 — CRM essencial *(semana 2–3)*

- [ ] **005 · Contatos e captura rápida de lead** (RF-10, RF-13, RF-14) → [005-contatos-e-captura.md](005-contatos-e-captura.md)
- [ ] **006 · Funil e negócios: kanban + lista** (RF-20..RF-23) → [006-funil-kanban-negocios.md](006-funil-kanban-negocios.md)

### Bloco 4 — Diferencial do produto ⭐ *(semana 3–5)*

- [ ] **007 · Motor de follow-up + tela "Hoje"** (RF-30..RF-32, US-01, US-02) → [007-motor-followup-tela-hoje.md](007-motor-followup-tela-hoje.md)

### Bloco 5 — Contexto e entradas *(semana 5)*

- [ ] **008 · Histórico, notas e busca global** (RF-40..RF-42) → [008-historico-notas-busca.md](008-historico-notas-busca.md)
- [ ] **009 · Importação de CSV** (RF-11, US-06) → [009-importacao-csv.md](009-importacao-csv.md)
- [ ] **010 · Formulário público de captura** (RF-12) → [010-formulario-publico.md](010-formulario-publico.md)

### Bloco 6 — Gestor *(semana 5–6)*

- [ ] **011 · Painel do gestor** (RF-50..RF-52, US-04, US-05) → [011-painel-gestor.md](011-painel-gestor.md)

### Bloco 7 — Qualidade do MVP *(semana 6–7)*

- [ ] **012 · PWA, mobile-first e UX de um clique** → [012-pwa-ux-mobile.md](012-pwa-ux-mobile.md)
- [ ] **013 · Segurança, LGPD e observabilidade** → [013-seguranca-lgpd-observabilidade.md](013-seguranca-lgpd-observabilidade.md)
- [ ] **014 · Testes e QA** (Vitest + Playwright, isolamento, "Hoje" < 2s) → [014-testes-qa.md](014-testes-qa.md)

### Bloco 8 — Lançamento *(semana 7–8)*

- [ ] **016 · Lançamento e piloto** (critérios da seção 19, 3 empresas) → [016-lancamento-piloto.md](016-lancamento-piloto.md)

### Depois do MVP

- [ ] **015 · Backlog MVP+ (P1) e Fase 2** — cadências, alertas de parados, templates, exportação, Google login → [015-mvp-plus-p1.md](015-mvp-plus-p1.md)

---

## ✅ Concluído

- [x] 17/10/2026 — Análise do PRD e mapeamento P0 / P1 / P2
- [x] 17/10/2026 — Estrutura de gerenciamento de tarefas criada em `.notes/` (este arquivo + 17 arquivos de detalhe)
- [x] 17/10/2026 — **000 · Decisões técnicas bloqueantes fechadas** (Better Auth, Supabase SP, multi-tenant, atribuição de lead, segmento, jobs)
- [x] 17/10/2026 — Scaffold do app (Next.js 16 + TS + Tailwind + ESLint) + marca e README
- [x] 17/10/2026 — **Fundação de código completa**: Prisma 7.10.1 + adapter pg + singleton, shadcn/ui (8 componentes), env com Zod, Vitest/Playwright configurados, Prettier — build/lint/typecheck verdes (commit de checkpoint)

---

## 📌 Regras deste quadro

1. Uma tarefa em "Em Progresso" por vez (ou o mínimo possível) — o foco é o diferencial do produto.
2. Tarefa só vai para "Concluído" quando o critério de aceite do arquivo de detalhe for atendido.
3. P1 nunca entra no MVP sem trocar por um item P0.
4. Toda decisão técnica relevante é registrada no `000`.
