/**
 * Complete, typed message catalog for the docs.
 *
 * Every language file exports a `Messages` object — the typecheck guarantees
 * parity between languages: a missing or extra key fails `npm run typecheck`.
 *
 * Prose strings may carry minimal inline markup, interpreted by the mini
 * renderer in `index.ts`:
 *   <c>…</c> → inline code   ·   <b>…</b> → strong   ·   <i>…</i> → emphasis
 * Placeholders like {name}, {n}, {column} are replaced via `fmt()`.
 */

export type Lang = "en" | "pt-BR" | "es" | "it" | "zh" | "ja" | "de" | "ru";

export type PropertyKey =
  | "mode"
  | "theme"
  | "locale"
  | "messages"
  | "dataset"
  | "columns"
  | "html"
  | "datasource"
  | "url"
  | "rowsPerPage"
  | "searchEnabled"
  | "orderByEnabled"
  | "checkboxEnabled"
  | "radioButtonSelectionEnabled"
  | "footerSummarizerEnabled"
  | "expandableRowsEnabled"
  | "expandedRowRenderer"
  | "expandedRowLoadingRenderer"
  | "expandRowOnClick"
  | "onRowExpandedCollapsed"
  | "responsiveMode"
  | "stickyHeaderEnabled"
  | "columnResizeEnabled"
  | "resizable"
  | "columnReorderEnabled"
  | "reorderable"
  | "pinned"
  | "sendRequestOnMounted"
  | "initialFilters"
  | "onRequestError";

export type MethodKey =
  | "refresh"
  | "setRows"
  | "setDataset"
  | "getDataset"
  | "addRow"
  | "updateRow"
  | "removeRow"
  | "getRows"
  | "getCheckedRows"
  | "clearCheckedRows"
  | "setFilter"
  | "setFilters"
  | "paginate"
  | "applyOrderBy"
  | "expandRow"
  | "collapseRow"
  | "getExpandedRows"
  | "getSummarizedValue";

export type SearchTypeKey = "DATE" | "DATE_MONTH" | "DATE_RANGE" | "BOOLEAN" | "LIST" | "REMOTE" | "COMPONENT";

export interface MethodMsg {
  description: string;
  /** Param descriptions keyed by param name (types live in the static metadata). */
  params?: Record<string, string>;
}

export interface SectionProse {
  title: string;
  p1: string;
  p2: string;
}

export interface Messages {
  meta: {
    /** BCP-47 tag applied to <html lang>. */
    htmlLang: string;
    /** Locale used for locale-aware formatting in the demos. */
    locale: string;
  };
  /** Language name written in the language itself (shown in the switcher). */
  langName: string;

  shell: {
    kicker: string;
    lead: string;
    navDocs: string;
    navPlayground: string;
    topNavAria: string;
    searchPlaceholder: string;
    searchAria: string;
    chooseFramework: string;
    chooseLanguage: string;
    openNav: string;
    closeNav: string;
    openSettings: string;
    closeSettings: string;
    sidebarAria: string;
    noSectionsFound: string;
    previewTab: string;
    codeTab: string;
    codeOnlyLabel: string;
    defaultPreviewCaption: string;
    /** aria-label of a section's Preview/Code tablist; {title} placeholder. */
    sectionExampleAria: string;
    keyChipsAria: string;
  };

  codeBlock: {
    copy: string;
    copied: string;
  };

  groups: {
    gettingStarted: string;
    concepts: string;
    features: string;
    reference: string;
  };

  sections: {
    install: SectionProse;
    firstUse: SectionProse & { previewLabel: string };
    styles: SectionProse;
    modes: {
      title: string;
      intro: string;
      liRemote: string;
      liDataset: string;
      rowOrigin: string;
      originDataset: string;
      rowFilterSort: string;
      filterSortRemote: string;
      filterSortDataset: string;
      rowRequests: string;
      requestsRemote: string;
      requestsDataset: string;
      compare: string;
    };
    themes: {
      title: string;
      previewLabel: string;
      p1: string;
      p2: string;
      p3: string;
      customHeading: string;
      p4: string;
      p5: string;
    };
    localization: {
      title: string;
      previewLabel: string;
      p1: string;
      p2: string;
      p3: string;
      p4: string;
      /** aria-label of the demo's locale picker. */
      pickerAria: string;
      /** Label of the demo's "custom messages" toggle. */
      customLabel: string;
      /** Custom showingRange template used by the demo; {from} {to} {total}. */
      customShowing: string;
      /** Heading of the "all customizable keys" reference table. */
      keysTitle: string;
      /** Intro paragraph above the keys table (mentions placeholders). */
      keysIntro: string;
      /** First column header of the keys table. */
      keysKeyCol: string;
    };
    columns: SectionProse;
    columnManagement: SectionProse;
    pagination: SectionProse;
    filters: SectionProse;
    searchTypes: {
      title: string;
      p1: string;
      thControl: string;
      rows: Record<SearchTypeKey, string>;
      p2: string;
    };
    sorting: SectionProse;
    checkbox: SectionProse;
    radio: SectionProse;
    summary: SectionProse;
    layout: {
      title: string;
      p1: string;
      liOverflow: string;
      liVertical: string;
      p2: string;
    };
    actions: SectionProse;
    expandable: {
      title: string;
      previewLabel: string;
      p1: string;
      p2: string;
      p3: string;
      p4: string;
    };
    hooks: SectionProse;
    properties: {
      title: string;
      intro: string;
      thProperty: string;
      thType: string;
      thDefault: string;
      thDescription: string;
      tip: string;
      defaults: {
        inferred: string;
        builtIn: string;
      };
      descriptions: Record<PropertyKey, string>;
    };
    methods: {
      title: string;
      p1: string;
      p2: string;
      docs: Record<MethodKey, MethodMsg>;
    };
  };

