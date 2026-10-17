/**
 * Regras de acesso por papel (tarefa 003; aplicadas nas telas a partir da 005).
 */

export type SessionUserLike = {
  id: string;
  role: "ADMIN" | "SELLER";
};

/**
 * Escopo de visibilidade de negócios/tarefas de um vendedor.
 *
 * - ADMIN: visão da equipe inteira → `{}` (sem filtro adicional).
 * - SELLER: apenas o que é dele → `{ ownerId: user.id }`.
 *
 * Uso: `tenantDb().deal.findMany({ where: { ...ownerScope(user), ...outrosFiltros } })`
 * — o filtro de conta continua vindo do client de tenant; este helper só decide
 * o recorte por responsável.
 */
export function ownerScope(user: SessionUserLike): { ownerId?: string } {
  return user.role === "ADMIN" ? {} : { ownerId: user.id };
}
