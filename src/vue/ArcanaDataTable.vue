<script setup lang="ts">
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { createDataTable } from "../core/controller";
import { formatMessage, resolveArcanaLocale, resolveArcanaMessages } from "../core/locale";
import { arcanaThemeClass } from "../core/theme";
import { startColumnDrag } from "../core/drag";
import { actionStyle, alignmentClass, ariaSortValue, columnSortState, columnStyle, computePinPlan, expandedRowLoadingContent, expanderStyle, isColumnPinnable, isColumnReorderable, isColumnResizable, pagination, PIN_SLOT_ACTIONS, PIN_SLOT_CHECKBOX, PIN_SLOT_EXPANDER, PIN_SLOT_RADIO, resizeMinWidth, selectionStyle, sortGlyph } from "../core/view";
import type { DataTableApi, DataTableColumn, DataTableConfig, DataTableRow, Renderable, StyleMap } from "../core/types";
import FilterField from "./FilterField.vue";
import "../assets/ArcanaGrid.css";

const props = defineProps<{ config: DataTableConfig<DataTableRow> }>();
const emit = defineEmits<{ mounted: [grid: DataTableApi<DataTableRow>] }>();
const grid = shallowRef(createDataTable(props.config));
const revision = shallowRef(0);
const menu = ref<{ x: number; y: number; items: import("../core/types").ContextMenuItem[] } | null>(null);
const sortMenu = ref<{ x: number; y: number; name: string; col: string } | null>(null);
const focusedRow = ref<string | null>(null);
const focusedCell = ref<string | null>(null);
const columnWidths = ref<Record<string, number>>({});
const drag = ref<string | null>(null);
let didDrag = false;
let unsubscribe = grid.value.subscribe(() => { revision.value += 1; });

watch(() => props.config, (config) => {
  unsubscribe();
  grid.value = createDataTable(config);
  unsubscribe = grid.value.subscribe(() => { revision.value += 1; });
  if (config.sendRequestOnMounted !== false) void grid.value.refresh();
});

const closeMenus = () => { menu.value = null; sortMenu.value = null; };
const onWindowKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeMenus(); };
onMounted(() => {
  emit("mounted", grid.value);
  if (props.config.sendRequestOnMounted !== false) void grid.value.refresh();
  window.addEventListener("click", closeMenus);
  window.addEventListener("blur", closeMenus);
  window.addEventListener("keydown", onWindowKey);
});
onBeforeUnmount(() => {
  unsubscribe();
  window.removeEventListener("click", closeMenus);
  window.removeEventListener("blur", closeMenus);
  window.removeEventListener("keydown", onWindowKey);
});

defineExpose({
  get api() { return grid.value; },
  refresh: () => grid.value.refresh(), fetch: () => grid.value.fetch(), setRows: (rows: DataTableRow[]) => grid.value.setRows(rows),
  setDataset: (rows: DataTableRow[]) => grid.value.setDataset(rows), getDataset: () => grid.value.getDataset(),
  clearRows: () => grid.value.clearRows(), addRow: (row: DataTableRow) => grid.value.addRow(row),
  removeRow: (uuid: string) => grid.value.removeRow(uuid), updateRow: (uuid: string, row: Partial<DataTableRow>) => grid.value.updateRow(uuid, row),
  upsert: (uuid: string, row: DataTableRow) => grid.value.upsert(uuid, row), getRows: () => grid.value.getRows(),
  getCheckedRows: () => grid.value.getCheckedRows(), clearCheckedRows: () => grid.value.clearCheckedRows(),
  setFilter: (name: string, value: unknown) => grid.value.setFilter(name, value), setFilters: (filters: Record<string, unknown>) => grid.value.setFilters(filters),
  expandRow: (uuid: string) => grid.value.expandRow(uuid), collapseRow: (uuid: string) => grid.value.collapseRow(uuid),
  getExpandedRows: () => grid.value.getExpandedRows()
});

