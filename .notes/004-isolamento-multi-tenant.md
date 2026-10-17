# 004 · Isolamento multi-tenant (account_id em toda consulta)

**Requisitos:** RNF de segurança (seção 11) + risco "Dados mal isolados entre contas" (seção 17)
**Prioridade:** P0 · **Depende de:** 002, 003 (sessão) · **Bloqueia:** lançamento (`016`)

> **Por que é tarefa própria:** a stack escolhida não tem Row Level Security pronta; o PRD trata o isolamento como **risco alto**. Fazer agora é barato; retrofitar depois é caro e arriscado.

---

## Implementação

- [ ] Definir a fonte do `account_id` por request: **sessão → contexto do servidor** (AsyncLocalStorage). **Nunca** aceitar `account_id` vindo do client
- [ ] Implementar extensão do Prisma Client (`$extends`) que:
  - injeta filtro `account_id` em `findMany`, `findFirst`, `findUnique`, `count`, `aggregate`
  - carimba `account_id` em `create`
  - bloqueia `update`/`delete` de registro de outra conta (verificar dono antes)
- [ ] Bloquear `prisma.$queryRaw` cru; se inevitável, wrapper revisado e com filtro explícito
- [ ] Documentar a regra no `README`: **toda** query passa pelo client estendido, nunca pelo Prisma "puro"

## Testes automatizados (obrigatórios no CI)

- [ ] Factory que cria 2 contas distintas com dados completos (contatos, negócios, tarefas, notas)
- [ ] Teste por entidade: tentar **ler**, **listar**, **atualizar** e **deletar** dados da conta B estando na conta A → deve retornar vazio / falhar
- [ ] Teste de create: tentar criar registro forjando `account_id` da conta B → deve ser carimbado com a conta A ou rejeitado
- [ ] Teste de regressão estrutural: novo model Prisma sem `account_id` **quebra o build**

## Segunda camada (decisão no `000`)

- [ ] Avaliar RLS do Postgres como camada extra (o PRD deixa como opcional)

---

**✅ Critério de aceite:** suíte de isolamento verde e rodando no CI a cada PR — este é um critério de lançamento do MVP (seção 19).
