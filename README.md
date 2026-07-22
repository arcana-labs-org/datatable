# @arcanalabs/datatable

Data table pública, tipada e compatível com Vue 3, React, Angular e Svelte. Um núcleo TypeScript compartilhado mantém paginação, filtros, ordenação, seleção, busca remota e sumarização consistentes em todos os frameworks.

[Documentação](https://leonardocaldas.github.io/arcanalabs-datatable/) · [Issues](https://github.com/arcana-labs-org/datatable/issues) · [Changelog](./CHANGELOG.md)

## Requisitos

- Node.js 20.19 ou 22.12 ou superior
- Vue 3.4+ para o adaptador Vue
- React 18+ para o adaptador React
- Angular 17+ para o adaptador Angular
- Svelte 5+ para o adaptador Svelte

Todos os frameworks são peers opcionais: instale apenas o usado pela aplicação. Os pontos de entrada são `@arcanalabs/datatable/vue`, `@arcanalabs/datatable/react`, `@arcanalabs/datatable/angular` e `@arcanalabs/datatable/svelte`.

## Instalação

```bash
npm install @arcanalabs/datatable
```

Importe os estilos uma vez no ponto de entrada da aplicação:

```ts
import '@arcanalabs/datatable/styles.css'
```

## Modos de dados

O grid possui dois modos de funcionamento. O modo é definido explicitamente por `mode` ou inferido como `dataset` quando a propriedade `dataset` é informada.

### Remote

Use `mode: 'remote'` para paginação no servidor. Cada ação de filtro, ordenação, troca de página ou alteração de quantidade por página executa uma nova chamada a `datasource`, `url` ou ao adaptador global `request`.

```ts
const config = {
  mode: 'remote',
  columns,
  datasource: async (params) => api.customers.list(params)
}
```

O provider recebe `page`, `limit`, filtros e, quando aplicável, `order_by[field]` e `order_by[direction]`.

### Dataset

Use `mode: 'dataset'` para fornecer a coleção completa uma única vez. Paginação, rows por página, filtros e ordenação são aplicados em memória sem requests.

```ts
const config = {
  mode: 'dataset',
  columns,
  dataset: customers,
  rowsPerPage: 25
}
```

Neste modo:

- `rows` e `getRows()` representam apenas a página visível;
- `datasetSize` representa o tamanho da coleção completa;
- `getDataset()` retorna a coleção local completa;
- seleção por checkbox persiste ao trocar de página;
- `addRow`, `updateRow`, `removeRow`, `upsert` e `clearRows` alteram o dataset local;
- `setDataset(rows)` substitui a coleção e reaplica filtros, ordenação e paginação;
- `datasource`, `url` e `request` não são executados.

## Vue 3

Uso local:

```vue
<script setup lang="ts">
import { ArcanaDataTable } from '@arcanalabs/datatable/vue'
import type { DataTableConfig } from '@arcanalabs/datatable'

type Customer = { id: number; name: string; balance: number }

const config: DataTableConfig<Customer> = {
  mode: 'remote',
  checkboxEnabled: true,
  columns: [
    { name: 'id', label: 'ID', width: 80 },
    { name: 'name', label: 'Cliente' },
    { name: 'balance', label: 'Saldo', type: 'CURRENCY' }
  ],
  datasource: (params) => fetch(`/api/customers?${new URLSearchParams(params as Record<string, string>)}`).then(r => r.json())
}
</script>

<template><ArcanaDataTable :config="config" /></template>
```

Registro global:

```ts
import { createApp } from 'vue'
import ArcanaDataTablePlugin from '@arcanalabs/datatable/vue'

createApp(App).use(ArcanaDataTablePlugin, {
  baseUrl: 'https://api.example.com'
}).mount('#app')
```

Em Nuxt 3, crie `plugins/arcanalabs-datatable.client.ts`:

```ts
import ArcanaDataTablePlugin from '@arcanalabs/datatable/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ArcanaDataTablePlugin)
})
```

## React

```tsx
import { useRef } from 'react'
import { ArcanaDataTable } from '@arcanalabs/datatable/react'
import type { DataTableApi, DataTableConfig } from '@arcanalabs/datatable'

type Customer = { id: number; name: string; balance: number }

export function Customers() {
  const grid = useRef<DataTableApi<Customer>>(null)
  const config: DataTableConfig<Customer> = {
    mode: 'remote',
    checkboxEnabled: true,
    columns: [
      { name: 'id', label: 'ID', width: 80 },
      { name: 'name', label: 'Cliente' },
      { name: 'balance', label: 'Saldo', type: 'CURRENCY' }
    ],
    datasource: async (params) => api.customers.list(params)
  }

  return <ArcanaDataTable ref={grid} config={config} />
}
```

Mantenha `config` estável com `useMemo` quando ele for criado durante a renderização; mudar sua identidade cria um novo controller.

## Angular

Componente standalone; importe-o direto nos `imports` do componente ou rota:

```ts
import { Component, ViewChild } from '@angular/core'
import { ArcanaDataTableComponent } from '@arcanalabs/datatable/angular'
import type { DataTableConfig } from '@arcanalabs/datatable'

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [ArcanaDataTableComponent],
  template: `<arcana-data-table #table [config]="config" (mounted)="onMounted($event)" />`
})
export class CustomersComponent {
  @ViewChild('table') table!: ArcanaDataTableComponent

