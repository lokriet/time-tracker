import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { faBackward, faCheck, faCircle, faForward } from '@fortawesome/free-solid-svg-icons';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { fromEvent } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';

import { DateRange } from './date-range/date-range.model';
import { DateSelectionMode, DateSelector } from './date-selector.model';
import { formatHours, ReportsDataService } from './reports-data.service';

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

  reportType = 'hours';

  data: any;
  totalsData: any;
  scheme: any;

  dates: DateRange;
  dateSelector: DateSelector;

  windowWidth: number;
  graphWidth: number;

  hoursPieTooltipText = this.formatHoursPieLabel.bind(this);
  moneyPieTooltipText = this.formatMoneyPieLabel.bind(this);

  constructor(private reportsDataService: ReportsDataService,
              private calendar: NgbCalendar,
              @Inject('windowObject') private window: Window,
              private currencyPipe: CurrencyPipe) { }

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

    this.data = this.reportsDataService.getHoursBarReportData(this.dates.fromDate, this.dates.toDate, null);
    this.totalsData = this.reportsDataService.getBarReportDataTotals(this.data);
  }

  onBuildReport() {
    switch (this.reportType) {
      case 'hours':
        this.data = this.reportsDataService.getHoursBarReportData(this.dates.fromDate, this.dates.toDate, null);
        this.totalsData = this.reportsDataService.getBarReportDataTotals(this.data);
        this.graphWidth = Math.min(this.windowWidth, Math.max(400, this.data.length * 25 + 20));
        break;
      case 'money':
        this.data = this.reportsDataService.getMoneyBarReportData(this.dates.fromDate, this.dates.toDate, null);
        this.totalsData = this.reportsDataService.getBarReportDataTotals(this.data);
        this.graphWidth = Math.min(this.windowWidth, Math.max(400, this.data.length * 25 + 20));
        break;
      case 'combined':
        this.data = {
          hours: this.reportsDataService.getHoursBarReportData(this.dates.fromDate, this.dates.toDate, null),
          money: this.reportsDataService.getMoneyLineReportData(this.dates.fromDate, this.dates.toDate, null)
        };
        this.graphWidth = Math.min(this.windowWidth, Math.max(400, this.data.hours.length * 25 + 20));
        this.totalsData = {
          hours: this.reportsDataService.getBarReportDataTotals(this.data.hours),
          money: this.reportsDataService.getBarReportDataTotals(
                                            this.reportsDataService.getMoneyBarReportData(this.dates.fromDate, this.dates.toDate, null)
                                         )
        };
        break;
    }
  }

  onChangeDateSelectionMode(value: string) {
    this.dateSelector.dateSelectionMode = DateSelectionMode[value];
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

  onDatesSelected(dates: DateRange) {
    this.dates = dates;
    if (!!dates) {
      this.dateSelector.setSelectedPeriod(dates);
      this.onBuildReport();
    }
  }

  reportTypeChanged() {
    if (!!this.dates) {
      this.onBuildReport();
    }
  }

  formatHours(hours: number) {
    return formatHours(hours);
  }

  formatMoney(amount: number) {
    return this.currencyPipe.transform(amount);
  }

  formatHoursPieLabel({ data }) {
    const value = this.formatHours(data.value);
    return `
      <span class="tooltip-label">${data.name}</span>
      <span class="tooltip-val">${value}</span>
    `;
  }

  formatMoneyPieLabel({ data }) {
    const value = this.formatMoney(data.value);
    return `
      <span class="tooltip-label">${data.name}</span>
      <span class="tooltip-val">${value}</span>
    `;
  }


}

