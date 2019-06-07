import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { DateRange } from './date-range/date-range.model';

export enum DateSelectionMode {
  MONTHLY,
  WEEKLY,
  BIWEEKLY
}

export class DateSelector {
  constructor(private calendar: NgbCalendar) {
    this.dateSelectionMode = DateSelectionMode.WEEKLY;
  }

  private _dateSelectionMode: DateSelectionMode;
  private currentSelectedDateRange: DateRange = null;

  set dateSelectionMode(mode: DateSelectionMode) {
    this._dateSelectionMode = mode;
    this.currentSelectedDateRange = null;
  }

  get dateSelectionMode(): DateSelectionMode {
    return this._dateSelectionMode;
  }

  getCurrentlySelected(): DateRange {
    if (!this.currentSelectedDateRange) {
      this.setCurrentPeriod();
    }
    return this.currentSelectedDateRange;
  }

  getCurrentPeriod(): DateRange {
    this.setCurrentPeriod();
    return this.currentSelectedDateRange;
  }

  getNextPeriod(): DateRange {
    if (!this.currentSelectedDateRange) {
      this.setCurrentPeriod();
    }
    switch (this.dateSelectionMode) {
      case DateSelectionMode.WEEKLY:
        this.setNextWeek();
        break;
      case DateSelectionMode.BIWEEKLY:
        this.setNextTwoWeeks();
        break;
      case DateSelectionMode.MONTHLY:
        this.setNextMonth();
        break;
    }
    return this.currentSelectedDateRange;
  }

  getPreviousPeriod(): DateRange {
    if (!this.currentSelectedDateRange) {
      this.setCurrentPeriod();
    }
    switch (this.dateSelectionMode) {
      case DateSelectionMode.WEEKLY:
        this.setPreviousWeek();
        break;
      case DateSelectionMode.BIWEEKLY:
        this.setPreviousTwoWeeks();
        break;
      case DateSelectionMode.MONTHLY:
        this.setPreviousMonth();
        break;
    }
    return this.currentSelectedDateRange;
  }

  private setCurrentPeriod() {
    switch (this.dateSelectionMode) {
      case DateSelectionMode.WEEKLY:
        this.setCurrentWeek();
        break;
      case DateSelectionMode.BIWEEKLY:
        this.setCurrentTwoWeeks();
        break;
      case DateSelectionMode.MONTHLY:
        this.setCurrentMonth();
        break;
    }
  }

  private setLastWeek() {
    const result = {fromDate: this.calendar.getPrev(this.calendar.getToday(), 'd', 6), toDate: this.calendar.getToday()};
    this.currentSelectedDateRange = result;
  }

  private setCurrentWeek() {
    const today = this.calendar.getToday();
    const todayWeekday = this.calendar.getWeekday(today);
    let first: NgbDate;
    if (todayWeekday === 1) {
      first = new NgbDate(today.year, today.month, today.day);
    } else {
      first = this.calendar.getPrev(today, 'd', todayWeekday - 1);
    }
    const last = this.calendar.getNext(first, 'd', 6);

    const result = {fromDate: first, toDate: last};
    this.currentSelectedDateRange = result;
  }

  private setPreviousWeek() {
    const result = {fromDate: this.calendar.getPrev(this.currentSelectedDateRange.fromDate, 'd', 7),
                    toDate: this.calendar.getPrev(this.currentSelectedDateRange.toDate, 'd', 7)};

    this.currentSelectedDateRange = result;
  }

  private setNextWeek() {
    const result = {fromDate: this.calendar.getNext(this.currentSelectedDateRange.fromDate, 'd', 7),
                    toDate: this.calendar.getNext(this.currentSelectedDateRange.toDate, 'd', 7)};

    this.currentSelectedDateRange = result;
  }

  private setLastTwoWeeks() {
    const result = {fromDate: this.calendar.getPrev(this.calendar.getToday(), 'd', 13), toDate: this.calendar.getToday()};
    this.currentSelectedDateRange = result;
  }

  private setCurrentTwoWeeks() {
    const today = this.calendar.getToday();
    const todayWeekday = this.calendar.getWeekday(today);
    let last: NgbDate;
    if (todayWeekday === 7) {
      last = new NgbDate(today.year, today.month, today.day);
    } else {
      last = this.calendar.getNext(today, 'd', 7 - todayWeekday);
    }
    const first = this.calendar.getPrev(last, 'd', 13);

    const result = {fromDate: first, toDate: last};
    this.currentSelectedDateRange = result;
  }

  private setPreviousTwoWeeks() {
    const result = {fromDate: this.calendar.getPrev(this.currentSelectedDateRange.fromDate, 'd', 14),
                    toDate: this.calendar.getPrev(this.currentSelectedDateRange.toDate, 'd', 14)};

    this.currentSelectedDateRange = result;
  }

  private setNextTwoWeeks() {
    const result = {fromDate: this.calendar.getNext(this.currentSelectedDateRange.fromDate, 'd', 14),
                    toDate: this.calendar.getNext(this.currentSelectedDateRange.toDate, 'd', 14)};

    this.currentSelectedDateRange = result;
  }

  private setCurrentMonth() {
    const today = this.calendar.getToday();
    const first = new NgbDate(today.year, today.month, 1);
    const isDecember = first.month === 12;
    let last = new NgbDate(isDecember ? today.year + 1 : today.year,
                           isDecember ? 1 : today.month + 1,
                           1);
    last = this.calendar.getPrev(last, 'd', 1);

    const result = {fromDate: first, toDate: last};
    this.currentSelectedDateRange = result;
  }

  private setPreviousMonth() {
    const isJanuary = this.currentSelectedDateRange.fromDate.month === 1;
    const first = new NgbDate(isJanuary ? this.currentSelectedDateRange.fromDate.year - 1 : this.currentSelectedDateRange.fromDate.year,
                                         isJanuary ? 12 : this.currentSelectedDateRange.fromDate.month - 1,
                                         1);
    const isDecember = first.month === 12;
    let last = new NgbDate(isDecember ? first.year + 1 : first.year,
                           isDecember ? 1 : first.month + 1,
                           1);
    last = this.calendar.getPrev(last, 'd', 1);

    const result = {fromDate: first, toDate: last};
    this.currentSelectedDateRange = result;
  }

  private setNextMonth() {
    let isDecember = this.currentSelectedDateRange.fromDate.month === 12;
    const first = new NgbDate(isDecember ? this.currentSelectedDateRange.fromDate.year + 1 : this.currentSelectedDateRange.fromDate.year,
                                         isDecember ? 1 : this.currentSelectedDateRange.fromDate.month + 1,
                                         1);
    isDecember = first.month === 12;
    let last = new NgbDate(isDecember ? first.year + 1 : first.year,
                           isDecember ? 1 : first.month + 1,
                           1);
    last = this.calendar.getPrev(last, 'd', 1);

    const result = {fromDate: first, toDate: last};
    this.currentSelectedDateRange = result;
  }
}
