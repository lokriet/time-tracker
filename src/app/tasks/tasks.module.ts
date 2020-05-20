import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';

import { EditTaskComponent } from './edit-task/edit-task.component';
import { TimeRangeComponent } from './edit-task/time-range/time-range.component';
import { TimeComponent } from './edit-task/time/time.component';
import { TaskRowComponent } from './tasks-list/task-row/task-row.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
    FontAwesomeModule,
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
