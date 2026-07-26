# Changelog

## 1.4.0 — 2026-07-26

### Alterações
- A dependência `@arcanalabs/ui-components` agora requer a versão 2.1.0 ou superior; os filtros de texto usam o novo slot inicial de `ArcanaInput` com um ícone de lupa em todos os adapters.

### Correções
- Colunas sem ordenação — por configuração global ou individual — não exibem mais o ícone de sort.
- A borda externa passou a pertencer ao container da tabela, evitando que os cantos arredondados cortem partes da borda.

## 1.3.0 — 2026-07-26

### Novos recursos
- **Cantos arredondados nativos**: use `config.borderRadius` em qualquer adapter com um número (pixels) ou uma medida CSS (`"0.75rem"`, por exemplo). Temas personalizados também podem definir o novo token `--arcana-border-radius`; a configuração por tabela tem precedência.

## 1.2.1 — 2026-07-23

### Correções
- O ícone de ordenação volta a ficar alinhado à direita, no fim do cabeçalho da coluna, de forma consistente em qualquer largura ou alinhamento de coluna.

## 1.2.0 — 2026-07-23

### Alterações que exigem atenção
- **Renomeação das classes CSS internas** de `.spark-grid*` para `.arcana-grid*`, e do arquivo de estilos `SparkGrid.css` para `ArcanaGrid.css`. O import público `@arcanalabs/datatable/styles.css` continua igual. Aplicações que estilizavam diretamente os seletores `.spark-grid*` precisam atualizá-los. Os aliases de migração `SparkGrid` (componente) e `SparkGridConfig` (tipo) foram mantidos.

### Novos recursos
- **Animação de arraste ao reordenar colunas**: chip fantasma acompanhando o cursor, reordenação ao vivo durante o arrasto e transição suave (FLIP) dos cabeçalhos; `Esc` cancela e restaura a ordem. Respeita `prefers-reduced-motion`.

### Correções
- Indicador de destino do arraste de colunas agora é claramente visível (linha na cor de destaque com brilho e marcador), com variação por tema.

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
