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
  if (a.workDate.getTime() !== b.workDate.getTime()) {
    return b.workDate.getTime() - a.workDate.getTime();
  }

  if (a.workHours.startTime.date.getTime() !== b.workHours.startTime.date.getTime()) {
    return a.workHours.startTime.date.getTime() - b.workHours.startTime.date.getTime();
  }

  return 0;
}
