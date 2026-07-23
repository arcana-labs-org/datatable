import type { ArcanaMessages } from "./locale";
import type { DataTableApi, DataTableColumn, DataTableRow, OrderBy, SortDirection, StyleMap } from "./types";

/**
 * Column cell sizing. `overrideWidth` (px) takes precedence over `column.width`
 * and is how the adapters apply a live, drag-resized width — it wins even over
 * `calculateCellWidth`, so a resized column becomes fixed.
 */
export function columnStyle<Row extends DataTableRow>(column: DataTableColumn<Row>, grid: DataTableApi<Row>, overrideWidth?: number): StyleMap {
  let width: string | number | undefined = overrideWidth ?? column.width ?? grid.config.cellMinWidth;
  if (grid.config.calculateCellWidth && !column.width && overrideWidth == null) {
    const flexible = Math.max(1, grid.getColumns().filter((item) => !item.width).length);
    width = `${100 / flexible}%`;
  }
  if (typeof width === "number") width = `${width}px`;
  return width ? { width, minWidth: width, maxWidth: width, flexBasis: width } : { flex: 1 };
}

/** Whether a column shows a drag-resize handle (respects the mode and opt-outs). */
export function isColumnResizable<Row extends DataTableRow>(column: DataTableColumn<Row>, grid: DataTableApi<Row>): boolean {
  return grid.config.columnResizeEnabled !== false
    && (column.resizable ?? true)
    && grid.config.responsiveMode !== "VERTICAL_RECORD";
}

/** Smallest width (px) a column may be dragged to: `cellMinWidth` when numeric, else 60. */
export function resizeMinWidth<Row extends DataTableRow>(grid: DataTableApi<Row>): number {
  return typeof grid.config.cellMinWidth === "number" ? grid.config.cellMinWidth : 60;
}

/**
 * The sort state of a column against the effective multi-column order.
 * `direction` is `null` when unsorted; `priority` is the 1-based rank; `multi`
 * is true when 2+ columns are sorted (drives the priority number badge).
 */
export function columnSortState<Row extends DataTableRow>(orderByList: OrderBy[], column: DataTableColumn<Row>): {
  direction: SortDirection | null; priority: number; multi: boolean;
} {
  const name = column.filterName ?? column.name;
  const index = orderByList.findIndex((order) => order.name === name);
  return { direction: index === -1 ? null : orderByList[index].direction, priority: index + 1, multi: orderByList.length > 1 };
}

/** Sort glyph for the header indicator (neutral / ascending / descending). */
export function sortGlyph(direction: SortDirection | null): string {
  return direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕";
}

/** `aria-sort` value for a header cell given the column's sort direction. */
export function ariaSortValue(direction: SortDirection | null): "ascending" | "descending" | "none" {
  return direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none";
}

/* ---------- Column pinning (freeze left / right) ---------- */

/**
 * Resolves a column's pixel width for pin-offset math. Prefers the live resize
 * `overrideWidth`, then a numeric/`px` `column.width`, then a numeric
 * `cellMinWidth`, falling back to a sensible default. Flexible/percentage
 * widths can't be measured statically, so pinned columns should carry a width.
 */
export function pinnedColumnWidth<Row extends DataTableRow>(column: DataTableColumn<Row>, grid: DataTableApi<Row>, overrideWidth?: number): number {
  if (typeof overrideWidth === "number") return overrideWidth;
  if (typeof column.width === "number") return column.width;
  if (typeof column.width === "string") {
    const parsed = Number.parseFloat(column.width);
    if (column.width.trim().endsWith("px") && Number.isFinite(parsed)) return parsed;
  }
  if (typeof grid.config.cellMinWidth === "number") return grid.config.cellMinWidth;
  return 140;
}

/** Numeric width (px) of the actions column, mirroring `actionStyle`. */
export function actionsColumnWidth<Row extends DataTableRow>(grid: DataTableApi<Row>): number {
  const width = grid.config.actionsWidth;
  if (typeof width === "number") return width;
  if (typeof width === "string") {
    const parsed = Number.parseFloat(width);
    if (Number.isFinite(parsed)) return parsed;
  }
  return ((grid.config.actions?.length ?? 0) * 50) + 50;
}

