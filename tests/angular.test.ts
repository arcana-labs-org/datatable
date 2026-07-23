/**
 * Angular adapter tests: the shipped package is AOT (partial) compiled by
 * `ngc`, but here the components run through Angular's JIT compiler
 * (`@angular/compiler` import below) so TestBed can compile the inline
 * templates inside vitest. Zoneless change detection keeps zone.js out.
 */
import "@angular/compiler";
import { provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { DataTableApi, DataTableConfig } from "../src";
import { ArcanaDataTableComponent } from "../src/angular";

beforeAll(() => {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
});

async function renderTable(config: DataTableConfig) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [ArcanaDataTableComponent],
    providers: [provideZonelessChangeDetection()]
  });
  const fixture = TestBed.createComponent(ArcanaDataTableComponent);
  fixture.componentRef.setInput("config", config);
  await fixture.whenStable();
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  return { fixture, element, api: fixture.componentInstance.api as DataTableApi };
}

const click = (element: Element | null) => {
  element?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};

describe("Angular adapter", () => {
  it("renders rows and exposes the imperative grid API", async () => {
    const checked = vi.fn();
    const selectionStyle = vi.fn(() => ({ background: "#e2f4ed" }));
    const { fixture, element, api } = await renderTable({
      sendRequestOnMounted: false, searchEnabled: false, checkboxEnabled: true,
      rowFocusEnabled: true, cellFocusEnabled: true,
      columns: [{ name: "name", label: "Nome" }],
      datasource: () => [{ id: 1, name: "Ada" }],
      onRowChecked: checked,
      onBeforeCheckboxAndRadioButtonStyleMounted: selectionStyle
    });
    api.setRows([{ id: 1, name: "Ada" }]);
    fixture.detectChanges();
    expect(element.textContent).toContain("Ada");
    const cell = element.querySelector(".grid-body .grid-cell:not(.spark-grid-selection-cell)");
    click(cell);
    fixture.detectChanges();
    expect(element.querySelector(".grid-body .grid-row")?.classList.contains("grid-row-focused")).toBe(true);
    expect(cell?.classList.contains("grid-cell-focused")).toBe(true);
    expect(selectionStyle).toHaveBeenCalled();
    const checkbox = element.querySelector<HTMLInputElement>('.grid-body input[aria-label="Selecionar linha"]')!;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    fixture.detectChanges();
    expect(checked).toHaveBeenCalledOnce();
    expect(api.getCheckedRows()).toHaveLength(1);
  });

  it("opens the sort menu and applies Crescente/Decrescente/Remover ordem", async () => {
    const { fixture, element, api } = await renderTable({
      mode: "dataset",
      dataset: [{ id: 2, name: "Grace" }, { id: 1, name: "Ada" }],
      searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }]
    });
    await fixture.whenStable();
    fixture.detectChanges();
    click(element.querySelector(".grid-header-cell.grid-header-order"));
    fixture.detectChanges();
    const sortMenu = element.querySelector(".arcana-sort-menu");
    expect(sortMenu).toBeTruthy();
    const labels = Array.from(sortMenu!.querySelectorAll("button")).map((button) => button.textContent?.trim());
    expect(labels).toEqual(["Crescente", "Decrescente"]);
    click(sortMenu!.querySelectorAll("button")[0]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.orderBy).toEqual({ name: "name", direction: "asc" });
    expect(element.querySelector(".grid-body .grid-cell")?.textContent).toContain("Ada");
    // re-open: current direction is highlighted and "Remover ordem" appears
    click(element.querySelector(".grid-header-cell.grid-header-order"));
    fixture.detectChanges();
    const reopened = element.querySelector(".arcana-sort-menu")!;
    expect(reopened.querySelector("button.is-active")?.textContent).toContain("Crescente");
    const clearButton = reopened.querySelector(".arcana-sort-menu__clear");
    expect(clearButton?.textContent).toContain("Remover ordem");
    click(clearButton);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.orderBy).toBeUndefined();
    expect(element.querySelector(".grid-body .grid-cell")?.textContent).toContain("Grace");
  });

  it("renders the expander chevron and toggles a sync detail area", async () => {
    const { fixture, element, api } = await renderTable({
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: (row) => `<em>Detalhes de ${row.name}</em>`
    });
    await fixture.whenStable();
    fixture.detectChanges();
    const toggle = element.querySelector('button[aria-label="Expandir detalhes"]');
    expect(toggle).toBeTruthy();
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    click(toggle);
    fixture.detectChanges();
    expect(element.querySelector(".grid-detail-cell")?.textContent).toContain("Detalhes de Ada");
    expect(element.querySelector('button[aria-label="Recolher detalhes"]')?.getAttribute("aria-expanded")).toBe("true");
    click(element.querySelector('button[aria-label="Recolher detalhes"]'));
    fixture.detectChanges();
    expect(element.querySelector(".grid-detail-row")).toBeNull();
    api.expandRow(api.getRows()[0]._uuid!);
    fixture.detectChanges();
    expect(element.querySelector(".grid-detail-cell")?.textContent).toContain("Detalhes de Ada");
    expect(api.getExpandedRows()).toHaveLength(1);
    api.collapseRow(api.getRows()[0]._uuid!);
    fixture.detectChanges();
    expect(element.querySelector(".grid-detail-row")).toBeNull();
  });

  it("shows the built-in loading state until the async renderer resolves", async () => {
    let resolveDetail!: (value: unknown) => void;
    const { fixture, element } = await renderTable({
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: () => new Promise((resolve) => { resolveDetail = resolve; })
    });
    await fixture.whenStable();
    fixture.detectChanges();
    click(element.querySelector('button[aria-label="Expandir detalhes"]'));
    fixture.detectChanges();
    expect(element.querySelector(".grid-detail-loading")).toBeTruthy();
    expect(element.querySelector(".grid-detail-cell")?.textContent).toContain("Carregando detalhes…");
    resolveDetail("<strong>Conteúdo async</strong>");
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
    expect(element.querySelector(".grid-detail-cell")?.textContent).toContain("Conteúdo async");
    expect(element.querySelector(".grid-detail-loading")).toBeNull();
  });

  it("escapes raw cell values as text (no HTML injection without column.html)", async () => {
    const { element } = await renderTable({
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, name: "<img src=x onerror=\"window.__xssNg=1\">" }],
      columns: [{ name: "name", label: "Name" }]
    });
    expect(element.querySelector(".grid-body img")).toBeNull();
    expect(element.querySelector(".grid-body .grid-cell")?.textContent).toContain("<img src=x onerror=");
    expect((window as unknown as { __xssNg?: number }).__xssNg).toBeUndefined();
  });

  it("renders HTML from a valueGetter only when the column opts in with html: true", async () => {
    const { element } = await renderTable({
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", html: true, valueGetter: (value) => `<span class="pill">${String(value)}</span>` }]
    });
    expect(element.querySelector(".grid-body .pill")?.textContent).toBe("ok");
  });

  it("renders a valueGetter string as text by default (no html flag)", async () => {
    const { element } = await renderTable({
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", valueGetter: (value) => `<span class="pill">${String(value)}</span>` }]
    });
    expect(element.querySelector(".grid-body .pill")).toBeNull();
    expect(element.querySelector(".grid-body .grid-cell")?.textContent).toBe('<span class="pill">ok</span>');
  });

  it("localizes the built-in strings with locale: 'en' and honors messages overrides", async () => {
    const rows = Array.from({ length: 7 }, (_, index) => ({ id: index + 1, name: `Person ${index + 1}` }));
    const { fixture, element } = await renderTable({
      mode: "dataset", dataset: rows, rowsPerPage: 5, locale: "en", checkboxEnabled: true,
      actions: [{ element: () => "<button>Go</button>" }],
      columns: [{ name: "name", label: "Name" }]
    });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.querySelector(".spark-grid__info")?.textContent).toBe("Showing 1 to 5 of 7");
    expect(element.querySelector(".spark-grid__per-page")?.textContent).toContain("Per page:");
    expect(element.querySelector(".grid-header")?.textContent).toContain("Actions");
    expect(element.querySelector('input[aria-label="Select all"]')).toBeTruthy();
    expect(element.querySelector('input[aria-label="Filter Name"]')).toBeTruthy();
    click(element.querySelector(".grid-header-cell.grid-header-order"));
    fixture.detectChanges();
    const sortMenu = element.querySelector(".arcana-sort-menu")!;
    expect(sortMenu.getAttribute("aria-label")).toBe("Sorting");
    const labels = Array.from(sortMenu.querySelectorAll("button")).map((button) => button.textContent?.trim());
    expect(labels).toEqual(["Ascending", "Descending"]);

    const { fixture: customFixture, element: custom } = await renderTable({
      mode: "dataset", dataset: [], searchEnabled: false, locale: "en",
      messages: { empty: "Nothing to see here" },
      columns: [{ name: "name", label: "Name" }]
    });
    await customFixture.whenStable();
    customFixture.detectChanges();
    expect(custom.querySelector(".arcana-grid-status")?.textContent).toBe("Nothing to see here");
  });
});
