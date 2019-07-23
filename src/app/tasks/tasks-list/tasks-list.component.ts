import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/store/auth.service';
import { Task } from 'src/app/tasks/model/task.model';

import { compareTasks, TasksQuery } from '../store/tasks.query';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private tasksQuery: TasksQuery,
              private authService: AuthService) { }

  ngOnInit() {
    this.tasks$ = this.tasksQuery.selectAll({
      sortBy: compareTasks,
      filterBy: (task) => task.ownerId === this.authService.getCurrentUserUid()
    });
  }

  sameDate(a: Task, b: Task) {
    return a.workDate.getTime() === b.workDate.getTime();
  }
}
