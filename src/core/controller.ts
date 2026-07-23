import { globalConfig } from "./config";
import type {
  DataResponse,
  DataTableApi,
  DataTableColumn,
  DataTableConfig,
  DataTableMode,
  DataTableRow,
  DataTableSnapshot,
  OrderBy,
  Renderable,
  SearchType,
  SummarizedValue
} from "./types";

const empty = (value: unknown) => value == null || value === "" || (Array.isArray(value) && value.length === 0);
const id = () => globalThis.crypto?.randomUUID?.() ?? `arcana-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });

export function getValue(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object") return (value as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

export class DataTableController<Row extends DataTableRow = DataTableRow> implements DataTableApi<Row> {
  readonly config: DataTableConfig<Row>;
  readonly mode: DataTableMode;
  uuid = id();
  rows: Row[] = [];
  filters: Record<string, unknown> = {};
  orderByList: OrderBy[] = [];
  columnOrder: string[] = [];
  columnPins: Record<string, "left" | "right" | null> = {};
  loading = false;
  error: unknown = null;
  currentPage = 1;
  totalRows = 0;
  rowsPerPage: number;
  selectedRadioRow: Row | null = null;
  expandedRowUuids: string[] = [];
  revision = 0;
  datasetSize = 0;
  private dataset: Row[] = [];
  private listeners = new Set<() => void>();
  private snapshot!: DataTableSnapshot<Row>;

  /** The primary sort column (the highest priority one), for compatibility. */
  get orderBy(): OrderBy | undefined {
    return this.orderByList[0];
  }

  constructor(config: DataTableConfig<Row>) {
    this.config = config;
    this.mode = config.mode ?? (Array.isArray(config.dataset) ? "dataset" : "remote");
    this.rowsPerPage = Math.max(1, config.rowsPerPage ?? 10);
    // Seed the runtime pin state from each column's declared `pinned`.
    this.baseColumns().forEach((column) => {
      if (column.pinned) this.columnPins[column.name] = column.pinned;
    });
    this.updateSnapshot();

    if (this.mode === "dataset") {
      this.dataset = this.normalizeRows(config.dataset ?? []);
      this.recomputeDataset();
    }
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): DataTableSnapshot<Row> => this.snapshot;

  private updateSnapshot(): void {
    this.datasetSize = this.mode === "dataset" ? this.dataset.length : 0;
    this.snapshot = {
      uuid: this.uuid,
      mode: this.mode,
      datasetSize: this.datasetSize,
      rows: this.rows,
      filters: this.filters,
      orderBy: this.orderBy,
      orderByList: this.orderByList,
      columnOrder: [...this.columnOrder],
      columnPins: { ...this.columnPins },
      loading: this.loading,
      error: this.error,
      currentPage: this.currentPage,
      totalRows: this.totalRows,
      rowsPerPage: this.rowsPerPage,
      selectedRadioRow: this.selectedRadioRow,
      expandedRowUuids: this.expandedRowUuids,
      revision: this.revision
    };
  }

  private notify(): void {
    // Rows no longer present (page/dataset/filter changes) are collapsed.
    if (this.expandedRowUuids.length) {
      const alive = new Set(this.rows.map((row) => row._uuid));
      const pruned = this.expandedRowUuids.filter((uuid) => alive.has(uuid));
      if (pruned.length !== this.expandedRowUuids.length) this.expandedRowUuids = pruned;
    }
    this.revision += 1;
    this.updateSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  async fetch(): Promise<void> {
    if (this.mode === "dataset") {
      this.recomputeDataset();
      return;
    }

    this.config.onRequestStarted?.(this);
    if (this.config.showLoadingDuringRequest ?? true) {
      this.loading = true;
      this.notify();
    }
    this.error = null;

    try {
      const response = await this.fetchRemoteData();
      this.config.onRequestFinished?.(response, this);
      if (isDataResponse<Row>(response)) {
        this.rows = this.normalizeRows(response.rows);
        this.totalRows = response.total;
        this.currentPage = response.page;
      } else {
        this.rows = this.normalizeRows(Array.isArray(response) ? response as Row[] : []);
        this.totalRows = this.rows.length;
      }
    } catch (error) {
      this.error = error;
      this.config.onRequestError?.(error, this);
      throw error;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  refresh = (): Promise<void> => this.fetch();

  private async fetchRemoteData(): Promise<Row[] | DataResponse<Row> | unknown> {
    const params = this.getRequestParams();
    if (this.config.datasource) return this.config.datasource(params);

    const rawUrl = typeof this.config.url === "function" ? await this.config.url() : this.config.url ?? "";
    const url = applyBaseUrl(rawUrl);
    if (globalConfig.request) return globalConfig.request(url, params, globalConfig.baseUrl);
    if (!url) throw new Error("Remote mode requires a datasource, url or global request adapter.");

    const query = new URLSearchParams(Object.entries(params).flatMap(([key, value]) => {
      if (Array.isArray(value)) return value.map((item) => [key, String(item)]);
      return [[key, String(value ?? "")]];
    })).toString();
    const response = await fetch(`${url}${query ? `${url.includes("?") ? "&" : "?"}${query}` : ""}`);
    if (!response.ok) throw new Error(`Arcana DataTable request failed (${response.status})`);
    return response.json();
  }

  private getRequestParams(): Record<string, unknown> {
    const source = { ...(this.config.initialFilters ?? {}), ...this.filters };
    const params: Record<string, unknown> = {};
    Object.entries(source).forEach(([key, value]) => {
      const parts = key.split(".");
      params[parts[parts.length - 1] ?? key] = value;
    });
    params.page = this.currentPage;
    params.limit = this.rowsPerPage;
    // A single sort keeps the classic `order_by[field]` / `order_by[direction]`
    // pair; multiple sorts use an indexed form preserving priority order:
    // `order_by[0][field]`, `order_by[0][direction]`, `order_by[1][field]`, …
    if (this.orderByList.length === 1) {
      params["order_by[field]"] = this.orderByList[0].name;
      params["order_by[direction]"] = this.orderByList[0].direction;
    } else if (this.orderByList.length > 1) {
      this.orderByList.forEach((order, index) => {
        params[`order_by[${index}][field]`] = order.name;
        params[`order_by[${index}][direction]`] = order.direction;
      });
    }
    return params;
  }

  setRows(rows: Row[]): Row[] {
    if (this.mode === "dataset") return this.setDataset(rows);
    this.rows = this.normalizeRows(rows);
    this.totalRows = this.rows.length;
    this.notify();
    return this.rows;
  }

  setDataset(rows: Row[]): Row[] {
    if (this.mode !== "dataset") {
      throw new Error("setDataset() is only available when mode is 'dataset'.");
    }
    this.dataset = this.normalizeRows(rows);
    this.currentPage = 1;
    this.recomputeDataset();
    return this.dataset;
  }

  getDataset(): Row[] {
    return this.mode === "dataset" ? [...this.dataset] : [];
  }

  clearRows(): void {
    if (this.mode === "dataset") this.dataset = [];
    this.rows = [];
    this.totalRows = 0;
    this.currentPage = 1;
    this.notify();
  }

  removeRow(uuid: string): void {
    if (this.mode === "dataset") {
      this.dataset = this.dataset.filter((row) => row._uuid !== uuid);
      this.recomputeDataset();
      return;
    }
    this.rows = this.rows.filter((row) => row._uuid !== uuid);
    this.totalRows = Math.max(0, this.totalRows - 1);
    this.notify();
  }

  addRow(row: Row): void {
    if (this.mode === "dataset") {
      this.dataset = [...this.dataset, ...this.normalizeRows([row])];
      this.recomputeDataset();
      return;
    }
    this.rows = [...this.rows, ...this.normalizeRows([row])];
    this.totalRows += 1;
    this.notify();
  }

  updateRow(uuid: string, patch: Partial<Row>): void {
    if (this.mode === "dataset") {
      this.dataset = this.dataset.map((row) => row._uuid === uuid ? { ...row, ...patch } : row);
      this.recomputeDataset();
      return;
    }
    this.rows = this.rows.map((row) => row._uuid === uuid ? { ...row, ...patch } : row);
    this.notify();
  }

  upsert(uuid: string, row: Row): void {
    const collection = this.mode === "dataset" ? this.dataset : this.rows;
    collection.some((item) => item._uuid === uuid) ? this.updateRow(uuid, row) : this.addRow(row);
  }

  getRows(): Row[] { return this.rows; }
  getCheckedRows(): Row[] { return (this.mode === "dataset" ? this.dataset : this.rows).filter((row) => Boolean(row._isChecked)); }
  isEmpty(): boolean { return this.rows.length === 0; }
  isNotEmpty(): boolean { return this.rows.length > 0; }

  /** Visible columns in natural (config) order, before reorder/pin grouping. */
  private baseColumns(): DataTableColumn<Row>[] {
    const columns = typeof this.config.columns === "function" ? this.config.columns() : this.config.columns;
    return columns.filter((column) => column.isVisible?.() ?? true);
  }

  getColumns(): DataTableColumn<Row>[] {
    const columns = this.baseColumns();
    // 1) Apply the effective reorder: known names sort by their index; columns
    //    not present in `columnOrder` (e.g. dynamic ones) keep their relative
    //    order and stay at the end.
    const ordered = this.columnOrder.length
      ? [...columns].sort((left, right) => {
        const li = this.columnOrder.indexOf(left.name);
        const ri = this.columnOrder.indexOf(right.name);
        if (li === -1 && ri === -1) return 0;
        if (li === -1) return 1;
        if (ri === -1) return -1;
        return li - ri;
      })
      : columns;
    // 2) Group by pin (stable): left-pinned first, then unpinned, then right.
    const rank = (column: DataTableColumn<Row>): number => {
      const pin = this.getColumnPin(column.name);
      return pin === "left" ? 0 : pin === "right" ? 2 : 1;
    };
    return [...ordered].sort((left, right) => rank(left) - rank(right));
  }

  setColumnOrder(order: string[]): void {
    this.columnOrder = [...order];
    this.notify();
  }

  moveColumn(name: string, targetName: string | null, position: "before" | "after" = "before"): void {
    const current = this.getColumns().map((column) => column.name);
    const from = current.indexOf(name);
    if (from === -1) return;
    current.splice(from, 1);
    if (targetName == null || targetName === name) {
      current.push(name);
    } else {
      let index = current.indexOf(targetName);
      if (index === -1) current.push(name);
      else {
        if (position === "after") index += 1;
        current.splice(index, 0, name);
      }
    }
    this.columnOrder = current;
    this.notify();
  }

  getColumnPin(name: string): "left" | "right" | null {
    if (name in this.columnPins) return this.columnPins[name];
    return this.baseColumns().find((column) => column.name === name)?.pinned ?? null;
  }

  setColumnPinned(name: string, pinned: "left" | "right" | null): void {
    this.columnPins = { ...this.columnPins, [name]: pinned };
    this.notify();
  }

  async setFilter(name: string, value: unknown): Promise<void> {
    this.filters = { ...this.filters, [name]: empty(value) ? "" : value };
    this.currentPage = 1;
    globalConfig.eventProxy?.emit("grid-filter", { name, value, uuid: this.uuid });
    if (this.mode === "dataset") {
      this.recomputeDataset();
    } else {
      this.notify();
      await this.fetch();
    }
  }

  async setFilters(filters: Record<string, unknown>): Promise<void> {
    this.filters = { ...this.filters };
    Object.entries(filters).forEach(([name, value]) => {
      this.filters[name] = empty(value) ? "" : value;
      globalConfig.eventProxy?.emit("grid-filter", { name, value, uuid: this.uuid });
    });
    this.currentPage = 1;
    if (this.mode === "dataset") {
      this.recomputeDataset();
    } else {
      this.notify();
      await this.fetch();
    }
  }

  getFilters(): Record<string, unknown> { return { ...this.filters }; }

  async applyFilter(column: DataTableColumn<Row>, value: unknown): Promise<void> {
    await this.setFilter(column.filterName ?? column.name, value);
  }

  async applyOrderBy(orderBy: OrderBy | OrderBy[] | null): Promise<void> {
    this.orderByList = orderBy == null ? [] : Array.isArray(orderBy) ? [...orderBy] : [orderBy];
    await this.commitOrderChange();
  }

  async toggleOrderBy(name: string, options: { additive?: boolean } = {}): Promise<void> {
    const list = [...this.orderByList];
    const index = list.findIndex((order) => order.name === name);
    if (options.additive) {
      // Keep the other sorted columns; cycle this one asc → desc → removed.
      if (index === -1) list.push({ name, direction: "asc" });
      else if (list[index].direction === "asc") list[index] = { name, direction: "desc" };
      else list.splice(index, 1);
      this.orderByList = list;
    } else {
      // This column becomes the sole sort; cycle asc → desc → cleared.
      const sole = list.length === 1 && index === 0;
      if (sole && list[0].direction === "asc") this.orderByList = [{ name, direction: "desc" }];
      else if (sole && list[0].direction === "desc") this.orderByList = [];
      else this.orderByList = [{ name, direction: "asc" }];
    }
    await this.commitOrderChange();
  }

  private async commitOrderChange(): Promise<void> {
    this.currentPage = 1;
    if (this.mode === "dataset") {
      this.recomputeDataset();
    } else {
      this.notify();
      await this.fetch();
    }
  }

  async paginate(page: number, rowsPerPage: number): Promise<void> {
    this.currentPage = Math.max(1, page);
    this.rowsPerPage = Math.max(1, rowsPerPage);
    if (this.mode === "dataset") {
      this.recomputeDataset();
    } else {
      this.notify();
      await this.fetch();
    }
  }

  toggleRow(row: Row, checked = !row._isChecked): void {
    if (row._isCheckboxDisabled) return;
    row._isChecked = checked;
    checked ? this.config.onRowChecked?.(row, "checkbox") : this.config.onRowUnchecked?.(row, "checkbox");
    this.config.onCheckboxStateChanged?.(row, this);
    this.notify();
  }

  toggleAll(checked = !this.rows.some((row) => row._isChecked)): void {
    this.rows.forEach((row) => {
      if (row._isCheckboxDisabled) return;
      row._isChecked = checked;
      checked ? this.config.onRowChecked?.(row, "checkbox") : this.config.onRowUnchecked?.(row, "checkbox");
      this.config.onCheckboxStateChanged?.(row, this);
    });
    this.notify();
  }

  clearCheckedRows(): void {
    (this.mode === "dataset" ? this.dataset : this.rows).forEach((row) => { row._isChecked = false; });
    this.notify();
  }

  expandRow(uuid: string): void {
    if (this.expandedRowUuids.includes(uuid)) return;
    const row = this.rows.find((item) => item._uuid === uuid);
    if (!row) return;
    this.expandedRowUuids = [...this.expandedRowUuids, uuid];
    this.config.onRowExpanded?.(row, this);
    this.notify();
  }

  collapseRow(uuid: string): void {
    if (!this.expandedRowUuids.includes(uuid)) return;
    const row = this.rows.find((item) => item._uuid === uuid);
    this.expandedRowUuids = this.expandedRowUuids.filter((item) => item !== uuid);
    if (row) this.config.onRowCollapsed?.(row, this);
    this.notify();
  }

  getExpandedRows(): Row[] {
    return this.rows.filter((row) => row._uuid != null && this.expandedRowUuids.includes(row._uuid));
  }

  getSelectedRadioRow(): Row | null { return this.selectedRadioRow; }

  clearRadioRowSelection(): void {
    (this.mode === "dataset" ? this.dataset : this.rows).forEach((row) => {
      if (row._isRadioChecked) this.config.onRowUnchecked?.(row, "radio");
      row._isRadioChecked = false;
    });
    this.selectedRadioRow = null;
    this.notify();
  }

  setSelectedRadioRow(row: Row): void {
    (this.mode === "dataset" ? this.dataset : this.rows).forEach((item) => {
      if (item._isRadioChecked) this.config.onRowUnchecked?.(item, "radio");
      item._isRadioChecked = false;
    });
    row._isRadioChecked = true;
    this.selectedRadioRow = row;
    this.config.onRowChecked?.(row, "radio");
    this.config.onRadioStateChanged?.(row, this);
    this.notify();
  }

  getCellValue(column: DataTableColumn<Row>, row: Row): Renderable {
    let value: Renderable = getValue(row, column.name);
    if (column.valueGetter) value = column.valueGetter(value, row, this);
    if (this.config.onBeforeCellMounted) value = this.config.onBeforeCellMounted(value, column, row, this);
    return value ?? "";
  }

  getSummarizedValue(column: DataTableColumn<Row>, onlyIsChecked = true): SummarizedValue | null {
    const aggregate = column.type === "CURRENCY" || column.type === "NUMBER" || column.summarizerValueGetter ||
      (column.isCreatedDynamically && column.metadata?.value_formatter === "currency");
    if (!aggregate) return null;
    const raw = this.rows
      .filter((row) => !(onlyIsChecked && this.config.summarizeOnlyChecked) || row._isChecked)
      .map((row) => column.summarizerValueGetter?.(getValue(row, column.name), row) ?? getValue(row, column.name))
      .map(Number)
      .filter(Number.isFinite)
      .reduce((sum, value) => sum + value, 0);
    return { raw, formatted: column.summarizerValueFormatter?.(raw) ?? raw };
  }

  private normalizeRows(rows: Row[]): Row[] {
    return (Array.isArray(rows) ? rows : []).map((source) => {
      let row = { ...source, _uuid: source._uuid ?? id() } as Row;
      if (this.config.isRowChecked) row._isChecked = this.config.isRowChecked(row);
      if (this.config.isCheckboxRowDisabled) row._isCheckboxDisabled = this.config.isCheckboxRowDisabled(row);
      if (this.selectedRadioRow && this.sameRow(row, this.selectedRadioRow)) row._isRadioChecked = true;
      if (this.config.onBeforeRowMounted) row = this.config.onBeforeRowMounted(row, this);
      return row;
    });
  }

  private recomputeDataset(): void {
    const filtered = this.applyLocalFilters(this.dataset);
    const sorted = this.applyLocalSort(filtered);
    this.totalRows = sorted.length;
    const lastPage = Math.max(1, Math.ceil(this.totalRows / this.rowsPerPage));
    this.currentPage = Math.min(Math.max(1, this.currentPage), lastPage);
    const start = (this.currentPage - 1) * this.rowsPerPage;
    this.rows = sorted.slice(start, start + this.rowsPerPage);
    this.loading = false;
    this.error = null;
    this.notify();
  }

  private applyLocalFilters(rows: Row[]): Row[] {
    const filters = { ...(this.config.initialFilters ?? {}), ...this.filters };
    return rows.filter((row) => Object.entries(filters).every(([name, filter]) => {
      if (empty(filter)) return true;
      const column = this.getColumns().find((item) => (item.filterName ?? item.name) === name || item.name === name);
      const value = getValue(row, column?.name ?? name);
      return matchesFilter(value, filter, column?.searchType);
    }));
  }

  private applyLocalSort(rows: Row[]): Row[] {
    if (!this.orderByList.length) return [...rows];
    const columns = this.getColumns();
    // Resolve each sort key once (field path + direction multiplier).
    const keys = this.orderByList.map((order) => {
      const column = columns.find((item) => (item.filterName ?? item.name) === order.name || item.name === order.name);
      return { path: column?.name ?? order.name, direction: order.direction === "desc" ? -1 : 1 };
    });
    return rows
      .map((row, index) => ({ row, index }))
      .sort((left, right) => {
        for (const key of keys) {
          const result = compareValues(getValue(left.row, key.path), getValue(right.row, key.path)) * key.direction;
          if (result) return result;
        }
        return left.index - right.index; // stable
      })
      .map(({ row }) => row);
  }

  private sameRow(a: Row, b: Row): boolean {
    const key = this.config.uniqueKeyIdentifier;
    if (typeof key === "function") return key(a) === key(b);
    if (typeof key === "string") return a[key] === b[key];
    return a.id === b.id;
  }
}

function matchesFilter(value: unknown, filter: unknown, type?: SearchType): boolean {
  if (type === "DATE_RANGE" && Array.isArray(filter)) {
    const comparable = toComparable(value);
    const start = empty(filter[0]) ? null : toComparable(filter[0]);
    const end = empty(filter[1]) ? null : toComparable(filter[1]);
    return (start == null || comparable >= start) && (end == null || comparable <= end);
  }

  if (type === "DATE_MONTH") {
    return String(value ?? "").slice(0, 7) === String(filter).slice(0, 7);
  }

  if (type === "DATE") {
    return String(value ?? "").slice(0, 10) === String(filter).slice(0, 10);
  }

  if (type === "BOOLEAN") {
    return normalizeBoolean(value) === normalizeBoolean(filter);
  }

  if (Array.isArray(filter)) {
    const rowValues = Array.isArray(value) ? value : [value];
    return filter.some((expected) => rowValues.some((current) => String(current) === String(expected)));
  }

  return String(value ?? "").toLocaleLowerCase("pt-BR").includes(String(filter).toLocaleLowerCase("pt-BR"));
}

function normalizeBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || String(value).toLowerCase() === "true";
}

function toComparable(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  const date = Date.parse(String(value));
  return Number.isNaN(date) ? Number(value) : date;
}

function compareValues(left: unknown, right: unknown): number {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (left instanceof Date || right instanceof Date) return toComparable(left) - toComparable(right);
  if (typeof left === "number" && typeof right === "number") return left - right;
  return collator.compare(String(left), String(right));
}

function isDataResponse<Row extends DataTableRow>(value: unknown): value is DataResponse<Row> {
  if (!value || typeof value !== "object") return false;
  const response = value as Partial<DataResponse<Row>>;
  return Array.isArray(response.rows) && typeof response.total === "number" && typeof response.page === "number";
}

function applyBaseUrl(url: string): string {
  const base = globalConfig.baseUrl;
  if (!base || /^https?:\/\//.test(url)) return url || base || "";
  return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}

export const createDataTable = <Row extends DataTableRow = DataTableRow>(config: DataTableConfig<Row>) => new DataTableController<Row>(config);
