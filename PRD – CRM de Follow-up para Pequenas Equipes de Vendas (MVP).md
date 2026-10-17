# PRD – CRM de Follow-up para Pequenas Equipes de Vendas (MVP)

**Versão:** 0.1 (rascunho para validação) · **Status:** Em revisão · **Data:** 17/10/2026

> **Premissas adotadas:** como você não definiu o segmento, assumi o problema mais comum e doloroso: pequenas empresas brasileiras (2 a 15 vendedores) que vendem por WhatsApp, indicação e Instagram, e perdem vendas por falta de follow-up. Se o seu caso for outro, as seções 2, 3 e 7 são as que mais mudam.

## 1. Resumo executivo

A maioria das pequenas empresas controla vendas em planilha, caderno ou na memória do WhatsApp. CRMs tradicionais (HubSpot, Pipedrive, RD Station) resolvem em teoria, mas falham na prática: o vendedor não atualiza, o dado fica velho e o gestor para de confiar no sistema.

**Produto proposto:** um CRM que não pede para o vendedor "alimentar o sistema". Ele diz ao vendedor **quem ele precisa chamar hoje e por quê**, e transforma cada contato em uma ação de um clique. O valor percebido pelo vendedor vem no primeiro dia, não depois de semanas de cadastro.

**Tese central:** CRM é adotado quando ajuda o vendedor a vender mais hoje, não quando entrega relatório ao gestor amanhã.

## 2. Problema

### 2.1 Declaração do problema

Vendedores de pequenas empresas perdem negociações não porque o cliente disse "não", mas porque ninguém voltou a falar com ele no momento certo. O gestor não enxerga isso e só descobre no fim do mês.

### 2.2 Evidências a coletar (hipóteses a confirmar nas entrevistas)

- Uma parcela relevante dos leads recebidos nunca recebe segundo contato.
- O tempo de primeira resposta passa de várias horas, especialmente fora do horário comercial.
- Quando o vendedor sai da empresa, a carteira de contatos vai embora junto.
- O gestor não sabe quanto tem em negociação nem o que vai fechar no mês.

### 2.3 Alternativas atuais e por que falham

| Alternativa | Por que falha |
| --- | --- |
| Planilha | Não lembra ninguém de nada; fica desatualizada em dias |
| WhatsApp puro | Sem funil, sem histórico estruturado, dados presos no celular do vendedor |
| CRM grande (HubSpot, Pipedrive) | Complexo, caro em dólar, exige disciplina de preenchimento |
| Caderno/memória | Não escala e não é auditável |

## 3. Usuários e personas

**Vendedor (usuário principal)** Tem de 20 a 60 conversas abertas, trabalha pelo celular, odeia burocracia. Sucesso = abrir o app de manhã e saber exatamente quem chamar.

**Dono/gestor comercial (comprador)** Quer previsibilidade e não perder carteira. Sucesso = ver em 30 segundos quanto há no funil, o que está parado e quem não está fazendo follow-up.

**Fora do escopo de persona no MVP:** times grandes, vendas complexas B2B com múltiplos decisores, pós-venda.

## 4. Objetivos e métricas de sucesso

### 4.1 Objetivos do MVP

1. Garantir que nenhum lead fique sem follow-up planejado.
2. Dar ao vendedor uma rotina diária de 5 minutos que ele realmente use.
3. Dar ao gestor visibilidade confiável do funil sem pedir relatórios.

### 4.2 Métricas

| Métrica | Tipo | Meta do MVP (a calibrar) |
| --- | --- | --- |
| % de vendedores que abrem o sistema em dias úteis | Adoção (principal) | ≥ 70% após 2 semanas |
| % de negócios abertos com próxima ação agendada | Qualidade de uso | ≥ 90% |
| % de tarefas do dia concluídas | Engajamento | ≥ 60% |
| Tempo de cadastro de um novo lead | Fricção | < 20 segundos |
| Negócios sem contato há mais de 7 dias | Resultado | Redução de 50% vs. baseline |
| Taxa de conversão do funil | Resultado de negócio | Comparar com baseline de 30 dias antes |

**Métrica norte:** negócios com próxima ação agendada e executada no prazo.

## 5. Não-objetivos (MVP)

