import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TimeComponent } from './edit-task/time/time.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { TimeRangeComponent } from './edit-task/time-range/time-range.component';
import { TaskRowComponent } from './tasks-list/task-row/task-row.component';
import { TasksComponent } from './tasks.component';
import { TasksRoutingModule } from './tasks-routing.module';

@NgModule({
  declarations: [
    EditTaskComponent,
    TasksListComponent, 
    TimeComponent, 
    TimeRangeComponent, 
    TaskRowComponent,
    TasksComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    NgSelectModule
  ],
  exports: [
    EditTaskComponent,
    TasksListComponent
  ]
})
export class TasksModule { }
