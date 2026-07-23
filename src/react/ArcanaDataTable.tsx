import React, { Fragment, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createDataTable } from "../core/controller";
import { formatMessage, resolveArcanaLocale, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
import { arcanaThemeClass } from "../core/theme";
import { actionStyle, alignmentClass, ariaSortValue, columnSortState, columnStyle, computePinPlan, dropSide, expandedRowLoadingContent, expanderStyle, isColumnPinnable, isColumnReorderable, isColumnResizable, pagination, PIN_SLOT_ACTIONS, PIN_SLOT_CHECKBOX, PIN_SLOT_EXPANDER, PIN_SLOT_RADIO, resizeMinWidth, selectionStyle, sortGlyph } from "../core/view";
import type { ContextMenuItem, DataTableApi, DataTableColumn, DataTableConfig, DataTableRow, Renderable, SearchOption, StyleMap } from "../core/types";
import { ArcanaSelect } from "./ArcanaSelect";
import { ArcanaDatePicker } from "./ArcanaDatePicker";
import "../assets/SparkGrid.css";

export interface ArcanaDataTableProps<Row extends DataTableRow = DataTableRow> {
  config: DataTableConfig<Row>;
  className?: string;
  onMounted?: (grid: DataTableApi<Row>) => void;
}

function FilterField<Row extends DataTableRow>({ column, value, disabled, messages, locale, onChange }: {
  column: DataTableColumn<Row>; value: unknown; disabled?: boolean; messages: ArcanaMessages; locale: ArcanaLocale; onChange: (value: unknown) => void;
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
  const commit = (next: unknown) => { setDraft(next); onChange(next); };
  if (column.searchType === "DATE_RANGE") {
    const range: [string, string] = Array.isArray(draft) ? [String(draft[0] ?? ""), String(draft[1] ?? "")] : ["", ""];
    return <ArcanaDatePicker mode="range" value={range} disabled={disabled} messages={messages} locale={locale} ariaLabel={filterLabel} onChange={commit} />;
  }
  if (column.searchType === "BOOLEAN") {
    return <ArcanaSelect value={String(draft ?? "")} options={booleanOptions} disabled={disabled} messages={messages} placeholder={messages.booleanAll} ariaLabel={filterLabel} onChange={commit} />;
  }
  if (column.searchType === "LIST" || column.searchType === "REMOTE") {
    const selected = Array.isArray(draft) ? draft.map(String) : draft == null || draft === "" ? [] : [String(draft)];
    return <ArcanaSelect multiple value={selected} options={options} disabled={disabled} messages={messages} placeholder={messages.booleanAll} ariaLabel={filterLabel} onChange={commit} />;
  }
  if (column.searchType === "DATE" || column.searchType === "DATE_MONTH") {
    return <ArcanaDatePicker mode={column.searchType === "DATE" ? "date" : "month"} value={String(draft ?? "")} disabled={disabled} messages={messages} locale={locale} ariaLabel={filterLabel} onChange={commit} />;
  }
  return <input type="search" value={String(draft)} disabled={disabled} className="spark-grid-datatable-input" aria-label={filterLabel} onChange={(event) => setDraft(event.target.value)} onBlur={() => onChange(draft)} onKeyDown={(event) => { if (event.key === "Enter") onChange(draft); }} />;
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
  const [drag, setDrag] = useState<{ name: string; over: string | null; side: "before" | "after" } | null>(null);
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

  const columns = grid.getColumns();
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
    const startX = event.clientX;
    const startY = event.clientY;
    let dragging = false;
    const overOf = (x: number, y: number) => (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>(".grid-header-cell")?.getAttribute("data-col-name") ?? null;
    const onMove = (move: PointerEvent) => {
      if (!dragging) {
        if (Math.abs(move.clientX - startX) < 5 && Math.abs(move.clientY - startY) < 5) return;
        dragging = true;
      }
      const el = (document.elementFromPoint(move.clientX, move.clientY) as HTMLElement | null)?.closest<HTMLElement>(".grid-header-cell");
      const over = el?.getAttribute("data-col-name") ?? null;
      setDrag({ name: column.name, over, side: el ? dropSide(move.clientX, el.getBoundingClientRect()) : "after" });
    };
    const onUp = (up: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (!dragging) return;
      didDrag.current = true;
      const over = overOf(up.clientX, up.clientY);
      const el = (document.elementFromPoint(up.clientX, up.clientY) as HTMLElement | null)?.closest<HTMLElement>(".grid-header-cell");
      if (over && over !== column.name && el) grid.moveColumn(column.name, over, dropSide(up.clientX, el.getBoundingClientRect()));
      setDrag(null);
      window.setTimeout(() => { didDrag.current = false; }, 0);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
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
  const dragClass = (column: DataTableColumn<Row>) => {
    if (!drag) return "";
    const dragging = drag.name === column.name ? " arcana-col-dragging" : "";
    const over = drag.over === column.name && drag.name !== column.name ? (drag.side === "before" ? " arcana-drop-before" : " arcana-drop-after") : "";
    return `${dragging}${over}`;
  };
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

  const themeClass = arcanaThemeClass(config.theme);
  const messages = resolveArcanaMessages(config);
  const gridLocale = resolveArcanaLocale(config);
  const menuColumn = sortMenu ? columns.find((column) => column.name === sortMenu.col) : undefined;
  const menuColumnOrderable = menuColumn ? orderable(menuColumn) : false;

  return (
    <div className={`spark-grid grid-wrapper ${themeClass} ${config.responsiveMode === "VERTICAL_RECORD" ? "spark-grid-responsive-vertical" : ""} ${className}`.trim()} aria-label={config.ariaLabel ?? messages.gridLabel} aria-busy={state.loading}>
      {state.error ? <div className="arcana-grid-error" role="alert">{messages.loadError}</div> : null}
      <div className="spark-grid-body" style={config.overflowEnabled ? { maxHeight: config.height ?? 560, overflow: "auto" } : undefined}>
        <div className={`grid-header ${config.stickyHeaderEnabled ? "grid-header-sticky" : ""}`} role="row">
          {expandable ? <div className={`grid-header-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })} /> : null}
          {config.checkboxEnabled ? <div className={`grid-header-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_CHECKBOX) })}><input type="checkbox" checked={state.rows.some((row) => row._isChecked)} disabled={config.isCheckboxHeaderDisabled?.(grid)} aria-label={messages.selectAll} onChange={(event) => grid.toggleAll(event.target.checked)} /></div> : null}
          {config.radioButtonSelectionEnabled ? <div className={`grid-header-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_RADIO) })} /> : null}
          {columns.map((column) => { const sort = sortOf(column); return <div key={column.name} data-col-name={column.name} tabIndex={isColumnReorderable(column, grid) ? 0 : undefined} className={`grid-header-cell ${alignmentClass(column, grid)} ${orderable(column) ? "grid-header-order" : ""} ${pinClass(column.name)}${dragClass(column)}`} style={reactStyle({ ...colStyle(column), ...pinStyle(column.name) })} role="columnheader" aria-sort={orderable(column) ? ariaSortValue(sort.direction) : undefined} onClick={(event) => onHeaderClick(event, column)} onPointerDown={(event) => startReorder(event, column)} onKeyDown={(event) => onHeaderKeyDown(event, column)}><Content value={headerValue(column)} html={column.html === true} /><span className="arcana-sort" aria-hidden="true">{sortGlyph(sort.direction)}{sort.multi && sort.direction ? <span className="arcana-sort-priority">{sort.priority}</span> : null}</span>{isColumnResizable(column, grid) ? <span className="arcana-col-resizer" role="separator" aria-hidden="true" onPointerDown={(event) => startResize(event, column)} onClick={(event) => event.stopPropagation()} /> : null}</div>; })}
          {config.actions ? <div className={`grid-header-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })}>{messages.actions}</div> : null}
        </div>
        {config.searchEnabled !== false ? <div className="grid-search-row" role="row">
          {expandable ? <div className={`grid-search-row-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })} /> : null}
          {config.checkboxEnabled ? <div className={`grid-search-row-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_CHECKBOX) })} /> : null}{config.radioButtonSelectionEnabled ? <div className={`grid-search-row-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_RADIO) })} /> : null}
          {columns.map((column) => <div key={column.name} className={`grid-search-row-cell ${pinClass(column.name)}`} style={reactStyle({ ...colStyle(column), ...pinStyle(column.name) })}>{column.searchType === "COMPONENT" ? <Content html value={column.searchTypeRenderer?.()} /> : column.searchEnabled ?? true ? <FilterField column={column} value={state.filters[column.filterName ?? column.name] ?? config.initialFilters?.[column.filterName ?? column.name]} disabled={Boolean(config.disableFilterWhenPresentOnInitialFilters && config.initialFilters?.[column.filterName ?? column.name])} messages={messages} locale={gridLocale} onChange={(value) => void grid.applyFilter(column, value)} /> : null}</div>)}
          {config.actions ? <div className={`grid-search-row-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })} /> : null}
        </div> : null}
        <div className="grid-body" role="rowgroup">
          {state.loading && !state.rows.length ? <div className="arcana-grid-status" role="status">{messages.loading}</div> : !state.rows.length ? <div className="arcana-grid-status">{messages.empty}</div> : null}
          {state.rows.map((row) => <Fragment key={row._uuid}>
            <div className={`grid-row flex ${row._hasFocus || focusedRow === row._uuid ? "grid-row-focused" : ""} ${row._isChecked || row._isRadioChecked ? "grid-row-checked" : ""}`} role="row" onClick={() => selectRow(row)} onDoubleClick={() => config.onDoubleClickRow?.(row, grid)}>
              {expandable ? <div className={`grid-cell grid-expand-cell spark-grid-selection-cell ${pinClass(PIN_SLOT_EXPANDER)}`} data-label="" style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })}><button type="button" className={`grid-expand-toggle${isExpanded(row) ? " is-open" : ""}`} aria-expanded={isExpanded(row)} aria-label={isExpanded(row) ? messages.collapseRow : messages.expandRow} onClick={(event) => { event.stopPropagation(); toggleExpand(row); }}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div> : null}
              {config.checkboxEnabled ? <div className={`grid-cell spark-grid-selection-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid), ...pinStyle(PIN_SLOT_CHECKBOX) })}><input type="checkbox" checked={Boolean(row._isChecked)} disabled={row._isCheckboxDisabled} aria-label={messages.selectRow} onClick={(event) => event.stopPropagation()} onChange={(event) => grid.toggleRow(row, event.target.checked)} /></div> : null}
              {config.radioButtonSelectionEnabled ? <div className={`grid-cell spark-grid-selection-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid), ...pinStyle(PIN_SLOT_RADIO) })}><input type="radio" name={state.uuid} checked={Boolean(row._isRadioChecked)} aria-label={messages.selectRow} onClick={(event) => event.stopPropagation()} onChange={() => grid.setSelectedRadioRow(row)} /></div> : null}
              {columns.map((column) => <div key={column.name} className={`grid-cell ${alignmentClass(column, grid)} ${focusedCell === `${row._uuid}:${column.name}` ? "grid-cell-focused" : ""} ${pinClass(column.name)}`} data-label={column.label} style={{ ...cellStyles(column, row), ...pinStyle(column.name) } as React.CSSProperties} role="cell" onClick={() => selectCell(column, row)} onDoubleClick={() => config.onDoubleClickCell?.(grid.getCellValue(column, row), column, row, grid)} onContextMenu={(event) => openMenu(event, column, row)}><Content value={grid.getCellValue(column, row)} html={column.html === true} /></div>)}
              {config.actions ? <div className={`grid-cell ${pinClass(PIN_SLOT_ACTIONS)}`} data-label={messages.actions} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })}>{config.actions.map((action, index) => action.isVisible?.(row) ?? true ? <Content key={index} html value={action.element(row)} /> : null)}</div> : null}
            </div>
            {expandable && isExpanded(row) ? <div className="grid-detail-row" role="row"><div className="grid-detail-cell" role="cell"><ExpandedRowContent row={row} grid={grid} messages={messages} /></div></div> : null}
          </Fragment>)}
        </div>
        {config.footerSummarizerEnabled ? <div className={`grid-summarizer ${config.stickyHeaderEnabled ? "grid-summarizer-sticky" : ""}`}>{expandable ? <div className={`grid-summarizer-cell grid-expand-cell ${pinClass(PIN_SLOT_EXPANDER)}`} style={reactStyle({ ...expanderStyle, ...pinStyle(PIN_SLOT_EXPANDER) })} /> : null}{config.checkboxEnabled ? <div className={`grid-summarizer-cell ${pinClass(PIN_SLOT_CHECKBOX)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_CHECKBOX) })} /> : null}{config.radioButtonSelectionEnabled ? <div className={`grid-summarizer-cell ${pinClass(PIN_SLOT_RADIO)}`} style={reactStyle({ ...selectionStyle, ...pinStyle(PIN_SLOT_RADIO) })} /> : null}{columns.map((column) => <div key={column.name} className={`grid-summarizer-cell ${alignmentClass(column, grid)} ${pinClass(column.name)}`} style={{ ...reactStyle(colStyle(column)), padding: "8px 10px", ...pinStyle(column.name) }}><Content html value={grid.getSummarizedValue(column)?.formatted} /></div>)}{config.actions ? <div className={`grid-summarizer-cell ${pinClass(PIN_SLOT_ACTIONS)}`} style={reactStyle({ ...actionStyle(grid), ...pinStyle(PIN_SLOT_ACTIONS) })} /> : null}</div> : null}
      </div>
      {config.footerVisible ?? true ? <div className="grid-footer"><div className="spark-grid-pages">
        {config.isRowsPerPageVisible ?? true ? <label className="spark-grid__per-page">{messages.perPage} <select value={state.rowsPerPage} className="spark-grid-datatable-select" onChange={(event) => void grid.paginate(1, Number(event.target.value))}>{[10,25,50,100,250,500].map((size) => <option key={size} value={size}>{size}</option>)}</select></label> : null}
        {state.totalRows ? <span className="spark-grid__info">{formatMessage(messages.showingRange, { from: beginning, to: ending, total: state.totalRows })}</span> : null}
        <div className="spark-grid__pagination-group"><span className="spark-grid-selected-rows">{grid.getCheckedRows().length ? formatMessage(messages.selectedCount, { count: grid.getCheckedRows().length }) : ""}</span>
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
      </div> : null}
    </div>
  );
}

export const ArcanaDataTable = forwardRef(ArcanaDataTableInner) as <Row extends DataTableRow = DataTableRow>(props: ArcanaDataTableProps<Row> & { ref?: React.ForwardedRef<DataTableApi<Row>> }) => React.ReactElement;
export const SparkGrid = ArcanaDataTable;
