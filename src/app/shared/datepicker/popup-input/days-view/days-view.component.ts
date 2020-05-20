import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-days-view',
  templateUrl: './days-view.component.html',
  styleUrls: ['./days-view.component.scss']
})
export class DaysViewComponent implements OnInit {
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  today: Date;
  startDate: Date;
  endDate: Date;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  daysToShow: Date[];

  @Input() selectedDate: Date;
  @Input() selectedMonth: Date;
  @Output() showMonthSelector = new EventEmitter<number>();
  @Output() dateSelected = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
    this.init(this.selectedDate, this.selectedMonth);
  }

  init(selectedDate: Date, selectedMonth: Date) {
    this.selectedDate = selectedDate;
    this.selectedMonth = selectedMonth;

    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    let baseDate = null;
    if (this.selectedMonth) {
      baseDate = this.selectedMonth;
    }

    if (this.selectedDate) {
      this.selectedDate.setHours(0, 0, 0, 0);
      if (!baseDate) {
        baseDate = this.selectedDate;
      }
    }

    if (!baseDate) {
      baseDate = this.today;
    }

    this.startDate = this.calcStartDate(baseDate);
    this.endDate = this.calcEndDate(baseDate);

    this.daysToShow = [];
    const nextDate = new Date(this.startDate);
    while (nextDate <= this.endDate) {
      this.daysToShow.push(new Date(nextDate));
      nextDate.setDate(nextDate.getDate() + 1);
    }
  }

  calcStartDate(baseDate: Date): Date {
    const result = new Date(baseDate);
    result.setDate(1);
    if (!this.selectedMonth) {
      this.selectedMonth = new Date(result);
    }
    result.setDate(result.getDate() - this.getWeekDayBaseMon(result.getDay()));
    return result;
  }

  calcEndDate(baseDate: Date): Date {
    const result = new Date(baseDate);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);

    result.setDate(result.getDate() + (6 - this.getWeekDayBaseMon(result.getDay())));
    return result;
  }

  getWeekDayBaseMon(weekDayBaseSun: number): number {
    return (weekDayBaseSun + 6) % 7;
  }

  isToday(date: Date): boolean {
    return date.getTime() === this.today.getTime();
  }

  isSelectedDate(date: Date): boolean {
    return this.selectedDate && this.selectedDate.getTime() === date.getTime();
  }

  isThisMonth(date: Date): boolean {
    return this.selectedMonth.getMonth() === date.getMonth() && this.selectedMonth.getFullYear() === date.getFullYear();
  }

  isFuture(date: Date): boolean {
    return date.getTime() > this.today.getTime();
  }

  getHeaderText(): string {
    return this.months[this.selectedMonth.getMonth()] + ', ' + this.selectedMonth.getFullYear();
  }

  onShowPreviousMonth() {
    const selectedMonth = new Date(this.selectedMonth);
    selectedMonth.setMonth(selectedMonth.getMonth() - 1);
    this.init(this.selectedDate, selectedMonth);
  }

  onShowNextMonth() {
    const selectedMonth = new Date(this.selectedMonth);
    selectedMonth.setMonth(selectedMonth.getMonth() + 1);
    this.init(this.selectedDate, selectedMonth);
  }

  onShowMonthSelector() {
    this.showMonthSelector.emit(this.selectedMonth.getFullYear());
  }

  onDaySelected(date: Date) {
    if (!this.isFuture(date)) {
      this.selectedDate = date;
      this.dateSelected.emit(date);
    }
  }

  onSelectToday() {
    this.selectedDate = this.today;
    const selectedMonth = new Date(this.today);
    selectedMonth.setDate(1);
    this.init(this.selectedDate, selectedMonth);
    this.dateSelected.emit(this.today);
  }
}
