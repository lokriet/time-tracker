import { EntityState, EntityStore, StoreConfig, ActiveState, EntityUIStore } from '@datorama/akita';

import { Task } from '../model/task.model';
import { Injectable } from '@angular/core';


// const initialTasks: Task[] = [
//   {
//     id: 'JW5NY3D8RLWHL',
//     taskName: 'work',
//     workDate: {
//       day: 1,
//       month: 12,
//       year: 2018
//     },
//     workHours: new TimeRange(
//       Time.fromString('11:00am'),
//       Time.fromString('8:00pm'),
//       false),
//     breaks: [
//       new TimeRange(
//         Time.fromString('1:00pm'),
//         Time.fromString('1:30pm'),
//         false
//       )
//     ]
//   },

//   {
//     id: 'JW5NY3D8RLWHP',
//     taskName: 'sleep',
//     workDate: {
//       day: 1,
//       month: 1,
//       year: 2019
//     },
//     workHours: new TimeRange(
//       Time.fromString('11:00am'),
//       Time.fromString('8:00pm'),
//       false),
//     breaks: [
//       new TimeRange(
//         Time.fromString('1:00pm'),
//         Time.fromString('1:30pm'),
//         false
//       ),
//       new TimeRange(
//         Time.fromString('2:00pm'),
//         Time.fromString('2:30pm'),
//         false
//       )

//     ]
//   },

//   {
//     id: 'JW5NY3D8RLWHZ',
//     taskName: 'cat',
//     workDate: {
//       day: 1,
//       month: 1,
//       year: 2019
//     },
//     workHours: new TimeRange(
//       Time.fromString('11:00am'),
//       Time.fromString('8:00pm'),
//       false),
//     breaks: [
//       new TimeRange(
//         Time.fromString('1:00pm'),
//         Time.fromString('1:30pm'),
//         false
//       ),
//       new TimeRange(
//         Time.fromString('2:00pm'),
//         Time.fromString('2:30pm'),
//         false
//       )

//     ]
//   }
// ];
    
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
    this.createUIStore().setInitialEntityState({ isExpanded: false });;
    // for (let task of initialTasks) {
    //   this.add(task);
    // }
  }
}