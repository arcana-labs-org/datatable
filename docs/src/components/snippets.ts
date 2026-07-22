export interface SnippetPair {
  react: string;
  vue: string;
  angular: string;
  svelte: string;
}

export function codePair(lines: string[], vueLines = lines, angularLines = vueLines, svelteLines = lines): SnippetPair {
  return {
    react: [
      "import { ArcanaDataTable } from '@arcanalabs/datatable/react'",
      "import '@arcanalabs/datatable/styles.css'", "", "const rows = [/* your data */]", "",
      "const config = {", ...lines.map((line) => `  ${line}`), "}", "",
      "export function Example() {", "  return <ArcanaDataTable config={config} />", "}"
    ].join("\n"),
    vue: [
      "<script setup lang=\"ts\">", "import { ArcanaDataTable } from '@arcanalabs/datatable/vue'",
      "import '@arcanalabs/datatable/styles.css'", "", "const rows = [/* your data */]", "",
      "const config = {", ...vueLines.map((line) => `  ${line}`), "}", "</script>", "",
      "<template><ArcanaDataTable :config=\"config\" /></template>"
    ].join("\n"),
    angular: [
      "import { Component } from '@angular/core'",
      "import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'",
      "// styles: import '@arcanalabs/datatable/styles.css' once (global styles.css or angular.json)",
      "", "const rows = [/* your data */]", "",
      "@Component({",
      "  selector: 'app-example',",
      "  standalone: true,",
      "  imports: [ArcanaDataTableComponent],",
      "  template: `<arcana-data-table [config]=\"config\" />`",
      "})",
      "export class ExampleComponent {",
      "  config = {", ...angularLines.map((line) => `    ${line}`), "  }",
      "}"
    ].join("\n"),
    svelte: [
      "<script lang=\"ts\">", "import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'",
      "import '@arcanalabs/datatable/styles.css'", "", "const rows = [/* your data */]", "",
      "const config = {", ...svelteLines.map((line) => `  ${line}`), "}", "</script>", "",
      "<ArcanaDataTable {config} />"
    ].join("\n")
  };
}

export const installCode: SnippetPair = {
  react: "# install the package\nnpm i @arcanalabs/datatable",
  vue: "# install the package\nnpm i @arcanalabs/datatable",
  angular: "# install the package\nnpm i @arcanalabs/datatable",
  svelte: "# install the package\nnpm i @arcanalabs/datatable"
};

export const firstUseCode: SnippetPair = {
  react: [
    "import { ArcanaDataTable } from '@arcanalabs/datatable/react'",
    "import '@arcanalabs/datatable/styles.css'", "",
    "const config = {", "  mode: 'remote',", "  columns: [",
    "    { name: 'client', label: 'Client' },",
    "    { name: 'amount', label: 'Amount', type: 'CURRENCY' }", "  ],",
    "  datasource: async (params) => api.invoices.list(params)", "}", "",
    "export function Invoices() {", "  return <ArcanaDataTable config={config} />", "}"
  ].join("\n"),
  vue: [
    "<script setup lang=\"ts\">", "import { ArcanaDataTable } from '@arcanalabs/datatable/vue'",
    "import '@arcanalabs/datatable/styles.css'", "", "const config = {", "  mode: 'remote',", "  columns: [",
    "    { name: 'client', label: 'Client' },", "    { name: 'amount', label: 'Amount', type: 'CURRENCY' }",
    "  ],", "  datasource: async (params) => api.invoices.list(params)", "}", "</script>", "",
    "<template>", "  <ArcanaDataTable :config=\"config\" />", "</template>"
  ].join("\n"),
  angular: [
    "import { Component } from '@angular/core'",
    "import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'",
    "// styles: import '@arcanalabs/datatable/styles.css' once (global styles.css or angular.json)",
    "",
    "@Component({",
    "  selector: 'app-invoices',",
    "  standalone: true,",
    "  imports: [ArcanaDataTableComponent],",
    "  template: `<arcana-data-table [config]=\"config\" />`",
    "})",
    "export class InvoicesComponent {",
    "  config = {", "    mode: 'remote',", "    columns: [",
    "      { name: 'client', label: 'Client' },",
    "      { name: 'amount', label: 'Amount', type: 'CURRENCY' }", "    ],",
    "    datasource: async (params) => api.invoices.list(params)", "  }",
    "}"
  ].join("\n"),
  svelte: [
    "<script lang=\"ts\">", "import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'",
    "import '@arcanalabs/datatable/styles.css'", "", "const config = {", "  mode: 'remote',", "  columns: [",
    "    { name: 'client', label: 'Client' },", "    { name: 'amount', label: 'Amount', type: 'CURRENCY' }",
    "  ],", "  datasource: async (params) => api.invoices.list(params)", "}", "</script>", "",
    "<ArcanaDataTable {config} />"
  ].join("\n")
};

