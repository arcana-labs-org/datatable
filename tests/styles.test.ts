import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(resolve(process.cwd(), "src/assets/ArcanaGrid.css"), "utf8");
const docsStyles = readFileSync(resolve(process.cwd(), "docs/src/styles.css"), "utf8");

describe("ArcanaGrid styles", () => {
  it("uses ui-components' native stylesheet without duplicating component CSS", () => {
    expect(docsStyles).toMatch(/^@import "@arcanalabs\/ui-components\/styles\.css";/);
    expect(styles).not.toContain("@arcanalabs/ui-components/styles.css");
    expect(styles).not.toMatch(/^\.arcana-select(?:__[\w-]+)?\s*[{,]/m);
    expect(styles).not.toMatch(/^\.arcana-cal(?:__[\w-]+)?\s*[{,]/m);
    expect(styles).not.toMatch(/\.arcana-grid \.arcana-input(?:-wrap|__icon)/);
    expect(styles).toContain("--arcana-border-subtle:");
    expect(styles).toContain("--arcana-solid:");
  });

  it("keeps rounded outer borders on the scroll container instead of clipped children", () => {
    expect(styles).toMatch(
      /\.arcana-grid\.grid-wrapper\s*\{[^}]*border:\s*1px solid var\(--arcana-border\);[^}]*border-radius:\s*var\(--arcana-border-radius\);[^}]*overflow-x:\s*auto;/s
    );
    expect(styles).toMatch(
      /\.arcana-grid \.grid-header \.grid-header-cell,[^{]*\{[^}]*border-top:\s*0;/s
    );
    expect(styles).toMatch(
      /\.arcana-grid > \.grid-footer,[^{]*\{[^}]*border-bottom:\s*0;/s
    );
    expect(styles).toMatch(
      /@media screen and \(max-width: 768px\)[\s\S]*\.arcana-grid-responsive-vertical\.grid-wrapper\s*\{[^}]*border:\s*none;/s
    );
    expect(styles).toMatch(
      /\.arcana-grid-responsive-vertical > \.grid-footer,[^{]*\{[^}]*border-bottom:\s*1px solid var\(--arcana-border\);/s
    );
  });

  it("uses an overridable color only for vertical column dividers", () => {
    const columnBorder = "var(--arcana-column-border, var(--arcana-border))";
    expect(styles).toContain(`border-left: 1px solid ${columnBorder};`);
    expect(styles).toContain(`border-right: 1px solid ${columnBorder};`);
    expect(styles).toContain("var(--arcana-column-border, var(--arcana-pin-border))");
    expect(styles).toContain("border-top: 1px solid var(--arcana-border);");
    expect(styles).toContain("border-bottom: 1px solid var(--arcana-border);");
  });
});
