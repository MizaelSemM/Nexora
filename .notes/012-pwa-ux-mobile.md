# 012 · PWA, mobile-first e UX de um clique

**Requisitos:** RNF de mobile/PWA, princípios de produto 2, 3 e 4 (seção 6)
**Prioridade:** P0 · **Depende de:** 005–011 (aplica sobre as telas prontas) · **Bloqueia:** `016`

> O vendedor está na rua ou no balcão. **A tela "Hoje" é o produto** — o resto é suporte.

---

## Estrutura mobile

- [ ] Navegação **inferior** no celular: Hoje · Funil · Contatos · Painel (admin) — com ícones e área de toque ≥ 44px
- [ ] Auditoria de responsividade das 7 telas da seção 12 do PRD, foco em 360–430px de largura
- [ ] Nada essencial atrás de hover; nenhum fluxo exige zoom
- [ ] Botões primários ao alcance do polegar (parte inferior da tela)
- [ ] Sheet/dialog nativos (shadcn) no mobile em vez de modais desktop

## PWA

- [ ] `manifest.json` com nome, ícones (192/512), tema e `display: standalone`
- [ ] Service worker com cache do app shell (dados sempre frescos — nunca mostrar tarefa velha do cache)
- [ ] Splash screen e ícone ao instalar; testar "Adicionar à tela inicial" em Android e iPhone
- [ ] Aviso de atualização disponível (evitar app preso em versão antiga)

## Ações de um clique (princípio 4)

- [ ] WhatsApp (`wa.me`), Ligar (`tel:`) e Concluir acessíveis de qualquer lista sem abrir o detalhe
- [ ] Feedback **otimista** com desfazer (undo) em: concluir tarefa, adiar 1 dia, mudar etapa
- [ ] Toasts curtos, não bloqueantes
- [ ] Seletor de data com atalhos (Amanhã / 3 dias / 1 semana) — nunca obrigar o calendário

## Estados e polimento

- [ ] Skeleton loading em todas as listas e no kanban
- [ ] Estados vazios úteis em todas as telas (com botão da ação principal)
- [ ] Teclados corretos: `tel` (telefone), `email`, `inputmode="decimal"` (valor do negócio)
- [ ] Acessibilidade básica: contraste, foco visível, labels, navegação por teclado no desktop
- [ ] `pt-BR` em tudo; datas relativas ("hoje", "ontem", "há 3 dias") e absolutas no tooltip

## Medição (RNF de performance)

- [ ] Medir "Hoje" em 4G simulado (Playwright/DevTools): meta **< 2s com 200 tarefas**
- [ ] Teste manual em **Android intermediário real** + iPhone
- [ ] Lighthouse: PWA instalável + performance ≥ 90 nas telas principais

---

**✅ Critério de aceite:** dá para executar a rotina diária inteira (abrir Hoje → WhatsApp → registrar resultado → próxima ação) com uma mão só, no celular, sem zoom e sem espera perceptível.
