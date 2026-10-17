/**
 * Sanitiza o destino pós-login (`?redirect=`).
 *
 * Só aceita caminho interno: começando com `/`, sem `//` (protocol-relative) e
 * sem `/\` (variação que alguns navegadores tratam como `//`). Qualquer outra
 * coisa vira a home — fecha a porta para open redirect via link de login.
 */
export function sanitizeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
