import React, { Fragment, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createDataTable } from "../core/controller";
import { formatMessage, resolveArcanaLocale, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
import { arcanaThemeClass } from "../core/theme";
import { startColumnDrag } from "../core/drag";
import { actionStyle, alignmentClass, ariaSortValue, columnSortState, columnStyle, computePinPlan, expandedRowLoadingContent, expanderStyle, gridRootStyle, isColumnPinnable, isColumnReorderable, isColumnResizable, pagination, PIN_SLOT_ACTIONS, PIN_SLOT_CHECKBOX, PIN_SLOT_EXPANDER, PIN_SLOT_RADIO, resizeMinWidth, selectionStyle, sortGlyph } from "../core/view";
import type { ContextMenuItem, DataTableApi, DataTableColumn, DataTableConfig, DataTableRow, FilterOperator, Renderable, SearchOption, StyleMap } from "../core/types";
import { ArcanaInput, ArcanaSelect, ArcanaDatePicker, ArcanaLoadingOverlay } from "@arcanalabs/ui-components/react";
import "../assets/ArcanaGrid.css";

export interface ArcanaDataTableProps<Row extends DataTableRow = DataTableRow> {
  config: DataTableConfig<Row>;
  className?: string;
  onMounted?: (grid: DataTableApi<Row>) => void;
}

function FilterField<Row extends DataTableRow>({ column, value, operator, disabled, messages, locale, onChange, onOperatorChange }: {
  column: DataTableColumn<Row>; value: unknown; operator: FilterOperator; disabled?: boolean; messages: ArcanaMessages; locale: ArcanaLocale; onChange: (value: unknown) => void; onOperatorChange: (value: FilterOperator) => void;
}) {
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [draft, setDraft] = useState<unknown>(value ?? "");
  useEffect(() => { setDraft(value ?? ""); }, [value]);
  useEffect(() => { let active = true; Promise.resolve(column.searchConfig?.() ?? []).then((items) => { if (active) setOptions(items); }); return () => { active = false; }; }, [column]);

  const booleanOptions = useMemo<SearchOption[]>(() => [
    { value: "", label: messages.booleanAll },
    { value: "1", label: messages.booleanYes },
    { value: "0", label: messages.booleanNo }
  ], [messages]);
  const filterLabel = formatMessage(messages.filterLabel, { label: column.label });
  const operators: FilterOperator[] = column.filterOperators ?? (column.type === "NUMBER" || column.type === "CURRENCY" || column.type === "PERCENTAGE"
    ? ["equals", "notEquals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"]
    : column.searchType == null ? ["contains", "startsWith", "endsWith", "equals", "notEquals"] : []);
  const operatorLabels: Record<FilterOperator, string> = { contains: messages.opContains, startsWith: messages.opStartsWith, endsWith: messages.opEndsWith, equals: messages.opEquals, notEquals: messages.opNotEquals, greaterThan: messages.opGreaterThan, greaterThanOrEqual: messages.opGreaterThanOrEqual, lessThan: messages.opLessThan, lessThanOrEqual: messages.opLessThanOrEqual, between: messages.opBetween };
  const wrap = (control: React.ReactNode) => <div className="arcana-filter-composer">
    {operators.length > 1 ? <select className="arcana-filter-operator" aria-label={`${messages.filterOperator}: ${column.label}`} value={operator} onChange={(event) => onOperatorChange(event.target.value as FilterOperator)}>{operators.map((item) => <option key={item} value={item}>{operatorLabels[item]}</option>)}</select> : null}
    {control}
  </div>;
  const commit = (next: unknown) => { setDraft(next); onChange(next); };
  if (column.searchType === "DATE_RANGE") {
    const range: [string, string] = Array.isArray(draft) ? [String(draft[0] ?? ""), String(draft[1] ?? "")] : ["", ""];
    return wrap(<ArcanaDatePicker type="daterange" size="sm" value={range} disabled={disabled} locale={locale} ariaLabel={filterLabel} onValueChange={commit} />);
  }
  if (column.searchType === "BOOLEAN") {
    return wrap(<ArcanaSelect size="sm" value={String(draft ?? "")} options={booleanOptions.map((option) => ({ label: option.label, value: String(option.value) }))} disabled={disabled} placeholder={messages.booleanAll} onChange={commit} />);
  }
  if (column.searchType === "LIST" || column.searchType === "REMOTE") {
    const selected = Array.isArray(draft) ? draft.map(String) : draft == null || draft === "" ? [] : [String(draft)];
    return wrap(<ArcanaSelect size="sm" multiple value={selected} options={options.map((option) => ({ label: option.label, value: String(option.value) }))} disabled={disabled} placeholder={messages.booleanAll} onChange={commit} />);
  }
  if (column.searchType === "DATE" || column.searchType === "DATE_MONTH") {
    return wrap(<ArcanaDatePicker type={column.searchType === "DATE" ? "date" : "month"} size="sm" value={String(draft ?? "")} disabled={disabled} locale={locale} ariaLabel={filterLabel} onValueChange={commit} />);
  }
  return wrap(<label className="arcana-search-input">
    <span className="arcana-visually-hidden">{filterLabel}</span>
    <ArcanaInput
      type="search"
      size="sm"
      value={String(draft)}
      disabled={disabled}
      iconStart={<svg className="arcana-search-input__icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.5 10.5 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
      onValueChange={(next) => setDraft(next ?? "")}
      onBlur={() => onChange(draft)}
      onKeyDown={(event) => { if (event.key === "Enter") onChange(draft); }}
    />
  </label>);
}

/**
 * Renders a `Renderable`. String content is escaped text by default and is
 * only interpreted as HTML when `html` is true (opt-in per column via
 * `column.html`); React elements and other node returns render natively.
 */
function Content({ value, html = false }: { value: Renderable; html?: boolean }) {
  const resolved = typeof value === "function" ? (value as () => Renderable)() : value;
  if (resolved == null) return null;
  if (React.isValidElement(resolved)) return resolved;
  if (typeof resolved === "string") return html ? <span dangerouslySetInnerHTML={{ __html: resolved }} /> : <span>{resolved}</span>;
  if (["number", "boolean"].includes(typeof resolved)) return <span>{String(resolved)}</span>;
  return resolved as React.ReactNode;
}

function ExpandedRowContent<Row extends DataTableRow>({ row, grid, messages }: { row: Row; grid: DataTableApi<Row>; messages: ArcanaMessages }) {
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; content?: Renderable }>({ status: "loading" });
  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    try {
      const result = grid.config.expandedRowRenderer?.(row, grid);
      if (result && typeof (result as Promise<Renderable>).then === "function") {
        (result as Promise<Renderable>).then(
          (content) => { if (active) setState({ status: "ready", content }); },
          (error) => { console.error(error); if (active) setState({ status: "error" }); }
        );
      } else {
        setState({ status: "ready", content: result });
      }
    } catch (error) {
      console.error(error);
      setState({ status: "error" });
    }
    return () => { active = false; };
  }, [row, grid]);
  if (state.status === "loading") return <Content html value={grid.config.expandedRowLoadingRenderer?.(row, grid) ?? expandedRowLoadingContent(messages)} />;
  if (state.status === "error") return <div className="grid-detail-error">{messages.expandedError}</div>;
  return <Content html value={state.content} />;
}

