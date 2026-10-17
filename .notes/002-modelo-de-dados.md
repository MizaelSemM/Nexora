# 002 · Modelo de dados, migrations e seed

**Requisitos:** seção 10 do PRD (modelo de dados), RNF de performance (seção 11)
**Prioridade:** P0 · **Depende de:** 001 · **Bloqueia:** 003–011

> **⚠ Versão do Prisma:** fixar CLI e client em **7.10.1**. Em 17/10/2026 o `latest` do CLI apontava para `8.0.0-rc.23` (release candidate — instável e desalinhado do client). Só subir para o v8 quando sair estável.

---

## Schema base (Prisma)

- [ ] Enums: `Role` (ADMIN/SELLER), `DealStatus` (OPEN/WON/LOST), `TaskType` (WHATSAPP/CALL/MEETING/OTHER), `TaskResult`, `LeadOrigin`
- [ ] Campos comuns em **todas** as tabelas: `id`, `account_id`, `created_at`, `updated_at`
- [ ] Exclusão lógica (`deleted_at`) em `contacts` e `deals`
- [ ] Tabelas: `accounts`, `users`, `contacts`, `pipelines`, `stages`, `deals`, `tasks`, `notes`, `timeline_events`, `message_templates`, `lost_reasons`, `cadence_rules`
- [ ] `deals`: título, valor, `stage_id`, `contact_id`, `owner_id`, `data_prevista`, status, `motivo_perda_id`, `last_activity_at`, `next_action_at`
- [ ] `tasks`: tipo, título, `vence_em`, `concluida_em`, `resultado`, `deal_id`, `owner_id`
- [ ] `stages`: nome, ordem, `probability` (usada na previsão do mês), `cadence_default` (para o P1)
- [ ] `timeline_events`: tipo, `payload` (JSON), `deal_id`, `contact_id`, `autor_id` — **imutável**
- [ ] Unicidade: telefone único por conta (`account_id` + `phone`)
- [ ] Telefone normalizado em **E.164** (`+55DDD...`) — helper `lib/phone.ts` com testes unitários (casos: com/sem +55, com 0, 9º dígito)

## Performance (RNF)

- [ ] Índices compostos: `(account_id, owner_id, next_action_at)` em `deals` e `tasks`
- [ ] Índice para o alerta de parados: `(account_id, last_activity_at)`
- [ ] Índice para a busca global: `(account_id, name)` e `(account_id, phone)`
- [ ] Migration inicial revisada (ler o SQL gerado antes de aplicar) e aplicada em dev + prod

## Seed

- [ ] Seed idempotente com: funil padrão **Novo → Contatado → Proposta enviada → Negociação → Ganho/Perdido** com probabilidades por etapa
- [ ] Motivos de perda iniciais (preço, concorrência, sem resposta, momento ruim, outro)
- [ ] Conta demo + 2 usuários (admin e vendedor) + ~20 leads de exemplo para desenvolvimento
- [ ] Script `db:seed` rodando também no ambiente de preview

---

**✅ Definição de pronto:** `prisma migrate dev` roda limpo a partir do zero; `db:seed` cria funil padrão e dados demo; helper de telefone com testes verdes.
