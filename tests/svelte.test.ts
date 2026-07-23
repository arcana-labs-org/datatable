import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DataTableConfig } from "../src";
import { ArcanaDataTable, type ArcanaDataTableExports } from "../src/svelte";

let cleanups: Array<() => void> = [];

function renderTable(config: DataTableConfig) {
  const target = document.createElement("div");
  document.body.appendChild(target);
  const component = mount(ArcanaDataTable, { target, props: { config } }) as ArcanaDataTableExports;
  flushSync();
  cleanups.push(() => { unmount(component); target.remove(); });
  return { target, component };
}

const click = (element: Element | null) => {
  element?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  flushSync();
};

afterEach(() => {
  cleanups.forEach((cleanup) => cleanup());
  cleanups = [];
});

describe("Svelte adapter", () => {
  it("renders rows and exposes the imperative grid API", () => {
    const checked = vi.fn();
    const selectionStyle = vi.fn(() => ({ background: "#e2f4ed" }));
    const { target, component } = renderTable({
      sendRequestOnMounted: false, searchEnabled: false, checkboxEnabled: true,
      rowFocusEnabled: true, cellFocusEnabled: true,
      columns: [{ name: "name", label: "Nome" }],
      datasource: () => [{ id: 1, name: "Ada" }],
      onRowChecked: checked,
      onBeforeCheckboxAndRadioButtonStyleMounted: selectionStyle
    });
    component.setRows([{ id: 1, name: "Ada" }]);
    flushSync();
    expect(target.textContent).toContain("Ada");
    const cell = target.querySelector(".grid-body .grid-cell:not(.spark-grid-selection-cell)");
    click(cell);
    expect(target.querySelector(".grid-body .grid-row")?.classList.contains("grid-row-focused")).toBe(true);
    expect(cell?.classList.contains("grid-cell-focused")).toBe(true);
    expect(selectionStyle).toHaveBeenCalled();
    const checkbox = target.querySelector<HTMLInputElement>('.grid-body input[aria-label="Selecionar linha"]')!;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    flushSync();
    expect(checked).toHaveBeenCalledOnce();
    expect(component.getCheckedRows()).toHaveLength(1);
  });

  it("opens the sort menu and applies Crescente/Decrescente/Remover ordem", async () => {
    const { target, component } = renderTable({
      mode: "dataset",
      dataset: [{ id: 2, name: "Grace" }, { id: 1, name: "Ada" }],
      searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }]
    });
    await Promise.resolve();
    flushSync();
    click(target.querySelector(".grid-header-cell.grid-header-order"));
    const sortMenu = target.querySelector(".arcana-sort-menu");
    expect(sortMenu).toBeTruthy();
    const buttons = Array.from(sortMenu!.querySelectorAll("button")).map((button) => button.textContent?.trim());
    expect(buttons).toEqual(["Crescente", "Decrescente"]);
    click(sortMenu!.querySelectorAll("button")[0]);
    await Promise.resolve();
    flushSync();
    expect(component.getApi().orderBy).toEqual({ name: "name", direction: "asc" });
    expect(target.querySelector(".grid-body .grid-cell")?.textContent).toContain("Ada");
    // re-open: current direction is highlighted and "Remover ordem" appears
    click(target.querySelector(".grid-header-cell.grid-header-order"));
    const reopened = target.querySelector(".arcana-sort-menu")!;
    expect(reopened.querySelector("button.is-active")?.textContent).toContain("Crescente");
    const clearButton = reopened.querySelector(".arcana-sort-menu__clear");
    expect(clearButton?.textContent).toContain("Remover ordem");
    click(clearButton);
    await Promise.resolve();
    flushSync();
    expect(component.getApi().orderBy).toBeUndefined();
    expect(target.querySelector(".grid-body .grid-cell")?.textContent).toContain("Grace");
  });

  it("renders the expander chevron and toggles a sync detail area", async () => {
    const { target, component } = renderTable({
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: (row) => `<em>Detalhes de ${row.name}</em>`
    });
    await Promise.resolve();
    flushSync();
    const toggle = target.querySelector('button[aria-label="Expandir detalhes"]');
    expect(toggle).toBeTruthy();
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    click(toggle);
    expect(target.querySelector(".grid-detail-cell")?.textContent).toContain("Detalhes de Ada");
    expect(target.querySelector('button[aria-label="Recolher detalhes"]')?.getAttribute("aria-expanded")).toBe("true");
    click(target.querySelector('button[aria-label="Recolher detalhes"]'));
    expect(target.querySelector(".grid-detail-row")).toBeNull();
    component.expandRow(component.getRows()[0]._uuid!);
    flushSync();
    expect(target.querySelector(".grid-detail-cell")?.textContent).toContain("Detalhes de Ada");
    expect(component.getExpandedRows()).toHaveLength(1);
    component.collapseRow(component.getRows()[0]._uuid!);
    flushSync();
    expect(target.querySelector(".grid-detail-row")).toBeNull();
  });

  it("shows the built-in loading state until the async renderer resolves", async () => {
    let resolveDetail!: (value: unknown) => void;
    const { target } = renderTable({
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: () => new Promise((resolve) => { resolveDetail = resolve; })
    });
    await Promise.resolve();
    flushSync();
    click(target.querySelector('button[aria-label="Expandir detalhes"]'));
    expect(target.querySelector(".grid-detail-loading")).toBeTruthy();
    expect(target.querySelector(".grid-detail-cell")?.textContent).toContain("Carregando detalhes…");
    resolveDetail("<strong>Conteúdo async</strong>");
    await new Promise((resolve) => setTimeout(resolve));
    flushSync();
    expect(target.querySelector(".grid-detail-cell")?.textContent).toContain("Conteúdo async");
    expect(target.querySelector(".grid-detail-loading")).toBeNull();
  });

  it("renders a config-pinned column as sticky and pins another via the header menu", async () => {
    const { target } = renderTable({
      mode: "dataset", searchEnabled: false, footerVisible: false, overflowEnabled: true,
      dataset: [{ id: 1, a: "1", b: "2", c: "3" }],
      columns: [{ name: "a", label: "A", width: 120, pinned: "left" }, { name: "b", label: "B", width: 200 }, { name: "c", label: "C", width: 200 }]
    });
    await Promise.resolve();
    flushSync();
    const order = () => Array.from(target.querySelectorAll(".grid-header [data-col-name]")).map((cell) => cell.getAttribute("data-col-name"));
    // "a" is left-pinned so it leads and sticks.
    expect(order()).toEqual(["a", "b", "c"]);
    const pinnedHeader = target.querySelector<HTMLElement>('.grid-header [data-col-name="a"]')!;
    expect(pinnedHeader.classList.contains("arcana-pin-left")).toBe(true);
    expect(pinnedHeader.style.position).toBe("sticky");

    // Pin "c" to the right through the header menu → it groups to the end.
    click(target.querySelector('[data-col-name="c"]'));
    const pinRight = Array.from(target.querySelectorAll<HTMLButtonElement>(".arcana-pin-menu button")).find((button) => button.textContent?.includes("Fixar à direita"))!;
    expect(pinRight).toBeTruthy();
    click(pinRight);
    expect(order()).toEqual(["a", "b", "c"]);
    expect(target.querySelector<HTMLElement>('.grid-header [data-col-name="c"]')!.classList.contains("arcana-pin-right")).toBe(true);
  });

  it("escapes raw cell values as text (no HTML injection without column.html)", () => {
    const { target } = renderTable({
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, name: "<img src=x onerror=\"window.__xssSvelte=1\">" }],
      columns: [{ name: "name", label: "Name" }]
    });
    flushSync();
    expect(target.querySelector(".grid-body img")).toBeNull();
    expect(target.querySelector(".grid-body .grid-cell")?.textContent).toContain("<img src=x onerror=");
    expect((window as unknown as { __xssSvelte?: number }).__xssSvelte).toBeUndefined();
  });

  it("renders HTML from a valueGetter only when the column opts in with html: true", () => {
    const { target } = renderTable({
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", html: true, valueGetter: (value) => `<span class="pill">${String(value)}</span>` }]
    });
    flushSync();
    expect(target.querySelector(".grid-body .pill")?.textContent).toBe("ok");
  });

  it("renders a valueGetter string as text by default (no html flag)", () => {
    const { target } = renderTable({
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", valueGetter: (value) => `<span class="pill">${String(value)}</span>` }]
    });
    flushSync();
    expect(target.querySelector(".grid-body .pill")).toBeNull();
    expect(target.querySelector(".grid-body .grid-cell")?.textContent).toBe('<span class="pill">ok</span>');
  });

  it("localizes the built-in strings with locale: 'en' and honors messages overrides", async () => {
    const rows = Array.from({ length: 7 }, (_, index) => ({ id: index + 1, name: `Person ${index + 1}` }));
    const { target } = renderTable({
      mode: "dataset", dataset: rows, rowsPerPage: 5, locale: "en", checkboxEnabled: true,
      actions: [{ element: () => "<button>Go</button>" }],
      columns: [{ name: "name", label: "Name" }]
    });
    await Promise.resolve();
    flushSync();
    expect(target.querySelector(".spark-grid__info")?.textContent).toBe("Showing 1 to 5 of 7");
    expect(target.querySelector(".spark-grid__per-page")?.textContent).toContain("Per page:");
    expect(target.querySelector(".grid-header")?.textContent).toContain("Actions");
    expect(target.querySelector('input[aria-label="Select all"]')).toBeTruthy();
    expect(target.querySelector('input[aria-label="Filter Name"]')).toBeTruthy();
    click(target.querySelector(".grid-header-cell.grid-header-order"));
    const sortMenu = target.querySelector(".arcana-sort-menu")!;
    expect(sortMenu.getAttribute("aria-label")).toBe("Sorting");
    const labels = Array.from(sortMenu.querySelectorAll("button")).map((button) => button.textContent?.trim());
    expect(labels).toEqual(["Ascending", "Descending"]);

    const { target: custom } = renderTable({
      mode: "dataset", dataset: [], searchEnabled: false, locale: "en",
      messages: { empty: "Nothing to see here" },
      columns: [{ name: "name", label: "Name" }]
    });
    await Promise.resolve();
    flushSync();
    expect(custom.querySelector(".arcana-grid-status")?.textContent).toBe("Nothing to see here");
  });
});
