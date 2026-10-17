# 006 · Funil e negócios (kanban + lista)

**Requisitos:** RF-20, RF-21, RF-22, RF-23 (P0) · RF-24, RF-25 (P1 → `015`)
**Prioridade:** P0 · **Depende de:** 002, 003, 005 · **Bloqueia:** 007 (motor de follow-up), 011 (painel)

---

## Funil

- [ ] Funil padrão vindo do seed: **Novo → Contatado → Proposta enviada → Negociação → Ganho/Perdido** (RF-20)
- [ ] Etapas de ganho/perdido não aparecem como colunas do kanban (são estados de fechamento)
- [ ] (P1) Admin edita nome, ordem e probabilidade das etapas → `015`

## Kanban (RF-21)

- [ ] Kanban com **dnd-kit**; cada drop = Server Action otimista com rollback em erro + toast
- [ ] **Visão em lista no celular** (kanban em tela pequena é usado apenas para consulta) — alternador kanban/lista
- [ ] Card do negócio: título, valor, contato, responsável, data prevista, **dias sem atividade** e próxima ação
- [ ] Mover etapa: registra `timeline_event`, atualiza `last_activity_at` e exige/valida próxima ação (integra com `007`)
- [ ] Colunas com contagem e soma de valor no cabeçalho
- [ ] Performance: fluido com até **500 negócios abertos** por conta (paginação por etapa + skeletons)

## Negócio (RF-22, RF-23)

- [ ] Criar/editar negócio: título, valor, contato, etapa, responsável, data prevista de fechamento
- [ ] Vendedor só vê e move os próprios negócios; Admin vê tudo (query, não só UI)
- [ ] Fechar como **Ganho**: confirma valor final
- [ ] Fechar como **Perdido**: motivo **obrigatório** (lista de `lost_reasons`) + observação opcional
- [ ] Fechamento leva a `DealStatus` WON/LOST e registra evento na timeline
- [ ] (P1) Reabrir negócio fechado → `015`

## Detalhe do negócio (base da tela do `008`)

- [ ] Cabeçalho com contato, valor, etapa, responsável, botões WhatsApp/Ligar e próxima ação
- [ ] Aba/seções: timeline, tarefas do negócio, notas
- [ ] Ação "Adiar 1 dia" na próxima ação (um clique, com desfazer)

---

**✅ Critérios de aceite:** arrastar entre etapas persiste após recarregar; perdido não fecha sem motivo; vendedor não vê negócio alheio; kanban utilizável com 500 negócios abertos.
