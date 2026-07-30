<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { formatMessage, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
import type { DataTableColumn, DataTableRow, FilterOperator, SearchOption } from "../core/types";
import { ArcanaInput, ArcanaSelect, ArcanaDatePicker } from "@arcanalabs/ui-components/vue";

const props = defineProps<{
  column: DataTableColumn<DataTableRow>;
  modelValue: unknown;
  disabled?: boolean;
  messages?: ArcanaMessages;
  locale?: ArcanaLocale;
  operator: FilterOperator;
}>();
const emit = defineEmits<{ change: [value: unknown]; operatorChange: [value: FilterOperator] }>();
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
const onTextInput = (next: string | number | null) => { value.value = next ?? ""; };

const rangeValue = computed<[string, string]>(() => Array.isArray(value.value)
  ? [String(value.value[0] ?? ""), String(value.value[1] ?? "")]
  : ["", ""]);
const listValue = computed<string[]>(() => Array.isArray(value.value)
  ? value.value.map(String)
  : value.value == null || value.value === "" ? [] : [String(value.value)]);
const operators = computed<FilterOperator[]>(() => props.column.filterOperators ?? (["NUMBER", "CURRENCY", "PERCENTAGE"].includes(props.column.type ?? "")
  ? ["equals", "notEquals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"]
  : props.column.searchType == null ? ["contains", "startsWith", "endsWith", "equals", "notEquals"] : []));
const operatorLabels = computed<Record<FilterOperator, string>>(() => ({ contains: msg.value.opContains, startsWith: msg.value.opStartsWith, endsWith: msg.value.opEndsWith, equals: msg.value.opEquals, notEquals: msg.value.opNotEquals, greaterThan: msg.value.opGreaterThan, greaterThanOrEqual: msg.value.opGreaterThanOrEqual, lessThan: msg.value.opLessThan, lessThanOrEqual: msg.value.opLessThanOrEqual, between: msg.value.opBetween }));
</script>

<template>
  <div class="arcana-filter-composer">
  <select v-if="operators.length > 1" class="arcana-filter-operator" :aria-label="`${msg.filterOperator}: ${column.label}`" :value="operator" @change="emit('operatorChange', ($event.target as HTMLSelectElement).value as FilterOperator)">
    <option v-for="item in operators" :key="item" :value="item">{{ operatorLabels[item] }}</option>
  </select>
  <ArcanaDatePicker
    v-if="column.searchType === 'DATE_RANGE'"
    type="daterange"
    size="sm"
    :model-value="rangeValue"
    :disabled="disabled"
    :locale="locale"
    :aria-label="filterLabel"
    @change="commit"
  />
  <ArcanaSelect
    v-else-if="column.searchType === 'BOOLEAN'"
    size="sm"
    :model-value="String(value ?? '')"
    :options="booleanOptions"
    :disabled="disabled"
    :placeholder="msg.booleanAll"
    :aria-label="filterLabel"
    @change="commit"
  />
  <ArcanaSelect
    v-else-if="column.searchType === 'LIST' || column.searchType === 'REMOTE'"
    size="sm"
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
    size="sm"
    :model-value="String(value ?? '')"
    :disabled="disabled"
    :locale="locale"
    :aria-label="filterLabel"
    @change="commit"
  />
  <label v-else class="arcana-search-input">
    <span class="arcana-visually-hidden">{{ filterLabel }}</span>
    <ArcanaInput
      type="search"
      size="sm"
      :model-value="String(value ?? '')"
      :disabled="disabled"
      @update:model-value="onTextInput"
      @blur="commitText"
      @keydown.enter="commitText"
    >
      <template #icon-start>
        <svg class="arcana-search-input__icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="m10.5 10.5 3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
      </template>
    </ArcanaInput>
  </label>
  </div>
</template>
