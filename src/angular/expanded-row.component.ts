import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, inject
} from "@angular/core";
import { resolveArcanaMessages, type ArcanaMessages } from "../core/locale";
import { expandedRowLoadingContent } from "../core/view";
import type { DataTableApi, DataTableRow, Renderable } from "../core/types";
import { ArcanaContentDirective } from "./content.directive";

/**
 * Resolves `expandedRowRenderer` for one expanded row: sync results render
 * immediately; Promises show the (replaceable) loading state until they
 * settle. Re-runs whenever the row is expanded again, like React/Vue.
 * Attribute selector so it can live directly on the `.grid-detail-cell` div.
 */
@Component({
  selector: "div[arcanaExpandedRow]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArcanaContentDirective],
  template: `
    @switch (status) {
      @case ("loading") {
        <span [arcanaContent]="loadingContent()" [arcanaContentHtml]="true"></span>
      }
      @case ("error") {
        <div class="grid-detail-error">{{ msg().expandedError }}</div>
      }
      @default {
        <span [arcanaContent]="content" [arcanaContentHtml]="true"></span>
      }
    }
  `
})
export class ArcanaExpandedRowComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) row!: DataTableRow;
  @Input({ required: true }) grid!: DataTableApi<DataTableRow>;

  status: "loading" | "ready" | "error" = "loading";
  content: Renderable;

  private active = true;
  private generation = 0;
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnChanges(): void {
    const current = ++this.generation;
    this.status = "loading";
    this.content = undefined;
    try {
      const result = this.grid.config.expandedRowRenderer?.(this.row, this.grid);
      if (result && typeof (result as Promise<Renderable>).then === "function") {
        (result as Promise<Renderable>).then(
          (content) => {
            if (!this.active || current !== this.generation) return;
            this.status = "ready";
            this.content = content;
            this.cdr.markForCheck();
          },
          (error) => {
            console.error(error);
            if (!this.active || current !== this.generation) return;
            this.status = "error";
            this.cdr.markForCheck();
          }
        );
      } else {
        this.status = "ready";
        this.content = result;
      }
    } catch (error) {
      console.error(error);
      this.status = "error";
    }
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  msg(): ArcanaMessages {
    return resolveArcanaMessages(this.grid.config);
  }

  loadingContent(): Renderable {
    return this.grid.config.expandedRowLoadingRenderer?.(this.row, this.grid) ?? expandedRowLoadingContent(this.msg());
  }
}
