import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { ArcanaLocale, ArcanaThemePreset, DataTableColumn, DataTableConfig, DataTableRow } from "../../../src";
import { ARCANA_THEMES, arcanaThemeClass } from "../../../src";
import { ArcanaDataTable } from "../../../src/react";
import { CodeBlock } from "./CodeBlock";
import type { Framework } from "./DocsShell";
import { fmt, useLang, type Messages } from "../i18n";

type ThemeRow = DataTableRow & {
  id: number;
  name: string;
  department: string;
  status: string;
  joinedAt: string;
  amount: number;
  score: number;
};

/* ---------- Tokens ---------- */

/**
 * The ten most visually impactful `--arcana-*` color tokens. The full set (51)
 * lives in `src/assets/ArcanaGrid.css`; the builder deliberately exposes a
 * curated subset so the sidebar stays scannable.
 */
const COLOR_TOKENS = [
  "accent",
  "surface",
  "surface-muted",
  "text",
  "text-muted",
  "border",
  "row-hover",
  "row-checked",
  "header-hover",
  "selected-bg"
] as const;

type ColorToken = (typeof COLOR_TOKENS)[number];

/** Message key of each token's tooltip (kebab token → camelCase message key). */
const COLOR_HINT_KEY: Record<ColorToken, keyof Messages["themeBuilder"]["colorHints"]> = {
  "accent": "accent",
  "surface": "surface",
  "surface-muted": "surfaceMuted",
  "text": "text",
  "text-muted": "textMuted",
  "border": "border",
  "row-hover": "rowHover",
  "row-checked": "rowChecked",
  "header-hover": "headerHover",
  "selected-bg": "selectedBg"
};

/**
 * The value each preset gives to the exposed tokens — mirrored from the
 * `.arcana-theme-*` blocks of `ArcanaGrid.css` (zinc = the file defaults).
 * Used to seed `<input type="color">` and to detect "changed from the preset".
 */
const PRESET_COLORS: Record<ArcanaThemePreset, Record<ColorToken, string>> = {
  zinc: {
    "accent": "#455a64",
    "surface": "#ffffff",
    "surface-muted": "#e9edf1",
    "text": "#263238",
    "text-muted": "#71717a",
    "border": "#dddddd",
    "row-hover": "#f5f5f5",
    "row-checked": "#e8eef5",
    "header-hover": "#d4dce5",
    "selected-bg": "#18181b"
  },
  ocean: {
    "accent": "#0f5e79",
    "surface": "#ffffff",
    "surface-muted": "#dbe8f2",
    "text": "#123647",
    "text-muted": "#557a8e",
    "border": "#c7d9e5",
    "row-hover": "#eef5fa",
    "row-checked": "#d3e7f5",
    "header-hover": "#cadeed",
    "selected-bg": "#0f5e79"
  },
  forest: {
    "accent": "#1d6f42",
    "surface": "#ffffff",
    "surface-muted": "#e0ecdf",
    "text": "#1c3a2a",
    "text-muted": "#5b7a67",
    "border": "#ccdccb",
    "row-hover": "#f0f7f0",
    "row-checked": "#d8ecd9",
    "header-hover": "#d1e5d1",
    "selected-bg": "#1d6f42"
  },
  midnight: {
    "accent": "#3b82f6",
    "surface": "#0f172a",
    "surface-muted": "#1e293b",
    "text": "#e2e8f0",
    "text-muted": "#94a3b8",
    "border": "#2b3a52",
    "row-hover": "#253349",
    "row-checked": "#1d3a5f",
    "header-hover": "#27364f",
    "selected-bg": "#e2e8f0"
  }
};

/**
 * Sizing/typography knobs. Border radius uses the library's native
 * `--arcana-border-radius` token; the remaining knobs still drive docs-owned
 * `--tb-*` variables because the library has no public tokens for them yet.
 */
