import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { ArcanaLocale, DataTableColumn, DataTableConfig, DataTableRow } from "../../../src";
import { ARCANA_LOCALES, ARCANA_MESSAGES } from "../../../src";
import { ArcanaDataTable } from "../../../src/react";
import { CodeBlock } from "./CodeBlock";
import { codePair } from "./snippets";
import { FW_BADGE, type Framework } from "./DocsShell";
import { fmt, useLang, type Messages } from "../i18n";

type DemoRow = DataTableRow & {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  active: boolean;
  joinedAt: string;
  amount: number;
  score: number;
};

/** Demo rows with translated departments/statuses (people names are fake data, kept as-is). */
function makeRows(msg: Messages): DemoRow[] {
  const d = msg.demos.departments;
  const s = msg.demos.statuses;
  return [
    { id: 101, name: "Ada Lovelace", email: "ada@arcana.dev", department: d.engineering, status: s.active, active: true, joinedAt: "2026-01-12", amount: 4280, score: 96 },
    { id: 102, name: "Grace Hopper", email: "grace@arcana.dev", department: d.engineering, status: s.active, active: true, joinedAt: "2026-02-08", amount: 1950, score: 91 },
    { id: 103, name: "Alan Turing", email: "alan@arcana.dev", department: d.research, status: s.inReview, active: false, joinedAt: "2026-03-20", amount: 8760, score: 88 },
    { id: 104, name: "Margaret Hamilton", email: "margaret@arcana.dev", department: d.product, status: s.active, active: true, joinedAt: "2026-04-02", amount: 2340, score: 99 },
    { id: 105, name: "Edsger Dijkstra", email: "edsger@arcana.dev", department: d.research, status: s.inactive, active: false, joinedAt: "2026-05-17", amount: 5150, score: 90 },
    { id: 106, name: "Katherine Johnson", email: "katherine@arcana.dev", department: d.product, status: s.active, active: true, joinedAt: "2026-06-09", amount: 3680, score: 97 },
    { id: 107, name: "Donald Knuth", email: "donald@arcana.dev", department: d.editorial, status: s.inReview, active: true, joinedAt: "2026-07-14", amount: 6420, score: 94 },
    { id: 108, name: "Barbara Liskov", email: "barbara@arcana.dev", department: d.engineering, status: s.active, active: true, joinedAt: "2026-08-01", amount: 2890, score: 95 },
    { id: 109, name: "Radia Perlman", email: "radia@arcana.dev", department: d.infrastructure, status: s.active, active: true, joinedAt: "2026-08-19", amount: 5940, score: 93 },
    { id: 110, name: "Dennis Ritchie", email: "dennis@arcana.dev", department: d.engineering, status: s.inactive, active: false, joinedAt: "2026-09-05", amount: 7310, score: 98 },
    { id: 111, name: "Frances Allen", email: "frances@arcana.dev", department: d.research, status: s.active, active: true, joinedAt: "2026-10-22", amount: 3120, score: 92 },
    { id: 112, name: "Tim Berners-Lee", email: "tim@arcana.dev", department: d.product, status: s.inReview, active: true, joinedAt: "2026-11-30", amount: 4760, score: 89 },
    ...makeGeneratedRows(msg)
  ];
}

const FIRST_NAMES = ["Alice", "Bruno", "Carla", "Diego", "Elisa", "Felipe", "Gabriela", "Hugo", "Iara", "João", "Karen", "Lucas", "Marina", "Nelson", "Olívia", "Paulo", "Quésia", "Rafael", "Sofia", "Tiago"];
const LAST_NAMES = ["Almeida", "Barros", "Cardoso", "Duarte", "Esteves", "Ferraz", "Gonçalves", "Hernandes", "Ibrahim", "Junqueira", "Klein", "Lima", "Moraes", "Nogueira", "Okamoto", "Pires", "Queiroz", "Rocha", "Silveira", "Tavares"];

/**
 * Deterministic filler rows (ids 113..260) so pagination, sticky header,
 * summarizer and filters are exercised with a realistic volume (150+ rows).
 */
function makeGeneratedRows(msg: Messages): DemoRow[] {
  const d = msg.demos.departments;
  const s = msg.demos.statuses;
  const departments = [d.engineering, d.research, d.product, d.editorial, d.infrastructure];
  const statuses = [s.active, s.active, s.inReview, s.active, s.inactive];
  const rows: DemoRow[] = [];
  for (let index = 0; index < 148; index++) {
    const first = FIRST_NAMES[index % FIRST_NAMES.length];
    const last = LAST_NAMES[(Math.floor(index / FIRST_NAMES.length) * 7 + index) % LAST_NAMES.length];
    const status = statuses[index % statuses.length];
    const month = (index % 12) + 1;
    const day = (index * 7) % 28 + 1;
    rows.push({
      id: 113 + index,
      name: `${first} ${last}`,
      email: `${first.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.${last.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@arcana.dev`,
      department: departments[index % departments.length],
      status,
      active: status !== s.inactive,
      joinedAt: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      amount: 900 + ((index * 517) % 8200),
      score: 70 + ((index * 13) % 30)
    });
  }
  return rows;
}

/** Demo data uses BRL amounts; only the formatting locale follows the active language. */
const currency = (value: unknown, locale: string) => Number(value).toLocaleString(locale, { style: "currency", currency: "BRL" });

const THEMES = ["zinc", "ocean", "forest", "midnight", "candy"] as const;

type MessageKey = keyof typeof ARCANA_MESSAGES.en;

/** Every `ArcanaMessages` key, in pack order — derived from the `en` pack, never hardcoded. */
const MESSAGE_KEYS = Object.keys(ARCANA_MESSAGES.en) as MessageKey[];

