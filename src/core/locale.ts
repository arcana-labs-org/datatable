import { MONTH_LABELS, MONTH_LABELS_SHORT, WEEKDAY_LABELS } from "./calendar";

/**
 * Localization of the grid's built-in strings.
 *
 * Mirrors the theme registry pattern (`core/theme.ts`): the packs ship with
 * the library, `setDefaultArcanaLocale` sets a global default (initially
 * `pt-BR`, the historical behavior) and each table may override it via
 * `config.locale`. Any individual string can also be replaced through
 * `config.messages` (a `Partial<ArcanaMessages>`), which wins over the packs.
 *
 * Resolution order (per key): `config.messages` > `config.locale` pack >
 * global default locale pack.
 */

export type ArcanaLocale = "pt-BR" | "en" | "es" | "it" | "zh" | "ja" | "de" | "ru";

/** Every built-in string rendered by the grid and its filter controls. */
export interface ArcanaMessages {
  /** Error banner when the request/datasource fails. */
  loadError: string;
  /** Status shown while the first page loads. */
  loading: string;
  /** Empty state shown when the collection has no records. */
  empty: string;
  /** Default `aria-label` of the grid root (when `config.ariaLabel` is absent). */
  gridLabel: string;
  /** Header of the actions column. */
  actions: string;
  /** aria-label of the header "select all" checkbox. */
  selectAll: string;
  /** aria-label of the per-row checkbox/radio. */
  selectRow: string;
  /** aria-label of the collapsed expander chevron. */
  expandRow: string;
  /** aria-label of the expanded expander chevron. */
  collapseRow: string;
  /** Built-in loading state of the async expanded row renderer. */
  expandedLoading: string;
  /** Copy shown when the async expanded row renderer rejects. */
  expandedError: string;
  /** Label of the page-size select ("Por página:"). */
  perPage: string;
  /** Footer range info; placeholders: {from} {to} {total}. */
  showingRange: string;
  /** Footer selected-rows counter; placeholder: {count}. */
  selectedCount: string;
  /** aria-label of the pagination list. */
  pagination: string;
  /** aria-label of the previous-page button. */
  previousPage: string;
  /** aria-label of the next-page button. */
  nextPage: string;
  /** aria-label of the column sort menu. */
  sortMenu: string;
  /** Sort menu: ascending option. */
  sortAscending: string;
  /** Sort menu: descending option. */
  sortDescending: string;
  /** Sort menu: clear sorting option. */
  sortClear: string;
  /** Header menu: pin the column to the left edge. */
  pinLeft: string;
  /** Header menu: pin the column to the right edge. */
  pinRight: string;
  /** Header menu: remove the column's pin. */
  unpin: string;
  /** aria-label of a column filter control; placeholder: {label}. */
  filterLabel: string;
  /** BOOLEAN filter: "all" option (also the list filters' placeholder). */
  booleanAll: string;
  /** BOOLEAN filter: yes option. */
  booleanYes: string;
  /** BOOLEAN filter: no option. */
  booleanNo: string;
  /** Select: default placeholder. */
  selectPlaceholder: string;
  /** Select: search input placeholder. */
  searchPlaceholder: string;
  /** Select (multiple): trigger label when the labels are unknown; placeholder: {count}. */
  selectedCountFallback: string;
  /** Select (multiple): trigger label for 2+ known selections; placeholder: {count}. */
  selectedItems: string;
  /** Select: empty search result. */
  noResults: string;
  /** Select: no options at all. */
  noOptions: string;
  /** aria-label of the clear (×) affordance on select/calendar. */
  clear: string;
  /** Date input placeholder. */
  datePlaceholder: string;
  /** Month input placeholder. */
  monthPlaceholder: string;
  /** Range input placeholder. */
  rangePlaceholder: string;
  /** Calendar: previous year («) aria-label. */
  prevYear: string;
  /** Calendar: previous month (‹) aria-label. */
  prevMonth: string;
  /** Calendar: next month (›) aria-label. */
  nextMonth: string;
  /** Calendar: next year (») aria-label. */
  nextYear: string;
}

