import { Time } from './time.model';

export class TimeRange {
  constructor(public startTime: Time, public endTime: Time, public isOvernight: boolean) {}

  formatLength():string {
    let lengthInMillis = this.endTime.date.getTime() - this.startTime.date.getTime();

    let minutesLength = lengthInMillis / (1000 * 60);
    let resultMinutes = minutesLength % 60;
    let resultHours = Math.round((minutesLength - resultMinutes) / 60);
    
    let result = '';
    if (resultHours > 0) {
      result += `${resultHours}h`; 
    }
    if (resultHours != 0 && resultMinutes != 0) {
      result += ' ';
    }
    if (resultMinutes > 0 || resultHours == 0) {
      result += `${resultMinutes}min`;
    }

    return result;
  }
}