/** Fixed keys of the built-in system slots, used by the pin layout. */
export const PIN_SLOT_EXPANDER = "__arcana_expander";
export const PIN_SLOT_CHECKBOX = "__arcana_checkbox";
export const PIN_SLOT_RADIO = "__arcana_radio";
export const PIN_SLOT_ACTIONS = "__arcana_actions";

/**
 * The runtime pin plan for a grid: sticky offsets for every frozen slot plus
 * helpers the adapters apply per header/body/summarizer cell. `active` is false
 * (and the helpers are no-ops) when nothing is pinned or in `VERTICAL_RECORD`
 * mode, so unpinned grids pay nothing and keep their exact previous markup.
 */
export interface PinPlan {
  active: boolean;
  /** Sticky style (`position` + `left`/`right`) for a slot key, or `{}`. */
  cellStyle(key: string): StyleMap;
  /** Pin classes (`arcana-pin arcana-pin-left …`) for a slot key, or `""`. */
  className(key: string): string;
}

const INERT_PIN_PLAN: PinPlan = { active: false, cellStyle: () => ({}), className: () => "" };

/**
 * Computes the sticky offsets for the frozen regions. System columns
 * (expander/checkbox/radio) join the left region when any left pin exists; the
 * actions column joins the right region when any right pin exists. Offsets
 * accumulate the resolved widths of the preceding/following frozen slots, so
 * resizing a pinned column shifts the ones after it.
 */
export function computePinPlan<Row extends DataTableRow>(
  grid: DataTableApi<Row>,
  columns: DataTableColumn<Row>[],
  widths: Record<string, number>
): PinPlan {
  if (grid.config.responsiveMode === "VERTICAL_RECORD" || grid.config.columnPinEnabled === false) return INERT_PIN_PLAN;
  const pinOf = (column: DataTableColumn<Row>) => grid.getColumnPin(column.name);
  const hasLeft = columns.some((column) => pinOf(column) === "left");
  const hasRight = columns.some((column) => pinOf(column) === "right");
  if (!hasLeft && !hasRight) return INERT_PIN_PLAN;

  type Slot = { key: string; width: number; pin: "left" | "right" | null };
  const slots: Slot[] = [];
  if (grid.config.expandableRowsEnabled) slots.push({ key: PIN_SLOT_EXPANDER, width: 38, pin: hasLeft ? "left" : null });
  if (grid.config.checkboxEnabled) slots.push({ key: PIN_SLOT_CHECKBOX, width: 60, pin: hasLeft ? "left" : null });
  if (grid.config.radioButtonSelectionEnabled) slots.push({ key: PIN_SLOT_RADIO, width: 60, pin: hasLeft ? "left" : null });
  for (const column of columns) slots.push({ key: column.name, width: pinnedColumnWidth(column, grid, widths[column.name]), pin: pinOf(column) });
  if (grid.config.actions) slots.push({ key: PIN_SLOT_ACTIONS, width: actionsColumnWidth(grid), pin: hasRight ? "right" : null });

  const styles: Record<string, StyleMap> = {};
  let leftOffset = 0;
  let leftEdge: string | null = null;
  for (const slot of slots) {
    if (slot.pin !== "left") continue;
    styles[slot.key] = { position: "sticky", left: `${leftOffset}px` };
    leftOffset += slot.width;
    leftEdge = slot.key;
  }
  let rightOffset = 0;
  let rightEdge: string | null = null;
  for (let index = slots.length - 1; index >= 0; index -= 1) {
    const slot = slots[index];
    if (slot.pin !== "right") continue;
    styles[slot.key] = { position: "sticky", right: `${rightOffset}px` };
    rightOffset += slot.width;
    rightEdge = slot.key;
  }

  return {
    active: true,
    cellStyle: (key) => styles[key] ?? {},
    className: (key) => {
      if (styles[key]?.left !== undefined) return `arcana-pin arcana-pin-left${key === leftEdge ? " arcana-pin-left-edge" : ""}`;
      if (styles[key]?.right !== undefined) return `arcana-pin arcana-pin-right${key === rightEdge ? " arcana-pin-right-edge" : ""}`;
      return "";
    }
  };
}