const SIZING = [
  { key: "cellPaddingY", cssVar: "--tb-cell-pad-y", min: 0, max: 24, step: 1, def: 8 },
  { key: "cellPaddingX", cssVar: "--tb-cell-pad-x", min: 0, max: 32, step: 1, def: 10 },
  { key: "rowHeight", cssVar: "--tb-row-height", min: 24, max: 72, step: 1, def: 32 },
  { key: "fontSize", cssVar: "--tb-font-size", min: 10, max: 20, step: 1, def: 12 },
  { key: "radius", cssVar: "--arcana-border-radius", min: 0, max: 20, step: 1, def: 0 }
] as const;

type SizingKey = (typeof SIZING)[number]["key"];

interface ThemeState {
  preset: ArcanaThemePreset;
  /** Only the tokens the user actually touched; anything else follows the preset. */
  colors: Partial<Record<ColorToken, string>>;
  cellPaddingY: number;
  cellPaddingX: number;
  rowHeight: number;
  fontSize: number;
  radius: number;
  codeOpen: boolean;
}

const DEFAULT_STATE: ThemeState = {
  preset: "zinc",
  colors: {},
  cellPaddingY: 8,
  cellPaddingX: 10,
  rowHeight: 32,
  fontSize: 12,
  radius: 0,
  codeOpen: false
};

const STORAGE_KEY = "arcana-docs-theme-builder";

/** Name of the class emitted in the generated CSS (and of the copied file). */
const CUSTOM_THEME_NAME = "my-theme";
const CSS_FILE = `${CUSTOM_THEME_NAME}.css`;

const HEX_RE = /^#[0-9a-f]{6}$/i;

function loadState(): ThemeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ThemeState>;
    const merged: ThemeState = { ...DEFAULT_STATE };
    (Object.keys(DEFAULT_STATE) as Array<keyof ThemeState>).forEach((key) => {
      const value = parsed[key];
      if (value !== undefined && typeof value === typeof DEFAULT_STATE[key]) {
        (merged as unknown as Record<string, unknown>)[key] = value;
      }
    });
    if (!ARCANA_THEMES.includes(merged.preset)) merged.preset = DEFAULT_STATE.preset;
    SIZING.forEach((knob) => {
      const value = merged[knob.key];
      if (!Number.isFinite(value) || value < knob.min || value > knob.max) merged[knob.key] = knob.def;
    });
    // Colors: keep only known tokens holding a `#rrggbb` string.
    const colors: Partial<Record<ColorToken, string>> = {};
    const rawColors = (parsed as Record<string, unknown>).colors;
    if (rawColors && typeof rawColors === "object" && !Array.isArray(rawColors)) {
      Object.entries(rawColors as Record<string, unknown>).forEach(([token, value]) => {
        if (COLOR_TOKENS.includes(token as ColorToken) && typeof value === "string" && HEX_RE.test(value)) colors[token as ColorToken] = value;
      });
    }
    merged.colors = colors;
    return merged;
  } catch {
    return DEFAULT_STATE;
  }
}

/* ---------- Demo data (small on purpose — the star here is the theme) ---------- */

function makeRows(msg: Messages): ThemeRow[] {
  const d = msg.demos.departments;
  const s = msg.demos.statuses;
  return [
    { id: 1, name: "Ada Lovelace", department: d.engineering, status: s.active, joinedAt: "2026-01-12", amount: 4280, score: 96 },
    { id: 2, name: "Grace Hopper", department: d.engineering, status: s.active, joinedAt: "2026-02-08", amount: 1950, score: 91 },
    { id: 3, name: "Alan Turing", department: d.research, status: s.inReview, joinedAt: "2026-03-20", amount: 8760, score: 88 },
    { id: 4, name: "Margaret Hamilton", department: d.product, status: s.active, joinedAt: "2026-04-02", amount: 2340, score: 99 },
    { id: 5, name: "Edsger Dijkstra", department: d.research, status: s.inactive, joinedAt: "2026-05-17", amount: 5150, score: 90 },
    { id: 6, name: "Katherine Johnson", department: d.product, status: s.active, joinedAt: "2026-06-09", amount: 3680, score: 97 },
    { id: 7, name: "Donald Knuth", department: d.editorial, status: s.inReview, joinedAt: "2026-07-14", amount: 6420, score: 94 },
    { id: 8, name: "Barbara Liskov", department: d.engineering, status: s.active, joinedAt: "2026-08-01", amount: 2890, score: 95 },
    { id: 9, name: "Radia Perlman", department: d.infrastructure, status: s.active, joinedAt: "2026-08-19", amount: 5940, score: 93 },
    { id: 10, name: "Dennis Ritchie", department: d.engineering, status: s.inactive, joinedAt: "2026-09-05", amount: 7310, score: 98 }
  ];
}

