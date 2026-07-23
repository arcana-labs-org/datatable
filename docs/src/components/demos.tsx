import { useMemo, useState } from "react";
import type { ArcanaLocale, ArcanaTheme, DataResponse, DataTableConfig, DataTableRow } from "../../../src";
import { ARCANA_LOCALES } from "../../../src";
import { ArcanaDataTable } from "../../../src/react";
import { fmt, useLang, type Messages } from "../i18n";

type DemoRow = DataTableRow & {
  id: number;
  name: string;
  email: string;
  department: string;
  remoteDepartment: string;
  status: string;
  active: boolean;
  joinedAt: string;
  billingDate: string;
  joinedMonth: string;
  amount: number;
  score: number;
};

/** Demo rows with translated departments/statuses (people names are fake data, kept as-is). */
function makeRows(msg: Messages): DemoRow[] {
  const d = msg.demos.departments;
  const s = msg.demos.statuses;
  return [
    { id: 101, name: "Ada Lovelace", email: "ada@arcana.dev", department: d.engineering, remoteDepartment: "engineering", status: s.active, active: true, joinedAt: "2026-01-12", billingDate: "2026-01-12", joinedMonth: "2026-01-01", amount: 4280, score: 96 },
    { id: 102, name: "Grace Hopper", email: "grace@arcana.dev", department: d.engineering, remoteDepartment: "engineering", status: s.active, active: true, joinedAt: "2026-02-08", billingDate: "2026-02-08", joinedMonth: "2026-02-01", amount: 1950, score: 91 },
    { id: 103, name: "Alan Turing", email: "alan@arcana.dev", department: d.research, remoteDepartment: "research", status: s.inReview, active: false, joinedAt: "2026-03-20", billingDate: "2026-03-20", joinedMonth: "2026-03-01", amount: 8760, score: 88 },
    { id: 104, name: "Margaret Hamilton", email: "margaret@arcana.dev", department: d.product, remoteDepartment: "product", status: s.active, active: true, joinedAt: "2026-04-02", billingDate: "2026-04-02", joinedMonth: "2026-04-01", amount: 2340, score: 99 },
    { id: 105, name: "Edsger Dijkstra", email: "edsger@arcana.dev", department: d.research, remoteDepartment: "research", status: s.inactive, active: false, joinedAt: "2026-05-17", billingDate: "2026-05-17", joinedMonth: "2026-05-01", amount: 5150, score: 90 },
    { id: 106, name: "Katherine Johnson", email: "katherine@arcana.dev", department: d.product, remoteDepartment: "product", status: s.active, active: true, joinedAt: "2026-06-09", billingDate: "2026-06-09", joinedMonth: "2026-06-01", amount: 3680, score: 97 },
    { id: 107, name: "Donald Knuth", email: "donald@arcana.dev", department: d.editorial, remoteDepartment: "editorial", status: s.inReview, active: true, joinedAt: "2026-07-14", billingDate: "2026-07-14", joinedMonth: "2026-07-01", amount: 6420, score: 94 },
    { id: 108, name: "Barbara Liskov", email: "barbara@arcana.dev", department: d.engineering, remoteDepartment: "engineering", status: s.active, active: true, joinedAt: "2026-08-01", billingDate: "2026-08-01", joinedMonth: "2026-08-01", amount: 2890, score: 95 }
  ];
}

/** Demo data uses BRL amounts; only the formatting locale follows the active language. */
const currency = (value: unknown, locale: string) => Number(value).toLocaleString(locale, { style: "currency", currency: "BRL" });

function useDemo() {
  const { lang, msg } = useLang();
  const rows = useMemo(() => makeRows(msg), [msg]);
  // The docs languages map 1:1 onto the library locales, so the demo grids
  // always follow the active docs language (no orphan pt-BR strings).
  return { msg, rows, locale: msg.meta.locale, gridLocale: lang as ArcanaLocale };
}

function makeBasicColumns(msg: Messages) {
  const locale = msg.meta.locale;
  return [
    { name: "id", label: msg.demos.cols.id, width: 72 },
    { name: "name", label: msg.demos.cols.name },
    { name: "amount", label: msg.demos.cols.amount, type: "CURRENCY" as const, textAlignment: "right" as const, valueGetter: (value: unknown) => currency(value, locale) }
  ];
}

