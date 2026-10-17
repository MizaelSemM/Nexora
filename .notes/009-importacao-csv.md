# 009 · Importação de CSV

**Requisitos:** RF-11 (P0) · user story US-06 · critério de lançamento: **5.000 linhas sem falha**
**Prioridade:** P0 · **Depende de:** 002, 005 (`createLead()`) · **Bloqueia:** `016` (critério de lançamento)

---

## Upload e mapeamento

- [ ] Upload de CSV com limite de tamanho e pré-visualização das primeiras linhas
- [ ] Detecção de separador (`;` e `,`) e encoding — planilhas BR costumam vir em **Latin-1/Windows-1252**
- [ ] Mapeamento de colunas → campos: **nome e telefone obrigatórios**; e-mail, empresa_texto, origem, tags opcionais
- [ ] Lembrete de colunas duplicadas/incompletas com sugestão automática pelo nome do cabeçalho
- [ ] Tela de confirmação mostrando as primeiras 10 linhas já validadas antes de importar

## Regras e validação

- [ ] Validação linha a linha com **Zod** (schema compartilhado de contato)
- [ ] Normalização de telefone na importação (helper do `002`) — linhas com telefone inválido vão para o relatório de erros
- [ ] Detecção de duplicados por telefone normalizado: **contra a base** e **dentro do próprio arquivo**
- [ ] Decisão por duplicado (padrão: ignorar): ignorar / atualizar existente / criar novo

## Processamento

- [ ] Processamento em **chunks com status de progresso** (Route Handler + polling ou job) para 5.000+ linhas sem estourar timeout da Vercel
- [ ] Cada linha importada passa pelo `createLead()`: contato + negócio "Novo" + tarefa de primeiro contato **para hoje** (respeitar opção "só importar contatos")
- [ ] Importação **cancelável** durante a pré-visualização (nada é gravado antes de confirmar)
- [ ] Também aceitar colar do Excel (TSV) como bônus simples

## Relatório e LGPD

- [ ] Relatório final: **importados · ignorados · duplicados · erros**, com download do CSV de erros
- [ ] Evento na timeline da conta: "Importação de X contatos por Fulano"
- [ ] Checkbox obrigatório de **base legal** (LGPD): "declaro que tenho base legal para tratar estes dados"

## Testes (ver `014`)

- [ ] Fixture de arquivo com **5.000 linhas** (incluindo duplicados, telefones inválidos e encoding Latin-1) rodando no CI

---

**✅ Critérios de aceite (US-06):** pré-visualização + mapeamento funcionam; relatório bate linha a linha; 5.000 linhas importadas sem falha nem timeout.
