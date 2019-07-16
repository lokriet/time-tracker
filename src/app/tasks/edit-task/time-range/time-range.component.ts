import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TimeRange } from '../../model/time-range.model';
import { Time } from '../../model/time.model';


export const TIME_RANGE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimeRangeComponent),
  multi: true,
};

@Component({
  selector: 'app-time-range',
  providers: [TIME_RANGE_VALUE_ACCESSOR],
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss']
})
export class TimeRangeComponent implements ControlValueAccessor {
  startTime: Time;
  endTime: Time;
  isOvernight = false;
  timeRange: TimeRange;

  onChange;

  @Input() id: string;

  constructor() { }

  onStartTimeSelected(startTime: Time) {
    this.startTime = startTime;
    this.checkOvernightAndEmit();
  }

  onEndTimeSelected(endTime: Time) {
    this.endTime = endTime;
    this.checkOvernightAndEmit();
  }

  checkOvernightAndEmit() {
    if (this.startTime && this.endTime) {
      if (this.startTime.date.getTime() > this.endTime.date.getTime()) {
        this.isOvernight = true;
        this.endTime.date.setDate(this.endTime.date.getDate() + 1);
      } else {
        this.isOvernight = false;
      }
      this.timeRange = new TimeRange(this.startTime, this.endTime, this.isOvernight);
    } else {
      this.timeRange = null;
    }

    this.onChange(this.timeRange);
  }

  writeValue(obj: TimeRange): void {
    this.timeRange = obj;
    if (this.timeRange) {
      this.startTime = obj.startTime;
      this.endTime = obj.endTime;
      this.isOvernight = obj.isOvernight;
    } else {
      this.startTime = null;
      this.endTime = null;
      this.isOvernight = false;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO
  }

}
