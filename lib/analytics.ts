/**
 * Instrumentação de produto (tarefa 005; PostHog chega na 013).
 *
 * Ponto único para eventos de produto — quando o PostHog for plugado, é aqui
 * que ele entra. Em desenvolvimento, imprime no console para validar o fluxo
 * (ex.: `lead_created` com `seconds`, que alimenta a métrica "< 20s").
 *
 * Nunca envie PII (nome, telefone, e-mail) no payload.
 */
export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: string, props: AnalyticsProps = {}): void {
  // Analytics NUNCA derruba o fluxo de negócio.
  try {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[analytics] ${name}`, props);
    }
  } catch (error) {
    console.error("[analytics] Falha ao registrar evento:", error);
  }
}
