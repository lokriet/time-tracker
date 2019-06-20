import { Injectable } from '@angular/core';

import { ProjectsQuery } from '../../projects/store/projects.query';
import { SimpleDate } from './simple-date.model';
import { createTask, Task } from './task.model';
import { TimeRange } from './time-range.model';
import { Time } from './time.model';

@Injectable({
  providedIn: 'root'
})
export class TaskSerializer {
  constructor(private projectQuery: ProjectsQuery) { }

  public serializeTask(task: Task): any {
    const breakObjects = [];
    if (task.breaks) {
      for (const taskBreak of task.breaks) {
        if (taskBreak) {
          breakObjects.push(this.serializeTimeRange(taskBreak));
        }
      }
    }

    return {
      id: task.id,
      ownerId: task.ownerId,
      description: task.description,
      project: task.project ? task.project.id : null,
      workDate: task.workDate ? this.serializeDate(task.workDate) : null,
      workHours: task.workHours ? this.serializeTimeRange(task.workHours) : null,
      breaks: breakObjects
    };
  }

  private serializeDate(date: SimpleDate) {
    return {
      day: date.day,
      month: date.month,
      year: date.year
    };
  }

  private serializeTimeRange(timeRange: TimeRange): any {
    return {
      startTime: this.serializeTime(timeRange.startTime),
      endTime: this.serializeTime(timeRange.endTime),
      isOvernight: timeRange.isOvernight
    };
  }

  private serializeTime(time: Time): any {
    return {
      hours: time.hours,
      minutes: time.minutes,
      ampm: time.ampm,
      date: time.date.toISOString()
    }
  }

  public deserializeTask(taskObject: any): Task {
    let workHours = null;
    if (taskObject.workHours) {
      workHours = TimeRange.fromTimeStrings(taskObject.workHours.startTime.date as string,
                                            taskObject.workHours.endTime.date as string);
    }

    let project = null;
    if (taskObject.project) {
      project = this.projectQuery.getEntity(taskObject.project as string);
    }

    const breaks: TimeRange[] = [];
    if (taskObject.breaks) {
      for (const taskBreakObject of taskObject.breaks) {
        const taskBreak = TimeRange.fromTimeStrings(taskBreakObject.startTime.date as string,
                                                    taskBreakObject.endTime.date as string);
        breaks.push(taskBreak);
      }
    }
    const task: Task = createTask({id: taskObject.id,
                                ownerId: taskObject.ownerId,
                                description: taskObject.description,
                                project,
                                workDate: taskObject.workDate,
                                workHours,
                                breaks});

    return task;
  }
}
