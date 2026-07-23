import type { Messages } from "./types";

export const zh: Messages = {
  meta: { htmlLang: "zh-CN", locale: "zh-CN" },
  langName: "中文",

  shell: {
    kicker: "文档 · v1.x",
    lead: "一个类型化的数据表格组件，支持 Vue 3、React、Angular 和 Svelte。同样的配置、同样的行为、同样的结果——在四个框架中的任意一个都是如此。",
    navDocs: "文档",
    navPlayground: "演练场",
    topNavAria: "站点区域",
    searchPlaceholder: "搜索文档…（⌘K）",
    searchAria: "搜索文档",
    chooseFramework: "选择框架",
    chooseLanguage: "选择语言",
    openNav: "打开导航",
    closeNav: "关闭导航",
    openSettings: "打开设置",
    closeSettings: "关闭设置",
    sidebarAria: "文档导航",
    noSectionsFound: "未找到任何章节。",
    previewTab: "预览",
    codeTab: "代码",
    codeOnlyLabel: "代码",
    defaultPreviewCaption: "真实组件 · 可直接交互",
    sectionExampleAria: "{title} 示例",
    keyChipsAria: "涉及的配置项"
  },

  codeBlock: {
    copy: "复制",
    copied: "已复制！"
  },

  groups: {
    gettingStarted: "快速上手",
    concepts: "核心概念",
    features: "功能特性",
    reference: "API 参考"
  },

  sections: {
    install: {
      title: "安装",
      p1: "本库以单个 npm 包的形式发布。React、Vue、Angular 和 Svelte 适配器通过独立的子路径暴露（<c>@arcanalabs/datatable/react</c>、<c>@arcanalabs/datatable/vue</c>、<c>@arcanalabs/datatable/angular</c> 和 <c>@arcanalabs/datatable/svelte</c>），因此最终打包产物只会包含你实际使用的框架。",
      p2: "使用你喜欢的包管理器安装即可——没有任何传递性的 UI 依赖。"
    },
    firstUse: {
      title: "初次使用",
      previewLabel: "真实组件 · remote 模式",
      p1: "表格的全部行为都集中在一个 <c>config</c> 对象里。你只需声明列、指定数据来源并渲染 <c>ArcanaDataTable</c> 组件——搜索、排序和分页无需额外一行代码即可正常工作。",
      p2: "旁边的示例使用 <c>remote</c> 模式：每次用户交互时，表格都会携带当前参数调用你的 <c>datasource</c>。下方的演示正是如此，用一个本地 datasource 模拟 API——试试按姓名搜索或对列进行排序。"
    },
    styles: {
      title: "样式",
      p1: "样式表是可选引入的：在应用的根部导入一次 <c>@arcanalabs/datatable/styles.css</c> 即可。它覆盖了表格、筛选器、分页和加载状态。",
      p2: "如果你偏好自己的外观，直接跳过 CSS 导入即可——组件的标记结构语义化且稳定，天生适合从外部进行样式定制。"
    },
    modes: {
      title: "remote/dataset 模式",
      intro: "为表格提供数据有两种方式，这一选择决定了由谁来完成筛选、排序和分页的工作：",
      liRemote: "<b>remote</b> —— 每次筛选、排序或翻页都会触发一次对 <c>datasource(params)</c> 的调用（或对配置的 <c>url</c> 发起请求）。期望的响应格式为 <c>{ rows, total, page }</c>。",
      liDataset: "<b>dataset</b> —— 你把完整集合交给内存，表格在本地完成所有处理，零请求。",
      rowOrigin: "数据来源",
      originDataset: "内存中的 <c>dataset</c>",
      rowFilterSort: "筛选 / 排序",
      filterSortRemote: "在服务端",
      filterSortDataset: "在表格内部",
      rowRequests: "请求",
      requestsRemote: "每次交互都会发起",
      requestsDataset: "无",
      compare: "在线对比两种模式——计数器展示 <c>remote</c> 模式到目前为止发起了多少次请求："
    },
    themes: {
      title: "主题",
      previewLabel: "真实组件 · 切换主题",
      p1: "表格的整体外观基于设计令牌（<c>--arcana-*</c> CSS 变量）构建，包内附带四套现成主题：<c>zinc</c>（默认的浅色中性主题）、<c>ocean</c>（蓝色系）、<c>forest</c>（绿色系）和 <c>midnight</c>（全暗色）。",
      p2: "通过 <c>config.theme</c> 为单个表格指定主题，或用 <c>setDefaultArcanaTheme(theme)</c> 设置全局默认值——所有未设置自身 <c>theme</c> 的表格都会使用它（<c>getDefaultArcanaTheme()</c> 读取当前值）。主题以 <c>arcana-theme-*</c> class 的形式应用在根元素上，并同步应用到传送（portal）至 <c><body></c> 的面板上（下拉选择、日历以及上下文/排序菜单）——这些面板因为被传送出去，本不会继承表格的变量。",
      p3: "在演示中，切换到 <c>midnight</c> 主题后打开“部门”筛选器或“日期”日历，即可看到暗色面板：",
      customHeading: "创建你自己的主题",
      p4: "主题不过是一个覆盖 <c>--arcana-*</c> 令牌的 <c>arcana-theme-{name}</c> CSS class——任何名字都可以，不限于预设。在你应用的 CSS 中声明这个 class，并把名字传给 <c>config.theme</c>（或 <c>setDefaultArcanaTheme</c>）：同一个 class 会自动应用到表格和被传送的面板上，因此一个选择器就能覆盖全部。",
      p5: "你不必重新定义所有令牌——先从主要的入手，其余按需覆盖；完整列表位于包内 <c>styles.css</c> 的顶部。上面演示中的 <c>candy</c> 主题正是这样一个例子，它定义在本文档的 CSS 中，位于包外："
    },
    localization: {
      title: "本地化 (i18n)",
      previewLabel: "真实组件 · 切换表格语言",
      p1: "表格的所有内置文案——分页页脚、筛选控件、排序菜单、选择标签、空/加载状态以及日历——均已本地化。包内置 <b>8 种语言</b>：<c>pt-BR</c>（默认值，与历史行为一致）、<c>en</c>、<c>es</c>、<c>it</c>、<c>zh</c>、<c>ja</c>、<c>de</c> 和 <c>ru</c>。",
      p2: "通过 <c>config.locale</c> 为单个表格选择语言，或用 <c>setDefaultArcanaLocale(locale)</c> 设置全局默认——所有未设置自身 <c>locale</c> 的表格都会使用它（<c>getDefaultArcanaLocale()</c> 读取当前值）。与主题的用法完全一致。",
      p3: "任何一条文案都可以通过 <c>config.messages</c> 替换，它是一个部分映射，叠加在解析出的语言包之上——可与 <c>locale</c> 搭配，也可单独使用。优先级为 <c>messages</c> → <c>locale</c> → 全局默认。",
      p4: "日历中的月份和星期名称来自 <c>Intl.DateTimeFormat</c>，会自动跟随表格的 locale。在下方切换 locale 并打开日期筛选器试试：",
      pickerAria: "选择表格语言",
      customLabel: "自定义文案（替换“显示…”文本）",
      customShowing: "✦ 共 {total} 条，当前 {from}–{to}",
      keysTitle: "所有可自定义的键",
      keysIntro: "下表中的每个键都可以通过 <c>messages</c> 单独覆盖——表格展示了 <c>en</c> 语言包与当前语言包的确切文案。替换模板时请保留占位符（<c>{from}</c>、<c>{to}</c>、<c>{total}</c>、<c>{count}</c>、<c>{label}</c>）。",
      keysKeyCol: "键"
    },
    columns: {
      title: "列",
      p1: "每一列都是一个 <c>DataTableColumn</c> 对象，包含 <c>name</c>（行数据上的键）和 <c>label</c>（表头文本）。像 <c>type</c> 这样的字段控制格式化——例如 <c>CURRENCY</c> 会渲染货币值——而 <c>valueGetter</c> 在渲染前转换单元格内容。字符串内容默认作为安全的转义文本渲染；在列上设置 <c>html: true</c> 可将其解析为 HTML，或返回原生节点以呈现富内容。",
      p2: "<c>columns</c> 属性也接受一个 <c>() => DataTableColumn[]</c> 函数，当列依赖于权限或应用状态时非常方便。"
    },
    columnManagement: {
      title: "重新排序和固定列",
      previewLabel: "真实组件 · 拖动表头并横向滚动",
      p1: "横向拖动表头主体即可重新排序列——其他列会实时让位、腾出它将落下的空隙，同时一个带列名的悬浮标签会跟随指针移动（按 Esc 可取消拖动）。短按仍会打开排序菜单，右边缘的调整宽度手柄依然优先，因此拖动绝不会碍事。默认启用（<c>columnReorderEnabled</c>）；用 <c>reorderable: false</c> 可让某一列固定不动。",
      p2: "表头菜单（与排序选项相同的那个菜单）新增了<i>固定到左侧</i>、<i>固定到右侧</i>和<i>取消固定</i>。被固定的列会冻结在其边缘，并在横向滚动时保持可见——固定到左侧的列贴在开头，固定到右侧的列贴在末尾，并带有淡淡的分隔线／阴影。可以在列上预先设置 <c>pinned: 'left'</c> 或 <c>pinned: 'right'</c>，也可以通过菜单在运行时更改；系统列（复选框／展开器）冻结在左侧，操作列冻结在右侧。重新排序和固定都由 <c>columnPinEnabled</c> 关闭，并在 <c>VERTICAL_RECORD</c> 响应式模式下被忽略。"
    },
    resize: {
      title: "调整列宽",
      previewLabel: "真实组件 · 拖动表头的右边缘",
      labelOn: "调整宽度 开",
      labelOff: "调整宽度 关",
      p1: "每个表头的右边缘都有一个不起眼的手柄——拖动它即可把列调整到你想要的宽度。列宽调整默认启用（<c>columnResizeEnabled: true</c>），并且手柄的优先级高于表头拖动，因此绝不会与重新排序发生冲突。",
      p2: "<c>cellMinWidth</c> 是宽度下限：任何列都无法被拖得比它更窄。用 <c>columnResizeEnabled: false</c> 可关闭整个表格的手柄，或在某列的定义中设置 <c>resizable: false</c> 让它保持固定宽度。对比下面两个表格——第一个的每个表头都有调整手柄，第二个则完全没有："
    },
    pagination: {
      title: "分页",
      p1: "分页默认启用，<c>rowsPerPage: 10</c>。在 <c>remote</c> 模式下，当前页码和每页条数会随 <c>params</c> 一起发送给 <c>datasource</c>；响应返回的 <c>total</c> 用于驱动底部的计数器。",
      p2: "如需以编程方式翻页，请使用 <c>controller.paginate(page, size)</c>。当集合为空时，表格会显示语言包中的 <c>empty</c> 文案——可通过 <c>messages</c> 自定义："
    },
    filters: {
      title: "筛选器",
      p1: "按列搜索默认开启（<c>searchEnabled: true</c>）。每个设置了 <c>searchType</c> 的列都会在表头获得相应的控件；在 <c>remote</c> 模式下，填入的值会包含在 <c>params</c> 中发送。",
      p2: "使用 <c>initialFilters</c> 在首次查询时就应用筛选——配合 <c>disableFilterWhenPresentOnInitialFilters</c>，对应的控件会被锁定——并通过 controller 上的 <c>setFilter</c> / <c>setFilters</c> 响应应用中的操作来修改筛选条件。"
    },
    searchTypes: {
      title: "搜索类型",
      p1: "每列的 <c>searchType</c> 决定展示给用户的控件。共有七种类型：",
      thControl: "控件",
      rows: {
        DATE: "单个日期选择器",
        DATE_MONTH: "月份/年份选择器（会计期间）",
        DATE_RANGE: "两个日期之间的区间",
        BOOLEAN: "是/否开关",
        LIST: "固定选项列表",
        REMOTE: "从接口加载的选项",
        COMPONENT: "你自己的自定义组件"
      },
      p2: "七种类型并排展示（可横向滚动）："
    },
    sorting: {
      title: "排序",
      p1: "按列排序默认启用（<c>orderByEnabled: true</c>）：点击表头会打开一个菜单，包含<i>升序</i>、<i>降序</i>，以及——当该列已排序时——<i>取消排序</i>，后者将表格恢复到中性状态；表头还会暴露 <c>aria-sort</c>。在 <c>remote</c> 模式下，当前排序会随 <c>params</c> 一起发送；在 <c>dataset</c> 模式下，则在内存中完成。",
      p2: "在列定义上用 <c>orderByEnabled: false</c> 可按列禁用排序，并可用 <c>filterName</c> 作为发送到服务端的字段别名。如需通过代码应用排序，使用 <c>controller.applyOrderBy({ name, direction })</c>——或传入 <c>null</c> 清除排序。要同时组合多个列，请看下面紧接着的<b>多列排序</b>。"
    },
    multiSort: {
      title: "多列排序",
      previewLabel: "真实组件 · Shift+点击表头以叠加另一层排序",
      p1: "<b>Shift+点击</b>表头会把该列加入当前排序而不是替换它——每一列都在<i>升序 → 降序 → 移除</i>之间循环，其余列保持不动。箭头旁边的小优先级徽标（<c>1</c>、<c>2</c>、<c>3</c>…）显示各列的生效顺序。下面的演示挂载时就已按「区域」（升序）再按「金额」（降序）排序——在每个区域内部，金额从高到低排列；Shift+点击第三个表头即可再叠加一层。",
      p2: "在代码中，<c>controller.applyOrderBy(orderBy)</c> 也接受 <c>OrderBy[]</c> 来表示完整的多列排序（索引 0 最先排序），而 <c>controller.toggleOrderBy(name, { additive: true })</c> 则为单个列重现 Shift+点击的循环。在 <c>remote</c> 模式下，单列排序保持经典的 <c>order_by[field]</c> / <c>order_by[direction]</c> 参数；从两列开始，参数改为带索引的形式——<c>order_by[0][field]</c>、<c>order_by[0][direction]</c>、<c>order_by[1][field]</c>……"
    },
    checkbox: {
      title: "多选",
      p1: "启用 <c>checkboxEnabled: true</c> 后，每行都会出现一个复选框，表头则支持全选当前页。选中状态在翻页后依然保留。",
      p2: "用 <c>isRowChecked</c> 控制初始状态，用 <c>isCheckboxRowDisabled</c> 锁定行，并响应 <c>onRowChecked</c> / <c>onRowUnchecked</c> 事件。通过 <c>getCheckedRows()</c> 读取已勾选的行，通过 <c>clearCheckedRows()</c> 清空全部——这是“导出所选”等批量操作的典型用法。"
    },
    radio: {
      title: "单选",
      p1: "当流程恰好需要一条记录时——例如在对话框中挑选一位客户——启用 <c>radioButtonSelectionEnabled: true</c>。每行会显示一个单选按钮，勾选一行会取消上一行的选中；<c>uniqueKeyIdentifier</c> 定义身份键。",
      p2: "被选中的行同样通过 <c>getCheckedRows()</c> 读取，在此模式下最多返回一项。"
    },
    summary: {
      title: "合计",
      p1: "启用 <c>footerSummarizerEnabled: true</c> 后，表格会添加一行底部合计，汇总数值列——<c>CURRENCY</c> 列会求和并按货币格式化。配合 <c>summarizeOnlyChecked</c>，只有选中的行才计入求和。",
      p2: "某一列的汇总值也可以通过代码获取，即 <c>getSummarizedValue(column)</c>。"
    },
    layout: {
      title: "响应式",
      p1: "在窄屏上，通过 <c>responsiveMode</c> 选择表现方式：",
      liOverflow: "<c>HORIZONTAL_OVERFLOW</c> —— 保持表格结构并启用横向滚动。",
      liVertical: "<c>VERTICAL_RECORD</c> —— 每行变为一张纵向卡片，列标签显示在每个值的旁边。",
      p2: "对于长列表，<c>stickyHeaderEnabled: true</c> 让表头在滚动时保持可见，而 <c>height</c> + <c>overflowEnabled</c> 则创建一个可滚动区域："
    },
    actions: {
      title: "操作与事件",
      p1: "<c>actions</c> 列为每行渲染操作按钮——可通过 <c>isVisible</c> 条件控制显隐——而 <c>onClickRow</c>、<c>onDoubleClickRow</c>、<c>onClickCell</c>、<c>onDoubleClickCell</c> 和 <c>onContextMenu</c> 事件覆盖行与单元格的交互。<c>rowFocusEnabled</c> 和 <c>cellFocusEnabled</c> 提供焦点的视觉反馈。",
      p2: "首次请求在挂载时发起（<c>sendRequestOnMounted: true</c>）；当表格依赖用户尚未选择的筛选条件时可将其禁用。<c>datasource</c> 的失败会落入 <c>onRequestError</c>。"
    },
    expandable: {
      title: "可展开行",
      previewLabel: "真实组件 · 异步渲染器（约 700ms）",
      p1: "启用 <c>expandableRowsEnabled: true</c> 后，每行在第一列会出现一个 chevron 按钮（如果有复选框，则位于其之前）。点击后会在正下方展开一块占满整行宽度的区域，内容完全由你掌控，由 <c>expandedRowRenderer(row, grid)</c> 渲染——多行可以同时保持展开，而切换页码或数据集会折叠全部。",
      p2: "渲染器可以是<b>同步的</b>——直接返回内容，使用行自身的数据——也可以是<b>异步的</b>——返回一个 <c>Promise</c>（例如一次 API 调用）。异步情况下，该区域会显示加载状态，直到 Promise 完成；内置默认样式（加载指示器 + “正在加载详情…”）可通过 <c>expandedRowLoadingRenderer</c> 替换。重新展开一行会重新执行渲染器，确保数据是最新的；如果 Promise 被拒绝，该区域会显示一个低调的警告。",
      p3: "启用 <c>expandRowOnClick: true</c> 后，点击行的任意位置也会切换展开状态——且不影响 <c>onClickRow</c>，它仍会照常触发。controller 还提供编程式控制：<c>expandRow(uuid)</c>、<c>collapseRow(uuid)</c> 和 <c>getExpandedRows()</c>。",
      p4: "在演示中，异步渲染器模拟了一个约 700ms 延迟的 API——注意迷你档案出现之前的加载状态："
    },
    hooks: {
      title: "钩子",
      p1: "渲染钩子在挂载前一刻转换行、单元格、表头和样式：<c>onBeforeRowMounted</c> 调整整行，<c>onBeforeCellMounted</c> 和 <c>onBeforeHeaderCellMounted</c> 替换内容，<c>onBeforeCellStyleMounted</c> 返回逐单元格的样式。",
      p2: "在演示中，“状态”列由 <c>onBeforeRowMounted</c> 中的 <c>active</c> 派生而来，并在 <c>onBeforeCellStyleMounted</c> 中着色："
    },
    properties: {
      title: "属性",
      intro: "<c>config</c> 对象中最常用的全部属性——包所导出的 TypeScript 定义才是唯一可信来源：",
      thProperty: "属性",
      thType: "类型",
      thDefault: "默认值",
      thDescription: "说明",
      tip: "<b>提示：</b>只声明与默认值不同的部分——一个只有 <c>columns</c> 和 <c>datasource</c> 的 <c>config</c> 就已经是一张完整的表格。",
      defaults: {
        inferred: "自动推断",
        builtIn: "内置"
      },
      descriptions: {
        mode: "定义筛选、排序和分页在何处执行。",
        theme: "表格及被传送面板的视觉主题——预设主题或你自定义主题的名字（arcana-theme-{name} class）；全局默认值通过 setDefaultArcanaTheme 修改。",
        locale: "表格内置文案的语言（内置 8 个语言包）；全局默认值通过 setDefaultArcanaLocale 修改。",
        messages: "对内置文案的逐条覆盖，叠加在解析出的语言包之上。",
        dataset: "供本地操作使用的完整集合；会自动推断为 dataset 模式。",
        columns: "可见的列及其渲染器。",
        html: "为 true 时，该列的字符串内容（原始值或 valueGetter/headerContentGetter 的返回值）会被解析为 HTML；否则会作为安全的转义文本渲染。若需富内容，请返回原生节点。",
        datasource: "remote 模式下查询的数据提供方。",
        url: "remote 模式下未提供 datasource 时使用的接口地址。",
        rowsPerPage: "每页的初始条数。",
        searchEnabled: "显示按列筛选器。",
        orderByEnabled: "在表头启用排序。",
        checkboxEnabled: "启用多选。",
        radioButtonSelectionEnabled: "启用单选。",
        footerSummarizerEnabled: "显示数值合计。",
        expandableRowsEnabled: "添加 chevron 列并启用按行的详情区域。",
        expandedRowRenderer: "展开区域的内容；返回异步结果时会显示加载状态直到完成。",
        expandedRowLoadingRenderer: "替换异步渲染器执行期间显示的默认加载状态。",
        expandRowOnClick: "点击行的任意位置也会切换展开状态（onClickRow 仍会触发）。",
        onRowExpandedCollapsed: "在每行展开和折叠时发出通知。",
        responsiveMode: "定义移动端的展示方式。",
        stickyHeaderEnabled: "滚动时保持表头可见。",
        columnResizeEnabled: "在列表头上启用拖动调整宽度的手柄。",
        resizable: "允许通过拖动表头边缘来调整该列的宽度。",
        columnReorderEnabled: "通过拖动表头主体启用重新排序（在 VERTICAL_RECORD 中忽略）。",
        reorderable: "允许将该列拖到新位置；设为 false 可保持其固定。",
        pinned: "将该列冻结到某个边缘（横向滚动时保持固定）；可通过表头菜单更改。",
        sendRequestOnMounted: "控制首次远程查询。",
        initialFilters: "初始的远程或本地筛选条件。",
        onRequestError: "通知加载失败。"
      }
    },
    methods: {
      title: "Controller 方法",
      p1: "<b>controller</b> 是暴露表格编程式方法的实例。通过指向组件的 <c>ref</c> 获取它——即各框架的惯用做法——然后就可以在你的 UI 中调用任意方法。",
      p2: "下方的签名来自包所导出的 <c>DataTableApi</c> 接口。<c>Row</c> 是泛型行类型（默认为 <c>DataTableRow</c>），<c>OrderBy</c> 则是 <c>{ name: string; direction: 'asc' | 'desc' }</c>。",
      docs: {
        refresh: {
          description: "重新执行当前查询，保留筛选、排序和页码（fetch() 的快捷方式）。"
        },
        setRows: {
          description: "替换当前页显示的行并更新总数；在 dataset 模式下委托给 setDataset。返回规范化后的行。",
          params: { rows: "当前页的新行。" }
        },
        setDataset: {
          description: "替换完整集合并回到第 1 页；仅在 dataset 模式下可用（remote 模式下会抛出异常）。返回规范化后的 dataset。",
          params: { rows: "保存在内存中的完整集合。" }
        },
        getDataset: {
          description: "返回 dataset 模式完整集合的一个副本（remote 模式下为空数组）。"
        },
        addRow: {
          description: "在集合末尾（dataset）或当前页末尾（remote）追加一行，并使总数加一。",
          params: { row: "要插入的行；会自动获得一个内部 _uuid。" }
        },
        updateRow: {
          description: "对指定行应用部分更新，其余字段保持不变。",
          params: {
            uuid: "该行的内部 _uuid（在规范化时生成）。",
            row: "要覆盖到该行上的字段。"
          }
        },
        removeRow: {
          description: "移除指定行并使总数减一。",
          params: { uuid: "该行的内部 _uuid。" }
        },
        getRows: {
          description: "返回当前渲染的行（即可见页）。"
        },
        getCheckedRows: {
          description: "返回复选框被勾选的行——在 dataset 模式下会考虑完整集合，而不仅是当前页。"
        },
        clearCheckedRows: {
          description: "取消所有行的复选框勾选。"
        },
        setFilter: {
          description: "设置一个筛选条件，回到第 1 页并重新查询（remote）或在本地重新计算（dataset）。",
          params: {
            name: "筛选器名称（即列的 filterName ?? name）。",
            value: "筛选值；null、'' 或 [] 会清除该筛选。"
          }
        },
        setFilters: {
          description: "一次性应用多个筛选条件，最后只发起一次重新查询。",
          params: { filters: "名称 → 值的映射；空值会清除对应的筛选。" }
        },
        paginate: {
          description: "跳转到指定页并调整每页条数（两者最小值均为 1）。",
          params: {
            page: "目标页码（从 1 开始）。",
            rowsPerPage: "每页的行数。"
          }
        },
        applyOrderBy: {
          description: "整体替换排序并回到第 1 页：单个 OrderBy 保持经典的单列行为，OrderBy[] 应用完整的多列排序（索引 0 最先排序），传入 null 则清除排序。",
          params: { orderBy: "一个 { name: string; direction: 'asc' | 'desc' } 对象、用于多列排序的 OrderBy[]，或传 null 以清除。" }
        },
        toggleOrderBy: {
          description: "像点击表头一样循环单个列的排序并回到第 1 页；配合 additive: true 可重现 Shift+点击，保留其他已排序的列。",
          params: {
            name: "要循环排序的列名（asc → desc → 移除）。",
            options: "additive: true 会保留其他已排序的列；不传时该列成为唯一排序。"
          }
        },
        setColumnOrder: {
          description: "整体替换列的有效顺序；空数组恢复配置中的自然顺序。",
          params: { order: "按期望顺序排列的列名列表；未列出的列名会排到末尾。" }
        },
        moveColumn: {
          description: "把一列移到另一列旁边，落在目标之前（默认）或之后；目标为 null 时移到末尾。",
          params: {
            name: "要移动的列名。",
            targetName: "参照列的列名，传 null 则把该列移到末尾。",
            position: "该列落在目标之前（默认）还是之后。"
          }
        },
        setColumnPinned: {
          description: "把列固定到某一侧（或传 null 取消固定），覆盖列配置中的 pinned。",
          params: {
            name: "要固定的列名。",
            pinned: "'left'、'right'，或传 null 取消固定。"
          }
        },
        getColumnPin: {
          description: "返回列当前的固定状态（'left'、'right' 或 null）：有运行时覆盖时返回覆盖值，否则返回列配置中的 pinned。",
          params: { name: "要查询的列名。" }
        },
        expandRow: {
          description: "展开指定行，在其正下方渲染详情区域（需要 expandableRowsEnabled）。当该行已展开或不在当前页时会被忽略。",
          params: { uuid: "该行的内部 _uuid（在规范化时生成）。" }
        },
        collapseRow: {
          description: "折叠指定行，移除详情区域；当该行未展开时会被忽略。",
          params: { uuid: "该行的内部 _uuid。" }
        },
        getExpandedRows: {
          description: "返回当前可见页中处于展开状态的行——切换页码或数据集会折叠全部。"
        },
        getSummarizedValue: {
          description: "对当前行的该列值求和并返回 { raw, formatted }；当该列不可求和时（既无数值 type 也无 summarizerValueGetter）返回 null。",
          params: {
            column: "要合计的列。",
            onlyIsChecked: "配合 summarizeOnlyChecked，将求和限定在已勾选的行。"
          }
        }
      }
    }
  },

  playground: {
    panelAria: "演练场设置",
    settings: "设置",
    reset: "重置",
    groupData: "数据",
    groupFeatures: "功能",
    groupExpandable: "可展开行",
    groupLayout: "布局",
    groupTheme: "主题",
    groupLocalization: "本地化",
    localeAuto: "跟随文档语言",
    addOverride: "添加覆盖…",
    removeOverride: "移除 {key} 的覆盖",
    emptyDataset: "空数据集",
    emptyDatasetHint: "显示空状态文案",
    checkboxHint: "与单选互斥",
    radioHint: "与多选互斥",
    actionsHint: "每行一个“打开”按钮",
    renderer: "渲染器",
    rendererSync: "同步",
    rendererAsync: "异步（700ms）",
    customLoading: "自定义加载状态",
    heightHint: "与 overflowEnabled 配合使用",
    themePickerAria: "选择主题",
    stageCaption: "真实组件 · 对每项设置实时响应",
    initialEvent: "点击表格中的一个操作",
    openAction: "打开",
    openEvent: "打开 {name}",
    customLoadingText: "正在准备 {name} 的档案…",
    generatedCode: "生成的代码",
    codeNote: "只包含与默认值不同的部分",
    tableAria: "Arcana DataTable 演练场",
    infoAria: "关于 {label}",
    hints: {
      rowsPerPage: "每页显示的行数。",
      messages: "覆盖语言包中的单条文案；占位符显示语言包的当前值。",
      searchEnabled: "表格上方的搜索框。",
      orderByEnabled: "点击表头按该列排序。",
      footerSummarizerEnabled: "在页脚汇总合计。",
      summarizeOnlyChecked: "只汇总勾选的行。",
      rowFocusEnabled: "高亮光标所在的行。",
      cellFocusEnabled: "高亮聚焦的单元格。",
      expandableRowsEnabled: "行可以展开显示详情。",
      expandRowOnClick: "点击行的任意位置即可展开。",
      renderer: "内容立即渲染或通过 Promise 异步解析。",
      customLoading: "异步模式下的自定义加载状态。",
      stickyHeaderEnabled: "滚动时表头保持可见。",
      columnResizeEnabled: "拖动表头边缘即可调整列宽。",
      columnReorderEnabled: "拖动表头即可重新排序列。",
      pinColumns: "将第一列固定到左侧，最后一列固定到右侧。",
      overflowEnabled: "表体内部滚动而不是撑高。",
      responsiveMode: "窄屏下的响应行为。",
      footerVisible: "显示带分页的页脚。",
      isRowsPerPageVisible: "页脚中的每页行数选择器。",
      calculateCellWidth: "根据内容计算列宽。",
      theme: "表格的视觉主题。",
      locale: "表格内置文本的语言。"
    }
  },

  demos: {
    departments: {
      engineering: "工程",
      research: "研究",
      product: "产品",
      editorial: "编辑",
      infrastructure: "基础设施"
    },
    statuses: {
      active: "在职",
      inReview: "审核中",
      inactive: "停用"
    },
    available: "可用",
    unavailable: "不可用",
    cols: {
      id: "ID",
      name: "姓名",
      email: "邮箱",
      area: "部门",
      status: "状态",
      joinedAt: "入职日期",
      amount: "金额",
      score: "评分",
      client: "客户",
      department: "部门",
      person: "人员",
      situation: "状态",
      date: "日期",
      month: "月份",
      period: "期间",
      boolean: "布尔",
      list: "列表",
      remoteList: "远程列表",
      custom: "自定义",
      code: "编号",
      totalSelected: "选中合计",
      points: "积分"
    },
    requestsLabel: "{n} 次请求",
    zeroRequests: "0 次请求",
    emptyStateTest: "试试空状态",
    restoreDataset: "恢复数据集",
    paginationEmpty: "该区间内没有员工。",
    customFilter: "你自己的筛选器",
    checkboxInitial: "选择一行",
    checkedEvent: "已选中 {name}",
    uncheckedEvent: "已移除 {name}",
    checkboxChanged: "复选框变化：{name}",
    radioInitial: "尚未选择任何行",
    radioChosen: "已选择：{name}",
    radioRemoved: "已移除：{name}",
    radioChanged: "单选变化：{name}",
    actionsInitial: "点击一行、一个单元格或一个操作",
    open: "打开",
    openEvent: "打开 {name}",
    rowClick: "点击：{name}",
    rowDblClick: "双击：{name}",
    cellClick: "单元格 {column}：{name}",
    cellDblClick: "双击 {column}：{name}",
    ctxCopy: "复制 {column}",
    ctxCopied: "已复制 {name} 的内容",
    card: {
      email: "邮箱",
      area: "部门",
      score: "评分",
      joined: "入职日期",
      pts: "分"
    },
    aria: {
      firstUse: "Arcana DataTable 初次使用",
      themes: "主题演示",
      themePicker: "选择主题",
      expandable: "可展开行演示",
      hooks: "渲染钩子示例"
    }
  }
};