export const stylesCode: SnippetPair = {
  react: "// once, at the application entrypoint\nimport '@arcanalabs/datatable/styles.css'",
  vue: "// once, at the application entrypoint\nimport '@arcanalabs/datatable/styles.css'",
  angular: "/* once, in the app's global styles.css (or in angular.json > \"styles\") */\n@import '@arcanalabs/datatable/styles.css';",
  svelte: "// once, at the application entrypoint\nimport '@arcanalabs/datatable/styles.css'"
};

const modeConfigLines = [
  "const remoteConfig = {", "  mode: 'remote',", "  columns,", "  rowsPerPage: 25,", "  showLoadingDuringRequest: true,", "  sendRequestOnMounted: true,",
  "  datasource: params => api.orders.list(params),", "  // alternative: url: '/orders',", "  onRequestStarted: grid => console.log(grid.loading),", "  onRequestFinished: (response, grid) => console.log(response),", "  onRequestError: error => console.error(error)", "}", "",
  "const datasetConfig = {", "  mode: 'dataset',", "  columns,", "  dataset: rows", "}"
];

export const modeCode: SnippetPair = {
  react: [
    "import { ArcanaDataTable } from '@arcanalabs/datatable/react'", "import '@arcanalabs/datatable/styles.css'", "",
    ...modeConfigLines, "",
    "export function Example() {", "  return <>", "    <ArcanaDataTable config={remoteConfig} />", "    <ArcanaDataTable config={datasetConfig} />", "  </>", "}"
  ].join("\n"),
  vue: [
    "<script setup lang=\"ts\">", "import { ArcanaDataTable } from '@arcanalabs/datatable/vue'", "import '@arcanalabs/datatable/styles.css'", "",
    ...modeConfigLines, "</script>", "",
    "<template>", "  <ArcanaDataTable :config=\"remoteConfig\" />", "  <ArcanaDataTable :config=\"datasetConfig\" />", "</template>"
  ].join("\n"),
  angular: [
    "import { Component } from '@angular/core'",
    "import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'",
    "// styles: import '@arcanalabs/datatable/styles.css' once (global styles.css or angular.json)",
    "",
    "@Component({",
    "  selector: 'app-example',",
    "  standalone: true,",
    "  imports: [ArcanaDataTableComponent],",
    "  template: `",
    "    <arcana-data-table [config]=\"remoteConfig\" />",
    "    <arcana-data-table [config]=\"datasetConfig\" />",
    "  `",
    "})",
    "export class ExampleComponent {",
    "  remoteConfig = {", "    mode: 'remote',", "    columns,", "    rowsPerPage: 25,", "    showLoadingDuringRequest: true,", "    sendRequestOnMounted: true,",
    "    datasource: params => api.orders.list(params),", "    // alternative: url: '/orders',", "    onRequestStarted: grid => console.log(grid.loading),", "    onRequestFinished: (response, grid) => console.log(response),", "    onRequestError: error => console.error(error)", "  }", "",
    "  datasetConfig = {", "    mode: 'dataset',", "    columns,", "    dataset: rows", "  }",
    "}"
  ].join("\n"),
  svelte: [
    "<script lang=\"ts\">", "import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'", "import '@arcanalabs/datatable/styles.css'", "",
    ...modeConfigLines, "</script>", "",
    "<ArcanaDataTable config={remoteConfig} />",
    "<ArcanaDataTable config={datasetConfig} />"
  ].join("\n")
};

const themeConfigLines = [
  "const config = {", "  mode: 'dataset',", "  dataset: rows,",
  "  // per table: wins over the global default",
  "  theme: 'ocean', // a preset or the name of your own theme",
  "  columns", "}"
];

