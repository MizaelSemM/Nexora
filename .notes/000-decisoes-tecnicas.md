# 000 · Decisões técnicas e perguntas bloqueantes

**Requisitos:** seção 18 do PRD (perguntas em aberto) + confirmação de Auth (seção 13)
**Status:** ✅ **Fechado em 17/10/2026** — decisões registradas abaixo · **Destrava:** 001

---

## 🚨 Bloqueantes — todas fechadas ✅

- [x] **Auth: Better Auth** (e-mail/senha + Prisma Adapter). Hash: **scrypt** (padrão do Better Auth — atende ao "hash forte" da seção 11; argon2 exigiria customização, não vale agora). Recuperação de senha e convites usam os módulos nativos.
- [x] **Multi-tenant: SaaS multi-empresa desde o dia 1** — `account_id` em tudo, isolamento testado desde o início (ver `004`).
- [x] **Postgres: Supabase, região São Paulo (sa-east-1)** — junto com as funções da Vercel em **gru1** para latência mínima no Brasil. RLS do Supabase fica disponível como 2ª camada pós-MVP. Backups diários no plano Pro.
- [x] **Jobs: Vercel Cron** — dispatcher de hora em hora chamando handlers idempotentes (processa por fuso da conta). pg-boss/Inngest só se doer.
- [x] **Atribuição do lead do formulário: responsável padrão configurável** pelo admin. Rodízio automático fica para o P1.
- [x] **Segmento: genérico por enquanto** — decidir com as 10–15 entrevistas antes do piloto (não trava código, só conteúdo de seed/templates/linguagem).

## 📌 Ainda em aberto (não bloqueiam a 001)

- [ ] Vendedores usam celular pessoal ou computador? (pergunta 3) — mobile-first já é princípio; isso refina prioridade do desktop.
- [ ] Existe base de contatos para importar no piloto? (pergunta 4) — dimensiona o teste de CSV de 5.000 linhas.
- [ ] RLS do Postgres entra agora ou depois do MVP? — **recomendação: depois** (extensão do Prisma primeiro).
- [ ] Fluxo de proposta/orçamento no MVP? — hoje fora do escopo (seção 5); revisar só se as entrevistas pedirem.
- [ ] Preço e disposição a pagar — sai das entrevistas (seção 16), não de suposição.

---

## ✅ Decisões tomadas

| Data | Decisão | Justificativa |
| --- | --- | --- |
| 17/10/2026 | Backlog em `.notes/` com arquivos numerados 000–016 | Dependências claras entre módulos |
| 17/10/2026 | **Better Auth** (e-mail/senha) + Prisma Adapter, hash **scrypt** | Menos código custom que Auth.js para credenciais + reset + convites |
| 17/10/2026 | **Supabase Postgres em São Paulo** + funções Vercel em gru1 | Latência baixa para usuários BR; RLS opcional futura; backups no Pro |
| 17/10/2026 | **SaaS multi-empresa desde o dia 1** (`account_id`) | Risco nº 4 do PRD; retrofitar depois é caro |
| 17/10/2026 | Lead do formulário → **responsável padrão configurável** | Simples e previsível no piloto; rodízio = P1 |
| 17/10/2026 | **Segmento genérico** até as entrevistas | PRD manda decidir com dados, não suposição |
| 17/10/2026 | Jobs via **Vercel Cron** (dispatcher horário idempotente) | Serverless não comporta worker persistente; suficiente para o P1 |
| 17/10/2026 | Cronograma recalibrado: **6–8 semanas** para o MVP | Ritmo do dono: ~20–25h/semana (alguns dias por semana) |

> **Formato:** registre decisão + data + justificativa. Nunca delete uma linha — se mudar, adicione "revisto em DD/MM 2026".