const ptBR: ArcanaMessages = {
  loadError: "Não foi possível carregar os dados.",
  loading: "Carregando…",
  empty: "Nenhum registro encontrado.",
  gridLabel: "Tabela de dados",
  actions: "Ações",
  selectAll: "Selecionar todos",
  selectRow: "Selecionar linha",
  expandRow: "Expandir detalhes",
  collapseRow: "Recolher detalhes",
  expandedLoading: "Carregando detalhes…",
  expandedError: "Não foi possível carregar os detalhes.",
  perPage: "Por página:",
  showingRange: "Exibindo {from} a {to} de {total}",
  selectedCount: "{count} selecionado(s)",
  pagination: "Paginação",
  previousPage: "Página anterior",
  nextPage: "Próxima página",
  sortMenu: "Ordenação",
  sortAscending: "Crescente",
  sortDescending: "Decrescente",
  sortClear: "Remover ordem",
  pinLeft: "Fixar à esquerda",
  pinRight: "Fixar à direita",
  unpin: "Desafixar",
  filterLabel: "Filtrar {label}",
  booleanAll: "Todos",
  booleanYes: "Sim",
  booleanNo: "Não",
  selectPlaceholder: "Selecione…",
  searchPlaceholder: "Buscar...",
  selectedCountFallback: "{count} selecionado(s)",
  selectedItems: "{count} selecionados",
  noResults: "Nenhum resultado",
  noOptions: "Nenhuma opção",
  clear: "Limpar",
  datePlaceholder: "dd/mm/aaaa",
  monthPlaceholder: "mm/aaaa",
  rangePlaceholder: "Início → Fim",
  prevYear: "Ano anterior",
  prevMonth: "Mês anterior",
  nextMonth: "Próximo mês",
  nextYear: "Próximo ano"
};

const en: ArcanaMessages = {
  loadError: "Could not load the data.",
  loading: "Loading…",
  empty: "No records found.",
  gridLabel: "Data table",
  actions: "Actions",
  selectAll: "Select all",
  selectRow: "Select row",
  expandRow: "Expand details",
  collapseRow: "Collapse details",
  expandedLoading: "Loading details…",
  expandedError: "Could not load the details.",
  perPage: "Per page:",
  showingRange: "Showing {from} to {to} of {total}",
  selectedCount: "{count} selected",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  sortMenu: "Sorting",
  sortAscending: "Ascending",
  sortDescending: "Descending",
  sortClear: "Clear sorting",
  pinLeft: "Pin to left",
  pinRight: "Pin to right",
  unpin: "Unpin",
  filterLabel: "Filter {label}",
  booleanAll: "All",
  booleanYes: "Yes",
  booleanNo: "No",
  selectPlaceholder: "Select…",
  searchPlaceholder: "Search...",
  selectedCountFallback: "{count} selected",
  selectedItems: "{count} selected",
  noResults: "No results",
  noOptions: "No options",
  clear: "Clear",
  datePlaceholder: "dd/mm/yyyy",
  monthPlaceholder: "mm/yyyy",
  rangePlaceholder: "Start → End",
  prevYear: "Previous year",
  prevMonth: "Previous month",
  nextMonth: "Next month",
  nextYear: "Next year"
};

const es: ArcanaMessages = {
  loadError: "No fue posible cargar los datos.",
  loading: "Cargando…",
  empty: "No se encontraron registros.",
  gridLabel: "Tabla de datos",
  actions: "Acciones",
  selectAll: "Seleccionar todo",
  selectRow: "Seleccionar fila",
  expandRow: "Expandir detalles",
  collapseRow: "Contraer detalles",
  expandedLoading: "Cargando detalles…",
  expandedError: "No fue posible cargar los detalles.",
  perPage: "Por página:",
  showingRange: "Mostrando {from} a {to} de {total}",
  selectedCount: "{count} seleccionado(s)",
  pagination: "Paginación",
  previousPage: "Página anterior",
  nextPage: "Página siguiente",
  sortMenu: "Ordenación",
  sortAscending: "Ascendente",
  sortDescending: "Descendente",
  sortClear: "Quitar orden",
  pinLeft: "Fijar a la izquierda",
  pinRight: "Fijar a la derecha",
  unpin: "Quitar fijación",
  filterLabel: "Filtrar {label}",
  booleanAll: "Todos",
  booleanYes: "Sí",
  booleanNo: "No",
  selectPlaceholder: "Seleccione…",
  searchPlaceholder: "Buscar...",
  selectedCountFallback: "{count} seleccionado(s)",
  selectedItems: "{count} seleccionados",
  noResults: "Sin resultados",
  noOptions: "Sin opciones",
  clear: "Limpiar",
  datePlaceholder: "dd/mm/aaaa",
  monthPlaceholder: "mm/aaaa",
  rangePlaceholder: "Inicio → Fin",
  prevYear: "Año anterior",
  prevMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  nextYear: "Año siguiente"
};