export const themeCode: SnippetPair = {
  react: [
    "import { ArcanaDataTable } from '@arcanalabs/datatable/react'",
    "import { setDefaultArcanaTheme } from '@arcanalabs/datatable'",
    "import '@arcanalabs/datatable/styles.css'", "",
    "// global: applies to every table without its own theme",
    "setDefaultArcanaTheme('midnight')", "",
    ...themeConfigLines, "",
    "export function Example() {", "  return <ArcanaDataTable config={config} />", "}", "",
    "// Custom theme: define the arcana-theme-{name} class in your CSS",
    "// (full example in this section) and use theme: 'name' or",
    "// setDefaultArcanaTheme('name')."
  ].join("\n"),
  vue: [
    "<script setup lang=\"ts\">",
    "import { ArcanaDataTable } from '@arcanalabs/datatable/vue'",
    "import { setDefaultArcanaTheme } from '@arcanalabs/datatable'",
    "import '@arcanalabs/datatable/styles.css'", "",
    "// global: applies to every table without its own theme",
    "setDefaultArcanaTheme('midnight')", "",
    ...themeConfigLines, "</script>", "",
    "<template><ArcanaDataTable :config=\"config\" /></template>", "",
    "<!-- Custom theme: define the arcana-theme-{name} class in your CSS",
    "     (full example in this section) and use theme: 'name' or",
    "     setDefaultArcanaTheme('name'). -->"
  ].join("\n"),
  angular: [
    "import { Component } from '@angular/core'",
    "import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'",
    "import { setDefaultArcanaTheme } from '@arcanalabs/datatable'",
    "// styles: import '@arcanalabs/datatable/styles.css' once (global styles.css or angular.json)",
    "",
    "// global: applies to every table without its own theme",
    "setDefaultArcanaTheme('midnight')",
    "",
    "@Component({",
    "  selector: 'app-example',",
    "  standalone: true,",
    "  imports: [ArcanaDataTableComponent],",
    "  template: `<arcana-data-table [config]=\"config\" />`",
    "})",
    "export class ExampleComponent {",
    "  config = {", "    mode: 'dataset',", "    dataset: rows,",
    "    // per table: wins over the global default",
    "    theme: 'ocean', // a preset or the name of your own theme",
    "    columns", "  }",
    "}", "",
    "// Custom theme: define the arcana-theme-{name} class in your CSS",
    "// (full example in this section) and use theme: 'name' or",
    "// setDefaultArcanaTheme('name')."
  ].join("\n"),
  svelte: [
    "<script lang=\"ts\">",
    "import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'",
    "import { setDefaultArcanaTheme } from '@arcanalabs/datatable'",
    "import '@arcanalabs/datatable/styles.css'", "",
    "// global: applies to every table without its own theme",
    "setDefaultArcanaTheme('midnight')", "",
    ...themeConfigLines, "",
    "// Custom theme: define the arcana-theme-{name} class in your CSS",
    "// (full example in this section) and use theme: 'name' or",
    "// setDefaultArcanaTheme('name').",
    "</script>", "",
    "<ArcanaDataTable {config} />"
  ].join("\n")
};

const localizationConfigLines = [
  "const config = {", "  mode: 'dataset',", "  dataset: rows,",
  "  // per table: wins over the global default",
  "  locale: 'en', // pt-BR (default) | en | es | it | zh | ja | de | ru",
  "  // optional: override any single string, on top of the pack",
  "  messages: {",
  "    showingRange: 'Rows {from}-{to} · {total} total',",
  "    empty: 'Nothing here yet'",
  "  },",
  "  columns", "}"
];

