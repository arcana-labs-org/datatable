import { useMemo, type ReactNode } from "react";
import { DocsShell, type DocsGroup } from "./components/DocsShell";
import { CodeBlock } from "./components/CodeBlock";
import {
  ActionsPreview, CheckboxPreview, ColumnsPreview, DataModesPreview, ExpandablePreview, FiltersPreview,
  FirstUsePreview, HooksPreview, LayoutPreview, LocalizationPreview, PaginationPreview, RadioPreview,
  SearchTypesPreview, SortingPreview, SummaryPreview, ThemePreview
} from "./components/demos";
import {
  actionsCode, checkboxCode, columnsCode, controllerCode, expandableCode, filtersCode, firstUseCode,
  fullConfigCode, hooksCode, installCode, layoutCode, localizationCode, modeCode, paginationCode, radioCode,
  searchTypesCode, sortingCode, stylesCode, summaryCode, themeCode, type SnippetPair
} from "./components/snippets";
import { rich, useLang, type Messages } from "./i18n";
import { ARCANA_MESSAGES } from "../../src";
import type { ArcanaLocale, ArcanaMessages } from "../../src";
import type { MethodKey, PropertyKey, SearchTypeKey } from "./i18n/types";

function P({ children }: { children: string }) {
  return <p>{rich(children)}</p>;
}

function KeyChips({ keys, ariaLabel }: { keys: string[]; ariaLabel: string }) {
  return <div className="key-chips" aria-label={ariaLabel}>{keys.map((key) => <code key={key}>{key}</code>)}</div>;
}

function pairToCode(pair: SnippetPair, reactFile: string, vueFile: string, angularFile: string, svelteFile: string) {
  return {
    react: { file: reactFile, code: pair.react },
    vue: { file: vueFile, code: pair.vue },
    angular: { file: angularFile, code: pair.angular },
    svelte: { file: svelteFile, code: pair.svelte }
  };
}

const customThemeCss = `/* my-theme.css — any name works; here, "candy" */
.arcana-theme-candy {
  --arcana-surface-muted: #fdf2f8;   /* grid header and footer */
  --arcana-border: #fbcfe8;          /* cell and input borders */
  --arcana-accent: #db2777;          /* focus, current page, selection */
  --arcana-row-checked: #fce7f3;     /* checked row */
  --arcana-row-focused: #fdf2f8;     /* focused row */
  --arcana-panel-bg: #fff0f7;        /* portaled select and calendar */
  --arcana-panel-border: #fbcfe8;
}

/* then, in your app:
   theme: 'candy'  — per table
   setDefaultArcanaTheme('candy')  — global */`;

/**
 * Static (non-translated) property metadata: key into the message catalog,
 * property name, type and code-valued default. `def: null` means the default
 * is a translated word (looked up in msg.sections.properties.defaults).
 */
