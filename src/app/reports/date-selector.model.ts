// import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

// import { DateRange } from './date-range/date-range.model';
import { DateRange } from '../shared/datepicker/date-range-selector/date-range.model';

export enum DateSelectionMode {
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Bi-Weekly',
  MONTHLY = 'Monthly'
}

export class DateSelector {
  constructor(/*private calendar: NgbCalendar*/) {
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

  setSelectedPeriod(dateRange: DateRange) {
    this.currentSelectedDateRange = dateRange;
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

  isNextPeriodEndFuture(): boolean {
    let dateToCheck;
    if (!this.currentSelectedDateRange) {
      this.setCurrentPeriod();
      dateToCheck = new Date(this.currentSelectedDateRange.endDate);
      this.setSelectedPeriod(null);
    } else {
      dateToCheck = new Date(this.currentSelectedDateRange.endDate);
    }

    if (dateToCheck.getTime() > this.getToday().getTime()) {
      return true;
    } else {
      switch (this.dateSelectionMode) {
        case DateSelectionMode.WEEKLY:
          dateToCheck.setDate(dateToCheck.getDate() + 7);
          break;
        case DateSelectionMode.BIWEEKLY:
          dateToCheck.setDate(dateToCheck.getDate() + 14);
          break;
        case DateSelectionMode.MONTHLY:
          dateToCheck.setDate(1);
          dateToCheck.setMonth(dateToCheck.getMonth() + 2);
          dateToCheck.setDate(dateToCheck.getDate() - 1);
          break;
      }

      const nextMonth = this.getToday();
      nextMonth.setDate(1);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return dateToCheck.getTime() > nextMonth.getTime();
    }
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

  private setCurrentWeek() {
    const today = this.getToday();
    const todayWeekday = today.getDay();
    let first: Date;
    if (todayWeekday === 1) {
      first = new Date(today);
    } else {
      first = this.getPrev(today, todayWeekday - 1);
    }
    const last = this.getNext(first, 6);

    const result = {startDate: first, endDate: last};
    this.currentSelectedDateRange = result;
  }

  private setPreviousWeek() {
    const result = {startDate: this.getPrev(this.currentSelectedDateRange.startDate, 7),
                    endDate: this.getPrev(this.currentSelectedDateRange.endDate, 7)};

    this.currentSelectedDateRange = result;
  }

  private setNextWeek() {
    const result = {startDate: this.getNext(this.currentSelectedDateRange.startDate, 7),
                    endDate: this.getNext(this.currentSelectedDateRange.endDate, 7)};

    this.currentSelectedDateRange = result;
  }

  private setCurrentTwoWeeks() {
    const today = this.getToday();
    const todayWeekday = today.getDay();
    let last: Date;
    if (todayWeekday === 7) {
      last = new Date(today);
    } else {
      last = this.getNext(today, 7 - todayWeekday);
    }
    const first = this.getPrev(last, 13);

    const result = {startDate: first, endDate: last};
    this.currentSelectedDateRange = result;
  }

  private setPreviousTwoWeeks() {
    const result = {startDate: this.getPrev(this.currentSelectedDateRange.startDate, 14),
                    endDate: this.getPrev(this.currentSelectedDateRange.endDate, 14)};

    this.currentSelectedDateRange = result;
  }

  private setNextTwoWeeks() {
    const result = {startDate: this.getNext(this.currentSelectedDateRange.startDate, 14),
                    endDate: this.getNext(this.currentSelectedDateRange.endDate, 14)};

    this.currentSelectedDateRange = result;
  }

  private setCurrentMonth() {
    const today = this.getToday();
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const isDecember = first.getMonth() === 11;
    let last = new Date(isDecember ? today.getFullYear() + 1 : today.getFullYear(),
                           isDecember ? 0 : today.getMonth() + 1,
                           1);
    last = this.getPrev(last, 1);

    const result = {startDate: first, endDate: last};
    this.currentSelectedDateRange = result;
  }

  private setPreviousMonth() {
    const isJanuary = this.currentSelectedDateRange.startDate.getMonth() === 0;
    const first = new Date(
                            isJanuary ? this.currentSelectedDateRange.startDate.getFullYear() - 1 : this.currentSelectedDateRange.startDate.getFullYear(),
                            isJanuary ? 11 : this.currentSelectedDateRange.startDate.getMonth() - 1,
                            1);
    const isDecember = first.getMonth() === 11;
    let last = new Date(isDecember ? first.getFullYear() + 1 : first.getFullYear(),
                           isDecember ? 0 : first.getMonth() + 1,
                           1);
    last = this.getPrev(last, 1);

    const result = {startDate: first, endDate: last};
    this.currentSelectedDateRange = result;
  }

  private setNextMonth() {
    let isDecember = this.currentSelectedDateRange.endDate.getMonth() === 11;
    const first = new Date(isDecember ? this.currentSelectedDateRange.endDate.getFullYear() + 1 : this.currentSelectedDateRange.endDate.getFullYear(),
                                         isDecember ? 0 : this.currentSelectedDateRange.endDate.getMonth() + 1,
                                         1);
    isDecember = first.getMonth() === 11;
    let last = new Date(isDecember ? first.getFullYear() + 1 : first.getFullYear(),
                           isDecember ? 0 : first.getMonth() + 1,
                           1);
    last = this.getPrev(last, 1);

    const result = {startDate: first, endDate: last};
    this.currentSelectedDateRange = result;
  }

  private getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private getPrev(date: Date, daysNo: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - daysNo);
    return result;
  }

  private getNext(date: Date, daysNo: number): Date {
    return this.getPrev(date, -daysNo);
  }
}