export const localizationCode: SnippetPair = {
  react: [
    "import { ArcanaDataTable } from '@arcanalabs/datatable/react'",
    "import { setDefaultArcanaLocale } from '@arcanalabs/datatable'",
    "import '@arcanalabs/datatable/styles.css'", "",
    "// global: applies to every table without its own locale",
    "setDefaultArcanaLocale('en')", "",
    ...localizationConfigLines, "",
    "export function Example() {", "  return <ArcanaDataTable config={config} />", "}", "",
    "// The calendar (month/weekday names) follows the locale via Intl.",
    "// Precedence per string: messages > locale pack > global default pack."
  ].join("\n"),
  vue: [
    "<script setup lang=\"ts\">",
    "import { ArcanaDataTable } from '@arcanalabs/datatable/vue'",
    "import { setDefaultArcanaLocale } from '@arcanalabs/datatable'",
    "import '@arcanalabs/datatable/styles.css'", "",
    "// global: applies to every table without its own locale",
    "setDefaultArcanaLocale('en')", "",
    ...localizationConfigLines, "</script>", "",
    "<template><ArcanaDataTable :config=\"config\" /></template>", "",
    "<!-- The calendar (month/weekday names) follows the locale via Intl.",
    "     Precedence per string: messages > locale pack > global default pack. -->"
  ].join("\n"),
  angular: [
    "import { Component } from '@angular/core'",
    "import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'",
    "import { setDefaultArcanaLocale } from '@arcanalabs/datatable'",
    "",
    "// global: applies to every table without its own locale",
    "setDefaultArcanaLocale('en')",
    "",
    "@Component({",
    "  selector: 'app-example',",
    "  standalone: true,",
    "  imports: [ArcanaDataTableComponent],",
    "  template: `<arcana-data-table [config]=\"config\" />`",
    "})",
    "export class ExampleComponent {",
    "  config = {", "    mode: 'dataset',", "    dataset: rows,",
    "    // per table: wins over the global default",
    "    locale: 'en', // pt-BR (default) | en | es | it | zh | ja | de | ru",
    "    // optional: override any single string, on top of the pack",
    "    messages: {",
    "      showingRange: 'Rows {from}-{to} · {total} total',",
    "      empty: 'Nothing here yet'",
    "    },",
    "    columns", "  }",
    "}", "",
    "// The calendar (month/weekday names) follows the locale via Intl.",
    "// Precedence per string: messages > locale pack > global default pack."
  ].join("\n"),
  svelte: [
    "<script lang=\"ts\">",
    "import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'",
    "import { setDefaultArcanaLocale } from '@arcanalabs/datatable'",
    "import '@arcanalabs/datatable/styles.css'", "",
    "// global: applies to every table without its own locale",
    "setDefaultArcanaLocale('en')", "",
    ...localizationConfigLines, "",
    "// The calendar (month/weekday names) follows the locale via Intl.",
    "// Precedence per string: messages > locale pack > global default pack.",
    "</script>", "",
    "<ArcanaDataTable {config} />"
  ].join("\n")
};

export const columnsCode = codePair(["mode: 'dataset',", "dataset: rows,", "calculateCellWidth: true,", "cellMinWidth: 130,", "textAlignment: 'left',", "columns: () => [", "  { name: 'id', label: 'ID', width: 90, textAlignment: 'center' },", "  { name: 'name', label: 'Name', valueGetter: value => value.toUpperCase() },", "  { name: 'score', label: 'Score', isVisible: () => canSeeScore },", "]", "// useFlexbox is deprecated; the layout is always flex"]);
export const paginationCode = codePair(["mode: 'dataset',", "dataset: rows,", "columns,", "rowsPerPage: 25,", "footerVisible: true,", "isRowsPerPageVisible: true,", "messages: { empty: 'No records found.' }"]);
export const filtersCode = codePair(["mode: 'dataset',", "dataset: rows,", "searchEnabled: true,", "initialFilters: { department: 'Engineering' },", "disableFilterWhenPresentOnInitialFilters: true,", "columns: [", "  { name: 'name', label: 'Name', filterName: 'name' },", "  { name: 'department', label: 'Area', searchType: 'LIST', searchConfig: loadAreas },", "  { name: 'score', label: 'Score', searchEnabled: false },", "]"]);
export const searchTypesCode = codePair(["mode: 'dataset',", "dataset: rows,", "columns: [", "  { name: 'date', label: 'Date', searchType: 'DATE' },", "  { name: 'month', label: 'Month', searchType: 'DATE_MONTH' },", "  { name: 'period', label: 'Period', searchType: 'DATE_RANGE' },", "  { name: 'active', label: 'Active', searchType: 'BOOLEAN' },", "  { name: 'area', label: 'List', searchType: 'LIST', searchConfig: loadAreas },", "  { name: 'remote', label: 'Remote', searchType: 'REMOTE', searchConfig: fetchAreas },", "  { name: 'custom', label: 'Custom', searchType: 'COMPONENT', searchTypeRenderer: CustomFilter },", "]"]);
export const sortingCode = codePair(["mode: 'dataset',", "dataset: rows,", "orderByEnabled: true,", "columns: [", "  { name: 'name', label: 'Name' },", "  { name: 'area', label: 'Area', filterName: 'department', orderByEnabled: false },", "]"]);
export const checkboxCode = codePair(["mode: 'dataset',", "dataset: rows,", "checkboxEnabled: true,", "isRowChecked: row => row.featured,", "isCheckboxRowDisabled: row => row.locked,", "isCheckboxHeaderDisabled: grid => grid.loading,", "onRowChecked: (row, type) => console.log(row, type),", "onRowUnchecked: (row, type) => console.log(row, type),", "onCheckboxStateChanged: (row, grid) => console.log(row),", "onBeforeCheckboxAndRadioButtonStyleMounted: row => ({ background: row.featured ? '#eef2ff' : '#fff' }),", "columns"]);
export const radioCode = codePair(["mode: 'dataset',", "dataset: rows,", "radioButtonSelectionEnabled: true,", "uniqueKeyIdentifier: 'id',", "onRowChecked: (row, type) => console.log(row, type),", "onRowUnchecked: (row, type) => console.log(row, type),", "onRadioStateChanged: (row, grid) => console.log(row),", "columns"]);
export const summaryCode = codePair(["mode: 'dataset',", "dataset: rows,", "checkboxEnabled: true,", "footerSummarizerEnabled: true,", "summarizeOnlyChecked: true,", "columns: [", "  { name: 'name', label: 'Name' },", "  { name: 'amount', label: 'Total', type: 'CURRENCY',", "    summarizerValueGetter: value => Number(value),", "    summarizerValueFormatter: formatMoney },", "]"]);
export const layoutCode = codePair(["mode: 'dataset',", "dataset: rows,", "height: 320,", "overflowEnabled: true,", "stickyHeaderEnabled: true,", "responsiveMode: 'VERTICAL_RECORD',", "cellMinWidth: 170,", "footerVisible: false,", "columns"]);

