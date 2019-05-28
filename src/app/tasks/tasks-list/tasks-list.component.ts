import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { TasksQuery } from 'src/app/shared/store/tasks.query';
import { Task } from 'src/app/shared/model/task.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private tasksQuery: TasksQuery) { }

  ngOnInit() {
    this.tasks$ = this.tasksQuery.selectAll();
  }
}
