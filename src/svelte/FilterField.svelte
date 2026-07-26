<script lang="ts">
  /**
   * Renders the filter control for a column, mirroring the React/Vue
   * `FilterField`: DATE/DATE_MONTH/DATE_RANGE → `ArcanaDatePicker`,
   * BOOLEAN/LIST/REMOTE → `ArcanaSelect`, anything else → text input that
   * commits on blur/Enter.
   */
  import { formatMessage, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
  import type { DataTableColumn, DataTableRow, SearchOption } from "../core/types";
  import { ArcanaInput as UiArcanaInput, ArcanaSelect, ArcanaDatePicker } from "@arcanalabs/ui-components/svelte";
  import type { Component, Snippet } from "svelte";

  // ui-components 2.1.0 implements the icon snippets, but its generated
  // Svelte declaration omits them. Keep the adapter typed until that upstream
  // declaration catches up with the runtime API.
  const ArcanaInput = UiArcanaInput as Component<{
    value?: string | number | null;
    type?: string;
    disabled?: boolean;
    class?: string;
    iconStart?: Snippet;
    onValueChange?: (value: string | number | null) => void;
    onBlur?: (event: FocusEvent) => void;
    onKeydown?: (event: KeyboardEvent) => void;
  }>;

  let { column, value, disabled = false, messages, locale, onChange }: {
    column: DataTableColumn<DataTableRow>;
    value: unknown;
    disabled?: boolean;
    messages?: ArcanaMessages;
    locale?: ArcanaLocale;
    onChange: (value: unknown) => void;
  } = $props();

  const msg = $derived(messages ?? resolveArcanaMessages());
  const filterLabel = $derived(formatMessage(msg.filterLabel, { label: column.label }));
  const booleanOptions = $derived<SearchOption[]>([
    { value: "", label: msg.booleanAll },
    { value: "1", label: msg.booleanYes },
    { value: "0", label: msg.booleanNo }
  ]);

  let options = $state<SearchOption[]>([]);
  let draft = $state<unknown>(value ?? "");

  $effect(() => { draft = value ?? ""; });
  $effect(() => {
    let active = true;
    Promise.resolve(column.searchConfig?.() ?? []).then((items) => { if (active) options = items; });
    return () => { active = false; };
  });

  const commit = (next: unknown) => { draft = next; onChange(next); };

  const rangeValue = $derived.by<[string, string]>(() => Array.isArray(draft)
    ? [String(draft[0] ?? ""), String(draft[1] ?? "")]
    : ["", ""]);
  const listValue = $derived.by<string[]>(() => Array.isArray(draft)
    ? draft.map(String)
    : draft == null || draft === "" ? [] : [String(draft)]);
</script>

{#if column.searchType === "DATE_RANGE"}
  <ArcanaDatePicker type="daterange" value={rangeValue} {disabled} {locale} ariaLabel={filterLabel} onChange={commit} />
{:else if column.searchType === "BOOLEAN"}
  <ArcanaSelect value={String(draft ?? "")} options={booleanOptions} {disabled} placeholder={msg.booleanAll} onChange={commit} />
{:else if column.searchType === "LIST" || column.searchType === "REMOTE"}
  <ArcanaSelect multiple value={listValue} {options} {disabled} placeholder={msg.booleanAll} onChange={commit} />
{:else if column.searchType === "DATE" || column.searchType === "DATE_MONTH"}
  <ArcanaDatePicker type={column.searchType === "DATE" ? "date" : "month"} value={String(draft ?? "")} {disabled} {locale} ariaLabel={filterLabel} onChange={commit} />
{:else}
  {#snippet searchIcon()}
    <svg class="arcana-search-input__icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="m10.5 10.5 3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
  {/snippet}
  <label class="arcana-search-input">
    <span class="arcana-visually-hidden">{filterLabel}</span>
    <ArcanaInput
      type="search"
      value={String(draft ?? "")}
      {disabled}
      class="arcana-grid-datatable-input"
      iconStart={searchIcon}
      onValueChange={(next) => { draft = next ?? ""; }}
      onBlur={() => onChange(draft)}
      onKeydown={(event) => { if (event.key === "Enter") onChange(draft); }}
    />
  </label>
{/if}