interface KnobState {
  rowsPerPage: number;
  emptyDataset: boolean;
  /** Per-key `messages` overrides; a missing key means "use the locale pack string". */
  messagesOverrides: Partial<Record<MessageKey, string>>;
  searchEnabled: boolean;
  orderByEnabled: boolean;
  checkboxEnabled: boolean;
  radioButtonSelectionEnabled: boolean;
  footerSummarizerEnabled: boolean;
  summarizeOnlyChecked: boolean;
  rowFocusEnabled: boolean;
  cellFocusEnabled: boolean;
  actionsEnabled: boolean;
  rowVirtualizationEnabled: boolean;
  columnVirtualizationEnabled: boolean;
  editingEnabled: boolean;
  editMode: "cell" | "row";
  rowReorderEnabled: boolean;
  columnVisibilityEnabled: boolean;
  persistColumnState: boolean;
  groupByDepartment: boolean;
  filterOperatorsEnabled: boolean;
  expandableRowsEnabled: boolean;
  expandRowOnClick: boolean;
  expandMode: "sync" | "async";
  customExpandLoading: boolean;
  stickyHeaderEnabled: boolean;
  columnResizeEnabled: boolean;
  columnReorderEnabled: boolean;
  pinColumns: boolean;
  height: "off" | "240" | "320" | "480";
  overflowEnabled: boolean;
  responsiveMode: "HORIZONTAL_OVERFLOW" | "VERTICAL_RECORD";
  footerVisible: boolean;
  isRowsPerPageVisible: boolean;
  calculateCellWidth: boolean;
  theme: string;
  /** "auto" follows the docs language; otherwise a fixed ArcanaLocale. */
  locale: string;
  codeOpen: boolean;
}

/* The library's real defaults — the generated code only emits what differs from this. */
const LIB_DEFAULTS = {
  rowsPerPage: 10,
  searchEnabled: true,
  orderByEnabled: true,
  checkboxEnabled: false,
  radioButtonSelectionEnabled: false,
  footerSummarizerEnabled: false,
  summarizeOnlyChecked: false,
  rowFocusEnabled: false,
  cellFocusEnabled: true,
  expandRowOnClick: false,
  stickyHeaderEnabled: false,
  columnResizeEnabled: true,
  columnReorderEnabled: true,
  overflowEnabled: false,
  responsiveMode: "HORIZONTAL_OVERFLOW",
  footerVisible: true,
  isRowsPerPageVisible: true,
  calculateCellWidth: false,
  theme: "zinc",
  locale: "pt-BR"
} as const;

const DEFAULT_STATE: KnobState = {
  rowsPerPage: 5,
  emptyDataset: false,
  messagesOverrides: {},
  searchEnabled: true,
  orderByEnabled: true,
  checkboxEnabled: false,
  radioButtonSelectionEnabled: false,
  footerSummarizerEnabled: false,
  summarizeOnlyChecked: false,
  rowFocusEnabled: false,
  cellFocusEnabled: true,
  actionsEnabled: false,
  rowVirtualizationEnabled: false,
  columnVirtualizationEnabled: false,
  editingEnabled: false,
  editMode: "cell",
  rowReorderEnabled: false,
  columnVisibilityEnabled: false,
  persistColumnState: false,
  groupByDepartment: false,
  filterOperatorsEnabled: false,
  expandableRowsEnabled: false,
  expandRowOnClick: false,
  expandMode: "sync",
  customExpandLoading: false,
  stickyHeaderEnabled: false,
  columnResizeEnabled: true,
  columnReorderEnabled: true,
  pinColumns: false,
  height: "off",
  overflowEnabled: false,
  responsiveMode: "HORIZONTAL_OVERFLOW",
  footerVisible: true,
  isRowsPerPageVisible: true,
  calculateCellWidth: false,
  theme: "zinc",
  locale: "auto",
  codeOpen: false
};

const STORAGE_KEY = "arcana-playground-state";

function loadState(): KnobState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<KnobState> & { messagesEmpty?: unknown };
    const merged: KnobState = { ...DEFAULT_STATE };
    (Object.keys(DEFAULT_STATE) as Array<keyof KnobState>).forEach((key) => {
      const value = parsed[key];
      if (value !== undefined && typeof value === typeof DEFAULT_STATE[key]) {
        (merged as unknown as Record<string, unknown>)[key] = value;
      }
    });
    if (![3, 5, 10, 25, 100, 250].includes(merged.rowsPerPage)) merged.rowsPerPage = DEFAULT_STATE.rowsPerPage;
    if (!["off", "240", "320", "480"].includes(merged.height)) merged.height = "off";
    if (!["sync", "async"].includes(merged.expandMode)) merged.expandMode = "sync";
    if (!["cell", "row"].includes(merged.editMode)) merged.editMode = "cell";
    if (!["HORIZONTAL_OVERFLOW", "VERTICAL_RECORD"].includes(merged.responsiveMode)) merged.responsiveMode = "HORIZONTAL_OVERFLOW";
    if (!THEMES.includes(merged.theme as (typeof THEMES)[number])) merged.theme = "zinc";
    if (merged.locale !== "auto" && !ARCANA_LOCALES.includes(merged.locale as ArcanaLocale)) merged.locale = "auto";
    if (merged.checkboxEnabled && merged.radioButtonSelectionEnabled) merged.radioButtonSelectionEnabled = false;
    // `messages` overrides: keep only known pack keys with string values.
    const overrides: Partial<Record<MessageKey, string>> = {};
    const rawOverrides = (parsed as Record<string, unknown>).messagesOverrides;
    if (rawOverrides && typeof rawOverrides === "object" && !Array.isArray(rawOverrides)) {
      Object.entries(rawOverrides as Record<string, unknown>).forEach(([key, value]) => {
        if (MESSAGE_KEYS.includes(key as MessageKey) && typeof value === "string" && value !== "") overrides[key as MessageKey] = value;
      });
    }
    // Migration: the old dedicated `messages.empty` knob becomes a regular override.
    if (typeof parsed.messagesEmpty === "string" && parsed.messagesEmpty !== "" && overrides.empty === undefined) overrides.empty = parsed.messagesEmpty;
    merged.messagesOverrides = overrides;
    return merged;
  } catch {
    return DEFAULT_STATE;
  }
}