function makeRemoteProvider(rows: DemoRow[], locale: string) {
  return async (params: Record<string, unknown>): Promise<DataResponse<DemoRow>> => {
    let result = [...rows];
    if (params.name) result = result.filter((row) => row.name.toLocaleLowerCase(locale).includes(String(params.name).toLocaleLowerCase(locale)));
    const field = params["order_by[field]"] as keyof DemoRow | undefined;
    if (field) {
      const direction = params["order_by[direction]"] === "desc" ? -1 : 1;
      result.sort((a, b) => String(a[field]).localeCompare(String(b[field]), locale, { numeric: true }) * direction);
    }
    const page = Number(params.page ?? 1);
    const limit = Number(params.limit ?? 2);
    return { rows: result.slice((page - 1) * limit, page * limit), total: result.length, page };
  };
}

export function FirstUsePreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "remote", locale: gridLocale, rowsPerPage: 4, datasource: makeRemoteProvider(rows, locale), ariaLabel: msg.demos.aria.firstUse,
    columns: [
      { name: "name", label: msg.demos.cols.client, filterName: "name" },
      { name: "department", label: msg.demos.cols.department, searchEnabled: false },
      { name: "amount", label: msg.demos.cols.amount, type: "CURRENCY", textAlignment: "right", searchEnabled: false, valueGetter: (value) => currency(value, locale) }
    ]
  }), [msg, rows, locale]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function DataModesPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const [requests, setRequests] = useState(0);
  const basicColumns = useMemo(() => makeBasicColumns(msg), [msg]);
  const remote = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "remote", locale: gridLocale, rowsPerPage: 2, searchEnabled: false, columns: basicColumns,
    datasource: makeRemoteProvider(rows, locale), onRequestStarted: () => setRequests((value) => value + 1)
  }), [basicColumns, rows, locale]);
  const dataset = useMemo<DataTableConfig<DemoRow>>(() => ({ mode: "dataset", locale: gridLocale, dataset: rows, rowsPerPage: 2, searchEnabled: false, columns: basicColumns }), [basicColumns, rows]);
  return <div className="dual-preview"><div><div className="preview-label">REMOTE <span>{fmt(msg.demos.requestsLabel, { n: requests })}</span></div><ArcanaDataTable key={locale} config={remote} /></div><div><div className="preview-label">DATASET <span>{msg.demos.zeroRequests}</span></div><ArcanaDataTable key={locale} config={dataset} /></div></div>;
}

const THEMES: ArcanaTheme[] = ["zinc", "ocean", "forest", "midnight", "candy"];

export function ThemePreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const [theme, setTheme] = useState<ArcanaTheme>("midnight");
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows, rowsPerPage: 4, theme, checkboxEnabled: true,
    isRowChecked: (row) => row.id === 102, ariaLabel: msg.demos.aria.themes,
    columns: [
      { name: "name", label: msg.demos.cols.name },
      { name: "department", label: msg.demos.cols.area, searchType: "LIST", searchConfig: () => [...new Set(rows.map((row) => row.department))].map((value) => ({ value, label: value })) },
      { name: "joinedAt", label: msg.demos.cols.date, searchType: "DATE" },
      { name: "amount", label: msg.demos.cols.amount, type: "CURRENCY", textAlignment: "right", searchEnabled: false, valueGetter: (value) => currency(value, locale) }
    ]
  }), [theme, msg, rows, locale]);
  return <>
    <div className="theme-picker" role="group" aria-label={msg.demos.aria.themePicker}>
      {THEMES.map((name) => (
        <button key={name} type="button" className={`demo-control theme-pick${theme === name ? " is-active" : ""}`} aria-pressed={theme === name} onClick={() => setTheme(name)}>
          <span className={`theme-dot theme-dot--${name}`} aria-hidden="true" />{name}
        </button>
      ))}
    </div>
    <ArcanaDataTable key={locale} config={config} />
  </>;
}

