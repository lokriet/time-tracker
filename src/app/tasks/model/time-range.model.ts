import { Time } from './time.model';

export class TimeRange {
  constructor(public startTime: Time, 
              public endTime: Time, 
              public isOvernight: boolean) {}
  
  static fromTimeStrings(startTimeString: string, endTimeString: string) {
    let startTime = Time.fromDate(new Date(startTimeString));
    let endTime = Time.fromDate(new Date(endTimeString));
    let isOvernight = startTime.date.getDay() < endTime.date.getDay();
    
    return new TimeRange(startTime, endTime, isOvernight);
  }
}