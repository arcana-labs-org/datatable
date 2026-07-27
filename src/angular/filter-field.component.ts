import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, inject
} from "@angular/core";
import { formatMessage, getDefaultArcanaLocale, resolveArcanaMessages, type ArcanaLocale, type ArcanaMessages } from "../core/locale";
import type { DataTableColumn, DataTableRow, SearchOption } from "../core/types";
import { ArcanaDatePickerComponent, ArcanaInputComponent, ArcanaSelectComponent, type SelectOption } from "@arcanalabs/ui-components/angular";

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
  imports: [ArcanaInputComponent, ArcanaSelectComponent, ArcanaDatePickerComponent],
  template: `
    <ng-template #searchIcon>
      <svg class="arcana-search-input__icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="m10.5 10.5 3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
    </ng-template>
    @switch (kind()) {
      @case ("range") {
        <div arcanaDatePicker type="daterange" size="sm" [value]="rangeValue()" [disabled]="disabled" [locale]="datePickerLocale()" [ariaLabel]="filterLabel()" (change)="commit($event)"></div>
      }
      @case ("boolean") {
        <div arcanaSelect size="sm" [value]="stringValue()" [options]="booleanOptions()" [disabled]="disabled" [placeholder]="msg().booleanAll" [ariaLabel]="filterLabel()" (change)="commit($event)"></div>
      }
      @case ("list") {
        <div arcanaSelect size="sm" [multiple]="true" [value]="listValue()" [options]="selectOptions()" [disabled]="disabled" [placeholder]="msg().booleanAll" [ariaLabel]="filterLabel()" (change)="commit($event)"></div>
      }
      @case ("date") {
        <div arcanaDatePicker size="sm" [type]="column.searchType === 'DATE' ? 'date' : 'month'" [value]="stringValue()" [disabled]="disabled" [locale]="datePickerLocale()" [ariaLabel]="filterLabel()" (change)="commit($event)"></div>
      }
      @default {
        <label class="arcana-search-input">
          <span class="arcana-visually-hidden">{{ filterLabel() }}</span>
          <input
            arcanaInput
            type="search"
            size="sm"
            [iconStart]="searchIcon"
            [value]="stringValue()"
            [disabled]="disabled"
            (input)="onInput($event)"
            (blur)="valueChange.emit(draft)"
            (keydown.enter)="valueChange.emit(draft)"
          />
        </label>
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

  booleanOptions(): SelectOption[] {
    const messages = this.msg();
    return [
      { value: "", label: messages.booleanAll },
      { value: "1", label: messages.booleanYes },
      { value: "0", label: messages.booleanNo }
    ];
  }

  /** Adapts the column's `SearchOption[]` to the ui-components `SelectOption[]` shape. */
  selectOptions(): SelectOption[] {
    return this.options.map((opt) => ({
      label: opt.label,
      value: opt.value as SelectOption["value"]
    }));
  }

  /** DatePicker `locale` input is non-nullable; fall back to the global default. */
  datePickerLocale(): ArcanaLocale {
    return this.locale ?? getDefaultArcanaLocale();
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