  config: DataTableConfig = {
    mode: 'remote',
    checkboxEnabled: true,
    columns: [
      { name: 'id', label: 'ID', width: 80 },
      { name: 'name', label: 'Cliente' },
      { name: 'balance', label: 'Saldo', type: 'CURRENCY' }
    ],
    datasource: async (params) => api.customers.list(params)
  }

  refresh() {
    void this.table.api.refresh() // `api` é o DataTableApi imperativo
  }
}
```

Importe os estilos uma vez — em `angular.json` (`"styles": ["node_modules/@arcanalabs/datatable/dist/arcanalabs-datatable.css"]`) ou com `@import '@arcanalabs/datatable/styles.css';` no `styles.css` global.

Conteúdo custom (`valueGetter`, `actions[].element`, `expandedRowRenderer`, …) aceita o que `Renderable` permite de forma neutra ao framework: strings HTML, números/booleans, um `Node` DOM construído imperativamente ou callbacks que retornam qualquer um desses.

### Como o adaptador Angular é empacotado

O adaptador é compilado por `ngc` em **modo `partial`** (o mesmo formato que o ng-packagr produz): o JavaScript publicado contém `ɵɵngDeclareComponent` e o **Angular linker** do build da sua aplicação (Angular CLI 17+) finaliza a compilação AOT ao consumir o pacote. Trade-offs dessa escolha, em vez de acoplar o Angular ao bundle Vite dos demais adaptadores:

- o passo `npm run build:angular` (encadeado em `npm run build`) roda `ngc -p tsconfig.angular.json` e emite `dist/angular/` como ES modules planos (sem FESM), com o núcleo (`core/`) duplicado nesse subdiretório para o pacote ser autossuficiente;
- o subcaminho `@arcanalabs/datatable/angular` só publica ESM (`default`), sem variante CJS — o tooling do Angular é ESM;
- `strictTemplates` está habilitado na compilação, então os templates inline são verificados em build.

## Svelte

Componentes Svelte 5 (runes). O controller imperativo fica disponível via `bind:this` (exports da instância) ou pelo callback `onMounted`:

```svelte
<script lang="ts">
import { ArcanaDataTable } from '@arcanalabs/datatable/svelte'
import '@arcanalabs/datatable/styles.css'
import type { DataTableConfig } from '@arcanalabs/datatable'

let table: { refresh(): Promise<void> } | undefined

const config: DataTableConfig = {
  mode: 'remote',
  checkboxEnabled: true,
  columns: [
    { name: 'id', label: 'ID', width: 80 },
    { name: 'name', label: 'Cliente' },
    { name: 'balance', label: 'Saldo', type: 'CURRENCY' }
  ],
  datasource: async (params) => api.customers.list(params)
}
</script>

<button onclick={() => table?.refresh()}>Atualizar</button>
<ArcanaDataTable bind:this={table} {config} />
```

Assim como no Angular, conteúdo custom aceita strings HTML, números/booleans, `Node` DOM ou callbacks que retornam qualquer um desses (ex.: `actions: [{ element: row => '<button>Abrir</button>' }]`).


## Contrato remoto

No modo `remote`, `datasource(params)` pode retornar um bloco em array:

```ts
[{ id: 1, name: 'Ada' }]
```

Ou uma resposta paginada:

```ts
{ rows: [{ id: 1, name: 'Ada' }], total: 240, page: 1 }
```

Os parâmetros enviados são:

- `page` e `limit`;
- filtros pelo `filterName` ou `name` da coluna;
- `order_by[field]` e `order_by[direction]` quando houver ordenação.

Sem `datasource`, configure `url`. O pacote usa `fetch` ou o adaptador global `request`. Para paginação completa, prefira o envelope `{ rows, total, page }`; um array simples informa somente o tamanho do bloco retornado.

## Configuração global

```ts
import { configureDataTable } from '@arcanalabs/datatable'