const actionsSharedLines = (actionsLine: string) => ["mode: 'dataset',", "dataset: rows,", "rowFocusEnabled: true,", "cellFocusEnabled: true,", "actionsWidth: 120,", actionsLine, "onClickRow: (row, grid) => open(row),", "onDoubleClickRow: (row, grid) => edit(row),", "onClickCell: (value, column, row, grid) => inspect(value),", "onDoubleClickCell: (value, column, row, grid) => editCell(value),", "onContextMenu: (value, column, row, grid) => [{ label: 'Copy', onClick: copy }],", "columns"];
const actionsHtmlLines = actionsSharedLines("actions: [{ element: row => '<button>Open</button>', isVisible: row => row.active }],");
export const actionsCode = codePair(
  actionsSharedLines("actions: [{ element: row => <button>Open</button>, isVisible: row => row.active }],"),
  actionsSharedLines("actions: [{ element: row => h('button', 'Open'), isVisible: row => row.active }],"),
  actionsHtmlLines,
  actionsHtmlLines
);

export const expandableCode: SnippetPair = {
  react: [
    "import { ArcanaDataTable } from '@arcanalabs/datatable/react'", "import '@arcanalabs/datatable/styles.css'", "",
    "const config = {", "  mode: 'dataset',", "  dataset: rows,", "  columns,",
    "  expandableRowsEnabled: true,", "  expandRowOnClick: false, // true: the whole row toggles the expansion", "",
    "  // SYNC: uses the row's own data",
    "  // expandedRowRenderer: row => <PersonCard person={row} />,", "",
    "  // ASYNC: returns a Promise; the loading state shows until it resolves",
    "  expandedRowRenderer: async (row, grid) => {",
    "    const { data } = await axios.get(`/people/${row.id}/details`)",
    "    return <PersonCard person={row} details={data} />",
    "  },", "",
    "  // optional: replaces the default loading state",
    "  expandedRowLoadingRenderer: row => <Skeleton label={`Loading ${row.name}…`} />,", "",
    "  onRowExpanded: (row, grid) => console.log('expanded', row),",
    "  onRowCollapsed: (row, grid) => console.log('collapsed', row)", "}", "",
    "export function People() {", "  return <ArcanaDataTable config={config} />", "}", "",
    "// programmatic control (via the component ref)",
    "controller.expandRow(row._uuid)", "controller.collapseRow(row._uuid)", "controller.getExpandedRows()"
  ].join("\n"),
  vue: [
    "<script setup lang=\"ts\">", "import { h } from 'vue'",
    "import { ArcanaDataTable } from '@arcanalabs/datatable/vue'", "import '@arcanalabs/datatable/styles.css'", "",
    "const config = {", "  mode: 'dataset',", "  dataset: rows,", "  columns,",
    "  expandableRowsEnabled: true,", "  expandRowOnClick: false, // true: the whole row toggles the expansion", "",
    "  // SYNC: uses the row's own data",
    "  // expandedRowRenderer: row => h(PersonCard, { person: row }),", "",
    "  // ASYNC: returns a Promise; the loading state shows until it resolves",
    "  expandedRowRenderer: async (row, grid) => {",
    "    const { data } = await axios.get(`/people/${row.id}/details`)",
    "    return h(PersonCard, { person: row, details: data })",
    "  },", "",
    "  // optional: replaces the default loading state",
    "  expandedRowLoadingRenderer: row => h(Skeleton, { label: `Loading ${row.name}…` }),", "",
    "  onRowExpanded: (row, grid) => console.log('expanded', row),",
    "  onRowCollapsed: (row, grid) => console.log('collapsed', row)", "}", "</script>", "",
    "<template><ArcanaDataTable :config=\"config\" /></template>", "",
    "<!-- programmatic control (via the component ref):",
    "     controller.expandRow(row._uuid)",
    "     controller.collapseRow(row._uuid)",
    "     controller.getExpandedRows() -->"
  ].join("\n"),
  angular: [
    "import { Component } from '@angular/core'",
    "import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'",
    "",
    "@Component({",
    "  selector: 'app-people',",
    "  standalone: true,",
    "  imports: [ArcanaDataTableComponent],",
    "  template: `<arcana-data-table [config]=\"config\" />`",
    "})",
    "export class PeopleComponent {",
    "  config = {", "    mode: 'dataset',", "    dataset: rows,", "    columns,",
    "    expandableRowsEnabled: true,", "    expandRowOnClick: false, // true: the whole row toggles the expansion", "",
    "    // SYNC: uses the row's own data — the renderer returns an HTML",
    "    // string (a DOM Node or a callback that mounts the node also work)",
    "    // expandedRowRenderer: row => `<section class=\"person-card\">…</section>`,", "",
    "    // ASYNC: returns a Promise; the loading state shows until it resolves",
    "    expandedRowRenderer: async (row, grid) => {",
    "      const { data } = await axios.get(`/people/${row.id}/details`)",
    "      return `<section class=\"person-card\">…details for ${row.name}…</section>`",
    "    },", "",
    "    // optional: replaces the default loading state",
    "    expandedRowLoadingRenderer: row => `<em>Loading ${row.name}…</em>`,", "",
    "    onRowExpanded: (row, grid) => console.log('expanded', row),",
    "    onRowCollapsed: (row, grid) => console.log('collapsed', row)", "  }",
    "}", "",
    "// programmatic control (via the component api)",
    "table.api.expandRow(row._uuid)", "table.api.collapseRow(row._uuid)", "table.api.getExpandedRows()"
  ].join("\n"),
  svelte: [
    "<script lang=\"ts\">",
    "import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'", "import '@arcanalabs/datatable/styles.css'", "",
    "const config = {", "  mode: 'dataset',", "  dataset: rows,", "  columns,",
    "  expandableRowsEnabled: true,", "  expandRowOnClick: false, // true: the whole row toggles the expansion", "",
    "  // SYNC: uses the row's own data — the renderer returns an HTML",
    "  // string (a DOM Node or a callback that mounts the node also work)",
    "  // expandedRowRenderer: row => `<section class=\"person-card\">…</section>`,", "",
    "  // ASYNC: returns a Promise; the loading state shows until it resolves",
    "  expandedRowRenderer: async (row, grid) => {",
    "    const { data } = await axios.get(`/people/${row.id}/details`)",
    "    return `<section class=\"person-card\">…details for ${row.name}…</section>`",
    "  },", "",
    "  // optional: replaces the default loading state",
    "  expandedRowLoadingRenderer: row => `<em>Loading ${row.name}…</em>`,", "",
    "  onRowExpanded: (row, grid) => console.log('expanded', row),",
    "  onRowCollapsed: (row, grid) => console.log('collapsed', row)", "}", "</script>", "",
    "<ArcanaDataTable {config} />", "",
    "<!-- programmatic control (via the component's bind:this):",
    "     table.expandRow(row._uuid)",
    "     table.collapseRow(row._uuid)",
    "     table.getExpandedRows() -->"
  ].join("\n")
};

