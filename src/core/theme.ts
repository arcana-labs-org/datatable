import type { ArcanaTheme, ArcanaThemePreset } from "./types";

/**
 * Global theme registry.
 *
 * Every theme is a CSS class (`arcana-theme-{name}`) that only overrides the
 * `--arcana-*` custom properties declared in `ArcanaGrid.css`. The grid root
 * receives the class, and — because the select/calendar panels are portaled
 * to `<body>` and therefore do NOT inherit variables from the grid — the same
 * class is propagated to every portaled panel.
 */
export const ARCANA_THEMES: readonly ArcanaThemePreset[] = ["zinc", "ocean", "forest", "midnight"];

let defaultArcanaTheme: ArcanaTheme = "zinc";

/** Sets the theme used by every grid whose `config.theme` is absent. */
export function setDefaultArcanaTheme(theme: ArcanaTheme): void {
  defaultArcanaTheme = theme;
}

/** Returns the current global default theme (initially `zinc`). */
export function getDefaultArcanaTheme(): ArcanaTheme {
  return defaultArcanaTheme;
}

/** Resolves the `arcana-theme-{name}` class for a config-level theme (or the global default). */
export function arcanaThemeClass(theme?: ArcanaTheme): string {
  return `arcana-theme-${theme ?? defaultArcanaTheme}`;
}

/**
 * Resolves the theme class from the nearest themed ancestor of `element`.
 * Used by the portaled panels (select/calendar), which render on `<body>`
 * and must repeat the theme class of the grid that owns their trigger.
 */
export function arcanaThemeClassFrom(element: Element | null | undefined): string {
  const host = element?.closest?.('[class*="arcana-theme-"]');
  const match = host?.getAttribute("class")?.match(/arcana-theme-[a-z0-9-]+/i);
  return match?.[0] ?? arcanaThemeClass();
}
