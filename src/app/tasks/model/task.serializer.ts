import { Task, createTask } from './task.model';
import { TimeRange } from './time-range.model';
import { Time } from './time.model';
import { Injectable } from '@angular/core';
import { ProjectsQuery } from 'src/app/projects/store/projects.query';

@Injectable({
  providedIn: 'root'
})
export class TaskSerializer {
  constructor(private projectQuery: ProjectsQuery) { }

  serializeTask(task: Task) : any {
    let breakObjects = [];
    if (task.breaks) {
      for (let taskBreak of task.breaks) {
        breakObjects.push(this.serializeTimeRange(taskBreak));
      }
    }
  
    return {
      id: task.id,
      ownerId: task.ownerId,
      description: task.description,
      project: task.project ? task.project.id : null,
      workDate: {
        day: task.workDate.day,
        month: task.workDate.month,
        year: task.workDate.year
      },
      workHours: this.serializeTimeRange(task.workHours),
      breaks: breakObjects
    }
  }
  
  serializeTimeRange(timeRange: TimeRange): any {
    return {
      startTime: this.serializeTime(timeRange.startTime),
      endTime: this.serializeTime(timeRange.endTime),
      isOvernight: timeRange.isOvernight
    }
  }
  
  serializeTime(time: Time): any {
    return {
      hours: time.hours, 
      minutes: time.minutes, 
      ampm: time.ampm, 
      date: time.date.toISOString()
    }
  }
  
  deserializeTask(taskObject: any): Task {
    let workHours = TimeRange.fromTimeStrings(<string>taskObject['workHours']['startTime']['date'], <string>taskObject['workHours']['endTime']['date']);
    let project = null;
    if (taskObject['project']) {
      project = this.projectQuery.getEntity(<string>taskObject['project']);
    }
    let breaks: TimeRange[] = [];
    if (taskObject['breaks']) {
      for (let taskBreakObject of taskObject['breaks']) {
        let taskBreak = TimeRange.fromTimeStrings(<string>taskBreakObject['startTime']['date'], <string>taskBreakObject['endTime']['date']);
        breaks.push(taskBreak);
      }
    }
    let task: Task = createTask({id: taskObject['id'], 
                                ownerId: taskObject['ownerId'], 
                                description: taskObject['description'],
                                project: project, 
                                workDate: taskObject['workDate'], 
                                workHours, 
                                breaks});
  
    return task;
  }
}