function makeColumns(msg: Messages, advanced?: { editing: boolean; filterOperators: boolean }): DataTableColumn<DemoRow>[] {
  const locale = msg.meta.locale;
  const areas = [
    msg.demos.departments.engineering,
    msg.demos.departments.research,
    msg.demos.departments.product,
    msg.demos.departments.editorial,
    msg.demos.departments.infrastructure
  ];
  return [
    { name: "name", label: msg.demos.cols.name, editable: advanced?.editing, filterOperators: advanced?.filterOperators ? ["contains", "startsWith", "endsWith", "equals", "notEquals"] : undefined },
    { name: "email", label: msg.demos.cols.email, searchEnabled: false, width: 200 },
    { name: "department", label: msg.demos.cols.area, editable: advanced?.editing, searchType: "LIST", searchConfig: () => areas.map((value) => ({ value, label: value })) },
    { name: "status", label: msg.demos.cols.status },
    { name: "joinedAt", label: msg.demos.cols.joinedAt, searchType: "DATE", valueGetter: (value) => new Date(`${value}T12:00:00`).toLocaleDateString(locale) },
    { name: "amount", label: msg.demos.cols.amount, type: "CURRENCY", editable: advanced?.editing, aggregation: "sum", textAlignment: "right", searchEnabled: advanced?.filterOperators, filterOperators: advanced?.filterOperators ? ["equals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"] : undefined, valueGetter: (value) => currency(value, locale) },
    { name: "score", label: msg.demos.cols.score, type: "NUMBER", editable: advanced?.editing, aggregation: "average", textAlignment: "right", searchEnabled: advanced?.filterOperators, filterOperators: advanced?.filterOperators ? ["equals", "greaterThan", "lessThan"] : undefined }
  ];
}

function ExpandCard({ row, msg }: { row: DemoRow; msg: Messages }) {
  return <div className="expand-card">
    <div className="expand-card__title"><strong>{row.name}</strong><span>{row.status}</span></div>
    <dl className="expand-card__grid">
      <div><dt>{msg.demos.card.email}</dt><dd>{row.email}</dd></div>
      <div><dt>{msg.demos.card.area}</dt><dd>{row.department}</dd></div>
      <div><dt>{msg.demos.card.score}</dt><dd>{row.score} {msg.demos.card.pts}</dd></div>
      <div><dt>{msg.demos.card.joined}</dt><dd>{new Date(`${row.joinedAt}T12:00:00`).toLocaleDateString(msg.meta.locale)}</dd></div>
    </dl>
  </div>;
}

/** Override keys carrying a non-empty value, in pack order (a freshly added row holds ""). */
function activeOverrideKeys(overrides: Partial<Record<MessageKey, string>>): MessageKey[] {
  return MESSAGE_KEYS.filter((key) => (overrides[key] ?? "") !== "");
}

/* ---------- Generated code (code is always English) ---------- */

type SnippetVariant = "react" | "vue" | "html";

function rendererLines(state: KnobState, variant: SnippetVariant): string[] {
  const lines: string[] = [];
  if (state.expandMode === "sync") {
    if (variant === "react") lines.push("expandedRowRenderer: row => <PersonCard person={row} />,");
    else if (variant === "vue") lines.push("expandedRowRenderer: row => h(PersonCard, { person: row }),");
    else lines.push("expandedRowRenderer: row => `<section class=\"person-card\">…details for ${row.name}…</section>`,");
  } else {
    lines.push("expandedRowRenderer: async row => {");
    lines.push("  const details = await api.people.details(row.id) // ~700ms");
    if (variant === "react") lines.push("  return <PersonCard person={row} details={details} />");
    else if (variant === "vue") lines.push("  return h(PersonCard, { person: row, details })");
    else lines.push("  return `<section class=\"person-card\">…details for ${row.name}…</section>`");
    lines.push("},");
  }
  if (state.customExpandLoading) {
    if (variant === "react") lines.push("expandedRowLoadingRenderer: row => <Skeleton label={`Preparing ${row.name}…`} />,");
    else if (variant === "vue") lines.push("expandedRowLoadingRenderer: row => h(Skeleton, { label: `Preparing ${row.name}…` }),");
    else lines.push("expandedRowLoadingRenderer: row => `<em>Preparing ${row.name}…</em>`,");
  }
  return lines;
}

