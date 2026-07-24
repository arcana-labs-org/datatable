<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { formatMessage, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
import type { DataTableColumn, DataTableRow, SearchOption } from "../core/types";
import { ArcanaSelect, ArcanaDatePicker } from "@arcanalabs/ui-components/vue";

const props = defineProps<{
  column: DataTableColumn<DataTableRow>;
  modelValue: unknown;
  disabled?: boolean;
  messages?: ArcanaMessages;
  locale?: ArcanaLocale;
}>();
const emit = defineEmits<{ change: [value: unknown] }>();
const value = ref<unknown>(props.modelValue ?? "");
const options = ref<SearchOption[]>([]);

const msg = computed(() => props.messages ?? resolveArcanaMessages());
const filterLabel = computed(() => formatMessage(msg.value.filterLabel, { label: props.column.label }));
const booleanOptions = computed<SearchOption[]>(() => [
  { value: "", label: msg.value.booleanAll },
  { value: "1", label: msg.value.booleanYes },
  { value: "0", label: msg.value.booleanNo }
]);

watch(() => props.modelValue, (next) => { value.value = next ?? ""; });
onMounted(async () => { options.value = await props.column.searchConfig?.() ?? []; });

const commit = (next: unknown) => { value.value = next; emit("change", next); };
const commitText = () => emit("change", value.value);
const onInput = (event: Event) => { value.value = (event.target as HTMLInputElement).value; };

const rangeValue = computed<[string, string]>(() => Array.isArray(value.value)
  ? [String(value.value[0] ?? ""), String(value.value[1] ?? "")]
  : ["", ""]);
const listValue = computed<string[]>(() => Array.isArray(value.value)
  ? value.value.map(String)
  : value.value == null || value.value === "" ? [] : [String(value.value)]);
</script>

<template>
  <ArcanaDatePicker
    v-if="column.searchType === 'DATE_RANGE'"
    type="daterange"
    :model-value="rangeValue"
    :disabled="disabled"
    :locale="locale"
    :aria-label="filterLabel"
    @change="commit"
  />
  <ArcanaSelect
    v-else-if="column.searchType === 'BOOLEAN'"
    :model-value="String(value ?? '')"
    :options="booleanOptions"
    :disabled="disabled"
    :placeholder="msg.booleanAll"
    :aria-label="filterLabel"
    @change="commit"
  />
  <ArcanaSelect
    v-else-if="column.searchType === 'LIST' || column.searchType === 'REMOTE'"
    multiple
    :model-value="listValue"
    :options="options"
    :disabled="disabled"
    :placeholder="msg.booleanAll"
    :aria-label="filterLabel"
    @change="commit"
  />
  <ArcanaDatePicker
    v-else-if="column.searchType === 'DATE' || column.searchType === 'DATE_MONTH'"
    :type="column.searchType === 'DATE' ? 'date' : 'month'"
    :model-value="String(value ?? '')"
    :disabled="disabled"
    :locale="locale"
    :aria-label="filterLabel"
    @change="commit"
  />
  <input
    v-else
    type="search"
    :value="value as string"
    :disabled="disabled"
    class="arcana-grid-datatable-input"
    :aria-label="filterLabel"
    @input="onInput"
    @change="commitText"
    @keyup.enter="commitText"
  />
</template>
