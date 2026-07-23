# Changelog

## 1.1.0 — 2026-07-22

### Segurança
- **Correção de XSS**: conteúdo string de célula/cabeçalho agora é renderizado como texto seguro por padrão. HTML só é interpretado com o opt-in explícito `column.html: true`. Valor cru de dataset/datasource não é mais injetado como HTML.

### Novos recursos
- **Ordenação multi-coluna**: `Shift`+clique acumula colunas na ordenação, com indicador de prioridade (1, 2, 3…) e `aria-sort`. `applyOrderBy` aceita `OrderBy | OrderBy[] | null`; novo `toggleOrderBy`.
- **Redimensionar colunas**: alça de arraste na borda do cabeçalho, respeitando `cellMinWidth`. Config `columnResizeEnabled` e `column.resizable`.
- **Reordenar colunas**: arraste do cabeçalho com indicador de destino e atalho de teclado (Ctrl/Cmd+setas). Config `columnReorderEnabled` e `column.reorderable`; métodos `setColumnOrder`/`moveColumn`.
- **Fixar/congelar colunas**: `column.pinned: 'left' | 'right'` mantém a coluna visível durante o scroll horizontal; itens de menu no cabeçalho (Fixar à esquerda/direita/Desafixar). Métodos `setColumnPinned`/`getColumnPin`.

## 1.0.0 — 2026-07-22

- Novo núcleo TypeScript compartilhado e independente de framework.
- Modos explícitos `remote` e `dataset`, com execução local completa sem requests.
- Persistência de seleção e mutações sobre a coleção completa no modo `dataset`.
- Adaptadores nativos para Vue 3 e React 18+.
- Exports separados: pacote principal, `/vue`, `/react` e `/styles.css`.
- Busca local/remota, filtros, paginação, ordenação, seleção e sumarização.
- Tipos públicos genéricos e aliases de migração do spark-grid-vue.
- Site de documentação responsivo e publicação automatizada no GitHub Pages.
- Snapshot do código anterior preservado em `legacy/spark-grid-vue`.
