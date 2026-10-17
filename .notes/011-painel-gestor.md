# 011 · Painel do gestor

**Requisitos:** RF-50, RF-51, RF-52 (P0) · RF-53, RF-54 (P1 → `015`) · US-04, US-05
**Prioridade:** P0 · **Depende de:** 002, 006, 007, 008 (dados denormalizados) · **Bloqueia:** `016`

> **Princípio 5 do produto: "o gestor vê sem pedir".** Nenhum dado aqui pode depender de relatório preenchido à mão.

---

## Indicadores P0

- [ ] Agregações feitas **no servidor** (Recharts recebe só o resumo, nunca a lista crua de negócios)
- [ ] **Valor e quantidade por etapa** (barras por etapa do funil) (RF-50)
- [ ] **Previsão de receita do mês** = Σ(valor × probabilidade da etapa) — mostrar a fórmula na tela para gerar confiança
- [ ] **Negócios parados** (RF-51): sem atividade há X dias (X configurável, padrão 7) — lista clicável com dias parados
- [ ] **Leads/negócios sem próxima ação** (RF-51): deveria ser zero; exibir como alerta operacional e não só como lista
- [ ] **Atividade por vendedor** (RF-52): tarefas concluídas vs. atrasadas na semana; clicar no vendedor abre a lista de tarefas atrasadas dele (US-04)
- [ ] Filtro de período simples (mês atual / últimos 30 dias)
- [ ] Visão "como está o mês": total no funil, previsão, parados e tarefas atrasadas no topo (30 segundos de leitura)

## Gestão de carteira (US-05)

- [ ] **Reatribuição em lote** de negócios entre vendedores (selecionar vários → trocar responsável)
- [ ] Histórico preservado: eventos antigos mantêm o autor original; a troca gera evento "responsável alterado"
- [ ] Reatribuição disponível também no detalhe do negócio (individual)

## Performance e acesso

- [ ] Carrega em **< 2s** com centenas de negócios: queries agregadas + índices do `002` + cache curto (ex.: 60s)
- [ ] Somente **Admin** acessa o painel; vendedor que tentar por URL é redirecionado
- [ ] Estado vazio com orientação ("cadastre seus vendedores e negócios para ver o funil")

## P1 (ver `015`)

- [ ] RF-53 funil de conversão e top motivos de perda · RF-54 exportação CSV dos dados da conta

---

**✅ Critérios de aceite (US-04):** gestor responde em 30s a "quanto tem no funil, o que está parado e quem não está fazendo follow-up"; clicar em um vendedor mostra as tarefas atrasadas dele; reatribuir em lote funciona sem perder histórico.
