import { Component, OnInit } from '@angular/core';
import { TasksService } from '../shared/store/tasks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
  }

  onStoreTasks() {
    this.tasksService.storeTasks();
  }

}
