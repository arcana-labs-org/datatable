import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(resolve(process.cwd(), "src/assets/ArcanaGrid.css"), "utf8");

describe("ArcanaGrid styles", () => {
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
});