export function LocalizationPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const [override, setOverride] = useState<ArcanaLocale | null>(null);
  const [customMessages, setCustomMessages] = useState(false);
  const demoLocale = override ?? gridLocale;
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: demoLocale, dataset: rows, rowsPerPage: 4, checkboxEnabled: true,
    isRowChecked: (row) => row.id === 101,
    ...(customMessages ? { messages: { showingRange: msg.sections.localization.customShowing } } : {}),
    columns: [
      { name: "name", label: msg.demos.cols.name },
      { name: "department", label: msg.demos.cols.area, searchType: "LIST", searchConfig: () => [...new Set(rows.map((row) => row.department))].map((value) => ({ value, label: value })) },
      { name: "joinedAt", label: msg.demos.cols.date, searchType: "DATE" },
      { name: "amount", label: msg.demos.cols.amount, type: "CURRENCY", textAlignment: "right", searchEnabled: false, valueGetter: (value) => currency(value, locale) }
    ]
  }), [demoLocale, customMessages, msg, rows, locale]);
  return <>
    <div className="theme-picker" role="group" aria-label={msg.sections.localization.pickerAria}>
      {ARCANA_LOCALES.map((name) => (
        <button key={name} type="button" className={`demo-control theme-pick${demoLocale === name ? " is-active" : ""}`} aria-pressed={demoLocale === name} onClick={() => setOverride(name)}>
          {name}
        </button>
      ))}
    </div>
    <label className="demo-control" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <input type="checkbox" checked={customMessages} onChange={(event) => setCustomMessages(event.target.checked)} />
      {msg.sections.localization.customLabel}
    </label>
    <ArcanaDataTable key={`${demoLocale}-${customMessages}`} config={config} />
  </>;
}

export function ColumnsPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows.slice(0, 4), searchEnabled: false, footerVisible: false,
    calculateCellWidth: true, cellMinWidth: 130, textAlignment: "left",
    columns: () => [
      { name: "id", label: msg.demos.cols.code, width: 90, textAlignment: "center", headerContentGetter: () => <strong># {msg.demos.cols.id}</strong> },
      { name: "name", label: msg.demos.cols.name, html: true, valueGetter: (value) => `<strong>${String(value).toUpperCase()}</strong>` },
      { name: "score", label: msg.demos.cols.score, type: "PERCENTAGE", textAlignment: "right", valueGetter: (value) => `${value}%`, isVisible: () => true },
      { name: "email", label: msg.demos.cols.email, orderByEnabled: false, onBeforeColumnStyleMounted: () => ({ color: "#4f46e5" }) }
    ]
  }), [msg, rows]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function PaginationPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const [empty, setEmpty] = useState(false);
  const basicColumns = useMemo(() => makeBasicColumns(msg), [msg]);
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: empty ? [] : rows, columns: basicColumns, rowsPerPage: 2,
    searchEnabled: false, footerVisible: true, isRowsPerPageVisible: true, messages: { empty: msg.demos.paginationEmpty }
  }), [empty, msg, rows, basicColumns]);
  return <><button className="demo-control" type="button" onClick={() => setEmpty((value) => !value)}>{empty ? msg.demos.restoreDataset : msg.demos.emptyStateTest}</button><ArcanaDataTable key={locale} config={config} /></>;
}

