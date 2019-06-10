import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectsResolverService } from './projects-resolver.service';
import { ProjectsComponent } from './projects.component';

const routes: Route[] = [
  { path: 'projects', component: ProjectsComponent,
              canActivate: [AuthGuard],
              canActivateChild: [AuthGuard],
              resolve: { loaded : ProjectsResolverService },

              children: [
    { path: '', resolve: { loaded : ProjectsResolverService }, component: EditProjectComponent }, // new project
    { path: 'edit/:id', resolve: { loaded : ProjectsResolverService }, component: EditProjectComponent }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}