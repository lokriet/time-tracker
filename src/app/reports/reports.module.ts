import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BarSeriesComponent } from './combo-chart/bar-series.component';
import { ComboChartComponent } from './combo-chart/combo-chart.component';
import { LineSeriesComponent } from './combo-chart/line-series.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { ReportsComponent } from './reports.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ReportsComponent,
    DateRangeComponent,
    ComboChartComponent,
    BarSeriesComponent,
    LineSeriesComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    NgbDatepickerModule,
    FormsModule,
    FontAwesomeModule,
    NgSelectModule
  ],
  providers: [
    { provide: 'windowObject', useValue: window},
    CurrencyPipe
  ]
})
export class ReportsModule { }
