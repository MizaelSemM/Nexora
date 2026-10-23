export { cn } from "cn";

/** Fuso padrão da conta no MVP (o campo `Account.timezone` será usado na 007). */
export const APP_TIME_ZONE = "America/Sao_Paulo";

/** Data curta em pt-BR (ex.: 17/10/2026). Entrada inválida vira "—". */
export function formatDateBR(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(date);
}

/** Valor em reais (ex.: R$ 1.200,00). */
export function formatCurrencyBR(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
