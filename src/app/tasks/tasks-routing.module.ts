import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { CanDeactivateGuard } from '../can-deactivate.guard';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { TasksResolverService } from './tasks-resolver.service';
import { TasksComponent } from './tasks.component';


const routes: Route[] = [
  { path: 'tasks', component: TasksComponent,
              canActivate: [AuthGuard],
              canActivateChild: [AuthGuard],
              resolve: { loaded : TasksResolverService },

              children: [
    { path: '', resolve: { loaded : TasksResolverService }, component: EditTaskComponent, canDeactivate: [CanDeactivateGuard]}, // new task
    { path: 'edit/:id', resolve: { loaded : TasksResolverService }, component: EditTaskComponent}
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
