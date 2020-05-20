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
import { DropdownComponent } from 'src/app/shared/dropdown/dropdown.component';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  animations: [
    trigger('collapsed', [
      state('true', style({ height: 0 })),
      state('false', style({ height: '*' })),
      transition('true => false', animate('400ms ease-in')),
      transition('false => true', animate('400ms ease-out'))
  ])]
})
export class TimeComponent extends DropdownComponent implements OnInit, OnChanges {
  @Input() id: string;
  @Input() startTime: Time;
  @Output() timeSelected = new EventEmitter<Time>();

  // @ViewChild('dropdownInput', { static: true }) timeInput: ElementRef;


  ngOnInit() {
    if (!this.startTime) {
      this.startTime = Time.fromString('6:00am');
    }

    this.generateTimeOptions();
    super.ngOnInit();
    this.findMatchingSelectedItemIndex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'startTime') {
        if (this.startTime) {
          this.generateTimeOptions();
        }
      } else if (propName === 'selectedItem') {
        this.findMatchingSelectedItemIndex();
      }
    }
  }

  private findMatchingSelectedItemIndex() {
    this.selectedItemIndex = 0;
    if (this.selectedItem) {
      const selectedItemString = formatTime(this.selectedItem);
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i] === selectedItemString) {
          this.selectedItemIndex = i;
          break;
        }
      }
    }
  }

  private generateTimeOptions() {
    this.items = [];
    this.items.push(formatTime(this.startTime));

    const date = new Date(this.startTime.date);
    for (let i = 0; i < 47; i++) {
      date.setMinutes(date.getMinutes() + 30);
      this.items.push(formatTime(Time.fromDate(date)));
    }
  }


  private onTimeSelected(timeOption: string) {
    if (timeOption) {
      if (this.validateTimeString(timeOption)) {
        this.selectedItem = Time.fromString(timeOption);
        this.timeSelected.emit(this.selectedItem);
      } else {
        this.timeSelected.emit(null);
      }
    } else {
      this.timeSelected.emit(null);
    }

    this.dropdownOpen = false;
  }

  onItemSelected(i: number) {
    this.onTimeSelected(/*timeOption*/this.items[i]);
    this.selectedItemIndex = i;
  }

  onDropdownInputKey(event: KeyboardEvent) {
    if (event.keyCode === 13) { // enter
      event.stopPropagation(); // don't submit the form

      this.checkAndReplaceInputFormat();
      const input = event.target as HTMLInputElement;
      this.onTimeSelected(input.value);

      // focus next :(
    } else {
      super.onDropdownInputKey(event);
    }
  }

  formatTime() {
    if (this.selectedItem) {
      return formatTime(this.selectedItem);
    }

    return '';
  }


  private checkAndReplaceInputFormat() {
    const inputPattern = /^(\d?\d)(:\d\d)?(am|pm)?$/gi;

    if (inputPattern.test(this.dropdownInput.nativeElement.value)) {
      inputPattern.lastIndex = 0;

      let [_, hoursString, minutesString, ampm] = inputPattern.exec(this.dropdownInput.nativeElement.value);

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
        this.dropdownInput.nativeElement.value = replaceString;
      }

    }

  }

  private validateTimeString(timeString: string): boolean {
    const acceptedPattern = /^(\d?\d):(\d\d)(am|pm)$/gi;
    if (!acceptedPattern.test(timeString)) {
      this.dropdownInput.nativeElement.classList.remove('ng-valid');
      this.dropdownInput.nativeElement.classList.add('ng-invalid');
      return false;
    } else {
      acceptedPattern.lastIndex = 0;
      const [_, hoursString, minutesString, __] = acceptedPattern.exec(timeString);
      const hoursNo = +hoursString;
      const minutesNo = +minutesString;

      if (!(hoursNo < 0 || hoursNo > 12 || minutesNo < 0 || minutesNo > 59)) {
        this.dropdownInput.nativeElement.classList.remove('ng-invalid');
        this.dropdownInput.nativeElement.classList.add('ng-valid');
        return true;
      } else {
        this.dropdownInput.nativeElement.classList.remove('ng-valid');
        this.dropdownInput.nativeElement.classList.add('ng-invalid');
        return false;
      }
    }
  }
}
