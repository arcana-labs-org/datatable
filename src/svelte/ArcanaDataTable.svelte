<script lang="ts">
  /**
   * `ArcanaDataTable` — Svelte 5 adapter over the framework-agnostic
   * controller (`core/controller.ts`). Markup, classes and behavior mirror
   * the React/Vue adapters 1:1: header with the sort menu, filter row,
   * checkbox/radio selection, actions, context menu, footer with pagination,
   * summarizer, themes and expandable rows.
   *
   * Custom content (`valueGetter`, `actions[].element`, `expandedRowRenderer`,
   * …) accepts what `Renderable` allows in a framework-neutral way: HTML
   * strings, numbers/booleans, DOM nodes or callbacks returning any of those.
   */
  import { createDataTable } from "../core/controller";
  import { formatMessage, resolveArcanaLocale, resolveArcanaMessages } from "../core/locale";
  import { arcanaThemeClass } from "../core/theme";
  import { startColumnDrag } from "../core/drag";
  import { actionStyle, alignmentClass, ariaSortValue, columnSortState, columnStyle, computePinPlan, expanderStyle, inlineStyle, isColumnPinnable, isColumnReorderable, isColumnResizable, pagination, PIN_SLOT_ACTIONS, PIN_SLOT_CHECKBOX, PIN_SLOT_EXPANDER, PIN_SLOT_RADIO, resizeMinWidth, selectionStyle, sortGlyph } from "../core/view";
  import type { ContextMenuItem, DataTableApi, DataTableColumn, DataTableConfig, DataTableRow, OrderBy, StyleMap } from "../core/types";
  import Content from "./Content.svelte";
  import ExpandedRowContent from "./ExpandedRowContent.svelte";
  import FilterField from "./FilterField.svelte";
  import "../assets/SparkGrid.css";

  let { config, class: className = "", onMounted }: {
    config: DataTableConfig<DataTableRow>;
    class?: string;
    onMounted?: (grid: DataTableApi<DataTableRow>) => void;
  } = $props();

  let grid = $state.raw<DataTableApi<DataTableRow>>(createDataTable(config));
  let snap = $state.raw(grid.getSnapshot());
  let menu = $state.raw<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  let sortMenu = $state.raw<{ x: number; y: number; name: string; col: string } | null>(null);
  let focusedRow = $state<string | null>(null);
  let focusedCell = $state<string | null>(null);
  let columnWidths = $state<Record<string, number>>({});
  let drag = $state.raw<string | null>(null);
  let didDrag = false;

  let mountedConfig: DataTableConfig<DataTableRow> | null = null;
  $effect(() => {
    if (mountedConfig && mountedConfig !== config) grid = createDataTable(config);
    mountedConfig = config;
    const instance = grid;
    snap = instance.getSnapshot();
    const unsubscribe = instance.subscribe(() => { snap = instance.getSnapshot(); });
    onMounted?.(instance);
    if (config.sendRequestOnMounted !== false) void instance.refresh();
    return unsubscribe;
  });

  $effect(() => {
    if (!menu && !sortMenu) return;
    const close = () => { menu = null; sortMenu = null; };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("click", close);
    window.addEventListener("blur", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("blur", close);
      window.removeEventListener("keydown", onKey);
    };
  });

  const themeClass = $derived(arcanaThemeClass(config.theme));
  const msg = $derived(resolveArcanaMessages(config));
  const gridLocale = $derived(resolveArcanaLocale(config));
  const columns = $derived.by(() => { snap; return grid.getColumns(); });
  const pages = $derived(pagination(snap.currentPage, snap.totalRows, snap.rowsPerPage));
  const lastPage = $derived(Math.ceil(snap.totalRows / snap.rowsPerPage));
  const beginning = $derived(snap.totalRows ? ((snap.currentPage - 1) * snap.rowsPerPage) + 1 : 0);
  const ending = $derived(Math.min(snap.currentPage * snap.rowsPerPage, snap.totalRows));
  const expandable = $derived(Boolean(config.expandableRowsEnabled));

  const searchableColumn = (column: DataTableColumn<DataTableRow>) => column.searchEnabled ?? true;
  const disabledFilter = (column: DataTableColumn<DataTableRow>) => Boolean(config.disableFilterWhenPresentOnInitialFilters && config.initialFilters?.[column.filterName ?? column.name]);
  const filterValue = (column: DataTableColumn<DataTableRow>) => snap.filters[column.filterName ?? column.name] ?? config.initialFilters?.[column.filterName ?? column.name];

  const cellStyle = (column: DataTableColumn<DataTableRow>, row: DataTableRow) => inlineStyle(
    columnStyle(column, grid, columnWidths[column.name]),
    { padding: "8px 10px" },
    config.onBeforeCellStyleMounted?.(grid.getCellValue(column, row), column, row, grid),
    column.onBeforeColumnStyleMounted?.(grid.getCellValue(column, row), row, grid),
    pinPlan.cellStyle(column.name)
  );
  const selectionCellStyle = (row: DataTableRow) => inlineStyle(selectionStyle, config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid));

  const orderable = (column: DataTableColumn<DataTableRow>) => config.orderByEnabled !== false && column.orderByEnabled !== false;
  const colStyle = (column: DataTableColumn<DataTableRow>) => columnStyle(column, grid, columnWidths[column.name]);
  const pinnable = $derived.by(() => { snap; return isColumnPinnable(grid); });
  const pinPlan = $derived.by(() => { snap; return computePinPlan(grid, columns, columnWidths); });
  const pinStyle = (key: string): StyleMap => pinPlan.cellStyle(key);
  const pinClass = (key: string) => pinPlan.className(key);
  const getColumnPin = (name: string) => { snap; return grid.getColumnPin(name); };
  const menuColumnOrderable = $derived.by(() => {
    const column = sortMenu ? columns.find((item) => item.name === sortMenu!.col) : undefined;
    return column ? orderable(column) : false;
  });
  const dragClass = (column: DataTableColumn<DataTableRow>) => drag === column.name ? " arcana-col-dragging" : "";
  function onHeaderClick(event: MouseEvent, column: DataTableColumn<DataTableRow>) {
    if (didDrag) return;
    const isOrderable = orderable(column);
    if (!isOrderable && !pinnable) return;
    const name = column.filterName ?? column.name;
    event.stopPropagation();
    if (event.shiftKey) { if (isOrderable) { sortMenu = null; void grid.toggleOrderBy(name, { additive: true }); } return; }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    sortMenu = sortMenu?.col === column.name ? null : { x: rect.left, y: rect.bottom + 2, name, col: column.name };
  }

  function applySortOption(direction: OrderBy["direction"] | null) {
    if (!sortMenu) return;
    void grid.applyOrderBy(direction ? { name: sortMenu.name, direction } : null);
    sortMenu = null;
  }

  function applyPin(pin: "left" | "right" | null) {
    if (!sortMenu) return;
    grid.setColumnPinned(sortMenu.col, pin);
    sortMenu = null;
  }

  function startReorder(event: PointerEvent, column: DataTableColumn<DataTableRow>) {
    if (!isColumnReorderable(column, grid) || event.button !== 0) return;
    startColumnDrag(event, column, grid, event.currentTarget as HTMLElement, {
      ghostClassName: themeClass,
      setDraggingColumn: (name) => { drag = name; },
      markDidDrag: () => { didDrag = true; window.setTimeout(() => { didDrag = false; }, 0); }
    });
  }

  function onHeaderKeyDown(event: KeyboardEvent, column: DataTableColumn<DataTableRow>) {
    if (!isColumnReorderable(column, grid) || !(event.ctrlKey || event.metaKey)) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const names = grid.getColumns().map((item) => item.name);
    const index = names.indexOf(column.name);
    const target = event.key === "ArrowLeft" ? index - 1 : index + 1;
    if (target < 0 || target >= names.length) return;
    grid.moveColumn(column.name, names[target], event.key === "ArrowLeft" ? "before" : "after");
  }

  const sortOf = (column: DataTableColumn<DataTableRow>) => columnSortState(snap.orderByList, column);
  const menuDirection = (name: string) => snap.orderByList.find((order) => order.name === name)?.direction ?? null;
  const isResizable = (column: DataTableColumn<DataTableRow>) => isColumnResizable(column, grid);
  const isReorderable = (column: DataTableColumn<DataTableRow>) => isColumnReorderable(column, grid);
  function startResize(event: PointerEvent, column: DataTableColumn<DataTableRow>) {
    event.preventDefault();
    event.stopPropagation();
    const header = (event.currentTarget as HTMLElement).parentElement;
    const startX = event.clientX;
    const startWidth = columnWidths[column.name] ?? header?.getBoundingClientRect().width ?? resizeMinWidth(grid);
    const min = resizeMinWidth(grid);
    const onMove = (move: PointerEvent) => {
      const next = Math.max(min, Math.round(startWidth + (move.clientX - startX)));
      columnWidths = { ...columnWidths, [column.name]: next };
    };
    const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }
  const headerValue = (column: DataTableColumn<DataTableRow>) => {
    const initial = config.onBeforeHeaderCellMounted?.(column, grid);
    return column.headerContentGetter?.(initial, grid) ?? initial ?? column.label;
  };

  function openMenu(event: MouseEvent, column: DataTableColumn<DataTableRow>, row: DataTableRow) {
    const items = config.onContextMenu?.(grid.getCellValue(column, row), column, row, grid);
    if (items?.length) { event.preventDefault(); menu = { x: event.clientX, y: event.clientY, items }; }
  }

  const isExpanded = (row: DataTableRow) => Boolean(row._uuid && snap.expandedRowUuids.includes(row._uuid));
  function toggleExpand(row: DataTableRow) {
    if (!row._uuid) return;
    isExpanded(row) ? grid.collapseRow(row._uuid) : grid.expandRow(row._uuid);
  }
  function onExpandToggle(event: MouseEvent, row: DataTableRow) {
    event.stopPropagation();
    toggleExpand(row);
  }

  function selectRow(row: DataTableRow) {
    if (config.rowFocusEnabled) focusedRow = row._uuid ?? null;
    if (expandable && config.expandRowOnClick) toggleExpand(row);
    config.onClickRow?.(row, grid);
  }

  function selectCell(column: DataTableColumn<DataTableRow>, row: DataTableRow) {
    if (config.cellFocusEnabled ?? true) focusedCell = `${row._uuid}:${column.name}`;
    config.onClickCell?.(grid.getCellValue(column, row), column, row, grid);
  }

  // Imperative API — mirrors the Vue `defineExpose` surface; available on the
  // component instance (`bind:this` / `mount()` exports).
  export function getApi() { return grid; }
  export function refresh() { return grid.refresh(); }
  export function fetch() { return grid.fetch(); }
  export function setRows(rows: DataTableRow[]) { return grid.setRows(rows); }
  export function setDataset(rows: DataTableRow[]) { return grid.setDataset(rows); }
  export function getDataset() { return grid.getDataset(); }
  export function clearRows() { grid.clearRows(); }
  export function addRow(row: DataTableRow) { grid.addRow(row); }
  export function removeRow(uuid: string) { grid.removeRow(uuid); }
  export function updateRow(uuid: string, row: Partial<DataTableRow>) { grid.updateRow(uuid, row); }
  export function upsert(uuid: string, row: DataTableRow) { grid.upsert(uuid, row); }
  export function getRows() { return grid.getRows(); }
  export function getCheckedRows() { return grid.getCheckedRows(); }
  export function clearCheckedRows() { grid.clearCheckedRows(); }
  export function setFilter(name: string, value: unknown) { return grid.setFilter(name, value); }
  export function setFilters(filters: Record<string, unknown>) { return grid.setFilters(filters); }
  export function expandRow(uuid: string) { grid.expandRow(uuid); }
  export function collapseRow(uuid: string) { grid.collapseRow(uuid); }
  export function getExpandedRows() { return grid.getExpandedRows(); }
