import { Injectable } from '@angular/core';

import { ID } from '@datorama/akita';

import { Task } from '../shared/model/task.model';
import { TasksStore } from '../shared/store/tasks.store';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private tasksStore: TasksStore) {}

  addTask(task: Task) {
    this.tasksStore.add(task);
  }

  updateTask(task: Task) {
    this.tasksStore.update(task.id, {...task});
  }

  removeTask(id: ID) {
    this.tasksStore.remove(id);
  }

  generateId():ID {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }
}