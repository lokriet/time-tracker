import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from 'src/app/shared/task.model';
import { TasksService } from '../tasks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {
  tasks: Task[];
  tasksSubscription: Subscription;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.tasks = this.tasksService.getTasks();
    this.tasksService.tasksChanged.subscribe(
      () => {
        this.tasks = this.tasksService.getTasks();
      }
    )
  }

  ngOnDestroy() {
    this.tasksSubscription.unsubscribe();
  }
}
