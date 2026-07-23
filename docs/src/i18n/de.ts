import type { Messages } from "./types";

export const de: Messages = {
  meta: { htmlLang: "de", locale: "de-DE" },
  langName: "Deutsch",

  shell: {
    kicker: "Dokumentation · v1.x",
    lead: "Eine typisierte Datentabelle für Vue 3, React, Angular und Svelte. Dieselbe Konfiguration, dasselbe Verhalten, dasselbe Ergebnis — in jedem der vier Frameworks.",
    navDocs: "Docs",
    navPlayground: "Playground",
    topNavAria: "Bereiche der Website",
    searchPlaceholder: "Dokumentation durchsuchen… (⌘K)",
    searchAria: "Dokumentation durchsuchen",
    chooseFramework: "Framework wählen",
    chooseLanguage: "Sprache wählen",
    openNav: "Navigation öffnen",
    closeNav: "Navigation schließen",
    openSettings: "Einstellungen öffnen",
    closeSettings: "Einstellungen schließen",
    sidebarAria: "Navigation der Dokumentation",
    noSectionsFound: "Keine Abschnitte gefunden.",
    previewTab: "Vorschau",
    codeTab: "Code",
    codeOnlyLabel: "Code",
    defaultPreviewCaption: "echte Komponente · zum Ausprobieren",
    sectionExampleAria: "Beispiel zu {title}",
    keyChipsAria: "Behandelte Einstellungen"
  },

  codeBlock: {
    copy: "Kopieren",
    copied: "Kopiert!"
  },

  groups: {
    gettingStarted: "Erste Schritte",
    concepts: "Konzepte",
    features: "Funktionen",
    reference: "Referenz"
  },

  sections: {
    install: {
      title: "Installation",
      p1: "Die Bibliothek wird als einzelnes npm-Paket ausgeliefert. Die Adapter für React, Vue, Angular und Svelte liegen unter separaten Unterpfaden (<c>@arcanalabs/datatable/react</c>, <c>@arcanalabs/datatable/vue</c>, <c>@arcanalabs/datatable/angular</c> und <c>@arcanalabs/datatable/svelte</c>), sodass das finale Bundle nur das Framework enthält, das tatsächlich verwendet wird.",
      p2: "Installiere sie mit dem Paketmanager deiner Wahl — fertig. Es gibt keine transitiven UI-Abhängigkeiten."
    },
    firstUse: {
      title: "Erste Verwendung",
      previewLabel: "echte Komponente · remote-Modus",
      p1: "Das gesamte Verhalten der Tabelle steckt in einem einzigen <c>config</c>-Objekt. Du deklarierst die Spalten, zeigst auf die Datenquelle und renderst die <c>ArcanaDataTable</c>-Komponente — Suche, Sortierung und Paginierung funktionieren bereits ohne eine einzige zusätzliche Zeile.",
      p2: "Das nebenstehende Beispiel nutzt den <c>remote</c>-Modus: Bei jeder Benutzerinteraktion ruft die Tabelle deine <c>datasource</c> mit den aktuellen Parametern auf. Die Demo unten macht genau das, mit einer lokalen Datasource, die die API simuliert — suche nach dem Namen oder sortiere die Spalten."
    },
    styles: {
      title: "Styles",
      p1: "Das Stylesheet ist opt-in: Importiere <c>@arcanalabs/datatable/styles.css</c> einmalig im Root deiner Anwendung. Es deckt die Tabelle, die Filter, die Paginierung und die Ladezustände ab.",
      p2: "Wenn du ein eigenes Erscheinungsbild bevorzugst, lass den CSS-Import einfach weg — das Markup ist semantisch und stabil und darauf ausgelegt, von außen gestylt zu werden."
    },
    modes: {
      title: "Remote-/Dataset-Modus",
      intro: "Es gibt zwei Wege, die Tabelle mit Daten zu versorgen, und diese Wahl bestimmt, wer die Arbeit des Filterns, Sortierens und Paginierens übernimmt:",
      liRemote: "<b>remote</b> — jeder Filter, jede Sortierung und jeder Seitenwechsel löst einen Aufruf von <c>datasource(params)</c> aus (oder der konfigurierten <c>url</c>). Die erwartete Antwort hat die Form <c>{ rows, total, page }</c>.",
      liDataset: "<b>dataset</b> — du übergibst die vollständige Sammlung im Speicher und die Tabelle löst alles lokal auf, mit null Requests.",
      rowOrigin: "Quelle",
      originDataset: "<c>dataset</c> im Speicher",
      rowFilterSort: "Filtern / Sortieren",
      filterSortRemote: "auf dem Server",
      filterSortDataset: "in der Tabelle selbst",
      rowRequests: "Requests",
      requestsRemote: "bei jeder Interaktion",
      requestsDataset: "keine",
      compare: "Vergleiche beide live — der Zähler zeigt, wie viele Requests der <c>remote</c>-Modus bisher gemacht hat:"
    },
    themes: {
      title: "Themes",
      previewLabel: "echte Komponente · wechsle das Theme",
      p1: "Das gesamte Erscheinungsbild des Grids basiert auf Design-Tokens (den <c>--arcana-*</c>-CSS-Variablen), und das Paket bringt vier fertige Themes mit: <c>zinc</c> (das helle, neutrale Standardtheme), <c>ocean</c> (Blautöne), <c>forest</c> (Grüntöne) und <c>midnight</c> (komplett dunkel).",
      p2: "Wähle pro Tabelle mit <c>config.theme</c> oder setze den globalen Standard mit <c>setDefaultArcanaTheme(theme)</c> — er gilt für jede Tabelle ohne eigenes <c>theme</c> (<c>getDefaultArcanaTheme()</c> liest den aktuellen Wert). Das Theme wird als <c>arcana-theme-*</c>-Klasse auf dem Root-Element angewendet und auf den in den <c><body></c> portalierten Panels wiederholt (Select, Kalender und die Kontext-/Sortiermenüs), die als teleportierte Elemente die Grid-Variablen sonst nicht erben würden.",
      p3: "Öffne in der Demo den Bereichsfilter oder den Datumskalender mit dem <c>midnight</c>-Theme, um die dunklen Panels zu sehen:",
      customHeading: "Ein eigenes Theme erstellen",
      p4: "Ein Theme ist einfach eine <c>arcana-theme-{name}</c>-CSS-Klasse, die die <c>--arcana-*</c>-Tokens überschreibt — jeder Name funktioniert, nicht nur die Presets. Deklariere die Klasse im CSS deiner Anwendung und übergib den Namen in <c>config.theme</c> (oder in <c>setDefaultArcanaTheme</c>): Dieselbe Klasse wird automatisch auf das Grid und die portalierten Panels angewendet, ein einziger Selektor deckt also alles ab.",
      p5: "Du musst nicht jeden Token neu definieren — beginne mit den wichtigsten und überschreibe den Rest nach Bedarf; die vollständige Liste steht am Anfang der <c>styles.css</c> des Pakets. Das <c>candy</c>-Theme in der Demo oben ist genau dieses Beispiel, definiert im CSS dieser Dokumentation, außerhalb des Pakets:"
    },
    localization: {
      title: "Lokalisierung (i18n)",
      previewLabel: "echte Komponente · Locale der Tabelle umschalten",
      p1: "Alle eingebauten Texte des Grids — die Paginierungsfußzeile, die Filtersteuerungen, das Sortiermenü, die Auswahl-Labels, die Leer-/Ladezustände und der Kalender — sind lokalisiert. Das Paket liefert <b>8 Locales</b> mit: <c>pt-BR</c> (der Standard, identisch mit dem historischen Verhalten), <c>en</c>, <c>es</c>, <c>it</c>, <c>zh</c>, <c>ja</c>, <c>de</c> und <c>ru</c>.",
      p2: "Wähle pro Tabelle mit <c>config.locale</c> oder setze den globalen Standard mit <c>setDefaultArcanaLocale(locale)</c> — er gilt für jede Tabelle ohne eigenes <c>locale</c> (<c>getDefaultArcanaLocale()</c> liest den aktuellen Wert). Es ist exakt dasselbe Muster wie bei den Themes.",
      p3: "Jeder einzelne Text lässt sich über <c>config.messages</c> ersetzen — eine partielle Map, die über das aufgelöste Paket gelegt wird, mit oder ohne <c>locale</c>. Die Priorität ist <c>messages</c> → <c>locale</c> → globaler Standard.",
      p4: "Die Monats- und Wochentagsnamen des Kalenders stammen aus <c>Intl.DateTimeFormat</c> und folgen automatisch dem Locale der Tabelle. Schalte unten das Locale um und öffne den Datumsfilter:",
      pickerAria: "Locale der Tabelle wählen",
      customLabel: "Eigene Texte (ersetzt den „Zeige…“-Text)",
      customShowing: "✦ {from}–{to} von {total} Einträgen",
      keysTitle: "Alle anpassbaren Schlüssel",
      keysIntro: "Jeder Schlüssel kann einzeln über <c>messages</c> überschrieben werden — die Tabelle zeigt die exakten Texte des <c>en</c>-Pakets und des aktiven Pakets. Vorlagen behalten ihre Platzhalter (<c>{from}</c>, <c>{to}</c>, <c>{total}</c>, <c>{count}</c>, <c>{label}</c>), wenn Sie sie ersetzen.",
      keysKeyCol: "Schlüssel"
    },
    columns: {
      title: "Spalten",
      p1: "Jede Spalte ist ein <c>DataTableColumn</c>-Objekt mit einem <c>name</c> (dem Schlüssel in der Zeile) und einem <c>label</c> (dem Text der Kopfzeile). Felder wie <c>type</c> steuern die Formatierung — zum Beispiel rendert <c>CURRENCY</c> Geldbeträge — und <c>valueGetter</c> transformiert den Zellinhalt vor dem Rendern. String-Inhalt wird standardmäßig als sicherer, escapeter Text gerendert; setze <c>html: true</c> auf der Spalte, um ihn als HTML zu interpretieren, oder gib für reichhaltige Inhalte einen nativen Knoten zurück.",
      p2: "Die <c>columns</c>-Eigenschaft akzeptiert auch eine Funktion <c>() => DataTableColumn[]</c>, praktisch, wenn die Spalten von Berechtigungen oder vom Anwendungszustand abhängen."
    },
    columnManagement: {
      title: "Spalten umordnen und anheften",
      previewLabel: "echte Komponente · ziehe die Kopfzeilen und scrolle horizontal",
      p1: "Ziehe den Körper eines Spaltenkopfs seitwärts, um die Spalten umzuordnen — die übrigen Spalten weichen live aus und öffnen die Lücke, in der sie landet, während ein schwebender Chip mit dem Spaltennamen dem Zeiger folgt (Esc bricht das Ziehen ab). Ein kurzer Klick öffnet weiterhin das Sortiermenü und der Ziehgriff an der rechten Kante behält Vorrang, sodass das Ziehen nie im Weg ist. Standardmäßig aktiv (<c>columnReorderEnabled</c>); halte eine einzelne Spalte mit <c>reorderable: false</c> an ihrem Platz fest.",
      p2: "Das Kopfzeilenmenü (dasselbe mit den Sortieroptionen) erhält <i>Links anheften</i>, <i>Rechts anheften</i> und <i>Lösen</i>. Eine angeheftete Spalte friert an ihrer Kante ein und bleibt beim horizontalen Scrollen sichtbar — links angeheftete Spalten kleben am Anfang, rechts angeheftete am Ende, mit einem dezenten Trenner/Schatten. Lege es vorab mit <c>pinned: 'left'</c> oder <c>pinned: 'right'</c> an der Spalte fest oder ändere es zur Laufzeit über das Menü; die Systemspalten (Checkbox/Aufklapper) frieren links ein und die Aktionsspalte rechts. Umordnen und Anheften werden durch <c>columnPinEnabled</c> deaktiviert und im responsiven Modus <c>VERTICAL_RECORD</c> ignoriert."
    },
    resize: {
      title: "Spaltenbreite ändern",
      previewLabel: "echte Komponente · ziehe die rechte Kante einer Kopfzeile",
      labelOn: "Resize AN",
      labelOff: "Resize AUS",
      p1: "Jede Kopfzeile trägt an ihrer rechten Kante einen dezenten Ziehgriff — ziehe ihn, um der Spalte genau die gewünschte Breite zu geben. Das Skalieren ist standardmäßig aktiv (<c>columnResizeEnabled: true</c>), und der Griff behält Vorrang vor dem Ziehen der Kopfzeile, sodass es nie mit dem Umordnen kollidiert.",
      p2: "<c>cellMinWidth</c> wirkt als Untergrenze: keine Spalte lässt sich schmaler ziehen. Schalte die Griffe für das ganze Grid mit <c>columnResizeEnabled: false</c> ab, oder halte eine einzelne Spalte mit <c>resizable: false</c> in ihrer Definition auf fester Breite. Vergleiche die beiden Grids unten — das erste zeigt an jeder Kopfzeile einen Ziehgriff, das zweite an keiner:"
    },
    pagination: {
      title: "Paginierung",
      p1: "Die Paginierung ist standardmäßig mit <c>rowsPerPage: 10</c> aktiviert. Im <c>remote</c>-Modus reisen die aktuelle Seite und die Seitengröße in den an die <c>datasource</c> gesendeten <c>params</c> mit; das von der Antwort zurückgegebene <c>total</c> speist den Zähler im Footer.",
      p2: "Um programmatisch zu navigieren, verwende <c>controller.paginate(page, size)</c>. Wird die Sammlung leer, zeigt die Tabelle die <c>empty</c>-Meldung des Sprachpakets — anpassbar über <c>messages</c>:"
    },
    filters: {
      title: "Filter",
      p1: "Die Suche pro Spalte ist standardmäßig aktiv (<c>searchEnabled: true</c>). Jede Spalte mit einem <c>searchType</c> erhält das passende Steuerelement in der Kopfzeile; im <c>remote</c>-Modus werden die eingegebenen Werte innerhalb der <c>params</c> gesendet.",
      p2: "Verwende <c>initialFilters</c>, um Filter schon bei der ersten Abfrage anzuwenden — mit <c>disableFilterWhenPresentOnInitialFilters</c> wird das zugehörige Steuerelement gesperrt — und <c>setFilter</c> / <c>setFilters</c> am Controller, um sie als Reaktion auf Aktionen deiner Anwendung zu ändern."
    },
    searchTypes: {
      title: "Suchtypen",
      p1: "Der <c>searchType</c> jeder Spalte bestimmt das Steuerelement, das dem Benutzer angezeigt wird. Es gibt sieben Typen:",
      thControl: "Steuerelement",
      rows: {
        DATE: "Auswahl eines einzelnen Datums",
        DATE_MONTH: "Monats-/Jahresauswahl (Abrechnungszeitraum)",
        DATE_RANGE: "Zeitraum zwischen zwei Daten",
        BOOLEAN: "Ja/Nein-Umschalter",
        LIST: "Feste Liste von Optionen",
        REMOTE: "Optionen, die von einem Endpoint geladen werden",
        COMPONENT: "Deine eigene benutzerdefinierte Komponente"
      },
      p2: "Alle sieben nebeneinander (horizontal scrollen):"
    },
    sorting: {
      title: "Sortierung",
      p1: "Die Sortierung pro Spalte ist standardmäßig aktiviert (<c>orderByEnabled: true</c>): Ein Klick auf die Kopfzeile öffnet ein Menü mit <i>Aufsteigend</i>, <i>Absteigend</i> und — wenn die Spalte bereits sortiert ist — <i>Sortierung entfernen</i>, was das Grid in den neutralen Zustand zurückversetzt; die Kopfzeilen stellen <c>aria-sort</c> bereit. Im <c>remote</c>-Modus reist die aktuelle Sortierung in den <c>params</c> mit; im <c>dataset</c>-Modus wird sie im Speicher aufgelöst.",
      p2: "Deaktiviere sie pro Spalte mit <c>orderByEnabled: false</c> in der Spaltendefinition und verwende <c>filterName</c> als Alias für das an den Server gesendete Feld. Um eine Sortierung per Code anzuwenden, nutze <c>controller.applyOrderBy({ name, direction })</c> — oder übergib <c>null</c>, um sie zu löschen. Wie du mehrere Spalten auf einmal kombinierst, zeigt <b>Mehrspaltige Sortierung</b> direkt darunter."
    },
    multiSort: {
      title: "Mehrspaltige Sortierung",
      previewLabel: "echte Komponente · Umschalt+Klick auf eine Kopfzeile stapelt eine weitere Sortierung",
      p1: "Mit <b>Umschalt+Klick</b> auf eine Kopfzeile fügst du diese Spalte der aktuellen Sortierung hinzu, statt sie zu ersetzen — jede Spalte durchläuft <i>aufsteigend → absteigend → entfernt</i>, während die übrigen an ihrem Platz bleiben. Ein kleines Prioritätsabzeichen (<c>1</c>, <c>2</c>, <c>3</c>…) neben dem Pfeil zeigt, in welcher Reihenfolge die Spalten greifen. Die Demo unten startet bereits sortiert nach Bereich (aufsteigend) und dann Betrag (absteigend) — innerhalb jedes Bereichs laufen die Beträge von hoch nach niedrig; Umschalt+Klick auf eine dritte Kopfzeile stapelt eine weitere Ebene.",
      p2: "Per Code akzeptiert <c>controller.applyOrderBy(orderBy)</c> auch ein <c>OrderBy[]</c> für eine vollständige mehrspaltige Sortierung (Index 0 sortiert zuerst), und <c>controller.toggleOrderBy(name, { additive: true })</c> bildet den Umschalt+Klick-Zyklus für eine einzelne Spalte nach. Im <c>remote</c>-Modus behält eine einzelne Sortierung die klassischen Params <c>order_by[field]</c> / <c>order_by[direction]</c>; ab zwei Spalten werden sie indiziert — <c>order_by[0][field]</c>, <c>order_by[0][direction]</c>, <c>order_by[1][field]</c>, …"
    },
    checkbox: {
      title: "Mehrfachauswahl",
      p1: "Mit <c>checkboxEnabled: true</c> erhält jede Zeile eine Checkbox, und über die Kopfzeile lässt sich die ganze Seite auswählen. Die Auswahl überlebt Seitenwechsel.",
      p2: "Steuere den Anfangszustand mit <c>isRowChecked</c>, sperre Zeilen mit <c>isCheckboxRowDisabled</c> und reagiere auf die Events <c>onRowChecked</c> / <c>onRowUnchecked</c>. Lies die markierten Zeilen mit <c>getCheckedRows()</c> und leere alles mit <c>clearCheckedRows()</c> — typisch für Batch-Aktionen wie \"Auswahl exportieren\"."
    },
    radio: {
      title: "Einzelauswahl",
      p1: "Wenn der Ablauf genau einen Datensatz verlangt — zum Beispiel die Auswahl eines Kunden in einem Dialog — aktiviere <c>radioButtonSelectionEnabled: true</c>. Jede Zeile zeigt einen Radiobutton, und das Markieren einer Zeile hebt die vorherige Markierung auf; <c>uniqueKeyIdentifier</c> definiert den Identitätsschlüssel.",
      p2: "Die gewählte Zeile wird ebenfalls über <c>getCheckedRows()</c> gelesen, das in diesem Modus höchstens ein Element zurückgibt."
    },
    summary: {
      title: "Summen",
      p1: "Mit <c>footerSummarizerEnabled: true</c> fügt die Tabelle eine Fußzeile mit der Summe der numerischen Spalten hinzu — <c>CURRENCY</c>-Spalten werden summiert und als Währung formatiert. Mit <c>summarizeOnlyChecked</c> gehen nur die ausgewählten Zeilen in die Summe ein.",
      p2: "Der konsolidierte Wert einer Spalte ist auch per Code verfügbar, über <c>getSummarizedValue(column)</c>."
    },
    layout: {
      title: "Responsivität",
      p1: "Wähle auf schmalen Bildschirmen das Verhalten mit <c>responsiveMode</c>:",
      liOverflow: "<c>HORIZONTAL_OVERFLOW</c> — behält die Tabellenstruktur bei und aktiviert horizontales Scrollen.",
      liVertical: "<c>VERTICAL_RECORD</c> — jede Zeile wird zu einer vertikalen Karte, mit dem Spaltenlabel neben jedem Wert.",
      p2: "Bei langen Listen hält <c>stickyHeaderEnabled: true</c> die Kopfzeile beim Scrollen sichtbar, und <c>height</c> + <c>overflowEnabled</c> erzeugen einen scrollbaren Bereich:"
    },
    actions: {
      title: "Aktionen und Events",
      p1: "Die <c>actions</c>-Spalte rendert Buttons pro Zeile — mit bedingter Sichtbarkeit über <c>isVisible</c> — und die Events <c>onClickRow</c>, <c>onDoubleClickRow</c>, <c>onClickCell</c>, <c>onDoubleClickCell</c> und <c>onContextMenu</c> decken die Zeilen- und Zellinteraktionen ab. <c>rowFocusEnabled</c> und <c>cellFocusEnabled</c> liefern das visuelle Fokus-Feedback.",
      p2: "Der initiale Request erfolgt beim Mounten (<c>sendRequestOnMounted: true</c>); deaktiviere ihn, wenn die Tabelle von einem Filter abhängt, den der Benutzer erst noch wählen muss. Fehler der <c>datasource</c> landen in <c>onRequestError</c>."
    },
    expandable: {
      title: "Aufklappbare Zeilen",
      previewLabel: "echte Komponente · asynchroner Renderer (~700ms)",
      p1: "Mit <c>expandableRowsEnabled: true</c> erhält jede Zeile einen Chevron-Button in der ersten Spalte (vor der Checkbox, falls vorhanden). Ein Klick darauf öffnet direkt darunter einen Bereich in voller Breite mit komplett eigenem Inhalt, gerendert von <c>expandedRowRenderer(row, grid)</c> — mehrere Zeilen können gleichzeitig geöffnet bleiben, und ein Wechsel der Seite oder des Datasets klappt alles zu.",
      p2: "Der Renderer kann <b>synchron</b> sein — er gibt den Inhalt direkt zurück und nutzt die Daten der Zeile selbst — oder <b>asynchron</b> — er gibt eine <c>Promise</c> zurück (zum Beispiel ein API-Aufruf). Im asynchronen Fall zeigt der Bereich einen Ladezustand, bis die Promise aufgelöst ist; der eingebaute Standard (Spinner + \"Details werden geladen…\") lässt sich mit <c>expandedRowLoadingRenderer</c> ersetzen. Das erneute Öffnen einer Zeile führt den Renderer erneut aus und garantiert frische Daten; wird die Promise abgelehnt, zeigt der Bereich einen dezenten Hinweis.",
      p3: "Mit <c>expandRowOnClick: true</c> schaltet auch ein Klick irgendwo auf die Zeile die Expansion um — ohne <c>onClickRow</c> zu stören, das weiterhin feuert. Und der Controller stellt die programmatische Steuerung bereit: <c>expandRow(uuid)</c>, <c>collapseRow(uuid)</c> und <c>getExpandedRows()</c>.",
      p4: "In der Demo simuliert der asynchrone Renderer eine API mit ~700ms Verzögerung — achte auf den Ladezustand, bevor das Mini-Profil erscheint:"
    },
    hooks: {
      title: "Hooks",
      p1: "Die Rendering-Hooks transformieren Zeilen, Zellen, Kopfzeilen und Styles unmittelbar vor dem Mounten: <c>onBeforeRowMounted</c> passt die ganze Zeile an, <c>onBeforeCellMounted</c> und <c>onBeforeHeaderCellMounted</c> tauschen den Inhalt aus, und <c>onBeforeCellStyleMounted</c> liefert Styles pro Zelle.",
      p2: "In der Demo wird die Spalte \"Zustand\" in <c>onBeforeRowMounted</c> aus <c>active</c> abgeleitet und in <c>onBeforeCellStyleMounted</c> eingefärbt:"
    },
    properties: {
      title: "Eigenschaften",
      intro: "Alle am häufigsten verwendeten Eigenschaften des <c>config</c>-Objekts — die vom Paket exportierte TypeScript-Definition ist die Quelle der Wahrheit:",
      thProperty: "Eigenschaft",
      thType: "Typ",
      thDefault: "Standard",
      thDescription: "Beschreibung",
      tip: "<b>Tipp:</b> Deklariere nur, was von den Standardwerten abweicht — ein <c>config</c> mit <c>columns</c> und <c>datasource</c> ist bereits eine vollständige Tabelle.",
      defaults: {
        inferred: "abgeleitet",
        builtIn: "eingebaut"
      },
      descriptions: {
        mode: "Bestimmt, wo Filter, Sortierung und Paginierung ausgeführt werden.",
        theme: "Visuelles Theme des Grids und der portalierten Panels — ein Preset oder der Name eines eigenen Themes (Klasse arcana-theme-{name}); der globale Standard ändert sich mit setDefaultArcanaTheme.",
        locale: "Locale der eingebauten Texte des Grids (8 mitgelieferte Pakete); der globale Standard ändert sich mit setDefaultArcanaLocale.",
        messages: "Punktuelle Überschreibungen der eingebauten Texte, angewendet über dem aufgelösten Locale-Paket.",
        dataset: "Vollständige Sammlung für lokale Operationen; impliziert den dataset-Modus.",
        columns: "Sichtbare Spalten und ihre Renderer.",
        html: "Wenn true, wird der String-Inhalt der Spalte (Rohwert oder Rückgabe von valueGetter/headerContentGetter) als HTML interpretiert; andernfalls als sicherer, escapeter Text gerendert. Für reichhaltige Inhalte einen nativen Knoten zurückgeben.",
        datasource: "Provider, der im remote-Modus abgefragt wird.",
        url: "Endpoint, der im remote-Modus ohne datasource verwendet wird.",
        rowsPerPage: "Anfängliche Anzahl pro Seite.",
        searchEnabled: "Zeigt die Filter pro Spalte.",
        orderByEnabled: "Aktiviert die Sortierung in den Kopfzeilen.",
        checkboxEnabled: "Aktiviert die Mehrfachauswahl.",
        radioButtonSelectionEnabled: "Aktiviert die Einzelauswahl.",
        footerSummarizerEnabled: "Zeigt numerische Summen.",
        expandableRowsEnabled: "Fügt die Chevron-Spalte hinzu und aktiviert den Detailbereich pro Zeile.",
        expandedRowRenderer: "Inhalt des aufgeklappten Bereichs; ein asynchroner Rückgabewert zeigt den Ladezustand, bis er aufgelöst ist.",
        expandedRowLoadingRenderer: "Ersetzt den Standard-Ladezustand, der angezeigt wird, während der asynchrone Renderer auflöst.",
        expandRowOnClick: "Ein Klick irgendwo auf die Zeile schaltet ebenfalls die Expansion um (onClickRow feuert weiterhin).",
        onRowExpandedCollapsed: "Melden das Auf- und Zuklappen jeder Zeile.",
        responsiveMode: "Bestimmt die mobile Darstellung.",
        stickyHeaderEnabled: "Hält die Kopfzeile beim Scrollen fest.",
        columnResizeEnabled: "Aktiviert Ziehgriffe zum Ändern der Breite an den Spaltenköpfen.",
        resizable: "Erlaubt, diese Spalte durch Ziehen der Kopfzeilenkante zu skalieren.",
        columnReorderEnabled: "Aktiviert das Umordnen per Ziehen des Kopfzeilenkörpers (in VERTICAL_RECORD ignoriert).",
        reorderable: "Erlaubt, diese Spalte an eine neue Position zu ziehen; false hält sie fest.",
        pinned: "Friert diese Spalte an einer Kante ein (fix beim horizontalen Scrollen); über das Kopfzeilenmenü änderbar.",
        sendRequestOnMounted: "Steuert die erste Remote-Abfrage.",
        initialFilters: "Initiale Remote- oder lokale Filter.",
        onRequestError: "Meldet Ladefehler."
      }
    },
    methods: {
      title: "Controller-Methoden",
      p1: "Der <b>Controller</b> ist die Instanz, die die programmatischen Methoden der Tabelle bereitstellt. Hole ihn mit einer <c>ref</c> auf die Komponente — dem idiomatischen Muster jedes Frameworks — und rufe jede Methode aus deiner UI auf.",
      p2: "Die folgenden Signaturen stammen aus dem vom Paket exportierten Interface <c>DataTableApi</c>. <c>Row</c> ist der generische Zeilentyp (standardmäßig <c>DataTableRow</c>) und <c>OrderBy</c> ist <c>{ name: string; direction: 'asc' | 'desc' }</c>.",
      docs: {
        refresh: {
          description: "Führt die aktuelle Abfrage erneut aus und behält Filter, Sortierung und Seite bei (Kurzform für fetch())."
        },
        setRows: {
          description: "Ersetzt die auf der aktuellen Seite angezeigten Zeilen und aktualisiert das Total; im dataset-Modus delegiert sie an setDataset. Gibt die normalisierten Zeilen zurück.",
          params: { rows: "neue Zeilen für die aktuelle Seite." }
        },
        setDataset: {
          description: "Ersetzt die vollständige Sammlung und kehrt zu Seite 1 zurück; nur im dataset-Modus verfügbar (wirft im remote-Modus). Gibt das normalisierte Dataset zurück.",
          params: { rows: "vollständige, im Speicher gehaltene Sammlung." }
        },
        getDataset: {
          description: "Gibt eine Kopie der vollständigen Sammlung des dataset-Modus zurück (leeres Array im remote-Modus)."
        },
        addRow: {
          description: "Hängt eine Zeile ans Ende der Sammlung (dataset) bzw. der aktuellen Seite (remote) an und erhöht das Total.",
          params: { row: "einzufügende Zeile; sie erhält automatisch eine interne _uuid." }
        },
        updateRow: {
          description: "Wendet einen partiellen Patch auf die identifizierte Zeile an und lässt die übrigen Felder unverändert.",
          params: {
            uuid: "die interne _uuid der Zeile (bei der Normalisierung erzeugt).",
            row: "Felder, die in der Zeile überschrieben werden."
          }
        },
        removeRow: {
          description: "Entfernt die identifizierte Zeile und verringert das Total.",
          params: { uuid: "die interne _uuid der Zeile." }
        },
        getRows: {
          description: "Gibt die aktuell gerenderten Zeilen zurück (die sichtbare Seite)."
        },
        getCheckedRows: {
          description: "Gibt die Zeilen mit markierter Checkbox zurück — im dataset-Modus wird die gesamte Sammlung berücksichtigt, nicht nur die Seite."
        },
        clearCheckedRows: {
          description: "Hebt die Checkbox-Markierung aller Zeilen auf."
        },
        setFilter: {
          description: "Setzt einen Filter, kehrt zu Seite 1 zurück und fragt neu ab (remote) bzw. berechnet lokal neu (dataset).",
          params: {
            name: "Filtername (das filterName ?? name der Spalte).",
            value: "Filterwert; null, '' oder [] löschen den Filter."
          }
        },
        setFilters: {
          description: "Wendet mehrere Filter auf einmal an, mit einer einzigen Neuabfrage am Ende.",
          params: { filters: "Map Name → Wert; leere Werte löschen den jeweiligen Filter." }
        },
        paginate: {
          description: "Navigiert zur angegebenen Seite und passt die Seitengröße an (mindestens 1 für beide).",
          params: {
            page: "Zielseite (1-basiert).",
            rowsPerPage: "Anzahl der Zeilen pro Seite."
          }
        },
        applyOrderBy: {
          description: "Ersetzt die gesamte Sortierung und kehrt zu Seite 1 zurück: ein einzelnes OrderBy behält das klassische einspaltige Verhalten, ein OrderBy[] wendet eine vollständige mehrspaltige Sortierung an (Index 0 sortiert zuerst), und null löscht die Sortierung.",
          params: { orderBy: "ein Objekt { name: string; direction: 'asc' | 'desc' }, ein OrderBy[] für eine mehrspaltige Sortierung oder null zum Zurücksetzen." }
        },
        toggleOrderBy: {
          description: "Schaltet die Sortierung einer Spalte genau wie ein Klick auf den Header weiter und kehrt zu Seite 1 zurück; mit additive: true wird Umschalt+Klick nachgebildet und die übrigen sortierten Spalten bleiben erhalten.",
          params: {
            name: "Name der Spalte, deren Sortierung durchgeschaltet wird (asc → desc → entfernt).",
            options: "additive: true erhält die übrigen sortierten Spalten; ohne wird die Spalte zur einzigen Sortierung."
          }
        },
        setColumnOrder: {
          description: "Ersetzt die effektive Spaltenreihenfolge komplett; ein leeres Array stellt die natürliche Reihenfolge der Config wieder her.",
          params: { order: "Liste der Spaltennamen in der gewünschten Reihenfolge; fehlende Namen wandern ans Ende." }
        },
        moveColumn: {
          description: "Verschiebt eine Spalte neben eine andere, vor (Standard) oder hinter das Ziel; ein null-Ziel schickt sie ans Ende.",
          params: {
            name: "Name der zu verschiebenden Spalte.",
            targetName: "Name der Referenzspalte oder null, um die Spalte ans Ende zu schicken.",
            position: "ob die Spalte vor (Standard) oder hinter dem Ziel landet."
          }
        },
        setColumnPinned: {
          description: "Heftet die Spalte an einen Rand (oder löst sie mit null) und überschreibt dabei das pinned aus der Spalten-Config.",
          params: {
            name: "Name der anzuheftenden Spalte.",
            pinned: "'left', 'right' oder null zum Lösen."
          }
        },
        getColumnPin: {
          description: "Gibt die aktuelle Anheftung der Spalte zurück ('left', 'right' oder null): den Laufzeit-Override, falls gesetzt, sonst das pinned aus der Spalten-Config.",
          params: { name: "Name der abzufragenden Spalte." }
        },
        expandRow: {
          description: "Klappt die identifizierte Zeile auf und rendert den Detailbereich direkt darunter (erfordert expandableRowsEnabled). Wird ignoriert, wenn die Zeile bereits aufgeklappt ist oder nicht auf der aktuellen Seite liegt.",
          params: { uuid: "die interne _uuid der Zeile (bei der Normalisierung erzeugt)." }
        },
        collapseRow: {
          description: "Klappt die identifizierte Zeile zu und entfernt den Detailbereich; wird ignoriert, wenn die Zeile nicht aufgeklappt ist.",
          params: { uuid: "die interne _uuid der Zeile." }
        },
        getExpandedRows: {
          description: "Gibt die aktuell aufgeklappten Zeilen der sichtbaren Seite zurück — ein Wechsel der Seite oder des Datasets klappt alles zu."
        },
        getSummarizedValue: {
          description: "Summiert die Werte der Spalte über die aktuellen Zeilen und gibt { raw, formatted } zurück; null, wenn die Spalte nicht summierbar ist (weder numerischer type noch summarizerValueGetter).",
          params: {
            column: "zu summierende Spalte.",
            onlyIsChecked: "beschränkt die Summe in Kombination mit summarizeOnlyChecked auf die markierten Zeilen."
          }
        }
      }
    }
  },

  playground: {
    panelAria: "Playground-Einstellungen",
    settings: "Einstellungen",
    reset: "Zurücksetzen",
    groupData: "Daten",
    groupFeatures: "Funktionen",
    groupExpandable: "Aufklappbare Zeilen",
    groupLayout: "Layout",
    groupTheme: "Theme",
    groupLocalization: "Lokalisierung",
    localeAuto: "folgt der Doku-Sprache",
    addOverride: "Override hinzufügen…",
    removeOverride: "Override für {key} entfernen",
    emptyDataset: "Leeres Dataset",
    emptyDatasetHint: "zeigt die Leerzustandsmeldung",
    checkboxHint: "schließt die Einzelauswahl aus",
    radioHint: "schließt die Mehrfachauswahl aus",
    actionsHint: "„Öffnen“-Button pro Zeile",
    renderer: "Renderer",
    rendererSync: "synchron",
    rendererAsync: "asynchron (700ms)",
    customLoading: "Eigener Ladezustand",
    heightHint: "wirkt zusammen mit overflowEnabled",
    themePickerAria: "Theme wählen",
    stageCaption: "echte Komponente · reagiert auf jede Einstellung",
    initialEvent: "Klicke auf eine Aktion der Tabelle",
    openAction: "Öffnen",
    openEvent: "Öffnen: {name}",
    customLoadingText: "Profil von {name} wird vorbereitet…",
    generatedCode: "Generierter Code",
    codeNote: "nur, was von den Standardwerten abweicht",
    tableAria: "Arcana-DataTable-Playground",
    infoAria: "Über {label}",
    hints: {
      rowsPerPage: "Angezeigte Zeilen pro Seite.",
      messages: "Überschreibt einzelne Texte des Sprachpakets; der Platzhalter zeigt den aktuellen Paketwert.",
      searchEnabled: "Suchfeld über der Tabelle.",
      orderByEnabled: "Klick auf eine Überschrift sortiert die Spalte.",
      footerSummarizerEnabled: "Summen in der Fußzeile.",
      summarizeOnlyChecked: "Summiert nur die markierten Zeilen.",
      rowFocusEnabled: "Hebt die Zeile unter dem Cursor hervor.",
      cellFocusEnabled: "Hebt die fokussierte Zelle hervor.",
      expandableRowsEnabled: "Zeilen lassen sich für Details aufklappen.",
      expandRowOnClick: "Klappt beim Klick auf eine beliebige Stelle der Zeile auf.",
      renderer: "Sofortiger Inhalt oder per Promise aufgelöst.",
      customLoading: "Eigener Ladezustand im Async-Modus.",
      stickyHeaderEnabled: "Kopfzeile bleibt beim Scrollen sichtbar.",
      columnResizeEnabled: "Ziehe die Kopfzeilenkanten, um Spalten zu skalieren.",
      columnReorderEnabled: "Ziehe einen Spaltenkopf, um die Spalten umzuordnen.",
      pinColumns: "Heftet die erste Spalte links und die letzte rechts an.",
      overflowEnabled: "Der Rumpf scrollt, statt zu wachsen.",
      responsiveMode: "Verhalten auf schmalen Bildschirmen.",
      footerVisible: "Zeigt die Fußzeile mit Paginierung.",
      isRowsPerPageVisible: "Zeilen-pro-Seite-Auswahl in der Fußzeile.",
      calculateCellWidth: "Spaltenbreite anhand des Inhalts berechnet.",
      theme: "Visuelle Palette der Tabelle.",
      locale: "Sprache der internen Tabellentexte."
    }
  },

  demos: {
    departments: {
      engineering: "Entwicklung",
      research: "Forschung",
      product: "Produkt",
      editorial: "Redaktion",
      infrastructure: "Infrastruktur"
    },
    statuses: {
      active: "Aktiv",
      inReview: "In Prüfung",
      inactive: "Inaktiv"
    },
    available: "Verfügbar",
    unavailable: "Nicht verfügbar",
    cols: {
      id: "ID",
      name: "Name",
      email: "E-Mail",
      area: "Bereich",
      status: "Status",
      joinedAt: "Eintrittsdatum",
      amount: "Betrag",
      score: "Score",
      client: "Kunde",
      department: "Abteilung",
      person: "Person",
      situation: "Zustand",
      date: "Datum",
      month: "Monat",
      period: "Zeitraum",
      boolean: "Boolesch",
      list: "Liste",
      remoteList: "Remote-Liste",
      custom: "Benutzerdefiniert",
      code: "Kennung",
      totalSelected: "Summe Auswahl",
      points: "Punkte"
    },
    requestsLabel: "{n} Request(s)",
    zeroRequests: "keine Requests",
    emptyStateTest: "Leeren Zustand testen",
    restoreDataset: "Dataset wiederherstellen",
    paginationEmpty: "Keine Mitarbeitenden in diesem Ausschnitt.",
    customFilter: "Eigener Filter",
    checkboxInitial: "Wähle eine Zeile aus",
    checkedEvent: "{name} ausgewählt",
    uncheckedEvent: "{name} entfernt",
    checkboxChanged: "Checkbox geändert: {name}",
    radioInitial: "Keine Zeile gewählt",
    radioChosen: "Gewählt: {name}",
    radioRemoved: "Entfernt: {name}",
    radioChanged: "Radio geändert: {name}",
    actionsInitial: "Klicke auf eine Zeile, Zelle oder Aktion",
    open: "Öffnen",
    openEvent: "Öffnen: {name}",
    rowClick: "Klick: {name}",
    rowDblClick: "Doppelklick: {name}",
    cellClick: "Zelle {column}: {name}",
    cellDblClick: "Doppelklick auf {column}: {name}",
    ctxCopy: "{column} kopieren",
    ctxCopied: "Kopiert von {name}",
    card: {
      email: "E-Mail",
      area: "Bereich",
      score: "Score",
      joined: "Eintrittsdatum",
      pts: "Pkt."
    },
    aria: {
      firstUse: "Erste Verwendung der Arcana DataTable",
      themes: "Theme-Demonstration",
      themePicker: "Theme wählen",
      expandable: "Demonstration aufklappbarer Zeilen",
      hooks: "Beispiel für Rendering-Hooks"
    }
  }
};
