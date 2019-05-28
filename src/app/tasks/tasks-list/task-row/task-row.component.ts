import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { faChevronRight, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';

import { Task } from 'src/app/shared/model/task.model';
import { TasksService } from '../../tasks.service';
import { TasksStore } from 'src/app/shared/store/tasks.store';

@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
  styleUrls: ['./task-row.component.css'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
        state('default', style({ transform: 'rotate(0)' })),
        state('rotated', style({ transform: 'rotate(90deg)' })),
        transition('rotated => default', animate('400ms ease-out')),
        transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})
export class TaskRowComponent implements OnInit {
  @Input() task: Task;
  @Input() index: number;

  faArrowRight = faChevronRight;
  faDelete = faTrashAlt;
  faEdit = faEdit;
  faCoffee = faMugHot;

  state: string = 'default';

  constructor(private tasksService: TasksService,
              private tasksStore: TasksStore,
              private route: ActivatedRoute,
              private router: Router,
               ) { }

  ngOnInit() {
  }

  onArrowClicked() {
    if (this.task.breaks && this.task.breaks.length > 0) {
      if (this.state == 'default') {
        this.state = 'rotated';
      } else {
        this.state = 'default';
      }
    }
  }

  onDeleteTask() {
    this.tasksService.removeTask(this.task.id);
  }

  onEditTask(event: Event) {
    // this.tasksStore.setActive(this.task.id);
    this.router.navigate(['edit', this.task.id], {relativeTo: this.route});
    event.stopPropagation();
  }

}
