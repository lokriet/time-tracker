import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { ReportsComponent } from './reports/reports.component';
import { TasksResolverService } from './tasks/tasks-resolver.service';

const routes: Routes = [
  // { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'reports', resolve: { loaded : TasksResolverService }, canActivate: [ AuthGuard ], component: ReportsComponent },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then(mod => mod.TasksModule),
  },
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects.module').then(mod => mod.ProjectsModule),
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
