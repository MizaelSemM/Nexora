import type { TenantClient } from "@/lib/tenant-prisma";
import { AppError } from "@/server/errors";

/** Usuário que executa a ação (vem SEMPRE da sessão, nunca do client). */
export type ActingUser = {
  id: string;
  role: "ADMIN" | "SELLER";
};

/**
 * Resolve o responsável de um contato/negócio (tarefa 005).
 *
 * - Sem `requestedOwnerId`, o responsável é quem está criando (captura rápida).
 * - Vendedor só pode atribuir a si mesmo; ADMIN pode escolher qualquer membro
 *   ativo da equipe.
 * - O `ownerId` do client nunca é confiado sem esta checagem.
 */
export async function resolveOwnerId(
  db: TenantClient,
  actingUser: ActingUser,
  requestedOwnerId?: string | null,
): Promise<string> {
  const ownerId = requestedOwnerId?.trim() || actingUser.id;

  if (actingUser.role !== "ADMIN" && ownerId !== actingUser.id) {
    throw new AppError("OWNER_FORBIDDEN", "Você só pode atribuir contatos a você mesmo.");
  }

  const owner = await db.user.findFirst({
    where: { id: ownerId, active: true },
    select: { id: true },
  });
  if (!owner) {
    throw new AppError("OWNER_NOT_FOUND", "Responsável não encontrado ou inativo nesta equipe.");
  }
  return owner.id;
}
