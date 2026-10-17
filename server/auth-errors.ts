import { APIError } from "better-auth/api";

/**
 * Reconhecimento de erros do Better Auth (tarefa 003).
 *
 * Os endpoints devolvem `APIError` com `status`, `body.code` (ex.:
 * `USER_ALREADY_EXISTS`) e mensagem em inglês. Aqui traduzimos só o que a nossa
 * UI precisa distinguir; o resto vira mensagem genérica nos serviços.
 */
export function isAlreadyExistsError(error: unknown): boolean {
  if (!(error instanceof APIError)) return false;
  const code = error.body?.code;
  if (code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    return true;
  }
  return typeof error.message === "string" && /already exists/i.test(error.message);
}
