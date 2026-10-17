import { z } from "zod";

/**
 * Validação de variáveis de ambiente (ver .notes/001-fundacao-setup.md).
 *
 * Regra do projeto: o resto do código NUNCA lê `process.env` diretamente —
 * tudo passa por `env`, validado uma única vez (falha rápido no boot).
 *
 * Na Vercel, as variáveis são configuradas em Project Settings → Environment Variables.
 */
const envSchema = z.object({
  // Banco de dados (Supabase — região São Paulo). Obrigatório: migrations e runtime dependem dele.
  DATABASE_URL: z
    .string()
    .min(1)
    .refine((v) => v.startsWith("postgres"), {
      message: "DATABASE_URL deve ser uma connection string Postgres (postgresql://...)",
    }),

  // Autenticação (Better Auth) — obrigatório a partir da tarefa 003.
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  BETTER_AUTH_URL: z.url().optional(),

  // E-mail transacional (Resend) — tarefas 003/009/015.
  RESEND_API_KEY: z.string().optional(),

  // Observabilidade — tarefa 013.
  SENTRY_DSN: z.url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".") || "(raiz)"}: ${issue.message}`);
  }
  throw new Error("Variáveis de ambiente inválidas — corrija o .env (veja .env.example).");
}

export const env = parsed.data;