  playground: {
    panelAria: string;
    settings: string;
    reset: string;
    groupData: string;
    groupFeatures: string;
    groupExpandable: string;
    groupLayout: string;
    groupTheme: string;
    groupLocalization: string;
    /** Option label for the locale knob that follows the docs language. */
    localeAuto: string;
    /** Placeholder + aria-label of the "add message override" select. */
    addOverride: string;
    /** aria-label of an override's remove (✕) button; {key} placeholder. */
    removeOverride: string;
    emptyDataset: string;
    emptyDatasetHint: string;
    checkboxHint: string;
    radioHint: string;
    actionsHint: string;
    renderer: string;
    rendererSync: string;
    rendererAsync: string;
    customLoading: string;
    heightHint: string;
    themePickerAria: string;
    stageCaption: string;
    initialEvent: string;
    openAction: string;
    /** {name} */
    openEvent: string;
    /** {name} */
    customLoadingText: string;
    generatedCode: string;
    codeNote: string;
    tableAria: string;
    /** aria-label of a knob's ⓘ info button; {label} placeholder. */
    infoAria: string;
    /**
     * Tooltip descriptions for knobs that don't already have a dedicated
     * hint above (those reuse emptyDatasetHint/checkboxHint/radioHint/
     * actionsHint/heightHint).
     */
    hints: {
      rowsPerPage: string;
      messages: string;
      searchEnabled: string;
      orderByEnabled: string;
      footerSummarizerEnabled: string;
      summarizeOnlyChecked: string;
      rowFocusEnabled: string;
      cellFocusEnabled: string;
      expandableRowsEnabled: string;
      expandRowOnClick: string;
      renderer: string;
      customLoading: string;
      stickyHeaderEnabled: string;
      columnResizeEnabled: string;
      columnReorderEnabled: string;
      pinColumns: string;
      overflowEnabled: string;
      responsiveMode: string;
      footerVisible: string;
      isRowsPerPageVisible: string;
      calculateCellWidth: string;
      theme: string;
      locale: string;
    };
  };

  demos: {
    departments: {
      engineering: string;
      research: string;
      product: string;
      editorial: string;
      infrastructure: string;
    };
    statuses: {
      active: string;
      inReview: string;
      inactive: string;
    };
    available: string;
    unavailable: string;
    cols: {
      id: string;
      name: string;
      email: string;
      area: string;
      status: string;
      joinedAt: string;
      amount: string;
      score: string;
      client: string;
      department: string;
      person: string;
      situation: string;
      date: string;
      month: string;
      period: string;
      boolean: string;
      list: string;
      remoteList: string;
      custom: string;
      code: string;
      totalSelected: string;
      points: string;
    };
    /** {n} */
    requestsLabel: string;
    zeroRequests: string;
    emptyStateTest: string;
    restoreDataset: string;
    paginationEmpty: string;
    customFilter: string;
    checkboxInitial: string;
    /** {name} */
    checkedEvent: string;
    /** {name} */
    uncheckedEvent: string;
    /** {name} */
    checkboxChanged: string;
    radioInitial: string;
    /** {name} */
    radioChosen: string;
    /** {name} */
    radioRemoved: string;
    /** {name} */
    radioChanged: string;
    actionsInitial: string;
    open: string;
    /** {name} */
    openEvent: string;
    /** {name} */
    rowClick: string;
    /** {name} */
    rowDblClick: string;
    /** {column} {name} */
    cellClick: string;
    /** {column} {name} */
    cellDblClick: string;
    /** {column} */
    ctxCopy: string;
    /** {name} */
    ctxCopied: string;
    card: {
      email: string;
      area: string;
      score: string;
      joined: string;
      pts: string;
    };
    aria: {
      firstUse: string;
      themes: string;
      themePicker: string;
      expandable: string;
      hooks: string;
    };
  };
}
