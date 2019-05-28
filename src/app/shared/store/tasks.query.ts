import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

import { TasksState, TasksStore } from './tasks.store';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksQuery extends QueryEntity<TasksState, Task> {
  constructor(protected store: TasksStore) {
    super(store);
  }
}