function makeColumns(msg: Messages): DataTableColumn<ThemeRow>[] {
  const locale = msg.meta.locale;
  return [
    { name: "name", label: msg.demos.cols.name },
    { name: "department", label: msg.demos.cols.area },
    { name: "status", label: msg.demos.cols.status },
    { name: "joinedAt", label: msg.demos.cols.joinedAt, searchType: "DATE", valueGetter: (value) => new Date(`${value}T12:00:00`).toLocaleDateString(locale) },
    { name: "amount", label: msg.demos.cols.amount, type: "CURRENCY", textAlignment: "right", searchEnabled: false, valueGetter: (value) => Number(value).toLocaleString(locale, { style: "currency", currency: "BRL" }) },
    { name: "score", label: msg.demos.cols.score, type: "NUMBER", textAlignment: "right", searchEnabled: false }
  ];
}

/* ---------- Generated CSS (always English, like the playground snippets) ---------- */

function changedColors(state: ThemeState): ColorToken[] {
  const base = PRESET_COLORS[state.preset];
  return COLOR_TOKENS.filter((token) => {
    const value = state.colors[token];
    return value !== undefined && value.toLowerCase() !== base[token].toLowerCase();
  });
}

function changedSizing(state: ThemeState): SizingKey[] {
  return SIZING.filter((knob) => state[knob.key] !== knob.def).map((knob) => knob.key);
}

function buildCss(state: ThemeState): string {
  const colors = changedColors(state);
  const sizing = changedSizing(state);
  if (colors.length === 0 && sizing.length === 0) {
    return `/* ${CSS_FILE}\n   Nothing changed yet — pick colors or move the sliders on the left\n   and the CSS for your theme shows up here, ready to copy. */`;
  }

  const lines: string[] = [
    `/* ${CSS_FILE} — generated by the Arcana Theme Builder.`,
    `   Base: the '${state.preset}' preset; only what you changed is listed. */`
  ];

  const radiusChanged = sizing.includes("radius");
  if (colors.length > 0 || radiusChanged) {
    lines.push(`.arcana-theme-${CUSTOM_THEME_NAME} {`);
    colors.forEach((token) => lines.push(`  --arcana-${token}: ${state.colors[token]};`));
    if (radiusChanged) lines.push(`  --arcana-border-radius: ${state.radius}px;`);
    lines.push("}");
  }

  const plainSizing = sizing.filter((key) => key !== "radius");
  if (plainSizing.length > 0) {
    if (colors.length > 0 || radiusChanged) lines.push("");
    lines.push("/* Remaining sizing and typography use plain rules. */");
    const padded = plainSizing.includes("cellPaddingY") || plainSizing.includes("cellPaddingX");
    if (padded || plainSizing.includes("fontSize")) {
      lines.push(`.arcana-theme-${CUSTOM_THEME_NAME} .grid-header-cell,`);
      lines.push(`.arcana-theme-${CUSTOM_THEME_NAME} .grid-cell,`);
      lines.push(`.arcana-theme-${CUSTOM_THEME_NAME} .grid-summarizer-cell {`);
      // The adapters write `padding: 8px 10px` inline on every cell.
      if (padded) lines.push(`  padding: ${state.cellPaddingY}px ${state.cellPaddingX}px !important; /* set inline by the adapters */`);
      if (plainSizing.includes("fontSize")) lines.push(`  font-size: ${state.fontSize}px;`);
      lines.push("}");
    }
    if (plainSizing.includes("rowHeight")) {
      lines.push(`.arcana-theme-${CUSTOM_THEME_NAME} .grid-row,`);
      lines.push(`.arcana-theme-${CUSTOM_THEME_NAME} .grid-cell { min-height: ${state.rowHeight}px; }`);
    }
  }

  lines.push("");
  lines.push("/* then, in your app:");
  lines.push(`   theme: '${CUSTOM_THEME_NAME}'  — per table`);
  lines.push(`   setDefaultArcanaTheme('${CUSTOM_THEME_NAME}')  — global */`);
  return lines.join("\n");
}

