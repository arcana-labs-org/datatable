import type { Messages } from "./types";

export const it: Messages = {
  meta: { htmlLang: "it", locale: "it-IT" },
  langName: "Italiano",

  shell: {
    kicker: "Documentazione · v1.x",
    lead: "Una data table tipizzata per Vue 3, React, Angular e Svelte. La stessa configurazione, lo stesso comportamento, lo stesso risultato — in ognuno dei quattro framework.",
    navDocs: "Docs",
    navPlayground: "Playground",
    topNavAria: "Aree del sito",
    searchPlaceholder: "Cerca nella documentazione… (⌘K)",
    searchAria: "Cerca nella documentazione",
    chooseFramework: "Scegli il framework",
    chooseLanguage: "Scegli la lingua",
    openNav: "Apri la navigazione",
    closeNav: "Chiudi la navigazione",
    openSettings: "Apri le impostazioni",
    closeSettings: "Chiudi le impostazioni",
    sidebarAria: "Navigazione della documentazione",
    noSectionsFound: "Nessuna sezione trovata.",
    previewTab: "Anteprima",
    codeTab: "Codice",
    codeOnlyLabel: "Codice",
    defaultPreviewCaption: "componente reale · interagisci",
    sectionExampleAria: "Esempio di {title}",
    keyChipsAria: "Impostazioni trattate"
  },

  codeBlock: {
    copy: "Copia",
    copied: "Copiato!"
  },

  groups: {
    gettingStarted: "Per iniziare",
    concepts: "Concetti",
    features: "Funzionalità",
    reference: "Riferimento"
  },

  sections: {
    install: {
      title: "Installazione",
      p1: "La libreria è distribuita come un unico pacchetto npm. Gli adapter per React, Vue, Angular e Svelte sono esposti in sottopercorsi separati (<c>@arcanalabs/datatable/react</c>, <c>@arcanalabs/datatable/vue</c>, <c>@arcanalabs/datatable/angular</c> e <c>@arcanalabs/datatable/svelte</c>), quindi il bundle finale include solo il framework che usi davvero.",
      p2: "Installala con il package manager che preferisci e hai finito — non ci sono dipendenze UI transitive."
    },
    firstUse: {
      title: "Primo utilizzo",
      previewLabel: "componente reale · modalità remote",
      p1: "L'intero comportamento della tabella vive in un unico oggetto <c>config</c>. Dichiari le colonne, indichi la sorgente dei dati e renderizzi il componente <c>ArcanaDataTable</c> — ricerca, ordinamento e paginazione funzionano già senza una sola riga in più.",
      p2: "L'esempio a fianco usa la modalità <c>remote</c>: a ogni interazione dell'utente, la tabella chiama il tuo <c>datasource</c> con i parametri correnti. La demo qui sotto fa esattamente questo, con un datasource locale che simula l'API — cerca per nome o ordina le colonne."
    },
    styles: {
      title: "Stili",
      p1: "Il foglio di stile è opt-in: importa <c>@arcanalabs/datatable/styles.css</c> una sola volta, alla radice della tua applicazione. Copre la tabella, i filtri, la paginazione e gli stati di caricamento.",
      p2: "Se preferisci un aspetto tutto tuo, semplicemente non importare il CSS — il markup è semantico e stabile, pensato per essere stilizzato dall'esterno."
    },
    modes: {
      title: "Modalità remote/dataset",
      intro: "Ci sono due modi per alimentare la tabella, e questa scelta definisce chi svolge il lavoro di filtro, ordinamento e paginazione:",
      liRemote: "<b>remote</b> — ogni filtro, ordinamento o cambio di pagina attiva una chiamata a <c>datasource(params)</c> (o alla <c>url</c> configurata). La risposta attesa ha la forma <c>{ rows, total, page }</c>.",
      liDataset: "<b>dataset</b> — consegni l'intera collezione in memoria e la tabella risolve tutto localmente, con zero richieste.",
      rowOrigin: "Origine",
      originDataset: "<c>dataset</c> in memoria",
      rowFilterSort: "Filtro / ordinamento",
      filterSortRemote: "sul server",
      filterSortDataset: "nella tabella stessa",
      rowRequests: "Richieste",
      requestsRemote: "a ogni interazione",
      requestsDataset: "nessuna",
      compare: "Confrontali dal vivo — il contatore mostra quante richieste ha fatto finora la modalità <c>remote</c>:"
    },
    themes: {
      title: "Temi",
      previewLabel: "componente reale · cambia il tema",
      p1: "Tutto l'aspetto della griglia è costruito su design token (le variabili CSS <c>--arcana-*</c>), e il pacchetto include quattro temi pronti: <c>zinc</c> (il neutro chiaro predefinito), <c>ocean</c> (blu), <c>forest</c> (verdi) e <c>midnight</c> (completamente scuro).",
      p2: "Scegline uno per tabella con <c>config.theme</c>, oppure imposta il default globale con <c>setDefaultArcanaTheme(theme)</c> — usato da ogni tabella senza un <c>theme</c> proprio (<c>getDefaultArcanaTheme()</c> legge il valore corrente). Il tema viene applicato come classe <c>arcana-theme-*</c> sull'elemento radice e ripetuto sui pannelli portati nel <c><body></c> (select, calendario e i menu contestuale/di ordinamento), che, essendo teletrasportati, non erediterebbero le variabili della griglia.",
      p3: "Nella demo, apri il filtro Area o il calendario Data con il tema <c>midnight</c> per vedere i pannelli scuri:",
      customHeading: "Creare il proprio tema",
      p4: "Un tema è solo una classe CSS <c>arcana-theme-{name}</c> che sovrascrive i token <c>--arcana-*</c> — qualsiasi nome va bene, non solo i preset. Dichiara la classe nel CSS della tua applicazione e passa il nome in <c>config.theme</c> (o in <c>setDefaultArcanaTheme</c>): la stessa classe viene applicata automaticamente alla griglia e ai pannelli in portal, quindi un unico selettore copre tutto.",
      p5: "Non serve ridefinire ogni token — parti da quelli principali e sovrascrivi il resto quando serve; l'elenco completo è in cima allo <c>styles.css</c> del pacchetto. Il tema <c>candy</c> della demo qui sopra è esattamente questo esempio, definito nel CSS di questa documentazione, fuori dal pacchetto:"
    },
    localization: {
      title: "Localizzazione (i18n)",
      previewLabel: "componente reale · cambia il locale della griglia",
      p1: "Tutte le stringhe interne della griglia — il piè di pagina della paginazione, i controlli dei filtri, il menu di ordinamento, le etichette di selezione, gli stati vuoto/caricamento e il calendario — sono localizzate. Il pacchetto include <b>8 locale</b>: <c>pt-BR</c> (il predefinito, identico al comportamento storico), <c>en</c>, <c>es</c>, <c>it</c>, <c>zh</c>, <c>ja</c>, <c>de</c> e <c>ru</c>.",
      p2: "Scegli per tabella con <c>config.locale</c> oppure imposta il default globale con <c>setDefaultArcanaLocale(locale)</c> — usato da ogni tabella senza un proprio <c>locale</c> (<c>getDefaultArcanaLocale()</c> legge il valore corrente). È esattamente lo stesso pattern dei temi.",
      p3: "Ogni singola stringa può essere sostituita tramite <c>config.messages</c>, una mappa parziale applicata sopra il pack risolto — con o senza <c>locale</c>. La precedenza è <c>messages</c> → <c>locale</c> → default globale.",
      p4: "I nomi di mesi e giorni della settimana del calendario arrivano da <c>Intl.DateTimeFormat</c> e seguono automaticamente il locale della griglia. Cambia il locale qui sotto e apri il filtro Data per vederlo:",
      pickerAria: "Scegli il locale della griglia",
      customLabel: "Messaggi personalizzati (sostituisce il testo “Da…”)",
      customShowing: "✦ {from}–{to} di {total} record",
      keysTitle: "Tutte le chiavi personalizzabili",
      keysIntro: "Ogni chiave può essere sovrascritta singolarmente tramite <c>messages</c>: la tabella mostra le stringhe esatte del pacchetto <c>en</c> e di quello attivo. I template mantengono i segnaposto (<c>{from}</c>, <c>{to}</c>, <c>{total}</c>, <c>{count}</c>, <c>{label}</c>) quando li sostituisci.",
      keysKeyCol: "Chiave"
    },
    columns: {
      title: "Colonne",
      p1: "Ogni colonna è un oggetto <c>DataTableColumn</c> con un <c>name</c> (la chiave sulla riga) e un <c>label</c> (il testo dell'intestazione). Campi come <c>type</c> controllano la formattazione — per esempio, <c>CURRENCY</c> renderizza valori monetari — e <c>valueGetter</c> trasforma il contenuto della cella prima del rendering. Il contenuto stringa viene reso come testo sicuro ed escapato per impostazione predefinita; imposta <c>html: true</c> sulla colonna per interpretarlo come HTML, oppure restituisci un nodo nativo per contenuti ricchi.",
      p2: "La proprietà <c>columns</c> accetta anche una funzione <c>() => DataTableColumn[]</c>, utile quando le colonne dipendono dai permessi o dallo stato dell'applicazione."
    },
    columnManagement: {
      title: "Riordina e blocca le colonne",
      previewLabel: "componente reale · trascina le intestazioni e scorri orizzontalmente",
      p1: "Trascina lateralmente il corpo di un'intestazione per riordinare le colonne — le altre colonne si spostano in tempo reale aprendo lo spazio in cui andrà, mentre un chip fluttuante con il nome della colonna segue il puntatore (Esc annulla il trascinamento). Un clic breve apre comunque il menu di ordinamento e la maniglia di ridimensionamento sul bordo destro mantiene la priorità, quindi il trascinamento non intralcia mai. Attivo per impostazione predefinita (<c>columnReorderEnabled</c>); mantieni una singola colonna fissa al suo posto con <c>reorderable: false</c>.",
      p2: "Il menu dell'intestazione (lo stesso che contiene le opzioni di ordinamento) acquisisce <i>Blocca a sinistra</i>, <i>Blocca a destra</i> e <i>Sblocca</i>. Una colonna bloccata si congela sul suo bordo e resta visibile durante lo scorrimento orizzontale — le colonne bloccate a sinistra si attaccano all'inizio, a destra alla fine, con un divisore/ombra discreto. Impostalo in anticipo con <c>pinned: 'left'</c> o <c>pinned: 'right'</c> sulla colonna, oppure cambialo a runtime dal menu; le colonne di sistema (checkbox/espansore) si congelano a sinistra e la colonna delle azioni a destra. Riordino e blocco sono disabilitati da <c>columnPinEnabled</c> e ignorati nella modalità responsive <c>VERTICAL_RECORD</c>."
    },
    resize: {
      title: "Ridimensionare le colonne",
      previewLabel: "componente reale · trascina il bordo destro di un'intestazione",
      labelOn: "resize ATTIVO",
      labelOff: "resize DISATTIVO",
      p1: "Ogni intestazione porta una maniglia discreta sul bordo destro — trascinala per dare alla colonna esattamente la larghezza che vuoi. Il ridimensionamento è attivo per impostazione predefinita (<c>columnResizeEnabled: true</c>) e la maniglia mantiene la priorità sul trascinamento dell'intestazione, quindi non entra mai in conflitto con il riordino.",
      p2: "<c>cellMinWidth</c> funge da soglia minima: nessuna colonna può essere trascinata al di sotto di essa. Spegni le maniglie per l'intera griglia con <c>columnResizeEnabled: false</c>, oppure mantieni una singola colonna a larghezza fissa con <c>resizable: false</c> nella sua definizione. Confronta le due griglie qui sotto — la prima mostra la maniglia su ogni intestazione, la seconda su nessuna:"
    },
    pagination: {
      title: "Paginazione",
      p1: "La paginazione è abilitata per impostazione predefinita con <c>rowsPerPage: 10</c>. In modalità <c>remote</c>, la pagina corrente e la dimensione della pagina viaggiano nei <c>params</c> inviati al <c>datasource</c>; il <c>total</c> restituito dalla risposta alimenta il contatore nel footer.",
      p2: "Per navigare in modo programmatico, usa <c>controller.paginate(page, size)</c>. Quando la collezione diventa vuota, la tabella mostra il messaggio <c>empty</c> del pack di lingua — personalizzabile via <c>messages</c>:"
    },
    filters: {
      title: "Filtri",
      p1: "La ricerca per colonna è attiva per impostazione predefinita (<c>searchEnabled: true</c>). Ogni colonna con un <c>searchType</c> riceve il controllo appropriato nell'intestazione; in modalità <c>remote</c>, i valori compilati vengono inviati dentro i <c>params</c>.",
      p2: "Usa <c>initialFilters</c> per applicare filtri fin dalla primissima query — con <c>disableFilterWhenPresentOnInitialFilters</c>, il controllo corrispondente viene bloccato — e <c>setFilter</c> / <c>setFilters</c> sul controller per modificarli in risposta ad azioni della tua applicazione."
    },
    searchTypes: {
      title: "Tipi di ricerca",
      p1: "Il <c>searchType</c> di ogni colonna definisce il controllo mostrato all'utente. Ci sono sette tipi:",
      thControl: "Controllo",
      rows: {
        DATE: "Selettore di data singola",
        DATE_MONTH: "Selettore mese/anno (periodo contabile)",
        DATE_RANGE: "Intervallo tra due date",
        BOOLEAN: "Interruttore sì/no",
        LIST: "Lista fissa di opzioni",
        REMOTE: "Opzioni caricate da un endpoint",
        COMPONENT: "Un tuo componente personalizzato"
      },
      p2: "Tutti e sette, fianco a fianco (scorri orizzontalmente):"
    },
    sorting: {
      title: "Ordinamento",
      p1: "L'ordinamento per colonna è abilitato per impostazione predefinita (<c>orderByEnabled: true</c>): un clic sull'intestazione apre un menu con <i>Crescente</i>, <i>Decrescente</i> e — quando la colonna è già ordinata — <i>Rimuovi ordinamento</i>, che riporta la griglia allo stato neutro; le intestazioni espongono <c>aria-sort</c>. In modalità <c>remote</c>, l'ordinamento corrente viaggia nei <c>params</c>; in modalità <c>dataset</c>, viene risolto in memoria.",
      p2: "Disattivalo per colonna con <c>orderByEnabled: false</c> nella definizione della colonna, e usa <c>filterName</c> come alias del campo inviato al server. Per applicare un ordinamento da codice, usa <c>controller.applyOrderBy({ name, direction })</c> — oppure passa <c>null</c> per azzerarlo. Per combinare più colonne insieme, vedi <b>Ordinamento multi-colonna</b> subito sotto."
    },
    multiSort: {
      title: "Ordinamento multi-colonna",
      previewLabel: "componente reale · Shift+clic su un'intestazione per impilare un altro ordinamento",
      p1: "<b>Shift+clic</b> su un'intestazione aggiunge quella colonna all'ordinamento corrente invece di sostituirlo — ogni colonna cicla tra <i>crescente → decrescente → rimossa</i> mentre le altre restano al loro posto. Un piccolo badge di priorità (<c>1</c>, <c>2</c>, <c>3</c>…) accanto alla freccia mostra l'ordine in cui le colonne si applicano. La demo qui sotto si monta già ordinata per Area (crescente) e poi Importo (decrescente) — dentro ogni area, gli importi vanno dal più alto al più basso; Shift+clic su una terza intestazione per impilare un altro livello.",
      p2: "Da codice, <c>controller.applyOrderBy(orderBy)</c> accetta anche un <c>OrderBy[]</c> per un ordinamento completo su più colonne (l'indice 0 ordina per primo), e <c>controller.toggleOrderBy(name, { additive: true })</c> riproduce il ciclo dello Shift+clic per una colonna. In modalità <c>remote</c>, un ordinamento singolo mantiene i params classici <c>order_by[field]</c> / <c>order_by[direction]</c>; da due colonne in su diventano indicizzati — <c>order_by[0][field]</c>, <c>order_by[0][direction]</c>, <c>order_by[1][field]</c>, …"
    },
    checkbox: {
      title: "Selezione multipla",
      p1: "Con <c>checkboxEnabled: true</c>, ogni riga riceve una checkbox e l'intestazione permette di selezionare l'intera pagina. La selezione sopravvive al cambio di pagina.",
      p2: "Controlla lo stato iniziale con <c>isRowChecked</c>, blocca righe con <c>isCheckboxRowDisabled</c> e reagisci agli eventi <c>onRowChecked</c> / <c>onRowUnchecked</c>. Leggi le righe selezionate con <c>getCheckedRows()</c> e svuota tutto con <c>clearCheckedRows()</c> — tipico delle azioni in blocco come \"esporta selezionati\"."
    },
    radio: {
      title: "Selezione singola",
      p1: "Quando il flusso richiede esattamente un record — scegliere un cliente in una finestra di dialogo, per esempio — abilita <c>radioButtonSelectionEnabled: true</c>. Ogni riga mostra un radio button e selezionare una riga deseleziona la precedente; <c>uniqueKeyIdentifier</c> definisce la chiave di identità.",
      p2: "Anche la riga scelta si legge tramite <c>getCheckedRows()</c>, che in questa modalità restituisce al massimo un elemento."
    },
    summary: {
      title: "Totali",
      p1: "Con <c>footerSummarizerEnabled: true</c>, la tabella aggiunge una riga di footer con il totale delle colonne numeriche — le colonne <c>CURRENCY</c> vengono sommate e formattate come valuta. Con <c>summarizeOnlyChecked</c>, solo le righe selezionate entrano nella somma.",
      p2: "Il valore consolidato di una colonna è disponibile anche da codice, tramite <c>getSummarizedValue(column)</c>."
    },
    layout: {
      title: "Responsività",
      p1: "Su schermi stretti, scegli il comportamento con <c>responsiveMode</c>:",
      liOverflow: "<c>HORIZONTAL_OVERFLOW</c> — mantiene la struttura a tabella e abilita lo scorrimento orizzontale.",
      liVertical: "<c>VERTICAL_RECORD</c> — ogni riga diventa una card verticale, con l'etichetta della colonna accanto a ogni valore.",
      p2: "Per liste lunghe, <c>stickyHeaderEnabled: true</c> mantiene visibile l'intestazione durante lo scorrimento, e <c>height</c> + <c>overflowEnabled</c> creano un'area scorrevole:"
    },
    actions: {
      title: "Azioni ed eventi",
      p1: "La colonna <c>actions</c> renderizza pulsanti per riga — con visibilità condizionale tramite <c>isVisible</c> — e gli eventi <c>onClickRow</c>, <c>onDoubleClickRow</c>, <c>onClickCell</c>, <c>onDoubleClickCell</c> e <c>onContextMenu</c> coprono le interazioni di riga e cella. <c>rowFocusEnabled</c> e <c>cellFocusEnabled</c> forniscono il feedback visivo di focus.",
      p2: "La richiesta iniziale avviene al mount (<c>sendRequestOnMounted: true</c>); disattivala quando la tabella dipende da un filtro che l'utente deve ancora scegliere. I fallimenti del <c>datasource</c> finiscono in <c>onRequestError</c>."
    },
    expandable: {
      title: "Righe espandibili",
      previewLabel: "componente reale · renderer asincrono (~700ms)",
      p1: "Con <c>expandableRowsEnabled: true</c>, ogni riga riceve un pulsante chevron nella prima colonna (prima della checkbox, quando c'è). Un clic apre, subito sotto, un'area a tutta larghezza con contenuto interamente tuo, renderizzato da <c>expandedRowRenderer(row, grid)</c> — più righe possono restare aperte contemporaneamente, e il cambio di pagina o di dataset richiude tutto.",
      p2: "Il renderer può essere <b>sincrono</b> — restituisce il contenuto direttamente, usando i dati della riga stessa — o <b>asincrono</b> — restituisce una <c>Promise</c> (una chiamata API, per esempio). Nel caso asincrono, l'area mostra uno stato di caricamento finché la Promise non si risolve; il default integrato (spinner + \"Caricamento dettagli…\") può essere sostituito con <c>expandedRowLoadingRenderer</c>. Riaprire una riga riesegue il renderer, garantendo dati freschi; se la Promise viene rigettata, l'area mostra un avviso discreto.",
      p3: "Con <c>expandRowOnClick: true</c>, un clic in qualsiasi punto della riga alterna anche l'espansione — senza interferire con <c>onClickRow</c>, che continua a scattare. E il controller espone il controllo programmatico: <c>expandRow(uuid)</c>, <c>collapseRow(uuid)</c> e <c>getExpandedRows()</c>.",
      p4: "Nella demo, il renderer asincrono simula un'API con un ritardo di ~700ms — nota lo stato di caricamento prima che appaia il mini profilo:"
    },
    hooks: {
      title: "Hook",
      p1: "Gli hook di rendering trasformano righe, celle, intestazioni e stili subito prima del mount: <c>onBeforeRowMounted</c> regola l'intera riga, <c>onBeforeCellMounted</c> e <c>onBeforeHeaderCellMounted</c> sostituiscono il contenuto, e <c>onBeforeCellStyleMounted</c> restituisce stili per cella.",
      p2: "Nella demo, la colonna \"Situazione\" è derivata da <c>active</c> in <c>onBeforeRowMounted</c> e colorata in <c>onBeforeCellStyleMounted</c>:"
    },
    properties: {
      title: "Proprietà",
      intro: "Tutte le proprietà più usate dell'oggetto <c>config</c> — la definizione TypeScript esportata dal pacchetto è la fonte di verità:",
      thProperty: "Proprietà",
      thType: "Tipo",
      thDefault: "Default",
      thDescription: "Descrizione",
      tip: "<b>Suggerimento:</b> dichiara solo ciò che differisce dai default — un <c>config</c> con <c>columns</c> e <c>datasource</c> è già una tabella completa.",
      defaults: {
        inferred: "inferito",
        builtIn: "integrato"
      },
      descriptions: {
        mode: "Definisce dove vengono eseguiti filtri, ordinamento e paginazione.",
        theme: "Tema visivo della griglia e dei pannelli in portal — un preset o il nome di un tema proprio (classe arcana-theme-{name}); il default globale cambia con setDefaultArcanaTheme.",
        locale: "Locale delle stringhe interne della griglia (8 pack inclusi); il default globale cambia con setDefaultArcanaLocale.",
        messages: "Sostituzioni puntuali delle stringhe interne, applicate sopra il pack del locale risolto.",
        dataset: "Collezione completa per le operazioni locali; inferisce la modalità dataset.",
        columns: "Colonne visibili e i loro renderer.",
        html: "Quando è true, il contenuto stringa della colonna (valore grezzo o risultato di valueGetter/headerContentGetter) viene interpretato come HTML; altrimenti viene reso come testo sicuro ed escapato. Per contenuti ricchi, restituisci un nodo nativo.",
        datasource: "Provider interrogato in modalità remote.",
        url: "Endpoint usato in modalità remote senza datasource.",
        rowsPerPage: "Quantità iniziale per pagina.",
        searchEnabled: "Mostra i filtri per colonna.",
        orderByEnabled: "Abilita l'ordinamento sulle intestazioni.",
        checkboxEnabled: "Abilita la selezione multipla.",
        radioButtonSelectionEnabled: "Abilita la selezione singola.",
        footerSummarizerEnabled: "Mostra i totali numerici.",
        expandableRowsEnabled: "Aggiunge la colonna del chevron e abilita l'area dei dettagli per riga.",
        expandedRowRenderer: "Contenuto dell'area espansa; un ritorno asincrono mostra lo stato di caricamento fino alla risoluzione.",
        expandedRowLoadingRenderer: "Sostituisce lo stato di caricamento predefinito mostrato mentre il renderer asincrono si risolve.",
        expandRowOnClick: "Un clic in qualsiasi punto della riga alterna anche l'espansione (onClickRow continua a scattare).",
        onRowExpandedCollapsed: "Notificano l'espansione e la chiusura di ogni riga.",
        responsiveMode: "Definisce la presentazione mobile.",
        stickyHeaderEnabled: "Mantiene l'intestazione durante lo scorrimento.",
        columnResizeEnabled: "Abilita le maniglie di trascinamento per ridimensionare le intestazioni delle colonne.",
        resizable: "Consente di ridimensionare questa colonna trascinando il bordo dell'intestazione.",
        columnReorderEnabled: "Abilita il riordino trascinando il corpo dell'intestazione (ignorato in VERTICAL_RECORD).",
        reorderable: "Consente di trascinare questa colonna in una nuova posizione; imposta false per tenerla fissa.",
        pinned: "Congela questa colonna su un bordo (fissa durante lo scorrimento orizzontale); modificabile dal menu dell'intestazione.",
        sendRequestOnMounted: "Controlla la prima query remota.",
        initialFilters: "Filtri iniziali remoti o locali.",
        onRequestError: "Notifica i fallimenti di caricamento."
      }
    },
    methods: {
      title: "Metodi del controller",
      p1: "Il <b>controller</b> è l'istanza che espone i metodi programmatici della tabella. Ottienilo con una <c>ref</c> puntata al componente — il pattern idiomatico di ciascun framework — e chiama qualsiasi metodo dalla tua UI.",
      p2: "Le firme qui sotto provengono dall'interfaccia <c>DataTableApi</c> esportata dal pacchetto. <c>Row</c> è il tipo generico della riga (<c>DataTableRow</c> per default) e <c>OrderBy</c> è <c>{ name: string; direction: 'asc' | 'desc' }</c>.",
      docs: {
        refresh: {
          description: "Riesegue la query corrente, preservando filtri, ordinamento e pagina (scorciatoia per fetch())."
        },
        setRows: {
          description: "Sostituisce le righe mostrate nella pagina corrente e aggiorna il totale; in modalità dataset delega a setDataset. Restituisce le righe normalizzate.",
          params: { rows: "nuove righe per la pagina corrente." }
        },
        setDataset: {
          description: "Sostituisce l'intera collezione e torna alla pagina 1; disponibile solo in modalità dataset (lancia un errore in modalità remote). Restituisce il dataset normalizzato.",
          params: { rows: "collezione completa mantenuta in memoria." }
        },
        getDataset: {
          description: "Restituisce una copia della collezione completa della modalità dataset (array vuoto in modalità remote)."
        },
        addRow: {
          description: "Aggiunge una riga alla fine della collezione (dataset) o della pagina corrente (remote), incrementando il totale.",
          params: { row: "riga da inserire; riceve automaticamente un _uuid interno." }
        },
        updateRow: {
          description: "Applica una patch parziale alla riga identificata, preservando gli altri campi.",
          params: {
            uuid: "l'_uuid interno della riga (generato durante la normalizzazione).",
            row: "campi da sovrascrivere sulla riga."
          }
        },
        removeRow: {
          description: "Rimuove la riga identificata e decrementa il totale.",
          params: { uuid: "l'_uuid interno della riga." }
        },
        getRows: {
          description: "Restituisce le righe attualmente renderizzate (la pagina visibile)."
        },
        getCheckedRows: {
          description: "Restituisce le righe con la checkbox selezionata — in modalità dataset considera l'intera collezione, non solo la pagina."
        },
        clearCheckedRows: {
          description: "Deseleziona la checkbox di tutte le righe."
        },
        setFilter: {
          description: "Imposta un filtro, torna alla pagina 1 e riesegue la query (remote) o ricalcola localmente (dataset).",
          params: {
            name: "nome del filtro (il filterName ?? name della colonna).",
            value: "valore del filtro; null, '' o [] azzerano il filtro."
          }
        },
        setFilters: {
          description: "Applica più filtri in una volta sola, con un'unica nuova query alla fine.",
          params: { filters: "mappa nome → valore; i valori vuoti azzerano il filtro corrispondente." }
        },
        paginate: {
          description: "Naviga alla pagina indicata e regola la dimensione della pagina (minimo 1 per entrambi).",
          params: {
            page: "pagina di destinazione (base 1).",
            rowsPerPage: "numero di righe per pagina."
          }
        },
        applyOrderBy: {
          description: "Sostituisce l'intero ordinamento e torna alla pagina 1: un singolo OrderBy mantiene il classico comportamento a colonna singola, un OrderBy[] applica un ordinamento multi-colonna completo (l'indice 0 ordina per primo), e null azzera l'ordinamento.",
          params: { orderBy: "un oggetto { name: string; direction: 'asc' | 'desc' }, un OrderBy[] per un ordinamento multi-colonna, oppure null per azzerare." }
        },
        toggleOrderBy: {
          description: "Alterna l'ordinamento di una colonna esattamente come un clic sull'intestazione e torna alla pagina 1; con additive: true riproduce lo Shift+clic, conservando le altre colonne ordinate.",
          params: {
            name: "nome della colonna il cui ordinamento viene alternato (asc → desc → rimosso).",
            options: "additive: true conserva le altre colonne ordinate; senza, la colonna diventa l'unico ordinamento."
          }
        },
        setColumnOrder: {
          description: "Sostituisce per intero l'ordine effettivo delle colonne; un array vuoto ripristina l'ordine naturale della config.",
          params: { order: "elenco dei nomi delle colonne nell'ordine desiderato; i nomi assenti finiscono in coda." }
        },
        moveColumn: {
          description: "Sposta una colonna accanto a un'altra, posizionandola prima (predefinito) o dopo il target; un target null la manda in coda.",
          params: {
            name: "nome della colonna da spostare.",
            targetName: "nome della colonna di riferimento, oppure null per mandare la colonna in coda.",
            position: "se la colonna finisce prima (predefinito) o dopo il target."
          }
        },
        setColumnPinned: {
          description: "Blocca la colonna su un bordo (o la sblocca con null), sovrascrivendo il pinned della config della colonna.",
          params: {
            name: "nome della colonna da bloccare.",
            pinned: "'left', 'right' oppure null per sbloccare."
          }
        },
        getColumnPin: {
          description: "Restituisce il blocco attuale della colonna ('left', 'right' o null): l'override a runtime quando presente, altrimenti il pinned della config della colonna.",
          params: { name: "nome della colonna da consultare." }
        },
        expandRow: {
          description: "Espande la riga identificata, renderizzando l'area dei dettagli subito sotto (richiede expandableRowsEnabled). Ignorato quando la riga è già espansa o non è nella pagina corrente.",
          params: { uuid: "l'_uuid interno della riga (generato durante la normalizzazione)." }
        },
        collapseRow: {
          description: "Richiude la riga identificata, rimuovendo l'area dei dettagli; ignorato quando la riga non è espansa.",
          params: { uuid: "l'_uuid interno della riga." }
        },
        getExpandedRows: {
          description: "Restituisce le righe attualmente espanse nella pagina visibile — il cambio di pagina o di dataset richiude tutto."
        },
        getSummarizedValue: {
          description: "Somma i valori della colonna sulle righe correnti e restituisce { raw, formatted }; null quando la colonna non è sommabile (nessun type numerico né summarizerValueGetter).",
          params: {
            column: "colonna da totalizzare.",
            onlyIsChecked: "combinato con summarizeOnlyChecked, limita la somma alle righe selezionate."
          }
        }
      }
    }
  },

  playground: {
    panelAria: "Impostazioni del playground",
    settings: "Impostazioni",
    reset: "Reimposta",
    groupData: "Dati",
    groupFeatures: "Funzionalità",
    groupExpandable: "Righe espandibili",
    groupLayout: "Layout",
    groupTheme: "Tema",
    groupLocalization: "Localizzazione",
    localeAuto: "segue la lingua della documentazione",
    addOverride: "Aggiungi override…",
    removeOverride: "Rimuovi l'override di {key}",
    emptyDataset: "Dataset vuoto",
    emptyDatasetHint: "mostra il messaggio di vuoto",
    checkboxHint: "esclude la selezione singola",
    radioHint: "esclude la selezione multipla",
    actionsHint: "pulsante “Apri” per riga",
    renderer: "Renderer",
    rendererSync: "sincrono",
    rendererAsync: "asincrono (700ms)",
    customLoading: "Loading personalizzato",
    heightHint: "funziona insieme a overflowEnabled",
    themePickerAria: "Scegli il tema",
    stageCaption: "componente reale · reagisce a ogni impostazione",
    initialEvent: "Clicca un'azione della tabella",
    openAction: "Apri",
    openEvent: "Apri {name}",
    customLoadingText: "Preparazione del profilo di {name}…",
    generatedCode: "Codice generato",
    codeNote: "solo ciò che differisce dai default",
    tableAria: "Playground di Arcana DataTable",
    infoAria: "Informazioni su {label}",
    hints: {
      rowsPerPage: "Righe mostrate per pagina.",
      messages: "Sostituisce singoli testi del pack di lingua; il placeholder mostra il valore attuale del pack.",
      searchEnabled: "Campo di ricerca sopra la tabella.",
      orderByEnabled: "Clicca un'intestazione per ordinare quella colonna.",
      footerSummarizerEnabled: "Totali riepilogati nel footer.",
      summarizeOnlyChecked: "Somma solo le righe selezionate.",
      rowFocusEnabled: "Evidenzia la riga sotto il cursore.",
      cellFocusEnabled: "Evidenzia la cella a fuoco.",
      expandableRowsEnabled: "Le righe possono espandersi per mostrare i dettagli.",
      expandRowOnClick: "Si espande cliccando in qualsiasi punto della riga.",
      renderer: "Contenuto immediato o risolto via Promise.",
      customLoading: "Stato di caricamento personalizzato in modalità asincrona.",
      stickyHeaderEnabled: "L'intestazione resta visibile durante lo scroll.",
      columnResizeEnabled: "Trascina i bordi dell'intestazione per ridimensionare le colonne.",
      columnReorderEnabled: "Trascina un'intestazione per riordinare le colonne.",
      pinColumns: "Blocca la prima colonna a sinistra e l'ultima a destra.",
      overflowEnabled: "Il corpo scorre invece di crescere.",
      responsiveMode: "Comportamento su schermi stretti.",
      footerVisible: "Mostra il footer con la paginazione.",
      isRowsPerPageVisible: "Selettore di righe per pagina nel footer.",
      calculateCellWidth: "Larghezza delle colonne calcolata dal contenuto.",
      theme: "Palette visiva della tabella.",
      locale: "Lingua dei testi interni della tabella."
    }
  },

  demos: {
    departments: {
      engineering: "Ingegneria",
      research: "Ricerca",
      product: "Prodotto",
      editorial: "Editoriale",
      infrastructure: "Infrastruttura"
    },
    statuses: {
      active: "Attivo",
      inReview: "In revisione",
      inactive: "Inattivo"
    },
    available: "Disponibile",
    unavailable: "Non disponibile",
    cols: {
      id: "ID",
      name: "Nome",
      email: "Email",
      area: "Area",
      status: "Stato",
      joinedAt: "Assunzione",
      amount: "Importo",
      score: "Score",
      client: "Cliente",
      department: "Reparto",
      person: "Persona",
      situation: "Situazione",
      date: "Data",
      month: "Mese",
      period: "Periodo",
      boolean: "Booleano",
      list: "Lista",
      remoteList: "Lista remota",
      custom: "Personalizzato",
      code: "Codice",
      totalSelected: "Totale selezionato",
      points: "Punti"
    },
    requestsLabel: "{n} richiesta/e",
    zeroRequests: "zero richieste",
    emptyStateTest: "Prova lo stato vuoto",
    restoreDataset: "Ripristina il dataset",
    paginationEmpty: "Nessun dipendente in questa porzione.",
    customFilter: "Filtro personalizzato",
    checkboxInitial: "Seleziona una riga",
    checkedEvent: "{name} selezionato",
    uncheckedEvent: "{name} rimosso",
    checkboxChanged: "Checkbox modificata: {name}",
    radioInitial: "Nessuna riga scelta",
    radioChosen: "Scelto: {name}",
    radioRemoved: "Rimosso: {name}",
    radioChanged: "Radio modificato: {name}",
    actionsInitial: "Clicca una riga, una cella o un'azione",
    open: "Apri",
    openEvent: "Apri {name}",
    rowClick: "Clic: {name}",
    rowDblClick: "Doppio clic: {name}",
    cellClick: "Cella {column}: {name}",
    cellDblClick: "Doppio clic su {column}: {name}",
    ctxCopy: "Copia {column}",
    ctxCopied: "Copiato da {name}",
    card: {
      email: "Email",
      area: "Area",
      score: "Score",
      joined: "Assunzione",
      pts: "pt"
    },
    aria: {
      firstUse: "Primo utilizzo di Arcana DataTable",
      themes: "Dimostrazione dei temi",
      themePicker: "Scegli il tema",
      expandable: "Dimostrazione delle righe espandibili",
      hooks: "Esempio di hook di rendering"
    }
  }
};
