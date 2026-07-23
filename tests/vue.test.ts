import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { ArcanaDataTable } from "../src/vue";

describe("Vue adapter", () => {
  it("renders rows and preserves the exposed SparkGrid methods", async () => {
    const checked = vi.fn();
    const selectionStyle = vi.fn(() => ({ background: "#e2f4ed" }));
    const wrapper = mount(ArcanaDataTable, { props: { config: { sendRequestOnMounted: false, checkboxEnabled: true, rowFocusEnabled: true, cellFocusEnabled: true, columns: [{ name: "name", label: "Nome" }], onRowChecked: checked, onBeforeCheckboxAndRadioButtonStyleMounted: selectionStyle } } });
    wrapper.vm.setRows([{ id: 1, name: "Ada" }]);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Ada");
    await wrapper.find('.grid-cell:not(.arcana-grid-selection-cell)').trigger("click");
    expect(wrapper.find(".grid-body .grid-row").classes()).toContain("grid-row-focused");
    expect(wrapper.find('.grid-cell:not(.arcana-grid-selection-cell)').classes()).toContain("grid-cell-focused");
    expect(selectionStyle).toHaveBeenCalled();
    await wrapper.find('input[aria-label="Selecionar linha"]').setValue(true);
    expect(checked).toHaveBeenCalledOnce();
  });

  it("renders the expander chevron and toggles a sync detail area", async () => {
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: (row) => `<em>Detalhes de ${row.name}</em>`
    } } });
    await wrapper.vm.$nextTick();
    const toggle = wrapper.find('button[aria-label="Expandir detalhes"]');
    expect(toggle.exists()).toBe(true);
    expect(toggle.attributes("aria-expanded")).toBe("false");
    await toggle.trigger("click");
    expect(wrapper.find(".grid-detail-cell").text()).toContain("Detalhes de Ada");
    expect(wrapper.find('button[aria-label="Recolher detalhes"]').attributes("aria-expanded")).toBe("true");
    await wrapper.find('button[aria-label="Recolher detalhes"]').trigger("click");
    expect(wrapper.find(".grid-detail-row").exists()).toBe(false);
    wrapper.vm.expandRow(wrapper.vm.getRows()[0]._uuid!);
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".grid-detail-cell").text()).toContain("Detalhes de Ada");
    expect(wrapper.vm.getExpandedRows()).toHaveLength(1);
    wrapper.vm.collapseRow(wrapper.vm.getRows()[0]._uuid!);
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".grid-detail-row").exists()).toBe(false);
  });

  it("shows the built-in loading state until the async renderer resolves", async () => {
    let resolveDetail!: (value: unknown) => void;
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: () => new Promise((resolve) => { resolveDetail = resolve; })
    } } });
    await wrapper.vm.$nextTick();
    await wrapper.find('button[aria-label="Expandir detalhes"]').trigger("click");
    expect(wrapper.find(".grid-detail-loading").exists()).toBe(true);
    expect(wrapper.find(".grid-detail-cell").text()).toContain("Carregando detalhes…");
    resolveDetail("<strong>Conteúdo async</strong>");
    await new Promise((resolve) => setTimeout(resolve));
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".grid-detail-cell").text()).toContain("Conteúdo async");
    expect(wrapper.find(".grid-detail-loading").exists()).toBe(false);
  });

  it("builds a multi-column sort with shift-click and resizes a column by drag", async () => {
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", searchEnabled: false, footerVisible: false, cellMinWidth: 80,
      dataset: [{ id: 1, name: "B", amount: 2 }, { id: 2, name: "A", amount: 1 }, { id: 3, name: "B", amount: 1 }],
      columns: [{ name: "name", label: "Name" }, { name: "amount", label: "Amount", type: "NUMBER" }]
    } } });
    await wrapper.vm.$nextTick();
    const headers = wrapper.findAll(".grid-header-cell.grid-header-order");
    await headers[0].trigger("click", { shiftKey: true }); // name asc
    await headers[1].trigger("click", { shiftKey: true }); // + amount asc
    const badges = wrapper.findAll(".arcana-sort-priority");
    expect(badges.map((badge) => badge.text())).toEqual(["1", "2"]);
    expect(headers[0].attributes("aria-sort")).toBe("ascending");
    expect(wrapper.find(".grid-body .grid-row .grid-cell").text()).toBe("A");

    // Drag the first column's resize handle: 0 (rect) + 150 delta = 150px.
    await headers[0].find(".arcana-col-resizer").trigger("pointerdown", { clientX: 100 });
    const move = new Event("pointermove"); (move as unknown as { clientX: number }).clientX = 250; window.dispatchEvent(move);
    window.dispatchEvent(new Event("pointerup"));
    await wrapper.vm.$nextTick();
    expect((wrapper.findAll(".grid-header-cell.grid-header-order")[0].element as HTMLElement).style.width).toBe("150px");
  });

  it("reorders columns live while dragging a header and cancels with Escape", async () => {
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, a: "1", b: "2", c: "3" }],
      columns: [{ name: "a", label: "A" }, { name: "b", label: "B" }, { name: "c", label: "C" }]
    } } });
    await wrapper.vm.$nextTick();
    const order = () => wrapper.findAll(".grid-header [data-col-name]").map((cell) => cell.attributes("data-col-name"));
    expect(order()).toEqual(["a", "b", "c"]);
    await wrapper.find('[data-col-name="a"]').trigger("pointerdown", { clientX: 10, clientY: 5, button: 0 });
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 200, clientY: 5 }));
    await wrapper.vm.$nextTick();
    // Live reorder: zero-sized rects put every midpoint left of the pointer,
    // so "a" moves to the end DURING the drag — no drop needed.
    expect(order()).toEqual(["b", "c", "a"]);
    expect(wrapper.find('[data-col-name="a"]').classes()).toContain("arcana-col-dragging");
    expect(document.body.querySelector(".arcana-drag-ghost")).toBeTruthy();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();
    expect(order()).toEqual(["a", "b", "c"]);
    expect(document.body.querySelector(".arcana-drag-ghost")).toBeNull();
    window.dispatchEvent(new MouseEvent("pointerup", { clientX: 200, clientY: 5 }));
  });

  it("escapes raw cell values as text (no HTML injection without column.html)", async () => {
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, name: "<img src=x onerror=\"window.__xssVue=1\">" }],
      columns: [{ name: "name", label: "Name" }]
    } } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".grid-body img").exists()).toBe(false);
    expect(wrapper.find(".grid-body .grid-cell").text()).toContain("<img src=x onerror=");
    expect((window as unknown as { __xssVue?: number }).__xssVue).toBeUndefined();
  });

  it("renders HTML from a valueGetter only when the column opts in with html: true", async () => {
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", html: true, valueGetter: (value: unknown) => `<span class="pill">${String(value)}</span>` }]
    } } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".grid-body .pill").exists()).toBe(true);
    expect(wrapper.find(".grid-body .pill").text()).toBe("ok");
  });

  it("renders a valueGetter string as text by default (no html flag)", async () => {
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", valueGetter: (value: unknown) => `<span class="pill">${String(value)}</span>` }]
    } } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".grid-body .pill").exists()).toBe(false);
    expect(wrapper.find(".grid-body .grid-cell").text()).toBe('<span class="pill">ok</span>');
  });

  it("localizes the built-in strings with locale: 'en' and honors messages overrides", async () => {
    const rows = Array.from({ length: 7 }, (_, index) => ({ id: index + 1, name: `Person ${index + 1}` }));
    const wrapper = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", dataset: rows, rowsPerPage: 5, locale: "en", checkboxEnabled: true,
      actions: [{ element: () => "<button>Go</button>" }],
      columns: [{ name: "name", label: "Name" }]
    } } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".arcana-grid__info").text()).toBe("Showing 1 to 5 of 7");
    expect(wrapper.find(".arcana-grid__per-page").text()).toContain("Per page:");
    expect(wrapper.find(".grid-header").text()).toContain("Actions");
    expect(wrapper.find('input[aria-label="Select all"]').exists()).toBe(true);
    expect(wrapper.find('input[aria-label="Filter Name"]').exists()).toBe(true);
    await wrapper.find(".grid-header-cell.grid-header-order").trigger("click");
    const sortMenu = wrapper.find(".arcana-sort-menu");
    expect(sortMenu.attributes("aria-label")).toBe("Sorting");
    expect(sortMenu.text()).toContain("Ascending");
    expect(sortMenu.text()).toContain("Descending");

    const custom = mount(ArcanaDataTable, { props: { config: {
      mode: "dataset", dataset: [], searchEnabled: false, locale: "en",
      messages: { empty: "Nothing to see here" },
      columns: [{ name: "name", label: "Name" }]
    } } });
    await custom.vm.$nextTick();
    expect(custom.find(".arcana-grid-status").text()).toBe("Nothing to see here");
  });
});