function ArcanaDataTableInner<Row extends DataTableRow = DataTableRow>({ config, className = "", onMounted }: ArcanaDataTableProps<Row>, ref: React.ForwardedRef<DataTableApi<Row>>) {
  const grid = useMemo(() => createDataTable(config), [config]);
  const mountedGrid = useRef<DataTableApi<Row> | null>(null);
  const state = useSyncExternalStore(grid.subscribe, grid.getSnapshot, grid.getSnapshot);
  const [menu, setMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  const [sortMenu, setSortMenu] = useState<{ x: number; y: number; name: string; col: string } | null>(null);
  const [focusedRow, setFocusedRow] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [dragName, setDragName] = useState<string | null>(null);
  const [rowDragUuid, setRowDragUuid] = useState<string | null>(null);
  const [columnChooserOpen, setColumnChooserOpen] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editDrafts, setEditDrafts] = useState<Record<string, string>>({});
  const didDrag = useRef(false);
  useImperativeHandle(ref, () => grid, [grid]);
  useEffect(() => {
    if (mountedGrid.current === grid) return;
    mountedGrid.current = grid;
    onMounted?.(grid);
    if (config.sendRequestOnMounted !== false) void grid.refresh();
  }, [grid, config.sendRequestOnMounted, onMounted]);
  useEffect(() => { if (!menu) return; const close = () => setMenu(null); window.addEventListener("click", close); window.addEventListener("blur", close); return () => { window.removeEventListener("click", close); window.removeEventListener("blur", close); }; }, [menu]);
  useEffect(() => {
    if (!sortMenu) return;
    const close = () => setSortMenu(null);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSortMenu(null); };
    window.addEventListener("click", close);
    window.addEventListener("blur", close);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("click", close); window.removeEventListener("blur", close); window.removeEventListener("keydown", onKey); };
  }, [sortMenu]);

  const allDisplayColumns = grid.getColumns();
  const allColumns = grid.getAllColumns();
  const columnVirtual = Boolean(config.columnVirtualizationEnabled && !allDisplayColumns.some((column) => grid.getColumnPin(column.name)));
  const virtualColumnWidth = Math.max(60, config.virtualColumnWidth ?? 160);
  const virtualColumnOverscan = Math.max(0, config.virtualOverscan ?? 2);
  const virtualColumnStart = columnVirtual ? Math.max(0, Math.floor(scrollLeft / virtualColumnWidth) - virtualColumnOverscan) : 0;
  const virtualColumnEnd = columnVirtual ? Math.min(allDisplayColumns.length, virtualColumnStart + Math.ceil((config.virtualColumnViewportWidth ?? 800) / virtualColumnWidth) + virtualColumnOverscan * 2) : allDisplayColumns.length;
  const columns = allDisplayColumns.slice(virtualColumnStart, virtualColumnEnd);
  const virtual = Boolean(config.rowVirtualizationEnabled);
  const virtualRowHeight = Math.max(24, config.virtualRowHeight ?? 42);
  const virtualOverscan = Math.max(0, config.virtualOverscan ?? 5);
  const viewportHeight = config.height ?? 400;
  const virtualStart = virtual ? Math.max(0, Math.floor(scrollTop / virtualRowHeight) - virtualOverscan) : 0;
  const virtualEnd = virtual ? Math.min(state.rows.length, Math.ceil((scrollTop + viewportHeight) / virtualRowHeight) + virtualOverscan) : state.rows.length;
  const renderedRows = state.rows.slice(virtualStart, virtualEnd);
  const pages = pagination(state.currentPage, state.totalRows, state.rowsPerPage);
  const lastPage = Math.ceil(state.totalRows / state.rowsPerPage);
  const beginning = state.totalRows ? ((state.currentPage - 1) * state.rowsPerPage) + 1 : 0;
  const ending = Math.min(state.currentPage * state.rowsPerPage, state.totalRows);
  const colStyle = (column: DataTableColumn<Row>): StyleMap => columnStyle(column, grid, columnWidths[column.name]);
  const cellStyles = (column: DataTableColumn<Row>, row: Row): React.CSSProperties => ({
    ...colStyle(column), padding: "8px 10px",
    ...config.onBeforeCellStyleMounted?.(grid.getCellValue(column, row), column, row, grid),
    ...column.onBeforeColumnStyleMounted?.(grid.getCellValue(column, row), row, grid)
  } as React.CSSProperties);
  const orderable = (column: DataTableColumn<Row>) => config.orderByEnabled !== false && column.orderByEnabled !== false;
  const pinnable = isColumnPinnable(grid);
  const pinPlan = computePinPlan(grid, columns, columnWidths);
  const onHeaderClick = (event: React.MouseEvent, column: DataTableColumn<Row>) => {
    if (didDrag.current) return; // a drag just ended — don't open the menu
    const isOrderable = orderable(column);
    if (!isOrderable && !pinnable) return;
    const name = column.filterName ?? column.name;
    event.stopPropagation();
    // Shift-click builds a multi-column sort without opening the menu.
    if (event.shiftKey) { if (isOrderable) { setSortMenu(null); void grid.toggleOrderBy(name, { additive: true }); } return; }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setSortMenu((current) => current?.col === column.name ? null : { x: rect.left, y: rect.bottom + 2, name, col: column.name });
  };
  const applySortOption = (direction: "asc" | "desc" | null) => {
    if (!sortMenu) return;
    void grid.applyOrderBy(direction ? { name: sortMenu.name, direction } : null);
    setSortMenu(null);
  };
  const applyPin = (pin: "left" | "right" | null) => {
    if (!sortMenu) return;
    grid.setColumnPinned(sortMenu.col, pin);
    setSortMenu(null);
  };
  const sortOf = (column: DataTableColumn<Row>) => columnSortState(state.orderByList, column);
  const menuDirection = (name: string) => state.orderByList.find((order) => order.name === name)?.direction ?? null;
  const startReorder = (event: React.PointerEvent, column: DataTableColumn<Row>) => {
    if (!isColumnReorderable(column, grid) || event.button !== 0) return;
    startColumnDrag(event.nativeEvent, column, grid, event.currentTarget as HTMLElement, {
      ghostClassName: themeClass,
      setDraggingColumn: setDragName,
      markDidDrag: () => { didDrag.current = true; window.setTimeout(() => { didDrag.current = false; }, 0); }
    });
  };
  const onHeaderKeyDown = (event: React.KeyboardEvent, column: DataTableColumn<Row>) => {
    if (!isColumnReorderable(column, grid) || !(event.ctrlKey || event.metaKey)) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const names = grid.getColumns().map((item) => item.name);
    const index = names.indexOf(column.name);
    const target = event.key === "ArrowLeft" ? index - 1 : index + 1;
    if (target < 0 || target >= names.length) return;
    grid.moveColumn(column.name, names[target], event.key === "ArrowLeft" ? "before" : "after");
  };
  const pinClass = (key: string) => pinPlan.className(key);
  const pinStyle = (key: string): StyleMap => pinPlan.cellStyle(key);
  const dragClass = (column: DataTableColumn<Row>) => dragName === column.name ? " arcana-col-dragging" : "";
  const startResize = (event: React.PointerEvent, column: DataTableColumn<Row>) => {
    event.preventDefault();
    event.stopPropagation();
    const header = (event.currentTarget as HTMLElement).parentElement;
    const startX = event.clientX;
    const startWidth = columnWidths[column.name] ?? header?.getBoundingClientRect().width ?? resizeMinWidth(grid);
    const min = resizeMinWidth(grid);
    const onMove = (move: PointerEvent) => {
      const next = Math.max(min, Math.round(startWidth + (move.clientX - startX)));
      setColumnWidths((current) => ({ ...current, [column.name]: next }));
    };
    const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const headerValue = (column: DataTableColumn<Row>) => {
    const initial = config.onBeforeHeaderCellMounted?.(column, grid);
    return column.headerContentGetter?.(initial, grid) ?? initial ?? column.label;
  };
  const openMenu = (event: React.MouseEvent, column: DataTableColumn<Row>, row: Row) => {
    const items = config.onContextMenu?.(grid.getCellValue(column, row), column, row, grid);
    if (items?.length) { event.preventDefault(); setMenu({ x: event.clientX, y: event.clientY, items }); }
  };
  const reactStyle = (style: StyleMap) => style as React.CSSProperties;
  const selectionCellStyle = (row: Row) => reactStyle({ ...selectionStyle, ...config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid) });
  const expandable = Boolean(config.expandableRowsEnabled);
  const isExpanded = (row: Row) => Boolean(row._uuid && state.expandedRowUuids.includes(row._uuid));
  const toggleExpand = (row: Row) => {
    if (!row._uuid) return;
    isExpanded(row) ? grid.collapseRow(row._uuid) : grid.expandRow(row._uuid);
  };
  const selectRow = (row: Row) => {
    if (config.rowFocusEnabled) setFocusedRow(row._uuid ?? null);
    if (expandable && config.expandRowOnClick) toggleExpand(row);
    config.onClickRow?.(row, grid);
  };
  const selectCell = (column: DataTableColumn<Row>, row: Row) => {
    if (config.cellFocusEnabled ?? true) setFocusedCell(`${row._uuid}:${column.name}`);
    config.onClickCell?.(grid.getCellValue(column, row), column, row, grid);
  };
  const beginCellEdit = (column: DataTableColumn<Row>, row: Row) => {
    if (!config.editingEnabled || column.editable === false || row._arcanaGroup || !row._uuid) return;
    if (config.editMode === "row") {
      setEditingRow(row._uuid);
      setEditDrafts(Object.fromEntries(allDisplayColumns.filter((item) => item.editable !== false).map((item) => [item.name, String((row as Record<string, unknown>)[item.name] ?? "")])));
    } else {
      setEditingCell(`${row._uuid}:${column.name}`);
      setEditDrafts({ [column.name]: String((row as Record<string, unknown>)[column.name] ?? "") });
    }
  };
  const commitCellEdit = async (column: DataTableColumn<Row>, row: Row) => {
    if (!row._uuid) return;
    const raw = editDrafts[column.name] ?? "";
    const value = column.editParser?.(raw, row, grid) ?? (column.type === "NUMBER" || column.type === "CURRENCY" || column.type === "PERCENTAGE" ? Number(raw) : raw);
    await grid.updateCell(row._uuid, column.name, value);
    setEditingCell(null);
  };
  const saveRowEdit = async (row: Row) => {
    if (!row._uuid) return;
    const previous = { ...row } as Row;
    for (const column of allDisplayColumns.filter((item) => item.editable !== false)) {
      const raw = editDrafts[column.name] ?? "";
      const value = column.editParser?.(raw, row, grid) ?? (column.type === "NUMBER" || column.type === "CURRENCY" || column.type === "PERCENTAGE" ? Number(raw) : raw);
      await grid.updateCell(row._uuid, column.name, value);
    }
    const current = (grid.mode === "dataset" ? grid.getDataset() : grid.getRows()).find((item) => item._uuid === row._uuid);
    if (current) await config.onRowEdit?.(current, previous, grid);
    setEditingRow(null);
    setEditDrafts({});
  };

  const themeClass = arcanaThemeClass(config.theme);
  const messages = resolveArcanaMessages(config);
  const gridLocale = resolveArcanaLocale(config);
  const menuColumn = sortMenu ? columns.find((column) => column.name === sortMenu.col) : undefined;
  const menuColumnOrderable = menuColumn ? orderable(menuColumn) : false;

  return (
    <div className={`arcana-grid grid-wrapper ${themeClass} ${config.responsiveMode === "VERTICAL_RECORD" ? "arcana-grid-responsive-vertical" : ""} ${columnVirtual ? "arcana-column-virtualized" : ""} ${className}`.trim()} style={{ ...reactStyle(gridRootStyle(config)), "--arcana-virtual-column-offset": `${virtualColumnStart * virtualColumnWidth}px`, "--arcana-virtual-column-total": `${allDisplayColumns.length * virtualColumnWidth}px` } as React.CSSProperties} aria-label={config.ariaLabel ?? messages.gridLabel} aria-busy={state.loading}>
      {state.error ? <div className="arcana-grid-error" role="alert">{messages.loadError}</div> : null}
      <ArcanaLoadingOverlay visible={state.loading} text={messages.loading} />
      {config.columnVisibilityEnabled ? <div className="arcana-column-tools">
        <button type="button" className="arcana-column-trigger" aria-expanded={columnChooserOpen} onClick={() => setColumnChooserOpen((open) => !open)}>{messages.columns}</button>
        {columnChooserOpen ? <div className="arcana-column-chooser">
          {allColumns.map((column) => <label key={column.name}><input type="checkbox" checked={grid.isColumnVisible(column.name)} onChange={(event) => grid.setColumnVisible(column.name, event.target.checked)} />{column.label}</label>)}
          <button type="button" onClick={() => grid.resetColumnState()}>{messages.resetColumns}</button>
        </div> : null}
      </div> : null}
      <div className="arcana-grid-body" onScroll={(event) => { if (virtual) setScrollTop(event.currentTarget.scrollTop); if (columnVirtual) setScrollLeft(event.currentTarget.scrollLeft); }} style={config.overflowEnabled || virtual || columnVirtual ? { maxHeight: config.height ?? 560, overflow: "auto" } : undefined}>
        <div className={`grid-header ${config.stickyHeaderEnabled ? "grid-header-sticky" : ""}`} role="row">
          {expandable ? <div className={`grid-header-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })} /> : null}
          {config.checkboxEnabled ? <div className={`grid-header-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_CHECKBOX) })}><input type="checkbox" checked={state.rows.some((row) => row._isChecked)} disabled={config.isCheckboxHeaderDisabled?.(grid)} aria-label={messages.selectAll} onChange={(event) => grid.toggleAll(event.target.checked)} /></div> : null}
          {config.radioButtonSelectionEnabled ? <div className={`grid-header-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_RADIO) })} /> : null}
          {columns.map((column) => { const sort = sortOf(column); return <div key={column.name} data-col-name={column.name} tabIndex={isColumnReorderable(column, grid) ? 0 : undefined} className={`grid-header-cell ${alignmentClass(column, grid)} ${orderable(column) ? "grid-header-order" : ""} ${pinClass(column.name)}${dragClass(column)}`} style={reactStyle({ ...colStyle(column), ...pinStyle(column.name) })} role="columnheader" aria-sort={orderable(column) ? ariaSortValue(sort.direction) : undefined} onClick={(event) => onHeaderClick(event, column)} onPointerDown={(event) => startReorder(event, column)} onKeyDown={(event) => onHeaderKeyDown(event, column)}><Content value={headerValue(column)} html={column.html === true} />{orderable(column) ? <span className="arcana-sort" aria-hidden="true">{sortGlyph(sort.direction)}{sort.multi && sort.direction ? <span className="arcana-sort-priority">{sort.priority}</span> : null}</span> : null}{isColumnResizable(column, grid) ? <span className="arcana-col-resizer" role="separator" aria-hidden="true" onPointerDown={(event) => startResize(event, column)} onClick={(event) => event.stopPropagation()} /> : null}</div>; })}
          {config.actions ? <div className={`grid-header-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })}>{messages.actions}</div> : null}
        </div>
        {config.searchEnabled !== false ? <div className="grid-search-row" role="row">
          {expandable ? <div className={`grid-search-row-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })} /> : null}
          {config.checkboxEnabled ? <div className={`grid-search-row-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_CHECKBOX) })} /> : null}{config.radioButtonSelectionEnabled ? <div className={`grid-search-row-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_RADIO) })} /> : null}
          {columns.map((column) => { const filterName = column.filterName ?? column.name; return <div key={column.name} className={`grid-search-row-cell ${pinClass(column.name)}`} style={reactStyle({ ...colStyle(column), ...pinStyle(column.name) })}>{column.searchType === "COMPONENT" ? <Content html value={column.searchTypeRenderer?.()} /> : column.searchEnabled ?? true ? <FilterField column={column} value={state.filters[filterName] ?? config.initialFilters?.[filterName]} operator={grid.getFilterOperator(filterName)} disabled={Boolean(config.disableFilterWhenPresentOnInitialFilters && config.initialFilters?.[filterName])} messages={messages} locale={gridLocale} onOperatorChange={(operator) => void grid.setFilterOperator(filterName, operator)} onChange={(value) => void grid.applyFilter(column, value)} /> : null}</div>; })}
          {config.actions ? <div className={`grid-search-row-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })} /> : null}
        </div> : null}
        <div className="grid-body" role="rowgroup">
          {!state.loading && !state.rows.length ? <div className="arcana-grid-status">{messages.empty}</div> : null}
          {virtualStart ? <div className="arcana-virtual-spacer" aria-hidden="true" style={{ height: virtualStart * virtualRowHeight }} /> : null}
          {renderedRows.map((row) => row._arcanaGroup ? <div key={row._uuid} className="arcana-group-row" role="row" style={{ paddingInlineStart: 12 + row._arcanaGroup.level * 18 }}><strong>{row._arcanaGroup.label}: {String(row._arcanaGroup.value)}</strong><span>{formatMessage(messages.groupCount, { count: row._arcanaGroup.count })}</span>{Object.entries(row._arcanaGroup.aggregates).map(([name, value]) => <span key={name} className="arcana-group-aggregate">{allDisplayColumns.find((column) => column.name === name)?.label ?? name}: {String(value)}</span>)}</div> : <Fragment key={row._uuid}>
            <div draggable={Boolean(config.rowReorderEnabled)} onDragStart={() => setRowDragUuid(row._uuid ?? null)} onDragOver={(event) => { if (config.rowReorderEnabled) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); if (rowDragUuid && row._uuid) grid.moveRow(rowDragUuid, row._uuid); setRowDragUuid(null); }} className={`grid-row flex ${row._hasFocus || focusedRow === row._uuid ? "grid-row-focused" : ""} ${row._isChecked || row._isRadioChecked ? "grid-row-checked" : ""}${rowDragUuid === row._uuid ? " arcana-row-dragging" : ""}`} role="row" onClick={() => selectRow(row)} onDoubleClick={() => config.onDoubleClickRow?.(row, grid)}>
              {expandable ? <div className={`grid-cell grid-expand-cell arcana-grid-selection-cell ${pinClass(PIN_SLOT_EXPANDER)}`} data-label="" style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })}><button type="button" className={`grid-expand-toggle${isExpanded(row) ? " is-open" : ""}`} aria-expanded={isExpanded(row)} aria-label={isExpanded(row) ? messages.collapseRow : messages.expandRow} onClick={(event) => { event.stopPropagation(); toggleExpand(row); }}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div> : null}
              {config.checkboxEnabled ? <div className={`grid-cell arcana-grid-selection-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid), ...pinStyle(PIN_SLOT_CHECKBOX) })}><input type="checkbox" checked={Boolean(row._isChecked)} disabled={row._isCheckboxDisabled} aria-label={messages.selectRow} onClick={(event) => event.stopPropagation()} onChange={(event) => grid.toggleRow(row, event.target.checked)} /></div> : null}
              {config.radioButtonSelectionEnabled ? <div className={`grid-cell arcana-grid-selection-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid), ...pinStyle(PIN_SLOT_RADIO) })}><input type="radio" name={state.uuid} checked={Boolean(row._isRadioChecked)} aria-label={messages.selectRow} onClick={(event) => event.stopPropagation()} onChange={() => grid.setSelectedRadioRow(row)} /></div> : null}
              {columns.map((column) => { const activeEdit = editingRow === row._uuid || editingCell === `${row._uuid}:${column.name}`; return <div key={column.name} className={`grid-cell ${alignmentClass(column, grid)} ${focusedCell === `${row._uuid}:${column.name}` ? "grid-cell-focused" : ""} ${pinClass(column.name)}`} data-label={column.label} style={{ ...cellStyles(column, row), ...pinStyle(column.name) } as React.CSSProperties} role="cell" onClick={() => selectCell(column, row)} onDoubleClick={() => { beginCellEdit(column, row); config.onDoubleClickCell?.(grid.getCellValue(column, row), column, row, grid); }} onContextMenu={(event) => openMenu(event, column, row)}>{activeEdit && column.editable !== false ? <input className="arcana-cell-editor" autoFocus={editingCell === `${row._uuid}:${column.name}`} value={editDrafts[column.name] ?? ""} onClick={(event) => event.stopPropagation()} onChange={(event) => setEditDrafts((drafts) => ({ ...drafts, [column.name]: event.target.value }))} onBlur={() => { if (config.editMode !== "row") void commitCellEdit(column, row); }} onKeyDown={(event) => { if (event.key === "Enter" && config.editMode !== "row") void commitCellEdit(column, row); if (event.key === "Escape") { setEditingCell(null); setEditingRow(null); } }} /> : <Content value={grid.getCellValue(column, row)} html={column.html === true} />}</div>; })}
              {config.actions ? <div className={`grid-cell ${pinClass(PIN_SLOT_ACTIONS)}`} data-label={messages.actions} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })}>{config.actions.map((action, index) => action.isVisible?.(row) ?? true ? <Content key={index} html value={action.element(row)} /> : null)}</div> : null}
              {editingRow === row._uuid ? <div className="arcana-row-edit-actions"><button type="button" onClick={(event) => { event.stopPropagation(); void saveRowEdit(row); }}>{messages.save}</button><button type="button" onClick={(event) => { event.stopPropagation(); setEditingRow(null); setEditDrafts({}); }}>{messages.cancel}</button></div> : null}
            </div>
            {expandable && isExpanded(row) ? <div className="grid-detail-row" role="row"><div className="grid-detail-cell" role="cell"><ExpandedRowContent row={row} grid={grid} messages={messages} /></div></div> : null}
          </Fragment>)}
          {virtualEnd < state.rows.length ? <div className="arcana-virtual-spacer" aria-hidden="true" style={{ height: (state.rows.length - virtualEnd) * virtualRowHeight }} /> : null}
        </div>
        {config.footerSummarizerEnabled ? <div className={`grid-summarizer ${config.stickyHeaderEnabled ? "grid-summarizer-sticky" : ""}`}>{expandable ? <div className={`grid-summarizer-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })} /> : null}{config.checkboxEnabled ? <div className={`grid-summarizer-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_CHECKBOX) })} /> : null}{config.radioButtonSelectionEnabled ? <div className={`grid-summarizer-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_RADIO) })} /> : null}{columns.map((column) => <div key={column.name} className={`grid-summarizer-cell ${alignmentClass(column, grid)} ${pinClass(column.name)}`} style={{ ...reactStyle(colStyle(column)), padding: "8px 10px", ...pinStyle(column.name) }}><Content html value={grid.getSummarizedValue(column)?.formatted} /></div>)}{config.actions ? <div className={`grid-summarizer-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })} /> : null}</div> : null}
      </div>
      {config.footerVisible ?? true ? <div className="grid-footer"><div className="arcana-grid-pages">
        {config.isRowsPerPageVisible ?? true ? <label className="arcana-grid__per-page">{messages.perPage} <select value={state.rowsPerPage} className="arcana-grid-datatable-select" onChange={(event) => void grid.paginate(1, Number(event.target.value))}>{[10,25,50,100,250,500].map((size) => <option key={size} value={size}>{size}</option>)}</select></label> : null}
        {state.totalRows ? <span className="arcana-grid__info">{formatMessage(messages.showingRange, { from: beginning, to: ending, total: state.totalRows })}</span> : null}
        <div className="arcana-grid__pagination-group"><span className="arcana-grid-selected-rows">{grid.getCheckedRows().length ? formatMessage(messages.selectedCount, { count: grid.getCheckedRows().length }) : ""}</span>
          <ul aria-label={messages.pagination}><li><button type="button" disabled={state.currentPage <= 1} aria-label={messages.previousPage} onClick={() => void grid.paginate(state.currentPage - 1, state.rowsPerPage)}>‹</button></li>{pages.map((page) => <li key={page} className={page === state.currentPage ? "current" : ""}><button type="button" disabled={page === state.currentPage} onClick={() => void grid.paginate(page, state.rowsPerPage)}>{page}</button></li>)}<li><button type="button" disabled={state.currentPage >= lastPage} aria-label={messages.nextPage} onClick={() => void grid.paginate(state.currentPage + 1, state.rowsPerPage)}>›</button></li></ul>
        </div>
      </div></div> : null}
      {menu ? <div className={`arcana-context-menu ${themeClass}`} style={{ left: menu.x, top: menu.y }} role="menu" onClick={(event) => event.stopPropagation()}>{menu.items.map((item, index) => <button key={`${item.label}-${index}`} type="button" role="menuitem" onClick={() => { item.onClick?.(); setMenu(null); }}>{item.label}</button>)}</div> : null}
      {sortMenu ? <div className={`arcana-context-menu arcana-header-menu ${themeClass}`} style={{ left: sortMenu.x, top: sortMenu.y }} role="menu" onClick={(event) => event.stopPropagation()}>
        {menuColumnOrderable ? <div className="arcana-sort-menu" role="group" aria-label={messages.sortMenu}>
          <button type="button" role="menuitem" className={menuDirection(sortMenu.name) === "asc" ? "is-active" : ""} onClick={() => applySortOption("asc")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5 3.5 8h3v4.5h3V8h3L8 3.5Z" /></svg>{messages.sortAscending}</button>
          <button type="button" role="menuitem" className={menuDirection(sortMenu.name) === "desc" ? "is-active" : ""} onClick={() => applySortOption("desc")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12.5 12.5 8h-3V3.5h-3V8h-3L8 12.5Z" /></svg>{messages.sortDescending}</button>
          {menuDirection(sortMenu.name) ? <button type="button" role="menuitem" className="arcana-sort-menu__clear" onClick={() => applySortOption(null)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>{messages.sortClear}</button> : null}
        </div> : null}
        {pinnable ? <div className="arcana-pin-menu" role="group">
          <button type="button" role="menuitem" className={grid.getColumnPin(sortMenu.col) === "left" ? "is-active" : ""} onClick={() => applyPin("left")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h3v12H3zM7 4h6v8H7z" /></svg>{messages.pinLeft}</button>
          <button type="button" role="menuitem" className={grid.getColumnPin(sortMenu.col) === "right" ? "is-active" : ""} onClick={() => applyPin("right")}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2h3v12h-3zM3 4h6v8H3z" /></svg>{messages.pinRight}</button>
          {grid.getColumnPin(sortMenu.col) ? <button type="button" role="menuitem" onClick={() => applyPin(null)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>{messages.unpin}</button> : null}
        </div> : null}
        {config.columnVisibilityEnabled && columns.length > 1 ? <button type="button" role="menuitem" className="arcana-hide-column" onClick={() => { grid.setColumnVisible(sortMenu.col, false); setSortMenu(null); }}>{messages.hideColumn}</button> : null}
      </div> : null}
    </div>
  );
}

export const ArcanaDataTable = forwardRef(ArcanaDataTableInner) as <Row extends DataTableRow = DataTableRow>(props: ArcanaDataTableProps<Row> & { ref?: React.ForwardedRef<DataTableApi<Row>> }) => React.ReactElement;
export const SparkGrid = ArcanaDataTable;