const themeClass = computed(() => arcanaThemeClass(props.config.theme));
const msg = computed(() => resolveArcanaMessages(props.config));
const gridLocale = computed(() => resolveArcanaLocale(props.config));
const state = computed(() => { revision.value; return grid.value.getSnapshot(); });
const columns = computed(() => { revision.value; return grid.value.getColumns(); });
const pages = computed(() => pagination(state.value.currentPage, state.value.totalRows, state.value.rowsPerPage));
const lastPage = computed(() => Math.ceil(state.value.totalRows / state.value.rowsPerPage));
const beginning = computed(() => state.value.totalRows ? ((state.value.currentPage - 1) * state.value.rowsPerPage) + 1 : 0);
const ending = computed(() => Math.min(state.value.currentPage * state.value.rowsPerPage, state.value.totalRows));
const searchable = (column: DataTableColumn<DataTableRow>) => props.config.searchEnabled !== false && (column.searchEnabled ?? true);
const disabledFilter = (column: DataTableColumn<DataTableRow>) => Boolean(props.config.disableFilterWhenPresentOnInitialFilters && props.config.initialFilters?.[column.filterName ?? column.name]);
const orderable = (column: DataTableColumn<DataTableRow>) => props.config.orderByEnabled !== false && column.orderByEnabled !== false;
const colStyle = (column: DataTableColumn<DataTableRow>) => columnStyle(column, grid.value, columnWidths.value[column.name]);
const pinnable = computed(() => { revision.value; return isColumnPinnable(grid.value); });
const pinPlan = computed(() => { revision.value; return computePinPlan(grid.value, columns.value, columnWidths.value); });
const pinStyle = (key: string): StyleMap => pinPlan.value.cellStyle(key);
const pinClass = (key: string) => pinPlan.value.className(key);
const getColumnPin = (name: string) => { revision.value; return grid.value.getColumnPin(name); };
const menuColumnOrderable = computed(() => {
  const column = sortMenu.value ? columns.value.find((item) => item.name === sortMenu.value!.col) : undefined;
  return column ? orderable(column) : false;
});
const dragClass = (column: DataTableColumn<DataTableRow>) => drag.value === column.name ? " arcana-col-dragging" : "";
const onHeaderClick = (event: MouseEvent, column: DataTableColumn<DataTableRow>) => {
  if (didDrag) return;
  const isOrderable = orderable(column);
  if (!isOrderable && !pinnable.value) return;
  const name = column.filterName ?? column.name;
  event.stopPropagation();
  if (event.shiftKey) { if (isOrderable) { sortMenu.value = null; void grid.value.toggleOrderBy(name, { additive: true }); } return; }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  sortMenu.value = sortMenu.value?.col === column.name ? null : { x: rect.left, y: rect.bottom + 2, name, col: column.name };
};
const applySortOption = (direction: "asc" | "desc" | null) => {
  if (!sortMenu.value) return;
  void grid.value.applyOrderBy(direction ? { name: sortMenu.value.name, direction } : null);
  sortMenu.value = null;
};
const applyPin = (pin: "left" | "right" | null) => {
  if (!sortMenu.value) return;
  grid.value.setColumnPinned(sortMenu.value.col, pin);
  sortMenu.value = null;
};
const startReorder = (event: PointerEvent, column: DataTableColumn<DataTableRow>) => {
  if (!isColumnReorderable(column, grid.value) || event.button !== 0) return;
  startColumnDrag(event, column, grid.value, event.currentTarget as HTMLElement, {
    ghostClassName: themeClass.value,
    setDraggingColumn: (name) => { drag.value = name; },
    markDidDrag: () => { didDrag = true; window.setTimeout(() => { didDrag = false; }, 0); }
  });
};
const onHeaderKeyDown = (event: KeyboardEvent, column: DataTableColumn<DataTableRow>) => {
  if (!isColumnReorderable(column, grid.value) || !(event.ctrlKey || event.metaKey)) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  const names = grid.value.getColumns().map((item) => item.name);
  const index = names.indexOf(column.name);
  const target = event.key === "ArrowLeft" ? index - 1 : index + 1;
  if (target < 0 || target >= names.length) return;
  grid.value.moveColumn(column.name, names[target], event.key === "ArrowLeft" ? "before" : "after");
};
const sortOf = (column: DataTableColumn<DataTableRow>) => columnSortState(state.value.orderByList, column);
const menuDirection = (name: string) => state.value.orderByList.find((order) => order.name === name)?.direction ?? null;
const startResize = (event: PointerEvent, column: DataTableColumn<DataTableRow>) => {
  event.preventDefault();
  event.stopPropagation();
  const header = (event.currentTarget as HTMLElement).parentElement;
  const startX = event.clientX;
  const startWidth = columnWidths.value[column.name] ?? header?.getBoundingClientRect().width ?? resizeMinWidth(grid.value);
  const min = resizeMinWidth(grid.value);
  const onMove = (move: PointerEvent) => {
    const next = Math.max(min, Math.round(startWidth + (move.clientX - startX)));
    columnWidths.value = { ...columnWidths.value, [column.name]: next };
  };
  const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
};
const sortGlyphFor = sortGlyph;
const ariaSortFor = ariaSortValue;
const isResizable = (column: DataTableColumn<DataTableRow>) => isColumnResizable(column, grid.value);
const isReorderable = (column: DataTableColumn<DataTableRow>) => isColumnReorderable(column, grid.value);
const headerValue = (column: DataTableColumn<DataTableRow>) => column.headerContentGetter?.(props.config.onBeforeHeaderCellMounted?.(column, grid.value), grid.value) ?? props.config.onBeforeHeaderCellMounted?.(column, grid.value) ?? column.label;
const cellStyle = (column: DataTableColumn<DataTableRow>, row: DataTableRow) => ({ ...columnStyle(column, grid.value), padding: "8px 10px", ...props.config.onBeforeCellStyleMounted?.(grid.value.getCellValue(column, row), column, row, grid.value), ...column.onBeforeColumnStyleMounted?.(grid.value.getCellValue(column, row), row, grid.value) });
const selectRadio = (row: DataTableRow) => grid.value.setSelectedRadioRow(row);
const expandable = computed(() => Boolean(props.config.expandableRowsEnabled));
const isExpanded = (row: DataTableRow) => Boolean(row._uuid && state.value.expandedRowUuids.includes(row._uuid));
const toggleExpand = (row: DataTableRow) => {
  if (!row._uuid) return;
  isExpanded(row) ? grid.value.collapseRow(row._uuid) : grid.value.expandRow(row._uuid);
};
const onExpandToggle = (event: MouseEvent, row: DataTableRow) => {
  event.stopPropagation();
  toggleExpand(row);
};
const onRow = (row: DataTableRow) => {
  if (props.config.rowFocusEnabled) focusedRow.value = row._uuid ?? null;
  if (expandable.value && props.config.expandRowOnClick) toggleExpand(row);
  props.config.onClickRow?.(row, grid.value);
};
const onCell = (column: DataTableColumn<DataTableRow>, row: DataTableRow) => {
  if (props.config.cellFocusEnabled ?? true) focusedCell.value = `${row._uuid}:${column.name}`;
  props.config.onClickCell?.(grid.value.getCellValue(column, row), column, row, grid.value);
};
const selectionCellStyle = (row: DataTableRow) => ({ ...selectionStyle, ...props.config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, grid.value) });
const context = (event: MouseEvent, column: DataTableColumn<DataTableRow>, row: DataTableRow) => {
  const items = props.config.onContextMenu?.(grid.value.getCellValue(column, row), column, row, grid.value);
  if (items?.length) { event.preventDefault(); menu.value = { x: event.clientX, y: event.clientY, items }; }
};
// Renders a `Renderable`. String content is escaped text by default and is
// only interpreted as HTML when `html` is true (opt-in per column via
// `column.html`); vnodes and other node returns render natively.
const RuntimeContent = defineComponent({ props: { value: null, html: { type: Boolean, default: false } }, setup(runtimeProps) { return () => {
  const value = typeof runtimeProps.value === "function" ? (runtimeProps.value as () => unknown)() : runtimeProps.value;
  if (value == null) return null;
  if (typeof value === "string") return runtimeProps.html ? h("span", { innerHTML: value }) : h("span", value);
  if (typeof value === "number" || typeof value === "boolean") return h("span", String(value));
  return value as never;
}; }});
const ExpandedRowContent = defineComponent({ props: { row: null }, setup(detailProps) {
  const detail = ref<{ status: "loading" | "ready" | "error"; content?: Renderable }>({ status: "loading" });
  let active = true;
  let generation = 0;
  const resolve = (row: DataTableRow) => {
    const current = ++generation;
    detail.value = { status: "loading" };
    try {
      const result = props.config.expandedRowRenderer?.(row, grid.value);
      if (result && typeof (result as Promise<Renderable>).then === "function") {
        (result as Promise<Renderable>).then(
          (content) => { if (active && current === generation) detail.value = { status: "ready", content }; },
          (error) => { console.error(error); if (active && current === generation) detail.value = { status: "error" }; }
        );
      } else {
        detail.value = { status: "ready", content: result };
      }
    } catch (error) {
      console.error(error);
      detail.value = { status: "error" };
    }
  };
  resolve(detailProps.row as DataTableRow);
  watch(() => detailProps.row, (row) => resolve(row as DataTableRow));
  onBeforeUnmount(() => { active = false; });
  return () => {
    if (detail.value.status === "loading") return h(RuntimeContent, { value: props.config.expandedRowLoadingRenderer?.(detailProps.row as DataTableRow, grid.value) ?? expandedRowLoadingContent(msg.value), html: true });
    if (detail.value.status === "error") return h("div", { class: "grid-detail-error" }, msg.value.expandedError);
    return h(RuntimeContent, { value: detail.value.content, html: true });
  };
}});
</script>