/* ---------- Controls (same dense inspector as the playground) ---------- */

function Row({ k, label, desc, modified, infoAria, children }: {
  k: string;
  label: string;
  desc: string;
  modified: boolean;
  infoAria: string;
  children: ReactNode;
}) {
  const tipId = `tb-tip-${k}`;
  return <div className={`pg-row${modified ? " is-mod" : ""}`}>
    <span className="pg-row-label">
      <span className="pg-row-name">{label}</span>
      <button type="button" className="pg-info" aria-label={fmt(infoAria, { label })} aria-describedby={tipId}>i</button>
      <span role="tooltip" id={tipId} className="pg-tip">{desc}</span>
    </span>
    {children}
  </div>;
}

function Section({ title }: { title: string }) {
  return <h3 className="pg-sec">{title}</h3>;
}

export function ThemeBuilder({ panelOpen }: { framework: Framework; panelOpen: boolean }) {
  const { lang, msg } = useLang();
  const [state, setState] = useState<ThemeState>(loadState);
  const t = msg.themeBuilder;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private mode */
    }
  }, [state]);

  const update = (patch: Partial<ThemeState>) => setState((prev) => ({ ...prev, ...patch }));

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode */
    }
    setState(DEFAULT_STATE);
  };

  const rows = useMemo(() => makeRows(msg), [msg]);
  const columns = useMemo(() => makeColumns(msg), [msg]);

  const config = useMemo<DataTableConfig<ThemeRow>>(() => ({
    mode: "dataset",
    dataset: rows,
    rowsPerPage: 5,
    theme: state.preset,
    // The docs languages map 1:1 onto the library locales.
    locale: lang as ArcanaLocale,
    ariaLabel: t.tableAria,
    checkboxEnabled: true,
    footerSummarizerEnabled: true,
    columns
  }), [rows, columns, state.preset, lang, t.tableAria]);

  /**
   * The wrapper carries the preset class (so it holds the whole preset palette)
   * plus the inline overrides. `.tb-stage .arcana-grid` re-inherits the exposed
   * tokens in `styles.css` — otherwise the theme class the grid puts on its own
   * root would shadow whatever we set out here.
   */
  const stageStyle = useMemo(() => {
    const style: Record<string, string> = {};
    // Every exposed token is written out (not just the overridden ones): the
    // `zinc` preset has no `.arcana-theme-zinc` rule, so the wrapper would
    // otherwise have nothing for `inherit` to pick up.
    COLOR_TOKENS.forEach((token) => { style[`--arcana-${token}`] = state.colors[token] ?? PRESET_COLORS[state.preset][token]; });
    SIZING.forEach((knob) => { style[knob.cssVar] = `${state[knob.key]}px`; });
    return style as CSSProperties;
  }, [state]);

  const generatedCss = useMemo(() => buildCss(state), [state]);

  const colorValue = (token: ColorToken) => state.colors[token] ?? PRESET_COLORS[state.preset][token];
  const isColorChanged = (token: ColorToken) => changedColors(state).includes(token);
  const clearColor = (token: ColorToken) => setState((prev) => {
    const colors = { ...prev.colors };
    delete colors[token];
    return { ...prev, colors };
  });

  const infoAria = t.infoAria;

  return <div className="playground">
    <aside className={panelOpen ? "pg-sidebar is-open" : "pg-sidebar"} id="theme-builder-panel" aria-label={t.panelAria}>
      <div className="pg-side-head">
        <span className="pg-side-title">{t.settings}</span>
        <button className="pg-reset" type="button" onClick={reset}>{t.reset}</button>
      </div>

      <div className="pg-inspector tb-inspector">
        <Section title={t.groupPreset} />
        <Row k="preset" label={t.preset} desc={t.presetHint} modified={state.preset !== DEFAULT_STATE.preset} infoAria={infoAria}>
          <div className="pg-theme-dots" role="group" aria-label={t.presetPickerAria}>
            {ARCANA_THEMES.map((name) => (
              <button key={name} type="button" className="pg-theme-pick" aria-pressed={state.preset === name} aria-label={name} title={name} onClick={() => update({ preset: name })}>
                <span className={`theme-dot theme-dot--${name}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </Row>

        <Section title={t.groupColors} />
        {COLOR_TOKENS.map((token) => (
          <Row
            key={token}
            k={token}
            label={`--arcana-${token}`}
            desc={t.colorHints[COLOR_HINT_KEY[token]]}
            modified={isColorChanged(token)}
            infoAria={infoAria}
          >
            <span className="tb-color-ctl">
              <input
                className="tb-color"
                type="color"
                aria-label={`--arcana-${token}`}
                value={colorValue(token)}
                onChange={(event) => update({ colors: { ...state.colors, [token]: event.target.value } })}
              />
              <button
                type="button"
                className="pg-msg-remove tb-color-clear"
                aria-label={fmt(t.clearColor, { token: `--arcana-${token}` })}
                disabled={!isColorChanged(token)}
                onClick={() => clearColor(token)}
              >✕</button>
            </span>
          </Row>
        ))}

        <Section title={t.groupSizing} />
        {SIZING.map((knob) => (
          <Row
            key={knob.key}
            k={knob.key}
            label={t.sizing[knob.key]}
            desc={t.sizingHints[knob.key]}
            modified={state[knob.key] !== knob.def}
            infoAria={infoAria}
          >
            <span className="tb-range-ctl">
              <input
                className="tb-range"
                type="range"
                aria-label={t.sizing[knob.key]}
                min={knob.min}
                max={knob.max}
                step={knob.step}
                value={state[knob.key]}
                onChange={(event) => update({ [knob.key]: Number(event.target.value) } as Partial<ThemeState>)}
              />
              <span className="tb-val">{state[knob.key]}px</span>
            </span>
          </Row>
        ))}
        <p className="tb-note">{t.sizingNote}</p>
      </div>
    </aside>

    <div className="pg-main">
      <div className="section-workbench pg-workbench">
        <div className="section-workbench-header">
          <span className="section-preview-caption">{t.stageCaption}</span>
          <div className="section-seg" role="tablist" aria-label={t.cssTab}>
            <button
              id="tb-preview-tab"
              type="button"
              role="tab"
              aria-selected={!state.codeOpen}
              aria-controls="tb-panel"
              onClick={() => update({ codeOpen: false })}
            >
              <svg className="seg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
              {msg.shell.previewTab}
            </button>
            <button
              id="tb-code-tab"
              type="button"
              role="tab"
              aria-selected={state.codeOpen}
              aria-controls="tb-panel"
              onClick={() => update({ codeOpen: true })}
            >
              <svg className="seg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              {t.cssTab}
            </button>
          </div>
        </div>
        <div id="tb-panel" className={`section-panel section-panel--${state.codeOpen ? "code" : "preview"}`} role="tabpanel" aria-labelledby={state.codeOpen ? "tb-code-tab" : "tb-preview-tab"}>
          {state.codeOpen
            ? <CodeBlock key={CSS_FILE} file={CSS_FILE} code={generatedCss} lang="css" />
            : <div className={`section-preview-body tb-stage ${arcanaThemeClass(state.preset)}`} style={stageStyle}>
              <ArcanaDataTable key={msg.meta.locale} config={config} />
            </div>}
        </div>
      </div>
    </div>
  </div>;
}