- Automação de marketing e e-mail em massa
- Integração oficial com WhatsApp Business API (entra na Fase 2)
- Emissão de proposta, contrato e cobrança
- Relatórios customizáveis, metas e comissões
- Permissões granulares e múltiplas equipes
- App nativo (o MVP é web responsivo/PWA)

## 6. Princípios de produto

1. **Zero cadastro inútil:** só pedir o que gera ação. Nome e telefone bastam para criar um lead.
2. **Próxima ação sempre:** nenhum negócio aberto existe sem uma próxima ação com data.
3. **Mobile primeiro:** o vendedor está na rua ou no balcão.
4. **Um clique para agir:** abrir conversa no WhatsApp, ligar e registrar resultado sem sair do fluxo.
5. **O gestor vê sem pedir:** painel automático, nunca relatório preenchido.

## 7. Escopo do MVP: requisitos funcionais

Prioridade: **P0** = obrigatório para lançar · **P1** = importante · **P2** = desejável.

### 7.1 Autenticação e conta

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-01 | Cadastro e login por e-mail e senha, com recuperação de senha | P0 |
| RF-02 | Conta (empresa) com múltiplos usuários isolados por `account_id` | P0 |
| RF-03 | Dois papéis: **Admin** (vê tudo, configura) e **Vendedor** (vê os próprios negócios) | P0 |
| RF-04 | Convite de vendedor por link ou e-mail | P0 |
| RF-05 | Login com Google | P2 |

### 7.2 Captura de leads (entrada rápida)

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-10 | Cadastro rápido: nome + telefone, o resto opcional | P0 |
| RF-11 | Importação de CSV com mapeamento de colunas e detecção de duplicados por telefone | P0 |
| RF-12 | Formulário público embutível/link (captura de leads do site ou Instagram) que cria lead e tarefa de primeiro contato | P0 |
| RF-13 | Botão "Abrir no WhatsApp" (link `wa.me`) em todo contato | P0 |
| RF-14 | Campo de origem do lead (Instagram, indicação, site, loja, outro) | P1 |

### 7.3 Funil e negócios

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-20 | Funil padrão pré-configurado: Novo → Contatado → Proposta enviada → Negociação → Ganho/Perdido | P0 |
| RF-21 | Kanban com arrastar e soltar (e alternativa em lista no celular) | P0 |
| RF-22 | Negócio com valor, contato, etapa, responsável e data prevista de fechamento | P0 |
| RF-23 | Fechar como ganho ou perdido; perdido exige motivo (lista editável) | P0 |
| RF-24 | Admin edita nome e ordem das etapas | P1 |
| RF-25 | Reabrir negócio fechado | P1 |

### 7.4 Motor de follow-up (diferencial do produto)

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-30 | Todo negócio aberto exige **próxima ação** com data; ao concluir uma tarefa, o sistema pede a próxima (com atalhos: amanhã, 3 dias, 1 semana) | P0 |
| RF-31 | Tela **"Hoje"**: lista priorizada de quem chamar (atrasados primeiro, depois do dia), com botões de WhatsApp, ligar e concluir | P0 |
| RF-32 | Ao concluir uma tarefa, registro rápido do resultado: "Respondeu", "Não respondeu", "Pediu para voltar em…", "Fechou", "Perdeu" | P0 |
| RF-33 | Regras de cadência por etapa (ex.: Proposta enviada → follow-up automático em 2 dias) que geram tarefas sozinhas | P1 |
| RF-34 | Alerta de negócio parado: sem atividade há X dias (configurável) | P1 |
| RF-35 | Lembretes por e-mail/push (resumo diário às 8h com tarefas do dia) | P1 |
| RF-36 | Modelos de mensagem (templates) com variáveis como {nome}, copiáveis ou enviados direto ao WhatsApp | P1 |

### 7.5 Histórico e contexto

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-40 | Linha do tempo por contato/negócio (notas, tarefas, mudanças de etapa) | P0 |
| RF-41 | Notas rápidas, com opção de ditado por voz do teclado | P0 |
| RF-42 | Busca global por nome ou telefone | P0 |
| RF-43 | Tags e filtros por origem, etapa, responsável | P1 |

