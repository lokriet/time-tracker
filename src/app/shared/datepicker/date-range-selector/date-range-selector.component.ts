import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DateRange } from './date-range.model';

export const DATE_RANGE_SELECTOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateRangeSelectorComponent),
  multi: true,
};

enum View {
  DAYS = 'DAYS',
  MONTHS_SELECTED = 'MONTHS_SELECTED',
  MONTHS_PREVIOUS = 'MONTHS_PREVIOUS',
  YEARS_SELECTED = 'YEARS_SELECTED',
  YEARS_PREVIOUS = 'YEARS_PREVIOUS'
}

@Component({
  selector: 'app-date-range-selector',
  providers: [DATE_RANGE_SELECTOR_VALUE_ACCESSOR],
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.scss'],
  animations: [
    trigger(
      'backdropAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('400ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('400ms', style({opacity: 0}))
        ])
      ]
    ),

    trigger(
      'slideLeftToRight', [
        state('in', style({ transform: 'translateX(0)', opacity: 1})),
        state('void', style({ transform: 'translateX(-100%)', opacity: 0.8})),
        transition('* <=> *', animate(400)),
      ]
    ),

    trigger(
      'slideRightToLeft', [
        state('in', style({ transform: 'translateX(0)', opacity: 1})),
        state('void', style({ transform: 'translateX(100%)', opacity: 0.8})),
        transition('* <=> *', animate(400)),
      ]
    )
  ]
})
export class DateRangeSelectorComponent implements OnInit, ControlValueAccessor {
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // tslint:disable-next-line: variable-name
  _selectedMonth: Date;
  previousMonth: Date;
  dateRange: DateRange;
  view: View;
  selectedYear: number;

  onChange: any = () => { };

  constructor() { }

  ngOnInit() {
    this.view = View.DAYS;

    if (!this.selectedMonth) {
      this.selectedMonth = new Date();
    } else {
      this.previousMonth = new Date(this.selectedMonth);
      this.previousMonth.setMonth(this.previousMonth.getMonth() - 1);
    }

  }

  getSelectedMonthHeader() {
    return this.months[this.selectedMonth.getMonth()] + ', ' + this.selectedMonth.getFullYear();
  }

  getPreviousMonthHeader() {
    return this.months[this.previousMonth.getMonth()] + ', ' + this.previousMonth.getFullYear();
  }

  isCurrentMonthShown(): boolean {
    const today = new Date();
    return today.getFullYear() === this._selectedMonth.getFullYear() && today.getMonth() === this._selectedMonth.getMonth();
  }

  onShowPreviousMonth() {
    const newMonth = new Date(this._selectedMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.selectedMonth = newMonth;
  }

  onShowNextMonth() {
    const newMonth = new Date(this._selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.selectedMonth = newMonth;
  }

  onShowSelectedMonthSelector() {
    this.selectedYear = this.selectedMonth.getFullYear();
    this.view = View.MONTHS_SELECTED;
  }

  onShowPreviousMonthSelector() {
    this.selectedYear = this.previousMonth.getFullYear();
    this.view = View.MONTHS_PREVIOUS;
  }

  onMonthSelected(month: Date) {
    const selectedMonth = new Date(month);
    if (this.view === View.MONTHS_PREVIOUS) {
      selectedMonth.setMonth(selectedMonth.getMonth() + 1);
    }
    this.selectedMonth = selectedMonth;
    this.view = View.DAYS;
  }

  onShowYearSelector(year: number) {
    this.selectedYear = year;
    if (this.view === View.MONTHS_PREVIOUS) {
      this.view = View.YEARS_PREVIOUS;
    } else {
      this.view = View.YEARS_SELECTED;
    }
  }

  onYearSelected(year: number) {
    this.selectedYear = year;
    if (this.view === View.YEARS_PREVIOUS) {
      this.view = View.MONTHS_PREVIOUS;
    } else {
      this.view = View.MONTHS_SELECTED;
    }
  }

  onDateRangeSelected(dateRange: DateRange) {
    this.onChange(dateRange);
  }

  onBackdropClicked() {
    this.view = View.DAYS;
    this.selectedYear = null;
  }

  get selectedMonth() {
    return this._selectedMonth;
  }

  @Input()
  set selectedMonth(month: Date) {
    const selectedMonth = new Date(month);
    selectedMonth.setDate(1);
    selectedMonth.setHours(0, 0, 0, 0);
    this._selectedMonth = selectedMonth;

    this.previousMonth = new Date(this.selectedMonth);
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1);
  }

  writeValue(value: DateRange): void {
    this.dateRange = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    //
  }

}
