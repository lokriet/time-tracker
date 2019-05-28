import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';

import { Task } from '../model/task.model';
import { TimeRange } from '../model/time-range.model';
import { Time } from '../model/time.model';
import { Injectable } from '@angular/core';


const initialTasks: Task[] = [
  {
    id: 'JW5NY3D8RLWHL',
    taskName: 'work',
    workDate: {
      day: 1,
      month: 1,
      year: 2019
    },
    workHours: new TimeRange(
      Time.fromString('11:00am'),
      Time.fromString('8:00pm'),
      false),
      breaks: [
        new TimeRange(
          Time.fromString('1:00pm'),
          Time.fromString('1:30pm'),
          false
          )
        ]
      }
    ];
    
export interface TasksState extends EntityState<Task>, ActiveState {}

const initialState = {
  active: null
}

@Injectable({ providedIn: 'root' })
@StoreConfig({name: 'tasks'})
export class TasksStore extends EntityStore<TasksState, Task> {
  constructor() {
    super(initialState);
    for (let task of initialTasks) {
      this.add(task);
    }
  }
}