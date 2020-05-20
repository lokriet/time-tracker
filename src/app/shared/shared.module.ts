import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker/popup-input/datepicker.component';
import { DaysViewComponent } from './datepicker/popup-input/days-view/days-view.component';
import { MonthsViewComponent } from './datepicker/months-view/months-view.component';
import { YearsViewComponent } from './datepicker/years-view/years-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateRangeSelectorComponent } from './datepicker/date-range-selector/date-range-selector.component';
import { DaysRangeViewComponent } from './datepicker/date-range-selector/days-range-view/days-range-view.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FilterStringPipe } from './dropdown/filter-string.pipe';
import { MultipleSelectDropdownComponent } from './dropdown/multiple-select-dropdown/multiple-select-dropdown.component';

@NgModule({
  declarations: [
    DatepickerComponent,
    DaysViewComponent,
    MonthsViewComponent,
    YearsViewComponent,
    DateRangeSelectorComponent,
    DaysRangeViewComponent,
    DropdownComponent,
    FilterStringPipe,
    MultipleSelectDropdownComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    FontAwesomeModule,
    DatepickerComponent,
    DateRangeSelectorComponent,
    DropdownComponent,
    FilterStringPipe,
    MultipleSelectDropdownComponent
  ]
})
export class SharedModule { }