configureDataTable({
  baseUrl: 'https://api.example.com',
  request: async (url, params, baseUrl) => http.get(`${baseUrl}${url}`, { params }),
  eventProxy: eventBus
})
```

## Colunas

```ts
{
  name: 'profile.name',
  label: 'Nome',
  width: '30%',
  textAlignment: 'left',
  filterName: 'name',
  searchType: 'LIST',
  searchConfig: async () => [{ value: 'active', label: 'Ativo' }],
  valueGetter: (value, row, grid) => value,
  orderByEnabled: true,
  searchEnabled: true,
  isVisible: () => canSeeCustomer,
  summarizerValueGetter: value => Number(value),
  summarizerValueFormatter: value => formatMoney(value)
}
```

Tipos de busca: `DATE`, `DATE_MONTH`, `DATE_RANGE`, `BOOLEAN`, `LIST`, `REMOTE` e `COMPONENT`. Tipos numéricos: `NUMBER`, `CURRENCY`, `PERCENTAGE` e `TEXT`.

## API imperativa

O ref do React, o `defineExpose` do Vue, o `api` do componente Angular, os exports da instância Svelte (`bind:this`) e `createDataTable(config)` compartilham a mesma API:

| Método | Resultado |
| --- | --- |
| `refresh()` / `fetch()` | Consulta o servidor em `remote`; recalcula a visão em `dataset` |
| `setRows(rows)` | Substitui o bloco remoto ou o dataset, conforme o modo |
| `setDataset(rows)` | Substitui a coleção completa em `dataset` |
| `getDataset()` | Retorna a coleção completa em `dataset` |
| `addRow(row)` | Adiciona uma linha |
| `updateRow(uuid, patch)` | Atualiza uma linha |
| `upsert(uuid, row)` | Insere ou atualiza |
| `removeRow(uuid)` / `clearRows()` | Remove dados |
| `getRows()` | Retorna o bloco/página atualmente visível |
| `getCheckedRows()` | Retorna selecionados; em `dataset`, considera todas as páginas |
| `setFilter(name, value)` | Recalcula em `dataset` ou consulta um novo bloco em `remote` |
| `setFilters(filters)` | Aplica o lote localmente ou faz uma única consulta em `remote` |
| `applyFilter(column, value)` | Filtra localmente ou consulta um novo bloco remoto |
| `applyOrderBy(orderBy)` | Ordena localmente ou consulta um novo bloco remoto |
| `paginate(page, size)` | Pagina localmente ou consulta um novo bloco remoto |
| `getSummarizedValue(column)` | Calcula total numérico |
| `setSelectedRadioRow(row)` | Define seleção única |

## Responsividade e acessibilidade

Use `responsiveMode: 'HORIZONTAL_OVERFLOW'` para preservar a grade com rolagem lateral ou `VERTICAL_RECORD` para transformar linhas em registros verticais abaixo de 768 px. Cabeçalhos, linhas, células, seleção, estado de carregamento e paginação incluem roles e labels. O CSS inclui foco visível e respeita `prefers-reduced-motion` no site.

## Renderizadores e segurança

`valueGetter`, `headerContentGetter` e actions aceitam conteúdo nativo do framework. Para compatibilidade com o projeto original, strings são renderizadas como HTML. Não retorne texto criado por usuários sem sanitização. Prefira VNodes no Vue e React elements no React para conteúdo interativo; no Angular e no Svelte, use um `Node` DOM (ou callback que o retorne) quando precisar de conteúdo interativo.

## Desenvolvimento

```bash
npm install
npm run typecheck
npm test
npm run build
npm run dev   # sobe a documentação (alias: npm run docs:dev)
npm run check
```

`npm run dev` sobe o site da documentação, que inclui o playground interativo em `#/playground` — todas as configurações do grid com preview ao vivo e código gerado por framework.

O workflow `.github/workflows/pages.yml` compila e publica `docs/dist` no GitHub Pages após cada push em `main`. No repositório, configure **Settings → Pages → Source → GitHub Actions**.

## Publicação npm

O pacote usa escopo público e provenance:

```bash
npm login
npm run check
npm publish --access public
```

O nome `@arcanalabs/datatable` precisa estar disponível e o usuário autenticado precisa ter permissão no escopo `@arcanalabs`.

## Licença

[MIT](./LICENSE)
