import { Injectable } from '@angular/core';
import { EntityUIQuery, QueryConfig, QueryEntity } from '@datorama/akita';

import { Task } from '../model/task.model';
import { TasksState, TasksStore, TasksUI, TasksUIState } from './tasks.store';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({
  sortBy: compareTasks
})
export class TasksQuery extends QueryEntity<TasksState, Task> {
  ui: EntityUIQuery<TasksUIState, TasksUI>;

  constructor(protected store: TasksStore) {
    super(store);
    this.createUIQuery();
  }
}

export function compareTasks(a: Task, b: Task): number {
  if (a.workDate.year !== b.workDate.year) {
    return b.workDate.year - a.workDate.year;
  }

  if (a.workDate.month !== b.workDate.month) {
    return b.workDate.month - a.workDate.month;
  }

  if (a.workDate.day !== b.workDate.day) {
    return b.workDate.day - a.workDate.day;
  }

  if (a.workHours.startTime.date.getTime() !== b.workHours.startTime.date.getTime()) {
    return b.workHours.startTime.date.getTime() - a.workHours.startTime.date.getTime();
  }

  return 0;
}