</script>

<div class={`spark-grid grid-wrapper ${themeClass} ${config.responsiveMode === "VERTICAL_RECORD" ? "spark-grid-responsive-vertical" : ""} ${className}`.trim()} aria-label={config.ariaLabel ?? msg.gridLabel} aria-busy={snap.loading}>
  {#if snap.error}<div class="arcana-grid-error" role="alert">{msg.loadError}</div>{/if}
  <div class="spark-grid-body" style={config.overflowEnabled ? `max-height: ${config.height ?? 560}px; overflow: auto` : undefined}>
    <div class={`grid-header ${config.stickyHeaderEnabled ? "grid-header-sticky" : ""}`} role="row">
      {#if expandable}<div class={`grid-header-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={inlineStyle(expanderStyle, pinStyle(PIN_SLOT_EXPANDER))}></div>{/if}
      {#if config.checkboxEnabled}<div class={`grid-header-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={inlineStyle(selectionStyle, pinStyle(PIN_SLOT_CHECKBOX))}><input type="checkbox" checked={snap.rows.some((row) => row._isChecked)} disabled={config.isCheckboxHeaderDisabled?.(grid)} aria-label={msg.selectAll} onchange={(event) => grid.toggleAll((event.currentTarget as HTMLInputElement).checked)} /></div>{/if}
      {#if config.radioButtonSelectionEnabled}<div class={`grid-header-cell ${pinClass(PIN_SLOT_RADIO)}`} style={inlineStyle(selectionStyle, pinStyle(PIN_SLOT_RADIO))}></div>{/if}
      {#each columns as column (column.name)}
        <div class={`grid-header-cell ${alignmentClass(column, grid)} ${orderable(column) ? "grid-header-order" : ""} ${pinClass(column.name)}${dragClass(column)}`} data-col-name={column.name} tabindex={isReorderable(column) ? 0 : undefined} style={inlineStyle(colStyle(column), pinStyle(column.name))} role="columnheader" aria-sort={orderable(column) ? ariaSortValue(sortOf(column).direction) : undefined} onclick={(event) => onHeaderClick(event, column)} onpointerdown={(event) => startReorder(event, column)} onkeydown={(event) => onHeaderKeyDown(event, column)}><Content value={headerValue(column)} html={column.html === true} /><span class="arcana-sort" aria-hidden="true">{sortGlyph(sortOf(column).direction)}{#if sortOf(column).multi && sortOf(column).direction}<span class="arcana-sort-priority">{sortOf(column).priority}</span>{/if}</span>{#if isResizable(column)}<span class="arcana-col-resizer" role="separator" aria-hidden="true" onpointerdown={(event) => startResize(event, column)} onclick={(event) => event.stopPropagation()}></span>{/if}</div>
      {/each}
      {#if config.actions}<div class={`grid-header-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={inlineStyle(actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS))}>{msg.actions}</div>{/if}
    </div>
    {#if config.searchEnabled !== false}
      <div class="grid-search-row" role="row">
        {#if expandable}<div class={`grid-search-row-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={inlineStyle(expanderStyle, pinStyle(PIN_SLOT_EXPANDER))}></div>{/if}
        {#if config.checkboxEnabled}<div class={`grid-search-row-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={inlineStyle(selectionStyle, pinStyle(PIN_SLOT_CHECKBOX))}></div>{/if}{#if config.radioButtonSelectionEnabled}<div class={`grid-search-row-cell ${pinClass(PIN_SLOT_RADIO)}`} style={inlineStyle(selectionStyle, pinStyle(PIN_SLOT_RADIO))}></div>{/if}
        {#each columns as column (column.name)}
          <div class={`grid-search-row-cell ${pinClass(column.name)}`} style={inlineStyle(colStyle(column), pinStyle(column.name))}>
            {#if column.searchType === "COMPONENT"}
              <Content value={column.searchTypeRenderer?.()} html />
            {:else if searchableColumn(column)}
              <FilterField {column} value={filterValue(column)} disabled={disabledFilter(column)} messages={msg} locale={gridLocale} onChange={(value) => void grid.applyFilter(column, value)} />
            {/if}
          </div>
        {/each}
        {#if config.actions}<div class={`grid-search-row-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={inlineStyle(actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS))}></div>{/if}
      </div>
    {/if}
    <div class="grid-body" role="rowgroup">
      {#if snap.loading && !snap.rows.length}
        <div class="arcana-grid-status" role="status">{msg.loading}</div>
      {:else if !snap.rows.length}
        <div class="arcana-grid-status">{msg.empty}</div>
      {/if}
      {#each snap.rows as row (row._uuid)}
        <div class={`grid-row flex ${row._hasFocus || focusedRow === row._uuid ? "grid-row-focused" : ""} ${row._isChecked || row._isRadioChecked ? "grid-row-checked" : ""}`} role="row" onclick={() => selectRow(row)} ondblclick={() => config.onDoubleClickRow?.(row, grid)}>
          {#if expandable}<div class={`grid-cell grid-expand-cell spark-grid-selection-cell ${pinClass(PIN_SLOT_EXPANDER)}`} data-label="" style={inlineStyle(expanderStyle, pinStyle(PIN_SLOT_EXPANDER))}><button type="button" class={`grid-expand-toggle${isExpanded(row) ? " is-open" : ""}`} aria-expanded={isExpanded(row)} aria-label={isExpanded(row) ? msg.collapseRow : msg.expandRow} onclick={(event) => onExpandToggle(event, row)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></button></div>{/if}
          {#if config.checkboxEnabled}<div class={`grid-cell spark-grid-selection-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={inlineStyle(selectionStyle, config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid), pinStyle(PIN_SLOT_CHECKBOX))}><input type="checkbox" checked={Boolean(row._isChecked)} disabled={row._isCheckboxDisabled} aria-label={msg.selectRow} onclick={(event) => event.stopPropagation()} onchange={(event) => grid.toggleRow(row, (event.currentTarget as HTMLInputElement).checked)} /></div>{/if}
          {#if config.radioButtonSelectionEnabled}<div class={`grid-cell spark-grid-selection-cell ${pinClass(PIN_SLOT_RADIO)}`} style={inlineStyle(selectionStyle, config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid), pinStyle(PIN_SLOT_RADIO))}><input type="radio" name={snap.uuid} checked={Boolean(row._isRadioChecked)} aria-label={msg.selectRow} onclick={(event) => event.stopPropagation()} onchange={() => grid.setSelectedRadioRow(row)} /></div>{/if}
          {#each columns as column (column.name)}
            <div class={`grid-cell ${alignmentClass(column, grid)} ${focusedCell === `${row._uuid}:${column.name}` ? "grid-cell-focused" : ""} ${pinClass(column.name)}`} data-label={column.label} style={cellStyle(column, row)} role="cell" onclick={() => selectCell(column, row)} ondblclick={() => config.onDoubleClickCell?.(grid.getCellValue(column, row), column, row, grid)} oncontextmenu={(event) => openMenu(event, column, row)}><Content value={grid.getCellValue(column, row)} html={column.html === true} /></div>
          {/each}
          {#if config.actions}
            <div class={`grid-cell ${pinClass(PIN_SLOT_ACTIONS)}`} data-label={msg.actions} style={inlineStyle(actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS))}>
              {#each config.actions as action, index (index)}
                {#if action.isVisible?.(row) ?? true}<Content value={action.element(row)} html />{/if}
              {/each}
            </div>
          {/if}
        </div>
        {#if expandable && isExpanded(row)}
          <div class="grid-detail-row" role="row"><div class="grid-detail-cell" role="cell"><ExpandedRowContent {row} {grid} /></div></div>
        {/if}
      {/each}
    </div>
    {#if config.footerSummarizerEnabled}
      <div class={`grid-summarizer ${config.stickyHeaderEnabled ? "grid-summarizer-sticky" : ""}`}>
        {#if expandable}<div class={`grid-summarizer-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={inlineStyle(expanderStyle, pinStyle(PIN_SLOT_EXPANDER))}></div>{/if}
        {#if config.checkboxEnabled}<div class={`grid-summarizer-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={inlineStyle(selectionStyle, pinStyle(PIN_SLOT_CHECKBOX))}></div>{/if}{#if config.radioButtonSelectionEnabled}<div class={`grid-summarizer-cell ${pinClass(PIN_SLOT_RADIO)}`} style={inlineStyle(selectionStyle, pinStyle(PIN_SLOT_RADIO))}></div>{/if}
        {#each columns as column (column.name)}
          <div class={`grid-summarizer-cell ${alignmentClass(column, grid)} ${pinClass(column.name)}`} style={inlineStyle(colStyle(column), { padding: "8px 10px" }, pinStyle(column.name))}><Content value={grid.getSummarizedValue(column)?.formatted} html /></div>
        {/each}
        {#if config.actions}<div class={`grid-summarizer-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={inlineStyle(actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS))}></div>{/if}
      </div>
    {/if}
  </div>
  {#if config.footerVisible ?? true}
    <div class="grid-footer"><div class="spark-grid-pages">
      {#if config.isRowsPerPageVisible ?? true}
        <label class="spark-grid__per-page">{msg.perPage} <select value={snap.rowsPerPage} class="spark-grid-datatable-select" onchange={(event) => void grid.paginate(1, Number((event.currentTarget as HTMLSelectElement).value))}>{#each [10, 25, 50, 100, 250, 500] as size (size)}<option value={size}>{size}</option>{/each}</select></label>
      {/if}
      {#if snap.totalRows}<span class="spark-grid__info">{formatMessage(msg.showingRange, { from: beginning, to: ending, total: snap.totalRows })}</span>{/if}
      <div class="spark-grid__pagination-group"><span class="spark-grid-selected-rows">{grid.getCheckedRows().length ? formatMessage(msg.selectedCount, { count: grid.getCheckedRows().length }) : ""}</span>
        <ul aria-label={msg.pagination}><li><button type="button" disabled={snap.currentPage <= 1} aria-label={msg.previousPage} onclick={() => void grid.paginate(snap.currentPage - 1, snap.rowsPerPage)}>‹</button></li>{#each pages as page (page)}<li class={page === snap.currentPage ? "current" : ""}><button type="button" disabled={page === snap.currentPage} onclick={() => void grid.paginate(page, snap.rowsPerPage)}>{page}</button></li>{/each}<li><button type="button" disabled={snap.currentPage >= lastPage} aria-label={msg.nextPage} onclick={() => void grid.paginate(snap.currentPage + 1, snap.rowsPerPage)}>›</button></li></ul>
      </div>
    </div></div>
  {/if}
  {#if menu}
    <div class={`arcana-context-menu ${themeClass}`} style={`left: ${menu.x}px; top: ${menu.y}px`} role="menu" onclick={(event) => event.stopPropagation()}>
      {#each menu.items as item, index (`${item.label}-${index}`)}
        <button type="button" role="menuitem" onclick={() => { item.onClick?.(); menu = null; }}>{item.label}</button>
      {/each}
    </div>
  {/if}
  {#if sortMenu}
    <div class={`arcana-context-menu arcana-header-menu ${themeClass}`} style={`left: ${sortMenu.x}px; top: ${sortMenu.y}px`} role="menu" onclick={(event) => event.stopPropagation()}>
      {#if menuColumnOrderable}
        <div class="arcana-sort-menu" role="group" aria-label={msg.sortMenu}>
          <button type="button" role="menuitem" class={menuDirection(sortMenu.name) === "asc" ? "is-active" : ""} onclick={() => applySortOption("asc")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5 3.5 8h3v4.5h3V8h3L8 3.5Z" /></svg>{msg.sortAscending}</button>
          <button type="button" role="menuitem" class={menuDirection(sortMenu.name) === "desc" ? "is-active" : ""} onclick={() => applySortOption("desc")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12.5 12.5 8h-3V3.5h-3V8h-3L8 12.5Z" /></svg>{msg.sortDescending}</button>
          {#if menuDirection(sortMenu.name)}
            <button type="button" role="menuitem" class="arcana-sort-menu__clear" onclick={() => applySortOption(null)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>{msg.sortClear}</button>
          {/if}
        </div>
      {/if}
      {#if pinnable}
        <div class="arcana-pin-menu" role="group">
          <button type="button" role="menuitem" class={getColumnPin(sortMenu.col) === "left" ? "is-active" : ""} onclick={() => applyPin("left")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h3v12H3zM7 4h6v8H7z" /></svg>{msg.pinLeft}</button>
          <button type="button" role="menuitem" class={getColumnPin(sortMenu.col) === "right" ? "is-active" : ""} onclick={() => applyPin("right")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2h3v12h-3zM3 4h6v8H3z" /></svg>{msg.pinRight}</button>
          {#if getColumnPin(sortMenu.col)}
            <button type="button" role="menuitem" onclick={() => applyPin(null)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>{msg.unpin}</button>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
