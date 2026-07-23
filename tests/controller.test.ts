import { describe, expect, it, vi } from "vitest";
import { createDataTable } from "../src";
import { computeLiveReorderTarget, computePinPlan } from "../src/core/view";

type Person = { id: number; name: string; amount: number; _uuid?: string };

describe("DataTableController", () => {
  it("loads, filters and paginates through one framework-neutral API", async () => {
    const datasource = vi.fn(async () => ({ rows: [{ id: 1, name: "Ada", amount: 12 }], total: 21, page: 2 }));
    const grid = createDataTable<Person>({ columns: [{ name: "name", label: "Nome" }], datasource, rowsPerPage: 10 });
    grid.setFilter("person.name", "Ada");
    await grid.paginate(2, 10);
    expect(datasource).toHaveBeenCalledWith(expect.objectContaining({ name: "Ada", page: 2, limit: 10 }));
    expect(grid.getRows()[0]).toMatchObject({ id: 1, name: "Ada" });
    expect(grid.totalRows).toBe(21);
  });

  it("keeps selection and summarization behavior", () => {
    const checked = vi.fn();
    const grid = createDataTable<Person>({ columns: [{ name: "amount", label: "Valor", type: "NUMBER" }], checkboxEnabled: true, onRowChecked: checked });
    grid.setRows([{ id: 1, name: "Ada", amount: 12 }, { id: 2, name: "Linus", amount: 8 }]);
    grid.toggleRow(grid.rows[0], true);
    expect(grid.getCheckedRows()).toHaveLength(1);
    expect(grid.getSummarizedValue(grid.getColumns()[0])).toEqual({ raw: 20, formatted: 20 });
    expect(checked).toHaveBeenCalledOnce();
  });

  it("runs pagination, rows-per-page, sorting and filtering locally in dataset mode", async () => {
    const remoteProvider = vi.fn();
    const dataset = [
      { id: 1, name: "Zelda", amount: 40 },
      { id: 2, name: "Ada", amount: 10 },
      { id: 3, name: "Grace", amount: 30 },
      { id: 4, name: "Alan", amount: 20 },
      { id: 5, name: "Linus", amount: 50 }
    ];
    const grid = createDataTable<Person>({
      dataset,
      datasource: remoteProvider,
      rowsPerPage: 2,
      columns: [
        { name: "name", label: "Nome" },
        { name: "amount", label: "Valor", type: "NUMBER" }
      ]
    });

    expect(grid.mode).toBe("dataset");
    expect(grid.datasetSize).toBe(5);
    expect(grid.totalRows).toBe(5);
    expect(grid.getRows().map((row) => row.id)).toEqual([1, 2]);

    await grid.paginate(2, 2);
    expect(grid.getRows().map((row) => row.id)).toEqual([3, 4]);

    await grid.paginate(1, 3);
    expect(grid.getRows().map((row) => row.id)).toEqual([1, 2, 3]);

    await grid.applyOrderBy({ name: "amount", direction: "asc" });
    expect(grid.currentPage).toBe(1);
    expect(grid.getRows().map((row) => row.amount)).toEqual([10, 20, 30]);

    await grid.applyFilter(grid.getColumns()[0], "a");
    expect(grid.totalRows).toBe(4);
    expect(grid.getRows().map((row) => row.name)).toEqual(["Ada", "Alan", "Grace"]);
    expect(remoteProvider).not.toHaveBeenCalled();
  });

  it("applies typed filters against the complete local dataset", async () => {
    type LocalRecord = Person & { status: string; active: boolean; issuedAt: string };
    const grid = createDataTable<LocalRecord>({
      mode: "dataset",
      dataset: [
        { id: 1, name: "Ada", amount: 10, status: "paid", active: true, issuedAt: "2026-01-10" },
        { id: 2, name: "Grace", amount: 20, status: "pending", active: false, issuedAt: "2026-02-15" },
        { id: 3, name: "Alan", amount: 30, status: "paid", active: true, issuedAt: "2026-03-20" }
      ],
      columns: [
        { name: "status", label: "Status", searchType: "LIST" },
        { name: "active", label: "Ativo", searchType: "BOOLEAN" },
        { name: "issuedAt", label: "Emissão", searchType: "DATE_RANGE" }
      ]
    });

    await grid.applyFilter(grid.getColumns()[0], ["paid"]);
    expect(grid.getRows().map((row) => row.id)).toEqual([1, 3]);
    await grid.setFilter("status", "");

    await grid.applyFilter(grid.getColumns()[1], "1");
    expect(grid.getRows().map((row) => row.id)).toEqual([1, 3]);
    await grid.setFilter("active", "");

    await grid.applyFilter(grid.getColumns()[2], ["2026-02-01", "2026-02-28"]);
    expect(grid.getRows().map((row) => row.id)).toEqual([2]);
  });

  it("keeps local selection and mutations across dataset pages", async () => {
    const grid = createDataTable<Person>({
      mode: "dataset",
      dataset: [
        { id: 1, name: "Ada", amount: 10 },
        { id: 2, name: "Grace", amount: 20 },
        { id: 3, name: "Alan", amount: 30 }
      ],
      rowsPerPage: 1,
      checkboxEnabled: true,
      columns: [{ name: "name", label: "Nome" }]
    });

    const selectedUuid = grid.getRows()[0]._uuid!;
    grid.toggleRow(grid.getRows()[0], true);
    await grid.paginate(2, 1);
    expect(grid.getCheckedRows().map((row) => row.id)).toEqual([1]);

    grid.updateRow(selectedUuid, { name: "Ada Lovelace" });
    grid.removeRow(grid.getRows()[0]._uuid!);
    grid.addRow({ id: 4, name: "Margaret", amount: 40 });
    expect(grid.getDataset().map((row) => row.name)).toEqual(["Ada Lovelace", "Alan", "Margaret"]);

    grid.setDataset([{ id: 9, name: "Nova", amount: 90 }]);
    expect(grid.getRows()).toHaveLength(1);
    expect(grid.totalRows).toBe(1);
  });

  it("requests a fresh remote block for every grid operation", async () => {
    const datasource = vi.fn(async (params: Record<string, unknown>) => ({
      rows: [{ id: Number(params.page), name: "Remote", amount: 1 }],
      total: 50,
      page: Number(params.page)
    }));
    const grid = createDataTable<Person>({
      mode: "remote",
      datasource,
      columns: [{ name: "name", label: "Nome" }, { name: "amount", label: "Valor" }]
    });

    await grid.refresh();
    await grid.setFilter("name", "Remote");
    await grid.setFilters({ name: "Ada" });
    await grid.applyOrderBy({ name: "amount", direction: "desc" });
    await grid.applyFilter(grid.getColumns()[0], "Ada");
    await grid.paginate(3, 25);

    expect(datasource).toHaveBeenCalledTimes(6);
    expect(datasource).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: "Remote" }));
    expect(datasource).toHaveBeenNthCalledWith(3, expect.objectContaining({ name: "Ada" }));
    expect(datasource).toHaveBeenNthCalledWith(4, expect.objectContaining({ "order_by[field]": "amount", "order_by[direction]": "desc" }));
    expect(datasource).toHaveBeenNthCalledWith(5, expect.objectContaining({ name: "Ada" }));
    expect(datasource).toHaveBeenNthCalledWith(6, expect.objectContaining({ page: 3, limit: 25 }));
    expect(grid.currentPage).toBe(3);
  });

  it("sorts a local dataset by multiple keys in priority order (stable)", async () => {
    type Employee = { id: number; dept: string; amount: number };
    const grid = createDataTable<Employee>({
      mode: "dataset",
      rowsPerPage: 10,
      dataset: [
        { id: 1, dept: "B", amount: 20 },
        { id: 2, dept: "A", amount: 30 },
        { id: 3, dept: "B", amount: 10 },
        { id: 4, dept: "A", amount: 30 },
        { id: 5, dept: "A", amount: 10 }
      ],
      columns: [{ name: "dept", label: "Dept" }, { name: "amount", label: "Valor", type: "NUMBER" }]
    });

    // dept asc, then amount desc — ties on (A,30) keep original order (2 before 4).
    await grid.applyOrderBy([{ name: "dept", direction: "asc" }, { name: "amount", direction: "desc" }]);
    expect(grid.getRows().map((row) => row.id)).toEqual([2, 4, 5, 1, 3]);
    expect(grid.orderByList).toHaveLength(2);
    // snapshot.orderBy stays the primary column for backward compatibility.
    expect(grid.getSnapshot().orderBy).toEqual({ name: "dept", direction: "asc" });
    expect(grid.getSnapshot().orderByList).toEqual([{ name: "dept", direction: "asc" }, { name: "amount", direction: "desc" }]);
  });

  it("cycles a column with toggleOrderBy, additively and as sole sort", async () => {
    type Employee = { id: number; dept: string; amount: number };
    const grid = createDataTable<Employee>({
      mode: "dataset", rowsPerPage: 10,
      dataset: [{ id: 1, dept: "A", amount: 1 }],
      columns: [{ name: "dept", label: "Dept" }, { name: "amount", label: "Valor" }]
    });

    // Sole (non-additive) cycle: asc → desc → cleared.
    await grid.toggleOrderBy("dept");
    expect(grid.orderByList).toEqual([{ name: "dept", direction: "asc" }]);
    await grid.toggleOrderBy("dept");
    expect(grid.orderByList).toEqual([{ name: "dept", direction: "desc" }]);
    await grid.toggleOrderBy("dept");
    expect(grid.orderByList).toEqual([]);

    // Additive keeps other columns; new column appends at the end.
    await grid.toggleOrderBy("dept", { additive: true });
    await grid.toggleOrderBy("amount", { additive: true });
    expect(grid.orderByList).toEqual([{ name: "dept", direction: "asc" }, { name: "amount", direction: "asc" }]);
    // Cycle the first column asc → desc while keeping the second.
    await grid.toggleOrderBy("dept", { additive: true });
    expect(grid.orderByList).toEqual([{ name: "dept", direction: "desc" }, { name: "amount", direction: "asc" }]);
    // Remove it (desc → gone); the second stays and becomes primary.
    await grid.toggleOrderBy("dept", { additive: true });
    expect(grid.orderByList).toEqual([{ name: "amount", direction: "asc" }]);
    expect(grid.getSnapshot().orderBy).toEqual({ name: "amount", direction: "asc" });
  });

  it("keeps applyOrderBy(object|null) compatible and serializes multi-sort with indexed params", async () => {
    const datasource = vi.fn(async (_params: Record<string, unknown>) => ({ rows: [] as Person[], total: 0, page: 1 }));
    const grid = createDataTable<Person>({ mode: "remote", datasource, columns: [{ name: "a", label: "A" }, { name: "b", label: "B" }] });

    // Single object → legacy keys.
    await grid.applyOrderBy({ name: "a", direction: "asc" });
    expect(datasource).toHaveBeenLastCalledWith(expect.objectContaining({ "order_by[field]": "a", "order_by[direction]": "asc" }));

    // Array → indexed keys, preserving priority order.
    await grid.applyOrderBy([{ name: "a", direction: "asc" }, { name: "b", direction: "desc" }]);
    expect(datasource).toHaveBeenLastCalledWith(expect.objectContaining({
      "order_by[0][field]": "a", "order_by[0][direction]": "asc",
      "order_by[1][field]": "b", "order_by[1][direction]": "desc"
    }));

    // null → cleared, no order params leak.
    await grid.applyOrderBy(null);
    const calls = datasource.mock.calls;
    const lastCall = calls[calls.length - 1][0] as Record<string, unknown>;
    expect(grid.getSnapshot().orderBy).toBeUndefined();
    expect(Object.keys(lastCall).some((key) => key.startsWith("order_by"))).toBe(false);
  });

  it("computes the live reorder target from the pointer with midpoint hysteresis", () => {
    const headers = [
      { name: "a", left: 0, width: 100 },
      { name: "b", left: 100, width: 100 },
      { name: "c", left: 200, width: 100 }
    ];
    // Pointer over its own slot (or short of a midpoint): no move.
    expect(computeLiveReorderTarget(50, "a", headers, 8)).toBeNull();
    expect(computeLiveReorderTarget(149, "a", headers, 8)).toBeNull();
    // Rightwards: b's midpoint is 150 — 150 + 8 must be cleared first.
    expect(computeLiveReorderTarget(155, "a", headers, 8)).toBeNull();
    expect(computeLiveReorderTarget(159, "a", headers, 8)).toEqual({ target: "b", position: "after" });
    expect(computeLiveReorderTarget(270, "a", headers, 8)).toEqual({ target: "c", position: "after" });
    // Leftwards: b's midpoint is 150 — the pointer must drop below 150 - 8.
    expect(computeLiveReorderTarget(145, "c", headers, 8)).toBeNull();
    expect(computeLiveReorderTarget(141, "c", headers, 8)).toEqual({ target: "b", position: "before" });
    expect(computeLiveReorderTarget(10, "c", headers, 8)).toEqual({ target: "a", position: "before" });
    // Unknown or lone columns are inert.
    expect(computeLiveReorderTarget(50, "zz", headers, 8)).toBeNull();
    expect(computeLiveReorderTarget(500, "a", [headers[0]], 8)).toBeNull();
  });

  it("reorders columns via setColumnOrder and moveColumn, and getColumns respects it", () => {
    const grid = createDataTable({
      mode: "dataset", dataset: [{ id: 1 }],
      columns: [{ name: "a", label: "A" }, { name: "b", label: "B" }, { name: "c", label: "C" }]
    });
    expect(grid.getColumns().map((column) => column.name)).toEqual(["a", "b", "c"]);

    grid.setColumnOrder(["c", "a", "b"]);
    expect(grid.getColumns().map((column) => column.name)).toEqual(["c", "a", "b"]);
    expect(grid.getSnapshot().columnOrder).toEqual(["c", "a", "b"]);

    // Move "c" after "b" → [a, b, c].
    grid.moveColumn("c", "b", "after");
    expect(grid.getColumns().map((column) => column.name)).toEqual(["a", "b", "c"]);
    // Move "a" before "c" → [b, a, c].
    grid.moveColumn("a", "c", "before");
    expect(grid.getColumns().map((column) => column.name)).toEqual(["b", "a", "c"]);
    // A null target sends the column to the end.
    grid.moveColumn("b", null);
    expect(grid.getColumns().map((column) => column.name)).toEqual(["a", "c", "b"]);
  });

  it("groups pinned columns to the edges (left, unpinned, right) preserving order", () => {
    const grid = createDataTable({
      mode: "dataset", dataset: [{ id: 1 }],
      columns: [
        { name: "a", label: "A" },
        { name: "b", label: "B", pinned: "right" },
        { name: "c", label: "C" },
        { name: "d", label: "D", pinned: "left" }
      ]
    });
    // Seeded from config.pinned: left group first (d), middle (a, c), right (b).
    expect(grid.getColumns().map((column) => column.name)).toEqual(["d", "a", "c", "b"]);
    expect(grid.getColumnPin("d")).toBe("left");
    expect(grid.getColumnPin("b")).toBe("right");
    expect(grid.getColumnPin("a")).toBeNull();

    // Runtime pin change: pin "a" left, unpin "d".
    grid.setColumnPinned("a", "left");
    grid.setColumnPinned("d", null);
    expect(grid.getColumnPin("a")).toBe("left");
    expect(grid.getColumnPin("d")).toBeNull();
    expect(grid.getColumns().map((column) => column.name)).toEqual(["a", "c", "d", "b"]);
    expect(grid.getSnapshot().columnPins.a).toBe("left");
  });

  it("computes accumulating sticky offsets for pinned columns", () => {
    const grid = createDataTable({
      mode: "dataset", dataset: [{ id: 1 }],
      checkboxEnabled: true,
      actions: [{ element: () => "x" }],
      columns: [
        { name: "a", label: "A", width: 120, pinned: "left" },
        { name: "b", label: "B", width: 100, pinned: "left" },
        { name: "c", label: "C", width: 90 },
        { name: "z", label: "Z", width: 80, pinned: "right" }
      ]
    });
    const plan = computePinPlan(grid, grid.getColumns(), {});
    expect(plan.active).toBe(true);
    // System checkbox (60) freezes left first, then a at 60, b at 60+120.
    expect(plan.cellStyle("__arcana_checkbox")).toMatchObject({ position: "sticky", left: "0px" });
    expect(plan.cellStyle("a")).toMatchObject({ position: "sticky", left: "60px" });
    expect(plan.cellStyle("b")).toMatchObject({ position: "sticky", left: "180px" });
    // Right region: actions (1*50+50 = 100) at 0, z at 100.
    expect(plan.cellStyle("__arcana_actions")).toMatchObject({ position: "sticky", right: "0px" });
    expect(plan.cellStyle("z")).toMatchObject({ position: "sticky", right: "100px" });
    expect(plan.className("b")).toContain("arcana-pin-left-edge");
    expect(plan.className("z")).toContain("arcana-pin-right-edge");
    expect(plan.className("c")).toBe("");
  });

  it("disables the pin plan in VERTICAL_RECORD mode and when nothing is pinned", () => {
    const base = { mode: "dataset" as const, dataset: [{ id: 1 }], columns: [{ name: "a", label: "A", pinned: "left" as const }] };
    const vertical = createDataTable({ ...base, responsiveMode: "VERTICAL_RECORD" });
    expect(computePinPlan(vertical, vertical.getColumns(), {}).active).toBe(false);
    const unpinned = createDataTable({ mode: "dataset", dataset: [{ id: 1 }], columns: [{ name: "a", label: "A" }] });
    expect(computePinPlan(unpinned, unpinned.getColumns(), {}).active).toBe(false);
  });

  it("expands and collapses rows programmatically, collapsing everything on page changes", async () => {
    const expanded = vi.fn();
    const collapsed = vi.fn();
    const grid = createDataTable<Person>({
      mode: "dataset",
      dataset: [
        { id: 1, name: "Ada", amount: 10 },
        { id: 2, name: "Grace", amount: 20 },
        { id: 3, name: "Alan", amount: 30 }
      ],
      rowsPerPage: 2,
      columns: [{ name: "name", label: "Nome" }],
      expandableRowsEnabled: true,
      expandedRowRenderer: (row) => `Detalhes de ${row.name}`,
      onRowExpanded: expanded,
      onRowCollapsed: collapsed
    });

    const [first, second] = grid.getRows();
    grid.expandRow(first._uuid!);
    grid.expandRow(second._uuid!);
    grid.expandRow(second._uuid!); // idempotente
    expect(grid.getSnapshot().expandedRowUuids).toEqual([first._uuid, second._uuid]);
    expect(grid.getExpandedRows().map((row) => row.id)).toEqual([1, 2]);
    expect(expanded).toHaveBeenCalledTimes(2);

    grid.collapseRow(second._uuid!);
    expect(grid.getExpandedRows().map((row) => row.id)).toEqual([1]);
    expect(collapsed).toHaveBeenCalledOnce();

    await grid.paginate(2, 2);
    expect(grid.getSnapshot().expandedRowUuids).toEqual([]);
    expect(grid.getExpandedRows()).toEqual([]);

    await grid.paginate(1, 2);
    grid.expandRow(grid.getRows()[0]._uuid!);
    grid.setDataset([{ id: 9, name: "Nova", amount: 90 }]);
    expect(grid.getSnapshot().expandedRowUuids).toEqual([]);
  });
});
