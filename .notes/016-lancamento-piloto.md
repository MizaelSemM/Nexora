# 016 · Lançamento e piloto

**Requisitos:** seções 15 (plano de validação) e 19 (critérios de lançamento)
**Prioridade:** P0 · **Depende de:** 001–014 · **Bloqueia:** MVP+

---

## Antes de construir (validação — seção 15)

- [ ] 10–15 entrevistas com donos e vendedores de pequenas empresas (perguntas-chave: como controlam leads hoje, quantos perdem, o que já tentaram, quanto pagariam) → **alimenta o `000`** (segmento, preço, mobile vs. desktop)
- [ ] Protótipo clicável (Figma) da tela **"Hoje"** e do kanban testado com **5 pessoas**
- [ ] Coletar baseline de 30 dias antes do piloto: negócios parados 7+ dias e taxa de conversão (métricas de resultado)

## Checklist de lançamento (seção 19 — copiado do PRD)

- [ ] Todos os requisitos **P0** implementados e testados
- [ ] **Isolamento entre contas validado** (suíte do `004` verde no CI)
- [ ] **Importação de CSV com 5.000 linhas sem falha**
- [ ] **Tela "Hoje" abrindo em menos de 2s** em celular intermediário
- [ ] **Analytics de adoção funcionando** (6 métricas da seção 4 no dashboard)
- [ ] **Termos de uso e política de privacidade publicados**
- [ ] Pelo menos **3 empresas do piloto** onboardadas

## Piloto (3 a 5 empresas, 3 semanas)

- [ ] Onboarding guiado por empresa: importar base + treinar a tela "Hoje" em 15 minutos
- [ ] Acompanhamento **semanal**: números de uso + entrevista curta com vendedor e gestor
- [ ] Canal de suporte direto (WhatsApp) com registro dos atritos
- [ ] Feedback → `todo.md`: bugs viram tarefa; push-back de escopo vai para o `015`

## Critérios de sucesso / falha

- [ ] **Sucesso:** ≥ 70% dos vendedores usando em dias úteis **e** ≥ 2 empresas dizendo que não voltariam para a planilha
- [ ] **Falha/pivô:** se o vendedor só usa quando o gestor cobra → é problema de **proposta de valor**, não de funcionalidade (parar e repensar antes de construir mais)

---

**✅ Definição de pronto:** checklist acima 100% verde + pelo menos 3 empresas usando ativamente por 3 semanas seguidas.
