import { z } from "zod";

/**
 * Validação de contatos e captura de lead (tarefa 005).
 *
 * Compartilhada entre o formulário (client) e o servidor. O servidor SEMPRE
 * revalida; a normalização E.164 do telefone acontece no serviço (`createLead`),
 * porque `lib/phone.ts` é a fonte única da regra.
 */

export const CONTACT_ORIGINS = [
  "INSTAGRAM",
  "REFERRAL",
  "SITE",
  "STORE",
  "FORM",
  "IMPORT",
  "OTHER",
] as const;

export type ContactOrigin = (typeof CONTACT_ORIGINS)[number];

/** Rótulos em pt-BR (RF-14: Instagram, indicação, site, loja, outro). */
export const CONTACT_ORIGIN_LABELS: Record<ContactOrigin, string> = {
  INSTAGRAM: "Instagram",
  REFERRAL: "Indicação",
  SITE: "Site",
  STORE: "Loja",
  FORM: "Formulário",
  IMPORT: "Importação",
  OTHER: "Outro",
};

/** Origens oferecidas no cadastro manual (as demais vêm de importação/formulário). */
export const MANUAL_ORIGINS: ContactOrigin[] = ["INSTAGRAM", "REFERRAL", "SITE", "STORE", "OTHER"];

const nameField = z
  .string({ message: "Informe o nome do contato." })
  .trim()
  .min(2, { message: "Informe o nome do contato (mín. 2 caracteres)." })
  .max(80, { message: "O nome pode ter no máximo 80 caracteres." });

// O telefone chega cru (com máscara); a normalização é feita no serviço.
const phoneField = z
  .string({ message: "Informe o telefone." })
  .trim()
  .min(1, { message: "Informe o telefone." });

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, { message })
    .optional()
    .transform((value) => (value ? value : undefined));

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(z.email({ message: "E-mail inválido." }).optional());

const originField = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(z.enum(CONTACT_ORIGINS, { message: "Origem inválida." }).optional());

const ownerField = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

/** Cadastro rápido de lead: só nome + telefone são obrigatórios (US-03). */
export const createLeadSchema = z.object({
  name: nameField,
  phone: phoneField,
  email: optionalEmail,
  companyText: optionalText(120, "A empresa pode ter no máximo 120 caracteres."),
  origin: originField,
  ownerId: ownerField,
});

/** Edição de contato: mesmos campos, todos revalidados no servidor. */
export const updateContactSchema = createLeadSchema;

export type CreateLeadFormInput = z.infer<typeof createLeadSchema>;
export type UpdateContactFormInput = z.infer<typeof updateContactSchema>;

/** Primeira mensagem de erro de um ZodError (mensagens já em pt-BR). */
export function firstContactIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos.";
}