### 7.6 Painel do gestor

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-50 | Valor total no funil por etapa e previsão de receita do mês (valor × probabilidade da etapa) | P0 |
| RF-51 | Negócios parados e leads sem próxima ação | P0 |
| RF-52 | Atividade por vendedor: tarefas feitas vs. atrasadas | P0 |
| RF-53 | Funil de conversão e principais motivos de perda | P1 |
| RF-54 | Exportar dados em CSV (a empresa é dona dos dados) | P1 |

## 8. User stories e critérios de aceite (principais)

**US-01 – Vendedor começa o dia** Como vendedor, quero abrir a tela "Hoje" e ver quem preciso chamar, para não depender da memória.

- Dado que tenho tarefas vencidas e do dia, quando abro o app, então vejo primeiro as atrasadas, destacadas, e depois as de hoje.
- Quando toco em "WhatsApp", abre a conversa com o número do contato e uma mensagem sugerida opcional.
- A tela carrega em menos de 2 segundos com até 200 tarefas.

**US-02 – Vendedor registra resultado sem burocracia** Como vendedor, quero registrar o resultado do contato em dois toques e já agendar o próximo.

- Ao concluir a tarefa, aparecem as opções de resultado e os atalhos de data.
- Não é possível concluir sem definir a próxima ação, a menos que o negócio seja marcado como ganho ou perdido.

**US-03 – Vendedor cadastra lead na hora** Como vendedor, quero criar um lead só com nome e telefone, para não perder o momento da conversa.

- Cadastro concluído com 2 campos em menos de 20 segundos.
- Telefone duplicado exibe aviso e oferece abrir o contato existente.
- O sistema cria automaticamente um negócio na etapa "Novo" e uma tarefa de primeiro contato para hoje.

**US-04 – Gestor vê o funil** Como gestor, quero ver o valor por etapa e os negócios parados, para agir antes de perder a venda.

- O painel mostra valor por etapa, previsão do mês e lista de negócios sem atividade há mais de X dias.
- Clicar em um vendedor mostra suas tarefas atrasadas.

**US-05 – Gestor redistribui carteira** Como gestor, quero reatribuir negócios de um vendedor para outro, para não perder carteira quando alguém sai.

- Admin seleciona negócios em lote e troca o responsável; o histórico é preservado.

**US-06 – Empresa importa base existente** Como admin, quero importar minha planilha de contatos, para começar sem digitar tudo de novo.

- O upload de CSV mostra pré-visualização e mapeamento de colunas.
- Relatório final informa quantos foram importados, ignorados e duplicados.

## 9. Fluxos principais

**Fluxo diário do vendedor** Abre "Hoje" → toca em WhatsApp → conversa → volta ao app → registra resultado → define próxima ação → próximo contato.

**Fluxo de novo lead** Lead chega (formulário, importação ou cadastro manual) → negócio criado em "Novo" → tarefa "Primeiro contato" para hoje → vendedor contata → move de etapa → cadência automática gera os follow-ups seguintes.

**Fluxo de fechamento** Negociação → marcar ganho (valor final confirmado) ou perdido (motivo obrigatório) → alimenta o painel e os motivos de perda.

## 10. Modelo de dados

Todas as tabelas têm `id`, `account_id`, `created_at`, `updated_at`. Exclusão lógica (`deleted_at`) em contatos e negócios.

| Entidade | Campos principais |
| --- | --- |
| **accounts** | nome, plano, timezone |
| **users** | nome, email, senha\_hash, papel (admin/vendedor), ativo |
| **contacts** | nome, telefone (normalizado E.164), email, empresa\_texto, origem, owner\_id, tags |
| **pipelines / stages** | nome, ordem, probabilidade, cadência\_padrão |
| **deals** | título, valor, stage\_id, contact\_id, owner\_id, data\_prevista, status, motivo\_perda\_id, last\_activity\_at, next\_action\_at |
| **tasks** | tipo (whatsapp, ligação, reunião, outro), título, vence\_em, concluída\_em, resultado, deal\_id, owner\_id |
| **notes** | texto, deal\_id, contact\_id, autor\_id |
| **timeline\_events** | tipo, payload, deal\_id, contact\_id, autor\_id (log imutável) |
| **message\_templates** | nome, texto com variáveis, etapa\_sugerida |
| **lost\_reasons** | nome, ativo |
| **cadence\_rules** (P1) | stage\_id, dias\_após\_entrada, tipo\_tarefa, template\_id |

