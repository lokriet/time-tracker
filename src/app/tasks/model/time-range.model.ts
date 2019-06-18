import { Time } from './time.model';

export class TimeRange {
  constructor(public startTime: Time,
              public endTime: Time,
              public isOvernight: boolean) {}

  static fromTimeStrings(startTimeString: string, endTimeString: string) {
    return this.fromDates(new Date(startTimeString), new Date(endTimeString));
  }

  static fromDates(startTimeDate: Date, endTimeDate: Date) {
    const startTime = Time.fromDate(startTimeDate);
    const endTime = Time.fromDate(endTimeDate);
    const isOvernight = startTime.date.getDay() < endTime.date.getDay();

    return new TimeRange(startTime, endTime, isOvernight);
  }
}
