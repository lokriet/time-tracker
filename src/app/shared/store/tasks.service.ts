import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ID } from '@datorama/akita';
import { tap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { Task, createTask } from '../model/task.model';
import { TasksStore } from './tasks.store';
import { TasksQuery } from './tasks.query';
import { TimeRange } from '../model/time-range.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private tasksStore: TasksStore,
              private tasksQuery: TasksQuery,
              private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    if (!this.tasksQuery.getHasCache()) {
      const request$ = this.http.get('https://time-tracker-770a9.firebaseio.com/tasks.json')
        .pipe(
          map((taskObjects: Object[]) => {
            let tasks: Task[] = [];
            for (let taskObject of taskObjects) {
              let workHours = TimeRange.fromTimeStrings(<string>taskObject['workHours']['startTime']['date'], <string>taskObject['workHours']['endTime']['date']);
              let breaks: TimeRange[] = [];
              if (taskObject['breaks']) {
                for (let taskBreakObject of taskObject['breaks']) {
                  let taskBreak = TimeRange.fromTimeStrings(<string>taskBreakObject['startTime']['date'], <string>taskBreakObject['endTime']['date']);
                  breaks.push(taskBreak);
                }
              }
              let task: Task = createTask({id: taskObject['id'], taskName: taskObject['taskName'], workDate: taskObject['workDate'], workHours, breaks});
              tasks.push(task);
            }
            return tasks;
          }),
          tap((tasks: Task[]) => this.tasksStore.set(tasks))
        );

        request$.subscribe();
    }

    
    return this.tasksQuery.selectAll();
  }

  addTask(task: Task) {
    this.tasksStore.add(task);
  }

  updateTask(task: Task) {
    this.tasksStore.update(task.id, {...task});
  }

  removeTask(id: ID) {
    this.tasksStore.remove(id);
    this.tasksStore.ui.remove(id);
  }

  updateTaskUiState(id: ID, isExpanded: boolean) {
    this.tasksStore.ui.upsert(id, { isExpanded });
  }

  generateId():ID {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }


  storeTasks() {
    this.http.put(`https://time-tracker-770a9.firebaseio.com/tasks.json`, this.tasksQuery.getAll()).subscribe(() => {
      console.log('saved tasks in the database');
    });
  }
}