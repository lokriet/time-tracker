import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { faChevronRight, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { Task } from 'src/app/tasks/model/task.model';
import { TasksService } from '../../store/tasks.service';
import { TasksUI } from 'src/app/tasks/store/tasks.store';
import { TimeRange } from 'src/app/tasks/model/time-range.model';
import { formatTime, formatBreakLength, formatTaskLength } from 'src/app/tasks/model/time-formatter.service';
import { TasksQuery } from 'src/app/tasks/store/tasks.query';
import { ID } from '@datorama/akita';

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
export class TaskRowComponent implements OnInit, OnDestroy {
  
  @Input() task: Task;
  @Input() index: number;

  faArrowRight = faChevronRight;
  faDelete = faTrashAlt;
  faEdit = faEdit;
  faCoffee = faMugHot;

  state: string = 'default';
  
  initialExpandedValue: boolean;
  taskUIstate: TasksUI = {isExpanded: false};

  constructor(private tasksService: TasksService,
              private tasksQuery: TasksQuery,
              private route: ActivatedRoute,
              private router: Router ) { }

  ngOnInit() {
    this.initialExpandedValue = this.tasksQuery.ui.getAll().find((item: {id: ID, isExpanded: boolean}) => item.id == this.task.id).isExpanded;

    this.tasksQuery.ui.selectEntity(this.task.id).pipe(
      untilDestroyed(this)
    ).subscribe(taskUIstate => {
      if (taskUIstate) {
        this.taskUIstate = taskUIstate;
        this.state = this.taskUIstate.isExpanded ? 'rotated' : 'default';
      }
    })
  }

  onArrowClicked() {
    if (this.task.breaks && this.task.breaks.length > 0) {
      this.tasksService.updateTaskUiState(this.task.id, !this.taskUIstate.isExpanded);
    }
  }

  onDeleteTask(event: Event) {
    event.stopPropagation();
    let shouldNavigateAway = this.tasksQuery.getActiveId() == this.task.id;
    this.tasksService.removeTask(this.task.id);
    if (shouldNavigateAway) {
      this.router.navigate(['tasks']);
    }
  }

  onEditTask(event: Event) {
    event.stopPropagation();
    this.router.navigate(['edit', this.task.id], {relativeTo: this.route});
  }

  formatTimeRange(timeRange: TimeRange) {
    if (timeRange) {
      return formatTime(timeRange.startTime) + '-' + formatTime(timeRange.endTime);
    }
    return '';
  }

  formatBreakLength(taskBreak: TimeRange) {
    if (taskBreak) {
      return formatBreakLength(taskBreak);
    }
    return '';
  }

  formatTaskLength(task: Task) {
    if (task) {
      return formatTaskLength(task);
    }
    return '';
  }

  ngOnDestroy(): void {
    
  }
}
