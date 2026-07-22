import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang, Messages } from "./types";
import { en } from "./en";
import { pt } from "./pt";
import { es } from "./es";
import { it } from "./it";
import { zh } from "./zh";
import { ja } from "./ja";
import { de } from "./de";
import { ru } from "./ru";

export type { Lang, Messages } from "./types";

export const MESSAGES: Record<Lang, Messages> = {
  en,
  "pt-BR": pt,
  es,
  it,
  zh,
  ja,
  de,
  ru
};

/** Display order in the language switcher. */
export const LANG_ORDER: Lang[] = ["en", "pt-BR", "es", "it", "zh", "ja", "de", "ru"];

const LANG_KEY = "arcana-docs-lang";
const DEFAULT_LANG: Lang = "en";

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored && stored in MESSAGES ? (stored as Lang) : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

interface LangContextValue {
  lang: Lang;
  msg: Messages;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* private mode */
    }
    document.documentElement.lang = MESSAGES[lang].meta.htmlLang;
  }, [lang]);

  const value = useMemo<LangContextValue>(() => ({ lang, msg: MESSAGES[lang], setLang }), [lang]);
  return createElement(LangContext.Provider, { value }, children);
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** Replaces {placeholders} in a message template. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

const RICH_RE = /<(c|b|i)>([\s\S]*?)<\/\1>/g;
const RICH_TAG: Record<string, { tag: string; className?: string }> = {
  c: { tag: "code", className: "inline" },
  b: { tag: "strong" },
  i: { tag: "em" }
};

/**
 * Mini renderer for the inline markup allowed in messages:
 * <c>code</c>, <b>strong</b> and <i>emphasis</i>. Anything else is plain text.
 */
export function rich(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  RICH_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = RICH_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const meta = RICH_TAG[match[1]];
    nodes.push(createElement(meta.tag, { key: key++, className: meta.className }, match[2]));
    last = RICH_RE.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
