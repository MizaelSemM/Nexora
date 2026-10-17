# 005 · Contatos e captura rápida de lead

**Requisitos:** RF-10, RF-13, RF-14 (P1 justificado: campo já entra no schema) · user story US-03
**Prioridade:** P0 · **Depende de:** 002, 003, 004 · **Bloqueia:** 007, 009, 010 (todos usam `createLead()`)

---

## Captura rápida (US-03 — menos de 20 segundos)

- [ ] Tela/modal de cadastro rápido: **nome + telefone** (resto opcional, escondido atrás de "mais detalhes")
- [ ] Input de telefone com `inputmode="tel"`, máscara BR e normalização E.164 no servidor
- [ ] Detecção de **duplicado por telefone** na própria conta: aviso + botão "abrir contato existente"
- [ ] Regra `5. Cria automaticamente negócio na etapa "Novo" + tarefa "Primeiro contato" para **hoje**`
- [ ] Serviço único `createLead()` em `server/services/` — **reutilizado** pelo formulário manual, CSV (`009`) e formulário público (`010`), com testes unitários
- [ ] Timer de medição do cadastro (evento `lead_created` com `seconds` — alimenta a métrica "< 20s" do `013`)

## Campos e ações

- [ ] Campos do contato: nome, telefone, e-mail, empresa_texto, origem (`Instagram | Indicação | Site | Loja | Outro`), owner_id
- [ ] Botão **"Abrir no WhatsApp"** (`wa.me` com DDI) no contato, na lista e no detalhe do negócio (RF-13)
- [ ] Botão Ligar (`tel:`) no celular
- [ ] Lista de contatos com busca por nome/telefone (pré-requisito da busca global do `008`)
- [ ] Edição de contato + exclusão lógica com registro na timeline (`008`)
- [ ] Troca de responsável do contato (respeitando papel: vendedor só os próprios)

## Performance

- [ ] Lista de contatos paginada/virtualizada (contas com milhares de contatos após importação)

---

**✅ Critérios de aceite (US-03):** 2 campos criam lead em < 20s; telefone duplicado avisa e oferece o contato existente; negócio "Novo" + tarefa de primeiro contato criados automaticamente.
