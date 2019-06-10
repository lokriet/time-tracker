import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/store/auth.service';
import { Task } from 'src/app/tasks/model/task.model';

import { compareTasks, TasksQuery } from '../store/tasks.query';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private tasksQuery: TasksQuery,
              private authService: AuthService) { }

  ngOnInit() {
    this.tasks$ = this.tasksQuery.selectAll({
      sortBy: compareTasks,
      filterBy: (entity) => entity.ownerId === this.authService.getCurrentUserUid()
    });
  }

  sameDate(a: Task, b: Task) {
    return a.workDate.year == b.workDate.year && a.workDate.month == b.workDate.month && a.workDate.day == b.workDate.day;
  }
}
