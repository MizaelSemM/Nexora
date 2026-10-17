/**
 * Erro de negócio com mensagem segura para exibir ao usuário (tarefa 003).
 *
 * Regra: os Server Actions NUNCA deixam vazar mensagem de erro da infraestrutura
 * para a tela. Serviços (`server/`) lançam `AppError` com texto em pt-BR revisado;
 * qualquer outro erro é logado e vira a mensagem genérica do action.
 */
export class AppError extends Error {
  constructor(
    /** Código estável (para testes e mapeamentos de UI). */
    public readonly code: string,
    /** Mensagem em pt-BR, segura para mostrar ao usuário. */
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