<template>
  <div class="arcana-grid grid-wrapper" :class="[themeClass, { 'arcana-grid-responsive-vertical': config.responsiveMode === 'VERTICAL_RECORD' }]" :aria-label="config.ariaLabel ?? msg.gridLabel" :aria-busy="state.loading">
    <div v-if="state.error" class="arcana-grid-error" role="alert">{{ msg.loadError }}</div>
    <div class="arcana-grid-body" :style="config.overflowEnabled ? { maxHeight: `${config.height ?? 560}px`, overflow: 'auto' } : undefined">
      <div class="grid-header" :class="{ 'grid-header-sticky': config.stickyHeaderEnabled }" role="row">
        <div v-if="expandable" class="grid-header-cell grid-expand-cell" :class="pinClass(PIN_SLOT_EXPANDER)" :style="[expanderStyle, pinStyle(PIN_SLOT_EXPANDER)]" />
        <div v-if="config.checkboxEnabled" class="grid-header-cell" :class="pinClass(PIN_SLOT_CHECKBOX)" :style="[selectionStyle, pinStyle(PIN_SLOT_CHECKBOX)]"><input type="checkbox" :checked="state.rows.some(row => row._isChecked)" :disabled="config.isCheckboxHeaderDisabled?.(grid)" :aria-label="msg.selectAll" @change="grid.toggleAll(($event.target as HTMLInputElement).checked)" /></div>
        <div v-if="config.radioButtonSelectionEnabled" class="grid-header-cell" :class="pinClass(PIN_SLOT_RADIO)" :style="[selectionStyle, pinStyle(PIN_SLOT_RADIO)]" />
        <div v-for="column in columns" :key="column.name" class="grid-header-cell" :data-col-name="column.name" :tabindex="isReorderable(column) ? 0 : undefined" :class="[alignmentClass(column, grid), { 'grid-header-order': orderable(column) }, pinClass(column.name), dragClass(column)]" :style="[colStyle(column), pinStyle(column.name)]" role="columnheader" :aria-sort="orderable(column) ? ariaSortFor(sortOf(column).direction) : undefined" @click="onHeaderClick($event, column)" @pointerdown="startReorder($event, column)" @keydown="onHeaderKeyDown($event, column)">
          <RuntimeContent :value="headerValue(column)" :html="column.html === true" /><span class="arcana-sort" aria-hidden="true">{{ sortGlyphFor(sortOf(column).direction) }}<span v-if="sortOf(column).multi && sortOf(column).direction" class="arcana-sort-priority">{{ sortOf(column).priority }}</span></span>
          <span v-if="isResizable(column)" class="arcana-col-resizer" role="separator" aria-hidden="true" @pointerdown="startResize($event, column)" @click.stop></span>
        </div>
        <div v-if="config.actions" class="grid-header-cell" :class="pinClass(PIN_SLOT_ACTIONS)" :style="[actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS)]">{{ msg.actions }}</div>
      </div>
      <div v-if="config.searchEnabled !== false" class="grid-search-row" role="row">
        <div v-if="expandable" class="grid-search-row-cell grid-expand-cell" :class="pinClass(PIN_SLOT_EXPANDER)" :style="[expanderStyle, pinStyle(PIN_SLOT_EXPANDER)]" />
        <div v-if="config.checkboxEnabled" class="grid-search-row-cell" :class="pinClass(PIN_SLOT_CHECKBOX)" :style="[selectionStyle, pinStyle(PIN_SLOT_CHECKBOX)]" /><div v-if="config.radioButtonSelectionEnabled" class="grid-search-row-cell" :class="pinClass(PIN_SLOT_RADIO)" :style="[selectionStyle, pinStyle(PIN_SLOT_RADIO)]" />
        <div v-for="column in columns" :key="column.name" class="grid-search-row-cell" :class="pinClass(column.name)" :style="[colStyle(column), pinStyle(column.name)]">
          <RuntimeContent v-if="column.searchType === 'COMPONENT'" :value="column.searchTypeRenderer?.()" :html="true" />
          <FilterField v-else-if="searchable(column)" :column="column" :model-value="state.filters[column.filterName ?? column.name] ?? config.initialFilters?.[column.filterName ?? column.name]" :disabled="disabledFilter(column)" :messages="msg" :locale="gridLocale" @change="grid.applyFilter(column, $event)" />
        </div>
        <div v-if="config.actions" class="grid-search-row-cell" :class="pinClass(PIN_SLOT_ACTIONS)" :style="[actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS)]" />
      </div>
      <div class="grid-body" role="rowgroup">
        <div v-if="state.loading && state.rows.length === 0" class="arcana-grid-status" role="status">{{ msg.loading }}</div>
        <div v-else-if="state.rows.length === 0" class="arcana-grid-status">{{ msg.empty }}</div>
        <template v-for="row in state.rows" :key="row._uuid">
          <div class="grid-row flex" :class="{ 'grid-row-focused': row._hasFocus || focusedRow === row._uuid, 'grid-row-checked': row._isChecked || row._isRadioChecked }" role="row" @click="onRow(row)" @dblclick="config.onDoubleClickRow?.(row, grid)">
            <div v-if="expandable" class="grid-cell grid-expand-cell arcana-grid-selection-cell" :class="pinClass(PIN_SLOT_EXPANDER)" data-label="" :style="[expanderStyle, pinStyle(PIN_SLOT_EXPANDER)]"><button type="button" class="grid-expand-toggle" :class="{ 'is-open': isExpanded(row) }" :aria-expanded="isExpanded(row)" :aria-label="isExpanded(row) ? msg.collapseRow : msg.expandRow" @click="onExpandToggle($event, row)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></button></div>
            <div v-if="config.checkboxEnabled" class="grid-cell arcana-grid-selection-cell" :class="pinClass(PIN_SLOT_CHECKBOX)" :style="[selectionCellStyle(row), pinStyle(PIN_SLOT_CHECKBOX)]"><input type="checkbox" :checked="row._isChecked" :disabled="row._isCheckboxDisabled" :aria-label="msg.selectRow" @click.stop @change="grid.toggleRow(row, ($event.target as HTMLInputElement).checked)" /></div>
            <div v-if="config.radioButtonSelectionEnabled" class="grid-cell arcana-grid-selection-cell" :class="pinClass(PIN_SLOT_RADIO)" :style="[selectionCellStyle(row), pinStyle(PIN_SLOT_RADIO)]"><input type="radio" :name="state.uuid" :checked="row._isRadioChecked" :aria-label="msg.selectRow" @click.stop @change="selectRadio(row)" /></div>
            <div v-for="column in columns" :key="column.name" class="grid-cell" :class="[alignmentClass(column, grid), { 'grid-cell-focused': focusedCell === `${row._uuid}:${column.name}` }, pinClass(column.name)]" :data-label="column.label" :style="[cellStyle(column, row), pinStyle(column.name)]" role="cell" @click="onCell(column, row)" @dblclick="config.onDoubleClickCell?.(grid.getCellValue(column, row), column, row, grid)" @contextmenu="context($event, column, row)"><RuntimeContent :value="grid.getCellValue(column, row)" :html="column.html === true" /></div>
            <div v-if="config.actions" class="grid-cell" :class="pinClass(PIN_SLOT_ACTIONS)" :data-label="msg.actions" :style="[actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS)]"><template v-for="(action, index) in config.actions" :key="index"><RuntimeContent v-if="action.isVisible?.(row) ?? true" :value="action.element(row)" :html="true" /></template></div>
          </div>
          <div v-if="expandable && isExpanded(row)" class="grid-detail-row" role="row"><div class="grid-detail-cell" role="cell"><ExpandedRowContent :row="row" /></div></div>
        </template>
      </div>
      <div v-if="config.footerSummarizerEnabled" class="grid-summarizer" :class="{ 'grid-summarizer-sticky': config.stickyHeaderEnabled }">
        <div v-if="expandable" class="grid-summarizer-cell grid-expand-cell" :class="pinClass(PIN_SLOT_EXPANDER)" :style="[expanderStyle, pinStyle(PIN_SLOT_EXPANDER)]" />
        <div v-if="config.checkboxEnabled" class="grid-summarizer-cell" :class="pinClass(PIN_SLOT_CHECKBOX)" :style="[selectionStyle, pinStyle(PIN_SLOT_CHECKBOX)]" /><div v-if="config.radioButtonSelectionEnabled" class="grid-summarizer-cell" :class="pinClass(PIN_SLOT_RADIO)" :style="[selectionStyle, pinStyle(PIN_SLOT_RADIO)]" />
        <div v-for="column in columns" :key="column.name" class="grid-summarizer-cell" :class="[alignmentClass(column, grid), pinClass(column.name)]" :style="[{ ...colStyle(column), padding: '8px 10px' }, pinStyle(column.name)]"><RuntimeContent :value="grid.getSummarizedValue(column)?.formatted" :html="true" /></div>
        <div v-if="config.actions" class="grid-summarizer-cell" :class="pinClass(PIN_SLOT_ACTIONS)" :style="[actionStyle(grid), pinStyle(PIN_SLOT_ACTIONS)]" />
      </div>
    </div>
    <div v-if="config.footerVisible ?? true" class="grid-footer">
      <div class="arcana-grid-pages">
        <label v-if="config.isRowsPerPageVisible ?? true" class="arcana-grid__per-page">{{ msg.perPage }} <select :value="state.rowsPerPage" class="arcana-grid-datatable-select" @change="grid.paginate(1, Number(($event.target as HTMLSelectElement).value))"><option v-for="size in [10,25,50,100,250,500]" :key="size" :value="size">{{ size }}</option></select></label>
        <span v-if="state.totalRows" class="arcana-grid__info">{{ formatMessage(msg.showingRange, { from: beginning, to: ending, total: state.totalRows }) }}</span>
        <div class="arcana-grid__pagination-group">
          <span class="arcana-grid-selected-rows">{{ grid.getCheckedRows().length ? formatMessage(msg.selectedCount, { count: grid.getCheckedRows().length }) : '' }}</span>
          <ul :aria-label="msg.pagination"><li><button type="button" :disabled="state.currentPage <= 1" :aria-label="msg.previousPage" @click="grid.paginate(state.currentPage - 1, state.rowsPerPage)">‹</button></li><li v-for="page in pages" :key="page" :class="{ current: page === state.currentPage }"><button type="button" :disabled="page === state.currentPage" @click="grid.paginate(page, state.rowsPerPage)">{{ page }}</button></li><li><button type="button" :disabled="state.currentPage >= lastPage" :aria-label="msg.nextPage" @click="grid.paginate(state.currentPage + 1, state.rowsPerPage)">›</button></li></ul>
        </div>
      </div>
    </div>
    <div v-if="menu" class="arcana-context-menu" :class="themeClass" :style="{ left: `${menu.x}px`, top: `${menu.y}px` }" role="menu" @click.stop><button v-for="(item, index) in menu.items" :key="`${item.label}-${index}`" type="button" role="menuitem" @click="item.onClick?.(); menu = null">{{ item.label }}</button></div>
    <div v-if="sortMenu" class="arcana-context-menu arcana-header-menu" :class="themeClass" :style="{ left: `${sortMenu.x}px`, top: `${sortMenu.y}px` }" role="menu" @click.stop>
      <div v-if="menuColumnOrderable" class="arcana-sort-menu" role="group" :aria-label="msg.sortMenu">
        <button type="button" role="menuitem" :class="{ 'is-active': menuDirection(sortMenu.name) === 'asc' }" @click="applySortOption('asc')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5 3.5 8h3v4.5h3V8h3L8 3.5Z" /></svg>{{ msg.sortAscending }}</button>
        <button type="button" role="menuitem" :class="{ 'is-active': menuDirection(sortMenu.name) === 'desc' }" @click="applySortOption('desc')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12.5 12.5 8h-3V3.5h-3V8h-3L8 12.5Z" /></svg>{{ msg.sortDescending }}</button>
        <button v-if="menuDirection(sortMenu.name)" type="button" role="menuitem" class="arcana-sort-menu__clear" @click="applySortOption(null)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>{{ msg.sortClear }}</button>
      </div>
      <div v-if="pinnable" class="arcana-pin-menu" role="group">
        <button type="button" role="menuitem" :class="{ 'is-active': getColumnPin(sortMenu.col) === 'left' }" @click="applyPin('left')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h3v12H3zM7 4h6v8H7z" /></svg>{{ msg.pinLeft }}</button>
        <button type="button" role="menuitem" :class="{ 'is-active': getColumnPin(sortMenu.col) === 'right' }" @click="applyPin('right')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2h3v12h-3zM3 4h6v8H3z" /></svg>{{ msg.pinRight }}</button>
        <button v-if="getColumnPin(sortMenu.col)" type="button" role="menuitem" @click="applyPin(null)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>{{ msg.unpin }}</button>
      </div>
    </div>
  </div>
</template>