export const hooksCode = codePair(["mode: 'dataset',", "dataset: rows,", "ariaLabel: 'Employees table',", "onBeforeRowMounted: (row, grid) => ({ ...row, ready: true }),", "onBeforeCellMounted: (value, column, row, grid) => value,", "onBeforeHeaderCellMounted: (column, grid) => column.label,", "onBeforeCellStyleMounted: (value, column, row, grid) => ({ color: row.active ? 'green' : 'red' }),", "onBeforeCheckboxAndRadioButtonStyleMounted: (row, grid) => ({ background: '#eef2ff' }),", "columns"]);

export const fullConfigCode: SnippetPair = (() => {
  const body = [
    "const config = {", "  mode: 'remote',", "  columns,", "  datasource,", "  rowsPerPage: 10,",
    "  searchEnabled: true,", "  orderByEnabled: true,", "  checkboxEnabled: false,",
    "  radioButtonSelectionEnabled: false,", "  footerSummarizerEnabled: false,",
    "  responsiveMode: 'HORIZONTAL_OVERFLOW',", "  stickyHeaderEnabled: false,",
    "  sendRequestOnMounted: true,", "  initialFilters: {},",
    "  onRequestError: (error) => reportError(error)", "}"
  ].join("\n");
  return { react: body, vue: body, angular: body, svelte: body };
})();