function configLines(state: KnobState, variant: SnippetVariant, effectiveLocale: string): string[] {
  const lines: string[] = ["mode: 'dataset',"];
  lines.push(state.emptyDataset ? "dataset: [], // empty dataset" : "dataset: rows,");
  if (state.rowsPerPage !== LIB_DEFAULTS.rowsPerPage) lines.push(`rowsPerPage: ${state.rowsPerPage},`);
  const overrideKeys = activeOverrideKeys(state.messagesOverrides);
  if (overrideKeys.length > 0) {
    const quote = (value: string) => `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
    lines.push(`messages: { ${overrideKeys.map((key) => `${key}: ${quote(state.messagesOverrides[key] as string)}`).join(", ")} },`);
  }
  if (state.theme !== LIB_DEFAULTS.theme) lines.push(`theme: '${state.theme}',`);
  if (effectiveLocale !== LIB_DEFAULTS.locale) lines.push(`locale: '${effectiveLocale}',`);
  if (!state.searchEnabled) lines.push("searchEnabled: false,");
  if (!state.orderByEnabled) lines.push("orderByEnabled: false,");
  if (state.checkboxEnabled) lines.push("checkboxEnabled: true,");
  if (state.radioButtonSelectionEnabled) {
    lines.push("radioButtonSelectionEnabled: true,");
    lines.push("uniqueKeyIdentifier: 'id',");
  }
  if (state.footerSummarizerEnabled) lines.push("footerSummarizerEnabled: true,");
  if (state.summarizeOnlyChecked) lines.push("summarizeOnlyChecked: true,");
  if (state.rowFocusEnabled) lines.push("rowFocusEnabled: true,");
  if (!state.cellFocusEnabled) lines.push("cellFocusEnabled: false,");
  if (state.actionsEnabled) {
    if (variant === "react") lines.push("actions: [{ element: row => <button onClick={() => open(row)}>Open</button> }],");
    else if (variant === "vue") lines.push("actions: [{ element: row => h('button', { onClick: () => open(row) }, 'Open') }],");
    else lines.push("actions: [{ element: row => '<button>Open</button>' }],");
  }
  if (state.rowVirtualizationEnabled) {
    lines.push("rowVirtualizationEnabled: true,");
    lines.push("height: 320, // fixed viewport for the virtualizer");
  }
  if (state.columnVirtualizationEnabled) {
    lines.push("columnVirtualizationEnabled: true,");
    lines.push("virtualColumnWidth: 160,");
  }
  if (state.editingEnabled) {
    lines.push("editingEnabled: true,");
    if (state.editMode === "row") lines.push("editMode: 'row',");
    lines.push("onCellEdit: (value, column, row) => api.people.update(row.id, { [column.name]: value }),");
  }
  if (state.rowReorderEnabled) lines.push("rowReorderEnabled: true,");
  if (state.columnVisibilityEnabled) lines.push("columnVisibilityEnabled: true,");
  if (state.persistColumnState) lines.push("columnStateStorageKey: 'people-grid-layout',");
  if (state.groupByDepartment) lines.push("groupBy: ['department'], // columns may declare aggregation: 'sum' | 'average' | …");
  if (state.filterOperatorsEnabled) lines.push("// columns may declare filterOperators: ['contains', 'equals', 'greaterThan', …]");
  if (state.expandableRowsEnabled) {
    lines.push("expandableRowsEnabled: true,");
    if (state.expandRowOnClick) lines.push("expandRowOnClick: true,");
    lines.push(...rendererLines(state, variant));
  }
  if (state.stickyHeaderEnabled) lines.push("stickyHeaderEnabled: true,");
  if (!state.columnResizeEnabled) lines.push("columnResizeEnabled: false,");
  if (!state.columnReorderEnabled) lines.push("columnReorderEnabled: false,");
  if (state.height !== "off") lines.push(`height: ${state.height},`);
  if (state.overflowEnabled) lines.push("overflowEnabled: true,");
  if (state.responsiveMode !== LIB_DEFAULTS.responsiveMode) lines.push("responsiveMode: 'VERTICAL_RECORD',");
  if (!state.footerVisible) lines.push("footerVisible: false,");
  if (!state.isRowsPerPageVisible) lines.push("isRowsPerPageVisible: false,");
  if (state.calculateCellWidth) lines.push("calculateCellWidth: true,");
  if (state.pinColumns) lines.push("// pinned: 'left' on the first column, pinned: 'right' on the last");
  lines.push("columns");
  return lines;
}

const SNIPPET_FILE: Record<Framework, string> = {
  react: "Playground.tsx",
  vue: "Playground.vue",
  angular: "playground.component.ts",
  svelte: "Playground.svelte"
};

/* ---------- Controls (dense inspector) ---------- */

/**
 * One compact `label | control` line of the inspector sidebar.
 * `modified` lights the indigo dot (value differs from DEFAULT_STATE) and the
 * ⓘ button reveals the knob description as an accessible tooltip.
 */
function Row({ k, label, desc, modified, disabled, infoAria, children }: {
  k: string;
  label: string;
  desc: string;
  modified: boolean;
  disabled?: boolean;
  infoAria: string;
  children: ReactNode;
}) {
  const tipId = `pg-tip-${k}`;
  return <div className={`pg-row${modified ? " is-mod" : ""}${disabled ? " is-disabled" : ""}`}>
    <span className="pg-row-label">
      <span className="pg-row-name">{label}</span>
      <button type="button" className="pg-info" aria-label={fmt(infoAria, { label })} aria-describedby={tipId}>i</button>
      <span role="tooltip" id={tipId} className="pg-tip">{desc}</span>
    </span>
    {children}
  </div>;
}

function MiniSwitch({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled?: boolean; onChange: (value: boolean) => void }) {
  return <label className="pg-sw">
    <input type="checkbox" role="switch" aria-label={label} checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    <span className="pg-sw-track" aria-hidden="true" />
  </label>;
}

function Section({ title }: { title: string }) {
  return <h3 className="pg-sec">{title}</h3>;
}

const ADVANCED_PLAYGROUND: Record<string, { group: string; virtual: string; colVirtual: string; editing: string; editMode: string; rowReorder: string; visibility: string; persist: string; grouping: string; operators: string }> = {
  en: { group: "Advanced", virtual: "Render only the visible row window for large pages.", colVirtual: "Render only the horizontally visible column window.", editing: "Edit cells or full rows by double-clicking.", editMode: "Choose cell or row editing.", rowReorder: "Drag rows to change their dataset order.", visibility: "Show the built-in column chooser.", persist: "Persist column order, pinning and visibility.", grouping: "Group by department and show amount/score aggregates.", operators: "Expose contains, equality and numeric comparison operators." },
  "pt-BR": { group: "Avançado", virtual: "Renderiza apenas a janela de linhas visível em páginas grandes.", colVirtual: "Renderiza apenas a janela horizontal de colunas visível.", editing: "Edita células ou linhas completas com duplo clique.", editMode: "Escolhe edição por célula ou linha.", rowReorder: "Arraste linhas para mudar a ordem do dataset.", visibility: "Exibe o seletor nativo de colunas.", persist: "Persiste ordem, fixação e visibilidade das colunas.", grouping: "Agrupa por área e mostra agregados de valor/pontuação.", operators: "Expõe contém, igualdade e comparações numéricas." },
  es: { group: "Avanzado", virtual: "Renderiza solo la ventana de filas visible.", colVirtual: "Renderiza solo la ventana horizontal de columnas.", editing: "Edita celdas o filas completas con doble clic.", editMode: "Elige edición por celda o fila.", rowReorder: "Arrastra filas para cambiar el orden.", visibility: "Muestra el selector de columnas.", persist: "Guarda orden, fijación y visibilidad.", grouping: "Agrupa por área y muestra agregados.", operators: "Expone operadores de texto y numéricos." },
  it: { group: "Avanzato", virtual: "Renderizza solo la finestra di righe visibile.", colVirtual: "Renderizza solo la finestra orizzontale di colonne.", editing: "Modifica celle o righe con doppio clic.", editMode: "Scegli modifica per cella o riga.", rowReorder: "Trascina le righe per riordinarle.", visibility: "Mostra il selettore di colonne.", persist: "Salva ordine, blocco e visibilità.", grouping: "Raggruppa per area e mostra aggregati.", operators: "Espone operatori testuali e numerici." },
  zh: { group: "高级", virtual: "大型页面仅渲染可见行窗口。", colVirtual: "仅渲染水平可见的列窗口。", editing: "双击编辑单元格或整行。", editMode: "选择单元格或行编辑。", rowReorder: "拖动行以更改顺序。", visibility: "显示内置列选择器。", persist: "保存列顺序、固定和可见性。", grouping: "按部门分组并显示聚合值。", operators: "提供文本和数字筛选运算符。" },
  ja: { group: "高度な機能", virtual: "大きなページでは表示中の行だけを描画します。", colVirtual: "横方向に表示中の列だけを描画します。", editing: "ダブルクリックでセルまたは行を編集します。", editMode: "セル編集か行編集を選択します。", rowReorder: "行をドラッグして並べ替えます。", visibility: "列セレクターを表示します。", persist: "列順・固定・表示状態を保存します。", grouping: "部門でグループ化し集計を表示します。", operators: "文字列・数値フィルター演算子を公開します。" },
  de: { group: "Erweitert", virtual: "Rendert bei großen Seiten nur sichtbare Zeilen.", colVirtual: "Rendert nur das horizontal sichtbare Spaltenfenster.", editing: "Zellen oder ganze Zeilen per Doppelklick bearbeiten.", editMode: "Zell- oder Zeilenbearbeitung wählen.", rowReorder: "Zeilen per Drag-and-drop sortieren.", visibility: "Integrierte Spaltenauswahl anzeigen.", persist: "Reihenfolge, Fixierung und Sichtbarkeit speichern.", grouping: "Nach Bereich gruppieren und Aggregate zeigen.", operators: "Text- und Zahlenoperatoren anbieten." },
  ru: { group: "Расширенные", virtual: "Отрисовывает только видимое окно строк.", colVirtual: "Отрисовывает только видимое окно столбцов.", editing: "Редактирует ячейки или строки двойным щелчком.", editMode: "Выбор режима ячейки или строки.", rowReorder: "Перетаскивание строк для изменения порядка.", visibility: "Показывает выбор столбцов.", persist: "Сохраняет порядок, закрепление и видимость.", grouping: "Группирует по отделу и показывает агрегаты.", operators: "Добавляет текстовые и числовые операторы." }
};

export function Playground({ framework, panelOpen }: { framework: Framework; panelOpen: boolean }) {
  const { lang, msg } = useLang();
  const [state, setState] = useState<KnobState>(loadState);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private mode */
    }
  }, [state]);

  const update = (patch: Partial<KnobState>) => setState((prev) => {
    const next = { ...prev, ...patch };
    // Multiple and single selection are mutually exclusive.
    if (patch.checkboxEnabled) next.radioButtonSelectionEnabled = false;
    if (patch.radioButtonSelectionEnabled) next.checkboxEnabled = false;
    return next;
  });

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode */
    }
    setState(DEFAULT_STATE);
    setLastEvent(null);
  };

  const rows = useMemo(() => makeRows(msg), [msg]);
  const playgroundColumns = useMemo(() => makeColumns(msg, { editing: state.editingEnabled, filterOperators: state.filterOperatorsEnabled }), [msg, state.editingEnabled, state.filterOperatorsEnabled]);
  // "auto" follows the docs language (which maps 1:1 onto the library locales).
  const effectiveLocale: ArcanaLocale = state.locale === "auto" ? (lang as ArcanaLocale) : (state.locale as ArcanaLocale);

  const config = useMemo<DataTableConfig<DemoRow>>(() => {
    const columns = state.pinColumns
      ? playgroundColumns.map((col, index) =>
        index === 0
          ? { ...col, pinned: "left" as const }
          : index === playgroundColumns.length - 1
            ? { ...col, pinned: "right" as const }
            : col)
      : playgroundColumns;
    const cfg: DataTableConfig<DemoRow> = {
      mode: "dataset",
      dataset: state.emptyDataset ? [] : rows,
      rowsPerPage: state.rowsPerPage,
      theme: state.theme,
      locale: effectiveLocale,
      ariaLabel: msg.playground.tableAria,
      searchEnabled: state.searchEnabled,
      orderByEnabled: state.orderByEnabled,
      checkboxEnabled: state.checkboxEnabled,
      radioButtonSelectionEnabled: state.radioButtonSelectionEnabled,
      footerSummarizerEnabled: state.footerSummarizerEnabled,
      summarizeOnlyChecked: state.summarizeOnlyChecked,
      rowFocusEnabled: state.rowFocusEnabled,
      cellFocusEnabled: state.cellFocusEnabled,
      stickyHeaderEnabled: state.stickyHeaderEnabled,
      columnResizeEnabled: state.columnResizeEnabled,
      columnReorderEnabled: state.columnReorderEnabled,
      rowVirtualizationEnabled: state.rowVirtualizationEnabled,
      columnVirtualizationEnabled: state.columnVirtualizationEnabled,
      virtualRowHeight: 42,
      editingEnabled: state.editingEnabled,
      editMode: state.editMode,
      rowReorderEnabled: state.rowReorderEnabled,
      columnVisibilityEnabled: state.columnVisibilityEnabled,
      columnStateStorageKey: state.persistColumnState ? "arcana-playground-columns" : undefined,
      groupBy: state.groupByDepartment ? ["department"] : undefined,
      overflowEnabled: state.overflowEnabled,
      responsiveMode: state.responsiveMode,
      footerVisible: state.footerVisible,
      isRowsPerPageVisible: state.isRowsPerPageVisible,
      calculateCellWidth: state.calculateCellWidth,
      columns
    };
    const overrideKeys = activeOverrideKeys(state.messagesOverrides);
    if (overrideKeys.length > 0) {
      const messages: Partial<Record<MessageKey, string>> = {};
      overrideKeys.forEach((key) => { messages[key] = state.messagesOverrides[key]; });
      cfg.messages = messages;
    }
    if (state.radioButtonSelectionEnabled) cfg.uniqueKeyIdentifier = "id";
    if (state.height !== "off") cfg.height = Number(state.height);
    else if (state.rowVirtualizationEnabled) cfg.height = 320;
    if (state.actionsEnabled) {
      cfg.actionsWidth = 90;
      cfg.actions = [{
        element: (row) => <button className="row-action" type="button" onClick={(click) => { click.stopPropagation(); setLastEvent(fmt(msg.playground.openEvent, { name: row.name })); }}>{msg.playground.openAction}</button>
      }];
    }
    if (state.expandableRowsEnabled) {
      cfg.expandableRowsEnabled = true;
      cfg.expandRowOnClick = state.expandRowOnClick;
      cfg.expandedRowRenderer = state.expandMode === "sync"
        ? (row) => <ExpandCard row={row} msg={msg} />
        : async (row) => {
          await new Promise((resolve) => setTimeout(resolve, 700)); // simulates an API
          return <ExpandCard row={row} msg={msg} />;
        };
      if (state.customExpandLoading) {
        cfg.expandedRowLoadingRenderer = (row) => <div className="pg-custom-loading">{fmt(msg.playground.customLoadingText, { name: row.name })}</div>;
      }
    }
    return cfg;
  }, [state, msg, rows, playgroundColumns, effectiveLocale]);

  const generatedCode = useMemo(() => {
    const pair = codePair(configLines(state, "react", effectiveLocale), configLines(state, "vue", effectiveLocale), configLines(state, "html", effectiveLocale), configLines(state, "html", effectiveLocale));
    return pair[framework];
  }, [state, framework, effectiveLocale]);

  /** Indigo dot: the knob's value differs from the playground default. */
  const changed = (key: keyof KnobState) => state[key] !== DEFAULT_STATE[key];
  /** Every override with a row in the sidebar (including freshly added, still-empty ones), pack order. */
  const overrideRowKeys = MESSAGE_KEYS.filter((key) => state.messagesOverrides[key] !== undefined);
  const removeOverride = (key: MessageKey) => setState((prev) => {
    const next = { ...prev.messagesOverrides };
    delete next[key];
    return { ...prev, messagesOverrides: next };
  });
  const hints = msg.playground.hints;
  const advanced = ADVANCED_PLAYGROUND[lang] ?? ADVANCED_PLAYGROUND.en;
  const infoAria = msg.playground.infoAria;

  return <div className="playground">
    <aside className={panelOpen ? "pg-sidebar is-open" : "pg-sidebar"} id="playground-panel" aria-label={msg.playground.panelAria}>
      <div className="pg-side-head">
        <span className="pg-side-title">{msg.playground.settings}</span>
        <button className="pg-reset" type="button" onClick={reset}>{msg.playground.reset}</button>
      </div>

      <div className="pg-inspector">
        <Section title={msg.playground.groupData} />
        <Row k="rowsPerPage" label="rowsPerPage" desc={hints.rowsPerPage} modified={changed("rowsPerPage")} infoAria={infoAria}>
          <select className="pg-select" aria-label="rowsPerPage" value={state.rowsPerPage} onChange={(event) => update({ rowsPerPage: Number(event.target.value) })}>
            {[3, 5, 10, 25, 100, 250].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </Row>
        <Row k="emptyDataset" label={msg.playground.emptyDataset} desc={msg.playground.emptyDatasetHint} modified={changed("emptyDataset")} infoAria={infoAria}>
          <MiniSwitch label={msg.playground.emptyDataset} checked={state.emptyDataset} onChange={(value) => update({ emptyDataset: value })} />
        </Row>

        <Section title={msg.playground.groupFeatures} />
        <Row k="searchEnabled" label="searchEnabled" desc={hints.searchEnabled} modified={changed("searchEnabled")} infoAria={infoAria}>
          <MiniSwitch label="searchEnabled" checked={state.searchEnabled} onChange={(value) => update({ searchEnabled: value })} />
        </Row>
        <Row k="orderByEnabled" label="orderByEnabled" desc={hints.orderByEnabled} modified={changed("orderByEnabled")} infoAria={infoAria}>
          <MiniSwitch label="orderByEnabled" checked={state.orderByEnabled} onChange={(value) => update({ orderByEnabled: value })} />
        </Row>
        <Row k="checkboxEnabled" label="checkboxEnabled" desc={msg.playground.checkboxHint} modified={changed("checkboxEnabled")} infoAria={infoAria}>
          <MiniSwitch label="checkboxEnabled" checked={state.checkboxEnabled} onChange={(value) => update({ checkboxEnabled: value })} />
        </Row>
        <Row k="radioButtonSelectionEnabled" label="radioButtonSelectionEnabled" desc={msg.playground.radioHint} modified={changed("radioButtonSelectionEnabled")} infoAria={infoAria}>
          <MiniSwitch label="radioButtonSelectionEnabled" checked={state.radioButtonSelectionEnabled} onChange={(value) => update({ radioButtonSelectionEnabled: value })} />
        </Row>
        <Row k="footerSummarizerEnabled" label="footerSummarizerEnabled" desc={hints.footerSummarizerEnabled} modified={changed("footerSummarizerEnabled")} infoAria={infoAria}>
          <MiniSwitch label="footerSummarizerEnabled" checked={state.footerSummarizerEnabled} onChange={(value) => update({ footerSummarizerEnabled: value })} />
        </Row>
        <Row k="summarizeOnlyChecked" label="summarizeOnlyChecked" desc={hints.summarizeOnlyChecked} modified={changed("summarizeOnlyChecked")} disabled={!state.footerSummarizerEnabled} infoAria={infoAria}>
          <MiniSwitch label="summarizeOnlyChecked" disabled={!state.footerSummarizerEnabled} checked={state.summarizeOnlyChecked} onChange={(value) => update({ summarizeOnlyChecked: value })} />
        </Row>
        <Row k="rowFocusEnabled" label="rowFocusEnabled" desc={hints.rowFocusEnabled} modified={changed("rowFocusEnabled")} infoAria={infoAria}>
          <MiniSwitch label="rowFocusEnabled" checked={state.rowFocusEnabled} onChange={(value) => update({ rowFocusEnabled: value })} />
        </Row>
        <Row k="cellFocusEnabled" label="cellFocusEnabled" desc={hints.cellFocusEnabled} modified={changed("cellFocusEnabled")} infoAria={infoAria}>
          <MiniSwitch label="cellFocusEnabled" checked={state.cellFocusEnabled} onChange={(value) => update({ cellFocusEnabled: value })} />
        </Row>
        <Row k="actions" label="actions" desc={msg.playground.actionsHint} modified={changed("actionsEnabled")} infoAria={infoAria}>
          <MiniSwitch label="actions" checked={state.actionsEnabled} onChange={(value) => update({ actionsEnabled: value })} />
        </Row>

        <Section title={advanced.group} />
        <Row k="rowVirtualizationEnabled" label="rowVirtualizationEnabled" desc={advanced.virtual} modified={changed("rowVirtualizationEnabled")} infoAria={infoAria}>
          <MiniSwitch label="rowVirtualizationEnabled" checked={state.rowVirtualizationEnabled} onChange={(value) => update({ rowVirtualizationEnabled: value, rowsPerPage: value ? 100 : state.rowsPerPage })} />
        </Row>
        <Row k="columnVirtualizationEnabled" label="columnVirtualizationEnabled" desc={advanced.colVirtual} modified={changed("columnVirtualizationEnabled")} infoAria={infoAria}>
          <MiniSwitch label="columnVirtualizationEnabled" checked={state.columnVirtualizationEnabled} onChange={(value) => update({ columnVirtualizationEnabled: value })} />
        </Row>
        <Row k="editingEnabled" label="editingEnabled" desc={advanced.editing} modified={changed("editingEnabled")} infoAria={infoAria}>
          <MiniSwitch label="editingEnabled" checked={state.editingEnabled} onChange={(value) => update({ editingEnabled: value })} />
        </Row>
        <Row k="editMode" label="editMode" desc={advanced.editMode} modified={changed("editMode")} disabled={!state.editingEnabled} infoAria={infoAria}>
          <select className="pg-select" aria-label="editMode" disabled={!state.editingEnabled} value={state.editMode} onChange={(event) => update({ editMode: event.target.value as KnobState["editMode"] })}><option value="cell">cell</option><option value="row">row</option></select>
        </Row>
        <Row k="rowReorderEnabled" label="rowReorderEnabled" desc={advanced.rowReorder} modified={changed("rowReorderEnabled")} infoAria={infoAria}>
          <MiniSwitch label="rowReorderEnabled" checked={state.rowReorderEnabled} onChange={(value) => update({ rowReorderEnabled: value })} />
        </Row>
        <Row k="columnVisibilityEnabled" label="columnVisibilityEnabled" desc={advanced.visibility} modified={changed("columnVisibilityEnabled")} infoAria={infoAria}>
          <MiniSwitch label="columnVisibilityEnabled" checked={state.columnVisibilityEnabled} onChange={(value) => update({ columnVisibilityEnabled: value })} />
        </Row>
        <Row k="persistColumnState" label="columnStateStorageKey" desc={advanced.persist} modified={changed("persistColumnState")} disabled={!state.columnVisibilityEnabled} infoAria={infoAria}>
          <MiniSwitch label="columnStateStorageKey" disabled={!state.columnVisibilityEnabled} checked={state.persistColumnState} onChange={(value) => update({ persistColumnState: value })} />
        </Row>
        <Row k="groupByDepartment" label="groupBy" desc={advanced.grouping} modified={changed("groupByDepartment")} infoAria={infoAria}>
          <MiniSwitch label="groupBy" checked={state.groupByDepartment} onChange={(value) => update({ groupByDepartment: value })} />
        </Row>
        <Row k="filterOperatorsEnabled" label="filterOperators" desc={advanced.operators} modified={changed("filterOperatorsEnabled")} infoAria={infoAria}>
          <MiniSwitch label="filterOperators" checked={state.filterOperatorsEnabled} onChange={(value) => update({ filterOperatorsEnabled: value })} />
        </Row>

        <Section title={msg.playground.groupExpandable} />
        <Row k="expandableRowsEnabled" label="expandableRowsEnabled" desc={hints.expandableRowsEnabled} modified={changed("expandableRowsEnabled")} infoAria={infoAria}>
          <MiniSwitch label="expandableRowsEnabled" checked={state.expandableRowsEnabled} onChange={(value) => update({ expandableRowsEnabled: value })} />
        </Row>
        <Row k="expandRowOnClick" label="expandRowOnClick" desc={hints.expandRowOnClick} modified={changed("expandRowOnClick")} disabled={!state.expandableRowsEnabled} infoAria={infoAria}>
          <MiniSwitch label="expandRowOnClick" disabled={!state.expandableRowsEnabled} checked={state.expandRowOnClick} onChange={(value) => update({ expandRowOnClick: value })} />
        </Row>
        <Row k="expandMode" label={msg.playground.renderer} desc={hints.renderer} modified={changed("expandMode")} disabled={!state.expandableRowsEnabled} infoAria={infoAria}>
          <select className="pg-select" aria-label={msg.playground.renderer} disabled={!state.expandableRowsEnabled} value={state.expandMode} onChange={(event) => update({ expandMode: event.target.value as KnobState["expandMode"] })}>
            <option value="sync">{msg.playground.rendererSync}</option>
            <option value="async">{msg.playground.rendererAsync}</option>
          </select>
        </Row>
        <Row k="customExpandLoading" label={msg.playground.customLoading} desc={hints.customLoading} modified={changed("customExpandLoading")} disabled={!state.expandableRowsEnabled || state.expandMode !== "async"} infoAria={infoAria}>
          <MiniSwitch label={msg.playground.customLoading} disabled={!state.expandableRowsEnabled || state.expandMode !== "async"} checked={state.customExpandLoading} onChange={(value) => update({ customExpandLoading: value })} />
        </Row>

        <Section title={msg.playground.groupLayout} />
        <Row k="stickyHeaderEnabled" label="stickyHeaderEnabled" desc={hints.stickyHeaderEnabled} modified={changed("stickyHeaderEnabled")} infoAria={infoAria}>
          <MiniSwitch label="stickyHeaderEnabled" checked={state.stickyHeaderEnabled} onChange={(value) => update({ stickyHeaderEnabled: value })} />
        </Row>
        <Row k="columnResizeEnabled" label="columnResizeEnabled" desc={hints.columnResizeEnabled} modified={changed("columnResizeEnabled")} infoAria={infoAria}>
          <MiniSwitch label="columnResizeEnabled" checked={state.columnResizeEnabled} onChange={(value) => update({ columnResizeEnabled: value })} />
        </Row>
        <Row k="columnReorderEnabled" label="columnReorderEnabled" desc={hints.columnReorderEnabled} modified={changed("columnReorderEnabled")} infoAria={infoAria}>
          <MiniSwitch label="columnReorderEnabled" checked={state.columnReorderEnabled} onChange={(value) => update({ columnReorderEnabled: value })} />
        </Row>
        <Row k="pinColumns" label="pinned" desc={hints.pinColumns} modified={changed("pinColumns")} infoAria={infoAria}>
          <MiniSwitch label="pinned" checked={state.pinColumns} onChange={(value) => update({ pinColumns: value })} />
        </Row>
        <Row k="height" label="height" desc={msg.playground.heightHint} modified={changed("height")} infoAria={infoAria}>
          <select className="pg-select" aria-label="height" value={state.height} onChange={(event) => update({ height: event.target.value as KnobState["height"] })}>
            <option value="off">off</option>
            <option value="240">240</option>
            <option value="320">320</option>
            <option value="480">480</option>
          </select>
        </Row>
        <Row k="overflowEnabled" label="overflowEnabled" desc={hints.overflowEnabled} modified={changed("overflowEnabled")} infoAria={infoAria}>
          <MiniSwitch label="overflowEnabled" checked={state.overflowEnabled} onChange={(value) => update({ overflowEnabled: value })} />
        </Row>
        <Row k="responsiveMode" label="responsiveMode" desc={hints.responsiveMode} modified={changed("responsiveMode")} infoAria={infoAria}>
          <select className="pg-select" aria-label="responsiveMode" value={state.responsiveMode} onChange={(event) => update({ responsiveMode: event.target.value as KnobState["responsiveMode"] })}>
            <option value="HORIZONTAL_OVERFLOW">HORIZONTAL_OVERFLOW</option>
            <option value="VERTICAL_RECORD">VERTICAL_RECORD</option>
          </select>
        </Row>
        <Row k="footerVisible" label="footerVisible" desc={hints.footerVisible} modified={changed("footerVisible")} infoAria={infoAria}>
          <MiniSwitch label="footerVisible" checked={state.footerVisible} onChange={(value) => update({ footerVisible: value })} />
        </Row>
        <Row k="isRowsPerPageVisible" label="isRowsPerPageVisible" desc={hints.isRowsPerPageVisible} modified={changed("isRowsPerPageVisible")} disabled={!state.footerVisible} infoAria={infoAria}>
          <MiniSwitch label="isRowsPerPageVisible" disabled={!state.footerVisible} checked={state.isRowsPerPageVisible} onChange={(value) => update({ isRowsPerPageVisible: value })} />
        </Row>
        <Row k="calculateCellWidth" label="calculateCellWidth" desc={hints.calculateCellWidth} modified={changed("calculateCellWidth")} infoAria={infoAria}>
          <MiniSwitch label="calculateCellWidth" checked={state.calculateCellWidth} onChange={(value) => update({ calculateCellWidth: value })} />
        </Row>

        <Section title={msg.playground.groupTheme} />
        <Row k="theme" label="theme" desc={hints.theme} modified={changed("theme")} infoAria={infoAria}>
          <div className="pg-theme-dots" role="group" aria-label={msg.playground.themePickerAria}>
            {THEMES.map((name) => (
              <button key={name} type="button" className="pg-theme-pick" aria-pressed={state.theme === name} aria-label={name} title={name} onClick={() => update({ theme: name })}>
                <span className={`theme-dot theme-dot--${name}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </Row>

        <Section title={msg.playground.groupLocalization} />
        <Row k="locale" label="locale" desc={hints.locale} modified={changed("locale")} infoAria={infoAria}>
          <select className="pg-select" aria-label="locale" value={state.locale} onChange={(event) => update({ locale: event.target.value })}>
            <option value="auto">{msg.playground.localeAuto}</option>
            {ARCANA_LOCALES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </Row>
        <Row k="messages" label="messages" desc={hints.messages} modified={overrideRowKeys.length > 0} infoAria={infoAria}>
          <select
            className="pg-select"
            aria-label={msg.playground.addOverride}
            value=""
            onChange={(event) => {
              const key = event.target.value as MessageKey;
              if (key) update({ messagesOverrides: { ...state.messagesOverrides, [key]: "" } });
            }}
          >
            <option value="">{`+ ${msg.playground.addOverride}`}</option>
            {MESSAGE_KEYS.filter((key) => state.messagesOverrides[key] === undefined).map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
        </Row>
        {overrideRowKeys.map((key) => (
          <div key={key} className="pg-row pg-msg-row is-mod">
            <span className="pg-row-label"><span className="pg-row-name pg-msg-key">{key}</span></span>
            <span className="pg-msg-ctl">
              <input
                className="pg-input pg-msg-input"
                type="text"
                aria-label={key}
                placeholder={ARCANA_MESSAGES[effectiveLocale][key]}
                value={state.messagesOverrides[key] ?? ""}
                onChange={(event) => update({ messagesOverrides: { ...state.messagesOverrides, [key]: event.target.value } })}
                onBlur={(event) => { if (event.target.value.trim() === "") removeOverride(key); }}
              />
              <button type="button" className="pg-msg-remove" aria-label={fmt(msg.playground.removeOverride, { key })} onClick={() => removeOverride(key)}>✕</button>
            </span>
          </div>
        ))}
      </div>
    </aside>

    <div className="pg-main">
      <div className="section-workbench pg-workbench">
        <div className="section-workbench-header">
          <span className="section-preview-caption">{msg.playground.stageCaption}</span>
          {state.actionsEnabled && !state.codeOpen ? <span className="pg-event" role="status">{lastEvent ?? msg.playground.initialEvent}</span> : null}
          <div className="section-seg" role="tablist" aria-label={msg.playground.generatedCode}>
            <button
              id="pg-preview-tab"
              type="button"
              role="tab"
              aria-selected={!state.codeOpen}
              aria-controls="pg-panel"
              onClick={() => update({ codeOpen: false })}
            >
              <svg className="seg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              {msg.shell.previewTab}
            </button>
            <button
              id="pg-code-tab"
              type="button"
              role="tab"
              aria-selected={state.codeOpen}
              aria-controls="pg-panel"
              onClick={() => update({ codeOpen: true })}
            >
              <svg className="seg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              {msg.shell.codeTab}
              <span className="seg-fw-badge">{FW_BADGE[framework]}</span>
            </button>
          </div>
        </div>
        <div id="pg-panel" className={`section-panel section-panel--${state.codeOpen ? "code" : "preview"}`} role="tabpanel" aria-labelledby={state.codeOpen ? "pg-code-tab" : "pg-preview-tab"}>
          {state.codeOpen
            ? <CodeBlock key={framework} file={SNIPPET_FILE[framework]} code={generatedCode} />
            : <div className="section-preview-body"><ArcanaDataTable key={`${msg.meta.locale}-${effectiveLocale}`} config={config} /></div>}
        </div>
      </div>
    </div>
  </div>;
}
