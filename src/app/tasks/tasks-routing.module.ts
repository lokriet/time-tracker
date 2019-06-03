import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { TasksComponent } from './tasks.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Route[] = [
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],  children: [
    { path: '', component: EditTaskComponent }, // new task
    { path: 'edit/:id', component: EditTaskComponent }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}