Observações: `next_action_at` e `last_activity_at` ficam denormalizados em `deals` para que a tela "Hoje" e o alerta de parados sejam rápidos.

No Prisma, `papel`, `status` e `tipo` de tarefa viram enums; o telefone é único por conta (`account_id` + `telefone`); e os campos `next_action_at` e `last_activity_at` têm índice composto com `account_id` e `owner_id`.

## 11. Requisitos não funcionais

- **Performance:** telas principais em menos de 2s em 4G; kanban fluido até 500 negócios abertos por conta.
- **Mobile:** responsivo e instalável como PWA; botões grandes e uso com uma mão.
- **Segurança:** HTTPS, senhas com hash forte, isolamento por `account_id` em todas as consultas (via extensão do Prisma Client que injeta o filtro; RLS do Postgres como camada extra opcional), backups diários.
- **LGPD:** base legal e termos de uso claros, o cliente é controlador dos dados dos seus contatos e o produto é operador; exportação e exclusão de dados por solicitação; registro de quem acessou/alterou.
- **Disponibilidade:** meta de 99,5% no MVP.
- **Idioma e localização:** pt-BR, fuso horário por conta, telefones no padrão brasileiro com DDD.
- **Observabilidade:** log de erros e analytics de produto (eventos de uso) desde o dia 1, pois as métricas de adoção dependem deles.

## 12. Telas

1. Login / cadastro / convite
2. **Hoje** (tela inicial do vendedor)
3. Kanban de negócios (e visão em lista)
4. Detalhe do negócio e do contato (linha do tempo, tarefas, notas)
5. Contatos (busca, filtros, importação)
6. Painel do gestor
7. Configurações: etapas, motivos de perda, templates, cadências, usuários

## 13. Stack técnica

| Camada | Tecnologia | Uso no produto |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | PWA, Server Components, Server Actions e Route Handlers (formulário público, webhooks futuros) |
| Interface | Tailwind CSS + shadcn/ui | Componentes de formulário, tabela, diálogo, sheet (mobile), command (busca global) e calendário; acessibilidade pronta |
| Banco de dados | PostgreSQL | Dados transacionais, hospedado em Neon, Railway ou outro Postgres gerenciado |
| ORM | Prisma | Schema, migrations, client tipado e extensão de escopo por `account_id` |
| Validação | Zod | Um schema por entidade, compartilhado entre formulários, Server Actions, formulário público e importação de CSV |
| Gráficos | Recharts | Painel do gestor: valor por etapa, funil de conversão e motivos de perda |
| Kanban | dnd-kit | Arrastar e soltar entre etapas, com alternativa em lista no celular |
| Autenticação | Auth.js (credenciais + convite) com Prisma Adapter | Login, sessão e papéis; alternativa: Better Auth |
| Jobs agendados | Vercel Cron ou pg-boss | Cadências automáticas, alertas de parados e resumo diário |
| E-mail | Resend | Convites, recuperação de senha e resumo diário |
| Observabilidade | Sentry + PostHog | Erros e métricas de adoção da seção 4 |
| Testes | Vitest + Playwright | Regras de negócio e fluxo "Hoje"; teste de isolamento entre contas |
| Deploy | Vercel + Postgres gerenciado | Preview por pull request |

O que essa stack muda no produto:

- **Isolamento entre contas:** não há Row Level Security pronta como em um backend gerenciado. Toda consulta passa por uma extensão do Prisma Client que injeta `account_id` em leituras e escritas, com testes automatizados que tentam acessar dados de outra conta. RLS do Postgres pode entrar depois como segunda camada.
- **Validação em um só lugar:** os schemas Zod ficam em `lib/schemas`, geram os tipos TypeScript e validam toda entrada no servidor, inclusive o formulário público (com limite de requisições) e as linhas do CSV importado.
- **Autenticação:** não estava na lista informada; assumi Auth.js com senha em argon2 ou bcrypt. Confirmar antes do início, pois a escolha afeta convites e recuperação de senha.
- **Desempenho do "Hoje":** índices compostos em `deals` e `tasks` por (`account_id`, `owner_id`, `next_action_at`) e consultas agregadas do painel feitas no servidor, com Recharts recebendo apenas dados já resumidos.

