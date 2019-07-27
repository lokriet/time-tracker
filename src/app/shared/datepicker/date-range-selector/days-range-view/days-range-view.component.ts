import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-days-range-view',
  templateUrl: './days-range-view.component.html',
  styleUrls: ['./days-range-view.component.scss']
})
export class DaysRangeViewComponent implements OnInit {
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // tslint:disable-next-line: variable-name
  private _selectedMonth: Date;

  @Output() dateRangeSelected = new EventEmitter<{startDate: Date, endDate: Date}>();
  startDate: Date;
  endDate: Date;

  prevMonthDays: Date[];
  selectedMonthDays: Date[];
  today: Date;
  previousMonth: Date;

  clickedDate: Date;
  hoveredDate: Date;

  constructor() { }

  ngOnInit() {
    this.init(this._selectedMonth);
  }

  init(selectedMonth: Date) {
    this._selectedMonth = selectedMonth;

    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    if (!this._selectedMonth) {
      if (this.endDate) {
        this._selectedMonth = new Date(this.endDate);
      } else {
        this._selectedMonth = new Date(this.today);
      }
      this._selectedMonth.setDate(1);
    }

    this.prevMonthDays = [];
    this.previousMonth = new Date(this._selectedMonth);
    this.previousMonth.setMonth(this.previousMonth.getMonth() - 1);
    const nextDate = new Date(this.previousMonth);
    while (nextDate.getMonth() === this.previousMonth.getMonth()) {
      this.prevMonthDays.push(new Date(nextDate));
      nextDate.setDate(nextDate.getDate() + 1);
    }

    this.selectedMonthDays = [];
    while (nextDate.getMonth() === this._selectedMonth.getMonth()) {
      this.selectedMonthDays.push(new Date(nextDate));
      nextDate.setDate(nextDate.getDate() + 1);
    }
  }

  get selectedMonth(): Date {
    return this._selectedMonth;
  }

  @Input()
  set selectedMonth(value: Date) {
    const selectedMonth = new Date(value);
    selectedMonth.setDate(1);
    selectedMonth.setHours(0, 0, 0, 0);

    this.init(selectedMonth);
  }

  getHeaderText(month: Date): string {
    return this.months[month.getMonth()] + ', ' + month.getFullYear();
  }

  getStartDate(): Date {
    if (this.startDate && this.endDate) {
      return this.startDate;
    } else {
      return this.min(this.clickedDate, this.hoveredDate);
    }
  }

  getEndDate(): Date {
    if (this.startDate && this.endDate) {
      return this.endDate;
    } else {
      return this.max(this.clickedDate, this.hoveredDate);
    }
  }

  max(day1: Date, day2: Date) {
    if (!day1 && !day2) { return null; }
    if (day1 && !day2) { return day1; }
    if (!day1 && day2) { return day2; }
    return (day1.getTime() >= day2.getTime() ? day1 : day2);
  }

  min(day1: Date, day2: Date) {
    if (!day1 && !day2) { return null; }
    if (day1 && !day2) { return day1; }
    if (!day1 && day2) { return day2; }
    return (day1.getTime() <= day2.getTime() ? day1 : day2);
  }

  onDaySelected(day: Date) {
    if (!this.startDate && !this.endDate) {
      this.startDate = day;
      this.clickedDate = day;

      this.dateRangeSelected.emit(null);
    } else if (this.startDate && this.startDate.getTime() === day.getTime()) {
      this.startDate = null;
      this.clickedDate = this.endDate;

      this.dateRangeSelected.emit(null);
    } else if (this.endDate && this.endDate.getTime() === day.getTime()) {
      this.endDate = null;
      this.clickedDate = this.startDate;

      this.dateRangeSelected.emit(null);
    } else if (this.startDate && this.endDate) {
      this.startDate = day;
      this.endDate = null;
      this.clickedDate = day;

      this.dateRangeSelected.emit(null);
    } else if (this.startDate) {
      if (this.startDate.getTime() < day.getTime()) {
        this.endDate = day;
      } else {
        this.endDate = this.startDate;
        this.startDate = day;
      }
      this.clickedDate = null;

      this.dateRangeSelected.emit({startDate: this.startDate, endDate: this.endDate});
    } else if (this.endDate) {
      if (this.endDate.getTime() > day.getTime()) {
        this.startDate = day;
      } else {
        this.startDate = this.endDate;
        this.endDate = day;
      }
      this.clickedDate = null;

      this.dateRangeSelected.emit({startDate: this.startDate, endDate: this.endDate});
    }
  }

  onDayHovered(day: Date) {
    this.hoveredDate = day;
  }

  onDayUnhovered() {
    this.hoveredDate = null;
  }

  isToday(day: Date): boolean {
    return this.today.getTime() === day.getTime();
  }

  isStartDay(day: Date): boolean {
    return this.getStartDate() && day.getTime() === this.getStartDate().getTime();
  }

  isEndDay(day: Date): boolean {
    return this.getEndDate() && day.getTime() === this.getEndDate().getTime();
  }

  isRangeDay(day: Date): boolean {
    return this.getStartDate() && this.getEndDate() &&
           this.getStartDate().getTime() < day.getTime() &&
           day.getTime() < this.getEndDate().getTime();
  }

  @Input()
  set dateRange(value: {startDate: Date, endDate: Date} ) {
    if (value) {
      this.startDate = new Date(value.startDate);
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate = new Date(value.endDate);
      this.endDate.setHours(0, 0, 0, 0);
      this.clickedDate = null;
      this.hoveredDate = null;
      this.init(null);
    } else {
      this.init(this._selectedMonth);
    }

  }

  get dateRange() {
    if (this.startDate && this.endDate) {
      return {startDate: this.startDate, endDate: this.endDate};
    } else {
      return null;
    }
  }

}
