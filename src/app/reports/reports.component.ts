import { Component, Inject, OnInit } from '@angular/core';
import { faBackward, faCheck, faCircle, faForward } from '@fortawesome/free-solid-svg-icons';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { fromEvent } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';

import { DateRange } from './date-range/date-range.model';
import { DateSelectionMode, DateSelector } from './date-selector.model';
import { ReportsDataService } from './reports-data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  faCheck = faCheck;
  faTwoLeft = faBackward;
  faTwoRight = faForward;
  faCircle = faCircle;

  data: any;
  scheme: any;

  dates: DateRange;
  dateSelector: DateSelector;

  windowWidth: number;
  graphWidth: number;

  constructor(private reportsDataService: ReportsDataService,
              private calendar: NgbCalendar,
              @Inject('windowObject') private window: Window) { }

  ngOnInit() {
    this.scheme = colorSets.find(s => s.name === 'vivid');
    this.dateSelector = new DateSelector(this.calendar);
    this.dates = this.dateSelector.getCurrentPeriod();

    this.windowWidth = this.window.innerWidth - 20;
    fromEvent(window, 'resize').pipe(
      auditTime(100),
      map(event => (event.currentTarget as Window).innerWidth)
    ).subscribe((windowWidth) => {
        this.windowWidth = windowWidth - 20;
        this.graphWidth = Math.min(this.windowWidth, Math.max(400, this.data.length * 25 + 20));
    });

    this.data = this.reportsDataService.getHoursReportData(this.dates.fromDate, this.dates.toDate);
  }

  onBuildReport() {
    this.data = this.reportsDataService.getHoursReportData(this.dates.fromDate, this.dates.toDate);
    this.graphWidth = Math.min(this.windowWidth, Math.max(400, this.data.length * 25 + 20));
  }

  onChangeDateSelectionMode(value: string) {
    console.log(value);
    this.dateSelector.dateSelectionMode = DateSelectionMode[value];
    // this.dateSelector.dateSelectionMode = mode;
    this.dates = this.dateSelector.getCurrentPeriod();
    this.onBuildReport();
  }

  onSelectCurrentPeriod() {
    this.dates = this.dateSelector.getCurrentPeriod();
    this.onBuildReport();
  }

  onSelectNextPeriod() {
    this.dates = this.dateSelector.getNextPeriod();
    this.onBuildReport();
  }

  onSelectPreviousPeriod() {
    this.dates = this.dateSelector.getPreviousPeriod();
    this.onBuildReport();
  }

}

