import { Time } from './time.model';

export class TimeRange {
  constructor(public startTime: Time, 
              public endTime: Time, 
              public isOvernight: boolean) {}
}