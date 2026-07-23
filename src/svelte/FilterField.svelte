<script lang="ts">
  /**
   * Renders the filter control for a column, mirroring the React/Vue
   * `FilterField`: DATE/DATE_MONTH/DATE_RANGE → `ArcanaDatePicker`,
   * BOOLEAN/LIST/REMOTE → `ArcanaSelect`, anything else → text input that
   * commits on blur/Enter.
   */
  import { formatMessage, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
  import type { DataTableColumn, DataTableRow, SearchOption } from "../core/types";
  import ArcanaSelect from "./ArcanaSelect.svelte";
  import ArcanaDatePicker from "./ArcanaDatePicker.svelte";

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
  <ArcanaDatePicker mode="range" value={rangeValue} {disabled} messages={msg} {locale} ariaLabel={filterLabel} onChange={commit} />
{:else if column.searchType === "BOOLEAN"}
  <ArcanaSelect value={String(draft ?? "")} options={booleanOptions} {disabled} messages={msg} placeholder={msg.booleanAll} ariaLabel={filterLabel} onChange={commit} />
{:else if column.searchType === "LIST" || column.searchType === "REMOTE"}
  <ArcanaSelect multiple value={listValue} {options} {disabled} messages={msg} placeholder={msg.booleanAll} ariaLabel={filterLabel} onChange={commit} />
{:else if column.searchType === "DATE" || column.searchType === "DATE_MONTH"}
  <ArcanaDatePicker mode={column.searchType === "DATE" ? "date" : "month"} value={String(draft ?? "")} {disabled} messages={msg} {locale} ariaLabel={filterLabel} onChange={commit} />
{:else}
  <input
    type="search"
    value={String(draft ?? "")}
    {disabled}
    class="arcana-grid-datatable-input"
    aria-label={filterLabel}
    oninput={(event) => { draft = (event.currentTarget as HTMLInputElement).value; }}
    onblur={() => onChange(draft)}
    onkeydown={(event) => { if (event.key === "Enter") onChange(draft); }}
  />
{/if}
