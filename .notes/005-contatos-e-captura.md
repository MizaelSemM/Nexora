# 005 · Contatos e captura rápida de lead

**Requisitos:** RF-10, RF-13, RF-14 (P1 justificado: campo já entra no schema) · user story US-03
**Prioridade:** P0 · **Depende de:** 002, 003, 004 · **Bloqueia:** 007, 009, 010 (todos usam `createLead()`)

---

## Captura rápida (US-03 — menos de 20 segundos)

- [x] Tela/modal de cadastro rápido: **nome + telefone** (resto opcional, escondido atrás de "mais detalhes")
- [x] Input de telefone com `inputmode="tel"`, máscara BR e normalização E.164 no servidor
- [x] Detecção de **duplicado por telefone** na própria conta: aviso + botão "abrir contato existente"
- [x] Regra `5. Cria automaticamente negócio na etapa "Novo" + tarefa "Primeiro contato" para **hoje**`
- [x] Serviço único `createLead()` em `server/services/` — **reutilizado** pelo formulário manual, CSV (`009`) e formulário público (`010`), com testes unitários
- [x] Timer de medição do cadastro (evento `lead_created` com `seconds` — alimenta a métrica "< 20s" do `013`)

## Campos e ações

- [x] Campos do contato: nome, telefone, e-mail, empresa_texto, origem (`Instagram | Indicação | Site | Loja | Outro`), owner_id
- [x] Botão **"Abrir no WhatsApp"** (`wa.me` com DDI) no contato, na lista e no detalhe do negócio (RF-13)
- [x] Botão Ligar (`tel:`) no celular
- [x] Lista de contatos com busca por nome/telefone (pré-requisito da busca global do `008`)
- [x] Edição de contato + exclusão lógica com registro na timeline (`008`)
- [x] Troca de responsável do contato (respeitando papel: vendedor só os próprios)

## Performance

- [x] Lista de contatos paginada (contas com milhares de contatos após importação)

---

## ✅ Critérios de aceite (US-03)

2 campos criam lead em < 20s; telefone duplicado avisa e oferece o contato existente; negócio "Novo" + tarefa de primeiro contato criados automaticamente.

---

## Implementação (23/10/2026)

- **Serviço único** `server/services/leads.ts` → `createLead()` roda contato + negócio + tarefa + timeline em uma transação. Retorna `{ status: "duplicate", contact }` em vez de erro quando o telefone já existe (inclusive contato excluído — o índice único do banco continua valendo).
- **Funil padrão** `server/services/pipeline.ts`: criado no cadastro (`signUpCompany`) e garantido por `ensureDefaultPipeline()` no primeiro lead de contas antigas. IDs determinísticos por conta → upsert idempotente mesmo com capturas concorrentes.
- **Captura rápida** em `/contatos/novo`: nome + telefone em primeiro plano, "Mais detalhes" com e-mail/empresa/origem/responsável. Timer medido do render no servidor até o submit (`captureSeconds`).
- **Lista** `/contatos`: busca por nome ou dígitos do telefone, paginação de 20, recorte por papel (vendedor só os próprios) e botões WhatsApp/Ligar.
- **Detalhe** `/contatos/[id]`: ficha com edição inline, troca de responsável (só ADMIN), negócios do contato e exclusão lógica.
- **Exclusão lógica**: negócios abertos saem do funil (`deleted_at`) e tarefas futuras são canceladas; ganhos/perdidos e tarefas concluídas ficam no histórico. Eventos `contact.deleted`/`deal.deleted` na timeline.
- **Analytics**: `lib/analytics.ts` centraliza `trackEvent("lead_created", { source, origin, seconds, has_email, has_company })` — PostHog entra na `013`; em dev imprime no console.
- **Testes**: 21 novos (unit de máscara/schemas + integração de criação, duplicado, permissões, funil, busca, edição e exclusão) — 74 verdes no total.
- **Correção de login (pré-existente, encontrada no smoke test):** após o sign-in, usar `window.location.assign(redirectTo)` em vez de `router.push` — o Next 16 reutilizava o RSC de `/` pré-carregado sem sessão e devolvia para `/login`. Validado ponta a ponta no Chromium (login → criar → duplicado → editar → excluir).
