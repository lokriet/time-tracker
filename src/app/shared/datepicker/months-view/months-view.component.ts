import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-months-view',
  templateUrl: './months-view.component.html',
  styleUrls: ['./months-view.component.scss']
})
export class MonthsViewComponent implements OnInit {
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  currentMonth: Date;
  @Input() selectedYear: number;
  @Input() selectedDate: Date;
  @Output() showYearSelector = new EventEmitter<number>();
  @Output() showDaySelector = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    this.currentMonth = currentMonth;
  }

  init(selectedYear: number) {
    this.selectedYear = selectedYear;

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    this.currentMonth = currentMonth;
  }

  onShowPreviousYear() {
    this.init(this.selectedYear - 1);
  }

  onShowNextYear() {
    this.init(this.selectedYear + 1);
  }

  onShowYearSelector() {
    this.showYearSelector.emit(this.selectedYear);
  }

  onSelectMonth(i: number) {
    this.showDaySelector.emit(new Date(this.selectedYear, i, 1, 0, 0, 0, 0));
  }

  getHeaderText(): string {
    return '' + this.selectedYear;
  }

  isCurrentMonth(i: number): boolean {
    return this.selectedYear === this.currentMonth.getFullYear() && i === this.currentMonth.getMonth();
  }

  isSelectedMonth(i: number): boolean {
    return this.selectedDate &&
           this.selectedDate.getFullYear() === this.selectedYear && this.selectedDate.getMonth() === i;
  }

  isFuture(i: number): boolean {
    return this.selectedYear > this.currentMonth.getFullYear() ||
           (this.selectedYear === this.currentMonth.getFullYear() && i > this.currentMonth.getMonth());
  }

  isNextYearFuture(): boolean {
    return this.selectedYear >= this.currentMonth.getFullYear();
  }

  onSelectCurrentMonth() {
    this.init(this.currentMonth.getFullYear());
    this.showDaySelector.emit(this.currentMonth);
  }

}
