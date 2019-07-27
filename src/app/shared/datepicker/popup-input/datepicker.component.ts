import { Component, OnInit, Input, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

enum View {
  DAYS,
  MONTHS,
  YEARS
}

export const DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true,
};


@Component({
  selector: 'app-datepicker',
  providers: [DATEPICKER_VALUE_ACCESSOR],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  animations: [
    trigger(
      'openAnimation', [
        transition(':enter', [
          style({height: 0, borderColor: 'transparent'}),
          animate('400ms', style({height: '20rem', borderColor: '#bee4e6'}))
        ]),
        transition(':leave', [
          style({height: '20rem', borderColor: '#bee4e6'}),
          animate('400ms', style({height: 0, borderColor: 'transparent'}))
        ])
      ]
    ),

    trigger(
      'pointerAnimation', [
        transition(':enter', [
          style({borderColor: 'transparent'}),
          animate('400ms', style({borderColor: '#bee4e6 transparent transparent #bee4e6'}))
        ]),
        transition(':leave', [
          style({borderColor: '#bee4e6 transparent transparent #bee4e6'}),
          animate('400ms', style({borderColor: 'transparent'}))
        ])
      ]
    )
  ]
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {
  faCalendar = faCalendarAlt;

  selectedDate: Date;
  currentView: View;
  viewMonth: Date;
  viewYear: number;
  showPopup: boolean;

  @ViewChild('datePickerControl', { static: true }) datePickerControl: ElementRef;
  @ViewChild('calendarInput', { static: true }) calendarInput: ElementRef;

  onChange: any = () => { };

  constructor() { }

  ngOnInit() {
    this.initPopup(null);
    this.showPopup = false;

    document.addEventListener('mouseup', (event: MouseEvent) => {
      if (!this.datePickerControl.nativeElement.contains(event.target)) {
        this.showPopup = false;
      }
    });
  }

  initPopup(selectedDate: Date) {
    this.viewYear = null;
    this.viewMonth = null;
    this.selectedDate = selectedDate;
    if (this.selectedDate) {
      this.viewMonth = new Date(this.selectedDate);
      this.viewMonth.setDate(1);
    }
    this.currentView = View.DAYS;
  }

  onShowDaySelector(month: Date) {
    this.viewYear = null;
    this.viewMonth = month;
    this.currentView = View.DAYS;
  }

  onShowMonthSelector(year: number) {
    this.viewMonth = null;
    this.viewYear = year;
    this.currentView = View.MONTHS;
  }

  onShowYearSelector(decade: number) {
    this.viewMonth = null;
    this.viewYear = decade;
    this.currentView = View.YEARS;
  }

  onDateSelectedInPopup(date: Date) {
    this.calendarInput.nativeElement.classList.remove('ng-invalid');
    this.calendarInput.nativeElement.classList.add('ng-valid');
    this.onDateSelected(date);
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.showPopup = false;

    this.onChange(this.selectedDate);
  }

  showDaysView(): boolean {
    return this.currentView === View.DAYS;
  }

  showMonthsView(): boolean {
    return this.currentView === View.MONTHS;
  }

  showYearsView(): boolean {
    return this.currentView === View.YEARS;
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
    if (this.showPopup) {
      this.initPopup(this.selectedDate);
    }
  }

  formatSelectedDate(): string {
    if (this.selectedDate) {
      return this.selectedDate.getFullYear() + '-' +
             ((this.selectedDate.getMonth() + 1) + '').padStart(2, '0') + '-' +
             (this.selectedDate.getDate() + '').padStart(2, '0');
    }

    return null;
  }

  onKeyPressed(event: KeyboardEvent) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation();

      const inputPattern = /^(\d\d\d\d)([-|/]\d\d?)([-|/]\d\d?)$/gi;
      const input = this.calendarInput.nativeElement.value;

      let valid = true;
      let selectedDate = null;

      if (inputPattern.test(input)) {
        inputPattern.lastIndex = 0;

        let [_, year, month, day] = inputPattern.exec(input);
        const yearNo = +year;
        const monthNo = +month.slice(1);
        const dayNo = +day.slice(1);

        if (yearNo < 1900 || monthNo < 1 || monthNo > 12 || dayNo < 1 || dayNo > 31) {
          valid = false;
        } else {
          selectedDate = new Date(yearNo, monthNo - 1, dayNo, 0, 0, 0, 0);

          // day number is not after month end
          if (selectedDate.getMonth() !== (monthNo - 1)) {
            valid = false;
          } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
              valid = false;
              selectedDate = null;
            }
          }

        }
      } else {
        valid = false;
      }

      this.onDateSelected(selectedDate);
      if (valid) {
        this.calendarInput.nativeElement.classList.remove('ng-invalid');
        this.calendarInput.nativeElement.classList.add('ng-valid');
      } else {
        this.calendarInput.nativeElement.classList.remove('ng-valid');
        this.calendarInput.nativeElement.classList.add('ng-invalid');
        this.calendarInput.nativeElement.value = input;
      }

      // focus next :(
    }
  }

  writeValue(obj: Date): void {
    this.selectedDate = obj;
    this.showPopup = false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO
  }
}
