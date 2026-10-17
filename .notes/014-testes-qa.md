# 014 · Testes e QA

**Requisitos:** seção 13 (Vitest + Playwright), seção 19 (critérios de lançamento)
**Prioridade:** P0 · **Depende de:** 001 (setup) · cobre 003–011 · **Bloqueia:** `016`

---

## Unitário (Vitest)

- [ ] Regra de follow-up: negócio aberto **nunca** fica sem próxima ação (criar, mover etapa, editar, concluir)
- [ ] Conclusão de tarefa exige resultado/próxima ação — exceto ganho/perdido
- [ ] `createLead()`: cria contato + negócio "Novo" + tarefa para hoje; duplicado não duplica
- [ ] Normalização de telefone BR/E.164 (casos: `+55`, `0` na frente, 9º dígito, DDD inválido)
- [ ] Previsão do mês = Σ(valor × probabilidade) e demais agregações do painel
- [ ] Schemas Zod por entidade: entradas inválidas rejeitadas no servidor (não confiar no client)
- [ ] **Isolamento entre contas** (detalhado no `004`) — obrigatório no CI

## E2E (Playwright)

- [ ] Fluxo "Hoje" completo: atrasadas primeiro → WhatsApp → concluir → resultado → próxima ação → próxima tarefa
- [ ] Cadastro de lead em < 20s, incluindo aviso de duplicado (US-03)
- [ ] Kanban: arrastar entre etapas persiste após recarregar
- [ ] Fechar como perdido sem motivo é bloqueado; com motivo funciona
- [ ] Importação CSV com fixture de 5.000 linhas e relatório conferido
- [ ] Formulário público cria lead e ele aparece em "Hoje" do responsável
- [ ] Convite → cadastro → login com papel correto (vendedor não acessa painel admin)
- [ ] **Performance:** "Hoje" < 2s com 200 tarefas e 4G simulado (throttling do Playwright)

## Qualidade contínua

- [ ] CI em todo PR: `lint` + `typecheck` + unit + e2e (smoke) — nada entra com vermelho
- [ ] Seed/fixtures estáveis para os testes E2E (nunca depender de dados de produção)
- [ ] E2E rodando em viewport de celular **e** desktop
- [ ] Cobertura mínima combinada para `server/services/` (regras de negócio): ~80%

---

**✅ Critério de aceite:** suíte verde no CI cobrindo cada critério de lançamento verificável da seção 19; nenhum bug de isolamento conhecido aberto.
