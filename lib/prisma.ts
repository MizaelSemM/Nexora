import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";
import { env } from "@/lib/env";

/**
 * Instância única do Prisma Client (Prisma 7 + driver adapter do Postgres).
 *
 * ⚠️ Na tarefa 004 esta instância será EXTENDIDA para injetar `account_id` em
 * toda consulta. Não use este client "cru" em código de domínio — ele é a base.
 *
 * Em dev o Next recarrega os módulos a cada mudança; o cache em globalThis
 * evita abrir um pool de conexões novo a cada reload.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