const controllerMethodLines = [
  "// data", "controller.refresh()", "controller.setRows(rows)", "controller.setDataset(rows)",
  "controller.getDataset()", "controller.getRows()", "",
  "// row-level mutations", "controller.addRow(row)", "controller.updateRow(uuid, patch)", "controller.removeRow(uuid)", "",
  "// selection", "controller.getCheckedRows()", "controller.clearCheckedRows()", "",
  "// filters, pagination and sorting", "controller.setFilter(name, value)", "controller.setFilters(filters)",
  "controller.paginate(page, size)", "controller.applyOrderBy({ name: 'amount', direction: 'desc' })",
  "controller.applyOrderBy(null) // clears the sorting", "",
  "// expandable rows", "controller.expandRow(uuid)", "controller.collapseRow(uuid)", "controller.getExpandedRows()", "",
  "// totals", "controller.getSummarizedValue(column)"
];

export const controllerCode: SnippetPair = {
  react: [
    "import { useRef } from 'react'", "import { ArcanaDataTable } from '@arcanalabs/datatable/react'", "",
    "export function Invoices() {", "  const table = useRef(null)", "", "  return (", "    <>",
    "      <button onClick={() => table.current?.refresh()}>", "        Refresh", "      </button>",
    "      <ArcanaDataTable ref={table} config={config} />", "    </>", "  )", "}", "",
    "// the controller is the component ref itself", "const controller = table.current", "",
    ...controllerMethodLines
  ].join("\n"),
  vue: [
    "<script setup lang=\"ts\">", "import { ref } from 'vue'", "import { ArcanaDataTable } from '@arcanalabs/datatable/vue'", "",
    "const table = ref()", "",
    "// the controller is the component ref itself", "const controller = table.value", "",
    ...controllerMethodLines, "</script>", "",
    "<template>", "  <button @click=\"table?.refresh()\">Refresh</button>",
    "  <ArcanaDataTable ref=\"table\" :config=\"config\" />", "</template>"
  ].join("\n"),
  angular: [
    "import { Component, ViewChild } from '@angular/core'",
    "import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'", "",
    "@Component({",
    "  selector: 'app-invoices-toolbar',",
    "  standalone: true,",
    "  imports: [ArcanaDataTableComponent],",
    "  template: `",
    "    <button (click)=\"table.api.refresh()\">Refresh</button>",
    "    <arcana-data-table #table [config]=\"config\" />",
    "  `",
    "})",
    "export class InvoicesToolbarComponent {",
    "  @ViewChild('table') table!: ArcanaDataTableComponent",
    "}", "",
    "// the controller is the `api` exposed by the component (get api(): DataTableApi)",
    "const controller = this.table.api", "",
    ...controllerMethodLines
  ].join("\n"),
  svelte: [
    "<script lang=\"ts\">", "import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'", "",
    "let table", "",
    "// the component exports the methods directly: table.refresh(), table.getApi()…",
    "const controller = table", "",
    ...controllerMethodLines, "</script>", "",
    "<button onclick={() => table?.refresh()}>Refresh</button>",
    "<ArcanaDataTable bind:this={table} {config} />"
  ].join("\n")
};
