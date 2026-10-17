# 013 · Segurança, LGPD e observabilidade de produto

**Requisitos:** seções 11 (RNF), 17 (riscos) e 4 (métricas) do PRD — **obrigatório para lançar**
**Prioridade:** P0 · **Depende de:** 001, 003, 004 · **Bloqueia:** `016`

---

## Segurança

- [ ] HTTPS em tudo (padrão Vercel) + headers de segurança (CSP básica, `X-Frame-Options`, `noindex` nas rotas privadas)
- [ ] Hash forte de senha (argon2 preferencial), sessões httpOnly/SameSite, expiração e revogação
- [ ] Rate limit em: login, recuperação de senha e formulário público
- [ ] Backups **diários** do Postgres com **teste de restore documentado** (backup que nunca foi restaurado não é backup)
- [ ] `npm audit` + Dependabot/Renovate no CI
- [ ] Checklist de revisão de PR: nenhum Server Action/Route Handler sem `requireAuth()` + `account_id`
- [ ] Logs sem dado pessoal (telefone/e-mail mascarados no Sentry)

## LGPD (cliente = controlador · produto = operador)

- [ ] Termos de uso e política de privacidade publicados (`/termos`, `/privacidade`) — critério de lançamento
- [ ] Base legal registrada no cadastro da conta e na importação de CSV (checkbox + registro datado)
- [ ] **Exportação de dados** por solicitação: contatos, negócios e timeline da conta/contato (CSV/JSON)
- [ ] **Exclusão** por solicitação: hard delete ou anonimização, com procedimento documentado
- [ ] Registro de acesso/alteração: timeline + log mínimo de quem acessou o quê
- [ ] Documento interno: onde os dados ficam (Neon/Railway + backups), retenção e como atender um titular

## Observabilidade e analytics (métricas da seção 4)

- [ ] **Sentry** com contexto de conta/rota/usuário (ID, nunca dado pessoal) + alerta por e-mail de erros novos
- [ ] **PostHog** com eventos: `user_opened_app`, `today_viewed`, `task_completed`, `deal_moved`, `lead_created`, `next_action_set`, `deal_won`, `deal_lost`
- [ ] Todo evento carrega `account_id` e `role` — permitem as métricas de adoção por vendedor
- [ ] **Dashboard interno das 6 métricas do PRD**: % vendedores ativos em dias úteis (≥70%), % negócios com próxima ação (≥90%), % tarefas do dia concluídas (≥60%), tempo de cadastro (<20s), negócios parados 7+ dias (−50%), conversão vs. baseline
- [ ] Evento com timer real no cadastro de lead (flag `created_in_seconds`)
- [ ] Meta de disponibilidade 99,5%: monitor de uptime (Vercel/Checkly) avisando por e-mail/WhatsApp

---

## Riscos aceitos (revisar a cada release do Next)

- **`braces` (dev-only, 5 advisories "high" no npm audit):** vulnerabilidade de DoS por padrão deeply nested em glob. Chega via `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. **Não vai para produção** (é ferramenta de lint) e o "fix" sugerido pelo npm é um downgrade quebrado do eslint-config-next. Ação: revisar quando o Next publicar versão com a árvore atualizada.
- **`eslint@9.39.5` marcado como "no longer supported" pelo npm:** o template do Next 16 fixa `^9`. Revisar quando o `eslint-config-next` migrar para o ESLint 10.

---

**✅ Critério de aceite:** termos publicados; testes de isolamento no CI; métricas de adoção disponíveis sem trabalho manual no dia 1 do piloto; restauramos um backup de teste com sucesso.
