import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt, faMugHot, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import { TasksService } from '../tasks.service';
import { TimeRange } from 'src/app/shared/time-range.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  faCalendar = faCalendarAlt; 
  faCoffee = faMugHot;
  faRightArrow = faAngleDoubleRight;
  faDelete = faTrashAlt;

  taskForm: FormGroup;

  editMode: boolean = false;
  taskId: string;

  constructor(private calendar: NgbCalendar, 
              private tasksService: TasksService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  private initForm() {
    let taskName = '';
    let workDate = null;
    let workHours = null;
    let breaks = new FormArray([]);
    let id = this.tasksService.generateId();

    if (this.editMode) {
      const task = this.tasksService.getTaskById(this.taskId);
      if (!task) {
        //todo
        console.log('no task with this id');
        this.router.navigate(['/']);
      }
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
    });
  }

  private clearState() {
    this.editMode = false;
    this.taskId = null;
    this.taskForm.reset();
  }

  getToday() {
    return this.calendar.getToday();
  }

  onAddBreak() {
    (<FormArray>this.taskForm.get('breaks')).push(
      new FormControl(null, Validators.required)
    )
  }

  getBreakControls() {
    return (<FormArray>this.taskForm.get('breaks')).controls;
  }

  onRemoveBreak(i: number) {
    (<FormArray>this.taskForm.get('breaks')).removeAt(i);
  }

  onSubmit() {
    console.log(this.taskForm.value);
    if (this.editMode) {
      this.tasksService.updateTask(this.taskForm.value);
    } else {
      this.tasksService.addTask(this.taskForm.value);
    }
    this.clearState();
    this.router.navigate(['tasks']);
  }
}
