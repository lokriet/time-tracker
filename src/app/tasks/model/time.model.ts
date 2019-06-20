export class Time {

  constructor(public hours: number, public minutes: number, public ampm: string, public date: Date) {}

  static fromString(timeString: string): Time {
    // let hours, minutes, ampm, date;

    const pattern = /^(\d?\d):(\d\d)(am|pm)$/gi;

    const [_, hourString, minuteString, ampmString] = pattern.exec(timeString);
    let hourNo = Number(hourString);
    const minuteNo = Number(minuteString);

    const hours = hourNo;
    const minutes = minuteNo;
    const ampm = ampmString;

    if (ampm.toLocaleLowerCase() === 'pm' && hourNo !== 12) {
      hourNo += 12;
    }
    if (ampm.toLocaleLowerCase() === 'am' && hourNo === 12) {
      hourNo = 0;
    }

    const date = new Date(0, 0, 0, hourNo, minuteNo);

    return new Time(hours, minutes, ampm, date);
  }

  static fromDate(date: Date) {
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';

    let hours = date.getHours();
    if (hours === 0) {
      hours = 12;
    }
    if (hours > 12) {
      hours = hours - 12;
    }

    return new Time(hours, date.getMinutes(), ampm, new Date(0, 0, 0, date.getHours(), date.getMinutes(), date.getSeconds()));
  }
}
