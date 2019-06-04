import { EntityState, EntityStore, StoreConfig, ActiveState, EntityUIStore } from '@datorama/akita';

import { Task } from '../model/task.model';
import { Injectable } from '@angular/core';
    
export interface TasksState extends EntityState<Task>, ActiveState {}

export interface TasksUI {
  isExpanded: boolean;
}

export interface TasksUIState extends EntityState<TasksUI> {}

const initialState = {
  active: null
}

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'tasks'})
export class TasksStore extends EntityStore<TasksState, Task> {
  ui: EntityUIStore<TasksUIState, TasksUI>;

  constructor() {
    super(initialState);
    this.createUIStore().setInitialEntityState({ isExpanded: false });
  }
}