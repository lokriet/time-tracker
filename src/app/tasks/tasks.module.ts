import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TimeComponent } from './edit-task/time/time.component';
import { SharedModule } from '../shared/shared.module';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { TimeRangeComponent } from './edit-task/time-range/time-range.component';
import { TaskRowComponent } from './tasks-list/task-row/task-row.component';

@NgModule({
  declarations: [
    EditTaskComponent,
    TasksListComponent, 
    TimeComponent, 
    TimeRangeComponent, 
    TaskRowComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  exports: [
    EditTaskComponent,
    TasksListComponent
  ]
})
export class TasksModule { }
