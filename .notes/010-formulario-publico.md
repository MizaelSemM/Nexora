# 010 · Formulário público de captura (site / Instagram)

**Requisitos:** RF-12 (P0)
**Prioridade:** P0 · **Depende de:** 002, 005 (`createLead()`), 007 (tarefa de primeiro contato) · **Bloqueia:** —

---

## Rota pública

- [ ] Rota **pública** `/f/[slug]` (slug único por conta), sem autenticação e fora do layout do app
- [ ] Campos: **nome + telefone** obrigatórios; e-mail e origem opcionais — nunca mais que 3 campos visíveis
- [ ] Origem padrão `form` registrada; UTM (source/medium/campaign) capturada em campo oculto se presente na URL
- [ ] Reutiliza `createLead()` → contato + negócio "Novo" + **tarefa "Primeiro contato" para hoje**
- [ ] Atribuição do responsável: regra definida no `000` (admin da conta / responsável configurado / rodízio)
- [ ] Tela de agradecimento configurável ("Recebemos seu contato, responderemos em breve") + redirecionamento opcional para WhatsApp da empresa

## Configuração pelo admin

- [ ] Área em Configurações: ativar/desativar formulário, editar título e mensagem de agradecimento
- [ ] **Snippet de embed** (`<iframe>`) com botão copiar + link direto para **bio do Instagram** com QR code
- [ ] Preview ao vivo do formulário dentro das configurações

## Proteção contra abuso

- [ ] **Rate limit por IP** (Route Handler; ajustar na Vercel)
- [ ] Honeypot invisível + validação de tempo de preenchimento (bots preenchem instantâneo)
- [ ] Captcha leve (Turnstile) **apenas se** aparecer abuso real no piloto — não bloquear o lançamento por isso
- [ ] Duplicado por telefone: não cria negócio novo; registra evento "novo contato pelo formulário" na timeline do contato existente

## Mobile e analytics

- [ ] Mobile-first: campos grandes, teclado numérico no telefone, botão fixo "Quero falar" 
- [ ] Evento `lead_captured` (PostHog) com origem e tempo de preenchimento
- [ ] Página pública indexável? **Não** — `noindex` por padrão (dados de configuração da empresa)

---

**✅ Critérios de aceite:** enviar o formulário cria lead visível na tela "Hoje" do responsável em segundos; spam básico bloqueado sem captcha; snippet copiável funciona em site externo.
