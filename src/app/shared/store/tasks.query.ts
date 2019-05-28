import { Injectable } from '@angular/core';

import { QueryEntity, EntityUIQuery } from '@datorama/akita';

import { TasksState, TasksStore, TasksUI, TasksUIState } from './tasks.store';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksQuery extends QueryEntity<TasksState, Task> {
  ui: EntityUIQuery<TasksUIState, TasksUI>;

  constructor(protected store: TasksStore) {
    super(store);
    this.createUIQuery();
  }
}