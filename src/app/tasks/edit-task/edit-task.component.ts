import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt, faMugHot, faAngleDoubleRight, faCheck, faBug } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faAngry } from '@fortawesome/free-regular-svg-icons';

import { TasksService } from '../../shared/store/tasks.service';
import { TimeRange } from 'src/app/shared/model/time-range.model';
import { TasksQuery } from 'src/app/shared/store/tasks.query';
import { TasksStore } from 'src/app/shared/store/tasks.store';
import { Task } from 'src/app/shared/model/task.model';
import { formatBreakLength, getLength, formatLength } from 'src/app/shared/model/time-formatter.service';
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

  taskForm: FormGroup;

  editMode: boolean = false;

  errorMessages: string[] = [];

  constructor(private calendar: NgbCalendar, 
              private tasksService: TasksService,
              private tasksQuery: TasksQuery,
              private tasksStore: TasksStore,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.tasksStore.setActive(params['id']);
        const task = this.tasksQuery.getActive();
        if (params['id'] != null && !task) {
          //task not found
          this.router.navigate(['/404']);
        }
        
        this.initForm(task);
      }
    );
  }

  private clearState() {
    this.tasksStore.setActive(null);
    this.initForm(null);
  }

  private initForm(task: Task) {
    let taskName = '';
    let workDate = null;
    let workHours = null;
    let breaks = new FormArray([]);
    let id = this.tasksService.generateId();

    this.editMode = (task != null);

    if (this.editMode) {
      let taskBreaks: TimeRange[];
      ({id, taskName, workDate, workHours, breaks: taskBreaks} = task);
      if (taskBreaks) {
        for (let taskBreak of taskBreaks) {
          breaks.push(new FormControl(taskBreak, Validators.required));
        }
      }
    } 

    this.taskForm = new FormGroup({
      'id': new FormControl(id),
      'taskName': new FormControl(taskName, Validators.required),
      'workDate': new FormControl(workDate, Validators.required),
      'workHours': new FormControl(workHours, Validators.required),
      'breaks': breaks
    }, { validators: timeRangesValidator });
  }


  formatTaskLength() {
    if (this.taskForm.value.workHours) {
      let taskLengthInMillis = getLength(this.taskForm.value.workHours);
      if (this.taskForm.value.breaks) {
        for (let taskBreak of this.taskForm.value.breaks) {
          if (taskBreak) {
            taskLengthInMillis -= getLength(taskBreak);
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
    (<FormArray>this.taskForm.get('breaks')).push(
      new FormControl(null, Validators.required)
    );
  }

  getBreakControls() {
    return (<FormArray>this.taskForm.get('breaks')).controls;
  }

  onRemoveBreak(i: number) {
    (<FormArray>this.taskForm.get('breaks')).removeAt(i);
  }

  onSubmit() {
    if (this.editMode) {
      this.tasksStore.updateActive(activeTask => {
        return {
          ...this.taskForm.value
        };
      });
    } else {
      this.tasksService.addTask(this.taskForm.value);
    }

    this.clearState();
  
    this.router.navigate(['tasks']);
  }

  ngOnDestroy(): void {
    this.tasksStore.setActive(null);
  }
}
