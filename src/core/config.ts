import type { ArcanaDataTableOptions, EventProxy, RequestAdapter } from "./types";

export const globalConfig: {
  baseUrl?: string;
  request?: RequestAdapter;
  eventProxy?: EventProxy;
} = {};

/** Backwards-compatible name used by arcana-grid-vue integrations. */
export const GlobalConfig = globalConfig;

export function configureDataTable(options: ArcanaDataTableOptions = {}): void {
  if (options.baseUrl !== undefined) globalConfig.baseUrl = options.baseUrl;
  if (options.request !== undefined) globalConfig.request = options.request;
  if (options.eventProxy !== undefined) globalConfig.eventProxy = options.eventProxy;
}