const PROPERTY_META: Array<{ key: PropertyKey; name: string; type: string; def: string | null | undefined }> = [
  { key: "mode", name: "mode", type: "remote | dataset", def: null },
  { key: "theme", name: "theme", type: "zinc | ocean | forest | midnight | string", def: "zinc" },
  { key: "locale", name: "locale", type: "pt-BR | en | es | it | zh | ja | de | ru", def: "pt-BR" },
  { key: "messages", name: "messages", type: "Partial<ArcanaMessages>", def: undefined },
  { key: "dataset", name: "dataset", type: "DataTableRow[]", def: undefined },
  { key: "columns", name: "columns", type: "DataTableColumn[] | () => DataTableColumn[]", def: undefined },
  { key: "datasource", name: "datasource", type: "(params) => rows | response", def: undefined },
  { key: "url", name: "url", type: "string | () => string", def: undefined },
  { key: "rowsPerPage", name: "rowsPerPage", type: "number", def: "10" },
  { key: "searchEnabled", name: "searchEnabled", type: "boolean", def: "true" },
  { key: "orderByEnabled", name: "orderByEnabled", type: "boolean", def: "true" },
  { key: "checkboxEnabled", name: "checkboxEnabled", type: "boolean", def: "false" },
  { key: "radioButtonSelectionEnabled", name: "radioButtonSelectionEnabled", type: "boolean", def: "false" },
  { key: "footerSummarizerEnabled", name: "footerSummarizerEnabled", type: "boolean", def: "false" },
  { key: "expandableRowsEnabled", name: "expandableRowsEnabled", type: "boolean", def: "false" },
  { key: "expandedRowRenderer", name: "expandedRowRenderer", type: "(row, grid) => Renderable | Promise<Renderable>", def: undefined },
  { key: "expandedRowLoadingRenderer", name: "expandedRowLoadingRenderer", type: "(row, grid) => Renderable", def: null },
  { key: "expandRowOnClick", name: "expandRowOnClick", type: "boolean", def: "false" },
  { key: "onRowExpandedCollapsed", name: "onRowExpanded / onRowCollapsed", type: "(row, grid) => void", def: undefined },
  { key: "responsiveMode", name: "responsiveMode", type: "HORIZONTAL_OVERFLOW | VERTICAL_RECORD", def: "HORIZONTAL_OVERFLOW" },
  { key: "stickyHeaderEnabled", name: "stickyHeaderEnabled", type: "boolean", def: "false" },
  { key: "sendRequestOnMounted", name: "sendRequestOnMounted", type: "boolean", def: "true" },
  { key: "initialFilters", name: "initialFilters", type: "Record<string, unknown>", def: "{}" },
  { key: "onRequestError", name: "onRequestError", type: "(error, grid) => void", def: undefined }
];

/** Which properties use a translated word as their default. */
const TRANSLATED_DEFAULT: Partial<Record<PropertyKey, "inferred" | "builtIn">> = {
  mode: "inferred",
  expandedRowLoadingRenderer: "builtIn"
};

// Signatures extracted from the `DataTableApi` interface (src/core/types.ts).
const METHOD_META: Array<{ key: MethodKey; signature: string; params?: Array<{ name: string; type: string }> }> = [
  { key: "refresh", signature: "refresh(): Promise<void>" },
  { key: "setRows", signature: "setRows(rows: Row[]): Row[]", params: [{ name: "rows", type: "Row[]" }] },
  { key: "setDataset", signature: "setDataset(rows: Row[]): Row[]", params: [{ name: "rows", type: "Row[]" }] },
  { key: "getDataset", signature: "getDataset(): Row[]" },
  { key: "addRow", signature: "addRow(row: Row): void", params: [{ name: "row", type: "Row" }] },
  {
    key: "updateRow",
    signature: "updateRow(uuid: string, row: Partial<Row>): void",
    params: [{ name: "uuid", type: "string" }, { name: "row", type: "Partial<Row>" }]
  },
  { key: "removeRow", signature: "removeRow(uuid: string): void", params: [{ name: "uuid", type: "string" }] },
  { key: "getRows", signature: "getRows(): Row[]" },
  { key: "getCheckedRows", signature: "getCheckedRows(): Row[]" },
  { key: "clearCheckedRows", signature: "clearCheckedRows(): void" },
  {
    key: "setFilter",
    signature: "setFilter(name: string, value: unknown): Promise<void>",
    params: [{ name: "name", type: "string" }, { name: "value", type: "unknown" }]
  },
  {
    key: "setFilters",
    signature: "setFilters(filters: Record<string, unknown>): Promise<void>",
    params: [{ name: "filters", type: "Record<string, unknown>" }]
  },
  {
    key: "paginate",
    signature: "paginate(page: number, rowsPerPage: number): Promise<void>",
    params: [{ name: "page", type: "number" }, { name: "rowsPerPage", type: "number" }]
  },
  {
    key: "applyOrderBy",
    signature: "applyOrderBy(orderBy: OrderBy | null): Promise<void>",
    params: [{ name: "orderBy", type: "OrderBy | null" }]
  },
  { key: "expandRow", signature: "expandRow(uuid: string): void", params: [{ name: "uuid", type: "string" }] },
  { key: "collapseRow", signature: "collapseRow(uuid: string): void", params: [{ name: "uuid", type: "string" }] },
  { key: "getExpandedRows", signature: "getExpandedRows(): Row[]" },
  {
    key: "getSummarizedValue",
    signature: "getSummarizedValue(column: DataTableColumn<Row>, onlyIsChecked?: boolean): SummarizedValue | null",
    params: [{ name: "column", type: "DataTableColumn<Row>" }, { name: "onlyIsChecked", type: "boolean" }]
  }
];

