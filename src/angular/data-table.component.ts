import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
  OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject
} from "@angular/core";
import { createDataTable } from "../core/controller";
import { formatMessage, resolveArcanaLocale, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
import { arcanaThemeClass } from "../core/theme";
import { actionStyle, alignmentClass, ariaSortValue, columnSortState, columnStyle, computePinPlan, dropSide, expanderStyle, inlineStyle, isColumnPinnable, isColumnReorderable, isColumnResizable, pagination, PIN_SLOT_ACTIONS, PIN_SLOT_CHECKBOX, PIN_SLOT_EXPANDER, PIN_SLOT_RADIO, type PinPlan, resizeMinWidth, selectionStyle, sortGlyph } from "../core/view";
import type {
  ContextMenuItem, DataTableAction, DataTableApi, DataTableColumn, DataTableConfig,
  DataTableRow, DataTableSnapshot, OrderBy, Renderable, SortDirection
} from "../core/types";
import { ArcanaContentDirective } from "./content.directive";
import { ArcanaExpandedRowComponent } from "./expanded-row.component";
import { ArcanaFilterFieldComponent } from "./filter-field.component";

/**
 * `ArcanaDataTable` — Angular standalone adapter over the framework-agnostic
 * controller (`core/controller.ts`). Markup, classes and behavior mirror the
 * React/Vue/Svelte adapters: header with the sort menu, filter row,
 * checkbox/radio selection, actions, context menu, footer with pagination,
 * summarizer, themes and expandable rows.
 *
 * Custom content (`valueGetter`, `actions[].element`, `expandedRowRenderer`,
 * …) accepts what `Renderable` allows in a framework-neutral way: HTML
 * strings, numbers/booleans, DOM nodes or callbacks returning any of those.
 *
 * The imperative controller is exposed as `api` (template refs work well:
 * `<arcana-data-table #table …>` → `table.api.refresh()`).
 */
@Component({
  selector: "arcana-data-table",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArcanaContentDirective, ArcanaExpandedRowComponent, ArcanaFilterFieldComponent],
  styles: [":host { display: block; }"],
  template: `
    <div class="spark-grid grid-wrapper {{ themeClass() }}{{ config.responsiveMode === 'VERTICAL_RECORD' ? ' spark-grid-responsive-vertical' : '' }}{{ className ? ' ' + className : '' }}" [attr.aria-label]="config.ariaLabel ?? msg.gridLabel" [attr.aria-busy]="snap.loading">
      @if (snap.error) {
        <div class="arcana-grid-error" role="alert">{{ msg.loadError }}</div>
      }
      <div class="spark-grid-body" [style]="bodyStyle()">
        <div class="grid-header" [class.grid-header-sticky]="config.stickyHeaderEnabled" role="row">
          @if (expandable()) { <div class="grid-header-cell grid-expand-cell {{ pinClsExpander() }}" [style]="expanderPinStyle()"></div> }
          @if (config.checkboxEnabled) {
            <div class="grid-header-cell {{ pinClsCheckbox() }}" [style]="checkboxPinStyle()">
              <input type="checkbox" [checked]="hasCheckedRows()" [disabled]="isHeaderCheckboxDisabled()" [attr.aria-label]="msg.selectAll" (change)="toggleAll($event)" />
            </div>
          }
          @if (config.radioButtonSelectionEnabled) { <div class="grid-header-cell {{ pinClsRadio() }}" [style]="radioPinStyle()"></div> }
          @for (column of columns; track column.name) {
            <div class="grid-header-cell {{ alignment(column) }} {{ pinClsColumn(column) }}" [class.grid-header-order]="orderable(column)" [style]="headerCellStyle(column)" role="columnheader" [attr.data-col-name]="column.name" [attr.tabindex]="isReorderable(column) ? 0 : null" [attr.aria-sort]="orderable(column) ? ariaSort(column) : null" (click)="onHeaderClick($event, column)" (pointerdown)="startReorder($event, column)" (keydown)="onHeaderKeyDown($event, column)"><span [arcanaContent]="headerValue(column)" [arcanaContentHtml]="column.html === true"></span><span class="arcana-sort" aria-hidden="true">{{ sortMark(column) }}@if (sortPriority(column)) {<span class="arcana-sort-priority">{{ sortPriority(column) }}</span>}</span>@if (isResizable(column)) {<span class="arcana-col-resizer" role="separator" aria-hidden="true" (pointerdown)="startResize($event, column)" (click)="$event.stopPropagation()"></span>}</div>
          }
          @if (config.actions) { <div class="grid-header-cell {{ pinClsActions() }}" [style]="actionsCellStyle()">{{ msg.actions }}</div> }
        </div>
        @if (config.searchEnabled !== false) {
          <div class="grid-search-row" role="row">
            @if (expandable()) { <div class="grid-search-row-cell grid-expand-cell {{ pinClsExpander() }}" [style]="expanderPinStyle()"></div> }
            @if (config.checkboxEnabled) { <div class="grid-search-row-cell {{ pinClsCheckbox() }}" [style]="checkboxPinStyle()"></div> }
            @if (config.radioButtonSelectionEnabled) { <div class="grid-search-row-cell {{ pinClsRadio() }}" [style]="radioPinStyle()"></div> }
            @for (column of columns; track column.name) {
              @if (column.searchType === "COMPONENT") {
                <div class="grid-search-row-cell {{ pinColClass(column) }}" [style]="headerCellStyle(column)"><span [arcanaContent]="searchRenderer(column)" [arcanaContentHtml]="true"></span></div>
              } @else if (column.searchEnabled ?? true) {
                <div class="grid-search-row-cell {{ pinColClass(column) }}" arcanaFilterField [column]="column" [value]="filterValue(column)" [disabled]="disabledFilter(column)" [messages]="msg" [locale]="gridLocale" [style]="headerCellStyle(column)" (valueChange)="applyFilter(column, $event)"></div>
              } @else {
                <div class="grid-search-row-cell {{ pinColClass(column) }}" [style]="headerCellStyle(column)"></div>
              }
            }
            @if (config.actions) { <div class="grid-search-row-cell {{ pinClsActions() }}" [style]="actionsCellStyle()"></div> }
          </div>
        }
        <div class="grid-body" role="rowgroup">
          @if (snap.loading && !snap.rows.length) {
            <div class="arcana-grid-status" role="status">{{ msg.loading }}</div>
          } @else if (!snap.rows.length) {
            <div class="arcana-grid-status">{{ msg.empty }}</div>
          }
          @for (row of snap.rows; track row._uuid) {
            <div class="grid-row flex" [class.grid-row-focused]="row._hasFocus || focusedRow === row._uuid" [class.grid-row-checked]="row._isChecked || row._isRadioChecked" role="row" (click)="selectRow(row)" (dblclick)="onDoubleClickRow(row)">
              @if (expandable()) {
                <div class="grid-cell grid-expand-cell spark-grid-selection-cell {{ pinClsExpander() }}" data-label="" [style]="expanderPinStyle()">
                  <button type="button" class="grid-expand-toggle" [class.is-open]="isExpanded(row)" [attr.aria-expanded]="isExpanded(row)" [attr.aria-label]="isExpanded(row) ? msg.collapseRow : msg.expandRow" (click)="onExpandToggle($event, row)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
                </div>
              }
              @if (config.checkboxEnabled) {
                <div class="grid-cell spark-grid-selection-cell {{ pinClsCheckbox() }}" [style]="checkboxCellStyle(row)">
                  <input type="checkbox" [checked]="!!row._isChecked" [disabled]="!!row._isCheckboxDisabled" [attr.aria-label]="msg.selectRow" (click)="$event.stopPropagation()" (change)="toggleRow(row, $event)" />
                </div>
              }
              @if (config.radioButtonSelectionEnabled) {
                <div class="grid-cell spark-grid-selection-cell {{ pinClsRadio() }}" [style]="radioCellStyle(row)">
                  <input type="radio" [name]="snap.uuid" [checked]="!!row._isRadioChecked" [attr.aria-label]="msg.selectRow" (click)="$event.stopPropagation()" (change)="selectRadio(row)" />
                </div>
              }
              @for (column of columns; track column.name) {
                <div class="grid-cell {{ alignment(column) }} {{ pinColClass(column) }}" [class.grid-cell-focused]="focusedCell === row._uuid + ':' + column.name" [attr.data-label]="column.label" [style]="cellStyle(column, row)" role="cell" (click)="selectCell(column, row)" (dblclick)="onDoubleClickCell(column, row)" (contextmenu)="openMenu($event, column, row)"><span [arcanaContent]="cellValue(column, row)" [arcanaContentHtml]="column.html === true"></span></div>
              }
              @if (config.actions) {
                <div class="grid-cell {{ pinClsActions() }}" [attr.data-label]="msg.actions" [style]="actionsCellStyle()">
                  @for (action of config.actions; track $index) {
                    @if (action.isVisible ? action.isVisible(row) : true) { <span [arcanaContent]="actionContent(action, row)" [arcanaContentHtml]="true"></span> }
                  }
                </div>
              }
            </div>
            @if (expandable() && isExpanded(row)) {
              <div class="grid-detail-row" role="row"><div class="grid-detail-cell" role="cell" arcanaExpandedRow [row]="row" [grid]="grid"></div></div>
            }
          }
        </div>
        @if (config.footerSummarizerEnabled) {
          <div class="grid-summarizer" [class.grid-summarizer-sticky]="config.stickyHeaderEnabled">
            @if (expandable()) { <div class="grid-summarizer-cell grid-expand-cell {{ pinClsExpander() }}" [style]="expanderPinStyle()"></div> }
            @if (config.checkboxEnabled) { <div class="grid-summarizer-cell {{ pinClsCheckbox() }}" [style]="checkboxPinStyle()"></div> }
            @if (config.radioButtonSelectionEnabled) { <div class="grid-summarizer-cell {{ pinClsRadio() }}" [style]="radioPinStyle()"></div> }
            @for (column of columns; track column.name) {
              <div class="grid-summarizer-cell {{ alignment(column) }} {{ pinColClass(column) }}" [style]="summarizerCellStyle(column)"><span [arcanaContent]="summarizedValue(column)" [arcanaContentHtml]="true"></span></div>
            }
            @if (config.actions) { <div class="grid-summarizer-cell {{ pinClsActions() }}" [style]="actionsCellStyle()"></div> }
          </div>
        }
      </div>
      @if (config.footerVisible ?? true) {
        <div class="grid-footer"><div class="spark-grid-pages">
          @if (config.isRowsPerPageVisible ?? true) {
            <label class="spark-grid__per-page">{{ msg.perPage }} <select [value]="snap.rowsPerPage" class="spark-grid-datatable-select" (change)="onPerPageChange($event)">
              @for (size of pageSizes; track size) { <option [value]="size">{{ size }}</option> }
            </select></label>
          }
          @if (snap.totalRows) { <span class="spark-grid__info">{{ rangeInfo() }}</span> }
          <div class="spark-grid__pagination-group"><span class="spark-grid-selected-rows">{{ checkedLabel() }}</span>
            <ul [attr.aria-label]="msg.pagination"><li><button type="button" [disabled]="snap.currentPage <= 1" [attr.aria-label]="msg.previousPage" (click)="paginate(snap.currentPage - 1)">‹</button></li>@for (page of pages(); track page) {<li [class.current]="page === snap.currentPage"><button type="button" [disabled]="page === snap.currentPage" (click)="paginate(page)">{{ page }}</button></li>}<li><button type="button" [disabled]="snap.currentPage >= lastPage()" [attr.aria-label]="msg.nextPage" (click)="paginate(snap.currentPage + 1)">›</button></li></ul>
          </div>
        </div></div>
      }
      @if (menu; as contextMenuState) {
        <div class="arcana-context-menu {{ themeClass() }}" [style]="menuStyle(contextMenuState.x, contextMenuState.y)" role="menu" (click)="$event.stopPropagation()">
          @for (item of contextMenuState.items; track $index) {
            <button type="button" role="menuitem" (click)="runMenuItem(item)">{{ item.label }}</button>
          }
        </div>
      }
      @if (sortMenu; as sortMenuState) {
        <div class="arcana-context-menu arcana-header-menu {{ themeClass() }}" [style]="menuStyle(sortMenuState.x, sortMenuState.y)" role="menu" (click)="$event.stopPropagation()">
          @if (menuColumnOrderable) {
            <div class="arcana-sort-menu" role="group" [attr.aria-label]="msg.sortMenu">
              <button type="button" role="menuitem" [class.is-active]="menuDirection(sortMenuState.name) === 'asc'" (click)="applySortOption('asc')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5 3.5 8h3v4.5h3V8h3L8 3.5Z" /></svg>{{ msg.sortAscending }}</button>
              <button type="button" role="menuitem" [class.is-active]="menuDirection(sortMenuState.name) === 'desc'" (click)="applySortOption('desc')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12.5 12.5 8h-3V3.5h-3V8h-3L8 12.5Z" /></svg>{{ msg.sortDescending }}</button>
              @if (menuDirection(sortMenuState.name)) {
                <button type="button" role="menuitem" class="arcana-sort-menu__clear" (click)="applySortOption(null)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>{{ msg.sortClear }}</button>
              }
            </div>
          }
          @if (pinnable) {
            <div class="arcana-pin-menu" role="group">
              <button type="button" role="menuitem" [class.is-active]="columnPin(sortMenuState.col) === 'left'" (click)="applyPin('left')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h3v12H3zM7 4h6v8H7z" /></svg>{{ msg.pinLeft }}</button>
              <button type="button" role="menuitem" [class.is-active]="columnPin(sortMenuState.col) === 'right'" (click)="applyPin('right')"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2h3v12h-3zM3 4h6v8H3z" /></svg>{{ msg.pinRight }}</button>
              @if (columnPin(sortMenuState.col)) {
                <button type="button" role="menuitem" (click)="applyPin(null)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>{{ msg.unpin }}</button>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ArcanaDataTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) config!: DataTableConfig<DataTableRow>;
  @Input() className = "";
  @Output() mounted = new EventEmitter<DataTableApi<DataTableRow>>();

  grid!: DataTableApi<DataTableRow>;
  snap!: DataTableSnapshot<DataTableRow>;
  columns: DataTableColumn<DataTableRow>[] = [];
  /** Resolved built-in strings (config.messages > config.locale > global default). */
  msg: ArcanaMessages = resolveArcanaMessages();
  gridLocale: ArcanaLocale = resolveArcanaLocale();
  menu: { x: number; y: number; items: ContextMenuItem[] } | null = null;
  sortMenu: { x: number; y: number; name: string; col: string } | null = null;
  focusedRow: string | null = null;
  focusedCell: string | null = null;
  columnWidths: Record<string, number> = {};
  drag: { name: string; over: string | null; side: "before" | "after" } | null = null;
  private didDrag = false;
  private pinPlan: PinPlan = { active: false, cellStyle: () => ({}), className: () => "" };

  readonly pageSizes = [10, 25, 50, 100, 250, 500];
  readonly expanderCellStyle = inlineStyle(expanderStyle);
  readonly selectionHeaderStyle = inlineStyle(selectionStyle);

  private unsubscribe: (() => void) | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly closeMenus = () => {
    if (!this.menu && !this.sortMenu) return;
    this.menu = null;
    this.sortMenu = null;
    this.cdr.markForCheck();
  };
  private readonly onWindowKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") this.closeMenus();
  };

  /** The imperative controller (`DataTableApi`) backing this grid. */
  get api(): DataTableApi<DataTableRow> {
    return this.grid;
  }

  ngOnInit(): void {
    if (!this.grid) this.attach(this.config);
    this.mounted.emit(this.grid);
    if (this.config.sendRequestOnMounted !== false) void this.grid.refresh();
    window.addEventListener("click", this.closeMenus);
    window.addEventListener("blur", this.closeMenus);
    window.addEventListener("keydown", this.onWindowKey);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["config"]) return;
    const isFirst = changes["config"].isFirstChange();
    this.attach(this.config);
    if (!isFirst && this.config.sendRequestOnMounted !== false) void this.grid.refresh();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
    window.removeEventListener("click", this.closeMenus);
    window.removeEventListener("blur", this.closeMenus);
    window.removeEventListener("keydown", this.onWindowKey);
  }

  private attach(config: DataTableConfig<DataTableRow>): void {
    this.unsubscribe?.();
    this.msg = resolveArcanaMessages(config);
    this.gridLocale = resolveArcanaLocale(config);
    this.grid = createDataTable(config);
    this.snap = this.grid.getSnapshot();
    this.columns = this.grid.getColumns();
    this.recomputePins();
    this.unsubscribe = this.grid.subscribe(() => {
      this.snap = this.grid.getSnapshot();
      this.columns = this.grid.getColumns();
      this.recomputePins();
      this.cdr.markForCheck();
    });
  }

  private recomputePins(): void {
    this.pinPlan = computePinPlan(this.grid, this.columns, this.columnWidths);
  }

  themeClass(): string {
    return arcanaThemeClass(this.config.theme);
  }

  expandable(): boolean {
    return Boolean(this.config.expandableRowsEnabled);
  }

  bodyStyle(): string | null {
    return this.config.overflowEnabled ? `max-height: ${this.config.height ?? 560}px; overflow: auto` : null;
  }

  alignment(column: DataTableColumn<DataTableRow>): string {
    return alignmentClass(column, this.grid);
  }

  orderable(column: DataTableColumn<DataTableRow>): boolean {
    return this.config.orderByEnabled !== false && column.orderByEnabled !== false;
  }

  headerCellStyle(column: DataTableColumn<DataTableRow>): string {
    return inlineStyle(columnStyle(column, this.grid, this.columnWidths[column.name]), this.pinPlan.cellStyle(column.name));
  }

  actionsCellStyle(): string {
    return inlineStyle(actionStyle(this.grid), this.pinPlan.cellStyle(PIN_SLOT_ACTIONS));
  }

  summarizerCellStyle(column: DataTableColumn<DataTableRow>): string {
    return inlineStyle(columnStyle(column, this.grid, this.columnWidths[column.name]), { padding: "8px 10px" }, this.pinPlan.cellStyle(column.name));
  }

  cellStyle(column: DataTableColumn<DataTableRow>, row: DataTableRow): string {
    return inlineStyle(
      columnStyle(column, this.grid, this.columnWidths[column.name]),
      { padding: "8px 10px" },
      this.config.onBeforeCellStyleMounted?.(this.grid.getCellValue(column, row), column, row, this.grid),
      column.onBeforeColumnStyleMounted?.(this.grid.getCellValue(column, row), row, this.grid),
      this.pinPlan.cellStyle(column.name)
    );
  }

  checkboxCellStyle(row: DataTableRow): string {
    return inlineStyle(selectionStyle, this.config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, this.grid), this.pinPlan.cellStyle(PIN_SLOT_CHECKBOX));
  }

  radioCellStyle(row: DataTableRow): string {
    return inlineStyle(selectionStyle, this.config.onBeforeCheckboxAndRadioButtonStyleMounted?.(row, this.grid), this.pinPlan.cellStyle(PIN_SLOT_RADIO));
  }

  /* ---- Pin (freeze) helpers ---- */
  expanderPinStyle(): string { return inlineStyle(expanderStyle, this.pinPlan.cellStyle(PIN_SLOT_EXPANDER)); }
  checkboxPinStyle(): string { return inlineStyle(selectionStyle, this.pinPlan.cellStyle(PIN_SLOT_CHECKBOX)); }
  radioPinStyle(): string { return inlineStyle(selectionStyle, this.pinPlan.cellStyle(PIN_SLOT_RADIO)); }
  pinClsExpander(): string { return this.pinPlan.className(PIN_SLOT_EXPANDER); }
  pinClsCheckbox(): string { return this.pinPlan.className(PIN_SLOT_CHECKBOX); }
  pinClsRadio(): string { return this.pinPlan.className(PIN_SLOT_RADIO); }
  pinClsActions(): string { return this.pinPlan.className(PIN_SLOT_ACTIONS); }
  pinClsColumn(column: DataTableColumn<DataTableRow>): string {
    return `${this.pinPlan.className(column.name)}${this.dragClass(column)}`;
  }
  pinColClass(column: DataTableColumn<DataTableRow>): string {
    return this.pinPlan.className(column.name);
  }
  dragClass(column: DataTableColumn<DataTableRow>): string {
    if (!this.drag) return "";
    const dragging = this.drag.name === column.name ? " arcana-col-dragging" : "";
    const over = this.drag.over === column.name && this.drag.name !== column.name ? (this.drag.side === "before" ? " arcana-drop-before" : " arcana-drop-after") : "";
    return `${dragging}${over}`;
  }
  isReorderable(column: DataTableColumn<DataTableRow>): boolean { return isColumnReorderable(column, this.grid); }
  get pinnable(): boolean { return isColumnPinnable(this.grid); }
  columnPin(name: string): "left" | "right" | null { return this.grid.getColumnPin(name); }
  get menuColumnOrderable(): boolean {
    const column = this.sortMenu ? this.columns.find((item) => item.name === this.sortMenu!.col) : undefined;
    return column ? this.orderable(column) : false;
  }

  applyPin(pin: "left" | "right" | null): void {
    if (!this.sortMenu) return;
    this.grid.setColumnPinned(this.sortMenu.col, pin);
    this.sortMenu = null;
  }

  startReorder(event: PointerEvent, column: DataTableColumn<DataTableRow>): void {
    if (!isColumnReorderable(column, this.grid) || event.button !== 0) return;
    const startX = event.clientX;
    const startY = event.clientY;
    let dragging = false;
    const overEl = (x: number, y: number) => (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>(".grid-header-cell") ?? null;
    const onMove = (move: PointerEvent): void => {
      if (!dragging) {
        if (Math.abs(move.clientX - startX) < 5 && Math.abs(move.clientY - startY) < 5) return;
        dragging = true;
      }
      const el = overEl(move.clientX, move.clientY);
      this.drag = { name: column.name, over: el?.getAttribute("data-col-name") ?? null, side: el ? dropSide(move.clientX, el.getBoundingClientRect()) : "after" };
      this.cdr.markForCheck();
    };
    const onUp = (up: PointerEvent): void => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (!dragging) return;
      this.didDrag = true;
      const el = overEl(up.clientX, up.clientY);
      const over = el?.getAttribute("data-col-name") ?? null;
      if (over && over !== column.name && el) this.grid.moveColumn(column.name, over, dropSide(up.clientX, el.getBoundingClientRect()));
      this.drag = null;
      window.setTimeout(() => { this.didDrag = false; }, 0);
      this.cdr.markForCheck();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  onHeaderKeyDown(event: KeyboardEvent, column: DataTableColumn<DataTableRow>): void {
    if (!isColumnReorderable(column, this.grid) || !(event.ctrlKey || event.metaKey)) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const names = this.grid.getColumns().map((item) => item.name);
    const index = names.indexOf(column.name);
    const target = event.key === "ArrowLeft" ? index - 1 : index + 1;
    if (target < 0 || target >= names.length) return;
    this.grid.moveColumn(column.name, names[target], event.key === "ArrowLeft" ? "before" : "after");
  }

  menuStyle(x: number, y: number): string {
    return `left: ${x}px; top: ${y}px`;
  }

  hasCheckedRows(): boolean {
    return this.snap.rows.some((row) => row._isChecked);
  }

  isHeaderCheckboxDisabled(): boolean {
    return Boolean(this.config.isCheckboxHeaderDisabled?.(this.grid));
  }

  toggleAll(event: Event): void {
    this.grid.toggleAll((event.target as HTMLInputElement).checked);
  }

  toggleRow(row: DataTableRow, event: Event): void {
    this.grid.toggleRow(row, (event.target as HTMLInputElement).checked);
  }

  selectRadio(row: DataTableRow): void {
    this.grid.setSelectedRadioRow(row);
  }

  headerValue(column: DataTableColumn<DataTableRow>): Renderable {
    const initial = this.config.onBeforeHeaderCellMounted?.(column, this.grid);
    return column.headerContentGetter?.(initial, this.grid) ?? initial ?? column.label;
  }

  searchRenderer(column: DataTableColumn<DataTableRow>): Renderable {
    return column.searchTypeRenderer?.();
  }

  cellValue(column: DataTableColumn<DataTableRow>, row: DataTableRow): Renderable {
    return this.grid.getCellValue(column, row);
  }

  actionContent(action: DataTableAction<DataTableRow>, row: DataTableRow): Renderable {
    return action.element(row);
  }

  summarizedValue(column: DataTableColumn<DataTableRow>): Renderable {
    return this.grid.getSummarizedValue(column)?.formatted;
  }

  filterValue(column: DataTableColumn<DataTableRow>): unknown {
    return this.snap.filters[column.filterName ?? column.name] ?? this.config.initialFilters?.[column.filterName ?? column.name];
  }

  disabledFilter(column: DataTableColumn<DataTableRow>): boolean {
    return Boolean(this.config.disableFilterWhenPresentOnInitialFilters && this.config.initialFilters?.[column.filterName ?? column.name]);
  }

  applyFilter(column: DataTableColumn<DataTableRow>, value: unknown): void {
    void this.grid.applyFilter(column, value);
  }

  onHeaderClick(event: MouseEvent, column: DataTableColumn<DataTableRow>): void {
    if (this.didDrag) return;
    const isOrderable = this.orderable(column);
    if (!isOrderable && !this.pinnable) return;
    const name = column.filterName ?? column.name;
    event.stopPropagation();
    if (event.shiftKey) { if (isOrderable) { this.sortMenu = null; void this.grid.toggleOrderBy(name, { additive: true }); } return; }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.sortMenu = this.sortMenu?.col === column.name ? null : { x: rect.left, y: rect.bottom + 2, name, col: column.name };
  }

  applySortOption(direction: OrderBy["direction"] | null): void {
    if (!this.sortMenu) return;
    void this.grid.applyOrderBy(direction ? { name: this.sortMenu.name, direction } : null);
    this.sortMenu = null;
  }

  menuDirection(name: string): SortDirection | null {
    return this.snap.orderByList.find((order) => order.name === name)?.direction ?? null;
  }

  sortMark(column: DataTableColumn<DataTableRow>): string {
    return sortGlyph(columnSortState(this.snap.orderByList, column).direction);
  }

  sortPriority(column: DataTableColumn<DataTableRow>): number | null {
    const state = columnSortState(this.snap.orderByList, column);
    return state.multi && state.direction ? state.priority : null;
  }

  ariaSort(column: DataTableColumn<DataTableRow>): string {
    return ariaSortValue(columnSortState(this.snap.orderByList, column).direction);
  }

  isResizable(column: DataTableColumn<DataTableRow>): boolean {
    return isColumnResizable(column, this.grid);
  }

  startResize(event: PointerEvent, column: DataTableColumn<DataTableRow>): void {
    event.preventDefault();
    event.stopPropagation();
    const header = (event.currentTarget as HTMLElement).parentElement;
    const startX = event.clientX;
    const startWidth = this.columnWidths[column.name] ?? header?.getBoundingClientRect().width ?? resizeMinWidth(this.grid);
    const min = resizeMinWidth(this.grid);
    const onMove = (move: PointerEvent): void => {
      const next = Math.max(min, Math.round(startWidth + (move.clientX - startX)));
      this.columnWidths = { ...this.columnWidths, [column.name]: next };
      this.recomputePins();
      this.cdr.markForCheck();
    };
    const onUp = (): void => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  openMenu(event: MouseEvent, column: DataTableColumn<DataTableRow>, row: DataTableRow): void {
    const items = this.config.onContextMenu?.(this.grid.getCellValue(column, row), column, row, this.grid);
    if (items?.length) {
      event.preventDefault();
      this.menu = { x: event.clientX, y: event.clientY, items };
    }
  }

  runMenuItem(item: ContextMenuItem): void {
    item.onClick?.();
    this.menu = null;
  }

  isExpanded(row: DataTableRow): boolean {
    return Boolean(row._uuid && this.snap.expandedRowUuids.includes(row._uuid));
  }

  onExpandToggle(event: MouseEvent, row: DataTableRow): void {
    event.stopPropagation();
    this.toggleExpand(row);
  }

  private toggleExpand(row: DataTableRow): void {
    if (!row._uuid) return;
    this.isExpanded(row) ? this.grid.collapseRow(row._uuid) : this.grid.expandRow(row._uuid);
  }

  selectRow(row: DataTableRow): void {
    if (this.config.rowFocusEnabled) this.focusedRow = row._uuid ?? null;
    if (this.expandable() && this.config.expandRowOnClick) this.toggleExpand(row);
    this.config.onClickRow?.(row, this.grid);
  }

  onDoubleClickRow(row: DataTableRow): void {
    this.config.onDoubleClickRow?.(row, this.grid);
  }

  selectCell(column: DataTableColumn<DataTableRow>, row: DataTableRow): void {
    if (this.config.cellFocusEnabled ?? true) this.focusedCell = `${row._uuid}:${column.name}`;
    this.config.onClickCell?.(this.grid.getCellValue(column, row), column, row, this.grid);
  }

  onDoubleClickCell(column: DataTableColumn<DataTableRow>, row: DataTableRow): void {
    this.config.onDoubleClickCell?.(this.grid.getCellValue(column, row), column, row, this.grid);
  }

  pages(): number[] {
    return pagination(this.snap.currentPage, this.snap.totalRows, this.snap.rowsPerPage);
  }

  lastPage(): number {
    return Math.ceil(this.snap.totalRows / this.snap.rowsPerPage);
  }

  beginning(): number {
    return this.snap.totalRows ? ((this.snap.currentPage - 1) * this.snap.rowsPerPage) + 1 : 0;
  }

  ending(): number {
    return Math.min(this.snap.currentPage * this.snap.rowsPerPage, this.snap.totalRows);
  }

  checkedLabel(): string {
    const total = this.grid.getCheckedRows().length;
    return total ? formatMessage(this.msg.selectedCount, { count: total }) : "";
  }

  rangeInfo(): string {
    return formatMessage(this.msg.showingRange, { from: this.beginning(), to: this.ending(), total: this.snap.totalRows });
  }

  paginate(page: number): void {
    void this.grid.paginate(page, this.snap.rowsPerPage);
  }

  onPerPageChange(event: Event): void {
    void this.grid.paginate(1, Number((event.target as HTMLSelectElement).value));
  }
}
