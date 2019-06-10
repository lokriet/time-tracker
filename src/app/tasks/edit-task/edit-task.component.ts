import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Order } from '@datorama/akita';
import { faAngry, faHeart, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDoubleRight,
  faCalendarAlt,
  faCheck,
  faHeart as faFullHeart,
  faMugHot,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth/store/auth.service';
import { Project } from '../../projects/project.model';
import { ProjectsService } from '../../projects/store/projects.service';
import { Task } from '../../tasks/model/task.model';
import { formatBreakLength, formatLength, getTimeRangeLength } from '../../tasks/model/time-formatter.service';
import { TimeRange } from '../../tasks/model/time-range.model';
import { TasksQuery } from '../../tasks/store/tasks.query';
import { TasksStore } from '../../tasks/store/tasks.store';
import { TasksService } from '../store/tasks.service';
import { timeRangesValidator } from './edit-task.validators';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit, OnDestroy {
  faCalendar = faCalendarAlt;
  faCoffee = faMugHot;
  faRightArrow = faAngleDoubleRight;
  faDelete = faTrashAlt;
  faCheck = faCheck;
  faBug = faAngry;
  faReload = faSyncAlt;
  faEmptyHeart = faHeart;
  faFullHeart = faFullHeart;

  taskForm: FormGroup;
  editMode = false;
  errorMessages: string[] = [];

  projects$: Observable<Project[]>;

  constructor(private calendar: NgbCalendar,
              private tasksService: TasksService,
              private tasksQuery: TasksQuery,
              private tasksStore: TasksStore,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    console.log('initializing edit task component...');
    this.route.params.subscribe(
      (params: Params) => {
        console.log('edit task page route param updated, processing...');
        this.tasksStore.setActive(params.id);
        const task = this.tasksQuery.getActive();
        // const task = this.tasksQuery.getEntity(params.id);
        console.log(`looking for a task ${params.id} in store... full count: ${this.tasksQuery.getCount()}`);
        if (params.id != null && !task) {
          // task not found
          this.router.navigate(['/404']);
        }

        this.initForm(task);
      }
    );

    this.projects$ = this.projectsService.getProjectsByOwnerId(this.authService.getCurrentUserUid(), 'isFavorite', Order.DESC);
  }

  private clearState() {
    this.tasksStore.setActive(null);
    this.initForm(null);
  }

  private initForm(task: Task) {
    let description = '';
    let project = null;
    let workDate = null;
    let workHours = null;
    const breaks = new FormArray([]);
    let id = this.tasksService.generateId();
    let ownerId = this.authService.getCurrentUserUid();

    this.editMode = (task != null);

    if (this.editMode) {
      let taskBreaks: TimeRange[];
      ({id, ownerId, description, project, workDate, workHours, breaks: taskBreaks} = task);
      if (taskBreaks) {
        for (let taskBreak of taskBreaks) {
          breaks.push(new FormControl(taskBreak, Validators.required));
        }
      }
    } 

    this.taskForm = new FormGroup({
      id: new FormControl(id),
      ownerId: new FormControl(ownerId),
      description: new FormControl(description),
      project: new FormControl(project),
      workDate: new FormControl(workDate, Validators.required),
      workHours: new FormControl(workHours, Validators.required),
      breaks
    }, { validators: timeRangesValidator });
  }


  formatTaskLength() {
    if (this.taskForm.value.workHours) {
      let taskLengthInMillis = getTimeRangeLength(this.taskForm.value.workHours);
      if (this.taskForm.value.breaks) {
        for (let taskBreak of this.taskForm.value.breaks) {
          if (taskBreak) {
            taskLengthInMillis -= getTimeRangeLength(taskBreak);
          }
        }
      }
      return formatLength(taskLengthInMillis);
    }
    return '';
  }

  formatBreakLength(index: number) {
    if (this.taskForm.value.breaks && this.taskForm.value.breaks[index]) {
      return formatBreakLength(this.taskForm.value.breaks[index]);
    }
    return '';
  }

  getToday() {
    return this.calendar.getToday();
  }

  onAddBreak() {
    (this.taskForm.get('breaks') as FormArray).push(
      new FormControl(null, Validators.required)
    );
  }

  getBreakControls() {
    return (this.taskForm.get('breaks') as FormArray).controls;
  }

  onRemoveBreak(i: number) {
    (this.taskForm.get('breaks') as FormArray).removeAt(i);
  }

  onSubmit() {
    if (this.editMode) {
      this.tasksService.updateTask(this.taskForm.value);
    } else {
      this.tasksService.addTask(this.taskForm.value);
    }

    this.clearState();

    this.router.navigate(['tasks']);
  }

  onClearForm() {
    if (this.editMode) {
      this.clearState();
      this.router.navigate(['tasks']);
    } else {
      this.clearState();
    }
  }

  ngOnDestroy(): void {
    this.tasksStore.setActive(null);
  }
}
