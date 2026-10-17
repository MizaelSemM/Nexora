# MarcaAi — CRM de Follow-up

CRM de follow-up para pequenas equipes de vendas: o vendedor abre o app e sabe **quem chamar hoje e por quê**. O escopo completo está no [PRD](<./PRD – CRM de Follow-up para Pequenas Equipes de Vendas (MVP).md>) e o planejamento em [.notes/](./.notes/todo.md).

## Stack

| Camada    | Tecnologia                                          |
| --------- | --------------------------------------------------- |
| App       | Next.js 16 (App Router) + TypeScript                |
| UI        | Tailwind CSS 4 + shadcn/ui                          |
| Banco     | PostgreSQL (Supabase — região São Paulo) + Prisma 7 |
| Validação | Zod 4 (schemas compartilhados em `lib/schemas/`)    |
| Auth      | Better Auth (e-mail/senha, convites, recuperação)   |
| E-mail    | Resend                                              |
| Observab. | Sentry + PostHog                                    |
| Testes    | Vitest (unit) + Playwright (e2e)                    |
| Deploy    | Vercel (funções em gru1 — São Paulo)                |

## Como rodar

Requisitos: **Node 22+** e npm.

```bash
npm install
copy .env.example .env   # Windows (cp no macOS/Linux) — preencha os valores
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Script               | O que faz                               |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento (Turbopack) |
| `npm run build`      | Build de produção                       |
| `npm run lint`       | ESLint                                  |
| `npm run typecheck`  | TypeScript (sem emitir)                 |
| `npm run format`     | Prettier em todo o projeto              |
| `npm test`           | Testes unitários (Vitest)               |
| `npm run e2e`        | Testes ponta a ponta (Playwright)       |
| `npm run db:migrate` | Cria/aplica migrations (Prisma)         |
| `npm run db:seed`    | Popula dados de desenvolvimento         |
| `npm run db:studio`  | Prisma Studio                           |

> Para rodar e2e na primeira vez: `npx playwright install chromium`.

## Estrutura

```
app/          rotas e telas (App Router)
components/   UI compartilhada (shadcn/ui)
lib/          utilitários — env.ts, phone.ts, schemas/ (Zod)
server/       regras de negócio — services/ (follow-up, createLead...)
prisma/       schema, migrations e seed
tests/        testes unitários (Vitest)
e2e/          testes ponta a ponta (Playwright)
.notes/       planejamento, decisões e backlog
```

## Convenções (valem para todo PR)

1. **Validação em um só lugar:** toda entrada (formulário, Server Action, CSV, formulário público) é validada com os schemas de `lib/schemas/` no servidor.
2. **Isolamento por conta:** toda query passa pelo Prisma Client estendido que injeta `account_id` (ver `.notes/004-isolamento-multi-tenant.md`). Nunca use o client cru para dados de conta.
3. **Server Components por padrão;** `"use client"` só onde houver interação.
4. **Nunca leia `process.env` direto** — use `lib/env.ts`.
5. **Esta versão do Next.js tem mudanças:** antes de codar algo do framework, consulte o guia local em `node_modules/next/dist/docs/` (o `AGENTS.md` da raiz explica).

## Planejamento do MVP

- Quadro de tarefas: [.notes/todo.md](./.notes/todo.md)
- Decisões técnicas fechadas: [.notes/000-decisoes-tecnicas.md](./.notes/000-decisoes-tecnicas.md)
- Critérios de lançamento: [.notes/016-lancamento-piloto.md](./.notes/016-lancamento-piloto.md)
