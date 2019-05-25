import { Component, OnInit } from '@angular/core';
import { faCalendarAlt, faMugHot, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { TasksService } from '../tasks.service';

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

  constructor(private calendar: NgbCalendar, private tasksService: TasksService) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    let taskName = '';
    let workDate = null;
    let workHours = null;
    let breaks = new FormArray([]);

    this.taskForm = new FormGroup({
      'taskName': new FormControl(taskName, Validators.required),
      'workDate': new FormControl(workDate, Validators.required),
      'workHours': new FormControl(workHours, Validators.required),
      'breaks': breaks
    });
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
    this.tasksService.addTask(this.taskForm.value);
    this.initForm();
  }
}