export function FiltersPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => {
    const d = msg.demos.departments;
    return {
      mode: "dataset", locale: gridLocale, dataset: rows, rowsPerPage: 5, searchEnabled: true,
      initialFilters: { department: d.engineering }, disableFilterWhenPresentOnInitialFilters: true,
      columns: [
        { name: "name", label: msg.demos.cols.name, filterName: "name" },
        { name: "department", label: msg.demos.cols.area, searchType: "LIST", searchConfig: async () => [
          { value: d.engineering, label: d.engineering }, { value: d.product, label: d.product }, { value: d.research, label: d.research }
        ] },
        { name: "score", label: msg.demos.cols.score, searchEnabled: false, textAlignment: "right" }
      ]
    };
  }, [msg, rows]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function SearchTypesPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => {
    const d = msg.demos.departments;
    return {
      mode: "dataset", locale: gridLocale, dataset: rows, rowsPerPage: 4, cellMinWidth: 150, overflowEnabled: true, height: 260,
      columns: [
        { name: "joinedAt", label: msg.demos.cols.date, searchType: "DATE" },
        { name: "joinedMonth", label: msg.demos.cols.month, searchType: "DATE_MONTH" },
        { name: "billingDate", label: msg.demos.cols.period, searchType: "DATE_RANGE", width: 245 },
        { name: "active", label: msg.demos.cols.boolean, searchType: "BOOLEAN" },
        { name: "department", label: msg.demos.cols.list, searchType: "LIST", searchConfig: () => [...new Set(rows.map((row) => row.department))].map((value) => ({ value, label: value })) },
        { name: "remoteDepartment", label: msg.demos.cols.remoteList, searchType: "REMOTE", searchConfig: async () => [{ value: "engineering", label: d.engineering }, { value: "product", label: d.product }] },
        { name: "status", label: msg.demos.cols.custom, searchType: "COMPONENT", searchTypeRenderer: () => <span className="custom-filter">{msg.demos.customFilter}</span> }
      ]
    };
  }, [msg, rows]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function SortingPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows, rowsPerPage: 4, searchEnabled: false, orderByEnabled: true,
    columns: [{ name: "name", label: msg.demos.cols.name }, { name: "department", label: msg.demos.cols.area, filterName: "department", orderByEnabled: false }, { name: "amount", label: msg.demos.cols.amount, type: "CURRENCY", textAlignment: "right" }]
  }), [msg, rows]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function CheckboxPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const [event, setEvent] = useState<string | null>(null);
  const basicColumns = useMemo(() => makeBasicColumns(msg), [msg]);
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows.slice(0, 5), rowsPerPage: 3, searchEnabled: false, checkboxEnabled: true,
    columns: basicColumns, isRowChecked: (row) => row.id === 101, isCheckboxRowDisabled: (row) => row.id === 103,
    isCheckboxHeaderDisabled: () => false,
    onBeforeCheckboxAndRadioButtonStyleMounted: (row) => row.id === 101 ? { background: "#eef2ff" } : {},
    onRowChecked: (row) => setEvent(fmt(msg.demos.checkedEvent, { name: row.name })),
    onRowUnchecked: (row) => setEvent(fmt(msg.demos.uncheckedEvent, { name: row.name })),
    onCheckboxStateChanged: (row) => setEvent(fmt(msg.demos.checkboxChanged, { name: row.name }))
  }), [msg, rows, basicColumns]);
  return <><div className="event-readout">{event ?? msg.demos.checkboxInitial}</div><ArcanaDataTable key={locale} config={config} /></>;
}

export function RadioPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const [event, setEvent] = useState<string | null>(null);
  const basicColumns = useMemo(() => makeBasicColumns(msg), [msg]);
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows.slice(0, 4), searchEnabled: false, radioButtonSelectionEnabled: true,
    uniqueKeyIdentifier: "id", columns: basicColumns,
    onRowChecked: (row, type) => type === "radio" && setEvent(fmt(msg.demos.radioChosen, { name: row.name })),
    onRowUnchecked: (row, type) => type === "radio" && setEvent(fmt(msg.demos.radioRemoved, { name: row.name })),
    onRadioStateChanged: (row) => setEvent(fmt(msg.demos.radioChanged, { name: row.name }))
  }), [msg, rows, basicColumns]);
  return <><div className="event-readout">{event ?? msg.demos.radioInitial}</div><ArcanaDataTable key={locale} config={config} /></>;
}

