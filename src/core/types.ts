import type { ArcanaLocale, ArcanaMessages } from "./locale";

export type SortDirection = "asc" | "desc";

export interface OrderBy {
  name: string;
  direction: SortDirection;
}

export interface Pagination {
  page: number;
  rowsPerPage: number;
}

export type SearchType = "DATE" | "DATE_MONTH" | "REMOTE" | "LIST" | "DATE_RANGE" | "BOOLEAN" | "COMPONENT";
export type ArcanaThemePreset = "zinc" | "ocean" | "forest" | "midnight";
/**
 * Theme name applied as the `arcana-theme-{name}` CSS class.
 * Besides the presets, any custom name is accepted — define a CSS class
 * overriding the `--arcana-*` tokens and pass its name here.
 */
export type ArcanaTheme = ArcanaThemePreset | (string & {});
export type ColumnType = "TEXT" | "NUMBER" | "PERCENTAGE" | "CURRENCY";
export type DataTableResponsiveMode = "HORIZONTAL_OVERFLOW" | "VERTICAL_RECORD";
export type DataTableMode = "remote" | "dataset";
export type Renderable = unknown;

export interface SearchOption {
  value: unknown;
  label: string;
}

export interface ContextMenuItem {
  label: string;
  items?: ContextMenuItem[];
  onClick?: () => void;
  icon?: Renderable;
}

export interface DataTableRow {
  _uuid?: string;
  _hasFocus?: boolean;
  _isChecked?: boolean;
  _isCheckboxDisabled?: boolean;
  _isRadioChecked?: boolean;
  [key: string]: unknown;
}

export interface DataTableColumn<Row extends DataTableRow = DataTableRow> {
  _uuid?: string;
  _hasFocus?: boolean;
  name: string;
  label: string;
  type?: ColumnType;
  width?: number | string;
  /**
   * When `true`, the column's string content — the raw cell value OR a string
   * returned by `valueGetter`/`headerContentGetter` — is interpreted as HTML.
   * Otherwise (the default) string content is rendered as safe, escaped text,
   * so untrusted data can never inject markup. Framework nodes returned by
   * `valueGetter` (React elements, Vue vnodes, DOM nodes, Svelte snippets…)
   * are always rendered natively regardless of this flag and remain the
   * recommended way to render rich content.
   */
  html?: boolean;
  /**
   * When the grid allows column resizing (`config.columnResizeEnabled`, default
   * true), this column exposes a drag handle on the right edge of its header
   * cell. Set to `false` to pin this column's width. Defaults to `true`.
   */
  resizable?: boolean;
  /**
   * Column reorder opt-out. When the grid allows reordering
   * (`config.columnReorderEnabled`, default true), this column's header can be
   * dragged to move it. Set to `false` to keep the column fixed in place.
   * Defaults to `true`.
   */
  reorderable?: boolean;
  /**
   * Freezes the column to one edge so it stays visible during horizontal
   * scrolling: left-pinned columns stick to the start, right-pinned ones to the
   * end (accumulating widths). The header context menu changes this at runtime.
   * Ignored in `VERTICAL_RECORD` mode. Defaults to `undefined` (not pinned).
   */
  pinned?: "left" | "right";
  textAlignment?: "center" | "left" | "right";
  filterName?: string;
  searchType?: SearchType;
  searchConfig?: () => SearchOption[] | Promise<SearchOption[]>;
  searchTypeRenderer?: () => Renderable;
  headerContentGetter?: (value: unknown, grid: DataTableApi<Row>) => Renderable;
  valueGetter?: (value: unknown, row: Row, grid: DataTableApi<Row>) => Renderable;
  onBeforeColumnStyleMounted?: (value: Renderable, row: Row, grid: DataTableApi<Row>) => StyleMap;
  orderByEnabled?: boolean;
  searchEnabled?: boolean;
  isCreatedDynamically?: boolean;
  isVisible?: () => boolean;
  summarizerValueGetter?: (value: unknown, row: Row) => number;
  summarizerValueFormatter?: (value: number) => Renderable;
  metadata?: Record<string, unknown>;
}

export interface DataTableAction<Row extends DataTableRow = DataTableRow> {
  element: (row: Row) => Renderable;
  isVisible?: (row: Row) => boolean;
}

export interface DataResponse<Row extends DataTableRow = DataTableRow> {
  rows: Row[];
  total: number;
  page: number;
}

export interface StyleMap {
  [property: string]: string | number | undefined;
}

