import { afterEach, describe, expect, it } from "vitest";
import {
  ARCANA_LOCALES, ARCANA_MESSAGES, arcanaMonthLabels, arcanaMonthLabelsShort, arcanaWeekdayLabels,
  formatMessage, getDefaultArcanaLocale, resolveArcanaLocale, resolveArcanaMessages, setDefaultArcanaLocale
} from "../src";
import { MONTH_LABELS, MONTH_LABELS_SHORT, WEEKDAY_LABELS } from "../src/core/calendar";

afterEach(() => setDefaultArcanaLocale("pt-BR"));

describe("locale packs", () => {
  it("ships the 8 locales with complete, parity-checked packs", () => {
    expect(ARCANA_LOCALES).toEqual(["pt-BR", "en", "es", "it", "zh", "ja", "de", "ru"]);
    const referenceKeys = Object.keys(ARCANA_MESSAGES["pt-BR"]).sort();
    for (const locale of ARCANA_LOCALES) {
      expect(Object.keys(ARCANA_MESSAGES[locale]).sort(), locale).toEqual(referenceKeys);
      for (const value of Object.values(ARCANA_MESSAGES[locale])) expect(value).toBeTruthy();
    }
  });

  it("keeps pt-BR as the historical default strings", () => {
    const messages = resolveArcanaMessages({});
    expect(getDefaultArcanaLocale()).toBe("pt-BR");
    expect(messages.empty).toBe("Nenhum registro encontrado.");
    expect(messages.perPage).toBe("Por página:");
    expect(messages.showingRange).toBe("Exibindo {from} a {to} de {total}");
    expect(messages.sortClear).toBe("Remover ordem");
  });

  it("exposes the expected en pack", () => {
    const en = ARCANA_MESSAGES.en;
    expect(en.perPage).toBe("Per page:");
    expect(en.sortAscending).toBe("Ascending");
    expect(en.sortDescending).toBe("Descending");
    expect(en.sortClear).toBe("Clear sorting");
    expect(en.pinLeft).toBe("Pin to left");
    expect(en.pinRight).toBe("Pin to right");
    expect(en.unpin).toBe("Unpin");
    expect(formatMessage(en.showingRange, { from: 1, to: 5, total: 160 })).toBe("Showing 1 to 5 of 160");
  });

  it("exposes the expected zh pack", () => {
    const zh = ARCANA_MESSAGES.zh;
    expect(zh.booleanYes).toBe("是");
    expect(zh.booleanNo).toBe("否");
    expect(formatMessage(zh.showingRange, { from: 1, to: 10, total: 30 })).toBe("显示第 1 至 10 条，共 30 条");
  });
});

describe("formatMessage", () => {
  it("replaces every placeholder and leaves unknown tokens intact", () => {
    expect(formatMessage("Showing {from} to {to} of {total}", { from: 11, to: 20, total: 42 })).toBe("Showing 11 to 20 of 42");
    expect(formatMessage("{count} selected", { count: 3 })).toBe("3 selected");
    expect(formatMessage("Filter {label} {missing}", { label: "Name" })).toBe("Filter Name {missing}");
  });
});

describe("resolveArcanaMessages precedence", () => {
  it("messages > locale > global default", () => {
    setDefaultArcanaLocale("es");
    // global default only
    expect(resolveArcanaMessages({}).empty).toBe(ARCANA_MESSAGES.es.empty);
    expect(resolveArcanaLocale({})).toBe("es");
    // config.locale wins over the global default
    expect(resolveArcanaMessages({ locale: "en" }).empty).toBe("No records found.");
    expect(resolveArcanaLocale({ locale: "en" })).toBe("en");
    // config.messages wins over both, key by key
    const resolved = resolveArcanaMessages({ locale: "en", messages: { empty: "Nothing here" } });
    expect(resolved.empty).toBe("Nothing here");
    expect(resolved.perPage).toBe("Per page:");
  });

  it("accepts a partial messages override without a locale", () => {
    const resolved = resolveArcanaMessages({ messages: { sortClear: "Zerar" } });
    expect(resolved.sortClear).toBe("Zerar");
    expect(resolved.sortAscending).toBe("Crescente");
  });

  it("setDefaultArcanaLocale drives every grid without its own locale", () => {
    setDefaultArcanaLocale("de");
    expect(getDefaultArcanaLocale()).toBe("de");
    expect(resolveArcanaMessages().actions).toBe("Aktionen");
  });
});

describe("calendar display names", () => {
  it("keeps the hand-written pt-BR labels (backward compat)", () => {
    expect(arcanaMonthLabels("pt-BR")).toBe(MONTH_LABELS);
    expect(arcanaMonthLabelsShort("pt-BR")).toBe(MONTH_LABELS_SHORT);
    expect(arcanaWeekdayLabels("pt-BR")).toBe(WEEKDAY_LABELS);
  });

  it("derives en month names from Intl", () => {
    const months = arcanaMonthLabels("en");
    expect(months[0]).toBe("January");
    expect(months[11]).toBe("December");
    expect(arcanaMonthLabelsShort("en")[0]).toBe("Jan");
    expect(arcanaWeekdayLabels("en")).toEqual(["S", "M", "T", "W", "T", "F", "S"]);
  });

  it("maps zh to zh-CN for Intl", () => {
    expect(arcanaMonthLabels("zh")[0]).toBe("一月");
    expect(arcanaWeekdayLabels("ja")).toEqual(["日", "月", "火", "水", "木", "金", "土"]);
  });

  it("strips the trailing dot from short month names (de)", () => {
    for (const label of arcanaMonthLabelsShort("de")) expect(label.endsWith(".")).toBe(false);
  });
});