/** Whether the grid allows drag-to-reorder for a given column. */
export function isColumnReorderable<Row extends DataTableRow>(column: DataTableColumn<Row>, grid: DataTableApi<Row>): boolean {
  return grid.config.columnReorderEnabled !== false
    && (column.reorderable ?? true)
    && grid.config.responsiveMode !== "VERTICAL_RECORD";
}

/** Whether the header context menu should expose the pin actions. */
export function isColumnPinnable<Row extends DataTableRow>(grid: DataTableApi<Row>): boolean {
  return grid.config.columnPinEnabled !== false && grid.config.responsiveMode !== "VERTICAL_RECORD";
}

/**
 * Given a drop `clientX` over a header cell of known bounds, whether the dragged
 * column should land before or after it (left half → before, right half → after).
 */
export function dropSide(clientX: number, rect: { left: number; width: number }): "before" | "after" {
  return clientX < rect.left + rect.width / 2 ? "before" : "after";
}

export const selectionStyle: StyleMap = {
  width: "60px", minWidth: "60px", maxWidth: "60px", flexBasis: "60px", justifyContent: "center", padding: "10px", textAlign: "center"
};

export const expanderStyle: StyleMap = {
  width: "38px", minWidth: "38px", maxWidth: "38px", flexBasis: "38px", justifyContent: "center", padding: "4px", textAlign: "center"
};

/**
 * Built-in loading state for async `expandedRowRenderer`. Kept as an HTML
 * string so both adapters render the exact same markup (strings are rendered
 * as HTML, like in cells).
 */
export const expandedRowLoadingHtml =
  '<span class="grid-detail-loading"><span class="grid-detail-spinner" aria-hidden="true"></span>Carregando detalhes…</span>';

/** Discreet, themable error copy shown when the async renderer rejects. */
export const expandedRowErrorMessage = "Não foi possível carregar os detalhes.";

/** Localized variant of `expandedRowLoadingHtml`, built from the resolved messages. */
export function expandedRowLoadingContent(messages: ArcanaMessages): string {
  return `<span class="grid-detail-loading"><span class="grid-detail-spinner" aria-hidden="true"></span>${messages.expandedLoading}</span>`;
}

export function actionStyle<Row extends DataTableRow>(grid: DataTableApi<Row>): StyleMap {
  const width = grid.config.actionsWidth ?? `${((grid.config.actions?.length ?? 0) * 50) + 50}px`;
  return { width, minWidth: width, maxWidth: width, flexBasis: width, justifyContent: "center", padding: "10px", textAlign: "center" };
}

export const alignmentClass = <Row extends DataTableRow>(column: DataTableColumn<Row>, grid: DataTableApi<Row>) =>
  `grid-cell-${column.textAlignment ?? grid.config.textAlignment ?? "left"}-alignment`;

const UNITLESS_PROPERTIES = new Set(["flex", "flexGrow", "flexShrink", "opacity", "zIndex", "fontWeight", "lineHeight", "order"]);

/**
 * Serializes one or more `StyleMap`s into an inline `style` string. Numbers
 * receive `px` (except unitless properties), mirroring what React does with
 * `CSSProperties`, so the Svelte and Angular adapters style cells identically.
 */
export function inlineStyle(...styles: Array<StyleMap | undefined>): string {
  const merged: StyleMap = Object.assign({}, ...styles);
  return Object.entries(merged)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([property, value]) => {
      const kebab = property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      const suffix = typeof value === "number" && !UNITLESS_PROPERTIES.has(property) ? "px" : "";
      return `${kebab}: ${value}${suffix}`;
    })
    .join("; ");
}

export function pagination(current: number, total: number, perPage: number): number[] {
  const last = Math.ceil(total / perPage);
  if (last <= 0) return [];
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