export interface DataTableConfig<Row extends DataTableRow = DataTableRow> {
  /**
   * `remote` delegates operations to datasource/url. `dataset` performs every
   * operation locally over the complete dataset. Inferred as `dataset` when
   * the dataset property is provided; otherwise defaults to `remote`.
   */
  mode?: DataTableMode;
  /**
   * Visual theme applied to the grid root and to the portaled panels
   * (select, calendar, context/sort menus). Falls back to the global
   * default set via `setDefaultArcanaTheme` (initially `zinc`).
   */
  theme?: ArcanaTheme;
  /**
   * Locale of the grid's built-in strings (pagination, filters, sort menu,
   * calendar, …). Falls back to the global default set via
   * `setDefaultArcanaLocale` (initially `pt-BR`).
   */
  locale?: ArcanaLocale;
  /**
   * Per-key overrides of the built-in strings — applied on top of the
   * resolved locale pack, so any single message can be customized (with or
   * without a `locale`). See `ArcanaMessages` for the full catalog.
   */
  messages?: Partial<ArcanaMessages>;
  /** Complete local collection used only by dataset mode. */
  dataset?: Row[];
  url?: string | (() => string | Promise<string>);
  datasource?: (params: Record<string, unknown>) => Row[] | DataResponse<Row> | Promise<Row[] | DataResponse<Row>>;
  height?: number;
  rowsPerPage?: number;
  cellMinWidth?: number | string;
  calculateCellWidth?: boolean;
  stickyHeaderEnabled?: boolean;
  /**
   * Enables drag-to-resize on the header cells (a thin handle on each column's
   * right edge). Individual columns opt out with `column.resizable: false`.
   * Ignored in `VERTICAL_RECORD` mode (there is no shared column width there).
   * Defaults to `true`.
   */
  columnResizeEnabled?: boolean;
  /**
   * Enables drag-to-reorder of columns by dragging the body of a header cell
   * (a short click still sorts; the right-edge resize handle keeps priority).
   * Individual columns opt out with `column.reorderable: false`. Ignored in
   * `VERTICAL_RECORD` mode. Defaults to `true`.
   */
  columnReorderEnabled?: boolean;
  /**
   * Enables the header context-menu pin actions (freeze left / freeze right /
   * unfreeze) and honors each `column.pinned`. Pinned columns stay visible
   * during horizontal scroll. Ignored in `VERTICAL_RECORD` mode. Defaults to
   * `true`.
   */
  columnPinEnabled?: boolean;
  textAlignment?: "center" | "left" | "right";
  columns: DataTableColumn<Row>[] | (() => DataTableColumn<Row>[]);
  actions?: DataTableAction<Row>[];
  actionsWidth?: number | string;
  footerVisible?: boolean;
  footerSummarizerEnabled?: boolean;
  summarizeOnlyChecked?: boolean;
  /** @deprecated The grid layout is always flex-based. Kept for source compatibility. */
  useFlexbox?: boolean;
  rowFocusEnabled?: boolean;
  cellFocusEnabled?: boolean;
  orderByEnabled?: boolean;
  checkboxEnabled?: boolean;
  isRowsPerPageVisible?: boolean;
  radioButtonSelectionEnabled?: boolean;
  searchEnabled?: boolean;
  overflowEnabled?: boolean;
  responsiveMode?: DataTableResponsiveMode;
  showLoadingDuringRequest?: boolean;
  sendRequestOnMounted?: boolean;
  ariaLabel?: string;
  initialFilters?: Record<string, unknown>;
  disableFilterWhenPresentOnInitialFilters?: boolean;
  isRowChecked?: (row: Row) => boolean;
  isCheckboxRowDisabled?: (row: Row) => boolean;
  isCheckboxHeaderDisabled?: (grid: DataTableApi<Row>) => boolean;
  onRowChecked?: (row: Row, type: "checkbox" | "radio") => void;
  onRowUnchecked?: (row: Row, type: "checkbox" | "radio") => void;
  onRequestStarted?: (grid: DataTableApi<Row>) => void;
  onRequestFinished?: (response: unknown, grid: DataTableApi<Row>) => void;
  onRequestError?: (error: unknown, grid: DataTableApi<Row>) => void;
  onBeforeRowMounted?: (row: Row, grid: DataTableApi<Row>) => Row;
  onBeforeCellMounted?: (value: Renderable, column: DataTableColumn<Row>, row: Row, grid: DataTableApi<Row>) => Renderable;
  onBeforeHeaderCellMounted?: (column: DataTableColumn<Row>, grid: DataTableApi<Row>) => Renderable;
  onBeforeCellStyleMounted?: (value: Renderable, column: DataTableColumn<Row>, row: Row, grid: DataTableApi<Row>) => StyleMap;
  onBeforeCheckboxAndRadioButtonStyleMounted?: (row: Row, grid: DataTableApi<Row>) => StyleMap;
  /** Adds the chevron column and enables the per-row expanded detail area. */
  expandableRowsEnabled?: boolean;
  /**
   * Renders the expanded detail area. May return the content directly (sync)
   * or a Promise (async) — while the Promise resolves, the loading state is
   * shown. Re-invoked every time the row is expanded again.
   */
  expandedRowRenderer?: (row: Row, grid: DataTableApi<Row>) => Renderable | Promise<Renderable>;
  /** Replaces the built-in loading state shown while the async renderer resolves. */
  expandedRowLoadingRenderer?: (row: Row, grid: DataTableApi<Row>) => Renderable;
  /** When true, clicking anywhere on the row also toggles expansion (onClickRow still fires). */
  expandRowOnClick?: boolean;
  onRowExpanded?: (row: Row, grid: DataTableApi<Row>) => void;
  onRowCollapsed?: (row: Row, grid: DataTableApi<Row>) => void;
  onClickRow?: (row: Row, grid: DataTableApi<Row>) => void;
  onDoubleClickRow?: (row: Row, grid: DataTableApi<Row>) => void;
  onCheckboxStateChanged?: (row: Row, grid: DataTableApi<Row>) => void;
  onRadioStateChanged?: (row: Row, grid: DataTableApi<Row>) => void;
  onClickCell?: (value: unknown, column: DataTableColumn<Row>, row: Row, grid: DataTableApi<Row>) => unknown;
  onDoubleClickCell?: (value: unknown, column: DataTableColumn<Row>, row: Row, grid: DataTableApi<Row>) => unknown;
  onContextMenu?: (value: unknown, column: DataTableColumn<Row>, row: Row, grid: DataTableApi<Row>) => ContextMenuItem[];
  uniqueKeyIdentifier?: string | ((row: Row) => string);
}

