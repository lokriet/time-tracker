import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  faPause,
  faPlay,
  faStop,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/can-deactivate.component';

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
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent extends ComponentCanDeactivate implements OnInit, OnDestroy {
  faCalendar = faCalendarAlt;
  faCoffee = faMugHot;
  faRightArrow = faAngleDoubleRight;
  faDelete = faTrashAlt;
  faCheck = faCheck;
  faBug = faAngry;
  faReload = faSyncAlt;
  faEmptyHeart = faHeart;
  faFullHeart = faFullHeart;
  faPlay = faPlay;
  faPause = faPause;
  faStop = faStop;

  taskForm: FormGroup;
  editMode = false;

  // @ViewChild('projectDropdown', { static: true }) projectDropdown: ElementRef;
  // projectsDropdownOpen = false;

  tickingMode = false;
  isPaused = false;
  tickingBreakIndex: number = null;
  taskTickerId: any = null;

  errorMessages: string[] = [];

  projects$: Observable<Project[]>;

  constructor(private tasksService: TasksService,
              private tasksQuery: TasksQuery,
              private tasksStore: TasksStore,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private projectsService: ProjectsService) {
    super();
  }

  canDeactivate(): boolean {
    return (this.editMode || !this.tickingMode);
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.tasksStore.setActive(params.id);
        const task = this.tasksQuery.getActive();
        if (params.id != null && !task) {
          this.router.navigate(['/404']);
        }

        this.initForm(task);
      }
    );

    this.projects$ = this.projectsService.getProjectsByOwnerId(this.authService.getCurrentUserUid(), 'isFavorite', Order.DESC);
  }


  clearState() {
    this.onStopTickingTask();
    this.tasksStore.setActive(null);
    this.initForm(null);
  }

  initForm(task: Task) {
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
        for (const taskBreak of taskBreaks) {
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

  // onProjectSelected(project: Project) {
  //   this.taskForm.get('project').setValue(project);
  //   this.projectsDropdownOpen = false;
  // }

  // onProjectInputClicked() {
  //   this.projectsDropdownOpen = !this.projectsDropdownOpen;
  // }

  formatTaskLength() {
    if (this.taskForm.value.workHours) {
      let taskLengthInMillis = getTimeRangeLength(this.taskForm.value.workHours);
      if (this.taskForm.value.breaks) {
        for (const taskBreak of this.taskForm.value.breaks) {
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

    if (i < this.tickingBreakIndex) {
      this.tickingBreakIndex--;
    } else if (i === this.tickingBreakIndex) {
      this.onPlayTickingTask(); // 'stop ticking break'
    }
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
    const needToNavigateAway = this.editMode;

    this.clearState();

    if (needToNavigateAway) {
      this.router.navigate(['tasks']);
    }
  }

  onPlayTickingTask() {
    if (!this.tickingMode) {
      // start ticking
      this.tickingMode = true;
      (this.taskForm.get('breaks') as FormArray).clear();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.taskForm.get('workDate').setValue(today);

      const startTime = new Date();
      startTime.setSeconds(startTime.getSeconds(), 0);
      const endTime = new Date(startTime.getTime() + 1000);
      this.taskForm.get('workHours').setValue(TimeRange.fromDates(startTime, endTime));

      this.taskTickerId = setInterval(() => {
        this.processTick();
      }, 1000);
    } else {
      // resume after break
      this.isPaused = false;
      this.tickingBreakIndex = null;
    }
  }

  processTick() {
    const startTime = (this.taskForm.get('workHours').value as TimeRange).startTime.date;
    let endTime = new Date();
    endTime.setSeconds(endTime.getSeconds(), 0);
    endTime = new Date(endTime.getTime() + 1000);
    this.taskForm.get('workHours').setValue(TimeRange.fromDates(startTime, endTime));

    if (this.isPaused) {
      const tickingBreakControl = (this.taskForm.get('breaks') as FormArray).controls[this.tickingBreakIndex];
      const startBreakTime = (tickingBreakControl.value as TimeRange).startTime.date;
      tickingBreakControl.setValue(TimeRange.fromDates(startBreakTime, endTime));
    }
  }

  onPauseTickingTask() {
    const startBreakTime = new Date();
    startBreakTime.setSeconds(startBreakTime.getSeconds(), 0);
    const endBreakTime = new Date(startBreakTime.getTime());

    (this.taskForm.get('breaks') as FormArray).push(
      new FormControl(TimeRange.fromDates(startBreakTime, endBreakTime), Validators.required)
    );

    this.isPaused = true;
    this.tickingBreakIndex = (this.taskForm.get('breaks') as FormArray).length - 1;
  }

  onStopTickingTask() {
    this.tickingMode = false;
    this.isPaused = false;
    this.tickingBreakIndex = null;
    clearInterval(this.taskTickerId);
  }

  ngOnDestroy(): void {
    this.tasksStore.setActive(null);
    clearInterval(this.taskTickerId);
  }
}
