# 007 · Motor de follow-up + tela "Hoje" ⭐ (coração do produto)

**Requisitos:** RF-30, RF-31, RF-32 (P0) · user stories US-01, US-02 · **métrica norte do PRD**
**Prioridade:** P0 · **Depende de:** 002, 005, 006 · **Bloqueia:** 011 (painel usa os dados daqui)

> **Se este módulo não encantar o vendedor no dia 1, o produto falha.** Ele vem antes de importação, formulário e painel se o prazo apertar.

---

## Regras de negócio (P0)

- [ ] Todo negócio aberto exige **próxima ação com data** — validação no servidor em toda escrita (criar, mover etapa, editar, concluir tarefa)
- [ ] Serviço central `server/services/followup.ts`: `completeTask()`, `scheduleNextAction()`, `recomputeDealActivity()` — com testes unitários (o `014` cobre)
- [ ] **Não é possível concluir tarefa sem definir a próxima ação**, exceto se o negócio for marcado Ganho/Perdido (US-02)
- [ ] Atalhos de data na conclusão: **Amanhã · 3 dias · 1 semana** + data livre (calendário)
- [ ] Ao concluir, registrar resultado rápido: **Respondeu · Não respondeu · Pediu para voltar em… · Fechou · Perdeu**
  - "Pediu para voltar em…" pede a data e já cria a próxima tarefa
  - "Fechou"/"Perdeu" levam ao fechamento do negócio (com motivo, se perdido)
- [ ] Manter `next_action_at` e `last_activity_at` **denormalizados** em `deals` a cada mudança

## Tela "Hoje" (US-01)

- [ ] Lista priorizada: **atrasadas primeiro** (destacadas em vermelho com dias de atraso), depois as do dia
- [ ] Botões por linha: **WhatsApp** (`wa.me`), **Ligar** (`tel:`), **Concluir** — alvos de toque grandes
- [ ] Fluxo de conclusão sem sair da lista: resultado + próxima ação em 2 toques, e a lista rola para a próxima tarefa
- [ ] Contadores no topo: atrasadas · hoje · concluídas hoje
- [ ] Filtros: só minhas tarefas (vendedor) / por vendedor (admin)
- [ ] Estados vazios: "nada atrasado 🎉" e "tarefas do dia concluídas"
- [ ] Carrega em **< 2s com até 200 tarefas** (RNF) — uma query com os índices do `002`; thumbs de contato não bloqueiam render
- [ ] Otimista: marcar como concluída não espera o servidor (com rollback e toast de erro)

## Cadências e lembretes (P1 → `015`)

- [ ] RF-33 cadência por etapa · RF-34 alerta de negócio parado · RF-35 resumo diário 8h · RF-36 templates

---

**✅ Critérios de aceite:** US-01 e US-02 completos; nenhum negócio aberto sem próxima ação em nenhum caminho de código; "Hoje" < 2s com 200 tarefas; rotina diária executável só com o polegar.