export interface DataTableSnapshot<Row extends DataTableRow = DataTableRow> {
  uuid: string;
  mode: DataTableMode;
  datasetSize: number;
  rows: Row[];
  filters: Record<string, unknown>;
  /**
   * The primary (highest-priority) sort column, or `undefined` when nothing is
   * sorted. Kept for backward compatibility — it is always `orderByList[0]`.
   * Read `orderByList` for the full multi-column order.
   */
  orderBy?: OrderBy;
  /**
   * The complete multi-column sort, in priority order (index 0 sorts first).
   * Empty when nothing is sorted.
   */
  orderByList: OrderBy[];
  /**
   * Effective column order by `name`, reflecting drag-reorder and
   * `setColumnOrder`/`moveColumn`. Empty means the natural config order.
   */
  columnOrder: string[];
  /**
   * Runtime pin overrides per column `name` (`left` / `right` / `null` to
   * unpin). A column absent here falls back to its `column.pinned`.
   */
  columnPins: Record<string, "left" | "right" | null>;
  loading: boolean;
  error: unknown;
  currentPage: number;
  totalRows: number;
  rowsPerPage: number;
  selectedRadioRow: Row | null;
  expandedRowUuids: string[];
  revision: number;
}

export interface SummarizedValue {
  raw: number;
  formatted: Renderable;
}

export interface DataTableApi<Row extends DataTableRow = DataTableRow> extends DataTableSnapshot<Row> {
  readonly config: DataTableConfig<Row>;
  readonly mode: DataTableMode;
  subscribe(listener: () => void): () => void;
  getSnapshot(): DataTableSnapshot<Row>;
  fetch(): Promise<void>;
  refresh(): Promise<void>;
  setRows(rows: Row[]): Row[];
  setDataset(rows: Row[]): Row[];
  getDataset(): Row[];
  clearRows(): void;
  removeRow(uuid: string): void;
  addRow(row: Row): void;
  upsert(uuid: string, row: Row): void;
  updateRow(uuid: string, row: Partial<Row>): void;
  getRows(): Row[];
  getCheckedRows(): Row[];
  clearCheckedRows(): void;
  isEmpty(): boolean;
  isNotEmpty(): boolean;
  getColumns(): DataTableColumn<Row>[];
  /** Replaces the whole effective column order (a list of column `name`s). */
  setColumnOrder(order: string[]): void;
  /**
   * Moves a column next to another one. `position` decides whether it lands
   * before (default) or after `targetName`; a `null` target sends it to the end.
   */
  moveColumn(name: string, targetName: string | null, position?: "before" | "after"): void;
  /** The current pin of a column (its runtime override, else `column.pinned`). */
  getColumnPin(name: string): "left" | "right" | null;
  /** Pins a column to an edge, or unpins it with `null`. */
  setColumnPinned(name: string, pinned: "left" | "right" | null): void;
  getFilters(): Record<string, unknown>;
  applyFilter(column: DataTableColumn<Row>, value: unknown): Promise<void>;
  /**
   * Replaces the whole sort. A single `OrderBy` (or `null`) keeps the classic
   * single-column behavior; an `OrderBy[]` applies a full multi-column order
   * (index 0 sorts first).
   */
  applyOrderBy(orderBy: OrderBy | OrderBy[] | null): Promise<void>;
  /**
   * Cycles one column's sort on a header click. `additive` (Shift-click) keeps
   * the other sorted columns and cycles this one asc → desc → removed; without
   * it, the column becomes the sole sort (cycling asc → desc → cleared).
   */
  toggleOrderBy(name: string, options?: { additive?: boolean }): Promise<void>;
  setFilter(name: string, value: unknown): Promise<void>;
  setFilters(filters: Record<string, unknown>): Promise<void>;
  paginate(page: number, rowsPerPage: number): Promise<void>;
  getSummarizedValue(column: DataTableColumn<Row>, onlyIsChecked?: boolean): SummarizedValue | null;
  getSelectedRadioRow(): Row | null;
  clearRadioRowSelection(): void;
  setSelectedRadioRow(row: Row): void;
  toggleRow(row: Row, checked?: boolean): void;
  toggleAll(checked?: boolean): void;
  expandRow(uuid: string): void;
  collapseRow(uuid: string): void;
  getExpandedRows(): Row[];
  getCellValue(column: DataTableColumn<Row>, row: Row): Renderable;
}