## 14. Roadmap

| Fase | Prazo estimado | Entregas |
| --- | --- | --- |
| **MVP (P0)** | 5 a 6 semanas | Auth, contatos, kanban, tarefas e tela "Hoje", linha do tempo, importação CSV, painel básico, formulário público |
| **MVP+ (P1)** | +3 a 4 semanas | Cadências automáticas, alertas de parados, templates, resumo diário, motivos de perda e exportação |
| **Fase 2** | Após validação | Integração WhatsApp Business API (histórico automático das conversas), integração com calendário, app instalável com push |
| **Fase 3** | Futuro | Metas e comissões, múltiplos funis, relatórios avançados, automações condicionais |

**Por que o WhatsApp oficial fica na Fase 2:** a integração é cara, depende de aprovação e custos por conversa, e não é preciso para provar a tese. No MVP, o `wa.me` entrega 80% do valor com 5% do esforço. A contrapartida é que a conversa em si não fica registrada, então o vendedor registra o resultado manualmente, o que reforça a importância dos atalhos de resultado.

## 15. Plano de validação

1. **Antes de construir:** 10 a 15 entrevistas com donos de pequenas empresas e vendedores. Perguntas-chave: como controlam leads hoje, quantos leads perdem, o que já tentaram, quanto pagariam.
2. **Protótipo clicável (Figma)** da tela "Hoje" e do kanban para testar o conceito com 5 pessoas.
3. **Piloto com 3 a 5 empresas** por 3 semanas, com acompanhamento semanal.
4. **Critério de sucesso do piloto:** ≥ 70% dos vendedores usando em dias úteis e ≥ 2 empresas dizendo que não voltariam à planilha.
5. **Critério de falha/pivô:** se o vendedor só usa quando o gestor cobra, o problema é de proposta de valor e não de funcionalidade.

## 16. Modelo de negócio (hipótese)

- Assinatura mensal por usuário em reais, com faixa de entrada acessível para pequenas empresas.
- Teste gratuito de 14 dias, sem cartão.
- Diferenciais de preço: cobrança em BRL, nota fiscal, suporte em português e por WhatsApp.

Valores específicos devem sair das entrevistas (disposição a pagar), não de suposição.

## 17. Riscos e mitigações

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Vendedor não registra resultados | Alto | Atalhos de dois toques, tarefa "Hoje" como motivo de uso, gestor vê só o essencial |
| Sem integração WhatsApp, o histórico fica incompleto | Médio | Tratar como limitação assumida do MVP e priorizar na Fase 2 |
| Concorrência de CRMs consolidados | Médio | Foco em simplicidade, preço em reais, nicho de vendas por WhatsApp |
| Dados mal isolados entre contas | Alto | Extensão do Prisma que escopa toda consulta por conta desde o início e testes automatizados de isolamento |
| Escopo crescer durante o desenvolvimento | Alto | Congelar P0, só aceitar mudanças com troca de item |
| Conformidade com LGPD | Médio | Termos, exportação/exclusão e registro de acessos desde o MVP |

## 18. Perguntas em aberto

1. Qual segmento de entrada? (varejo, serviços, imobiliário, clínicas, infoprodutos). A escolha muda templates, etapas padrão e linguagem.
2. O produto será SaaS multi-empresa desde o início ou uso interno de uma empresa?
3. Vendedores usam majoritariamente o celular pessoal ou computador?
4. Existe base de contatos para importar no piloto?
5. Qual o orçamento e a equipe disponíveis para o MVP?
6. Há necessidade de fluxo de proposta/orçamento já no MVP?

## 19. Critérios de lançamento do MVP

- Todos os requisitos P0 implementados e testados
- Isolamento entre contas validado
- Importação de CSV com 5.000 linhas sem falha
- Tela "Hoje" abrindo em menos de 2s em celular intermediário
- Analytics de adoção funcionando
- Termos de uso e política de privacidade publicados
- Pelo menos 3 empresas do piloto onboardadas
