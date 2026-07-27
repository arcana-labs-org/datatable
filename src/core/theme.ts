import type { ArcanaTheme, ArcanaThemePreset } from "./types";

/**
 * Global theme registry.
 *
 * Every theme is a CSS class (`arcana-theme-{name}`) that only overrides the
 * `--arcana-*` custom properties declared in `ArcanaGrid.css`. The grid root
 * and grid-owned floating menus receive the class. Select and calendar
 * portals are styled by the global `@arcanalabs/ui-components` theme.
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
 * Used by grid-owned floating elements such as drag ghosts and menus.
 */
export function arcanaThemeClassFrom(element: Element | null | undefined): string {
  const host = element?.closest?.('[class*="arcana-theme-"]');
  const match = host?.getAttribute("class")?.match(/arcana-theme-[a-z0-9-]+/i);
  return match?.[0] ?? arcanaThemeClass();
}
