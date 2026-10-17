# 002 · Modelo de dados, migrations e seed

**Requisitos:** seção 10 do PRD (modelo de dados), RNF de performance (seção 11)
**Prioridade:** P0 · **Depende de:** 001 · **Bloqueia:** 003–011

> **⚠ Versão do Prisma:** fixar CLI e client em **7.10.1**. Em 17/10/2026 o `latest` do CLI apontava para `8.0.0-rc.23` (release candidate — instável e desalinhado do client). Só subir para o v8 quando sair estável.

---

## Schema base (Prisma)

- [x] Enums: `Role` (ADMIN/SELLER), `DealStatus` (OPEN/WON/LOST), `TaskType` (WHATSAPP/CALL/MEETING/OTHER), `TaskResult` (ANSWERED/NO_ANSWER/CALLBACK/WON/LOST), `LeadOrigin`
- [x] Campos comuns em **todas** as tabelas: `id`, `account_id`, `created_at`, `updated_at` (`timeline_events` é append-only: sem `updated_at` de propósito)
- [x] Exclusão lógica (`deleted_at`) em `contacts` e `deals`
- [x] Tabelas: `accounts`, `users`, `contacts`, `pipelines`, `stages`, `deals`, `tasks`, `notes`, `timeline_events`, `message_templates`, `lost_reasons`, `cadence_rules`
- [x] `deals`: título, valor, `stage_id`, `contact_id`, `owner_id`, `data_prevista`, status, `motivo_perda_id`, `last_activity_at`, `next_action_at`
- [x] `tasks`: tipo, título, `vence_em`, `concluida_em`, `resultado`, `deal_id`, `owner_id`
- [x] `stages`: nome, ordem, `probability` (usada na previsão do mês), `cadence_days` (para o P1)
- [x] `timeline_events`: tipo, `payload` (JSON), `deal_id`, `contact_id`, `autor_id` — **imutável**
- [x] Unicidade: telefone único por conta (`account_id` + `phone`)
- [x] Telefone normalizado em **E.164** (`+55DDD...`) — helper `lib/phone.ts` com testes unitários (casos: com/sem +55, com 0, 9º dígito)

## Performance (RNF)

- [x] Índices compostos: `(account_id, owner_id, next_action_at)` em `deals` e `(account_id, owner_id, due_at)` em `tasks`
- [x] Índice para o alerta de parados: `(account_id, last_activity_at)`
- [x] Índice para a busca global: `(account_id, name)` e telefone (`account_id, phone` — o próprio índice único)
- [x] Migration inicial revisada (SQL lido) e aplicada no Supabase (dev = prod por enquanto)

## Seed

- [x] Seed idempotente com funil padrão **Novo → Contatado → Proposta enviada → Negociação** (Ganho/Perdido são status, não etapas — ver Registro), probabilidades 10/25/50/75%
- [x] Motivos de perda iniciais (preço, concorrência, sem resposta, momento ruim, outro)
- [x] Conta demo + 2 usuários (admin e vendedor) + 12 leads de exemplo para desenvolvimento
- [ ] Script `db:seed` rodando também no ambiente de preview (aguarda Vercel — pendência da 001)

---

**✅ Definição de pronto:** migration inicial aplicada no Supabase do zero (workflow `create-only` + `deploy` — ver Registro); `db:seed` cria funil padrão e dados demo; helper de telefone com testes verdes.

---

## 📝 Registro (17/10/2026 — concluída)

- **Schema completo** em `prisma/schema.prisma`: 12 tabelas + 5 enums, snake_case via `@map`/`@@map`, `account_id` em todas as tabelas, soft delete em `contacts`/`deals`.
- **Decisões de modelagem:**
  - **Ganho/Perdido são `DealStatus`, não etapas do funil** — o kanban (006) monta as colunas terminais a partir do status. Fonte única de verdade, sem etapa "fantasma".
  - `timeline_events` é **append-only** (sem `updated_at`, de propósito).
  - Telefone único por conta **mesmo com soft delete** (o fluxo de "restaurar contato" na 005 resolve o caso; índice parcial fica para o P1).
  - Tabelas de auth do Better Auth entram na **003** (migration própria); `users` já nasce com `email_verified` e `image` para o adapter.
  - `message_templates` e `cadence_rules` já criadas (P1) para evitar migration depois.
- **⚠️ Migrations no Supabase:** `prisma migrate dev` **não funciona com o pooler** — o engine cria o shadow database mas não consegue conectar nele (P1001) e deixa banco órfão. Workflow oficial: **`npm run db:migrate`** (= `migrate dev --create-only` + `migrate deploy`). Opcional: `SHADOW_DATABASE_URL` de um 2º projeto Supabase free para ter o `migrate dev` clássico.
- **Seed:** conta "Empresa Demo" (Ana admin + Bruno vendedor), funil Comercial, 5 motivos de perda, 2 modelos de mensagem, **12 contatos / 12 negócios / 13 tarefas** (10 abertas: 1 atrasada, 6 para hoje, 3 futuras; 1 ganho; 1 perdido) + notas e eventos de linha do tempo. Idempotente (IDs fixos + upsert).
- **Telefone:** `lib/phone.ts` (`normalizePhoneBR` → E.164, `formatPhoneBR`, `whatsappLinkBR`) + 13 testes verdes.
- **Validado:** `migrate deploy` aplicado, `migrate status` = up to date, seed roda 2x sem duplicar, build/lint/typecheck/testes verdes, consulta da tela "Hoje" conferida pelo client real.
