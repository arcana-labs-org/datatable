<p align="center">
  <img src="docs/src/assets/arcana-logo-banner-light.png" alt="Arcana" width="520" />
</p>

<h1 align="center">@arcanalabs/datatable</h1>

<p align="center">
  A typed, framework-native data table for <b>React</b>, <b>Vue 3</b>, <b>Angular</b> and <b>Svelte</b> —
  one shared core, four first-class adapters.
</p>

<p align="center">
  <a href="https://arcana-labs-org.github.io/datatable/"><b>📖 Documentation</b></a> ·
  <a href="https://arcana-labs-org.github.io/datatable/#/playground"><b>🎛 Playground</b></a>
</p>

---

```bash
npm install @arcanalabs/datatable
```

```tsx
import { ArcanaDataTable } from "@arcanalabs/datatable/react"; // or /vue, /angular, /svelte
import "@arcanalabs/ui-components/styles.css";
import "@arcanalabs/datatable/styles.css";

<ArcanaDataTable config={{ columns, datasource: (params) => api.orders.list(params) }} />
```

Import both stylesheets once at the application entrypoint. Input, Select and
DatePicker use the official `@arcanalabs/ui-components` stylesheet and their
native `sm` variant; the DataTable CSS only adds grid layout and theme tokens.

Everything else — remote/dataset modes, virtual rows and columns, cell/row editing, advanced
filter operators, grouping and aggregations, row/column drag-and-drop, persistent
column visibility, selection, expandable rows, themes, localization (8 languages)
and the full API reference — lives in the
**[documentation](https://arcana-labs-org.github.io/datatable/)**, with live demos for
all four frameworks.

MIT © Arcana Labs
