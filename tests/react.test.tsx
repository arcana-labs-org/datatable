import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import type { DataTableApi } from "../src";
import { ArcanaDataTable } from "../src/react";

describe("React adapter", () => {
  it("renders rows and exposes the imperative grid API", () => {
    const checked = vi.fn();
    const selectionStyle = vi.fn(() => ({ background: "#e2f4ed" }));
    const ref = createRef<DataTableApi>();
    const { container } = render(<ArcanaDataTable ref={ref} config={{ sendRequestOnMounted: false, searchEnabled: false, checkboxEnabled: true, rowFocusEnabled: true, cellFocusEnabled: true, columns: [{ name: "name", label: "Nome" }], datasource: () => [{ id: 1, name: "Ada" }], onRowChecked: checked, onBeforeCheckboxAndRadioButtonStyleMounted: selectionStyle }} />);
    act(() => { ref.current?.setRows([{ id: 1, name: "Ada" }]); });
    expect(screen.getByText("Ada")).toBeTruthy();
    fireEvent.click(screen.getByText("Ada"));
    expect(container.querySelector(".grid-body .grid-row")?.classList.contains("grid-row-focused")).toBe(true);
    expect(screen.getByText("Ada").closest(".grid-cell")?.classList.contains("grid-cell-focused")).toBe(true);
    expect(selectionStyle).toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText("Selecionar linha"));
    expect(checked).toHaveBeenCalledOnce();
  });

  it("renders the expander chevron and toggles a sync detail area", () => {
    const ref = createRef<DataTableApi>();
    render(<ArcanaDataTable ref={ref} config={{
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: (row) => <div>Detalhes de {String(row.name)}</div>
    }} />);
    const toggle = screen.getByLabelText("Expandir detalhes");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(screen.getByText("Detalhes de Ada")).toBeTruthy();
    expect(screen.getByLabelText("Recolher detalhes").getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByLabelText("Recolher detalhes"));
    expect(screen.queryByText("Detalhes de Ada")).toBeNull();
    act(() => { ref.current?.expandRow(ref.current.getRows()[0]._uuid!); });
    expect(screen.getByText("Detalhes de Ada")).toBeTruthy();
    expect(ref.current?.getExpandedRows()).toHaveLength(1);
    act(() => { ref.current?.collapseRow(ref.current.getRows()[0]._uuid!); });
    expect(screen.queryByText("Detalhes de Ada")).toBeNull();
  });

  it("shows the built-in loading state until the async renderer resolves", async () => {
    let resolveDetail!: (value: unknown) => void;
    render(<ArcanaDataTable config={{
      mode: "dataset", dataset: [{ id: 1, name: "Ada" }], searchEnabled: false,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: () => new Promise((resolve) => { resolveDetail = resolve; })
    }} />);
    fireEvent.click(screen.getByLabelText("Expandir detalhes"));
    expect(screen.getByText("Carregando detalhes…")).toBeTruthy();
    await act(async () => { resolveDetail("<strong>Conteúdo async</strong>"); });
    expect(screen.getByText("Conteúdo async")).toBeTruthy();
    expect(screen.queryByText("Carregando detalhes…")).toBeNull();
  });

  it("localizes the built-in strings with locale: 'en' and opens an English sort menu", () => {
    const rows = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: `Person ${index + 1}` }));
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", dataset: rows, rowsPerPage: 5, locale: "en",
      checkboxEnabled: true, actions: [{ element: () => "<button>Go</button>" }],
      columns: [{ name: "name", label: "Name" }]
    }} />);
    expect(screen.getByText("Showing 1 to 5 of 12")).toBeTruthy();
    expect(container.querySelector(".spark-grid__per-page")?.textContent).toContain("Per page:");
    expect(screen.getByText("Actions")).toBeTruthy();
    expect(screen.getByLabelText("Select all")).toBeTruthy();
    expect(screen.getByLabelText("Pagination")).toBeTruthy();
    expect(screen.getByLabelText("Previous page")).toBeTruthy();
    expect(screen.getByLabelText("Filter Name")).toBeTruthy();
    fireEvent.click(container.querySelector(".grid-header-cell.grid-header-order")!);
    const sortMenu = container.querySelector(".arcana-sort-menu")!;
    expect(sortMenu.getAttribute("aria-label")).toBe("Sorting");
    const labels = Array.from(sortMenu.querySelectorAll("button")).map((button) => button.textContent?.trim());
    expect(labels).toEqual(["Ascending", "Descending"]);
  });

  it("builds a multi-column sort with shift-click, showing priority badges and reordering rows", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, name: "B", amount: 2 }, { id: 2, name: "A", amount: 1 }, { id: 3, name: "B", amount: 1 }],
      columns: [{ name: "name", label: "Name" }, { name: "amount", label: "Amount", type: "NUMBER" }]
    }} />);
    const headers = container.querySelectorAll<HTMLElement>(".grid-header-cell.grid-header-order");
    fireEvent.click(headers[0], { shiftKey: true }); // name asc
    fireEvent.click(headers[1], { shiftKey: true }); // + amount asc
    const badges = container.querySelectorAll(".arcana-sort-priority");
    expect(Array.from(badges).map((badge) => badge.textContent)).toEqual(["1", "2"]);
    expect(headers[0].getAttribute("aria-sort")).toBe("ascending");
    const firstCells = container.querySelectorAll(".grid-body .grid-row:first-child .grid-cell");
    expect(firstCells[0].textContent).toBe("A"); // name asc, then amount asc
    // The single-column sort menu still opens on a plain click.
    fireEvent.click(headers[0]);
    expect(container.querySelector(".arcana-sort-menu")).toBeTruthy();
  });

  it("resizes a column by dragging its header handle, respecting the minimum width", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false, cellMinWidth: 80,
      dataset: [{ id: 1, name: "Ada" }],
      columns: [{ name: "name", label: "Name" }]
    }} />);
    const header = container.querySelector<HTMLElement>(".grid-header-cell.grid-header-order")!;
    const handle = header.querySelector(".arcana-col-resizer")!;
    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(window, { clientX: 320 });
    fireEvent.pointerUp(window);
    expect(header.style.width).toBe("220px"); // 0 (happy-dom rect) + 220 delta
    // A further drag below the minimum clamps to cellMinWidth (80px).
    fireEvent.pointerDown(handle, { clientX: 320 });
    fireEvent.pointerMove(window, { clientX: 0 });
    fireEvent.pointerUp(window);
    expect(header.style.width).toBe("80px");
  });

  it("pins a column to the right from the header menu, moving it to the right group", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, a: "1", b: "2", c: "3" }],
      columns: [{ name: "a", label: "A" }, { name: "b", label: "B" }, { name: "c", label: "C" }]
    }} />);
    const order = () => Array.from(container.querySelectorAll<HTMLElement>(".grid-header [data-col-name]")).map((cell) => cell.getAttribute("data-col-name"));
    expect(order()).toEqual(["a", "b", "c"]);
    fireEvent.click(container.querySelector<HTMLElement>('[data-col-name="a"]')!);
    const pinRight = Array.from(container.querySelectorAll<HTMLButtonElement>(".arcana-pin-menu button")).find((button) => button.textContent?.includes("Fixar à direita"))!;
    expect(pinRight).toBeTruthy();
    fireEvent.click(pinRight);
    // "a" is now right-pinned, so it groups to the end and sticks to the right.
    expect(order()).toEqual(["b", "c", "a"]);
    const pinnedCell = container.querySelector<HTMLElement>('.grid-header [data-col-name="a"]')!;
    expect(pinnedCell.classList.contains("arcana-pin-right")).toBe(true);
    expect(pinnedCell.style.position).toBe("sticky");
  });

  it("reorders columns by dragging a header cell over another", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, a: "1", b: "2", c: "3" }],
      columns: [{ name: "a", label: "A" }, { name: "b", label: "B" }, { name: "c", label: "C" }]
    }} />);
    const order = () => Array.from(container.querySelectorAll<HTMLElement>(".grid-header [data-col-name]")).map((cell) => cell.getAttribute("data-col-name"));
    expect(order()).toEqual(["a", "b", "c"]);
    const headerA = container.querySelector<HTMLElement>('[data-col-name="a"]')!;
    const headerC = container.querySelector<HTMLElement>('[data-col-name="c"]')!;
    // happy-dom has no layout; drive the drop target through elementFromPoint.
    const original = document.elementFromPoint;
    document.elementFromPoint = vi.fn(() => headerC) as typeof document.elementFromPoint;
    fireEvent.pointerDown(headerA, { clientX: 10, clientY: 5, button: 0 });
    fireEvent.pointerMove(window, { clientX: 200, clientY: 5 });
    fireEvent.pointerUp(window, { clientX: 200, clientY: 5 });
    document.elementFromPoint = original;
    // "a" dropped after "c" (rects are zero-sized → right half → after).
    expect(order()).toEqual(["b", "c", "a"]);
  });

  it("renders a config-pinned column as sticky with the pin classes", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false, overflowEnabled: true,
      dataset: [{ id: 1, a: "1", b: "2" }],
      columns: [{ name: "a", label: "A", width: 120, pinned: "left" }, { name: "b", label: "B", width: 400 }]
    }} />);
    const header = container.querySelector<HTMLElement>('.grid-header [data-col-name="a"]')!;
    expect(header.classList.contains("arcana-pin-left")).toBe(true);
    expect(header.classList.contains("arcana-pin-left-edge")).toBe(true);
    expect(header.style.position).toBe("sticky");
    expect(header.style.left).toBe("0px");
    const cell = container.querySelector<HTMLElement>('.grid-body .grid-cell.arcana-pin-left')!;
    expect(cell.style.position).toBe("sticky");
  });

  it("escapes raw cell values as text (no HTML injection without column.html)", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, name: "<img src=x onerror=\"window.__xss=1\">" }],
      columns: [{ name: "name", label: "Name" }]
    }} />);
    expect(container.querySelector(".grid-body img")).toBeNull();
    expect(container.querySelector(".grid-body .grid-cell")?.textContent).toContain("<img src=x onerror=");
    expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
  });

  it("renders HTML from a valueGetter only when the column opts in with html: true", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", html: true, valueGetter: (value) => `<span class="pill">${String(value)}</span>` }]
    }} />);
    expect(container.querySelector(".grid-body .pill")?.textContent).toBe("ok");
  });

  it("renders a valueGetter string as text by default (no html flag)", () => {
    const { container } = render(<ArcanaDataTable config={{
      mode: "dataset", searchEnabled: false, footerVisible: false,
      dataset: [{ id: 1, status: "ok" }],
      columns: [{ name: "status", label: "Status", valueGetter: (value) => `<span class="pill">${String(value)}</span>` }]
    }} />);
    expect(container.querySelector(".grid-body .pill")).toBeNull();
    expect(container.querySelector(".grid-body .grid-cell")?.textContent).toBe('<span class="pill">ok</span>');
  });

  it("lets messages override any single string on top of a locale pack", () => {
    render(<ArcanaDataTable config={{
      mode: "dataset", dataset: [], searchEnabled: false, locale: "en",
      messages: { empty: "Nothing to see here", showingRange: "✦ {from}-{to}/{total}" },
      columns: [{ name: "name", label: "Name" }]
    }} />);
    expect(screen.getByText("Nothing to see here")).toBeTruthy();
    // messages.empty wins over the locale pack; without it the pack string is shown
    render(<ArcanaDataTable config={{
      mode: "dataset", dataset: [], searchEnabled: false, locale: "en",
      columns: [{ name: "name", label: "Name" }]
    }} />);
    expect(screen.getByText("No records found.")).toBeTruthy();
  });
});
