
import { TimeRange } from './time-range.model';
import { Task } from './task.model';
import { Time } from './time.model';

export function formatLength(lengthInMillis: number) {
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

 export function formatBreakLength(taskBreak: TimeRange) {
  return formatLength(getLength(taskBreak));
}

export function formatTaskLength(task: Task) {
  let taskLengthInMillis = getLength(task.workHours);
  if (task.breaks) {
    for (let taskBreak of task.breaks) {
      taskLengthInMillis -= getLength(taskBreak);
    }
  }
  return formatLength(taskLengthInMillis);
}

export function getLength(timeRange: TimeRange) {
  return timeRange.endTime.date.getTime() - timeRange.startTime.date.getTime();
}

export function formatTime(time: Time):string {
  return time.hours + ':' + String(time.minutes).padStart(2, '0') + time.ampm;
}