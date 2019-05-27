import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { TasksComponent } from './tasks.component';


const routes: Route[] = [
  { path: 'tasks', component: TasksComponent, children: [
    { path: '', component: EditTaskComponent }, // new task
    { path: 'edit/:id', component: EditTaskComponent }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}