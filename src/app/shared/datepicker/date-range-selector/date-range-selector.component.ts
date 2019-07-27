import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export const DATE_RANGE_SELECTOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateRangeSelectorComponent),
  multi: true,
};

@Component({
  selector: 'app-date-range-selector',
  providers: [DATE_RANGE_SELECTOR_VALUE_ACCESSOR],
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.scss']
})
export class DateRangeSelectorComponent implements OnInit, ControlValueAccessor {
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // tslint:disable-next-line: variable-name
  _selectedMonth: Date;
  previousMonth: Date;
  dateRange: {startDate: Date, endDate: Date};

  onChange: any = () => { };

  constructor() { }

  ngOnInit() {
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
    this._selectedMonth.setMonth(this._selectedMonth.getMonth() - 1);
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1);
  }

  onShowNextMonth() {
    this._selectedMonth.setMonth(this._selectedMonth.getMonth() + 1);
    this.previousMonth.setMonth(this.previousMonth.getMonth() + 1);
  }

  onShowMonthSelector() {
    // TODO
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

  writeValue(value: {startDate: Date, endDate: Date}): void {
    this.dateRange = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    //
  }

}