const SEARCH_TYPE_ORDER: SearchTypeKey[] = ["DATE", "DATE_MONTH", "DATE_RANGE", "BOOLEAN", "LIST", "REMOTE", "COMPONENT"];

const MESSAGE_KEYS = Object.keys(ARCANA_MESSAGES.en) as Array<keyof ArcanaMessages>;

function buildGroups(msg: Messages, gridLocale: ArcanaLocale): DocsGroup[] {
  const s = msg.sections;
  const chips = (keys: string[]): ReactNode => <KeyChips keys={keys} ariaLabel={msg.shell.keyChipsAria} />;

  return [
    {
      label: msg.groups.gettingStarted,
      sections: [
        {
          id: "instalacao",
          title: s.install.title,
          code: pairToCode(installCode, "terminal", "terminal", "terminal", "terminal"),
          body: <>
            <P>{s.install.p1}</P>
            <P>{s.install.p2}</P>
          </>
        },
        {
          id: "primeiro-uso",
          title: s.firstUse.title,
          code: pairToCode(firstUseCode, "Invoices.tsx", "Invoices.vue", "Invoices.component.ts", "Invoices.svelte"),
          preview: <FirstUsePreview />,
          previewLabel: s.firstUse.previewLabel,
          body: <>
            <P>{s.firstUse.p1}</P>
            <P>{s.firstUse.p2}</P>
          </>
        },
        {
          id: "estilos",
          title: s.styles.title,
          code: pairToCode(stylesCode, "main.tsx", "main.ts", "styles.css", "main.ts"),
          body: <>
            <P>{s.styles.p1}</P>
            <P>{s.styles.p2}</P>
          </>
        }
      ]
    },
    {
      label: msg.groups.concepts,
      sections: [
        {
          id: "modos",
          title: s.modes.title,
          code: pairToCode(modeCode, "Modes.tsx", "Modes.vue", "Modes.component.ts", "Modes.svelte"),
          preview: <DataModesPreview />,
          body: <>
            <P>{s.modes.intro}</P>
            <ul className="doc-list">
              <li>{rich(s.modes.liRemote)}</li>
              <li>{rich(s.modes.liDataset)}</li>
            </ul>
            <div className="ref-table-wrap">
              <table className="ref-table">
                <thead><tr><th></th><th>remote</th><th>dataset</th></tr></thead>
                <tbody>
                  <tr><td className="t-muted">{s.modes.rowOrigin}</td><td><code>datasource</code> / <code>url</code></td><td>{rich(s.modes.originDataset)}</td></tr>
                  <tr><td className="t-muted">{s.modes.rowFilterSort}</td><td>{s.modes.filterSortRemote}</td><td>{s.modes.filterSortDataset}</td></tr>
                  <tr><td className="t-muted">{s.modes.rowRequests}</td><td>{s.modes.requestsRemote}</td><td>{s.modes.requestsDataset}</td></tr>
                </tbody>
              </table>
            </div>
            <P>{s.modes.compare}</P>
            {chips(["mode", "dataset", "datasource", "url", "showLoadingDuringRequest", "sendRequestOnMounted", "onRequestStarted", "onRequestFinished", "onRequestError"])}
          </>
        },
        {
          id: "temas",
          title: s.themes.title,
          code: pairToCode(themeCode, "Themes.tsx", "Themes.vue", "Themes.component.ts", "Themes.svelte"),
          preview: <ThemePreview />,
          previewLabel: s.themes.previewLabel,
          body: <>
            <P>{s.themes.p1}</P>
            <P>{s.themes.p2}</P>
            <P>{s.themes.p3}</P>
            <h3>{s.themes.customHeading}</h3>
            <P>{s.themes.p4}</P>
            <P>{s.themes.p5}</P>
            <CodeBlock lang="css" file="my-theme.css" code={customThemeCss} />
            {chips(["theme", "setDefaultArcanaTheme", "getDefaultArcanaTheme", "arcana-theme-{name}", "--arcana-*"])}
          </>
        },
        {
          id: "localizacao",
          title: s.localization.title,
          code: pairToCode(localizationCode, "Localization.tsx", "Localization.vue", "Localization.component.ts", "Localization.svelte"),
          preview: <LocalizationPreview />,
          previewLabel: s.localization.previewLabel,
          body: <>
            <P>{s.localization.p1}</P>
            <P>{s.localization.p2}</P>
            <P>{s.localization.p3}</P>
            <h3>{s.localization.keysTitle}</h3>
            <P>{s.localization.keysIntro}</P>
            <div className="ref-table-wrap">
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>{s.localization.keysKeyCol}</th>
                    <th><code>en</code></th>
                    {gridLocale !== "en" ? <th><code>{gridLocale}</code></th> : null}
                  </tr>
                </thead>
                <tbody>
                  {MESSAGE_KEYS.map((key) => <tr key={key}>
                    <td><code>{key}</code></td>
                    <td>{ARCANA_MESSAGES.en[key]}</td>
                    {gridLocale !== "en" ? <td>{ARCANA_MESSAGES[gridLocale][key]}</td> : null}
                  </tr>)}
                </tbody>
              </table>
            </div>
            <P>{s.localization.p4}</P>
            {chips(["locale", "messages", "setDefaultArcanaLocale", "getDefaultArcanaLocale", "ArcanaMessages", "ARCANA_LOCALES"])}
          </>
        },
        {
          id: "colunas",
          title: s.columns.title,
          code: pairToCode(columnsCode, "Columns.tsx", "Columns.vue", "Columns.component.ts", "Columns.svelte"),
          preview: <ColumnsPreview />,
          body: <>
            <P>{s.columns.p1}</P>
            <P>{s.columns.p2}</P>
            {chips(["columns", "cellMinWidth", "calculateCellWidth", "textAlignment", "width", "valueGetter", "headerContentGetter", "isVisible", "onBeforeColumnStyleMounted", "useFlexbox (deprecated)"])}
          </>
        },
        {
          id: "paginacao",
          title: s.pagination.title,
          code: pairToCode(paginationCode, "Pagination.tsx", "Pagination.vue", "Pagination.component.ts", "Pagination.svelte"),
          preview: <PaginationPreview />,
          body: <>
            <P>{s.pagination.p1}</P>
            <P>{s.pagination.p2}</P>
            {chips(["rowsPerPage", "footerVisible", "isRowsPerPageVisible", "messages.empty"])}
          </>
        }
      ]
    },
    {
      label: msg.groups.features,
      sections: [
        {
          id: "filtros",
          title: s.filters.title,
          code: pairToCode(filtersCode, "Filters.tsx", "Filters.vue", "Filters.component.ts", "Filters.svelte"),
          preview: <FiltersPreview />,
          body: <>
            <P>{s.filters.p1}</P>
            <P>{s.filters.p2}</P>
            {chips(["searchEnabled", "initialFilters", "disableFilterWhenPresentOnInitialFilters", "filterName", "searchEnabled (column)", "searchConfig"])}
          </>
        },
        {
          id: "tipos-de-busca",
          title: s.searchTypes.title,
          code: pairToCode(searchTypesCode, "SearchTypes.tsx", "SearchTypes.vue", "SearchTypes.component.ts", "SearchTypes.svelte"),
          preview: <SearchTypesPreview />,
          body: <>
            <P>{s.searchTypes.p1}</P>
            <div className="ref-table-wrap">
              <table className="ref-table">
                <thead><tr><th>searchType</th><th>{s.searchTypes.thControl}</th></tr></thead>
                <tbody>{SEARCH_TYPE_ORDER.map((type) => <tr key={type}><td><code>{type}</code></td><td className="t-muted">{s.searchTypes.rows[type]}</td></tr>)}</tbody>
              </table>
            </div>
            <P>{s.searchTypes.p2}</P>
            {chips(["searchType", "searchConfig", "searchTypeRenderer"])}
          </>
        },
        {
          id: "ordenacao",
          title: s.sorting.title,
          code: pairToCode(sortingCode, "Sorting.tsx", "Sorting.vue", "Sorting.component.ts", "Sorting.svelte"),
          preview: <SortingPreview />,
          body: <>
            <P>{s.sorting.p1}</P>
            <P>{s.sorting.p2}</P>
            {chips(["orderByEnabled", "orderByEnabled (column)", "filterName"])}
          </>
        },
        {
          id: "selecao-multipla",
          title: s.checkbox.title,
          code: pairToCode(checkboxCode, "MultiSelection.tsx", "MultiSelection.vue", "MultiSelection.component.ts", "MultiSelection.svelte"),
          preview: <CheckboxPreview />,
          body: <>
            <P>{s.checkbox.p1}</P>
            <P>{s.checkbox.p2}</P>
            {chips(["checkboxEnabled", "isRowChecked", "isCheckboxRowDisabled", "isCheckboxHeaderDisabled", "onRowChecked", "onRowUnchecked", "onCheckboxStateChanged", "onBeforeCheckboxAndRadioButtonStyleMounted"])}
          </>
        },
        {
          id: "selecao-unica",
          title: s.radio.title,
          code: pairToCode(radioCode, "SingleSelection.tsx", "SingleSelection.vue", "SingleSelection.component.ts", "SingleSelection.svelte"),
          preview: <RadioPreview />,
          body: <>
            <P>{s.radio.p1}</P>
            <P>{s.radio.p2}</P>
            {chips(["radioButtonSelectionEnabled", "uniqueKeyIdentifier", "onRowChecked", "onRowUnchecked", "onRadioStateChanged"])}
          </>
        },
        {
          id: "totais",
          title: s.summary.title,
          code: pairToCode(summaryCode, "Totals.tsx", "Totals.vue", "Totals.component.ts", "Totals.svelte"),
          preview: <SummaryPreview />,
          body: <>
            <P>{s.summary.p1}</P>
            <P>{s.summary.p2}</P>
            {chips(["footerSummarizerEnabled", "summarizeOnlyChecked", "type", "summarizerValueGetter", "summarizerValueFormatter", "isCreatedDynamically", "metadata"])}
          </>
        },
        {
          id: "responsividade",
          title: s.layout.title,
          code: pairToCode(layoutCode, "Responsiveness.tsx", "Responsiveness.vue", "Responsiveness.component.ts", "Responsiveness.svelte"),
          preview: <LayoutPreview />,
          body: <>
            <P>{s.layout.p1}</P>
            <ul className="doc-list">
              <li>{rich(s.layout.liOverflow)}</li>
              <li>{rich(s.layout.liVertical)}</li>
            </ul>
            <P>{s.layout.p2}</P>
            {chips(["height", "overflowEnabled", "stickyHeaderEnabled", "responsiveMode", "cellMinWidth"])}
          </>
        },
        {
          id: "acoes-eventos",
          title: s.actions.title,
          code: pairToCode(actionsCode, "ActionsEvents.tsx", "ActionsEvents.vue", "ActionsEvents.component.ts", "ActionsEvents.svelte"),
          preview: <ActionsPreview />,
          body: <>
            <P>{s.actions.p1}</P>
            <P>{s.actions.p2}</P>
            {chips(["actions", "actionsWidth", "rowFocusEnabled", "cellFocusEnabled", "onClickRow", "onDoubleClickRow", "onClickCell", "onDoubleClickCell", "onContextMenu"])}
          </>
        },
        {
          id: "linha-expansivel",
          title: s.expandable.title,
          code: pairToCode(expandableCode, "ExpandableRow.tsx", "ExpandableRow.vue", "ExpandableRow.component.ts", "ExpandableRow.svelte"),
          preview: <ExpandablePreview />,
          previewLabel: s.expandable.previewLabel,
          body: <>
            <P>{s.expandable.p1}</P>
            <P>{s.expandable.p2}</P>
            <P>{s.expandable.p3}</P>
            <P>{s.expandable.p4}</P>
            {chips(["expandableRowsEnabled", "expandedRowRenderer", "expandedRowLoadingRenderer", "expandRowOnClick", "onRowExpanded", "onRowCollapsed"])}
          </>
        },
        {
          id: "hooks",
          title: s.hooks.title,
          code: pairToCode(hooksCode, "Hooks.tsx", "Hooks.vue", "Hooks.component.ts", "Hooks.svelte"),
          preview: <HooksPreview />,
          body: <>
            <P>{s.hooks.p1}</P>
            <P>{s.hooks.p2}</P>
            {chips(["ariaLabel", "onBeforeRowMounted", "onBeforeCellMounted", "onBeforeHeaderCellMounted", "onBeforeCellStyleMounted", "onBeforeCheckboxAndRadioButtonStyleMounted"])}
          </>
        }
      ]
    },
    {
      label: msg.groups.reference,
      sections: [
        {
          id: "propriedades",
          title: s.properties.title,
          code: pairToCode(fullConfigCode, "full-config.ts", "full-config.ts", "full-config.ts", "full-config.ts"),
          body: <>
            <P>{s.properties.intro}</P>
            <div className="ref-table-wrap">
              <table className="ref-table">
                <thead><tr><th>{s.properties.thProperty}</th><th>{s.properties.thType}</th><th>{s.properties.thDefault}</th><th>{s.properties.thDescription}</th></tr></thead>
                <tbody>{PROPERTY_META.map(({ key, name, type, def }) => {
                  const translatedDef = TRANSLATED_DEFAULT[key];
                  return <tr key={name}>
                    <td><code>{name}</code></td>
                    <td className="t-muted"><span className="t-type">{type}</span></td>
                    <td className="t-muted">{translatedDef ? s.properties.defaults[translatedDef] : def === undefined ? "—" : <code>{def}</code>}</td>
                    <td className="t-muted">{s.properties.descriptions[key]}</td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
            <div className="callout">{rich(s.properties.tip)}</div>
          </>
        },
        {
          id: "metodos",
          title: s.methods.title,
          code: pairToCode(controllerCode, "InvoicesToolbar.tsx", "InvoicesToolbar.vue", "InvoicesToolbar.component.ts", "InvoicesToolbar.svelte"),
          body: <>
            <P>{s.methods.p1}</P>
            <P>{s.methods.p2}</P>
            <div className="method-list-detailed">
              {METHOD_META.map((method) => {
                const doc = s.methods.docs[method.key];
                return <div className="method-item" key={method.signature}>
                  <code className="method-signature">{method.signature}</code>
                  <p className="method-desc">{doc.description}</p>
                  {method.params?.length && doc.params ? <ul className="method-params">
                    {method.params.map((param) => <li key={param.name}>
                      <code>{param.name}: {param.type}</code> — {doc.params?.[param.name]}
                    </li>)}
                  </ul> : null}
                </div>;
              })}
            </div>
          </>
        }
      ]
    }
  ];
}

export function App() {
  const { lang, msg } = useLang();
  const groups = useMemo(() => buildGroups(msg, lang as ArcanaLocale), [msg, lang]);
  return <DocsShell groups={groups} />;
}
