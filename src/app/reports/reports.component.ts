import { Component, Inject, OnInit } from '@angular/core';
import {
  faBackward,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faFastForward,
  faForward,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { fromEvent } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';

import { DateRange } from './date-range/date-range.model';
import { ReportsDataService } from './reports-data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  faCheck = faCheck;
  faOneLeft = faCaretLeft;
  faTwoLeft = faBackward;
  faOneRight = faCaretRight;
  faTwoRight = faForward;
  faOneLast = faStepForward;
  faTwoLast = faFastForward;

  data: any;
  scheme: any;

  dates: DateRange;

  windowWidth: number;
  graphWidth: number;

  constructor(private reportsDataService: ReportsDataService,
              private calendar: NgbCalendar,
              @Inject('windowObject') private window: Window) { }

  ngOnInit() {
    this.scheme = colorSets.find(s => s.name === 'vivid');

    this.windowWidth = this.window.innerWidth - 20;
    fromEvent(window, 'resize').pipe(
      auditTime(100),
      map(event => (event.currentTarget as Window).innerWidth)
    ).subscribe((windowWidth) => {
        this.windowWidth = windowWidth - 20;
        this.graphWidth = Math.min(this.windowWidth, Math.max(400, this.data.length * 25 + 20));
    });

    this.dates = {fromDate: this.calendar.getPrev(this.calendar.getToday(), 'd', 6), toDate: this.calendar.getToday()};

    if (this.dates) {
      this.data = this.reportsDataService.getHoursReportData(this.dates.fromDate, this.dates.toDate);
    }
  }

  onBuildReport() {
    this.data = this.reportsDataService.getHoursReportData(this.dates.fromDate, this.dates.toDate);
    this.graphWidth = Math.min(this.windowWidth, Math.max(400, this.data.length * 25 + 20));
  }

  onPreviousMonth() {
    if (this.dates) {
      let interimDate = this.toJsDate(this.dates.fromDate);
      interimDate.setMonth(interimDate.getMonth() - 1);
      let newFromDate = this.fromJsDate(interimDate);

      interimDate = this.toJsDate(this.dates.toDate);
      interimDate.setMonth(interimDate.getMonth() - 1);
      let newToDate = this.fromJsDate(interimDate);

      this.dates = {fromDate: newFromDate, toDate: newToDate};
      console.log(this.dates);
    }
  }

  onPreviousWeek() {
    if (this.dates) {
      this.dates = {fromDate: this.calendar.getPrev(this.dates.fromDate, 'd', 7), toDate: this.calendar.getPrev(this.dates.toDate, 'd', 7)};
      console.log(this.dates);
    }
  }

  onNextMonth() {
    if (this.dates) {
      let interimDate = this.toJsDate(this.dates.fromDate);
      interimDate.setMonth(interimDate.getMonth() + 1);
      let newFromDate = this.fromJsDate(interimDate);

      if (newFromDate.after(this.calendar.getToday())) {
        console.log('not changing dates');
        return;
      }

      interimDate = this.toJsDate(this.dates.toDate);
      interimDate.setMonth(interimDate.getMonth() + 1);
      let newToDate = this.fromJsDate(interimDate);

      if (newToDate.after(this.calendar.getToday())) {
        newToDate = this.calendar.getToday();
      }

      this.dates = {fromDate: newFromDate, toDate: newToDate};
      console.log(this.dates);
    }
  }

  onNextWeek() {
    if (this.dates) {
      let newFromDate = this.calendar.getNext(this.dates.fromDate, 'd', 7);
      if (newFromDate.after(this.calendar.getToday())) {
        console.log('not changing dates');
        return;
      }
      let newToDate = this.calendar.getNext(this.dates.toDate, 'd', 7);
      if (newToDate.after(this.calendar.getToday())) {
        newToDate = this.calendar.getToday();
      }
      this.dates = {fromDate: newFromDate, toDate: newToDate};
      console.log(this.dates);
    }
  }

  onLastMonth() {
    let interimDate = this.toJsDate(this.calendar.getToday());
    interimDate.setMonth(interimDate.getMonth() - 1);
    let monthAgo = this.fromJsDate(interimDate);

    this.dates = {fromDate: monthAgo, toDate: this.calendar.getToday()};
    console.log(this.dates);
  }

  onLastWeek() {
    this.dates = {fromDate: this.calendar.getPrev(this.calendar.getToday(), 'd', 6), toDate: this.calendar.getToday()};
    console.log(this.dates);
  }

  toJsDate(date: NgbDate): Date {
    return new Date(Date.UTC(date.year, date.month - 1, date.day));
  }

  fromJsDate(date: Date): NgbDate {
    
    return new NgbDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDay());
  }

}

