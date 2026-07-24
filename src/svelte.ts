import type { Component } from "svelte";
import type { DataTableApi, DataTableConfig, DataTableRow } from "./core/types";
import ArcanaDataTableComponent from "./svelte/ArcanaDataTable.svelte";

export * from "./index";

export interface ArcanaDataTableProps {
  config: DataTableConfig<DataTableRow>;
  class?: string;
  onMounted?: (grid: DataTableApi<DataTableRow>) => void;
}

/** Imperative surface exported by the component instance (`bind:this`). */
export interface ArcanaDataTableExports {
  getApi(): DataTableApi<DataTableRow>;
  refresh(): Promise<void>;
  fetch(): Promise<void>;
  setRows(rows: DataTableRow[]): DataTableRow[];
  setDataset(rows: DataTableRow[]): DataTableRow[];
  getDataset(): DataTableRow[];
  clearRows(): void;
  addRow(row: DataTableRow): void;
  removeRow(uuid: string): void;
  updateRow(uuid: string, row: Partial<DataTableRow>): void;
  upsert(uuid: string, row: DataTableRow): void;
  getRows(): DataTableRow[];
  getCheckedRows(): DataTableRow[];
  clearCheckedRows(): void;
  setFilter(name: string, value: unknown): Promise<void>;
  setFilters(filters: Record<string, unknown>): Promise<void>;
  expandRow(uuid: string): void;
  collapseRow(uuid: string): void;
  getExpandedRows(): DataTableRow[];
}

export const ArcanaDataTable: Component<ArcanaDataTableProps, ArcanaDataTableExports> =
  ArcanaDataTableComponent as unknown as Component<ArcanaDataTableProps, ArcanaDataTableExports>;
export const SparkGrid = ArcanaDataTable;
