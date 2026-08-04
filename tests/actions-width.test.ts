import { describe, expect, it } from "vitest";
import { createDataTable } from "../src";
import { actionsColumnWidth, actionStyle } from "../src/core/view";
import type { DataTableAction } from "../src/core/types";

type Row = { id: number; _uuid?: string };

const arrow: DataTableAction<Row> = { element: () => "<button>→</button>" };

function grid(actionsWidth: number | string | undefined, actions: DataTableAction<Row>[] = [arrow]) {
  return createDataTable<Row>({
    columns: [{ name: "id", label: "ID" }],
    actions,
    ...(actionsWidth === undefined ? {} : { actionsWidth })
  });
}

/**
 * A CSS length is "honored" by the browser only when it carries a unit (or is a
 * percentage). A bare number like `120` — which is what an unitless `actionsWidth`
 * such as `"120"` collapses to — is ignored, so the flex cell falls back to its
 * content width. Because the header cell (label) and body cells (buttons) share the
 * SAME `actionStyle`, an ignored width makes the header column wider than the body:
 * the exact divergence this suite guards against.
 */
const CSS_LENGTH = /^-?\d*\.?\d+(px|%|r?em|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/;

describe("actions column width", () => {
  const cases: Array<{ label: string; actionsWidth: number | string | undefined }> = [
    { label: "default (no actionsWidth)", actionsWidth: undefined },
    { label: "numeric width", actionsWidth: 120 },
    { label: "px string width", actionsWidth: "120px" },
    { label: "unitless string width", actionsWidth: "120" },
    { label: "rem string width", actionsWidth: "8rem" },
    { label: "zero width", actionsWidth: 0 }
  ];

  for (const { label, actionsWidth } of cases) {
    describe(label, () => {
      it("emits a browser-honored CSS length for the cell width", () => {
        const style = actionStyle(grid(actionsWidth));
        expect(String(style.width)).toMatch(CSS_LENGTH);
      });

      it("locks width == minWidth == maxWidth == flexBasis so the cell can't collapse to content", () => {
        const style = actionStyle(grid(actionsWidth));
        expect(style.minWidth).toBe(style.width);
        expect(style.maxWidth).toBe(style.width);
        expect(style.flexBasis).toBe(style.width);
      });

      it("keeps actionStyle and actionsColumnWidth in agreement (px cell == px pin math)", () => {
        const g = grid(actionsWidth);
        const styleWidth = String(actionStyle(g).width);
        // Only px/number widths are comparable to the numeric pin-offset math.
        if (styleWidth.endsWith("px")) {
          expect(actionsColumnWidth(g)).toBe(Number.parseFloat(styleWidth));
        }
      });
    });
  }

  it("scales the default width with the number of actions", () => {
    const one = actionStyle(grid(undefined, [arrow]));
    const three = actionStyle(grid(undefined, [arrow, arrow, arrow]));
    expect(one.width).toBe("100px");
    expect(three.width).toBe("200px");
    expect(actionsColumnWidth(grid(undefined, [arrow]))).toBe(100);
    expect(actionsColumnWidth(grid(undefined, [arrow, arrow, arrow]))).toBe(200);
  });
});
