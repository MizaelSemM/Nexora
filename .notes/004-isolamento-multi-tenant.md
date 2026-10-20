# 004 · Isolamento multi-tenant (account_id em toda consulta)

**Requisitos:** RNF de segurança (seção 11) + risco "Dados mal isolados entre contas" (seção 17)
**Prioridade:** P0 · **Depende de:** 002, 003 (sessão) · **Bloqueia:** lançamento (`016`)

> **Por que é tarefa própria:** a stack escolhida não tem Row Level Security pronta; o PRD trata o isolamento como **risco alto**. Fazer agora é barato; retrofitar depois é caro e arriscado.

---

## Implementação

- [x] Fonte do `account_id` por request: **contexto do servidor** via `AsyncLocalStorage` (`lib/tenant-context.ts` — `runWithTenant`). **Nunca** vem do client; a 003 abre o contexto com a sessão
- [x] Extensão do Prisma Client (`$extends`) em `lib/tenant-prisma.ts` que:
  - injeta filtro `account_id` em `findMany`, `findFirst`, `findUnique`, `count`, `aggregate`, `groupBy`
  - carimba `account_id` em `create`/`createMany`/`upsert` (ignora valor forjado pelo chamador)
  - bloqueia `update`/`delete` de registro de outra conta (where mesclado → P2025 / count 0)
  - `Account` (a própria conta): leitura/update só da própria; criação/exclusão exigem `prismaBase`
  - `upsert` que devolver `null` (conflito de unicidade ou id de outra conta) vira erro explícito
- [x] `prisma.$queryRaw*`/`$executeRaw*` bloqueados no ESLint (`no-restricted-properties`); wrapper revisado, se um dia necessário
- [x] Regra documentada no `README`: **toda** query de dados de conta passa por `tenantDb()` (`prismaBase` = operações de sistema)

## Testes automatizados (obrigatórios no CI)

- [x] Factory que cria 2 contas distintas com dados completos (contatos, negócios, tarefas, notas) — `seedAccount()` no teste de integração
- [x] Teste por entidade: tentar **ler**, **listar**, **atualizar** e **deletar** dados da conta B estando na conta A → vazio / null / falha (P2025)
- [x] Teste de create: tentar criar registro forjando `account_id` da conta B → carimbado com a conta A
- [x] Teste de regressão estrutural: novo model Prisma sem `account_id` **quebra a suíte** (gate do CI)

## Segunda camada (decisão no `000`)

- [ ] Adiado para pós-MVP (decisão registrada no `000`)

---

**✅ Critério de aceite:** suíte de isolamento verde e rodando no CI a cada PR — este é um critério de lançamento do MVP (seção 19).

---

## 📝 Registro (17/10/2026 — concluída)

- **Arquitetura:** `lib/tenant-context.ts` (AsyncLocalStorage + `runWithTenant`/`requireTenantContext`) e `lib/tenant-prisma.ts` (`createTenantClient(accountId)` para testes/scripts + `tenantDb()` para requests — client cacheado por contexto via `WeakMap`). A 003 só precisa abrir o contexto no início de cada request.
- **Extensão `tenant-isolation`:** leituras → `where.accountId` injetado; creates → carimbo (valor forjado é ignorado); updates/deletes → where mesclado (cross-account = P2025 / count 0); updates não movem registro para outra conta; `Account` só acessa a própria conta (id de outra → erro); `upsert` que devolver `null` → `TenantIsolationError`.
  - **Achado na prática:** upsert com filtro extra **engole conflito de unicidade e devolve `null` em silêncio** (comportamento do Prisma 7) — convertido em erro explícito na extensão.
- **Bypasses fechados:** `$queryRaw`/`$queryRawUnsafe`/`$executeRaw`/`$executeRawUnsafe` bloqueados no ESLint; `prismaBase` documentado como client de sistema (onboarding/auth/scripts).
- **Testes (28 verdes no total; 15 novos):** `tenant-context` (3), regressão estrutural do schema (3 — novo model sem `accountId` ou fora de `TENANT_MODELS` quebra), integração contra o banco real (9 — duas contas completas, leitura/listagem/update/delete cruzado por entidade, create forjado, upsert, transação interativa, `Account`, `tenantDb()`).
- **⚠ Pendência do critério de aceite:** a suíte roda local (`npm test`) mas ainda **não roda no CI** — o pipeline é pendência da 001/014. Ao montar o CI, decidir o banco: serviço Postgres do runner ou banco de testes dedicado.
- **Limitação conhecida (documentada no código):** injeção é top-level; **escritas aninhadas** (ex.: `deal.update({ data: { tasks: { create: ... } } })`) não são reescritas — crie filhos em operações separadas dentro de `$transaction`. Não há vazamento silencioso: create aninhado sem `accountId` falha com NOT NULL e ids são `cuid()` (não adivinháveis).

---

## 🔄 Atualização pela 003 (17/10/2026)

- `TENANT_MODELS` agora lista **só models com `account_id` de tenant**: saiu `account`, entrou `invite`. Nasceu `GLOBAL_MODELS` = `["Account", "Session", "AuthAccount", "Verification"]` (conta + tabelas do Better Auth).
- O guard do client de tenant ficou **fail-closed**: operar um model global (ex.: `session`) via `tenantDb()` lança `TenantIsolationError`; um model novo no schema que não esteja nas duas listas **também lança** — nada "escapa" por esquecimento.
- O teste estrutural passou a provar a **partição**: `TENANT_MODELS` ∪ `GLOBAL_MODELS` = exatamente todos os models do schema, sem sobreposição (23 unit/integração verdes em conjunto com a suíte da 003; 53 no total).
- Comprovação em integração (`tests/integration/auth-flow.test.ts`): `session`/`authAccount`/`verification` lançam erro pelo client de tenant; convites criados por ele nascem com `account_id` carimbado.

---

## 🔄 Atualização de CI (20/10/2026)

- Workflow criado em `.github/workflows/ci.yml`, disparado em `pull_request` e `push` na `master`.
- Job único com **Postgres 17 efêmero** no runner (sem secrets externos), `prisma generate` + `prisma migrate deploy`, depois `format:check`, lint, typecheck, `npm test` (unit + integração) e build de produção.
- O banco de teste é descartado ao fim do job; a suíte de isolamento roda contra um banco limpo a cada PR.
- **Correção após o 1º run (20/10/2026):** `npm run typecheck` passou a executar `next typegen && tsc --noEmit`. Os tipos `PageProps`/`LayoutProps` e o `next-env.d.ts` são gerados pelo Next 16 e não existem em um checkout limpo — o CI falhava antes do primeiro `next build`.
- ⏳ **Critério de aceite:** aguardando a primeira execução verde no GitHub Actions após o push. O run local equivalente já passou (53 testes, lint, typecheck do zero, format e build ✓).
