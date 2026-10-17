import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

/**
 * Rotas do Better Auth (tarefa 003) — login, logout, cadastro, reset de senha
 * etc. montadas em `/api/auth/*`. O navegador fala com o Better Auth por aqui
 * (é o caminho que passa pelo rate limit — ver lib/auth.ts).
 */
export const { GET, POST } = toNextJsHandler(auth);