const it: ArcanaMessages = {
  loadError: "Impossibile caricare i dati.",
  loading: "Caricamento…",
  empty: "Nessun record trovato.",
  gridLabel: "Tabella dati",
  actions: "Azioni",
  selectAll: "Seleziona tutto",
  selectRow: "Seleziona riga",
  expandRow: "Espandi dettagli",
  collapseRow: "Comprimi dettagli",
  expandedLoading: "Caricamento dettagli…",
  expandedError: "Impossibile caricare i dettagli.",
  perPage: "Per pagina:",
  showingRange: "Da {from} a {to} di {total}",
  selectedCount: "{count} selezionati",
  pagination: "Paginazione",
  previousPage: "Pagina precedente",
  nextPage: "Pagina successiva",
  sortMenu: "Ordinamento",
  sortAscending: "Crescente",
  sortDescending: "Decrescente",
  sortClear: "Rimuovi ordinamento",
  pinLeft: "Blocca a sinistra",
  pinRight: "Blocca a destra",
  unpin: "Sblocca",
  filterLabel: "Filtra {label}",
  booleanAll: "Tutti",
  booleanYes: "Sì",
  booleanNo: "No",
  selectPlaceholder: "Seleziona…",
  searchPlaceholder: "Cerca...",
  selectedCountFallback: "{count} selezionati",
  selectedItems: "{count} selezionati",
  noResults: "Nessun risultato",
  noOptions: "Nessuna opzione",
  clear: "Cancella",
  datePlaceholder: "gg/mm/aaaa",
  monthPlaceholder: "mm/aaaa",
  rangePlaceholder: "Inizio → Fine",
  prevYear: "Anno precedente",
  prevMonth: "Mese precedente",
  nextMonth: "Mese successivo",
  nextYear: "Anno successivo"
};

const zh: ArcanaMessages = {
  loadError: "无法加载数据。",
  loading: "加载中…",
  empty: "未找到记录。",
  gridLabel: "数据表格",
  actions: "操作",
  selectAll: "全选",
  selectRow: "选择行",
  expandRow: "展开详情",
  collapseRow: "收起详情",
  expandedLoading: "正在加载详情…",
  expandedError: "无法加载详情。",
  perPage: "每页:",
  showingRange: "显示第 {from} 至 {to} 条，共 {total} 条",
  selectedCount: "已选择 {count} 项",
  pagination: "分页",
  previousPage: "上一页",
  nextPage: "下一页",
  sortMenu: "排序",
  sortAscending: "升序",
  sortDescending: "降序",
  sortClear: "清除排序",
  pinLeft: "固定到左侧",
  pinRight: "固定到右侧",
  unpin: "取消固定",
  filterLabel: "筛选{label}",
  booleanAll: "全部",
  booleanYes: "是",
  booleanNo: "否",
  selectPlaceholder: "请选择…",
  searchPlaceholder: "搜索...",
  selectedCountFallback: "已选择 {count} 项",
  selectedItems: "已选择 {count} 项",
  noResults: "无结果",
  noOptions: "无选项",
  clear: "清除",
  datePlaceholder: "日/月/年",
  monthPlaceholder: "月/年",
  rangePlaceholder: "开始 → 结束",
  prevYear: "上一年",
  prevMonth: "上个月",
  nextMonth: "下个月",
  nextYear: "下一年"
};

const ja: ArcanaMessages = {
  loadError: "データを読み込めませんでした。",
  loading: "読み込み中…",
  empty: "レコードが見つかりません。",
  gridLabel: "データテーブル",
  actions: "操作",
  selectAll: "すべて選択",
  selectRow: "行を選択",
  expandRow: "詳細を展開",
  collapseRow: "詳細を折りたたむ",
  expandedLoading: "詳細を読み込み中…",
  expandedError: "詳細を読み込めませんでした。",
  perPage: "ページあたり:",
  showingRange: "{total} 件中 {from}〜{to} 件を表示",
  selectedCount: "{count} 件選択中",
  pagination: "ページネーション",
  previousPage: "前のページ",
  nextPage: "次のページ",
  sortMenu: "並べ替え",
  sortAscending: "昇順",
  sortDescending: "降順",
  sortClear: "並べ替えを解除",
  pinLeft: "左に固定",
  pinRight: "右に固定",
  unpin: "固定を解除",
  filterLabel: "{label}で絞り込む",
  booleanAll: "すべて",
  booleanYes: "はい",
  booleanNo: "いいえ",
  selectPlaceholder: "選択してください…",
  searchPlaceholder: "検索...",
  selectedCountFallback: "{count} 件選択中",
  selectedItems: "{count} 件選択中",
  noResults: "該当する結果がありません",
  noOptions: "選択肢がありません",
  clear: "クリア",
  datePlaceholder: "日/月/年",
  monthPlaceholder: "月/年",
  rangePlaceholder: "開始 → 終了",
  prevYear: "前の年",
  prevMonth: "前の月",
  nextMonth: "次の月",
  nextYear: "次の年"
};

