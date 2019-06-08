import { Component, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

export const DATE_RANGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateRangeComponent),
  multi: true,
};

@Component({
  selector: 'app-date-range',
  providers: [DATE_RANGE_VALUE_ACCESSOR],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements ControlValueAccessor {
  fromDate: NgbDate;
  toDate: NgbDate;

  hoveredDate: NgbDate;
  @ViewChild('dp', {static: true}) datepicker: NgbDatepicker;

  private propagateChange = (_: any) => { };

  constructor(private calendar: NgbCalendar) {
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if (this.fromDate && this.toDate) {
      this.propagateChange({fromDate: this.fromDate, toDate: this.toDate});
    } else {
      this.propagateChange(null);
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  isAfterMaxDate(date: NgbDate) {
    return date.after(this.getMaxDate());
  }

  getMaxDate(): NgbDate {
    return this.calendar.getToday();
  }

  writeValue(obj: {fromDate: NgbDate, toDate: NgbDate}): void {
    if (obj) {
      this.fromDate = obj.fromDate;
      this.toDate = obj.toDate;
    } else {
      this.fromDate = null;
      this.toDate = null;
    }
    this.datepicker.navigateTo(this.fromDate);
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO
  }
}
