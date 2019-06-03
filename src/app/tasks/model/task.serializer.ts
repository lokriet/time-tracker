import { Task, createTask } from './task.model';
import { TimeRange } from './time-range.model';
import { Time } from './time.model';

export function serializeTask(task: Task) : any {
  let breakObjects = [];
  if (task.breaks) {
    for (let taskBreak of task.breaks) {
      breakObjects.push(serializeTimeRange(taskBreak));
    }
  }

  return {
    id: task.id,
    ownerId: task.ownerId,
    taskName: task.taskName,
    workDate: {
      day: task.workDate.day,
      month: task.workDate.month,
      year: task.workDate.year
    },
    workHours: serializeTimeRange(task.workHours),
    breaks: breakObjects
  }
}

function serializeTimeRange(timeRange: TimeRange): any {
  return {
    startTime: serializeTime(timeRange.startTime),
    endTime: serializeTime(timeRange.endTime),
    isOvernight: timeRange.isOvernight
  }
}

function serializeTime(time: Time): any {
  return {
    hours: time.hours, 
    minutes: time.minutes, 
    ampm: time.ampm, 
    date: time.date.toISOString()
  }
}

export function deserializeTask(taskObject: any): Task {
  let workHours = TimeRange.fromTimeStrings(<string>taskObject['workHours']['startTime']['date'], <string>taskObject['workHours']['endTime']['date']);
  let breaks: TimeRange[] = [];
  if (taskObject['breaks']) {
    for (let taskBreakObject of taskObject['breaks']) {
      let taskBreak = TimeRange.fromTimeStrings(<string>taskBreakObject['startTime']['date'], <string>taskBreakObject['endTime']['date']);
      breaks.push(taskBreak);
    }
  }
  let task: Task = createTask({id: taskObject['id'], ownerId: taskObject['ownerId'], taskName: taskObject['taskName'], workDate: taskObject['workDate'], workHours, breaks});

  return task;
}