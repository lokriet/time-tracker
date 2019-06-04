import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Task } from 'src/app/tasks/model/task.model';
import { TasksService } from 'src/app/tasks/store/tasks.service';
import { AuthService } from 'src/app/auth/store/auth.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private tasksService: TasksService,
              private authService: AuthService) { }

  ngOnInit() {
    this.tasks$ = this.tasksService.getTasksByOwnerId(this.authService.getCurrentUserUid());
  }

  sameDate(a: Task, b: Task) {
    return a.workDate.year == b.workDate.year && a.workDate.month == b.workDate.month && a.workDate.day == b.workDate.day;
  }
}
