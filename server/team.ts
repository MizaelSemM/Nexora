import { prismaBase } from "@/lib/prisma";
import { tenantDb } from "@/lib/tenant-prisma";
import { AppError } from "@/server/errors";

/**
 * Gestão de equipe (RF-02/RF-03) — desativar/reativar vendedores sem apagar
 * histórico. Requer contexto de tenant (`withAdmin`); o recorte por conta vem
 * do client de tenant, nunca de parâmetro do client.
 */

export async function listTeam() {
  const db = tenantDb();
  return db.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
}

export async function deactivateUser(input: {
  actingUserId: string;
  targetUserId: string;
}): Promise<void> {
  if (input.actingUserId === input.targetUserId) {
    throw new AppError("SELF_DEACTIVATE", "Você não pode desativar o próprio acesso.");
  }

  const db = tenantDb();
  const target = await db.user.findFirst({
    where: { id: input.targetUserId },
    select: { id: true, active: true, role: true },
  });
  if (!target) {
    throw new AppError("MEMBER_NOT_FOUND", "Usuário não encontrado nesta conta.");
  }
  if (!target.active) return;

  if (target.role === "ADMIN") {
    const activeAdmins = await db.user.count({ where: { role: "ADMIN", active: true } });
    if (activeAdmins <= 1) {
      throw new AppError(
        "LAST_ADMIN",
        "Este é o único administrador ativo da conta. Ative outro administrador antes de desativá-lo.",
      );
    }
  }

  await db.user.update({ where: { id: target.id }, data: { active: false } });

  // Derruba as sessões abertas. Defesa em profundidade: `requireAuth` também
  // barra usuário inativo e `session.create.before` barra novo login.
  await prismaBase.session.deleteMany({ where: { userId: target.id } });
}

export async function reactivateUser(input: { targetUserId: string }): Promise<void> {
  const db = tenantDb();
  const result = await db.user.updateMany({
    where: { id: input.targetUserId },
    data: { active: true },
  });
  if (result.count === 0) {
    throw new AppError("MEMBER_NOT_FOUND", "Usuário não encontrado nesta conta.");
  }
}
