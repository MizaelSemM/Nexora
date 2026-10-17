# 003 · Autenticação, contas, papéis e convites

**Requisitos:** RF-01, RF-02, RF-03, RF-04 (P0) · RF-05 (P2)
**Prioridade:** P0 · **Depende de:** 002, 004 (base) · **Bloqueia:** 005–011

---

## Autenticação (RF-01)

- [ ] **Auth.js** (ou Better Auth — ver `000`) com Prisma Adapter + sessão em cookie httpOnly/SameSite
- [ ] Hash de senha com **argon2** (fallback bcrypt) — nunca logar credenciais
- [ ] Login por e-mail e senha com mensagens de erro neutras ("e-mail ou senha inválidos")
- [ ] Recuperação de senha por e-mail (**Resend**) com token de uso único e expiração curta
- [ ] Rate limit em login e recuperação de senha (proteção contra força bruta)

## Contas e papéis (RF-02, RF-03)

- [ ] Cadastro cria `account` + primeiro usuário como **Admin** (onboarding em 1 tela)
- [ ] Sessão carrega `user_id`, `account_id` e `role` — fonte única para o isolamento do `004`
- [ ] Helpers de servidor `requireAuth()` / `requireRole('ADMIN')` — **nenhum** Server Action ou Route Handler sem verificação
- [ ] Vendedor só vê/edita os próprios negócios; Admin vê tudo (aplicar em queries, não só na UI)
- [ ] Desativar usuário (`ativo = false`) sem apagar histórico; usuário desativado perde acesso na hora

## Convites (RF-04)

- [ ] Convite por e-mail (Resend) e por link copiável, com expiração e revogação
- [ ] Tela "aceitar convite": cria usuário vinculado ao `account_id` do convite (nunca ao digitado pelo usuário)
- [ ] Admin lista convites pendentes e usuários da conta

## Fora do escopo agora

- [ ] (P2) Login com Google → registrar no `015` quando o MVP validar

---

**✅ Critérios de aceite:** convidado cria conta e entra na conta certa; vendedor não acessa negócio de outro vendedor nem por URL direta; recuperação de senha funcional ponta a ponta; par de testes com o `004`.
