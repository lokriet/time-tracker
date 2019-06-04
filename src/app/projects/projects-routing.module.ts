import { Route, RouterModule } from "@angular/router";
import { AuthGuard } from '../auth/auth.guard';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { NgModule } from '@angular/core';
import { ProjectsComponent } from './projects.component';

const routes: Route[] = [
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],  children: [
    { path: '', component: EditProjectComponent }, // new project
    { path: 'edit/:id', component: EditProjectComponent }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}