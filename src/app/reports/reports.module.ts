import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BarSeriesComponent } from './combo-chart/bar-series.component';
import { ComboChartComponent } from './combo-chart/combo-chart.component';
import { LineSeriesComponent } from './combo-chart/line-series.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [
    ReportsComponent,
    DateRangeComponent,
    ComboChartComponent,
    BarSeriesComponent,
    LineSeriesComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    NgbDatepickerModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: 'windowObject', useValue: window}
  ]
})
export class ReportsModule { }
