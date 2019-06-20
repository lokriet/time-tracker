import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { formatTime } from '../../model/time-formatter.service';
import { Time } from '../../model/time.model';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit, OnChanges {
  timeOptions: string[] = [];
  @Input() selectedTime: Time;
  @Input() id: string;
  @Input() startTime: Time;
  @Output() timeSelected = new EventEmitter<Time>();

  @ViewChild('wrappingDiv', { static: true }) wrappingDiv: ElementRef;
  @ViewChild('timeInput', { static: true }) timeInput: ElementRef;
  @ViewChild('dropdownDiv', { static: true }) dropdownDiv: ElementRef;

  constructor() { }

  ngOnInit() {
    if (!this.startTime) {
      this.startTime = Time.fromString('6:00am');
    }
    this.generateTimeOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'startTime') {
        if (this.startTime) {
          this.generateTimeOptions();
        }
      }
    }
  }

  private generateTimeOptions() {
    this.timeOptions = [];
    this.timeOptions.push(formatTime(this.startTime));

    const date = new Date(this.startTime.date);
    for (let i = 0; i < 47; i++) {
      date.setMinutes(date.getMinutes() + 30);
      this.timeOptions.push(formatTime(Time.fromDate(date)));
    }
  }

  onTimeSelected(timeOption: string) {
    if (timeOption) {
      if (this.validateTimeString(timeOption)) {
        this.selectedTime = Time.fromString(timeOption);
        this.timeSelected.emit(this.selectedTime);
      } else {
        this.timeSelected.emit(null);
      }
    } else {
      this.timeSelected.emit(null);
    }
  }

  onKeyPressed(event: KeyboardEvent) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation();

      this.checkAndReplaceInputFormat();
      const input = event.target as HTMLInputElement;
      this.onTimeSelected(input.value);

      // hide dropdown
      this.wrappingDiv.nativeElement.classList.remove('show');
      this.dropdownDiv.nativeElement.classList.remove('show');
      this.timeInput.nativeElement.setAttribute('aria-expanded', 'false');

      // focus next :(
    }
  }

  formatTime() {
    if (this.selectedTime) {
      return formatTime(this.selectedTime);
    }

    return '';
  }


  checkAndReplaceInputFormat() {
    const inputPattern = /^(\d?\d)(:\d\d)?(am|pm)?$/gi;

    if (inputPattern.test(this.timeInput.nativeElement.value)) {
      inputPattern.lastIndex = 0;

      let [_, hoursString, minutesString, ampm] = inputPattern.exec(this.timeInput.nativeElement.value);

      let hoursNo = +hoursString;

      let minutesNo: number;
      if (!minutesString) {
        minutesNo = 0;
      } else {
        minutesNo = Number(minutesString.slice(1));
      }

      if (!ampm) {
        if (hoursNo < 12) {
          ampm = 'am';
          if (hoursNo === 0) {
            hoursNo = 12;
          }
        } else {
          ampm = 'pm';
          if (hoursNo !== 12) {
            hoursNo -= 12;
          }
        }
      }

      if (!(hoursNo < 0 || hoursNo > 12 || minutesNo < 0 || minutesNo > 59)) {
        const replaceString = String(hoursNo) + ':' +  String(minutesNo).padStart(2, '0') + ampm;
        this.timeInput.nativeElement.value = replaceString;
      }

    }

  }

  validateTimeString(timeString: string): boolean {
    const acceptedPattern = /^(\d?\d):(\d\d)(am|pm)$/gi;
    if (!acceptedPattern.test(timeString)) {
      this.timeInput.nativeElement.classList.remove('ng-valid');
      this.timeInput.nativeElement.classList.add('ng-invalid');
      return false;
    } else {
      acceptedPattern.lastIndex = 0;
      const [_, hoursString, minutesString, __] = acceptedPattern.exec(timeString);
      const hoursNo = +hoursString;
      const minutesNo = +minutesString;

      if (!(hoursNo < 0 || hoursNo > 12 || minutesNo < 0 || minutesNo > 59)) {
        this.timeInput.nativeElement.classList.remove('ng-invalid');
        this.timeInput.nativeElement.classList.add('ng-valid');
        return true;
      } else {
        this.timeInput.nativeElement.classList.remove('ng-valid');
        this.timeInput.nativeElement.classList.add('ng-invalid');
        return false;
      }
    }
  }
}
