import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DaysViewComponent } from './datepicker/days-view/days-view.component';
import { MonthsViewComponent } from './datepicker/months-view/months-view.component';
import { YearsViewComponent } from './datepicker/years-view/years-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    DatepickerComponent,
    DaysViewComponent,
    MonthsViewComponent,
    YearsViewComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    FontAwesomeModule,
    DatepickerComponent
  ]
})
export class SharedModule { }
