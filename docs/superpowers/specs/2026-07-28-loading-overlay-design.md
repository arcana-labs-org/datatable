# Loading overlay durante fetching remoto

## Problema

`config.showLoadingDuringRequest` (default `true`) só produz efeito visual no
carregamento inicial (tabela vazia), e ainda assim como texto plano. Em
refetches (paginação, ordenação, filtro) — quando já existem linhas — nenhuma
indicação aparece, apesar de `controller.fetch()` setar `loading = true` e
notificar corretamente em toda requisição.

Causa: as quatro adapters (Vue/React/Svelte/Angular) só renderizam o estado de
loading quando `rows.length === 0`, e apenas como `<div class="arcana-grid-status">{msg.loading}</div>`.

## Objetivo

Mostrar um overlay de loading centralizado (spinner + texto) sobre o datatable
em **toda** requisição remota — inclusive refetches, mantendo as linhas atuais
visíveis por baixo — reproduzindo o exemplo da doc do ui-components.

## Decisões

- **Componente:** reusar `ArcanaLoadingOverlay` do `@arcanalabs/ui-components`
  (existe nas 4 frameworks). Props: `visible`, `text`. Ele é
  `position:absolute; inset:0` com backdrop translúcido + blur e spinner+texto
  centralizados; `role="status"`, `aria-live="polite"`.
- **Config:** reusar `showLoadingDuringRequest` (default `true`). Sem nova opção.
- **Texto:** `msg.loading` (i18n já existente).

## Mudanças

1. **Render (4 adapters):** adicionar o overlay como filho direto do root
   `.arcana-grid.grid-wrapper`, `visible = snap.loading`, `text = msg.loading`.
   - Vue: `<ArcanaLoadingOverlay :visible="state.loading" :text="msg.loading" />`
   - React: `<ArcanaLoadingOverlay visible={state.loading} text={messages.loading} />`
   - Svelte: `<ArcanaLoadingOverlay visible={snap.loading} text={msg.loading} />`
   - Angular: `<div arcanaLoadingOverlay [visible]="snap.loading" [text]="msg.loading"></div>`
     (+ registrar `ArcanaLoadingOverlayComponent` em `imports`).
2. **CSS (`ArcanaGrid.css`):**
   - `.arcana-grid.grid-wrapper { position: relative; }` — âncora do overlay.
   - `.arcana-grid.grid-wrapper[aria-busy="true"] { min-height: 180px; }` — área
     visível pro spinner na carga inicial (tabela vazia).
3. **Status inline:** a branch de loading do bloco `arcana-grid-status` deixa de
   exibir `msg.loading` (o overlay assume). Passa a exibir só a mensagem *empty*
   quando `!loading && rows.length === 0`, evitando texto duplicado.

## Riscos verificados

- Context menus (`.arcana-context-menu`) são `position: fixed` → não são
  afetados por `position: relative` no wrapper.
- Coordenadas dos menus são viewport-relative (`clientX/clientY`,
  `getBoundingClientRect`) → seguem corretas.
- CSS do overlay vem de `ui-components.css`, já carregado pelos consumidores
  (filter fields dependem dele).

## Testes

Um teste por framework: com um `datasource` que retorna uma promise pendente,
disparar um refetch com linhas já presentes → `.arcana-loading-overlay` visível;
resolver → overlay some. (Angular: elemento presente sempre; checar
`display !== 'none'`.)
