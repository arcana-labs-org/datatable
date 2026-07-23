import type { Messages } from "./types";

export const es: Messages = {
  meta: { htmlLang: "es", locale: "es-ES" },
  langName: "Español",

  shell: {
    kicker: "Documentación · v1.x",
    lead: "Una tabla de datos tipada para Vue 3, React, Angular y Svelte. La misma configuración, el mismo comportamiento, el mismo resultado — en cualquiera de los cuatro frameworks.",
    navDocs: "Docs",
    navPlayground: "Playground",
    topNavAria: "Áreas del sitio",
    searchPlaceholder: "Buscar en la documentación… (⌘K)",
    searchAria: "Buscar en la documentación",
    chooseFramework: "Elegir framework",
    chooseLanguage: "Elegir idioma",
    openNav: "Abrir navegación",
    closeNav: "Cerrar navegación",
    openSettings: "Abrir ajustes",
    closeSettings: "Cerrar ajustes",
    sidebarAria: "Navegación de la documentación",
    noSectionsFound: "No se encontraron secciones.",
    previewTab: "Vista previa",
    codeTab: "Código",
    codeOnlyLabel: "Código",
    defaultPreviewCaption: "componente real · interactúa con él",
    sectionExampleAria: "Ejemplo de {title}",
    keyChipsAria: "Ajustes cubiertos"
  },

  codeBlock: {
    copy: "Copiar",
    copied: "¡Copiado!"
  },

  groups: {
    gettingStarted: "Primeros pasos",
    concepts: "Conceptos",
    features: "Funcionalidades",
    reference: "Referencia"
  },

  sections: {
    install: {
      title: "Instalación",
      p1: "La librería se distribuye como un único paquete npm. Los adaptadores de React, Vue, Angular y Svelte se exponen en subrutas separadas (<c>@arcanalabs/datatable/react</c>, <c>@arcanalabs/datatable/vue</c>, <c>@arcanalabs/datatable/angular</c> y <c>@arcanalabs/datatable/svelte</c>), de modo que tu bundle final solo incluye el framework que realmente usas.",
      p2: "Instálala con tu gestor de paquetes preferido y listo — no hay dependencias transitivas de UI."
    },
    firstUse: {
      title: "Primer uso",
      previewLabel: "componente real · modo remote",
      p1: "Todo el comportamiento de la tabla vive en un único objeto <c>config</c>. Declaras las columnas, apuntas a la fuente de datos y renderizas el componente <c>ArcanaDataTable</c> — la búsqueda, la ordenación y la paginación ya funcionan sin una sola línea extra.",
      p2: "El ejemplo de al lado usa el modo <c>remote</c>: en cada interacción del usuario, la tabla llama a tu <c>datasource</c> con los parámetros actuales. La demo de abajo hace exactamente eso, con un datasource local que simula la API — busca por nombre u ordena las columnas."
    },
    styles: {
      title: "Estilos",
      p1: "La hoja de estilos es opt-in: importa <c>@arcanalabs/datatable/styles.css</c> una sola vez, en la raíz de tu aplicación. Cubre la tabla, los filtros, la paginación y los estados de carga.",
      p2: "Si prefieres tu propio aspecto, simplemente omite la importación del CSS — el marcado es semántico y estable, pensado para estilizarse desde fuera."
    },
    modes: {
      title: "Modos remote/dataset",
      intro: "Hay dos formas de alimentar la tabla, y esta elección define quién hace el trabajo de filtrar, ordenar y paginar:",
      liRemote: "<b>remote</b> — cada filtro, ordenación o cambio de página dispara una llamada a <c>datasource(params)</c> (o a la <c>url</c> configurada). La respuesta esperada tiene la forma <c>{ rows, total, page }</c>.",
      liDataset: "<b>dataset</b> — entregas la colección completa en memoria y la tabla lo resuelve todo localmente, con cero peticiones.",
      rowOrigin: "Origen",
      originDataset: "<c>dataset</c> en memoria",
      rowFilterSort: "Filtrado / ordenación",
      filterSortRemote: "en el servidor",
      filterSortDataset: "dentro de la propia tabla",
      rowRequests: "Peticiones",
      requestsRemote: "en cada interacción",
      requestsDataset: "ninguna",
      compare: "Compara ambos en vivo — el contador muestra cuántas peticiones ha hecho hasta ahora el modo <c>remote</c>:"
    },
    themes: {
      title: "Temas",
      previewLabel: "componente real · cambia el tema",
      p1: "Todo el aspecto del grid se construye sobre design tokens (las variables CSS <c>--arcana-*</c>), y el paquete incluye cuatro temas listos: <c>zinc</c> (el neutro claro por defecto), <c>ocean</c> (azules), <c>forest</c> (verdes) y <c>midnight</c> (completamente oscuro).",
      p2: "Elige uno por tabla con <c>config.theme</c>, o define el valor global por defecto con <c>setDefaultArcanaTheme(theme)</c> — usado por toda tabla sin su propio <c>theme</c> (<c>getDefaultArcanaTheme()</c> lee el valor actual). El tema se aplica como la clase <c>arcana-theme-*</c> en el elemento raíz y se repite en los paneles portalados al <c><body></c> (select, calendario y los menús de contexto/ordenación), que, al estar teletransportados, no heredarían las variables del grid.",
      p3: "En la demo, abre el filtro de Área o el calendario de Fecha con el tema <c>midnight</c> para ver los paneles oscuros:",
      customHeading: "Crear tu propio tema",
      p4: "Un tema es solo una clase CSS <c>arcana-theme-{name}</c> que sobrescribe los tokens <c>--arcana-*</c> — vale cualquier nombre, no solo los presets. Declara la clase en el CSS de tu aplicación y pasa el nombre en <c>config.theme</c> (o en <c>setDefaultArcanaTheme</c>): la misma clase se aplica automáticamente al grid y a los paneles portalados, así que un único selector lo cubre todo.",
      p5: "No necesitas redefinir todos los tokens — empieza por los principales y sobrescribe el resto según lo necesites; la lista completa está al inicio del <c>styles.css</c> del paquete. El tema <c>candy</c> de la demo de arriba es exactamente este ejemplo, definido en el CSS de esta documentación, fuera del paquete:"
    },
    localization: {
      title: "Localización (i18n)",
      previewLabel: "componente real · cambia el locale del grid",
      p1: "Todas las cadenas internas del grid — el pie de paginación, los controles de filtro, el menú de ordenación, las etiquetas de selección, los estados vacío/cargando y el calendario — están localizadas. El paquete incluye <b>8 locales</b>: <c>pt-BR</c> (el predeterminado, igual al comportamiento histórico), <c>en</c>, <c>es</c>, <c>it</c>, <c>zh</c>, <c>ja</c>, <c>de</c> y <c>ru</c>.",
      p2: "Elige uno por tabla con <c>config.locale</c> o define el valor global con <c>setDefaultArcanaLocale(locale)</c> — usado por toda tabla sin su propio <c>locale</c> (<c>getDefaultArcanaLocale()</c> lee el valor actual). Es exactamente el mismo patrón de los temas.",
      p3: "Cualquier cadena individual puede reemplazarse con <c>config.messages</c>, un mapa parcial aplicado sobre el pack resuelto — con o sin <c>locale</c>. La precedencia es <c>messages</c> → <c>locale</c> → predeterminado global.",
      p4: "Los nombres de meses y días de la semana del calendario vienen de <c>Intl.DateTimeFormat</c> y siguen automáticamente el locale del grid. Cambia el locale abajo y abre el filtro de Fecha para verlo:",
      pickerAria: "Elegir locale del grid",
      customLabel: "Mensajes personalizados (reemplaza el “Mostrando…”)",
      customShowing: "✦ {from}–{to} de {total} registros",
      keysTitle: "Todas las claves personalizables",
      keysIntro: "Cada clave puede sobrescribirse individualmente mediante <c>messages</c>: la tabla muestra las cadenas exactas del paquete <c>en</c> y del paquete activo. Las plantillas conservan sus marcadores (<c>{from}</c>, <c>{to}</c>, <c>{total}</c>, <c>{count}</c>, <c>{label}</c>) al reemplazarlas.",
      keysKeyCol: "Clave"
    },
    columns: {
      title: "Columnas",
      p1: "Cada columna es un objeto <c>DataTableColumn</c> con un <c>name</c> (la clave en la fila) y un <c>label</c> (el texto del encabezado). Campos como <c>type</c> controlan el formato — por ejemplo, <c>CURRENCY</c> renderiza valores monetarios — y <c>valueGetter</c> transforma el contenido de la celda antes de renderizar. El contenido de texto se renderiza como texto seguro y escapado por defecto; define <c>html: true</c> en la columna para interpretarlo como HTML, o devuelve un nodo nativo para contenido enriquecido.",
      p2: "La propiedad <c>columns</c> también acepta una función <c>() => DataTableColumn[]</c>, útil cuando las columnas dependen de permisos o del estado de la aplicación."
    },
    columnManagement: {
      title: "Reordenar y fijar columnas",
      previewLabel: "componente real · arrastra los encabezados y desplázate horizontalmente",
      p1: "Arrastra lateralmente el cuerpo de un encabezado para reordenar las columnas — las demás columnas se apartan en vivo para abrir el hueco donde caerá, mientras un chip flotante con el nombre de la columna sigue el puntero (Esc cancela el arrastre). Un clic corto sigue abriendo el menú de ordenación y el tirador de redimensionar del borde derecho mantiene la prioridad, así que arrastrar nunca estorba. Activo por defecto (<c>columnReorderEnabled</c>); mantén una columna fija en su lugar con <c>reorderable: false</c>.",
      p2: "El menú del encabezado (el mismo que lleva las opciones de ordenación) gana <i>Fijar a la izquierda</i>, <i>Fijar a la derecha</i> y <i>Desfijar</i>. Una columna fijada se congela en su borde y permanece visible durante el desplazamiento horizontal — las columnas fijadas a la izquierda se pegan al inicio, a la derecha al final, con un divisor/sombra sutil. Configúralo de antemano con <c>pinned: 'left'</c> o <c>pinned: 'right'</c> en la columna, o cámbialo en tiempo de ejecución desde el menú; las columnas de sistema (checkbox/expansor) se congelan a la izquierda y la columna de acciones a la derecha. Reordenar y fijar se desactivan con <c>columnPinEnabled</c> y se ignoran en el modo responsivo <c>VERTICAL_RECORD</c>."
    },
    resize: {
      title: "Redimensionar columnas",
      previewLabel: "componente real · arrastra el borde derecho de un encabezado",
      labelOn: "resize ACTIVADO",
      labelOff: "resize DESACTIVADO",
      p1: "Cada encabezado lleva un tirador discreto en su borde derecho — arrástralo para darle a la columna exactamente el ancho que quieras. El redimensionado viene activo por defecto (<c>columnResizeEnabled: true</c>) y el tirador mantiene la prioridad sobre el arrastre del encabezado, así que nunca entra en conflicto con la reordenación.",
      p2: "<c>cellMinWidth</c> actúa como suelo: ninguna columna puede arrastrarse por debajo de él. Apaga los tiradores de todo el grid con <c>columnResizeEnabled: false</c>, o mantén una columna concreta con ancho fijo usando <c>resizable: false</c> en su definición. Compara los dos grids de abajo — el primero muestra el tirador en todos los encabezados, el segundo en ninguno:"
    },
    pagination: {
      title: "Paginación",
      p1: "La paginación viene habilitada por defecto con <c>rowsPerPage: 10</c>. En modo <c>remote</c>, la página actual y el tamaño de página viajan en los <c>params</c> enviados al <c>datasource</c>; el <c>total</c> devuelto por la respuesta alimenta el contador del pie.",
      p2: "Para navegar programáticamente, usa <c>controller.paginate(page, size)</c>. Cuando la colección queda vacía, la tabla muestra el mensaje <c>empty</c> del pack de idioma — personalizable vía <c>messages</c>:"
    },
    filters: {
      title: "Filtros",
      p1: "La búsqueda por columna está activa por defecto (<c>searchEnabled: true</c>). Cada columna con un <c>searchType</c> recibe el control adecuado en el encabezado; en modo <c>remote</c>, los valores introducidos se envían dentro de los <c>params</c>.",
      p2: "Usa <c>initialFilters</c> para aplicar filtros ya en la primera consulta — con <c>disableFilterWhenPresentOnInitialFilters</c>, el control correspondiente queda bloqueado — y <c>setFilter</c> / <c>setFilters</c> en el controller para cambiarlos en respuesta a acciones de tu aplicación."
    },
    searchTypes: {
      title: "Tipos de búsqueda",
      p1: "El <c>searchType</c> de cada columna define el control que se muestra al usuario. Hay siete tipos:",
      thControl: "Control",
      rows: {
        DATE: "Selector de fecha única",
        DATE_MONTH: "Selector de mes/año (periodo contable)",
        DATE_RANGE: "Rango entre dos fechas",
        BOOLEAN: "Conmutador sí/no",
        LIST: "Lista fija de opciones",
        REMOTE: "Opciones cargadas desde un endpoint",
        COMPONENT: "Tu propio componente personalizado"
      },
      p2: "Los siete, uno al lado del otro (desplázate horizontalmente):"
    },
    sorting: {
      title: "Ordenación",
      p1: "La ordenación por columna viene habilitada por defecto (<c>orderByEnabled: true</c>): hacer clic en el encabezado abre un menú con <i>Ascendente</i>, <i>Descendente</i> y — cuando la columna ya está ordenada — <i>Quitar ordenación</i>, que devuelve el grid a su estado neutro; los encabezados exponen <c>aria-sort</c>. En modo <c>remote</c>, la ordenación actual viaja en los <c>params</c>; en modo <c>dataset</c>, se resuelve en memoria.",
      p2: "Desactívala por columna con <c>orderByEnabled: false</c> en la definición de la columna, y usa <c>filterName</c> como alias del campo enviado al servidor. Para aplicar una ordenación desde código, usa <c>controller.applyOrderBy({ name, direction })</c> — o pasa <c>null</c> para limpiarla. Para combinar varias columnas a la vez, mira <b>Ordenación multicolumna</b> justo debajo."
    },
    multiSort: {
      title: "Ordenación multicolumna",
      previewLabel: "componente real · Mayús+clic en un encabezado para apilar otra ordenación",
      p1: "<b>Mayús+clic</b> en un encabezado añade esa columna a la ordenación actual en lugar de sustituirla — cada columna alterna entre <i>ascendente → descendente → quitada</i> mientras las demás permanecen en su sitio. Una pequeña insignia de prioridad (<c>1</c>, <c>2</c>, <c>3</c>…) junto a la flecha muestra el orden en que se aplican las columnas. La demo de abajo ya se monta ordenada por Área (ascendente) y luego Importe (descendente) — dentro de cada área, los importes van de mayor a menor; Mayús+clic en un tercer encabezado para apilar un nivel más.",
      p2: "Desde código, <c>controller.applyOrderBy(orderBy)</c> también acepta un <c>OrderBy[]</c> para una ordenación completa de varias columnas (el índice 0 ordena primero), y <c>controller.toggleOrderBy(name, { additive: true })</c> reproduce el ciclo de Mayús+clic para una columna. En modo <c>remote</c>, una ordenación única conserva los params clásicos <c>order_by[field]</c> / <c>order_by[direction]</c>; a partir de dos columnas pasan a estar indexados — <c>order_by[0][field]</c>, <c>order_by[0][direction]</c>, <c>order_by[1][field]</c>, …"
    },
    checkbox: {
      title: "Selección múltiple",
      p1: "Con <c>checkboxEnabled: true</c>, cada fila recibe un checkbox y el encabezado permite seleccionar la página entera. La selección sobrevive a los cambios de página.",
      p2: "Controla el estado inicial con <c>isRowChecked</c>, bloquea filas con <c>isCheckboxRowDisabled</c> y reacciona a los eventos <c>onRowChecked</c> / <c>onRowUnchecked</c>. Lee las filas marcadas con <c>getCheckedRows()</c> y límpialo todo con <c>clearCheckedRows()</c> — típico en acciones por lotes como \"exportar seleccionados\"."
    },
    radio: {
      title: "Selección única",
      p1: "Cuando el flujo requiere exactamente un registro — elegir un cliente en un diálogo, por ejemplo — habilita <c>radioButtonSelectionEnabled: true</c>. Cada fila muestra un radio button y marcar una fila desmarca la anterior; <c>uniqueKeyIdentifier</c> define la clave de identidad.",
      p2: "La fila elegida también se lee vía <c>getCheckedRows()</c>, que en este modo devuelve como máximo un elemento."
    },
    summary: {
      title: "Totales",
      p1: "Con <c>footerSummarizerEnabled: true</c>, la tabla añade una fila de pie con el total de las columnas numéricas — las columnas <c>CURRENCY</c> se suman y se formatean como moneda. Con <c>summarizeOnlyChecked</c>, solo las filas seleccionadas entran en la suma.",
      p2: "El valor consolidado de una columna también está disponible desde código, vía <c>getSummarizedValue(column)</c>."
    },
    layout: {
      title: "Diseño adaptable",
      p1: "En pantallas estrechas, elige el comportamiento con <c>responsiveMode</c>:",
      liOverflow: "<c>HORIZONTAL_OVERFLOW</c> — mantiene la estructura de tabla y habilita el desplazamiento horizontal.",
      liVertical: "<c>VERTICAL_RECORD</c> — cada fila se convierte en una tarjeta vertical, con la etiqueta de la columna junto a cada valor.",
      p2: "Para listas largas, <c>stickyHeaderEnabled: true</c> mantiene el encabezado visible durante el desplazamiento, y <c>height</c> + <c>overflowEnabled</c> crean un área desplazable:"
    },
    actions: {
      title: "Acciones y eventos",
      p1: "La columna de <c>actions</c> renderiza botones por fila — con visibilidad condicional vía <c>isVisible</c> — y los eventos <c>onClickRow</c>, <c>onDoubleClickRow</c>, <c>onClickCell</c>, <c>onDoubleClickCell</c> y <c>onContextMenu</c> cubren las interacciones de fila y celda. <c>rowFocusEnabled</c> y <c>cellFocusEnabled</c> proporcionan la retroalimentación visual de foco.",
      p2: "La petición inicial ocurre en el montaje (<c>sendRequestOnMounted: true</c>); desactívala cuando la tabla dependa de un filtro que el usuario aún debe elegir. Los fallos del <c>datasource</c> caen en <c>onRequestError</c>."
    },
    expandable: {
      title: "Filas expandibles",
      previewLabel: "componente real · renderer asíncrono (~700ms)",
      p1: "Con <c>expandableRowsEnabled: true</c>, cada fila recibe un botón de chevron en la primera columna (antes del checkbox, cuando lo hay). Al hacer clic se abre, justo debajo, un área de ancho completo con contenido totalmente tuyo, renderizado por <c>expandedRowRenderer(row, grid)</c> — varias filas pueden permanecer abiertas a la vez, y cambiar de página o de dataset lo colapsa todo.",
      p2: "El renderer puede ser <b>síncrono</b> — devuelve el contenido directamente, usando los datos de la propia fila — o <b>asíncrono</b> — devuelve una <c>Promise</c> (una llamada a la API, por ejemplo). En el caso asíncrono, el área muestra un estado de carga hasta que la Promise se resuelve; el valor por defecto integrado (spinner + \"Cargando detalles…\") puede reemplazarse con <c>expandedRowLoadingRenderer</c>. Reabrir una fila vuelve a ejecutar el renderer, garantizando datos frescos; si la Promise se rechaza, el área muestra un aviso discreto.",
      p3: "Con <c>expandRowOnClick: true</c>, hacer clic en cualquier parte de la fila también alterna la expansión — sin interferir con <c>onClickRow</c>, que sigue disparándose. Y el controller expone el control programático: <c>expandRow(uuid)</c>, <c>collapseRow(uuid)</c> y <c>getExpandedRows()</c>.",
      p4: "En la demo, el renderer asíncrono simula una API con un retardo de ~700ms — fíjate en el estado de carga antes de que aparezca el mini perfil:"
    },
    hooks: {
      title: "Hooks",
      p1: "Los hooks de renderizado transforman filas, celdas, encabezados y estilos justo antes del montaje: <c>onBeforeRowMounted</c> ajusta la fila completa, <c>onBeforeCellMounted</c> y <c>onBeforeHeaderCellMounted</c> reemplazan el contenido, y <c>onBeforeCellStyleMounted</c> devuelve estilos por celda.",
      p2: "En la demo, la columna \"Situación\" se deriva de <c>active</c> en <c>onBeforeRowMounted</c> y se colorea en <c>onBeforeCellStyleMounted</c>:"
    },
    properties: {
      title: "Propiedades",
      intro: "Todas las propiedades de uso más frecuente del objeto <c>config</c> — la definición TypeScript exportada por el paquete es la fuente de la verdad:",
      thProperty: "Propiedad",
      thType: "Tipo",
      thDefault: "Por defecto",
      thDescription: "Descripción",
      tip: "<b>Consejo:</b> declara solo lo que difiere de los valores por defecto — un <c>config</c> con <c>columns</c> y <c>datasource</c> ya es una tabla completa.",
      defaults: {
        inferred: "inferido",
        builtIn: "integrado"
      },
      descriptions: {
        mode: "Define dónde se ejecutan los filtros, la ordenación y la paginación.",
        theme: "Tema visual del grid y de los paneles portalados — un preset o el nombre de tu propio tema (clase arcana-theme-{name}); el valor global por defecto cambia con setDefaultArcanaTheme.",
        locale: "Locale de las cadenas internas del grid (8 packs incluidos); el valor global cambia con setDefaultArcanaLocale.",
        messages: "Reemplazos puntuales de las cadenas internas, aplicados sobre el pack del locale resuelto.",
        dataset: "Colección completa para operaciones locales; infiere el modo dataset.",
        columns: "Columnas visibles y sus renderizadores.",
        html: "Cuando es true, el contenido de texto de la columna (valor crudo o retorno de valueGetter/headerContentGetter) se interpreta como HTML; de lo contrario se renderiza como texto seguro y escapado. Para contenido enriquecido, devuelve un nodo nativo.",
        datasource: "Proveedor consultado en modo remote.",
        url: "Endpoint usado en modo remote sin datasource.",
        rowsPerPage: "Cantidad inicial por página.",
        searchEnabled: "Muestra los filtros por columna.",
        orderByEnabled: "Habilita la ordenación en los encabezados.",
        checkboxEnabled: "Habilita la selección múltiple.",
        radioButtonSelectionEnabled: "Habilita la selección única.",
        footerSummarizerEnabled: "Muestra los totales numéricos.",
        expandableRowsEnabled: "Añade la columna del chevron y habilita el área de detalles por fila.",
        expandedRowRenderer: "Contenido del área expandida; un retorno asíncrono muestra el estado de carga hasta que se resuelve.",
        expandedRowLoadingRenderer: "Reemplaza el estado de carga por defecto mostrado mientras el renderer asíncrono se resuelve.",
        expandRowOnClick: "Hacer clic en cualquier parte de la fila también alterna la expansión (onClickRow sigue disparándose).",
        onRowExpandedCollapsed: "Notifican la expansión y el colapso de cada fila.",
        responsiveMode: "Define la presentación en móviles.",
        stickyHeaderEnabled: "Mantiene el encabezado durante el desplazamiento.",
        columnResizeEnabled: "Habilita los tiradores de arrastre para redimensionar en los encabezados de columna.",
        resizable: "Permite redimensionar esta columna arrastrando el borde de su encabezado.",
        columnReorderEnabled: "Habilita reordenar arrastrando el cuerpo del encabezado (ignorado en VERTICAL_RECORD).",
        reorderable: "Permite arrastrar esta columna a una nueva posición; ponlo en false para dejarla fija.",
        pinned: "Congela esta columna en un borde (fija durante el desplazamiento horizontal); modificable desde el menú del encabezado.",
        sendRequestOnMounted: "Controla la primera consulta remota.",
        initialFilters: "Filtros iniciales remotos o locales.",
        onRequestError: "Notifica los fallos de carga."
      }
    },
    methods: {
      title: "Métodos del controller",
      p1: "El <b>controller</b> es la instancia que expone los métodos programáticos de la tabla. Obtenlo con una <c>ref</c> apuntada al componente — el patrón idiomático de cada framework — y llama a cualquier método desde tu UI.",
      p2: "Las firmas de abajo provienen de la interfaz <c>DataTableApi</c> exportada por el paquete. <c>Row</c> es el tipo genérico de la fila (<c>DataTableRow</c> por defecto) y <c>OrderBy</c> es <c>{ name: string; direction: 'asc' | 'desc' }</c>.",
      docs: {
        refresh: {
          description: "Vuelve a ejecutar la consulta actual, preservando filtros, ordenación y página (atajo para fetch())."
        },
        setRows: {
          description: "Reemplaza las filas mostradas en la página actual y actualiza el total; en modo dataset delega en setDataset. Devuelve las filas normalizadas.",
          params: { rows: "nuevas filas para la página actual." }
        },
        setDataset: {
          description: "Reemplaza la colección completa y vuelve a la página 1; disponible solo en modo dataset (lanza un error en modo remote). Devuelve el dataset normalizado.",
          params: { rows: "colección completa mantenida en memoria." }
        },
        getDataset: {
          description: "Devuelve una copia de la colección completa del modo dataset (array vacío en modo remote)."
        },
        addRow: {
          description: "Añade una fila al final de la colección (dataset) o de la página actual (remote), incrementando el total.",
          params: { row: "fila a insertar; recibe automáticamente un _uuid interno." }
        },
        updateRow: {
          description: "Aplica un patch parcial a la fila identificada, preservando el resto de campos.",
          params: {
            uuid: "el _uuid interno de la fila (generado durante la normalización).",
            row: "campos a sobrescribir en la fila."
          }
        },
        removeRow: {
          description: "Elimina la fila identificada y decrementa el total.",
          params: { uuid: "el _uuid interno de la fila." }
        },
        getRows: {
          description: "Devuelve las filas renderizadas actualmente (la página visible)."
        },
        getCheckedRows: {
          description: "Devuelve las filas con el checkbox marcado — en modo dataset, considera la colección completa, no solo la página."
        },
        clearCheckedRows: {
          description: "Desmarca el checkbox de todas las filas."
        },
        setFilter: {
          description: "Establece un filtro, vuelve a la página 1 y reconsulta (remote) o recalcula localmente (dataset).",
          params: {
            name: "nombre del filtro (el filterName ?? name de la columna).",
            value: "valor del filtro; null, '' o [] limpian el filtro."
          }
        },
        setFilters: {
          description: "Aplica varios filtros a la vez, con una única reconsulta al final.",
          params: { filters: "mapa nombre → valor; los valores vacíos limpian el filtro correspondiente." }
        },
        paginate: {
          description: "Navega a la página indicada y ajusta el tamaño de página (mínimo 1 en ambos).",
          params: {
            page: "página de destino (base 1).",
            rowsPerPage: "número de filas por página."
          }
        },
        applyOrderBy: {
          description: "Sustituye la ordenación completa y vuelve a la página 1: un OrderBy único mantiene el comportamiento clásico de una sola columna, un OrderBy[] aplica una ordenación multicolumna completa (el índice 0 ordena primero), y null limpia la ordenación.",
          params: { orderBy: "un objeto { name: string; direction: 'asc' | 'desc' }, un OrderBy[] para una ordenación multicolumna, o null para limpiar." }
        },
        toggleOrderBy: {
          description: "Alterna la ordenación de una columna exactamente como un clic en la cabecera y vuelve a la página 1; con additive: true reproduce el Mayús+clic, conservando las demás columnas ordenadas.",
          params: {
            name: "nombre de la columna cuya ordenación se alterna (asc → desc → eliminada).",
            options: "additive: true conserva las demás columnas ordenadas; sin él, la columna pasa a ser la única ordenación."
          }
        },
        setColumnOrder: {
          description: "Sustituye por completo el orden efectivo de las columnas; un array vacío vuelve al orden natural de la config.",
          params: { order: "lista de nombres de columna en el orden deseado; los nombres ausentes van al final." }
        },
        moveColumn: {
          description: "Mueve una columna junto a otra, quedando antes (por defecto) o después del objetivo; un objetivo null la envía al final.",
          params: {
            name: "nombre de la columna a mover.",
            targetName: "nombre de la columna de referencia, o null para enviar la columna al final.",
            position: "si la columna queda antes (por defecto) o después del objetivo."
          }
        },
        setColumnPinned: {
          description: "Fija la columna a un borde (o la libera con null), sobrescribiendo el pinned de la config de la columna.",
          params: {
            name: "nombre de la columna a fijar.",
            pinned: "'left', 'right' o null para liberar."
          }
        },
        getColumnPin: {
          description: "Devuelve la fijación actual de la columna ('left', 'right' o null): el override en runtime cuando existe; si no, el pinned de la config de la columna.",
          params: { name: "nombre de la columna a consultar." }
        },
        expandRow: {
          description: "Expande la fila identificada, renderizando el área de detalles justo debajo de ella (requiere expandableRowsEnabled). Se ignora cuando la fila ya está expandida o no está en la página actual.",
          params: { uuid: "el _uuid interno de la fila (generado durante la normalización)." }
        },
        collapseRow: {
          description: "Colapsa la fila identificada, eliminando el área de detalles; se ignora cuando la fila no está expandida.",
          params: { uuid: "el _uuid interno de la fila." }
        },
        getExpandedRows: {
          description: "Devuelve las filas actualmente expandidas en la página visible — cambiar de página o de dataset lo colapsa todo."
        },
        getSummarizedValue: {
          description: "Suma los valores de la columna en las filas actuales y devuelve { raw, formatted }; null cuando la columna no es sumable (sin type numérico ni summarizerValueGetter).",
          params: {
            column: "columna a totalizar.",
            onlyIsChecked: "combinado con summarizeOnlyChecked, restringe la suma a las filas marcadas."
          }
        }
      }
    }
  },

  playground: {
    panelAria: "Ajustes del playground",
    settings: "Ajustes",
    reset: "Restablecer",
    groupData: "Datos",
    groupFeatures: "Funcionalidades",
    groupExpandable: "Filas expandibles",
    groupLayout: "Diseño",
    groupTheme: "Tema",
    groupLocalization: "Localización",
    localeAuto: "sigue el idioma de la documentación",
    addOverride: "Añadir override…",
    removeOverride: "Quitar el override de {key}",
    emptyDataset: "Dataset vacío",
    emptyDatasetHint: "muestra el mensaje de vacío",
    checkboxHint: "excluye la selección única",
    radioHint: "excluye la selección múltiple",
    actionsHint: "botón “Abrir” por fila",
    renderer: "Renderer",
    rendererSync: "síncrono",
    rendererAsync: "asíncrono (700ms)",
    customLoading: "Carga personalizada",
    heightHint: "funciona junto con overflowEnabled",
    themePickerAria: "Elegir tema",
    stageCaption: "componente real · reacciona a cada ajuste",
    initialEvent: "Haz clic en una acción de la tabla",
    openAction: "Abrir",
    openEvent: "Abrir {name}",
    customLoadingText: "Preparando el perfil de {name}…",
    generatedCode: "Código generado",
    codeNote: "solo lo que difiere de los valores por defecto",
    tableAria: "Playground de Arcana DataTable",
    infoAria: "Acerca de {label}",
    hints: {
      rowsPerPage: "Filas mostradas por página.",
      messages: "Reemplaza textos individuales del pack de idioma; el placeholder muestra el valor actual del pack.",
      searchEnabled: "Campo de búsqueda sobre la tabla.",
      orderByEnabled: "Haz clic en un encabezado para ordenar por esa columna.",
      footerSummarizerEnabled: "Totales resumidos en el pie.",
      summarizeOnlyChecked: "Suma solo las filas marcadas.",
      rowFocusEnabled: "Resalta la fila bajo el cursor.",
      cellFocusEnabled: "Resalta la celda enfocada.",
      expandableRowsEnabled: "Las filas pueden expandirse para mostrar detalles.",
      expandRowOnClick: "Se expande al hacer clic en cualquier parte de la fila.",
      renderer: "Contenido inmediato o resuelto vía Promise.",
      customLoading: "Estado de carga personalizado en modo asíncrono.",
      stickyHeaderEnabled: "El encabezado permanece visible al hacer scroll.",
      columnResizeEnabled: "Arrastra los bordes del encabezado para redimensionar las columnas.",
      columnReorderEnabled: "Arrastra un encabezado para reordenar las columnas.",
      pinColumns: "Fija la primera columna a la izquierda y la última a la derecha.",
      overflowEnabled: "El cuerpo hace scroll en lugar de crecer.",
      responsiveMode: "Comportamiento en pantallas estrechas.",
      footerVisible: "Muestra el pie con la paginación.",
      isRowsPerPageVisible: "Selector de filas por página en el pie.",
      calculateCellWidth: "Ancho de columnas calculado según el contenido.",
      theme: "Paleta visual de la tabla.",
      locale: "Idioma de los textos internos de la tabla."
    }
  },

  demos: {
    departments: {
      engineering: "Ingeniería",
      research: "Investigación",
      product: "Producto",
      editorial: "Editorial",
      infrastructure: "Infraestructura"
    },
    statuses: {
      active: "Activo",
      inReview: "En revisión",
      inactive: "Inactivo"
    },
    available: "Disponible",
    unavailable: "No disponible",
    cols: {
      id: "ID",
      name: "Nombre",
      email: "Correo",
      area: "Área",
      status: "Estado",
      joinedAt: "Fecha de alta",
      amount: "Importe",
      score: "Puntuación",
      client: "Cliente",
      department: "Departamento",
      person: "Persona",
      situation: "Situación",
      date: "Fecha",
      month: "Mes",
      period: "Periodo",
      boolean: "Booleano",
      list: "Lista",
      remoteList: "Lista remota",
      custom: "Personalizado",
      code: "Código",
      totalSelected: "Total seleccionado",
      points: "Puntos"
    },
    requestsLabel: "{n} petición(es)",
    zeroRequests: "cero peticiones",
    emptyStateTest: "Probar el estado vacío",
    restoreDataset: "Restaurar dataset",
    paginationEmpty: "No hay empleados en este segmento.",
    customFilter: "Tu propio filtro",
    checkboxInitial: "Selecciona una fila",
    checkedEvent: "{name} seleccionado",
    uncheckedEvent: "{name} quitado",
    checkboxChanged: "Checkbox cambiado: {name}",
    radioInitial: "Ninguna fila elegida",
    radioChosen: "Elegido: {name}",
    radioRemoved: "Quitado: {name}",
    radioChanged: "Radio cambiado: {name}",
    actionsInitial: "Haz clic en una fila, celda o acción",
    open: "Abrir",
    openEvent: "Abrir {name}",
    rowClick: "Clic: {name}",
    rowDblClick: "Doble clic: {name}",
    cellClick: "Celda {column}: {name}",
    cellDblClick: "Doble clic en {column}: {name}",
    ctxCopy: "Copiar {column}",
    ctxCopied: "Copiado de {name}",
    card: {
      email: "Correo",
      area: "Área",
      score: "Puntuación",
      joined: "Fecha de alta",
      pts: "pts"
    },
    aria: {
      firstUse: "Primer uso de Arcana DataTable",
      themes: "Demostración de temas",
      themePicker: "Elegir tema",
      expandable: "Demostración de fila expandible",
      hooks: "Ejemplo de hooks de renderizado"
    }
  }
};
