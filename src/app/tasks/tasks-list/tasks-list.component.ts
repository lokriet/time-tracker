import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { TasksQuery } from 'src/app/shared/store/tasks.query';
import { Task } from 'src/app/shared/model/task.model';
import { TasksService } from 'src/app/shared/store/tasks.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  tasks: Task[];

  constructor(private tasksQuery: TasksQuery,
              private tasksService: TasksService) { }

  ngOnInit() {
    this.tasks$ = this.tasksService.getTasks();
    // this.tasksService.getTasks().subscribe(
    //   (tasks: Task[]) => {
    //     console.log(tasks);
    //     this.tasks = tasks;
    //   }
    // );

    // this.tasks$.subscribe((tasks: Task[]) => console.log(tasks));
  }

  sameDate(a: Task, b: Task) {
    return a.workDate.year == b.workDate.year && a.workDate.month == b.workDate.month && a.workDate.day == b.workDate.day;
  }
}
