import type { Messages } from "./types";

export const en: Messages = {
  meta: { htmlLang: "en", locale: "en-US" },
  langName: "English",

  shell: {
    kicker: "Documentation · v1.x",
    lead: "A typed data table for Vue 3, React, Angular and Svelte. The same configuration, the same behavior, the same result — in any of the four frameworks.",
    navDocs: "Docs",
    navPlayground: "Playground",
    topNavAria: "Site areas",
    searchPlaceholder: "Search the docs… (⌘K)",
    searchAria: "Search the documentation",
    chooseFramework: "Choose framework",
    chooseLanguage: "Choose language",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    openSettings: "Open settings",
    closeSettings: "Close settings",
    sidebarAria: "Documentation navigation",
    noSectionsFound: "No sections found.",
    previewTab: "Preview",
    codeTab: "Code",
    codeOnlyLabel: "Code",
    defaultPreviewCaption: "real component · interact with it",
    sectionExampleAria: "{title} example",
    keyChipsAria: "Settings covered"
  },

  codeBlock: {
    copy: "Copy",
    copied: "Copied!"
  },

  groups: {
    gettingStarted: "Getting started",
    concepts: "Concepts",
    features: "Features",
    reference: "Reference"
  },

  sections: {
    install: {
      title: "Installation",
      p1: "The library ships as a single npm package. The React, Vue, Angular and Svelte adapters are exposed under separate subpaths (<c>@arcanalabs/datatable/react</c>, <c>@arcanalabs/datatable/vue</c>, <c>@arcanalabs/datatable/angular</c> and <c>@arcanalabs/datatable/svelte</c>), so your final bundle only carries the framework you actually use.",
      p2: "Install it with your package manager of choice and you are done — there are no transitive UI dependencies."
    },
    firstUse: {
      title: "First use",
      previewLabel: "real component · remote mode",
      p1: "The entire table behavior lives in a single <c>config</c> object. You declare the columns, point at the data source and render the <c>ArcanaDataTable</c> component — search, sorting and pagination already work without a single extra line.",
      p2: "The example alongside uses <c>remote</c> mode: on every user interaction, the table calls your <c>datasource</c> with the current parameters. The demo below does exactly that, with a local datasource simulating the API — search by name or sort the columns."
    },
    styles: {
      title: "Styles",
      p1: "The stylesheet is opt-in: import <c>@arcanalabs/datatable/styles.css</c> once, at the root of your application. It covers the table, the filters, the pagination and the loading states.",
      p2: "If you prefer your own look, simply skip the CSS import — the markup is semantic and stable, designed to be styled from the outside."
    },
    modes: {
      title: "Remote/dataset modes",
      intro: "There are two ways to feed the table, and this choice defines who does the filtering, sorting and pagination work:",
      liRemote: "<b>remote</b> — every filter, sort or page change triggers a call to <c>datasource(params)</c> (or to the configured <c>url</c>). The expected response has the shape <c>{ rows, total, page }</c>.",
      liDataset: "<b>dataset</b> — you hand over the full collection in memory and the table resolves everything locally, with zero requests.",
      rowOrigin: "Source",
      originDataset: "in-memory <c>dataset</c>",
      rowFilterSort: "Filtering / sorting",
      filterSortRemote: "on the server",
      filterSortDataset: "inside the table itself",
      rowRequests: "Requests",
      requestsRemote: "on every interaction",
      requestsDataset: "none",
      compare: "Compare both live — the counter shows how many requests <c>remote</c> mode has made so far:"
    },
    themes: {
      title: "Themes",
      previewLabel: "real component · switch the theme",
      p1: "The entire look of the grid is built on design tokens (the <c>--arcana-*</c> CSS variables), and the package ships four ready-made themes: <c>zinc</c> (the default light neutral), <c>ocean</c> (blues), <c>forest</c> (greens) and <c>midnight</c> (fully dark).",
      p2: "Pick one per table with <c>config.theme</c>, or set the global default with <c>setDefaultArcanaTheme(theme)</c> — used by every table without its own <c>theme</c> (<c>getDefaultArcanaTheme()</c> reads the current value). The theme is applied as the <c>arcana-theme-*</c> class on the root element and repeated on the panels portaled to the <c><body></c> (select, calendar and the context/sorting menus), which, being teleported, would not inherit the grid variables.",
      p3: "In the demo, open the Area filter or the Date calendar with the <c>midnight</c> theme to see the dark panels:",
      customHeading: "Creating your own theme",
      p4: "A theme is just a <c>arcana-theme-{name}</c> CSS class that overrides the <c>--arcana-*</c> tokens — any name works, not just the presets. Declare the class in your application's CSS and pass the name in <c>config.theme</c> (or in <c>setDefaultArcanaTheme</c>): the same class is applied automatically to the grid and to the portaled panels, so a single selector covers everything.",
      p5: "You don't need to redefine every token — start with the main ones and override the rest as needed; the full list sits at the top of the package's <c>styles.css</c>. The <c>candy</c> theme in the demo above is exactly this example, defined in this documentation's CSS, outside the package:"
    },
    localization: {
      title: "Localization (i18n)",
      previewLabel: "real component · switch the grid locale",
      p1: "Every built-in string of the grid — the pagination footer, the filter controls, the sort menu, the selection labels, the empty/loading states and the calendar — is localized. The package ships <b>8 locales</b>: <c>pt-BR</c> (the default, matching the historical behavior), <c>en</c>, <c>es</c>, <c>it</c>, <c>zh</c>, <c>ja</c>, <c>de</c> and <c>ru</c>.",
      p2: "Pick one per table with <c>config.locale</c>, or set the global default with <c>setDefaultArcanaLocale(locale)</c> — used by every table without its own <c>locale</c> (<c>getDefaultArcanaLocale()</c> reads the current value). It is the exact same pattern as the themes.",
      p3: "Any individual string can be replaced through <c>config.messages</c>, a partial map applied on top of the resolved pack — with or without a <c>locale</c>. The precedence is <c>messages</c> → <c>locale</c> → global default.",
      p4: "The month and weekday names in the calendar come from <c>Intl.DateTimeFormat</c>, so they follow the grid locale automatically. Switch the locale below and open the Date filter to see it:",
      pickerAria: "Choose grid locale",
      customLabel: "Custom messages (replaces the “Showing…” text)",
      customShowing: "✦ {from}–{to} of {total} records",
      keysTitle: "All customizable keys",
      keysIntro: "Every key below can be overridden individually through <c>messages</c> — the table shows the exact strings of the <c>en</c> pack and of the active pack. Templates keep their placeholders (<c>{from}</c>, <c>{to}</c>, <c>{total}</c>, <c>{count}</c>, <c>{label}</c>) when you replace them.",
      keysKeyCol: "Key"
    },
    columns: {
      title: "Columns",
      p1: "Each column is a <c>DataTableColumn</c> object with a <c>name</c> (the key on the row) and a <c>label</c> (the header text). Fields like <c>type</c> control formatting — for example, <c>CURRENCY</c> renders monetary values — and <c>valueGetter</c> transforms the cell content before rendering. String content renders as safe, escaped text by default; set <c>html: true</c> on the column to interpret it as HTML, or return a native node for rich content.",
      p2: "The <c>columns</c> property also accepts a <c>() => DataTableColumn[]</c> function, handy when the columns depend on permissions or on application state. Columns can be resized by dragging the right edge of their header — on by default (<c>columnResizeEnabled</c>); opt a single column out with <c>resizable: false</c>."
    },
    columnManagement: {
      title: "Reorder and pin columns",
      p1: "Drag a header cell sideways to reorder the columns — a drop indicator line shows exactly where the column will land. A short click still opens the sort menu and the right-edge resize handle keeps priority, so dragging never gets in the way. It is on by default (<c>columnReorderEnabled</c>); keep a single column locked in place with <c>reorderable: false</c>.",
      p2: "The header menu (the same one that carries the sort options) gains <i>Pin to left</i>, <i>Pin to right</i> and <i>Unpin</i>. A pinned column freezes to its edge and stays visible during horizontal scroll — pinned-left columns stick to the start, pinned-right to the end, with a subtle divider/shadow. Set it up front with <c>pinned: 'left'</c> or <c>pinned: 'right'</c> on the column, or change it at runtime from the menu; the system columns (checkbox/expander) freeze on the left and the actions column on the right. Both reorder and pin are disabled by <c>columnPinEnabled</c> and ignored in <c>VERTICAL_RECORD</c> responsive mode."
    },
    pagination: {
      title: "Pagination",
      p1: "Pagination is enabled by default with <c>rowsPerPage: 10</c>. In <c>remote</c> mode, the current page and the page size travel in the <c>params</c> sent to the <c>datasource</c>; the <c>total</c> returned by the response feeds the footer counter.",
      p2: "To navigate programmatically, use <c>controller.paginate(page, size)</c>. When the collection becomes empty, the table shows the <c>empty</c> message from the locale pack — customizable via <c>messages</c>:"
    },
    filters: {
      title: "Filters",
      p1: "Per-column search is active by default (<c>searchEnabled: true</c>). Each column with a <c>searchType</c> gets the appropriate control in the header; in <c>remote</c> mode, the filled-in values are sent inside the <c>params</c>.",
      p2: "Use <c>initialFilters</c> to apply filters on the very first query — with <c>disableFilterWhenPresentOnInitialFilters</c>, the matching control gets locked — and <c>setFilter</c> / <c>setFilters</c> on the controller to change them in response to actions in your application."
    },
    searchTypes: {
      title: "Search types",
      p1: "Each column's <c>searchType</c> defines the control shown to the user. There are seven types:",
      thControl: "Control",
      rows: {
        DATE: "Single date picker",
        DATE_MONTH: "Month/year picker (accounting period)",
        DATE_RANGE: "Range between two dates",
        BOOLEAN: "Yes/no toggle",
        LIST: "Fixed list of options",
        REMOTE: "Options loaded from an endpoint",
        COMPONENT: "Your own custom component"
      },
      p2: "All seven, side by side (scroll horizontally):"
    },
    sorting: {
      title: "Sorting",
      p1: "Per-column sorting is enabled by default (<c>orderByEnabled: true</c>): clicking the header opens a menu with <i>Ascending</i>, <i>Descending</i> and — when the column is already sorted — <i>Remove sorting</i>, which returns the grid to its neutral state. <b>Shift+click</b> a header instead to add that column to a <i>multi-column</i> sort, cycling it <i>ascending → descending → removed</i> while keeping the other sorted columns; a small priority badge (<c>1</c>, <c>2</c>, <c>3</c>…) shows the sort order, and headers expose <c>aria-sort</c>. In <c>remote</c> mode, the current sorting travels along in the <c>params</c>; in <c>dataset</c> mode, it is resolved in memory.",
      p2: "Disable it per column with <c>orderByEnabled: false</c> on the column definition, and use <c>filterName</c> as an alias for the field sent to the server. To apply a sort from code, use <c>controller.applyOrderBy(orderBy)</c> — which now also accepts an <c>OrderBy[]</c> for a full multi-column order (index 0 sorts first) — or <c>controller.toggleOrderBy(name, { additive })</c> to flip a single column."
    },
    checkbox: {
      title: "Multiple selection",
      p1: "With <c>checkboxEnabled: true</c>, each row gets a checkbox and the header lets you select the whole page. The selection survives page changes.",
      p2: "Control the initial state with <c>isRowChecked</c>, lock rows with <c>isCheckboxRowDisabled</c> and react to the <c>onRowChecked</c> / <c>onRowUnchecked</c> events. Read the checked rows with <c>getCheckedRows()</c> and clear everything with <c>clearCheckedRows()</c> — typical for batch actions like \"export selected\"."
    },
    radio: {
      title: "Single selection",
      p1: "When the flow calls for exactly one record — picking a customer in a dialog, for example — enable <c>radioButtonSelectionEnabled: true</c>. Each row shows a radio button and checking a row unchecks the previous one; <c>uniqueKeyIdentifier</c> defines the identity key.",
      p2: "The chosen row is also read via <c>getCheckedRows()</c>, which in this mode returns at most one item."
    },
    summary: {
      title: "Totals",
      p1: "With <c>footerSummarizerEnabled: true</c>, the table adds a footer row with the total of the numeric columns — <c>CURRENCY</c> columns are summed and formatted as currency. With <c>summarizeOnlyChecked</c>, only the selected rows enter the sum.",
      p2: "A column's consolidated value is also available from code, via <c>getSummarizedValue(column)</c>."
    },
    layout: {
      title: "Responsiveness",
      p1: "On narrow screens, choose the behavior with <c>responsiveMode</c>:",
      liOverflow: "<c>HORIZONTAL_OVERFLOW</c> — keeps the table structure and enables horizontal scrolling.",
      liVertical: "<c>VERTICAL_RECORD</c> — each row becomes a vertical card, with the column label next to each value.",
      p2: "For long lists, <c>stickyHeaderEnabled: true</c> keeps the header visible while scrolling, and <c>height</c> + <c>overflowEnabled</c> create a scrollable area:"
    },
    actions: {
      title: "Actions and events",
      p1: "The <c>actions</c> column renders per-row buttons — with conditional visibility via <c>isVisible</c> — and the <c>onClickRow</c>, <c>onDoubleClickRow</c>, <c>onClickCell</c>, <c>onDoubleClickCell</c> and <c>onContextMenu</c> events cover row and cell interactions. <c>rowFocusEnabled</c> and <c>cellFocusEnabled</c> provide the visual focus feedback.",
      p2: "The initial request happens on mount (<c>sendRequestOnMounted: true</c>); disable it when the table depends on a filter the user has yet to choose. <c>datasource</c> failures land in <c>onRequestError</c>."
    },
    expandable: {
      title: "Expandable rows",
      previewLabel: "real component · async renderer (~700ms)",
      p1: "With <c>expandableRowsEnabled: true</c>, each row gets a chevron button in the first column (before the checkbox, when there is one). Clicking it opens, right below, a full-width area with content entirely yours, rendered by <c>expandedRowRenderer(row, grid)</c> — several rows can stay open at the same time, and changing the page or the dataset collapses everything.",
      p2: "The renderer can be <b>synchronous</b> — returns the content directly, using the row's own data — or <b>asynchronous</b> — returns a <c>Promise</c> (an API call, for example). In the async case, the area shows a loading state until the Promise resolves; the built-in default (spinner + \"Loading details…\") can be replaced with <c>expandedRowLoadingRenderer</c>. Reopening a row re-runs the renderer, guaranteeing fresh data; if the Promise rejects, the area shows a discreet warning.",
      p3: "With <c>expandRowOnClick: true</c>, clicking anywhere on the row also toggles the expansion — without interfering with <c>onClickRow</c>, which keeps firing. And the controller exposes programmatic control: <c>expandRow(uuid)</c>, <c>collapseRow(uuid)</c> and <c>getExpandedRows()</c>.",
      p4: "In the demo, the async renderer simulates an API with a ~700ms delay — notice the loading state before the mini profile appears:"
    },
    hooks: {
      title: "Hooks",
      p1: "The rendering hooks transform rows, cells, headers and styles right before mounting: <c>onBeforeRowMounted</c> adjusts the whole row, <c>onBeforeCellMounted</c> and <c>onBeforeHeaderCellMounted</c> swap the content, and <c>onBeforeCellStyleMounted</c> returns per-cell styles.",
      p2: "In the demo, the \"Situation\" column is derived from <c>active</c> in <c>onBeforeRowMounted</c> and colored in <c>onBeforeCellStyleMounted</c>:"
    },
    properties: {
      title: "Properties",
      intro: "All the most frequently used properties of the <c>config</c> object — the TypeScript definition exported by the package is the source of truth:",
      thProperty: "Property",
      thType: "Type",
      thDefault: "Default",
      thDescription: "Description",
      tip: "<b>Tip:</b> declare only what differs from the defaults — a <c>config</c> with <c>columns</c> and <c>datasource</c> is already a complete table.",
      defaults: {
        inferred: "inferred",
        builtIn: "built-in"
      },
      descriptions: {
        mode: "Defines where filters, sorting and pagination are executed.",
        theme: "Visual theme of the grid and the portaled panels — a preset or the name of your own theme (arcana-theme-{name} class); the global default changes with setDefaultArcanaTheme.",
        locale: "Locale of the grid's built-in strings (8 shipped packs); the global default changes with setDefaultArcanaLocale.",
        messages: "Per-key overrides of the built-in strings, applied on top of the resolved locale pack.",
        dataset: "Full collection for local operations; infers dataset mode.",
        columns: "Visible columns and their renderers.",
        html: "When true, the column's string content (raw value or valueGetter/headerContentGetter return) is interpreted as HTML; otherwise it renders as safe, escaped text. Return a native node for rich content.",
        datasource: "Provider queried in remote mode.",
        url: "Endpoint used in remote mode without a datasource.",
        rowsPerPage: "Initial amount per page.",
        searchEnabled: "Shows the per-column filters.",
        orderByEnabled: "Enables sorting on the headers.",
        checkboxEnabled: "Enables multiple selection.",
        radioButtonSelectionEnabled: "Enables single selection.",
        footerSummarizerEnabled: "Shows numeric totals.",
        expandableRowsEnabled: "Adds the chevron column and enables the per-row details area.",
        expandedRowRenderer: "Content of the expanded area; an async return shows the loading state until it resolves.",
        expandedRowLoadingRenderer: "Replaces the default loading state shown while the async renderer resolves.",
        expandRowOnClick: "Clicking anywhere on the row also toggles the expansion (onClickRow keeps firing).",
        onRowExpandedCollapsed: "Notify the expansion and the collapse of each row.",
        responsiveMode: "Defines the mobile presentation.",
        stickyHeaderEnabled: "Keeps the header while scrolling.",
        columnResizeEnabled: "Enables drag-to-resize handles on the column headers.",
        resizable: "Lets this column be resized by dragging its header edge.",
        columnReorderEnabled: "Enables drag-to-reorder by dragging the header body (ignored in VERTICAL_RECORD).",
        reorderable: "Lets this column be dragged to a new position; set false to keep it fixed.",
        pinned: "Freezes this column to an edge (sticky during horizontal scroll); changeable from the header menu.",
        sendRequestOnMounted: "Controls the first remote query.",
        initialFilters: "Initial remote or local filters.",
        onRequestError: "Notifies loading failures."
      }
    },
    methods: {
      title: "Controller methods",
      p1: "The <b>controller</b> is the instance that exposes the table's programmatic methods. Grab it with a <c>ref</c> pointed at the component — each framework's idiomatic pattern — and call any method from your UI.",
      p2: "The signatures below come from the <c>DataTableApi</c> interface exported by the package. <c>Row</c> is the generic row type (<c>DataTableRow</c> by default) and <c>OrderBy</c> is <c>{ name: string; direction: 'asc' | 'desc' }</c>.",
      docs: {
        refresh: {
          description: "Re-runs the current query, preserving filters, sorting and page (shortcut for fetch())."
        },
        setRows: {
          description: "Replaces the rows shown on the current page and updates the total; in dataset mode it delegates to setDataset. Returns the normalized rows.",
          params: { rows: "new rows for the current page." }
        },
        setDataset: {
          description: "Replaces the full collection and goes back to page 1; available only in dataset mode (throws in remote mode). Returns the normalized dataset.",
          params: { rows: "full collection kept in memory." }
        },
        getDataset: {
          description: "Returns a copy of the dataset mode's full collection (empty array in remote mode)."
        },
        addRow: {
          description: "Appends a row to the end of the collection (dataset) or of the current page (remote), incrementing the total.",
          params: { row: "row to insert; it automatically receives an internal _uuid." }
        },
        updateRow: {
          description: "Applies a partial patch to the identified row, preserving the remaining fields.",
          params: {
            uuid: "the row's internal _uuid (generated during normalization).",
            row: "fields to overwrite on the row."
          }
        },
        removeRow: {
          description: "Removes the identified row and decrements the total.",
          params: { uuid: "the row's internal _uuid." }
        },
        getRows: {
          description: "Returns the currently rendered rows (the visible page)."
        },
        getCheckedRows: {
          description: "Returns the rows with a checked checkbox — in dataset mode, it considers the full collection, not just the page."
        },
        clearCheckedRows: {
          description: "Unchecks the checkbox of every row."
        },
        setFilter: {
          description: "Sets a filter, goes back to page 1 and re-queries (remote) or recalculates locally (dataset).",
          params: {
            name: "filter name (the column's filterName ?? name).",
            value: "filter value; null, '' or [] clear the filter."
          }
        },
        setFilters: {
          description: "Applies several filters at once, with a single re-query at the end.",
          params: { filters: "name → value map; empty values clear the corresponding filter." }
        },
        paginate: {
          description: "Navigates to the given page and adjusts the page size (minimum 1 for both).",
          params: {
            page: "target page (1-based).",
            rowsPerPage: "number of rows per page."
          }
        },
        applyOrderBy: {
          description: "Applies the sorting and goes back to page 1; passing null removes the sorting and returns the grid to its neutral state.",
          params: { orderBy: "a { name: string; direction: 'asc' | 'desc' } object, or null to clear." }
        },
        expandRow: {
          description: "Expands the identified row, rendering the details area right below it (requires expandableRowsEnabled). Ignored when the row is already expanded or is not on the current page.",
          params: { uuid: "the row's internal _uuid (generated during normalization)." }
        },
        collapseRow: {
          description: "Collapses the identified row, removing the details area; ignored when the row is not expanded.",
          params: { uuid: "the row's internal _uuid." }
        },
        getExpandedRows: {
          description: "Returns the rows currently expanded on the visible page — changing the page or the dataset collapses everything."
        },
        getSummarizedValue: {
          description: "Sums the column's values across the current rows and returns { raw, formatted }; null when the column is not summable (no numeric type nor summarizerValueGetter).",
          params: {
            column: "column to total.",
            onlyIsChecked: "combined with summarizeOnlyChecked, restricts the sum to the checked rows."
          }
        }
      }
    }
  },

  playground: {
    panelAria: "Playground settings",
    settings: "Settings",
    reset: "Reset",
    groupData: "Data",
    groupFeatures: "Features",
    groupExpandable: "Expandable rows",
    groupLayout: "Layout",
    groupTheme: "Theme",
    groupLocalization: "Localization",
    localeAuto: "follow the docs language",
    addOverride: "Add override…",
    removeOverride: "Remove {key} override",
    emptyDataset: "Empty dataset",
    emptyDatasetHint: "shows the empty-state message",
    checkboxHint: "excludes single selection",
    radioHint: "excludes multiple selection",
    actionsHint: "per-row “Open” button",
    renderer: "Renderer",
    rendererSync: "synchronous",
    rendererAsync: "asynchronous (700ms)",
    customLoading: "Custom loading",
    heightHint: "works together with overflowEnabled",
    themePickerAria: "Choose theme",
    stageCaption: "real component · reacts to every setting",
    initialEvent: "Click a table action",
    openAction: "Open",
    openEvent: "Open {name}",
    customLoadingText: "Preparing {name}'s profile…",
    generatedCode: "Generated code",
    codeNote: "only what differs from the defaults",
    tableAria: "Arcana DataTable playground",
    infoAria: "About {label}",
    hints: {
      rowsPerPage: "Rows shown per page.",
      messages: "Overrides individual texts from the locale pack; the placeholder shows the current pack value.",
      searchEnabled: "Search field above the table.",
      orderByEnabled: "Click a header to sort by that column.",
      footerSummarizerEnabled: "Totals summarized in the footer.",
      summarizeOnlyChecked: "Summarizes only the checked rows.",
      rowFocusEnabled: "Highlights the row under the cursor.",
      cellFocusEnabled: "Highlights the focused cell.",
      expandableRowsEnabled: "Rows can expand to show details.",
      expandRowOnClick: "Expands when clicking anywhere on the row.",
      renderer: "Immediate content or resolved via Promise.",
      customLoading: "Custom loading state in async mode.",
      stickyHeaderEnabled: "Header stays visible while scrolling.",
      columnResizeEnabled: "Drag the header edges to resize columns.",
      columnReorderEnabled: "Drag a header to reorder the columns.",
      pinColumns: "Pins the first column to the left and the last to the right.",
      overflowEnabled: "The body scrolls instead of growing.",
      responsiveMode: "Behavior on narrow screens.",
      footerVisible: "Shows the footer with pagination.",
      isRowsPerPageVisible: "Rows-per-page selector in the footer.",
      calculateCellWidth: "Column widths computed from content.",
      theme: "Visual palette of the table.",
      locale: "Language of the table's built-in texts."
    }
  },

  demos: {
    departments: {
      engineering: "Engineering",
      research: "Research",
      product: "Product",
      editorial: "Editorial",
      infrastructure: "Infrastructure"
    },
    statuses: {
      active: "Active",
      inReview: "Under review",
      inactive: "Inactive"
    },
    available: "Available",
    unavailable: "Unavailable",
    cols: {
      id: "ID",
      name: "Name",
      email: "Email",
      area: "Area",
      status: "Status",
      joinedAt: "Hired on",
      amount: "Amount",
      score: "Score",
      client: "Client",
      department: "Department",
      person: "Person",
      situation: "Situation",
      date: "Date",
      month: "Month",
      period: "Period",
      boolean: "Boolean",
      list: "List",
      remoteList: "Remote list",
      custom: "Custom",
      code: "Code",
      totalSelected: "Selected total",
      points: "Points"
    },
    requestsLabel: "{n} request(s)",
    zeroRequests: "zero requests",
    emptyStateTest: "Try the empty state",
    restoreDataset: "Restore dataset",
    paginationEmpty: "No employees in this slice.",
    customFilter: "Your own filter",
    checkboxInitial: "Select a row",
    checkedEvent: "{name} selected",
    uncheckedEvent: "{name} removed",
    checkboxChanged: "Checkbox changed: {name}",
    radioInitial: "No row chosen",
    radioChosen: "Chosen: {name}",
    radioRemoved: "Removed: {name}",
    radioChanged: "Radio changed: {name}",
    actionsInitial: "Click a row, cell or action",
    open: "Open",
    openEvent: "Open {name}",
    rowClick: "Click: {name}",
    rowDblClick: "Double click: {name}",
    cellClick: "Cell {column}: {name}",
    cellDblClick: "Double click on {column}: {name}",
    ctxCopy: "Copy {column}",
    ctxCopied: "Copied from {name}",
    card: {
      email: "Email",
      area: "Area",
      score: "Score",
      joined: "Hired on",
      pts: "pts"
    },
    aria: {
      firstUse: "Arcana DataTable first use",
      themes: "Themes demonstration",
      themePicker: "Choose theme",
      expandable: "Expandable row demonstration",
      hooks: "Rendering hooks example"
    }
  }
};