export function SummaryPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows.slice(0, 5), searchEnabled: false, checkboxEnabled: true,
    footerSummarizerEnabled: true, summarizeOnlyChecked: true, isRowChecked: (row) => row.id === 101 || row.id === 102,
    columns: [
      { name: "name", label: msg.demos.cols.person },
      { name: "amount", label: msg.demos.cols.totalSelected, type: "CURRENCY", textAlignment: "right", summarizerValueGetter: (value) => Number(value), summarizerValueFormatter: (value) => currency(value, locale) },
      { name: "score", label: msg.demos.cols.points, type: "NUMBER", textAlignment: "right", isCreatedDynamically: true, metadata: { value_formatter: "currency" } }
    ]
  }), [msg, rows, locale]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function LayoutPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows, searchEnabled: false, footerVisible: false, height: 190,
    overflowEnabled: true, stickyHeaderEnabled: true, responsiveMode: "VERTICAL_RECORD", cellMinWidth: 170,
    columns: [{ name: "id", label: msg.demos.cols.id, width: 70 }, { name: "name", label: msg.demos.cols.name }, { name: "email", label: msg.demos.cols.email, width: 240 }, { name: "department", label: msg.demos.cols.area }]
  }), [msg, rows]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function ActionsPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const [event, setEvent] = useState<string | null>(null);
  const basicColumns = useMemo(() => makeBasicColumns(msg), [msg]);
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows.slice(0, 4), searchEnabled: false, rowFocusEnabled: true, cellFocusEnabled: true,
    columns: basicColumns, actionsWidth: 120,
    actions: [{ element: (row) => <button className="row-action" type="button" onClick={(click) => { click.stopPropagation(); setEvent(fmt(msg.demos.openEvent, { name: row.name })); }}>{msg.demos.open}</button>, isVisible: (row) => row.active }],
    onClickRow: (row) => setEvent(fmt(msg.demos.rowClick, { name: row.name })),
    onDoubleClickRow: (row) => setEvent(fmt(msg.demos.rowDblClick, { name: row.name })),
    onClickCell: (_value, column, row) => setEvent(fmt(msg.demos.cellClick, { column: column.label ?? "", name: row.name })),
    onDoubleClickCell: (_value, column, row) => setEvent(fmt(msg.demos.cellDblClick, { column: column.label ?? "", name: row.name })),
    onContextMenu: (_value, column, row) => [{ label: fmt(msg.demos.ctxCopy, { column: column.label ?? "" }), onClick: () => setEvent(fmt(msg.demos.ctxCopied, { name: row.name })) }]
  }), [msg, rows, basicColumns]);
  return <><div className="event-readout">{event ?? msg.demos.actionsInitial}</div><ArcanaDataTable key={locale} config={config} /></>;
}

export function ExpandablePreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const basicColumns = useMemo(() => makeBasicColumns(msg), [msg]);
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows.slice(0, 5), searchEnabled: false, footerVisible: false,
    expandableRowsEnabled: true, expandRowOnClick: false, ariaLabel: msg.demos.aria.expandable,
    columns: basicColumns,
    onRowExpanded: (row) => console.log("expanded", row.name),
    onRowCollapsed: (row) => console.log("collapsed", row.name),
    expandedRowRenderer: async (row) => {
      await new Promise((resolve) => setTimeout(resolve, 700)); // simulates an API
      return <div className="expand-card">
        <div className="expand-card__title"><strong>{row.name}</strong><span>{row.status}</span></div>
        <dl className="expand-card__grid">
          <div><dt>{msg.demos.card.email}</dt><dd>{row.email}</dd></div>
          <div><dt>{msg.demos.card.area}</dt><dd>{row.department}</dd></div>
          <div><dt>{msg.demos.card.score}</dt><dd>{row.score} {msg.demos.card.pts}</dd></div>
          <div><dt>{msg.demos.card.joined}</dt><dd>{new Date(`${row.joinedAt}T12:00:00`).toLocaleDateString(locale)}</dd></div>
        </dl>
      </div>;
    }
  }), [msg, rows, basicColumns, locale]);
  return <ArcanaDataTable key={locale} config={config} />;
}

export function HooksPreview() {
  const { msg, rows, locale, gridLocale } = useDemo();
  const config = useMemo<DataTableConfig<DemoRow>>(() => ({
    mode: "dataset", locale: gridLocale, dataset: rows.slice(0, 4), searchEnabled: false, checkboxEnabled: true, ariaLabel: msg.demos.aria.hooks,
    columns: [{ name: "name", label: msg.demos.cols.person }, { name: "status", label: msg.demos.cols.situation }, { name: "score", label: msg.demos.cols.score, textAlignment: "right" }],
    onBeforeRowMounted: (row) => ({ ...row, status: row.active ? msg.demos.available : msg.demos.unavailable }),
    onBeforeHeaderCellMounted: (column) => <span className="hook-header">{column.label}</span>,
    onBeforeCellMounted: (value, column) => column.name === "score" ? `${value} ${msg.demos.card.pts}` : value,
    onBeforeCellStyleMounted: (_value, column, row) => column.name === "status" ? { color: row.active ? "#047857" : "#9f1239", fontWeight: 600 } : {},
    onBeforeCheckboxAndRadioButtonStyleMounted: (row) => ({ background: row.active ? "#eef2ff" : "#fff1f2" })
  }), [msg, rows]);
  return <ArcanaDataTable key={locale} config={config} />;
}