export interface ArcanaDataTableOptions {
  baseUrl?: string;
  request?: RequestAdapter;
  eventProxy?: EventProxy;
}

export type RequestAdapter = (url: string, params: Record<string, unknown>, baseUrl?: string) => Promise<unknown>;
export interface EventProxy {
  emit: (name: string, data: unknown) => void;
  on?: (name: string, callback: (...args: unknown[]) => void) => void;
  off?: (name: string, callback: (...args: unknown[]) => void) => void;
}

// Backwards-compatible names from arcana-grid-vue.
export type Row = DataTableRow;
export type Column = DataTableColumn;
export type Action = DataTableAction;
export type SparkGridConfig = DataTableConfig;
export type ArcanaDataTableConfig = DataTableConfig;
export type GridComponent = DataTableApi;
export type DataTableComponent = DataTableApi;
export type GridSearchTypeDefinition = SearchType;
export type GridColumnTypeDefinition = ColumnType;
export type SearchConfigListValue = SearchOption;
export type CellContent = Renderable;
export type InstallOptions = ArcanaDataTableOptions;
export type ContextMenItem = ContextMenuItem;
export type ComputedColumn = () => Column[];
export type UniqueKeyIdentifier = (row: Row) => string;
export type UrlResolver = () => string | Promise<string>;
export type OnRequestFinished = (response: unknown, grid: GridComponent) => void;
export type OnRequestStarted = (grid: GridComponent) => void;
export type IsRowChecked = (row: Row) => boolean;
export type IsCheckboxDisabled = (row: Row) => boolean;
export type IsCheckboxHeaderDisabled = (grid: GridComponent) => boolean;
export type OnRowEvent = (row: Row, grid: GridComponent) => void;
export type OnCellEvent = (value: unknown, column: Column, row: Row, grid: GridComponent) => unknown;
export type OnContextMenu = (value: unknown, column: Column, row: Row, grid: GridComponent) => ContextMenuItem[];
export type OnBeforeRowMounted = (row: Row, grid: GridComponent) => Row;
export type OnValueGetter = (value: unknown, row: Row, grid: GridComponent) => CellContent;
export type OnHeaderContentGetter = (value: unknown, grid: GridComponent) => CellContent;
export type OnBeforeCellMounted = (value: CellContent, column: Column, row: Row, grid: GridComponent) => CellContent;
export type OnBeforeHeaderCellMounted = (column: Column, grid: GridComponent) => CellContent;
export type OnBeforeCellStyleMounted = (value: CellContent, column: Column, row: Row, grid: GridComponent) => StyleMap;
export type OnBeforeCheckboxAndRadioButtonStyleMounted = (row: Row, grid: GridComponent) => StyleMap;
export type OnBeforeColumnStyleMounted = (value: CellContent, row: Row, grid: GridComponent) => StyleMap;
export type OnVisibleCheck = () => boolean;
export type OnVisibleActionCheck = (row: Row) => boolean;
export type State = DataTableSnapshot;
export type Methods = Pick<DataTableApi,
  "refresh" | "fetch" | "setRows" | "setDataset" | "getDataset" | "clearRows" | "removeRow" | "addRow" | "upsert" | "updateRow" |
  "getRows" | "getCheckedRows" | "isEmpty" | "isNotEmpty" | "getColumns" | "setColumnOrder" | "moveColumn" | "getColumnPin" | "setColumnPinned" | "applyFilter" | "applyOrderBy" | "toggleOrderBy" |
  "setFilter" | "setFilters" | "paginate" | "getSummarizedValue" | "getSelectedRadioRow" |
  "clearRadioRowSelection" | "clearCheckedRows" | "setSelectedRadioRow" |
  "expandRow" | "collapseRow" | "getExpandedRows">;
export type Props = { config: SparkGridConfig };
