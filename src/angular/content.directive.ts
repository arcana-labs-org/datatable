import { Directive, ElementRef, Input, OnChanges, inject } from "@angular/core";
import type { Renderable } from "../core/types";

/**
 * Renders a `Renderable` into the host element, exactly like the React/Vue
 * `Content` helpers:
 * - function → invoked (lazily) and the result rendered;
 * - string → rendered as escaped TEXT by default; rendered as HTML only when
 *   `arcanaContentHtml` is true (opt-in per column via `column.html`);
 * - number/boolean → rendered as text;
 * - DOM `Node` → appended as-is (the Angular-friendly escape hatch for
 *   "component" content: build the node imperatively and return it);
 * - `null`/`undefined` → nothing.
 *
 * Used as `<span [arcanaContent]="value"></span>` so the resulting DOM keeps
 * the same shape as the other adapters.
 */
@Directive({ selector: "[arcanaContent]", standalone: true })
export class ArcanaContentDirective implements OnChanges {
  @Input("arcanaContent") value: Renderable;
  @Input("arcanaContentHtml") html = false;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnChanges(): void {
    const element = this.host.nativeElement;
    const resolved = typeof this.value === "function" ? (this.value as () => Renderable)() : this.value;
    element.textContent = "";
    if (resolved == null) return;
    if (typeof resolved === "string") {
      if (this.html) element.innerHTML = resolved;
      else element.textContent = resolved;
      return;
    }
    if (typeof resolved === "number" || typeof resolved === "boolean") {
      element.textContent = String(resolved);
      return;
    }
    if (typeof Node !== "undefined" && resolved instanceof Node) {
      element.appendChild(resolved);
      return;
    }
    element.textContent = String(resolved);
  }
}
