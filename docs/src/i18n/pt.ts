import type { Messages } from "./types";

export const pt: Messages = {
  meta: { htmlLang: "pt-BR", locale: "pt-BR" },
  langName: "Português (Brasil)",

  shell: {
    kicker: "Documentação · v1.x",
    lead: "Uma datatable tipada para Vue 3, React, Angular e Svelte. A mesma configuração, o mesmo comportamento, o mesmo resultado — em qualquer um dos quatro frameworks.",
    navDocs: "Docs",
    navPlayground: "Playground",
    topNavAria: "Áreas do site",
    searchPlaceholder: "Buscar na documentação… (⌘K)",
    searchAria: "Buscar na documentação",
    chooseFramework: "Escolher framework",
    chooseLanguage: "Escolher idioma",
    openNav: "Abrir navegação",
    closeNav: "Fechar navegação",
    openSettings: "Abrir configurações",
    closeSettings: "Fechar configurações",
    sidebarAria: "Navegação da documentação",
    noSectionsFound: "Nenhuma seção encontrada.",
    previewTab: "Preview",
    codeTab: "Código",
    codeOnlyLabel: "Código",
    defaultPreviewCaption: "componente real · interaja",
    sectionExampleAria: "Exemplo de {title}",
    keyChipsAria: "Configurações abordadas"
  },

  codeBlock: {
    copy: "Copiar",
    copied: "Copiado!"
  },

  groups: {
    gettingStarted: "Começando",
    concepts: "Conceitos",
    features: "Recursos",
    reference: "Referência"
  },

  sections: {
    install: {
      title: "Instalação",
      p1: "A biblioteca é distribuída como um único pacote npm. Os adaptadores de React, Vue, Angular e Svelte são expostos em subcaminhos separados (<c>@arcanalabs/datatable/react</c>, <c>@arcanalabs/datatable/vue</c>, <c>@arcanalabs/datatable/angular</c> e <c>@arcanalabs/datatable/svelte</c>), então o bundle final só carrega o framework que você usa.",
      p2: "Instale com o gerenciador de pacotes da sua preferência e pronto — não há dependências transitivas de UI."
    },
    firstUse: {
      title: "Primeiro uso",
      previewLabel: "componente real · modo remote",
      p1: "Todo o comportamento da tabela vive em um único objeto <c>config</c>. Você declara as colunas, aponta a origem dos dados e renderiza o componente <c>ArcanaDataTable</c> — busca, ordenação e paginação já funcionam sem nenhuma linha extra.",
      p2: "O exemplo ao lado usa o modo <c>remote</c>: a cada interação do usuário, a tabela chama seu <c>datasource</c> com os parâmetros atuais. A demo abaixo faz exatamente isso, com um datasource local simulando a API — busque pelo nome ou ordene as colunas."
    },
    styles: {
      title: "Estilos",
      p1: "A folha de estilos é opt-in: importe <c>@arcanalabs/datatable/styles.css</c> uma única vez, na raiz da aplicação. Ela cobre a tabela, os filtros, a paginação e os estados de carregamento.",
      p2: "Se preferir um visual próprio, basta não importar o CSS — a marcação é semântica e estável, pensada para ser estilizada por fora."
    },
    modes: {
      title: "Modos remote/dataset",
      intro: "Existem duas formas de alimentar a tabela, e essa escolha define quem faz o trabalho de filtrar, ordenar e paginar:",
      liRemote: "<b>remote</b> — cada filtro, ordenação ou troca de página dispara uma chamada ao <c>datasource(params)</c> (ou à <c>url</c> configurada). A resposta esperada tem o formato <c>{ rows, total, page }</c>.",
      liDataset: "<b>dataset</b> — você entrega a coleção completa em memória e a tabela resolve tudo localmente, com zero requisições.",
      rowOrigin: "Origem",
      originDataset: "<c>dataset</c> em memória",
      rowFilterSort: "Filtro / ordenação",
      filterSortRemote: "no servidor",
      filterSortDataset: "na própria tabela",
      rowRequests: "Requisições",
      requestsRemote: "a cada interação",
      requestsDataset: "nenhuma",
      compare: "Compare os dois ao vivo — o contador mostra quantas requisições o modo <c>remote</c> já fez:"
    },
    themes: {
      title: "Temas",
      previewLabel: "componente real · troque o tema",
      p1: "Todo o visual do grid é construído sobre design tokens (variáveis CSS <c>--arcana-*</c>), e o pacote traz quatro temas prontos: <c>zinc</c> (o neutro claro padrão), <c>ocean</c> (azuis), <c>forest</c> (verdes) e <c>midnight</c> (escuro completo).",
      p2: "Escolha por tabela com <c>config.theme</c>, ou defina o padrão global com <c>setDefaultArcanaTheme(theme)</c> — usado por toda tabela sem <c>theme</c> próprio (<c>getDefaultArcanaTheme()</c> lê o valor atual). O tema é aplicado como a classe <c>arcana-theme-*</c> no elemento raiz e repetido nos painéis portalados para o <c><body></c> (select, calendário e menus de contexto/ordenação), que por serem teleportados não herdariam as variáveis do grid.",
      p3: "Na demo, abra o filtro de Área ou o calendário de Data com o tema <c>midnight</c> para ver os painéis escuros:",
      customHeading: "Criando o seu próprio tema",
      p4: "Um tema é apenas uma classe CSS <c>arcana-theme-{nome}</c> que sobrescreve os tokens <c>--arcana-*</c> — qualquer nome serve, não só os presets. Declare a classe no CSS da sua aplicação e passe o nome em <c>config.theme</c> (ou em <c>setDefaultArcanaTheme</c>): a mesma classe é aplicada automaticamente no grid e nos painéis portalados, então um único seletor cobre tudo.",
      p5: "Você não precisa redefinir todos os tokens — comece pelos principais e sobrescreva o resto conforme necessário; a lista completa está no topo do <c>styles.css</c> do pacote. O tema <c>candy</c> da demo acima é exatamente este exemplo, definido no CSS desta documentação, fora do pacote:"
    },
    localization: {
      title: "Localização (i18n)",
      previewLabel: "componente real · troque o locale do grid",
      p1: "Todas as strings internas do grid — o rodapé de paginação, os controles de filtro, o menu de ordenação, os rótulos de seleção, os estados vazio/carregando e o calendário — são localizadas. O pacote traz <b>8 locales</b>: <c>pt-BR</c> (o padrão, igual ao comportamento histórico), <c>en</c>, <c>es</c>, <c>it</c>, <c>zh</c>, <c>ja</c>, <c>de</c> e <c>ru</c>.",
      p2: "Escolha por tabela com <c>config.locale</c> ou defina o padrão global com <c>setDefaultArcanaLocale(locale)</c> — usado por toda tabela sem <c>locale</c> próprio (<c>getDefaultArcanaLocale()</c> lê o valor atual). É exatamente o mesmo padrão dos temas.",
      p3: "Qualquer string individual pode ser substituída via <c>config.messages</c>, um mapa parcial aplicado por cima do pack resolvido — com ou sem <c>locale</c>. A precedência é <c>messages</c> → <c>locale</c> → padrão global.",
      p4: "Os nomes de meses e dias da semana do calendário vêm do <c>Intl.DateTimeFormat</c> e acompanham o locale do grid automaticamente. Troque o locale abaixo e abra o filtro de Data para ver:",
      pickerAria: "Escolher locale do grid",
      customLabel: "Mensagens customizadas (substitui o “Exibindo…”)",
      customShowing: "✦ {from}–{to} de {total} registros",
      keysTitle: "Todas as chaves customizáveis",
      keysIntro: "Cada chave abaixo pode ser sobrescrita individualmente via <c>messages</c> — a tabela mostra as strings exatas do pack <c>en</c> e do pack ativo. Os templates mantêm seus placeholders (<c>{from}</c>, <c>{to}</c>, <c>{total}</c>, <c>{count}</c>, <c>{label}</c>) quando você os substitui.",
      keysKeyCol: "Chave"
    },
    columns: {
      title: "Colunas",
      p1: "Cada coluna é um objeto <c>DataTableColumn</c> com um <c>name</c> (a chave na linha) e um <c>label</c> (o texto do cabeçalho). Campos como <c>type</c> controlam a formatação — por exemplo, <c>CURRENCY</c> renderiza valores monetários — e <c>valueGetter</c> transforma o conteúdo da célula antes de renderizar. O conteúdo string é renderizado como texto seguro e escapado por padrão; defina <c>html: true</c> na coluna para interpretá-lo como HTML, ou retorne um nó nativo para conteúdo rico.",
      p2: "A propriedade <c>columns</c> também aceita uma função <c>() => DataTableColumn[]</c>, útil quando as colunas dependem de permissões ou de estado da aplicação. As colunas podem ser redimensionadas arrastando a borda direita do cabeçalho — ativo por padrão (<c>columnResizeEnabled</c>); desative em uma coluna específica com <c>resizable: false</c>."
    },
    columnManagement: {
      title: "Reordenar e fixar colunas",
      p1: "Arraste o corpo de um cabeçalho para o lado para reordenar as colunas — uma linha indicadora mostra exatamente onde a coluna vai parar. Um clique curto continua abrindo o menu de ordenação e a alça de redimensionar da borda direita mantém a prioridade, então arrastar nunca atrapalha. Ativo por padrão (<c>columnReorderEnabled</c>); mantenha uma coluna fixa no lugar com <c>reorderable: false</c>.",
      p2: "O menu do cabeçalho (o mesmo que traz as opções de ordenação) ganha <i>Fixar à esquerda</i>, <i>Fixar à direita</i> e <i>Desafixar</i>. Uma coluna fixada congela na sua borda e permanece visível durante a rolagem horizontal — colunas fixadas à esquerda grudam no início, à direita no fim, com um divisor/sombra sutil. Defina de antemão com <c>pinned: 'left'</c> ou <c>pinned: 'right'</c> na coluna, ou altere em tempo de execução pelo menu; as colunas de sistema (checkbox/expansor) congelam à esquerda e a coluna de ações à direita. Reordenar e fixar são desativados por <c>columnPinEnabled</c> e ignorados no modo responsivo <c>VERTICAL_RECORD</c>."
    },
    pagination: {
      title: "Paginação",
      p1: "A paginação vem habilitada por padrão com <c>rowsPerPage: 10</c>. No modo <c>remote</c>, a página atual e o tamanho da página viajam nos <c>params</c> enviados ao <c>datasource</c>; o <c>total</c> retornado pela resposta alimenta o contador do rodapé.",
      p2: "Para navegar programaticamente, use <c>controller.paginate(page, size)</c>. Quando a coleção fica vazia, a tabela exibe a mensagem <c>empty</c> do pack de idioma — personalizável via <c>messages</c>:"
    },
    filters: {
      title: "Filtros",
      p1: "A busca por coluna vem ativa por padrão (<c>searchEnabled: true</c>). Cada coluna com um <c>searchType</c> ganha o controle adequado no cabeçalho; no modo <c>remote</c>, os valores preenchidos são enviados dentro dos <c>params</c>.",
      p2: "Use <c>initialFilters</c> para aplicar filtros já na primeira consulta — com <c>disableFilterWhenPresentOnInitialFilters</c>, o controle correspondente fica bloqueado — e <c>setFilter</c> / <c>setFilters</c> no controller para alterá-los em resposta a ações da sua aplicação."
    },
    searchTypes: {
      title: "Tipos de busca",
      p1: "O <c>searchType</c> de cada coluna define o controle exibido para o usuário. São sete tipos:",
      thControl: "Controle",
      rows: {
        DATE: "Seletor de data única",
        DATE_MONTH: "Seletor de mês/ano (competência)",
        DATE_RANGE: "Intervalo entre duas datas",
        BOOLEAN: "Alternador sim/não",
        LIST: "Lista fixa de opções",
        REMOTE: "Opções carregadas de um endpoint",
        COMPONENT: "Componente customizado seu"
      },
      p2: "Todos os sete, lado a lado (role horizontalmente):"
    },
    sorting: {
      title: "Ordenação",
      p1: "A ordenação por coluna vem habilitada por padrão (<c>orderByEnabled: true</c>): clicar no cabeçalho abre um menu com <i>Crescente</i>, <i>Decrescente</i> e — quando a coluna já está ordenada — <i>Remover ordem</i>, que devolve o grid ao estado neutro. <b>Shift+clique</b> em um cabeçalho para adicionar essa coluna a uma ordenação de <i>múltiplas colunas</i>, alternando-a entre <i>crescente → decrescente → removida</i> enquanto mantém as demais colunas ordenadas; um pequeno número de prioridade (<c>1</c>, <c>2</c>, <c>3</c>…) indica a ordem, e os cabeçalhos expõem <c>aria-sort</c>. No modo <c>remote</c>, a ordenação atual segue junto nos <c>params</c>; no modo <c>dataset</c>, é resolvida em memória.",
      p2: "Desative-a por coluna com <c>orderByEnabled: false</c> na definição da coluna, e use <c>filterName</c> como alias do campo enviado ao servidor. Para aplicar uma ordenação por código, use <c>controller.applyOrderBy(orderBy)</c> — que agora também aceita um <c>OrderBy[]</c> para uma ordenação completa de múltiplas colunas (o índice 0 ordena primeiro) — ou <c>controller.toggleOrderBy(name, { additive })</c> para alternar uma única coluna."
    },
    checkbox: {
      title: "Seleção múltipla",
      p1: "Com <c>checkboxEnabled: true</c>, cada linha ganha um checkbox e o cabeçalho permite selecionar a página inteira. A seleção sobrevive à troca de página.",
      p2: "Controle o estado inicial com <c>isRowChecked</c>, bloqueie linhas com <c>isCheckboxRowDisabled</c> e reaja aos eventos <c>onRowChecked</c> / <c>onRowUnchecked</c>. Leia as linhas marcadas com <c>getCheckedRows()</c> e limpe tudo com <c>clearCheckedRows()</c> — típico em ações em lote como \"exportar selecionados\"."
    },
    radio: {
      title: "Seleção única",
      p1: "Quando o fluxo pede exatamente um registro — escolher um cliente em um diálogo, por exemplo — habilite <c>radioButtonSelectionEnabled: true</c>. Cada linha exibe um radio button e marcar uma linha desmarca a anterior; <c>uniqueKeyIdentifier</c> define a chave de identidade.",
      p2: "A linha escolhida também é lida via <c>getCheckedRows()</c>, que nesse modo retorna no máximo um item."
    },
    summary: {
      title: "Totais",
      p1: "Com <c>footerSummarizerEnabled: true</c>, a tabela adiciona uma linha de rodapé com o total das colunas numéricas — colunas <c>CURRENCY</c> são somadas e formatadas como moeda. Com <c>summarizeOnlyChecked</c>, apenas as linhas selecionadas entram na soma.",
      p2: "O valor consolidado de uma coluna também fica disponível por código, via <c>getSummarizedValue(column)</c>."
    },
    layout: {
      title: "Responsividade",
      p1: "Em telas estreitas, escolha o comportamento com <c>responsiveMode</c>:",
      liOverflow: "<c>HORIZONTAL_OVERFLOW</c> — mantém a estrutura de tabela e habilita rolagem horizontal.",
      liVertical: "<c>VERTICAL_RECORD</c> — cada linha vira um cartão vertical, com o rótulo da coluna ao lado de cada valor.",
      p2: "Em listas longas, <c>stickyHeaderEnabled: true</c> mantém o cabeçalho visível durante a rolagem e <c>height</c> + <c>overflowEnabled</c> criam uma área rolável:"
    },
    actions: {
      title: "Ações e eventos",
      p1: "A coluna de <c>actions</c> renderiza botões por linha — com visibilidade condicional via <c>isVisible</c> — e os eventos <c>onClickRow</c>, <c>onDoubleClickRow</c>, <c>onClickCell</c>, <c>onDoubleClickCell</c> e <c>onContextMenu</c> cobrem as interações de linha e célula. <c>rowFocusEnabled</c> e <c>cellFocusEnabled</c> dão o feedback visual de foco.",
      p2: "A requisição inicial acontece na montagem (<c>sendRequestOnMounted: true</c>); desative-a quando a tabela depender de um filtro que o usuário ainda vai escolher. Falhas do <c>datasource</c> caem em <c>onRequestError</c>."
    },
    expandable: {
      title: "Linha expansível",
      previewLabel: "componente real · renderer assíncrono (~700ms)",
      p1: "Com <c>expandableRowsEnabled: true</c>, cada linha ganha um botão de chevron na primeira coluna (antes do checkbox, quando houver). Clicar nele abre logo abaixo uma área de largura total com conteúdo totalmente seu, renderizado por <c>expandedRowRenderer(row, grid)</c> — várias linhas podem ficar abertas ao mesmo tempo, e a troca de página ou de dataset recolhe tudo.",
      p2: "O renderer pode ser <b>síncrono</b> — retorna o conteúdo direto, usando os dados da própria linha — ou <b>assíncrono</b> — retorna uma <c>Promise</c> (uma chamada de API, por exemplo). No caso assíncrono, a área exibe um estado de carregamento até a Promise resolver; o padrão embutido (spinner + \"Carregando detalhes…\") pode ser substituído por <c>expandedRowLoadingRenderer</c>. Reabrir uma linha reexecuta o renderer, garantindo dados frescos; se a Promise rejeitar, a área mostra um aviso discreto.",
      p3: "Com <c>expandRowOnClick: true</c>, clicar em qualquer lugar da linha também alterna a expansão — sem interferir no <c>onClickRow</c>, que continua disparando. E o controller expõe o controle programático: <c>expandRow(uuid)</c>, <c>collapseRow(uuid)</c> e <c>getExpandedRows()</c>.",
      p4: "Na demo, o renderer assíncrono simula uma API com ~700ms de atraso — repare no loading antes da mini-ficha aparecer:"
    },
    hooks: {
      title: "Hooks",
      p1: "Os hooks de renderização transformam linhas, células, cabeçalhos e estilos imediatamente antes da montagem: <c>onBeforeRowMounted</c> ajusta a linha inteira, <c>onBeforeCellMounted</c> e <c>onBeforeHeaderCellMounted</c> trocam o conteúdo, e <c>onBeforeCellStyleMounted</c> devolve estilos por célula.",
      p2: "Na demo, a coluna \"Situação\" é derivada de <c>active</c> em <c>onBeforeRowMounted</c> e colorida em <c>onBeforeCellStyleMounted</c>:"
    },
    properties: {
      title: "Propriedades",
      intro: "Todas as propriedades de uso mais frequente do objeto <c>config</c> — a definição TypeScript exportada pelo pacote é a fonte de verdade:",
      thProperty: "Propriedade",
      thType: "Tipo",
      thDefault: "Padrão",
      thDescription: "Descrição",
      tip: "<b>Dica:</b> declare apenas o que difere do padrão — um <c>config</c> com <c>columns</c> e <c>datasource</c> já é uma tabela completa.",
      defaults: {
        inferred: "inferido",
        builtIn: "embutido"
      },
      descriptions: {
        mode: "Define onde filtros, sort e paginação são executados.",
        theme: "Tema visual do grid e dos painéis portalados — preset ou o nome de um tema próprio (classe arcana-theme-{nome}); o padrão global muda com setDefaultArcanaTheme.",
        locale: "Locale das strings internas do grid (8 packs embutidos); o padrão global muda com setDefaultArcanaLocale.",
        messages: "Substituições pontuais das strings internas, aplicadas por cima do pack do locale resolvido.",
        dataset: "Coleção completa para operações locais; infere mode dataset.",
        columns: "Colunas visíveis e seus renderizadores.",
        html: "Quando true, o conteúdo string da coluna (valor cru ou retorno de valueGetter/headerContentGetter) é interpretado como HTML; caso contrário é renderizado como texto seguro e escapado. Para conteúdo rico, retorne um nó nativo.",
        datasource: "Provider consultado no modo remote.",
        url: "Endpoint usado no modo remote sem datasource.",
        rowsPerPage: "Quantidade inicial por página.",
        searchEnabled: "Exibe os filtros por coluna.",
        orderByEnabled: "Habilita ordenação nos cabeçalhos.",
        checkboxEnabled: "Ativa seleção múltipla.",
        radioButtonSelectionEnabled: "Ativa seleção única.",
        footerSummarizerEnabled: "Exibe totais numéricos.",
        expandableRowsEnabled: "Adiciona a coluna do chevron e habilita a área de detalhes por linha.",
        expandedRowRenderer: "Conteúdo da área expandida; retorno assíncrono exibe o loading até resolver.",
        expandedRowLoadingRenderer: "Substitui o loading padrão exibido enquanto o renderer assíncrono resolve.",
        expandRowOnClick: "Clicar em qualquer lugar da linha também alterna a expansão (onClickRow continua disparando).",
        onRowExpandedCollapsed: "Notificam a expansão e o recolhimento de cada linha.",
        responsiveMode: "Define a apresentação mobile.",
        stickyHeaderEnabled: "Mantém o cabeçalho durante a rolagem.",
        columnResizeEnabled: "Habilita as alças de arrastar para redimensionar nos cabeçalhos das colunas.",
        resizable: "Permite que esta coluna seja redimensionada arrastando a borda do cabeçalho.",
        columnReorderEnabled: "Habilita reordenar arrastando o corpo do cabeçalho (ignorado em VERTICAL_RECORD).",
        reorderable: "Permite arrastar esta coluna para uma nova posição; use false para mantê-la fixa.",
        pinned: "Congela esta coluna em uma borda (fixa durante a rolagem horizontal); alterável pelo menu do cabeçalho.",
        sendRequestOnMounted: "Controla a primeira consulta remota.",
        initialFilters: "Filtros iniciais remotos ou locais.",
        onRequestError: "Notifica falhas de carregamento."
      }
    },
    methods: {
      title: "Métodos do controller",
      p1: "O <b>controller</b> é a instância que expõe os métodos programáticos da tabela. Obtenha-o com uma <c>ref</c> apontada para o componente — o padrão idiomático de cada framework — e chame qualquer método a partir da sua UI.",
      p2: "As assinaturas abaixo vêm da interface <c>DataTableApi</c> exportada pelo pacote. <c>Row</c> é o tipo genérico da linha (<c>DataTableRow</c> por padrão) e <c>OrderBy</c> é <c>{ name: string; direction: 'asc' | 'desc' }</c>.",
      docs: {
        refresh: {
          description: "Reexecuta a consulta atual, preservando filtros, ordenação e página (atalho para fetch())."
        },
        setRows: {
          description: "Substitui as linhas exibidas na página atual e atualiza o total; no modo dataset delega para setDataset. Retorna as linhas normalizadas.",
          params: { rows: "novas linhas da página atual." }
        },
        setDataset: {
          description: "Substitui a coleção completa e volta para a página 1; disponível apenas no modo dataset (lança erro no modo remote). Retorna o dataset normalizado.",
          params: { rows: "coleção completa mantida em memória." }
        },
        getDataset: {
          description: "Retorna uma cópia da coleção completa do modo dataset (array vazio no modo remote)."
        },
        addRow: {
          description: "Acrescenta uma linha ao fim da coleção (dataset) ou da página atual (remote), incrementando o total.",
          params: { row: "linha a inserir; recebe um _uuid interno automaticamente." }
        },
        updateRow: {
          description: "Aplica um patch parcial sobre a linha identificada, preservando os demais campos.",
          params: {
            uuid: "o _uuid interno da linha (gerado na normalização).",
            row: "campos a sobrescrever na linha."
          }
        },
        removeRow: {
          description: "Remove a linha identificada e decrementa o total.",
          params: { uuid: "o _uuid interno da linha." }
        },
        getRows: {
          description: "Retorna as linhas atualmente renderizadas (a página visível)."
        },
        getCheckedRows: {
          description: "Retorna as linhas com checkbox marcado — no modo dataset, considera a coleção completa, não só a página."
        },
        clearCheckedRows: {
          description: "Desmarca o checkbox de todas as linhas."
        },
        setFilter: {
          description: "Define um filtro, volta para a página 1 e reconsulta (remote) ou recalcula localmente (dataset).",
          params: {
            name: "nome do filtro (o filterName ?? name da coluna).",
            value: "valor do filtro; null, '' ou [] limpam o filtro."
          }
        },
        setFilters: {
          description: "Aplica vários filtros de uma só vez, com uma única reconsulta ao final.",
          params: { filters: "mapa nome → valor; valores vazios limpam o filtro correspondente." }
        },
        paginate: {
          description: "Navega para a página informada e ajusta o tamanho da página (mínimo 1 em ambos).",
          params: {
            page: "página de destino (base 1).",
            rowsPerPage: "quantidade de linhas por página."
          }
        },
        applyOrderBy: {
          description: "Aplica a ordenação e volta para a página 1; passar null remove a ordenação e devolve o grid ao estado neutro.",
          params: { orderBy: "objeto { name: string; direction: 'asc' | 'desc' }, ou null para limpar." }
        },
        expandRow: {
          description: "Expande a linha identificada, renderizando a área de detalhes logo abaixo dela (requer expandableRowsEnabled). Ignorada quando a linha já está expandida ou não está na página atual.",
          params: { uuid: "o _uuid interno da linha (gerado na normalização)." }
        },
        collapseRow: {
          description: "Recolhe a linha identificada, removendo a área de detalhes; ignorada quando a linha não está expandida.",
          params: { uuid: "o _uuid interno da linha." }
        },
        getExpandedRows: {
          description: "Retorna as linhas atualmente expandidas na página visível — a troca de página ou de dataset recolhe tudo."
        },
        getSummarizedValue: {
          description: "Soma os valores da coluna nas linhas atuais e retorna { raw, formatted }; null quando a coluna não é somável (sem type numérico nem summarizerValueGetter).",
          params: {
            column: "coluna a totalizar.",
            onlyIsChecked: "combinado com summarizeOnlyChecked, restringe a soma às linhas marcadas."
          }
        }
      }
    }
  },

  playground: {
    panelAria: "Configurações do playground",
    settings: "Configurações",
    reset: "Resetar",
    groupData: "Dados",
    groupFeatures: "Recursos",
    groupExpandable: "Linhas expansíveis",
    groupLayout: "Layout",
    groupTheme: "Tema",
    groupLocalization: "Localização",
    localeAuto: "acompanha o idioma da docs",
    addOverride: "Adicionar override…",
    removeOverride: "Remover override de {key}",
    emptyDataset: "Dataset vazio",
    emptyDatasetHint: "mostra a mensagem de vazio",
    checkboxHint: "exclui a seleção única",
    radioHint: "exclui a seleção múltipla",
    actionsHint: "botão “Abrir” por linha",
    renderer: "Renderer",
    rendererSync: "síncrono",
    rendererAsync: "assíncrono (700ms)",
    customLoading: "Loading custom",
    heightHint: "rola junto com overflowEnabled",
    themePickerAria: "Escolher tema",
    stageCaption: "componente real · reage a cada configuração",
    initialEvent: "Clique em uma ação da tabela",
    openAction: "Abrir",
    openEvent: "Abrir {name}",
    customLoadingText: "Preparando a ficha de {name}…",
    generatedCode: "Código gerado",
    codeNote: "só o que difere do padrão",
    tableAria: "Playground do Arcana DataTable",
    infoAria: "Sobre {label}",
    hints: {
      rowsPerPage: "Linhas exibidas por página.",
      messages: "Sobrescreve textos individuais do pack de idioma; o placeholder mostra o valor atual do pack.",
      searchEnabled: "Campo de busca acima da tabela.",
      orderByEnabled: "Clique no cabeçalho para ordenar pela coluna.",
      footerSummarizerEnabled: "Totais somados no rodapé.",
      summarizeOnlyChecked: "Soma apenas as linhas marcadas.",
      rowFocusEnabled: "Realça a linha sob o cursor.",
      cellFocusEnabled: "Realça a célula em foco.",
      expandableRowsEnabled: "Linhas podem expandir para mostrar detalhes.",
      expandRowOnClick: "Expande ao clicar em qualquer parte da linha.",
      renderer: "Conteúdo imediato ou resolvido via Promise.",
      customLoading: "Loading personalizado no modo assíncrono.",
      stickyHeaderEnabled: "Cabeçalho fixo durante o scroll.",
      columnResizeEnabled: "Arraste as bordas do cabeçalho para redimensionar as colunas.",
      columnReorderEnabled: "Arraste um cabeçalho para reordenar as colunas.",
      pinColumns: "Fixa a primeira coluna à esquerda e a última à direita.",
      overflowEnabled: "O corpo rola em vez de crescer.",
      responsiveMode: "Comportamento em telas estreitas.",
      footerVisible: "Exibe o rodapé com a paginação.",
      isRowsPerPageVisible: "Seletor de linhas por página no rodapé.",
      calculateCellWidth: "Largura das colunas calculada pelo conteúdo.",
      theme: "Paleta visual da tabela.",
      locale: "Idioma dos textos internos da tabela."
    }
  },

  demos: {
    departments: {
      engineering: "Engenharia",
      research: "Pesquisa",
      product: "Produto",
      editorial: "Editorial",
      infrastructure: "Infraestrutura"
    },
    statuses: {
      active: "Ativo",
      inReview: "Em análise",
      inactive: "Inativo"
    },
    available: "Disponível",
    unavailable: "Indisponível",
    cols: {
      id: "ID",
      name: "Nome",
      email: "E-mail",
      area: "Área",
      status: "Status",
      joinedAt: "Admissão",
      amount: "Valor",
      score: "Score",
      client: "Cliente",
      department: "Departamento",
      person: "Pessoa",
      situation: "Situação",
      date: "Data",
      month: "Mês",
      period: "Período",
      boolean: "Booleano",
      list: "Lista",
      remoteList: "Lista remota",
      custom: "Custom",
      code: "Código",
      totalSelected: "Total selecionado",
      points: "Pontos"
    },
    requestsLabel: "{n} request(s)",
    zeroRequests: "zero requests",
    emptyStateTest: "Testar estado vazio",
    restoreDataset: "Restaurar dataset",
    paginationEmpty: "Nenhum colaborador neste recorte.",
    customFilter: "Filtro próprio",
    checkboxInitial: "Selecione uma linha",
    checkedEvent: "{name} selecionado",
    uncheckedEvent: "{name} removido",
    checkboxChanged: "Checkbox alterado: {name}",
    radioInitial: "Nenhuma linha escolhida",
    radioChosen: "Escolhido: {name}",
    radioRemoved: "Removido: {name}",
    radioChanged: "Radio alterado: {name}",
    actionsInitial: "Clique em uma linha, célula ou ação",
    open: "Abrir",
    openEvent: "Abrir {name}",
    rowClick: "Clique: {name}",
    rowDblClick: "Duplo clique: {name}",
    cellClick: "Célula {column}: {name}",
    cellDblClick: "Duplo clique em {column}: {name}",
    ctxCopy: "Copiar {column}",
    ctxCopied: "Copiado de {name}",
    card: {
      email: "E-mail",
      area: "Área",
      score: "Score",
      joined: "Admissão",
      pts: "pts"
    },
    aria: {
      firstUse: "Primeiro uso do Arcana DataTable",
      themes: "Demonstração de temas",
      themePicker: "Escolher tema",
      expandable: "Demonstração de linha expansível",
      hooks: "Exemplo de hooks de renderização"
    }
  }
};
