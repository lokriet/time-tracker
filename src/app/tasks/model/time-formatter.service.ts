import { Task } from './task.model';
import { TimeRange } from './time-range.model';
import { Time } from './time.model';


export function formatLength(lengthInMillis: number) {
  const secondsLength = Math.floor(lengthInMillis / 1000);
  const resultSeconds = secondsLength % 60;

  const minutesLength = Math.floor(secondsLength / 60);
  const resultMinutes = minutesLength % 60;
  const resultHours = (minutesLength - resultMinutes) / 60;

  let result = '';
  if (resultHours > 0) {
    result += `${resultHours}h`;
  }

  if (resultMinutes > 0 || (resultHours === 0 && resultSeconds === 0)) {
    result += ` ${resultMinutes}min`;
  }

  if (resultSeconds > 0) {
    result += ` ${resultSeconds}sec`;
  }

  return result.trim();
}

export function formatBreakLength(taskBreak: TimeRange) {
  return formatLength(getTimeRangeLength(taskBreak));
}

export function formatTaskLength(task: Task) {
  return formatLength(getTaskLength(task));
}

export function getTaskLength(task: Task): number {
  let taskLengthInMillis = getTimeRangeLength(task.workHours);
  if (task.breaks) {
    for (let taskBreak of task.breaks) {
      taskLengthInMillis -= getTimeRangeLength(taskBreak);
    }
  }
  return taskLengthInMillis;
}

export function getTimeRangeLength(timeRange: TimeRange) {
  return timeRange.endTime.date.getTime() - timeRange.startTime.date.getTime();
}

export function formatTime(time: Time): string {
  return time.hours + ':' + String(time.minutes).padStart(2, '0') + time.ampm;
}