const de: ArcanaMessages = {
  loadError: "Die Daten konnten nicht geladen werden.",
  loading: "Wird geladen…",
  empty: "Keine Einträge gefunden.",
  gridLabel: "Datentabelle",
  actions: "Aktionen",
  selectAll: "Alle auswählen",
  selectRow: "Zeile auswählen",
  expandRow: "Details ausklappen",
  collapseRow: "Details einklappen",
  expandedLoading: "Details werden geladen…",
  expandedError: "Die Details konnten nicht geladen werden.",
  perPage: "Pro Seite:",
  showingRange: "Zeige {from} bis {to} von {total}",
  selectedCount: "{count} ausgewählt",
  pagination: "Seitennavigation",
  previousPage: "Vorherige Seite",
  nextPage: "Nächste Seite",
  sortMenu: "Sortierung",
  sortAscending: "Aufsteigend",
  sortDescending: "Absteigend",
  sortClear: "Sortierung entfernen",
  pinLeft: "Links anheften",
  pinRight: "Rechts anheften",
  unpin: "Loslösen",
  filterLabel: "{label} filtern",
  booleanAll: "Alle",
  booleanYes: "Ja",
  booleanNo: "Nein",
  selectPlaceholder: "Auswählen…",
  searchPlaceholder: "Suchen...",
  selectedCountFallback: "{count} ausgewählt",
  selectedItems: "{count} ausgewählt",
  noResults: "Keine Ergebnisse",
  noOptions: "Keine Optionen",
  clear: "Leeren",
  datePlaceholder: "tt/mm/jjjj",
  monthPlaceholder: "mm/jjjj",
  rangePlaceholder: "Beginn → Ende",
  prevYear: "Vorheriges Jahr",
  prevMonth: "Vorheriger Monat",
  nextMonth: "Nächster Monat",
  nextYear: "Nächstes Jahr"
};

const ru: ArcanaMessages = {
  loadError: "Не удалось загрузить данные.",
  loading: "Загрузка…",
  empty: "Записи не найдены.",
  gridLabel: "Таблица данных",
  actions: "Действия",
  selectAll: "Выбрать все",
  selectRow: "Выбрать строку",
  expandRow: "Развернуть детали",
  collapseRow: "Свернуть детали",
  expandedLoading: "Загрузка деталей…",
  expandedError: "Не удалось загрузить детали.",
  perPage: "На странице:",
  showingRange: "Показано {from}–{to} из {total}",
  selectedCount: "Выбрано: {count}",
  pagination: "Пагинация",
  previousPage: "Предыдущая страница",
  nextPage: "Следующая страница",
  sortMenu: "Сортировка",
  sortAscending: "По возрастанию",
  sortDescending: "По убыванию",
  sortClear: "Сбросить сортировку",
  pinLeft: "Закрепить слева",
  pinRight: "Закрепить справа",
  unpin: "Открепить",
  filterLabel: "Фильтр: {label}",
  booleanAll: "Все",
  booleanYes: "Да",
  booleanNo: "Нет",
  selectPlaceholder: "Выберите…",
  searchPlaceholder: "Поиск...",
  selectedCountFallback: "Выбрано: {count}",
  selectedItems: "Выбрано: {count}",
  noResults: "Ничего не найдено",
  noOptions: "Нет вариантов",
  clear: "Очистить",
  datePlaceholder: "дд/мм/гггг",
  monthPlaceholder: "мм/гггг",
  rangePlaceholder: "Начало → Конец",
  prevYear: "Предыдущий год",
  prevMonth: "Предыдущий месяц",
  nextMonth: "Следующий месяц",
  nextYear: "Следующий год"
};

/** Built-in packs, keyed by locale. */
export const ARCANA_MESSAGES: Record<ArcanaLocale, ArcanaMessages> = {
  "pt-BR": ptBR,
  en,
  es,
  it,
  zh,
  ja,
  de,
  ru
};

