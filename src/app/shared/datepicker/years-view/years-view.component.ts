import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-years-view',
  templateUrl: './years-view.component.html',
  styleUrls: ['./years-view.component.scss']
})
export class YearsViewComponent implements OnInit {
  faRight = faChevronRight;
  faLeft = faChevronLeft;

  currentYear: number;
  yearsToShow: number[];
  @Input() selectedDecade: number;
  @Input() selectedDate: Date;
  @Output() showMonthSelector = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.init(this.selectedDecade);
  }

  init(selectedDecade: number) {
    this.currentYear = new Date().getFullYear();
    this.selectedDecade = selectedDecade - (selectedDecade % 10);
    this.yearsToShow = [];
    for (let i = -1; i <= 10; i++) {
      this.yearsToShow.push(this.selectedDecade + i);
    }
  }

  isCurrentYear(year: number) {
    return year === this.currentYear;
  }

  isSelectedYear(year: number) {
    return this.selectedDate && year === this.selectedDate.getFullYear();
  }

  isFuture(year: number) {
    return year > this.currentYear;
  }

  isNextDecadeFuture() {
    return this.yearsToShow[11] > this.currentYear;
  }

  getHeaderText(): string {
    return '' + this.selectedDecade + ' - ' + (this.selectedDecade + 9);
  }

  onShowPreviousDecade() {
    this.init(this.selectedDecade - 10);
  }

  onShowNextDecade() {
    this.init(this.selectedDecade + 10);
  }

  onSelectYear(year) {
    this.showMonthSelector.emit(year);
  }

  onSelectCurrentYear() {
    this.init(this.currentYear);
    this.onSelectYear(this.currentYear);
  }

}
