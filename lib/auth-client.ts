import { createAuthClient } from "better-auth/react";

/**
 * Client do Better Auth (tarefa 003) — usado nos formulários de login,
 * recuperação de senha etc.
 *
 * Importante: login e reset de senha passam por AQUI (chamada do navegador para
 * `/api/auth/*`) — e não por Server Actions — porque o rate limit do Better Auth
 * só protege requisições iniciadas pelo cliente.
 *
 * Sem `baseURL`: o client usa o mesmo origin do app.
 */
export const authClient = createAuthClient();
