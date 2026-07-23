import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, inject
} from "@angular/core";
import { formatMessage, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
import type { DataTableColumn, DataTableRow, SearchOption } from "../core/types";
import { ArcanaDatePickerComponent } from "./date-picker.component";
import { ArcanaSelectComponent } from "./select.component";

/**
 * Renders the filter control for a column, mirroring the React/Vue
 * `FilterField`: DATE/DATE_MONTH/DATE_RANGE → `ArcanaDatePicker`,
 * BOOLEAN/LIST/REMOTE → `ArcanaSelect`, anything else → text input that
 * commits on blur/Enter. Attribute selector so it can live directly on the
 * `.grid-search-row-cell` div (same DOM as the other adapters).
 */
@Component({
  selector: "div[arcanaFilterField]",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArcanaSelectComponent, ArcanaDatePickerComponent],
  template: `
    @switch (kind()) {
      @case ("range") {
        <div arcanaDatePicker mode="range" [value]="rangeValue()" [disabled]="disabled" [messages]="msg()" [locale]="locale" [ariaLabel]="filterLabel()" (valueChange)="commit($event)"></div>
      }
      @case ("boolean") {
        <div arcanaSelect [value]="stringValue()" [options]="booleanOptions()" [disabled]="disabled" [messages]="msg()" [placeholder]="msg().booleanAll" [ariaLabel]="filterLabel()" (valueChange)="commit($event)"></div>
      }
      @case ("list") {
        <div arcanaSelect [multiple]="true" [value]="listValue()" [options]="options" [disabled]="disabled" [messages]="msg()" [placeholder]="msg().booleanAll" [ariaLabel]="filterLabel()" (valueChange)="commit($event)"></div>
      }
      @case ("date") {
        <div arcanaDatePicker [mode]="column.searchType === 'DATE' ? 'date' : 'month'" [value]="stringValue()" [disabled]="disabled" [messages]="msg()" [locale]="locale" [ariaLabel]="filterLabel()" (valueChange)="commit($event)"></div>
      }
      @default {
        <input
          type="search"
          [value]="stringValue()"
          [disabled]="disabled"
          class="arcana-grid-datatable-input"
          [attr.aria-label]="filterLabel()"
          (input)="onInput($event)"
          (blur)="valueChange.emit(draft)"
          (keydown.enter)="valueChange.emit(draft)"
        />
      }
    }
  `
})
export class ArcanaFilterFieldComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) column!: DataTableColumn<DataTableRow>;
  @Input() value: unknown;
  @Input() disabled = false;
  /** Resolved message table; defaults to the global default locale pack. */
  @Input() messages?: ArcanaMessages;
  /** Locale forwarded to the date picker (Intl display names). */
  @Input() locale?: ArcanaLocale;
  @Output() valueChange = new EventEmitter<unknown>();

  options: SearchOption[] = [];
  draft: unknown = "";

  msg(): ArcanaMessages {
    return this.messages ?? resolveArcanaMessages();
  }

  filterLabel(): string {
    return formatMessage(this.msg().filterLabel, { label: this.column.label });
  }

  booleanOptions(): SearchOption[] {
    const messages = this.msg();
    return [
      { value: "", label: messages.booleanAll },
      { value: "1", label: messages.booleanYes },
      { value: "0", label: messages.booleanNo }
    ];
  }

  private active = true;
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"]) this.draft = this.value ?? "";
    if (changes["column"]) {
      Promise.resolve(this.column.searchConfig?.() ?? []).then((items) => {
        if (!this.active) return;
        this.options = items;
        this.cdr.markForCheck();
      });
    }
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  kind(): "range" | "boolean" | "list" | "date" | "text" {
    switch (this.column.searchType) {
      case "DATE_RANGE": return "range";
      case "BOOLEAN": return "boolean";
      case "LIST":
      case "REMOTE": return "list";
      case "DATE":
      case "DATE_MONTH": return "date";
      default: return "text";
    }
  }

  stringValue(): string {
    return String(this.draft ?? "");
  }

  rangeValue(): [string, string] {
    return Array.isArray(this.draft)
      ? [String(this.draft[0] ?? ""), String(this.draft[1] ?? "")]
      : ["", ""];
  }

  listValue(): string[] {
    if (Array.isArray(this.draft)) return this.draft.map(String);
    return this.draft == null || this.draft === "" ? [] : [String(this.draft)];
  }

  commit(next: unknown): void {
    this.draft = next;
    this.valueChange.emit(next);
  }

  onInput(event: Event): void {
    this.draft = (event.target as HTMLInputElement).value;
  }
}
