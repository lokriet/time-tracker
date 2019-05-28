import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Time } from '../../../shared/model/time.model';

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

  @ViewChild('wrappingDiv') wrappingDiv: ElementRef;
  @ViewChild('timeInput') timeInput: ElementRef;
  @ViewChild('dropdownDiv') dropdownDiv: ElementRef;

  constructor() { }

  ngOnInit() {
    if (!this.startTime) {
      this.startTime = Time.fromString('6:00am');
    }
    this.generateTimeOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName == 'startTime') {
        if (this.startTime) {
          this.generateTimeOptions();
        }
      }
    }
  }

  private generateTimeOptions() {
    this.timeOptions = [];
    this.timeOptions.push(this.startTime.formatTime());

    let date = new Date(this.startTime.date);
    for (let i = 0; i < 47; i++) {
      date.setMinutes(date.getMinutes() + 30);
      this.timeOptions.push(Time.fromDate(date).formatTime());
    }
  }

  onTimeSelected(timeOption: string) {
    if (timeOption) {
      this.selectedTime = Time.fromString(timeOption);
      this.timeSelected.emit(this.selectedTime);
    } else {
      this.timeSelected.emit(null);
    }
  }

  onKeyPressed(event: KeyboardEvent) {
    if (event.keyCode == 13) { //enter
      let input = <HTMLInputElement> event.target;
      this.onTimeSelected(input.value);

      //hide dropdown
      this.wrappingDiv.nativeElement.classList.remove('show');
      this.dropdownDiv.nativeElement.classList.remove('show');
      this.timeInput.nativeElement.setAttribute("aria-expanded", "false");

      //focus next :(
    }
  }
}
