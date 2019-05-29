import { Injectable } from '@angular/core';

import { QueryEntity, EntityUIQuery, QueryConfig, Order } from '@datorama/akita';

import { TasksState, TasksStore, TasksUI, TasksUIState } from './tasks.store';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
@QueryConfig({
  sortBy: compareTasks,
  sortByOrder: Order.DESC
})
export class TasksQuery extends QueryEntity<TasksState, Task> {
  ui: EntityUIQuery<TasksUIState, TasksUI>;

  constructor(protected store: TasksStore) {
    super(store);
    this.createUIQuery();
  }
}

export function compareTasks(a: Task, b: Task): number {
  if (a.workDate.year != b.workDate.year) {
    return a.workDate.year - b.workDate.year;
  }

  if (a.workDate.month != b.workDate.month) {
    return a.workDate.month - b.workDate.month;
  }

  if (a.workDate.day != b.workDate.day) {
    return a.workDate.day - b.workDate.day;
  }

  if (a.workHours.startTime.date.getTime() != b.workHours.startTime.date.getTime()) {
    return a.workHours.startTime.date.getTime() - b.workHours.startTime.date.getTime();
  }

  return 0;
}