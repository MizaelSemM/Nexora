import { Prisma } from "@/lib/generated/prisma/client";
import { prismaBase } from "@/lib/prisma";
import { requireTenantContext, type TenantContext } from "@/lib/tenant-context";

/**
 * Client de tenant — isolamento multi-tenant automático (tarefa 004).
 *
 * Estende o Prisma Client para que TODA consulta de dados de conta seja presa
 * ao `account_id` do contexto da requisição:
 *
 * - leituras (find, count, aggregate, groupBy): injeta `where.accountId`;
 * - creates: carimba `accountId` (ignora valor forjado pelo chamador);
 * - updates/deletes: exige que o registro seja da própria conta (senão não
 *   encontra → P2025 / count 0) e não deixa mover registro para outra conta;
 * - Account (a própria conta): leitura/update só da própria; create/delete são
 *   operações de sistema (use `prismaBase`).
 *
 * LIMITAÇÃO CONHECIDA: a injeção é feita nas operações top-level. Escritas
 * aninhadas (ex.: `deal.update({ data: { tasks: { create: ... } } })`) não são
 * reescritas — crie os registros filhos em operações separadas dentro de
 * `$transaction`. (Um create aninhado sem accountId falha no banco com NOT
 * NULL; ids são cuid() e leituras cruzadas são bloqueadas, então não há
 * vazamento silencioso.)
 *
 * `$queryRaw`/`$executeRaw` NÃO passam por aqui (não são operações de model):
 * são bloqueados no ESLint. Se um dia forem inevitáveis, escreva um wrapper
 * revisado aqui e filtre `account_id` explicitamente.
 */

/** Models (nome como o Prisma expõe) que pertencem a uma conta. */
export const TENANT_MODELS = [
  "account",
  "user",
  "contact",
  "pipeline",
  "stage",
  "deal",
  "task",
  "note",
  "timelineEvent",
  "messageTemplate",
  "lostReason",
  "cadenceRule",
] as const;

/** Models globais sem coluna `account_id` (a própria conta: `id` É o tenant). */
export const MODELS_WITHOUT_ACCOUNT_ID = ["Account"] as const;

export class TenantIsolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantIsolationError";
  }
}

const READ_OPERATIONS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

const CREATE_OPERATIONS = new Set(["create", "createMany", "createManyAndReturn"]);
const UPDATE_OPERATIONS = new Set(["update", "updateMany", "updateManyAndReturn"]);
const DELETE_OPERATIONS = new Set(["delete", "deleteMany"]);

type Args = Record<string, unknown>;

function withAccountId(where: unknown, accountId: string): Args {
  return { ...((where as Args | undefined) ?? {}), accountId };
}

function stampAccountId(data: unknown, accountId: string): unknown {
  if (Array.isArray(data)) return data.map((row) => stampAccountId(row, accountId));
  if (data && typeof data === "object") return { ...(data as Args), accountId };
  return data;
}

function hardenAccountModel(operation: string, args: Args, accountId: string): void {
  if (READ_OPERATIONS.has(operation) || UPDATE_OPERATIONS.has(operation)) {
    const where = (args.where as Args | undefined) ?? {};
    if (typeof where.id === "string" && where.id !== accountId) {
      throw new TenantIsolationError("Acesso a outra conta bloqueado pelo client de tenant.");
    }
    args.where = { ...where, id: accountId };
    if (UPDATE_OPERATIONS.has(operation)) {
      const data = args.data as Args | undefined;
      if (data && typeof data.id === "string" && data.id !== accountId) {
        throw new TenantIsolationError("Não é permitido trocar o id da conta.");
      }
    }
    return;
  }
  throw new TenantIsolationError(
    `Operação "${operation}" em Account não é permitida pelo client de conta — use prismaBase (sistema).`,
  );
}

/** Reescreve os argumentos da operação conforme as regras de isolamento. */
export function hardenArgs(model: string, operation: string, args: Args, accountId: string): void {
  if (model === "Account") {
    hardenAccountModel(operation, args, accountId);
    return;
  }

  if (READ_OPERATIONS.has(operation)) {
    args.where = withAccountId(args.where, accountId);
    return;
  }

  if (CREATE_OPERATIONS.has(operation)) {
    args.data = stampAccountId(args.data, accountId);
    return;
  }

  if (operation === "upsert") {
    args.where = withAccountId(args.where, accountId);
    args.create = { ...((args.create as Args | undefined) ?? {}), accountId };
    if (args.update) args.update = { ...(args.update as Args), accountId };
    return;
  }

  if (UPDATE_OPERATIONS.has(operation)) {
    args.where = withAccountId(args.where, accountId);
    if (args.data) args.data = { ...(args.data as Args), accountId };
    return;
  }

  if (DELETE_OPERATIONS.has(operation)) {
    args.where = withAccountId(args.where, accountId);
  }
}

function tenantIsolationExtension(accountId: string) {
  return Prisma.defineExtension({
    name: "tenant-isolation",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          hardenArgs(model, operation, args as Args, accountId);
          const result = await query(args);
          // Upsert com filtro extra pode "engolir" conflito de unicidade e
          // devolver null (ex.: id de outra conta) — falha em silêncio é pior
          // que erro: o chamador usa create/update explícitos.
          if (operation === "upsert" && result === null) {
            throw new TenantIsolationError(
              "upsert não afetou nenhum registro (id de outra conta ou conflito de unicidade) — use create/update explícitos.",
            );
          }
          return result;
        },
      },
    },
  });
}

/** Cria um client preso a uma conta — use em testes/scripts com conta explícita. */
export function createTenantClient(accountId: string) {
  return prismaBase.$extends(tenantIsolationExtension(accountId));
}

export type TenantClient = ReturnType<typeof createTenantClient>;

// Um client estendido por contexto de request (o contexto é criado por request,
// então o cache morre junto com ele).
const clientCache = new WeakMap<TenantContext, TenantClient>();

/**
 * Client de tenant do request atual. Exige contexto ativo (`runWithTenant`).
 * Este é o client que TODO código de feature deve usar.
 */
export function tenantDb(): TenantClient {
  const context = requireTenantContext();
  let client = clientCache.get(context);
  if (!client) {
    client = createTenantClient(context.accountId);
    clientCache.set(context, client);
  }
  return client;
}