/** Every locale shipped with the library. */
export const ARCANA_LOCALES: readonly ArcanaLocale[] = ["pt-BR", "en", "es", "it", "zh", "ja", "de", "ru"];

let defaultArcanaLocale: ArcanaLocale = "pt-BR";

/** Sets the locale used by every grid whose `config.locale` is absent. */
export function setDefaultArcanaLocale(locale: ArcanaLocale): void {
  defaultArcanaLocale = locale;
}

/** Returns the current global default locale (initially `pt-BR`). */
export function getDefaultArcanaLocale(): ArcanaLocale {
  return defaultArcanaLocale;
}

/** Replaces `{placeholders}` in a message template. */
export function formatMessage(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in params ? String(params[key]) : match));
}

/** The slice of `DataTableConfig` the resolver cares about (avoids a type cycle). */
export interface ArcanaLocaleConfig {
  locale?: ArcanaLocale;
  messages?: Partial<ArcanaMessages>;
}

/** `config.locale`, falling back to the global default. */
export function resolveArcanaLocale(config?: ArcanaLocaleConfig): ArcanaLocale {
  return config?.locale ?? defaultArcanaLocale;
}

/**
 * Resolves the full message table for a grid: the pack of `config.locale`
 * (or of the global default locale), overridden key-by-key by the partial
 * `config.messages`.
 */
export function resolveArcanaMessages(config?: ArcanaLocaleConfig): ArcanaMessages {
  const pack = ARCANA_MESSAGES[resolveArcanaLocale(config)] ?? ARCANA_MESSAGES[defaultArcanaLocale];
  return config?.messages ? { ...pack, ...config.messages } : pack;
}

/* ---------- Calendar display names (Intl-driven) ---------- */

/** BCP-47 tag handed to Intl for each ArcanaLocale. */
const INTL_TAG: Record<ArcanaLocale, string> = {
  "pt-BR": "pt-BR",
  en: "en",
  es: "es",
  it: "it",
  zh: "zh-CN",
  ja: "ja",
  de: "de",
  ru: "ru"
};

const monthCache = new Map<string, readonly string[]>();
const monthShortCache = new Map<string, readonly string[]>();
const weekdayCache = new Map<string, readonly string[]>();

const capitalize = (value: string): string => (value ? value.charAt(0).toLocaleUpperCase() + value.slice(1) : value);

function intlMonths(locale: ArcanaLocale, style: "long" | "short"): readonly string[] {
  const format = new Intl.DateTimeFormat(INTL_TAG[locale], { month: style, timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, index) => {
    const label = format.format(new Date(Date.UTC(2023, index, 1)));
    // Compact panels: no trailing dot ("Jan." → "Jan") and a capital initial,
    // matching the hand-written pt-BR labels the grid always shipped with.
    return capitalize(style === "short" ? label.replace(/\.$/, "") : label);
  });
}

/**
 * Localized month names for the calendar header (January-first). `pt-BR`
 * keeps the historical hand-written labels; other locales come from
 * `Intl.DateTimeFormat`.
 */
export function arcanaMonthLabels(locale: ArcanaLocale): readonly string[] {
  if (locale === "pt-BR") return MONTH_LABELS;
  let labels = monthCache.get(locale);
  if (!labels) {
    labels = intlMonths(locale, "long");
    monthCache.set(locale, labels);
  }
  return labels;
}

/** Localized short month names for the month picker (4×3 panel). */
export function arcanaMonthLabelsShort(locale: ArcanaLocale): readonly string[] {
  if (locale === "pt-BR") return MONTH_LABELS_SHORT;
  let labels = monthShortCache.get(locale);
  if (!labels) {
    labels = intlMonths(locale, "short");
    monthShortCache.set(locale, labels);
  }
  return labels;
}

/** Localized narrow weekday initials, Sunday-first (the calendar's week start). */
export function arcanaWeekdayLabels(locale: ArcanaLocale): readonly string[] {
  if (locale === "pt-BR") return WEEKDAY_LABELS;
  let labels = weekdayCache.get(locale);
  if (!labels) {
    const format = new Intl.DateTimeFormat(INTL_TAG[locale], { weekday: "narrow", timeZone: "UTC" });
    // 2023-01-01 was a Sunday.
    labels = Array.from({ length: 7 }, (_, index) => format.format(new Date(Date.UTC(2023, 0, 1 + index))));
    weekdayCache.set(locale, labels);
  }
  return labels;
}
